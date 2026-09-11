// Pagina administrativa para validar e enviar imagens com upload multipart.
import { useMutation } from '@tanstack/react-query';
import { AlertCircle, CheckCircle2, FileImage, ImageUp, Upload } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { ImagemEnviada } from '@shape/shared';
import {
  IMAGEM_EXTENSOES_PERMITIDAS,
  IMAGEM_MIME_TYPES_PERMITIDOS,
  IMAGEM_TAMANHO_MAXIMO_BYTES,
} from '@shape/shared';
import { PageHeader } from '@/components/ui/page-header';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/hooks/use-auth';
import { apiRequest } from '@/lib/api';
import { cn } from '@/lib/cn';

function formatarBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function extensaoArquivo(fileName: string) {
  const extension = fileName.includes('.') ? `.${fileName.split('.').pop() ?? ''}` : '';
  return extension.toLowerCase();
}

function validarArquivo(file: File) {
  const extension = extensaoArquivo(file.name);
  const hasAllowedExtension = (IMAGEM_EXTENSOES_PERMITIDAS as readonly string[]).includes(extension);
  const hasAllowedMimeType = (IMAGEM_MIME_TYPES_PERMITIDOS as readonly string[]).includes(file.type);

  if (!hasAllowedExtension || !hasAllowedMimeType) {
    return 'Envie uma imagem PNG, JPG, JPEG ou WEBP.';
  }

  if (file.size > IMAGEM_TAMANHO_MAXIMO_BYTES) {
    return `A imagem deve ter no maximo ${formatarBytes(IMAGEM_TAMANHO_MAXIMO_BYTES)}.`;
  }

  return null;
}

export function ImagensPage() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [clientError, setClientError] = useState('');
  const [uploadedImage, setUploadedImage] = useState<ImagemEnviada | null>(null);
  const previewUrl = useMemo(() => (selectedFile ? URL.createObjectURL(selectedFile) : ''), [selectedFile]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const mutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('imagem', file);
      return apiRequest<ImagemEnviada>('/imagens', { method: 'POST', body: formData }, token ?? undefined);
    },
    onSuccess: (image) => {
      setUploadedImage(image);
      toast({ variant: 'success', title: 'Imagem enviada', message: 'Upload validado e salvo com sucesso.' });
    },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Imagens"
        title="Upload validado"
        description="Envie arquivos visuais da academia com controle de formato, tamanho e nome unico."
        action={<div className="inline-flex items-center gap-2 rounded-full bg-teal px-4 py-2 text-sm font-semibold text-white"><ImageUp size={16} /> Multer ativo</div>}
      />

      <form
        className="grid gap-6 rounded-[28px] border border-white/70 bg-white p-6 shadow-panel xl:grid-cols-[0.9fr_1.1fr]"
        onSubmit={(event) => {
          event.preventDefault();

          if (!selectedFile) {
            setClientError('Selecione uma imagem antes de enviar.');
            return;
          }

          const validationError = validarArquivo(selectedFile);
          if (validationError) {
            setClientError(validationError);
            return;
          }

          setClientError('');
          mutation.mutate(selectedFile, {
            onError: (error) => {
              toast({
                variant: 'error',
                title: 'Upload recusado',
                message: error instanceof Error ? error.message : 'Nao foi possivel enviar a imagem.',
              });
            },
          });
        }}
      >
        <div className="space-y-4">
          <label
            className={cn(
              'flex min-h-[260px] cursor-pointer flex-col items-center justify-center rounded-[28px] border-2 border-dashed px-6 py-8 text-center transition',
              selectedFile ? 'border-teal bg-teal/5' : 'border-slate-200 bg-slate-50 hover:border-teal/60',
            )}
          >
            <input
              type="file"
              accept={IMAGEM_MIME_TYPES_PERMITIDOS.join(',')}
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null;
                setUploadedImage(null);
                setSelectedFile(file);
                setClientError(file ? validarArquivo(file) ?? '' : '');
              }}
            />
            <span className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white text-teal shadow-sm">
              <FileImage size={28} />
            </span>
            <span className="mt-5 font-display text-2xl font-semibold text-slateblue">
              {selectedFile ? selectedFile.name : 'Selecionar imagem'}
            </span>
            <span className="mt-2 text-sm text-slate-500">
              PNG, JPG, JPEG ou WEBP ate {formatarBytes(IMAGEM_TAMANHO_MAXIMO_BYTES)}
            </span>
          </label>

          {clientError ? (
            <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
              <AlertCircle className="mt-0.5 shrink-0" size={18} />
              <span>{clientError}</span>
            </div>
          ) : null}

          <button
            type="submit"
            disabled={mutation.isPending || Boolean(clientError)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slateblue px-5 py-3 text-sm font-semibold text-white transition hover:bg-slateblue/90 disabled:cursor-not-allowed disabled:opacity-55"
          >
            <Upload size={18} />
            {mutation.isPending ? 'Enviando...' : 'Enviar imagem'}
          </button>
        </div>

        <div className="rounded-[28px] bg-hero-mesh p-5">
          <div className="grid h-full gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="overflow-hidden rounded-[24px] border border-white/70 bg-white shadow-sm">
              {previewUrl ? (
                <img src={previewUrl} alt="Previa da imagem selecionada" className="h-full min-h-[260px] w-full object-cover" />
              ) : (
                <div className="flex h-full min-h-[260px] items-center justify-center px-6 text-center text-sm text-slate-500">
                  A previa aparece depois da selecao.
                </div>
              )}
            </div>

            <div className="rounded-[24px] border border-white/70 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <CheckCircle2 size={20} />
                </span>
                <div>
                  <h3 className="font-display text-xl font-semibold text-slateblue">Resultado do upload</h3>
                  <p className="text-sm text-slate-500">Metadados retornados pela API.</p>
                </div>
              </div>

              <dl className="mt-5 space-y-3 text-sm">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Arquivo salvo</dt>
                  <dd className="mt-1 break-all font-medium text-slateblue">{uploadedImage?.fileName ?? '-'}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Tipo</dt>
                  <dd className="mt-1 font-medium text-slateblue">{uploadedImage?.mimeType ?? selectedFile?.type ?? '-'}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Tamanho</dt>
                  <dd className="mt-1 font-medium text-slateblue">{uploadedImage ? formatarBytes(uploadedImage.size) : selectedFile ? formatarBytes(selectedFile.size) : '-'}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">URL publica</dt>
                  <dd className="mt-1 break-all font-medium text-teal">{uploadedImage?.url ?? '-'}</dd>
                </div>
              </dl>

              {uploadedImage ? (
                <a href={uploadedImage.url} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-teal/20 px-4 py-3 text-sm font-semibold text-teal">
                  Abrir imagem salva
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
