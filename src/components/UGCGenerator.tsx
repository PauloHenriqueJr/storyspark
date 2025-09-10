import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { ugcService, UGCPayload } from "@/services/ugcService";

const ugcSchema = z.object({
  copy: z.string().min(1, "Informe o copy"),
  dialogue: z.string().min(1, "Informe o diálogo"),
  productImageUrl: z.string().url("URL inválida").optional().or(z.literal("")),
});

type UGCFormValues = z.infer<typeof ugcSchema>;

export default function UGCGenerator() {
  const [videoUrls, setVideoUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UGCFormValues>({
    resolver: zodResolver(ugcSchema),
    defaultValues: {
      copy: "",
      dialogue: "",
      productImageUrl: "",
    },
  });

  const onSubmit = async (values: UGCFormValues) => {
    setIsSubmitting(true);
    setVideoUrls([]);
    const payload: UGCPayload = {
      copy: values.copy,
      dialogue: values.dialogue,
      productImageUrl: values.productImageUrl || undefined,
    };

    try {
      const urls = await ugcService.generateVideos(payload);
      setVideoUrls(urls);
    } catch (err) {
      console.error("Erro ao gerar vídeos", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="copy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Copy</FormLabel>
                <FormControl>
                  <Textarea placeholder="Texto promocional" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dialogue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Diálogo</FormLabel>
                <FormControl>
                  <Textarea placeholder="Roteiro do vídeo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="productImageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL da imagem do produto (opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="https://..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Gerando..." : "Gerar vídeos"}
          </Button>
        </form>
      </Form>

      {videoUrls.length > 0 && (
        <div className="space-y-2">
          {videoUrls.map((url, idx) => (
            <div key={idx}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                {url}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
