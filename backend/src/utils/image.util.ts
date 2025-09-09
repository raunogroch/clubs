// Servicio para procesamiento de imágenes de usuario
import { Injectable } from '@nestjs/common';
import { saveProfileImage } from '.';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ImageService {
  processImage(folder: string, imageBase64?: string): string | undefined {
    if (imageBase64 && imageBase64.startsWith('data:image')) {
      return saveProfileImage(folder, imageBase64);
    }
    return imageBase64;
  }
  async deleteImage(folder: string, imagePath: string): Promise<void> {
    // imagePath puede ser '/images/profile/uuid.jpg' o similar
    const filename = imagePath.split('/').pop();
    if (!filename) return;
    const filePath = path.join(__dirname, '../../images', folder, filename);
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  }
}
