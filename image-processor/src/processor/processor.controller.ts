import { Controller, Post, Body } from "@nestjs/common";
import { ProcessorService } from "./processor.service";

@Controller("process")
export class ProcessorController {
  constructor(private readonly service: ProcessorService) {}

  @Post()
  async process(@Body() body: any) {
    const resultBase64 = await this.service.process(body);
    return { image: resultBase64 };
  }

  @Post("save")
  async save(@Body() body: any) {
    const folder = body.folder || "profile";
    if (!body || !body.image) {
      return { error: "Missing image" };
    }
    const paths = await this.service.saveVariants(folder, body.image);
    return paths;
  }

  @Post("delete")
  async delete(@Body() body: any) {
    const folder = body.folder;
    const imagePath = body.imagePath;
    if (!folder || !imagePath) return { error: "Missing folder or imagePath" };
    await this.service.deleteVariants(folder, imagePath);
    return { ok: true };
  }
}
