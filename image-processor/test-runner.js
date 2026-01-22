#!/usr/bin/env node
/**
 * Script de Prueba para Image Processor
 * Verifica que todos los endpoints funcionen correctamente
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

const IMAGE_PROCESSOR_URL = "http://localhost:3999";

// Pequeña imagen de prueba en base64 (100x100 píxeles rojo)
const TEST_IMAGE_BASE64 =
  "data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCABkAGQDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFgEBAQEAAAAAAAAAAAAAAAAAAAYI/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AnQCOaRAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/2Q==";

let testsPassed = 0;
let testsFailed = 0;

/**
 * Hace una petición HTTP POST
 */
function makeRequest(method, path, data) {
  return new Promise((resolve, reject) => {
    const url = new URL(IMAGE_PROCESSOR_URL + path);
    const options = {
      hostname: url.hostname,
      port: url.port || 3999,
      path: url.pathname + url.search,
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => {
        body += chunk;
      });
      res.on("end", () => {
        try {
          const parsed = JSON.parse(body);
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: parsed,
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: body,
          });
        }
      });
    });

    req.on("error", reject);
    req.write(JSON.stringify(data));
    req.end();
  });
}

/**
 * Test helpers
 */
function logTest(name) {
  console.log(`\n🧪 TEST: ${name}`);
  console.log("─".repeat(60));
}

function logSuccess(message) {
  console.log(`✅ ${message}`);
  testsPassed++;
}

function logError(message) {
  console.log(`❌ ${message}`);
  testsFailed++;
}

function logInfo(message) {
  console.log(`ℹ️  ${message}`);
}

/**
 * Tests
 */
async function testProcessImage() {
  logTest("POST /process - Procesar imagen base64");

  try {
    const response = await makeRequest("POST", "/process", {
      image: TEST_IMAGE_BASE64,
      operations: {
        resize: { width: 300, height: 300 },
        format: "jpeg",
      },
    });

    if (response.status === 200 && response.body.image) {
      logSuccess("Imagen procesada correctamente");
      logInfo(`Respuesta: base64 de ${response.body.image.length} caracteres`);
    } else {
      logError(
        `Status: ${response.status}, Body: ${JSON.stringify(response.body)}`,
      );
    }
  } catch (error) {
    logError(`Error de conexión: ${error.message}`);
  }
}

async function testSaveVariants() {
  logTest("POST /process/save - Procesar y guardar variantes");

  try {
    const response = await makeRequest("POST", "/process/save", {
      image: TEST_IMAGE_BASE64,
      folder: "test",
    });

    if (
      response.status === 200 &&
      response.body.images &&
      response.body.images.small &&
      response.body.images.medium &&
      response.body.images.large
    ) {
      logSuccess("Variantes guardadas correctamente");
      logInfo(`Small:  ${response.body.images.small}`);
      logInfo(`Medium: ${response.body.images.medium}`);
      logInfo(`Large:  ${response.body.images.large}`);

      // Guardar rutas para test de delete
      global.testImagePath = response.body.images.small;
      global.testImageFolder = "test";
    } else {
      logError(
        `Status: ${response.status}, Body: ${JSON.stringify(response.body)}`,
      );
    }
  } catch (error) {
    logError(`Error de conexión: ${error.message}`);
  }
}

async function testDeleteVariants() {
  logTest("POST /process/delete - Eliminar variantes de imagen");

  if (!global.testImagePath) {
    logError("No hay imagen guardada de test anterior, saltando...");
    return;
  }

  try {
    const response = await makeRequest("POST", "/process/delete", {
      folder: global.testImageFolder,
      imagePath: global.testImagePath,
    });

    if (response.status === 200 && response.body.ok) {
      logSuccess("Variantes eliminadas correctamente");
    } else {
      logError(
        `Status: ${response.status}, Body: ${JSON.stringify(response.body)}`,
      );
    }
  } catch (error) {
    logError(`Error de conexión: ${error.message}`);
  }
}

async function testMissingImage() {
  logTest("POST /process - Error: imagen faltante");

  try {
    const response = await makeRequest("POST", "/process", {
      operations: { resize: { width: 300 } },
    });

    if (response.status === 400) {
      logSuccess("Retorna 400 Bad Request como se esperaba");
    } else {
      logError(`Esperaba 400, recibió: ${response.status}`);
    }
  } catch (error) {
    logError(`Error de conexión: ${error.message}`);
  }
}

async function testMissingImageInSave() {
  logTest("POST /process/save - Error: imagen faltante");

  try {
    const response = await makeRequest("POST", "/process/save", {
      folder: "test",
    });

    if (response.status === 400) {
      logSuccess("Retorna 400 Bad Request como se esperaba");
    } else {
      logError(`Esperaba 400, recibió: ${response.status}`);
    }
  } catch (error) {
    logError(`Error de conexión: ${error.message}`);
  }
}

async function testDifferentFormats() {
  logTest("POST /process - Procesar con diferentes formatos");

  const formats = ["jpeg", "png", "webp"];

  for (const format of formats) {
    try {
      const response = await makeRequest("POST", "/process", {
        image: TEST_IMAGE_BASE64,
        operations: { format },
      });

      if (response.status === 200 && response.body.image) {
        logSuccess(`Formato ${format} procesado correctamente`);
      } else {
        logError(`Formato ${format} falló: ${response.status}`);
      }
    } catch (error) {
      logError(`Error en formato ${format}: ${error.message}`);
    }
  }
}

/**
 * Main
 */
async function main() {
  console.log("\n" + "=".repeat(60));
  console.log("🖼️  IMAGE PROCESSOR - TEST SUITE");
  console.log("=".repeat(60));
  console.log(`URL: ${IMAGE_PROCESSOR_URL}`);
  console.log(`Timestamp: ${new Date().toISOString()}`);

  // Tests básicos
  await testProcessImage();
  await testSaveVariants();
  await testDeleteVariants();

  // Tests de error
  await testMissingImage();
  await testMissingImageInSave();

  // Tests avanzados
  await testDifferentFormats();

  // Resumen
  console.log("\n" + "=".repeat(60));
  console.log("📊 RESUMEN DE PRUEBAS");
  console.log("=".repeat(60));
  console.log(`✅ Pruebas exitosas: ${testsPassed}`);
  console.log(`❌ Pruebas fallidas: ${testsFailed}`);
  console.log(`📈 Total: ${testsPassed + testsFailed}`);

  if (testsFailed === 0) {
    console.log("\n🎉 ¡Todos los tests pasaron correctamente!");
  } else {
    console.log(
      `\n⚠️  ${testsFailed} test(s) fallaron. Revisa los logs arriba.`,
    );
  }
  console.log("=".repeat(60) + "\n");

  process.exit(testsFailed > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error("Error fatal:", error);
  process.exit(1);
});
