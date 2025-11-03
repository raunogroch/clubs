import { Injectable } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class LocalStorageService {
  private readonly storagePath = path.join(__dirname, "../../storage");

  constructor() {
    if (!fs.existsSync(this.storagePath)) {
      fs.mkdirSync(this.storagePath, { recursive: true });
    }
  }

  saveImage(folder: string, imageBuffer: Buffer, extension: string): string {
    const folderPath = path.join(this.storagePath, folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const filename = `${uuidv4()}.${extension}`;
    const filePath = path.join(folderPath, filename);
    fs.writeFileSync(filePath, imageBuffer);

    return `/storage/${folder}/${filename}`;
  }
}
