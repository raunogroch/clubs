import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

/**
 * Procesa una imagen en base64, la guarda en images/profile y retorna el link relativo.
 * @param base64Image Imagen en base64
 * @returns string Link relativo a la imagen guardada
 */
export const saveProfileImage = (
  folder: string,
  base64Image: string,
): string => {
  // Extrae el tipo de imagen
  const matches = base64Image.match(
    /^data:(image\/(png|jpeg|jpg));base64,(.+)$/,
  );
  if (!matches) {
    throw new Error('Formato de imagen base64 inválido');
  }
  const ext = matches[2] === 'jpeg' ? 'jpg' : matches[2];
  const data = matches[3];
  const buffer = Buffer.from(data, 'base64');
  const filename = `${uuidv4()}.${ext}`;
  const folderPath = path.join(__dirname, '../../images', folder);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
  const filePath = path.join(folderPath, filename);
  fs.writeFileSync(filePath, buffer);
  return `/images/${folder}/${filename}`;
};
