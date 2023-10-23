const { createWindow } = require("./main");
const { app } = require("electron");
//require("electron-reload")(__dirname);

let myWindow = null;

const additionalData = { myKey: "myValue" };
const gotTheLock = app.requestSingleInstanceLock(additionalData);

if (!gotTheLock) {
  app.quit();
} else {
  app.on(
    "second-instance",
    (event, commandLine, workingDirectory, additionalData) => {
      // Imprime los datos recibidos de la segunda instancia.
      //console.log(additionalData);

      // Alguien trato de ejecutar una segunda instancia, deberíamos enfocar nuestra ventana.
      if (myWindow) {
        if (myWindow.isMinimized()) myWindow.restore();
        myWindow.focus();
      }
    }
  );

  // Create myWindow, load the rest of the app, etc...
  app.whenReady().then(() => {
    myWindow = createWindow();
  });
}
