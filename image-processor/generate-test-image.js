#!/usr/bin/env node
const sharp = require("sharp");
const fs = require("fs");

// Crear una imagen simple de 100x100 píxeles roja
sharp({
  create: {
    width: 100,
    height: 100,
    channels: 3,
    background: { r: 255, g: 0, b: 0 },
  },
})
  .jpeg({ quality: 80 })
  .toBuffer()
  .then((buffer) => {
    const base64 = buffer.toString("base64");
    const dataUrl = `data:image/jpeg;base64,${base64}`;
    console.log("Generated test image base64:");
    console.log(dataUrl);
    fs.writeFileSync("./test-image-base64.txt", dataUrl);
    console.log("Saved to test-image-base64.txt");
  })
  .catch((err) => {
    console.error("Error generating image:", err);
    process.exit(1);
  });
