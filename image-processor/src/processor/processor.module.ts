import { Module } from "@nestjs/common";
import { ProcessorController } from "./processor.controller";
import { ProcessorService } from "./processor.service";
import { LocalStorageService } from "../utils/local-storage.util";

@Module({
  controllers: [ProcessorController],
  providers: [ProcessorService, LocalStorageService],
})
export class ProcessorModule {}
