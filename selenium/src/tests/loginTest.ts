import { Builder, By, until } from "selenium-webdriver";

const config = {
  url: "http://localhost:5173",
  pageTitle: "CODER-SOFT | Dashboard",
  h3Expected: "Bienvenidos a <Codersoft />",
  pExpected: "Este sistema es una aplicacion para gestion de clubes deportivos",
};

async function runTest() {
  const driver = await new Builder().forBrowser("chrome").build();
  try {
    await driver.get(config.url);
    await driver.wait(until.titleContains(config.pageTitle), 5000);

    // Espera y obtiene el h3
    const h3 = await driver.wait(until.elementLocated(By.tagName("h3")), 2000);
    const h3Text = await h3.getText();
    console.log("Texto del h3:", h3Text);
    if (h3Text.trim() === config.h3Expected) {
      console.log("✅ El nombre es correcto.");
    } else {
      console.log(
        `❌ El nombre es incorrecto. Esperado: '${
          config.h3Expected
        }', obtenido: '${h3Text.trim()}'`
      );
    }

    // Espera y obtiene el p
    const p = await driver.wait(until.elementLocated(By.tagName("p")), 2000);
    const pText = await p.getText();
    console.log("Texto del p:", pText);
    if (pText.trim() === config.pExpected) {
      console.log("✅ El mensaje es correcto.");
    } else {
      console.log(
        `❌ El mensaje es incorrecto. Esperado: '${
          config.pExpected
        }', obtenido: '${pText.trim()}'`
      );
    }

    // Espera y verifica el botón
    const button = await driver.wait(
      until.elementLocated(By.tagName("button")),
      2000
    );
    const buttonText = await button.getText();
    console.log("Texto del botón:", buttonText);
    const buttonEsperado = "Ingresar";
    if (buttonText.trim() === buttonEsperado) {
      console.log("✅ El botón es correcto.");
    } else {
      console.log(
        `❌ El botón es incorrecto. Esperado: '${buttonEsperado}', obtenido: '${buttonText.trim()}'`
      );
    }
  } catch (err) {
    console.error("Error en el test:", err);
  } finally {
    await driver.quit();
  }
}

runTest();
