// Servicio para procesamiento de imágenes de usuario
import { Injectable } from '@nestjs/common';
import { HttpService } from '../common/http/http.service';

const IMAGE_PROCESSOR_API =
  process.env.IMAGE_PROCESSOR_API || 'http://localhost:4000';

@Injectable()
export class ImageService {
  constructor(private readonly httpService: HttpService) {}

  async processImage(
    folder: string,
    imageBase64?: string,
  ): Promise<{ small: string; medium: string; large: string } | undefined> {
    if (imageBase64 && imageBase64.startsWith('data:image')) {
      try {
        const response = await this.httpService.post<{
          small: string;
          medium: string;
          large: string;
        }>(`${IMAGE_PROCESSOR_API}/process/save`, {
          folder,
          image: imageBase64,
        });
        return response.data; // Return all resolutions
      } catch (error) {
        console.error('Error delegating image processing:', error);
        throw new Error('Image processing failed');
      }
    }
    return undefined;
  }

  async deleteImage(folder: string, imagePath: string): Promise<void> {
    const filename = imagePath.split('/').pop();
    if (!filename) return;
    try {
      await this.httpService.post(`${IMAGE_PROCESSOR_API}/process/delete`, {
        folder,
        imagePath,
      });
    } catch (error) {
      console.error('Error delegating image deletion:', error);
      throw new Error('Image deletion failed');
    }
  }
}
