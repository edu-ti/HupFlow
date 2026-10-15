"use client";

import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import {
  Loader2,
  Share2,
  CheckCircle2,
  ExternalLink,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { toCanvas } from "html-to-image";
import { SIZE } from "@/lib/page-size";
import { useFieldArrayValues } from "@/lib/hooks/use-field-array-values";
import {
  canvasToPdf,
  preparePrintClone,
  HtmlToPdfOptions,
} from "@/lib/hooks/use-component-printer";
import { uploadToPostizAction } from "@/app/actions";

interface PostizExportDialogProps {
  children?: React.ReactNode;
}

export function PostizExportDialog({ children }: PostizExportDialogProps) {
  const [open, setOpen] = useState(false);
  const [apiUrl, setApiUrl] = useState("http://localhost:3000");
  const [webUrl, setWebUrl] = useState("http://localhost:4200");
  const [token, setToken] = useState("");
  const [format, setFormat] = useState<"pdf" | "png">("pdf");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [uploadedMedia, setUploadedMedia] = useState<{
    id: string;
    name: string;
    path: string;
    postizWebUrl: string;
  } | null>(null);

  const { toast } = useToast();
  const { watch } = useFormContext();
  const { numPages } = useFieldArrayValues("slides");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedApiUrl = localStorage.getItem("hupflow_postiz_api_url");
      const savedWebUrl = localStorage.getItem("hupflow_postiz_web_url");
      const savedToken = localStorage.getItem("hupflow_postiz_token");

      if (savedApiUrl) setApiUrl(savedApiUrl);
      if (savedWebUrl) setWebUrl(savedWebUrl);
      if (savedToken) setToken(savedToken);
    }
  }, [open]);

  const handleExport = async () => {
    if (!token.trim()) {
      toast({
        title: "Token Obrigatório",
        description: "Informe o token de autenticação do Postiz para continuar.",
        variant: "destructive",
      });
      return;
    }

    // Persistir configurações para futuras exportações
    localStorage.setItem("hupflow_postiz_api_url", apiUrl.trim());
    localStorage.setItem("hupflow_postiz_web_url", webUrl.trim());
    localStorage.setItem("hupflow_postiz_token", token.trim());

    setIsLoading(true);
    setStatusMessage("Preparando e renderizando os slides...");

    try {
      const element = document.getElementById("element-to-download-as-pdf");
      if (!element) {
        throw new Error("Elemento dos slides não encontrado no editor.");
      }

      // Preparar clone sem botões e seletores da interface
      const clone = preparePrintClone(element);
      const hiddenContainer = document.createElement("div");
      hiddenContainer.style.position = "fixed";
      hiddenContainer.style.left = "-9999px";
      hiddenContainer.style.top = "0";
      hiddenContainer.style.width = `${SIZE.width}px`;
      hiddenContainer.style.zIndex = "-1000";
      document.body.appendChild(hiddenContainer);
      hiddenContainer.appendChild(clone);

      const SCALE = 1.8;
      const canvas = await toCanvas(clone, {
        height: SIZE.height * numPages,
        width: SIZE.width,
        canvasHeight: SIZE.height * numPages * SCALE,
        canvasWidth: SIZE.width * SCALE,
      });

      document.body.removeChild(hiddenContainer);

      if (!canvas) {
        throw new Error("Falha ao gerar o canvas dos slides.");
      }

      const filenameBase = (watch("filename") || "carrossel").replace(/\.[^/.]+$/, "");
      let uploadFile: File;

      if (format === "pdf") {
        setStatusMessage("Gerando documento PDF de alta fidelidade...");
        const options: HtmlToPdfOptions = {
          margin: [0, 0, 0, 0],
          filename: `${filenameBase}.pdf`,
          image: { type: "webp", quality: 0.98 },
          htmlToImage: {
            height: SIZE.height * numPages,
            width: SIZE.width,
            canvasHeight: SIZE.height * numPages * SCALE,
            canvasWidth: SIZE.width * SCALE,
          },
          jsPDF: { unit: "px", format: [SIZE.width, SIZE.height] },
        };

        const pdf = canvasToPdf(canvas, options);
        const pdfBlob = pdf.output("blob") as Blob;
        uploadFile = new File([pdfBlob], `${filenameBase}.pdf`, {
          type: "application/pdf",
        });
      } else {
        setStatusMessage("Convertendo slides para imagem PNG...");
        const pngBlob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob((b) => resolve(b), "image/png", 0.95);
        });

        if (!pngBlob) {
          throw new Error("Falha ao converter o carrossel em imagem PNG.");
        }

        uploadFile = new File([pngBlob], `${filenameBase}.png`, {
          type: "image/png",
        });
      }

      setStatusMessage("Enviando arquivo diretamente para o Postiz...");
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("token", token.trim());
      formData.append("apiUrl", apiUrl.trim());
      formData.append("webUrl", webUrl.trim());

      const result = await uploadToPostizAction(formData);

      if (result.success) {
        setUploadedMedia({
          ...result.media,
          postizWebUrl: result.postizWebUrl,
        });

        toast({
          title: "Exportado com Sucesso! 🎉",
          description: `O carrossel foi adicionado à biblioteca de mídia do Postiz (${result.media.name}).`,
        });
      } else {
        toast({
          title: "Falha na Exportação",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro durante a exportação para o Postiz:", error);
      toast({
        title: "Erro Inesperado",
        description:
          error instanceof Error ? error.message : "Falha ao processar carrossel.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setStatusMessage("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" />
            Enviar para o Postiz
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" />
            Enviar Carrossel para o Postiz
          </DialogTitle>
          <DialogDescription>
            Exporte o carrossel renderizado diretamente para a biblioteca de mídia da sua organização no Postiz.
          </DialogDescription>
        </DialogHeader>

        {uploadedMedia ? (
          <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div>
              <h4 className="font-semibold text-lg">Mídia Salva com Sucesso!</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Arquivo: <span className="font-medium text-foreground">{uploadedMedia.name}</span>
              </p>
            </div>
            <div className="pt-2 flex gap-3">
              <Button
                variant="default"
                className="gap-2"
                onClick={() => {
                  window.open(uploadedMedia.postizWebUrl, "_blank");
                }}
              >
                <ExternalLink className="h-4 w-4" />
                Criar Post no Postiz
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setUploadedMedia(null);
                }}
              >
                Enviar Outro
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Formato de Exportação</Label>
              <RadioGroup
                value={format}
                onValueChange={(val) => setFormat(val as "pdf" | "png")}
                className="grid grid-cols-2 gap-3"
              >
                <div
                  className={`flex items-center space-x-2 border rounded-lg p-3 cursor-pointer transition-colors ${
                    format === "pdf"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/50"
                  }`}
                  onClick={() => setFormat("pdf")}
                >
                  <RadioGroupItem value="pdf" id="format-pdf" />
                  <Label htmlFor="format-pdf" className="cursor-pointer flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-500" />
                    <span>PDF (LinkedIn)</span>
                  </Label>
                </div>

                <div
                  className={`flex items-center space-x-2 border rounded-lg p-3 cursor-pointer transition-colors ${
                    format === "png"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/50"
                  }`}
                  onClick={() => setFormat("png")}
                >
                  <RadioGroupItem value="png" id="format-png" />
                  <Label htmlFor="format-png" className="cursor-pointer flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-emerald-500" />
                    <span>Imagem PNG</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="postiz-token">Token de Autenticação (JWT)</Label>
              <Input
                id="postiz-token"
                type="password"
                placeholder="Cole o token auth do Postiz..."
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Disponível nas configurações ou cookies de sessão da sua conta no Postiz.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="postiz-api" className="text-xs">URL da API (Backend)</Label>
                <Input
                  id="postiz-api"
                  className="h-8 text-xs"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="postiz-web" className="text-xs">URL do Postiz Web</Label>
                <Input
                  id="postiz-web"
                  className="h-8 text-xs"
                  value={webUrl}
                  onChange={(e) => setWebUrl(e.target.value)}
                />
              </div>
            </div>

            {statusMessage && (
              <div className="p-3 bg-muted rounded-md flex items-center gap-2 text-xs text-muted-foreground animate-pulse">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span>{statusMessage}</span>
              </div>
            )}
          </div>
        )}

        {!uploadedMedia && (
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleExport}
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4" />
                  Confirmar e Enviar
                </>
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
