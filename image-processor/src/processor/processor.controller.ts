import {
  Controller,
  Post,
  Body,
  BadRequestException,
  HttpCode,
  Logger,
} from "@nestjs/common";
import { ProcessorService } from "./processor.service";

@Controller("process")
export class ProcessorController {
  private readonly logger = new Logger(ProcessorController.name);

  constructor(private readonly service: ProcessorService) {}

  @Post()
  @HttpCode(200)
  async process(@Body() body: any) {
    try {
      if (!body?.image) {
        throw new BadRequestException("Missing or empty image in body");
      }
      const resultBase64 = await this.service.process(body);
      return { image: resultBase64 };
    } catch (error: any) {
      this.logger.error(`Error in process: ${error.message}`);
      throw error;
    }
  }

  @Post("save")
  @HttpCode(200)
  async save(@Body() body: any) {
    try {
      if (!body?.image) {
        throw new BadRequestException("Missing or empty image in body");
      }
      const folder = body.folder || "profile";
      const paths = await this.service.saveVariants(folder, body.image);
      return { images: paths };
    } catch (error: any) {
      this.logger.error(`Error in save: ${error.message}`);
      throw error;
    }
  }

  @Post("delete")
  @HttpCode(200)
  async delete(@Body() body: any) {
    try {
      if (!body?.folder || !body?.imagePath) {
        throw new BadRequestException("Missing folder or imagePath");
      }
      await this.service.deleteVariants(body.folder, body.imagePath);
      return { ok: true };
    } catch (error: any) {
      this.logger.error(`Error in delete: ${error.message}`);
      throw error;
    }
  }
}
