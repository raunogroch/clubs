/**
 * Configuración centralizada de variables de entorno
 *
 * Este archivo define todas las variables de entorno utilizadas en la aplicación.
 * Las variables se obtienen de process.env y se validan/convierten al tipo correcto.
 *
 * Variables soportadas:
 * - PORT: Puerto en el que corre el servidor (default: 4000)
 * - NODE_ENV: Entorno de ejecución (development, production)
 * - MAX_FILE_SIZE: Tamaño máximo de archivo en MB (default: 20)
 * - IMAGE_FOLDER: Carpeta donde se almacenan las imágenes (default: images)
 */

import { config } from "dotenv";
import joi = require("joi");

config();

export interface EnvConfig {
  server: {
    port: number;
    nodeEnv: string;
  };
  image: {
    maxFileSize: number;
    folder: string;
  };
}

/**
 * Obtiene y valida las variables de entorno
 * @returns Objeto con la configuración validada
 * @throws Error si hay variables inválidas
 */
export function getEnvConfig(): EnvConfig {
  const port = process.env.PORT;
  const nodeEnv = process.env.NODE_ENV || "development";
  const maxFileSize = process.env.MAX_FILE_SIZE || "20";
  const imageFolder = process.env.IMAGE_FOLDER || "images";

  return {
    server: {
      port: port ? parseInt(port, 10) : 4000,
      nodeEnv,
    },
    image: {
      maxFileSize: parseInt(maxFileSize, 10),
      folder: imageFolder,
    },
  };
}
