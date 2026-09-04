// Configuracao centralizada das pastas usadas para arquivos enviados pelo usuario.
import { mkdirSync } from 'node:fs';
import path from 'node:path';

export const diretorioUploads = path.resolve(process.cwd(), 'uploads');
export const diretorioUploadImagens = path.join(diretorioUploads, 'imagens');

export function garantirDiretoriosUpload() {
  mkdirSync(diretorioUploadImagens, { recursive: true });
}
