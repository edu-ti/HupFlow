"use server";
import { messageRateLimit } from "@/lib/rate-limit";

import { generateCarouselSlides } from "@/lib/langchain";
import { headers } from "next/headers";

export type GeneratedSlides = Awaited<ReturnType<typeof generateCarouselSlides>>;

export type GenerateCarouselSuccess = {
  success: true;
  slides: NonNullable<GeneratedSlides>;
};

export type GenerateCarouselError = {
  success: false;
  reason: "rate_limit" | "missing_key" | "error";
  message: string;
  reset?: number;
  remaining?: number;
};

export type GenerateCarouselResult =
  | GenerateCarouselSuccess
  | GenerateCarouselError;

export async function generateCarouselSlidesAction(
  userPrompt: string
): Promise<GenerateCarouselResult> {
  if (!process.env.OPENAI_API_KEY) {
    return {
      success: false,
      reason: "missing_key",
      message: "Chave da OpenAI (OPENAI_API_KEY) não configurada no servidor.",
    };
  }

  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {  
    const ip = headers().get("x-real-ip") ?? "local";
    const rl = await messageRateLimit.limit(ip);
    
    if (!rl.success) {
      return {
        success: false,
        reason: "rate_limit",
        reset: rl.reset,
        remaining: rl.remaining,
        message: "Limite de requisições excedido. Aguarde antes de tentar novamente.",
      };
    }
  }

  try {
    const generatedSlides = await generateCarouselSlides(
      userPrompt,
      process.env.OPENAI_API_KEY
    );

    if (!generatedSlides) {
      return {
        success: false,
        reason: "error",
        message: "Falha ao gerar os slides do carrossel pela IA.",
      };
    }

    return {
      success: true,
      slides: generatedSlides,
    };
  } catch (error) {
    console.error("Erro na geração do carrossel:", error);
    return {
      success: false,
      reason: "error",
      message:
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao gerar carrossel.",
    };
  }
}

export type UploadToPostizSuccess = {
  success: true;
  media: {
    id: string;
    name: string;
    path: string;
    mimeType?: string;
  };
  postizWebUrl: string;
};

export type UploadToPostizError = {
  success: false;
  reason: "missing_file" | "missing_token" | "auth_error" | "network_error" | "upload_error";
  message: string;
};

export type UploadToPostizResult = UploadToPostizSuccess | UploadToPostizError;

export async function uploadToPostizAction(
  formData: FormData
): Promise<UploadToPostizResult> {
  const file = formData.get("file") as File | Blob | null;
  const token = (formData.get("token") as string | null)?.trim();
  const apiUrl =
    (formData.get("apiUrl") as string | null)?.trim() || "http://localhost:3000";
  const webUrl =
    (formData.get("webUrl") as string | null)?.trim() || "http://localhost:4200";

  if (!file) {
    return {
      success: false,
      reason: "missing_file",
      message: "Nenhum arquivo fornecido para upload.",
    };
  }

  if (!token) {
    return {
      success: false,
      reason: "missing_token",
      message: "Token de autenticação do Postiz não informado.",
    };
  }

  try {
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);

    const cleanApiUrl = apiUrl.replace(/\/+$/, "");
    const response = await fetch(`${cleanApiUrl}/media/upload-simple`, {
      method: "POST",
      headers: {
        auth: token,
      },
      body: uploadFormData,
    });

    if (response.status === 401 || response.status === 403) {
      return {
        success: false,
        reason: "auth_error",
        message:
          "Token do Postiz inválido, expirado ou sem permissão na organização.",
      };
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      return {
        success: false,
        reason: "upload_error",
        message: `Falha no upload para o Postiz (HTTP ${response.status}): ${
          errorText || response.statusText
        }`,
      };
    }

    const data = await response.json();
    const cleanWebUrl = webUrl.replace(/\/+$/, "");

    return {
      success: true,
      media: {
        id: data.id,
        name: data.name,
        path: data.path,
        mimeType: data.mimeType,
      },
      postizWebUrl: cleanWebUrl,
    };
  } catch (error) {
    console.error("Erro na comunicação com a API do Postiz:", error);
    return {
      success: false,
      reason: "network_error",
      message:
        error instanceof Error
          ? `Erro de rede ao conectar com o Postiz (${apiUrl}): ${error.message}`
          : "Erro desconhecido ao conectar com a API do Postiz.",
    };
  }
}

