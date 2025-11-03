import { Injectable, BadRequestException } from "@nestjs/common";
import sharp from "sharp";
import * as fs from "fs";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";
import { LocalStorageService } from "../utils/local-storage.util";

@Injectable()
export class ProcessorService {
  constructor(private readonly localStorageService: LocalStorageService) {}

  async process(body: any): Promise<string> {
    if (!body || !body.image) {
      throw new BadRequestException("Missing image in body");
    }

    const imageData: string = body.image;
    const match = imageData.match(/^data:(image\/\w+);base64,(.+)$/);
    let buffer: Buffer;
    let inputMime: string | undefined;

    if (match) {
      inputMime = match[1];
      buffer = Buffer.from(match[2], "base64");
    } else {
      buffer = Buffer.from(imageData, "base64");
    }

    let img = sharp(buffer);
    const ops = body.operations || {};

    if (ops.resize) {
      const { width, height } = ops.resize;
      img = img.resize(width || null, height || null);
    }

    if (ops.format) {
      const fmt = (ops.format || "").toLowerCase();
      if (fmt === "jpeg" || fmt === "jpg") img = img.jpeg();
      else if (fmt === "png") img = img.png();
      else if (fmt === "webp") img = img.webp();
      else if (fmt === "avif") img = img.avif();
    }

    const outBuffer = await img.toBuffer();
    const outBase64 = outBuffer.toString("base64");
    const mime = ops.format
      ? `image/${ops.format === "jpg" ? "jpeg" : ops.format}`
      : inputMime || "image/png";
    return `data:${mime};base64,${outBase64}`;
  }

  async saveVariants(folder: string, imageBase64: string) {
    if (!imageBase64) throw new BadRequestException("Missing image");
    const match = imageBase64.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!match) throw new BadRequestException("Invalid base64 image");
    const mime = match[1];
    const data = match[2];
    const buffer = Buffer.from(data, "base64");

    const ext = mime.split("/")[1] === "jpeg" ? "jpg" : mime.split("/")[1];
    const filename = `${uuidv4()}.${ext}`;

    const baseDir = path.join(__dirname, "../../images", folder);
    const sizes: { [k: string]: number } = {
      small: 128,
      medium: 512,
      large: 1024,
    };
    const result: any = {};

    for (const [k, w] of Object.entries(sizes)) {
      const dir = path.join(baseDir, k);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const outPath = path.join(dir, filename);
      await sharp(buffer).resize({ width: w }).toFile(outPath);
      result[k] = `/images/${folder}/${k}/${filename}`;
    }

    return result;
  }

  async deleteVariants(folder: string, imagePath: string) {
    const baseDir = path.join(__dirname, "../../images", folder);
    const sizes = ["small", "medium", "large"];
    const filename = path.basename(imagePath);

    for (const size of sizes) {
      const filePath = path.join(baseDir, size, filename);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    }
  }

  async processImage(
    folder: string,
    imageBuffer: Buffer
  ): Promise<{
    small: string;
    medium: string;
    large: string;
  }> {
    const smallImage = this.resizeImage(imageBuffer, 100, 100);
    const mediumImage = this.resizeImage(imageBuffer, 500, 500);
    const largeImage = this.resizeImage(imageBuffer, 1000, 1000);

    return {
      small: this.localStorageService.saveImage(folder, smallImage, "jpg"),
      medium: this.localStorageService.saveImage(folder, mediumImage, "jpg"),
      large: this.localStorageService.saveImage(folder, largeImage, "jpg"),
    };
  }

  private resizeImage(
    imageBuffer: Buffer,
    width: number,
    height: number
  ): Buffer {
    return imageBuffer;
  }
}
