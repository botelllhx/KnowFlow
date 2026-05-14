import api from './api';

/**
 * Faz upload de um arquivo de mídia (imagem ou áudio) para o servidor.
 * Retorna a URL pública do Cloudinary.
 *
 * @param {File} file - Objeto File do input[type=file]
 * @returns {Promise<string>} URL pública do arquivo
 */
export async function uploadMidia(file) {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data.url;
}
