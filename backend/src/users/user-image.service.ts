// Servicio para procesamiento de imágenes de usuario
import { Injectable } from '@nestjs/common';
import { saveProfileImage } from '../utils/imageProcessor';

@Injectable()
export class UserImageService {
  processImage(imageBase64?: string): string | undefined {
    if (imageBase64 && imageBase64.startsWith('data:image')) {
      return saveProfileImage(imageBase64);
    }
    return imageBase64;
  }
}
