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

