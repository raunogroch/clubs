import { Injectable, BadRequestException, Logger } from "@nestjs/common";
import sharp from "sharp";
import * as fs from "fs";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";
import { LocalStorageService } from "../utils/local-storage.util";

@Injectable()
export class ProcessorService {
  private readonly logger = new Logger(ProcessorService.name);

  constructor(private readonly localStorageService: LocalStorageService) {}

  async process(body: any): Promise<string> {
    try {
      if (!body || !body.image) {
        throw new BadRequestException("Missing image in body");
      }

      const imageData: string = body.image;
      const match = imageData.match(/^data:(image\/[a-z+]+);base64,(.+)$/i);

      if (!match) {
        throw new BadRequestException(
          "Invalid base64 image format. Expected format: data:image/jpeg;base64,...",
        );
      }

      const [, inputMime, base64Data] = match;

      if (!base64Data || base64Data.length === 0) {
        throw new BadRequestException("Empty base64 data");
      }

      let buffer: Buffer;
      try {
        buffer = Buffer.from(base64Data, "base64");
      } catch (error) {
        throw new BadRequestException("Invalid base64 encoding");
      }

      if (buffer.length === 0) {
        throw new BadRequestException("Empty image buffer");
      }

      let img = sharp(buffer);
      const ops = body.operations || {};

      if (ops.resize && (ops.resize.width || ops.resize.height)) {
        img = img.resize(ops.resize.width || null, ops.resize.height || null, {
          fit: "inside",
          withoutEnlargement: true,
        });
      }

      if (ops.format) {
        const fmt = (ops.format || "").toLowerCase();
        if (fmt === "jpeg" || fmt === "jpg") img = img.jpeg({ quality: 80 });
        else if (fmt === "png") img = img.png();
        else if (fmt === "webp") img = img.webp();
        else if (fmt === "avif") img = img.avif();
      }

      const outBuffer = await img.toBuffer();
      const outBase64 = outBuffer.toString("base64");
      const mime = ops.format
        ? `image/${ops.format === "jpg" ? "jpeg" : ops.format}`
        : inputMime || "image/jpeg";

      return `data:${mime};base64,${outBase64}`;
    } catch (error: any) {
      this.logger.error(`Error processing image: ${error.message}`);
      throw error;
    }
  }

  async saveVariants(folder: string, imageBase64: string) {
    try {
      if (!imageBase64 || typeof imageBase64 !== "string") {
        throw new BadRequestException("Missing or invalid image");
      }

      const match = imageBase64.match(/^data:(image\/[a-z+]+);base64,(.+)$/i);
      if (!match) {
        throw new BadRequestException("Invalid base64 image format");
      }

      const [, mime, data] = match;
      let buffer: Buffer;

      try {
        buffer = Buffer.from(data, "base64");
      } catch (error) {
        throw new BadRequestException("Invalid base64 encoding");
      }

      if (buffer.length === 0) {
        throw new BadRequestException("Empty image buffer");
      }

      const ext = mime.split("/")[1] === "jpeg" ? "jpg" : mime.split("/")[1];
      const filename = `${uuidv4()}.${ext}`;

      const baseDir = path.join(__dirname, "../../images", folder);
      const sizes: { [k: string]: number } = {
        small: 50,
        medium: 512,
        large: 1024,
      };
      const result: any = {};

      for (const [k, w] of Object.entries(sizes)) {
        try {
          const dir = path.join(baseDir, k);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          const outPath = path.join(dir, filename);
          await sharp(buffer)
            .resize(w, w, { fit: "cover", position: "center" })
            .toFile(outPath);
          result[k] = `/images/${folder}/${k}/${filename}`;
        } catch (error: any) {
          this.logger.error(`Error saving ${k} variant: ${error.message}`);
          throw error;
        }
      }

      return result;
    } catch (error: any) {
      this.logger.error(`Error in saveVariants: ${error.message}`);
      throw error;
    }
  }

  async deleteVariants(folder: string, imagePath: string) {
    try {
      if (!folder || !imagePath) {
        throw new BadRequestException("Missing folder or imagePath");
      }

      const baseDir = path.join(__dirname, "../../images", folder);
      const sizes = ["small", "medium", "large"];
      const filename = path.basename(imagePath);

      for (const size of sizes) {
        const filePath = path.join(baseDir, size, filename);
        if (fs.existsSync(filePath)) {
          try {
            await fs.promises.unlink(filePath);
            this.logger.debug(`Deleted ${filePath}`);
          } catch (error: any) {
            this.logger.warn(`Failed to delete ${filePath}: ${error.message}`);
          }
        }
      }
    } catch (error: any) {
      this.logger.error(`Error in deleteVariants: ${error.message}`);
      throw error;
    }
  }

  /**
   * Guarda un archivo PDF manteniendo el mismo identificador si se proporciona
   * Si no se proporciona fileIdentifier, genera uno nuevo basado en UUID
   * Los PDFs se organizan en carpetas por fileIdentifier
   */
  async savePdf(
    folder: string,
    pdfBase64: string,
    fileIdentifier?: string,
  ): Promise<{ fileIdentifier: string; pdfPath: string }> {
    try {
      if (!pdfBase64 || typeof pdfBase64 !== "string") {
        throw new BadRequestException("Missing or invalid PDF");
      }

      const match = pdfBase64.match(
        /^data:(application\/pdf|application\/octet-stream);base64,(.+)$/i,
      );
      if (!match) {
        throw new BadRequestException(
          "Invalid base64 PDF format. Expected format: data:application/pdf;base64,...",
        );
      }

      const [, , data] = match;
      let buffer: Buffer;

      try {
        buffer = Buffer.from(data, "base64");
      } catch (error) {
        throw new BadRequestException("Invalid base64 encoding");
      }

      if (buffer.length === 0) {
        throw new BadRequestException("Empty PDF buffer");
      }

      // Generar o usar fileIdentifier existente
      const identifier = fileIdentifier || uuidv4();

      // Crear carpeta pdfs dentro de files
      const baseDir = path.join(__dirname, "../../files/pdfs");
      if (!fs.existsSync(baseDir)) {
        fs.mkdirSync(baseDir, { recursive: true });
      }

      // Guardar PDF con nombre = fileIdentifier.pdf
      const pdfFilename = `${identifier}.pdf`;
      const pdfPath = path.join(baseDir, pdfFilename);

      await fs.promises.writeFile(pdfPath, buffer);
      this.logger.debug(`PDF saved at ${pdfPath}`);

      return {
        fileIdentifier: identifier,
        pdfPath: `/files/pdfs/${pdfFilename}`,
      };
    } catch (error: any) {
      this.logger.error(`Error in savePdf: ${error.message}`);
      throw error;
    }
  }

  /**
   * Elimina un PDF de la carpeta pdfs
   */
  async deletePdf(folder: string, fileIdentifier: string): Promise<void> {
    try {
      if (!fileIdentifier) {
        throw new BadRequestException("Missing fileIdentifier");
      }

      const pdfPath = path.join(
        __dirname,
        "../../files/pdfs",
        `${fileIdentifier}.pdf`,
      );

      if (fs.existsSync(pdfPath)) {
        await fs.promises.unlink(pdfPath);
        this.logger.debug(`Deleted PDF file: ${pdfPath}`);
      }
    } catch (error: any) {
      this.logger.error(`Error in deletePdf: ${error.message}`);
      throw error;
    }
  }

  async processImage(
    folder: string,
    imageBuffer: Buffer,
  ): Promise<{
    small: string;
    medium: string;
    large: string;
  }> {
    try {
      const smallImage = await sharp(imageBuffer).resize(100, 100).toBuffer();
      const mediumImage = await sharp(imageBuffer).resize(500, 500).toBuffer();
      const largeImage = await sharp(imageBuffer).resize(1000, 1000).toBuffer();

      return {
        small: this.localStorageService.saveImage(folder, smallImage, "jpg"),
        medium: this.localStorageService.saveImage(folder, mediumImage, "jpg"),
        large: this.localStorageService.saveImage(folder, largeImage, "jpg"),
      };
    } catch (error: any) {
      this.logger.error(`Error in processImage: ${error.message}`);
      throw error;
    }
  }
}
