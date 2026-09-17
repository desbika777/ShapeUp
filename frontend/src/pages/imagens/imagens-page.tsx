import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Activity, AlertCircle, CheckCircle2, ClipboardList, ExternalLink, FileCheck2, FileImage, FileText, Paperclip, ReceiptText, ShieldCheck, Trash2, Upload, Wrench } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useState } from 'react';
import type { AnexoAcademia, CategoriaAnexo } from '@shape/shared';
import {
  CATEGORIAS_ANEXO,
  IMAGEM_EXTENSOES_PERMITIDAS,
  IMAGEM_MIME_TYPES_PERMITIDOS,
  IMAGEM_TAMANHO_MAXIMO_BYTES,
} from '@shape/shared';
import { EmptyState } from '@/components/ui/empty-state';
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

function formatarData(date: string) {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(date));
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
    return 'Envie um anexo PNG, JPG, JPEG, WEBP ou PDF.';
  }

  if (file.size > IMAGEM_TAMANHO_MAXIMO_BYTES) {
    return `O anexo deve ter no maximo ${formatarBytes(IMAGEM_TAMANHO_MAXIMO_BYTES)}.`;
  }

  return null;
}

function ehImagem(attachment: Pick<AnexoAcademia, 'mimeType'>) {
  return attachment.mimeType.startsWith('image/');
}

function ehPdf(attachment: Pick<AnexoAcademia, 'mimeType' | 'extension'>) {
  return attachment.mimeType === 'application/pdf' || attachment.extension === '.pdf';
}

const exemplosAnexos = [
  {
    title: 'Comprovante de matricula',
    description: 'Guarde comprovantes enviados pelo aluno ou registros financeiros internos.',
    tag: 'Financeiro',
    image: '/anexos/comprovante-matricula.svg',
    icon: ReceiptText,
  },
  {
    title: 'Avaliacao fisica',
    description: 'Anexe registros de avaliacoes, medidas e acompanhamento de evolucao.',
    tag: 'Aluno',
    image: '/anexos/avaliacao-fisica.svg',
    icon: Activity,
  },
  {
    title: 'Manutencao de equipamento',
    description: 'Registre fotos de manutencao, vistoria ou troca de pecas dos aparelhos.',
    tag: 'Operacao',
    image: '/anexos/manutencao-equipamentos.svg',
    icon: Wrench,
  },
  {
    title: 'Documento interno',
    description: 'Organize PDFs, contratos, comunicados ou documentos operacionais.',
    tag: 'Gestao',
    image: '/anexos/documento-interno.svg',
    icon: ClipboardList,
  },
];

const categoriaLabels: Record<CategoriaAnexo, string> = {
  COMPROVANTE: 'Comprovante',
  AVALIACAO: 'Avaliacao fisica',
  MANUTENCAO: 'Manutencao',
  DOCUMENTO: 'Documento interno',
  OUTRO: 'Outro registro',
};

const categoriaIcons: Record<CategoriaAnexo, LucideIcon> = {
  COMPROVANTE: ReceiptText,
  AVALIACAO: Activity,
  MANUTENCAO: Wrench,
  DOCUMENTO: ClipboardList,
  OUTRO: Paperclip,
};

export function ImagensPage() {
  const { token } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [category, setCategory] = useState<CategoriaAnexo>('AVALIACAO');
  const [description, setDescription] = useState('');
  const [clientError, setClientError] = useState('');
  const [lastUploaded, setLastUploaded] = useState<AnexoAcademia | null>(null);
  const CategoryIcon = categoriaIcons[category];
  const controlesUpload = [
    { label: 'Formato', value: 'PNG, JPG, JPEG, WEBP ou PDF' },
    { label: 'Limite', value: formatarBytes(IMAGEM_TAMANHO_MAXIMO_BYTES) },
    { label: 'Validacao', value: 'Extensao, tipo e conteudo real' },
    { label: 'Registro', value: 'Arquivo salvo e metadados no banco' },
  ];

  const { data: anexos = [], isLoading: isLoadingAttachments } = useQuery({
    queryKey: ['anexos-academia'],
    queryFn: () => apiRequest<AnexoAcademia[]>('/imagens', { method: 'GET' }, token ?? undefined),
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('imagem', file);
      formData.append('category', category);
      formData.append('description', description.trim());
      return apiRequest<AnexoAcademia>('/imagens', { method: 'POST', body: formData }, token ?? undefined);
    },
    onSuccess: async (attachment) => {
      setLastUploaded(attachment);
      setSelectedFile(null);
      setDescription('');
      await queryClient.invalidateQueries({ queryKey: ['anexos-academia'] });
      toast({ variant: 'success', title: 'Anexo salvo', message: 'Arquivo validado pelo Multer e registrado no backend.' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest<void>(`/imagens/${id}`, { method: 'DELETE' }, token ?? undefined),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['anexos-academia'] });
      toast({ variant: 'success', title: 'Anexo removido', message: 'Registro e arquivo foram removidos do backend.' });
    },
  });

  function selectFile(file: File | null) {
    setLastUploaded(null);
    setSelectedFile(file);
    setClientError(file ? validarArquivo(file) ?? '' : '');
  }

  async function submitUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedFile) {
      setClientError('Selecione um anexo antes de enviar.');
      return;
    }

    const validationError = validarArquivo(selectedFile);
    if (validationError) {
      setClientError(validationError);
      return;
    }

    setClientError('');

    try {
      await uploadMutation.mutateAsync(selectedFile);
    } catch (error) {
      toast({
        variant: 'error',
        title: 'Upload recusado',
        message: error instanceof Error ? error.message : 'Nao foi possivel enviar o anexo.',
      });
    }
  }

  async function removeAttachment(attachment: AnexoAcademia) {
    if (!window.confirm(`Remover o anexo "${attachment.originalName}"?`)) return;

    try {
      await deleteMutation.mutateAsync(attachment.id);
    } catch (error) {
      toast({
        variant: 'error',
        title: 'Falha ao remover',
        message: error instanceof Error ? error.message : 'Nao foi possivel remover o anexo.',
      });
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Anexos"
        title="Anexos da academia"
        description="Envie, valide e consulte imagens e PDFs da operacao da academia."
        action={<div className="inline-flex items-center gap-2 rounded-md border border-teal/20 bg-teal/10 px-4 py-2 text-sm font-semibold text-teal"><ShieldCheck size={16} /> Multer funcional</div>}
      />

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-teal">Uso recomendado</p>
            <h2 className="mt-2 font-display text-xl font-semibold text-slateblue">O que o dono pode anexar</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">Use esta area para centralizar comprovantes, avaliacoes fisicas, manutencoes e documentos internos que ajudam na rotina da academia.</p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-slateblue">
            <Paperclip size={16} />
            Arquivos salvos
          </span>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {exemplosAnexos.map((example) => {
            const Icon = example.icon;
            return (
              <article key={example.title} className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                <img src={example.image} alt={example.title} className="aspect-[16/10] w-full bg-white object-contain p-2" />
                <div className="p-4">
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-teal/10 px-2.5 py-1 text-xs font-semibold text-teal">
                    <Icon size={14} />
                    {example.tag}
                  </span>
                  <h3 className="mt-3 font-display text-base font-semibold text-slateblue">{example.title}</h3>
                  <p className="mt-2 text-sm leading-5 text-slate-500">{example.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <form className="space-y-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6" onSubmit={(event) => void submitUpload(event)}>
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-teal/10 text-teal">
              <Upload size={22} />
            </span>
            <div>
              <h2 className="font-display text-xl font-semibold text-slateblue">Novo anexo operacional</h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">O arquivo e salvo no backend, validado pelo Multer e registrado para aparecer na lista abaixo.</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slateblue">Categoria</span>
              <div className="relative">
                <CategoryIcon className="pointer-events-none absolute left-3 top-3.5 text-slate-400" size={18} />
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value as CategoriaAnexo)}
                  className="h-12 w-full rounded-md border border-slate-200 bg-white px-4 pl-10 text-sm font-semibold text-slateblue outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/15"
                >
                  {CATEGORIAS_ANEXO.map((item) => (
                    <option key={item} value={item}>{categoriaLabels[item]}</option>
                  ))}
                </select>
              </div>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slateblue">Descricao curta</span>
              <input
                value={description}
                onChange={(event) => setDescription(event.target.value.slice(0, 180))}
                placeholder="Ex.: Avaliacao inicial do Joao"
                className="h-12 w-full rounded-md border border-slate-200 bg-white px-4 text-sm text-slateblue outline-none transition placeholder:text-slate-400 focus:border-teal focus:ring-2 focus:ring-teal/15"
              />
            </label>
          </div>

          <label
            className={cn(
              'flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-5 py-7 text-center transition sm:min-h-[250px] sm:px-6 sm:py-8',
              selectedFile ? 'border-teal bg-teal/5' : 'border-slate-200 bg-slate-50 hover:border-teal/60',
            )}
          >
            <input
              type="file"
              accept={IMAGEM_MIME_TYPES_PERMITIDOS.join(',')}
              className="sr-only"
              onChange={(event) => selectFile(event.target.files?.[0] ?? null)}
            />
            <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-white text-teal shadow-sm">
              <FileImage size={28} />
            </span>
            <span className="mt-5 max-w-full break-words font-display text-xl font-semibold text-slateblue">
              {selectedFile ? selectedFile.name : 'Selecionar arquivo'}
            </span>
            <span className="mt-2 text-sm text-slate-500">
              Escolha uma imagem ou PDF de comprovante, avaliacao, manutencao ou documento interno
            </span>
          </label>

          {selectedFile ? (
            <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm">
              <FileCheck2 className="mt-0.5 shrink-0 text-teal" size={18} />
              <div className="min-w-0">
                <p className="font-semibold text-slateblue">Arquivo pronto para envio</p>
                <p className="mt-1 break-all text-slate-500">
                  {selectedFile.type || 'Tipo nao informado'} - {formatarBytes(selectedFile.size)}
                </p>
              </div>
            </div>
          ) : null}

          {clientError ? (
            <div className="flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
              <AlertCircle className="mt-0.5 shrink-0" size={18} />
              <span>{clientError}</span>
            </div>
          ) : null}

          <button
            type="submit"
            disabled={uploadMutation.isPending || Boolean(clientError)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-slateblue px-5 py-3 text-sm font-semibold text-white transition hover:bg-slateblue/90 disabled:cursor-not-allowed disabled:opacity-55"
          >
            <Upload size={18} />
            {uploadMutation.isPending ? 'Enviando...' : 'Salvar anexo no backend'}
          </button>
        </form>

        <aside className="space-y-5">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal/10 text-teal">
                <FileCheck2 size={20} />
              </span>
              <div>
                <h2 className="font-display text-lg font-semibold text-slateblue">Resumo do envio</h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {selectedFile ? 'Arquivo selecionado para ser salvo.' : 'Selecione um arquivo para conferir os dados antes de salvar.'}
                </p>
              </div>
            </div>

            {selectedFile ? (
              <dl className="mt-5 grid gap-4 text-sm">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Arquivo</dt>
                  <dd className="mt-1 break-all font-semibold text-slateblue">{selectedFile.name}</dd>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Categoria</dt>
                    <dd className="mt-1 font-semibold text-slateblue">{categoriaLabels[category]}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Tamanho</dt>
                    <dd className="mt-1 font-semibold text-slateblue">{formatarBytes(selectedFile.size)}</dd>
                  </div>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Tipo</dt>
                  <dd className="mt-1 break-all font-semibold text-slateblue">{selectedFile.type || 'Tipo nao informado'}</dd>
                </div>
              </dl>
            ) : (
              <div className="mt-5 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center">
                <Paperclip className="mx-auto text-slate-400" size={28} />
                <p className="mt-3 text-sm font-semibold text-slateblue">Nenhum arquivo selecionado</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">O resumo aparece aqui antes do envio.</p>
              </div>
            )}
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                <CheckCircle2 size={20} />
              </span>
              <div>
                <h2 className="font-display text-lg font-semibold text-slateblue">Ultimo anexo salvo</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {lastUploaded ? 'Registro confirmado no backend.' : 'Depois do envio, o ultimo anexo salvo aparece aqui.'}
                </p>
              </div>
            </div>

            {lastUploaded ? (
              <dl className="mt-5 grid gap-4 text-sm">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Categoria</dt>
                    <dd className="mt-1 font-medium text-slateblue">{categoriaLabels[lastUploaded.category]}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Tamanho</dt>
                    <dd className="mt-1 font-medium text-slateblue">{formatarBytes(lastUploaded.size)}</dd>
                  </div>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Arquivo</dt>
                  <dd className="mt-1 break-all font-medium text-slateblue">{lastUploaded.originalName}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Link publico</dt>
                  <dd className="mt-1 break-all font-medium text-teal">{lastUploaded.url}</dd>
                </div>
              </dl>
            ) : (
              <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 px-4 py-5 text-sm leading-6 text-slate-500">
                Nenhum anexo foi enviado nesta sessao. Depois do primeiro envio, os dados do arquivo ficam destacados aqui.
              </div>
            )}

            {lastUploaded ? (
              <a href={lastUploaded.url} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-md border border-teal/20 px-4 py-3 text-sm font-semibold text-teal transition hover:bg-teal/5">
                <ExternalLink size={16} />
                Abrir anexo salvo
              </a>
            ) : null}
          </section>

        </aside>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slateblue">
              <ShieldCheck size={20} />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-teal">Validacao</p>
              <h2 className="mt-1 font-display text-lg font-semibold text-slateblue">Controles aplicados no upload</h2>
            </div>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-slate-500">O anexo so entra no historico quando passa pelas validacoes de formato, tamanho e conteudo real.</p>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {controlesUpload.map((rule) => (
            <div key={rule.label} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">{rule.label}</p>
              <p className="mt-1 text-sm font-semibold text-slateblue">{rule.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-teal">Backend</p>
            <h2 className="mt-2 font-display text-xl font-semibold text-slateblue">Anexos salvos</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">Esta lista vem de GET /api/imagens, ou seja, mostra os registros salvos depois do upload.</p>
          </div>
          <span className="inline-flex rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-slateblue">
            {anexos.length} {anexos.length === 1 ? 'registro' : 'registros'}
          </span>
        </div>

        {isLoadingAttachments ? (
          <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm font-semibold text-slate-500">Carregando anexos...</div>
        ) : anexos.length === 0 ? (
          <div className="mt-5">
            <EmptyState title="Nenhum anexo salvo" description="Envie o primeiro comprovante, avaliacao ou documento interno para criar o registro no backend." />
          </div>
        ) : (
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {anexos.map((attachment) => {
              const Icon = categoriaIcons[attachment.category];
              const isImage = ehImagem(attachment);
              const isPdf = ehPdf(attachment);
              return (
                <article key={attachment.id} className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                  <a href={attachment.url} target="_blank" rel="noreferrer" className="block bg-white">
                    {isImage ? (
                      <img src={attachment.url} alt={attachment.originalName} className="aspect-video w-full object-contain p-3" />
                    ) : (
                      <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 bg-slate-100 p-5 text-center">
                        {isPdf ? <FileText size={42} className="text-teal" /> : <FileImage size={42} className="text-teal" />}
                        <span className="text-sm font-semibold text-slateblue">{isPdf ? 'PDF salvo no backend' : 'Arquivo salvo no backend'}</span>
                      </div>
                    )}
                  </a>
                  <div className="space-y-4 p-4">
                    <div>
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-teal/10 px-2.5 py-1 text-xs font-semibold text-teal">
                        <Icon size={14} />
                        {categoriaLabels[attachment.category]}
                      </span>
                      <h3 className="mt-3 break-words font-display text-base font-semibold text-slateblue">{attachment.originalName}</h3>
                      <p className="mt-2 text-sm leading-5 text-slate-500">{attachment.description || 'Sem descricao.'}</p>
                    </div>
                    <dl className="grid gap-3 text-sm sm:grid-cols-2">
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Tamanho</dt>
                        <dd className="mt-1 font-semibold text-slateblue">{formatarBytes(attachment.size)}</dd>
                      </div>
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Enviado</dt>
                        <dd className="mt-1 font-semibold text-slateblue">{formatarData(attachment.createdAt)}</dd>
                      </div>
                    </dl>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <a href={attachment.url} target="_blank" rel="noreferrer" className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-teal/20 bg-white px-3 py-2.5 text-sm font-semibold text-teal transition hover:bg-teal/5">
                        <ExternalLink size={16} />
                        Abrir
                      </a>
                      <button
                        type="button"
                        onClick={() => void removeAttachment(attachment)}
                        disabled={deleteMutation.isPending}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-rose-200 bg-white px-3 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Trash2 size={16} />
                        Remover
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
