import {
  validateMediaFile,
  sanitizeFileName,
  formatBytes,
  getMediaTypeFromMime,
  MAX_IMAGE_SIZE_BYTES,
  MAX_PDF_SIZE_BYTES,
  MAX_VIDEO_SIZE_BYTES,
} from './validation';

function testStorageValidation() {
  console.log('[TEST] Iniciando testes de validação de storage e mídias...');

  // Teste 1: Validação de imagens válidas
  const validPng = validateMediaFile('arte_feed.png', 'image/png', 2 * 1024 * 1024);
  if (!validPng.valid || validPng.mediaType !== 'image') {
    throw new Error('Falha ao validar PNG válido');
  }

  const validWebp = validateMediaFile('foto.webp', 'image/webp', 500 * 1024);
  if (!validWebp.valid || validWebp.mediaType !== 'image') {
    throw new Error('Falha ao validar WEBP válido');
  }

  // Teste 2: Validação de PDF válido
  const validPdf = validateMediaFile('carrossel_linkedin.pdf', 'application/pdf', 15 * 1024 * 1024);
  if (!validPdf.valid || validPdf.mediaType !== 'pdf') {
    throw new Error('Falha ao validar PDF válido');
  }

  // Teste 3: Validação de Vídeo válido
  const validVideo = validateMediaFile('reels_teaser.mp4', 'video/mp4', 80 * 1024 * 1024);
  if (!validVideo.valid || validVideo.mediaType !== 'video') {
    throw new Error('Falha ao validar MP4 válido');
  }

  // Teste 4: Rejeição de formatos não permitidos
  const invalidExe = validateMediaFile('malware.exe', 'application/x-msdownload', 1024);
  if (invalidExe.valid) {
    throw new Error('Falha: Deveria ter rejeitado arquivo executável .exe');
  }

  const invalidZip = validateMediaFile('arquivos.zip', 'application/zip', 1024);
  if (invalidZip.valid) {
    throw new Error('Falha: Deveria ter rejeitado formato .zip');
  }

  // Teste 5: Rejeição por tamanho excessivo
  const oversizedImage = validateMediaFile(
    'banner_gigante.png',
    'image/png',
    MAX_IMAGE_SIZE_BYTES + 1
  );
  if (oversizedImage.valid) {
    throw new Error('Falha: Deveria ter rejeitado imagem superior a 25MB');
  }

  const oversizedPdf = validateMediaFile(
    'ebook_pesado.pdf',
    'application/pdf',
    MAX_PDF_SIZE_BYTES + 1
  );
  if (oversizedPdf.valid) {
    throw new Error('Falha: Deveria ter rejeitado PDF superior a 25MB');
  }

  const oversizedVideo = validateMediaFile(
    'video_4k.mp4',
    'video/mp4',
    MAX_VIDEO_SIZE_BYTES + 1024
  );
  if (oversizedVideo.valid) {
    throw new Error('Falha: Deveria ter rejeitado vídeo superior a 100MB');
  }

  // Teste 6: Rejeição de arquivo com 0 bytes ou nome vazio
  const zeroBytes = validateMediaFile('vazio.png', 'image/png', 0);
  if (zeroBytes.valid) {
    throw new Error('Falha: Deveria ter rejeitado arquivo com 0 bytes');
  }

  const emptyName = validateMediaFile('   ', 'image/png', 1024);
  if (emptyName.valid) {
    throw new Error('Falha: Deveria ter rejeitado nome vazio');
  }

  // Teste 7: Sanitização de nomes de arquivos e defesa contra directory traversal
  const traversalName = '../../../../etc/passwd.png';
  const sanitizedTraversal = sanitizeFileName(traversalName);
  if (sanitizedTraversal.includes('..') || sanitizedTraversal.includes('/')) {
    throw new Error(`Falha no sanitizeFileName contra traversal: ${sanitizedTraversal}`);
  }
  if (!sanitizedTraversal.endsWith('.png')) {
    throw new Error(`Falha no sanitizeFileName: extensão foi perdida: ${sanitizedTraversal}`);
  }

  const accentedName = 'Foto & Carrossél #1 (Final)!.jpeg';
  const sanitizedAccented = sanitizeFileName(accentedName);
  if (sanitizedAccented.includes(' ') || sanitizedAccented.includes('&') || sanitizedAccented.includes('é')) {
    throw new Error(`Falha na sanitização de caracteres especiais: ${sanitizedAccented}`);
  }
  if (sanitizedAccented !== 'Foto-Carrossel-1-Final.jpeg') {
    console.log(`[INFO] Sanitizado gerou: ${sanitizedAccented}`);
  }

  // Teste 8: Formatação de bytes
  if (formatBytes(0) !== '0 B') throw new Error('formatBytes(0) falhou');
  if (formatBytes(1024) !== '1 KB') throw new Error('formatBytes(1024) falhou');
  if (formatBytes(10 * 1024 * 1024) !== '10 MB') throw new Error('formatBytes(10MB) falhou');

  console.log('✅ Todos os testes de validação de storage passaram com 100% de sucesso!');
  process.exit(0);
}

testStorageValidation();
