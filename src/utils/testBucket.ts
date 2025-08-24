import { supabase } from "@/lib/supabase";

export const testBucket = async () => {
  try {
    // Listar todos os buckets
    const { data: buckets, error: bucketsError } =
      await supabase.storage.listBuckets();

    if (bucketsError) {
      console.error("Erro ao listar buckets:", bucketsError);
      return;
    }

    console.log("Buckets encontrados:", buckets);

    // Verificar se o bucket 'document-uploads' existe
    const documentUploadsBucket = buckets?.find(
      (bucket) => bucket.name === "document-uploads"
    );

    if (documentUploadsBucket) {
      console.log(
        "Bucket 'document-uploads' encontrado:",
        documentUploadsBucket
      );
    } else {
      console.log("Bucket 'document-uploads' não encontrado");
    }

    // Tentar acessar o bucket diretamente
    const { data: bucketData, error: bucketError } =
      await supabase.storage.getBucket("document-uploads");

    if (bucketError) {
      console.error("Erro ao acessar bucket 'document-uploads':", bucketError);
    } else {
      console.log(
        "Bucket 'document-uploads' acessado com sucesso:",
        bucketData
      );
    }
  } catch (error) {
    console.error("Erro ao testar bucket:", error);
  }
};
