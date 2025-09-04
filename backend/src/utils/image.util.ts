// Servicio para procesamiento de imágenes de usuario
import { Injectable } from '@nestjs/common';
import { saveProfileImage } from '.';

@Injectable()
export class ImageService {
  processImage(folder: string, imageBase64?: string): string | undefined {
    if (imageBase64 && imageBase64.startsWith('data:image')) {
      return saveProfileImage(folder, imageBase64);
    }
    return imageBase64;
  }
}
