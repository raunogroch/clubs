/**
 * Configuración centralizada de variables de entorno
 *
 * Este archivo define todas las variables de entorno utilizadas en la aplicación.
 * Las variables se obtienen de process.env y se validan/convierten al tipo correcto.
 *
 * Variables soportadas:
 * - MONGODB_URI: URL de conexión a MongoDB
 * - JWT_SECRET: Clave secreta para firma de JWT
 * - PORT: Puerto en el que corre el servidor
 * - IMAGE_PROCESSOR_API: URL de la API de procesamiento de imágenes
 */

export interface EnvConfig {
  mongodb: {
    uri: string;
  };
  jwt: {
    secret: string;
  };
  server: {
    port: number;
  };
  externalApis: {
    imageProcessorApi: string;
  };
}

/**
 * Obtiene y valida las variables de entorno
 * @returns Objeto con la configuración validada
 * @throws Error si faltan variables de entorno requeridas
 */
export function getEnvConfig(): EnvConfig {
  const mongodbUri = process.env.MONGODB_URI;
  const jwtSecret = process.env.JWT_SECRET;
  const port = process.env.PORT;
  const imageProcessorApi = process.env.IMAGE_PROCESSOR_API;

  // Validar variables requeridas
  if (!mongodbUri) {
    throw new Error(
      'MONGODB_URI no está configurada en las variables de entorno',
    );
  }

  if (!jwtSecret) {
    throw new Error(
      'JWT_SECRET no está configurada en las variables de entorno',
    );
  }

  if (!imageProcessorApi) {
    throw new Error(
      'IMAGE_PROCESSOR_API no está configurada en las variables de entorno',
    );
  }

  return {
    mongodb: {
      uri: mongodbUri,
    },
    jwt: {
      secret: jwtSecret,
    },
    server: {
      port: port ? parseInt(port, 10) : 3000,
    },
    externalApis: {
      imageProcessorApi,
    },
  };
}
