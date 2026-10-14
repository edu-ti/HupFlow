"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormContext } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Sparkles } from "lucide-react";
import { generateCarouselSlides } from "@/lib/langchain";
import { DocumentFormReturn } from "@/lib/document-form-types";
import { useState } from "react";
import { LoadingSpinner } from "@/components/loading-spinner";
import { useKeys } from "@/lib/hooks/use-keys";
import { useKeysContext } from "@/lib/providers/keys-context";
import { useStatusContext } from "@/lib/providers/editor-status-context";
import { generateCarouselSlidesAction } from "@/app/actions";

const FormSchema = z.object({
  prompt: z.string().min(2, {
    message: "Prompt must be at least 2 characters.",
  }),
});

export function AIInputForm() {
  const { apiKey } = useKeysContext();
  const { setValue }: DocumentFormReturn = useFormContext(); // retrieve those props
  const [isLoading, setIsLoading] = useState(false);
  const { status, setStatus } = useStatusContext();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      prompt: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    setStatus("loading");

    const result = await generateCarouselSlidesAction(
      `A carousel with about "${data.prompt}"`
    );

    // const generatedSlides = await generateCarouselSlides(
    //   `A carousel with about "${data.prompt}"`,
    //   apiKey
    // );
    if (result.success) {
      setValue("slides", result.slides);
      toast({
        title: "New carousel generated",
        description: "The slides have been loaded into the editor.",
      });
    } else if (result.reason === "rate_limit") {
      const minutesRemaining = result.reset
        ? Math.max(1, Math.ceil((result.reset - Date.now()) / 60000))
        : 15;
      toast({
        variant: "destructive",
        title: "Limite de requisições atingido",
        description: `Você atingiu o limite de requisições. Tente novamente em aproximadamente ${minutesRemaining} minuto(s).`,
      });
    } else if (result.reason === "missing_key") {
      toast({
        variant: "destructive",
        title: "Chave OpenAI não configurada",
        description: result.message,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Failed to generate carousel",
        description: result.message || "An unexpected error occurred.",
      });
    }
    setStatus("ready");
    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-lg w-full m-auto"
      >
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel></FormLabel>
              <FormControl>
                <div className="flex flex-row gap-2 items-center w-full">
                  <Input
                    placeholder="What's your carousel about"
                    {...field}
                    className="flex-1"
                  />
                  <Button type="submit" className="flex-0">
                    {isLoading ? (
                      <LoadingSpinner />
                    ) : (
                      <span className="flex flex-row gap-1.5">
                        {" "}
                        <Sparkles className="w-4 h-4" /> Generate{" "}
                      </span>
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
