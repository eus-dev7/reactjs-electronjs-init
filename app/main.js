const { app, BrowserWindow, Menu, dialog } = require("electron");
const { ipcMain } = require("./routes");
const url = require("url");
const path = require("path");
const { db } = require("./database/connection");
const fs = require("fs");

//is dev true or false
const IS_DEV = true;
let mainWindow;
var appData = app.getPath("userData") + "/";
//console.log(app.getPath("userData"));
if (IS_DEV) {
  appData = "";
}
function createWindow() {
  mainWindow = new BrowserWindow({
    title: "Red Express - v" + app.getVersion(),
    width: 680,
    height: 700,
    minWidth: 680,
    minHeight: 700,
    webPreferences: {
      //worldSafeExecuteJavaScript: true,
      //contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, "./preload.js"),
    },
  });

  if (IS_DEV) {
    mainWindow.loadURL("http://localhost:3000");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, "../build/index.html"),
        protocol: "file:",
        slashes: true,
      })
    );
  }
  mainWindow.setMenu(null);

  //inicializar valores database por defecto
  //Eliminar toda la base de datos
  db.municipalities.loadDatabase();
  db.municipalities.remove({}, { multi: true }, function (err, numRemoved) {});
  db.municipalDivisions.loadDatabase();
  db.municipalDivisions.remove(
    {},
    { multi: true },
    function (err, numRemoved) {}
  );
  db.communities.loadDatabase();
  db.communities.remove({}, { multi: true }, function (err, numRemoved) {});
  db.houses.loadDatabase();
  db.houses.remove({}, { multi: true }, function (err, numRemoved) {});
  db.trafos.loadDatabase();
  db.trafos.remove({}, { multi: true }, function (err, numRemoved) {});
  db.oldMediumVoltage.loadDatabase();
  db.oldMediumVoltage.remove(
    {},
    { multi: true },
    function (err, numRemoved) {}
  );
  db.newMediumVoltage.loadDatabase();
  db.newMediumVoltage.remove(
    {},
    { multi: true },
    function (err, numRemoved) {}
  );
  db.branchs.loadDatabase();
  db.branchs.remove({}, { multi: true }, function (err, numRemoved) {
    db.connections.loadDatabase();
    db.connections.remove({}, { multi: true }, function (err, numRemoved) {});
  });
  db.antennas.loadDatabase();
  db.antennas.remove({}, { multi: true }, function (err, numRemoved) {});
  //Fin Eliminar la base de datos
  db.settings.loadDatabase();
  db.settings.findOne({ _id: "1" }, (err, setting) => {
    if (setting === null)
      db.settings.insert(
        {
          _id: "1",
          projectName: "",
          lastOpenedFile: "",
          radioDistance: 0,
          poleDistanceLV: 0,
          poleCostLV: 0,
          cordCostLV: 0,
          poleDistanceMV: 0,
          poleCostMV: 0,
          cordCostMV: 0,
          transformerCostMV: 0,
          limitCost: 0,
          flexibleCost: 0,
          flexiblePercentage: 0,
          densificationDistance: 0,
        },
        (err) => {
          if (err) throw new Error(err);
        }
      );
    else
      db.settings.update(
        { _id: "1" },
        {
          $set: {
            _id: "1",
            projectName: "",
            lastOpenedFile: "",
            radioDistance: 0,
            poleDistanceLV: 0,
            poleCostLV: 0,
            cordCostLV: 0,
            poleDistanceMV: 0,
            poleCostMV: 0,
            cordCostMV: 0,
            transformerCostMV: 0,
            limitCost: 0,
            flexibleCost: 0,
            flexiblePercentage: 0,
            densificationDistance: 0,
          },
        },
        {},
        (err) => {
          if (err) throw new Error(err);
        }
      );
  });
  db.appConfig.loadDatabase();
  db.appConfig.findOne({ _id: "1" }, (err, config) => {
    if (config === null)
      db.appConfig.insert(
        {
          _id: "1",
          map: {
            tyleLayer: {
              name: "Esri_WorldImagery",
              url: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png",
              maxZoom: 17,
              attribution: "",
            },
          },
        },
        (err) => {
          if (err) throw new Error(err);
        }
      );
  });

  db.trafotypes.loadDatabase();
  db.trafotypes.insert(
    [
      {
        _id: "1",
        name: "Trafo de 10",
        minH: 1,
        maxH: 7,
        cost: 2200,
      },
      {
        _id: "2",
        name: "Trafo de 15",
        minH: 8,
        maxH: 10,
        cost: 2600,
      },
      {
        _id: "3",
        name: "Trafo de 20",
        minH: 11,
        maxH: 17,
        cost: 2700,
      },
      {
        _id: "4",
        name: "Trafo de 25",
        minH: 18,
        maxH: 22,
        cost: 2800,
      },
      {
        _id: "5",
        name: "Trafo de 30",
        minH: 23,
        maxH: 28,
        cost: 3000,
      },
    ],
    (err) => new Error(err)
  );
  //Esta parte de codigo es el que se encarga de iniciar el proyecto desde una extension de archivo
  const gotTheLock = app.requestSingleInstanceLock();

  if (!gotTheLock) {
    app.quit(); // No deberías tener más de una instancia.
  } else {
    app.on("second-instance", (event, commandLine, workingDirectory) => {
      // Esto se ejecutará cuando otra instancia intente abrir la aplicación.
      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
      }

      // En Windows, la ruta del archivo se puede encontrar en commandLine.
      // Sin embargo, necesitamos filtrar los argumentos para encontrar la ruta del archivo .re
      const fileArg = commandLine.find((arg) => /\.re$/.test(arg));
      if (fileArg) {
        showPathDialog(fileArg);
      }
    });

    // Muestra el path si se inicia con un archivo .re
    if (process.argv.length >= 2) {
      const filepath = process.argv[1];
      showPathDialog(filepath);
    }
  }

  function showPathDialog(filepath) {
    fs.readFile(filepath, "utf8", (err, data) => {
      if (err) {
        return;
      }
      //Aqui tengo que enviar mi objeto

      let jsonData;
      try {
        jsonData = JSON.parse(data);
      } catch (parseErr) {
        return;
      }
      if (
        jsonData !== undefined &&
        jsonData.file !== undefined &&
        jsonData.file.version === "1.0.0" &&
        jsonData.file.source === "reFileJSON"
      ) {
        const options = {
          type: "question",
          buttons: ["Sí", "No"],
          defaultId: 0, // El índice del botón por defecto. 0 es 'Sí'.
          title: "Abrir Proyecto",
          message:
            "Se está intentando cargar el archivo:\n" +
            filepath +
            ". \n\n ¿Deseas continuar con la acción?",
        };

        const response = dialog.showMessageBoxSync(mainWindow, options);

        if (response === 0) {
          jsonData.settings[0].lastOpenedFile = filepath;
          mainWindow.webContents.send("file-data", jsonData);
          return;
        } else if (response === 1) {
          console.log('El usuario eligió "No".');
        }
      }
    });
  }
  //END Hasta aqui hace la carga de datos desde un archivo con una extension
  ipcMain.on("get-app-name", (event, arg) => {
    //console.log(arg); // prints "ping"
    event.returnValue = "Red Express - v" + app.getVersion();
  });
  ipcMain.on("take-screenshot", (event, arg, mun) => {
    mainWindow.webContents.capturePage().then((image) => {
      const today = new Date();
      const folderName = `${mun}-capturas-${today.getFullYear()}-${
        today.getMonth() + 1
      }-${today.getDate()}`;
      const folderPath = path.join(app.getPath("downloads"), folderName);
      const fileName = arg + ".png";
      const filePath = path.join(folderPath, fileName);

      // Comprobar si la carpeta existe
      fs.access(folderPath, (error) => {
        if (error) {
          // La carpeta no existe, crearla
          fs.mkdir(folderPath, { recursive: true }, (error) => {
            if (error) {
              console.error("Error al crear la carpeta de capturas:", error);
              return;
            }
            saveScreenshot(filePath, image);
          });
        } else {
          saveScreenshot(filePath, image);
        }
      });
    });
  });

  function saveScreenshot(filePath, image) {
    fs.writeFile(filePath, image.toPNG(), (error) => {
      if (error) {
        console.error("Error al guardar la captura de pantalla:", error);
        return;
      }
      console.log("Captura de pantalla guardada:", filePath);
    });
  }

  ipcMain.on("test-export", () => {
    dialog
      .showSaveDialog({
        title: "Select the File Path to save",
        defaultPath: path.join(__dirname, "../assets/sample.re"),
        // defaultPath: path.join(__dirname, '../assets/'),
        buttonLabel: "Save",
        // Restricting the user to only Text Files.
        filters: [
          {
            name: "RedExpress File",
            extensions: ["re", "re"],
          },
        ],
        properties: [],
      })
      .then((file) => {
        // Stating whether dialog operation was cancelled or not.
        console.log(file.canceled);
        if (!file.canceled) {
          console.log(file.filePath.toString());

          // Creating and Writing to the sample.txt file
          fs.writeFile(
            file.filePath.toString(),
            "This is a Sample File",
            function (err) {
              if (err) throw err;
              console.log("Saved!");
            }
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
  ipcMain.on("export-files", (e, el) => {
    const window = BrowserWindow.getFocusedWindow();
    //var ext = "txt";
    //var extName = "Text File";
    var filters = [{ name: "RedExpress File", extensions: ["re", "re"] }];
    if (el.extension === "txt") {
      filters = [{ name: "Text File", extensions: ["txt", "doc"] }];
    } else if (el.extension === "xlsx") {
      filters = [{ name: "Exel File", extensions: ["xlsx", "xls"] }];
    } else if (el.extension === "re") {
      filters = [{ name: "RedExpress File", extensions: ["re", "re"] }];
    } else if (el.extension === "kml") {
      filters = [{ name: "KML", extensions: ["kml", "kml"] }];
    }
    dialog
      .showSaveDialog({
        title: "Select the File Path to save",
        //defaultPath: path.join(__dirname, "../assets/sample.re"),
        // defaultPath: path.join(__dirname, '../assets/'),
        buttonLabel: "Save",
        // Restricting the user to only Text Files.
        filters: filters,
        properties: [],
      })
      .then((file) => {
        // Stating whether dialog operation was cancelled or not.
        if (!file.canceled) {
          // Creating and Writing to the sample.txt file
          fs.writeFile(file.filePath.toString(), el.data, function (err) {
            if (err) throw err;
            dialog.showMessageBox(window, {
              title: "Info...",
              buttons: ["OK"],
              type: "info",
              message: "Datos guardados correctamente.",
            });
          });
        }
      })
      .catch((err) => {
        dialog.showMessageBox(window, {
          title: "Error...",
          buttons: ["OK"],
          type: "error",
          message: "Error al guardar los datos.",
        });
      });
  });
  // Evento antes de cerrar la ventana
  ipcMain.on("window-all-closed", () => {
    // Muestra el diálogo de confirmación
    const choice = dialog.showMessageBoxSync(mainWindow, {
      type: "question",
      buttons: ["Sí", "No"],
      title: "Confirmar",
      message:
        "Asegúrate de que siempre tengas guardado tus ultimos cambios. \n\n¿Estás seguro de que deseas cerrar la aplicación? ",
    });

    if (choice === 0) {
      // 0 is the index of 'Sí' button
      mainWindow.destroy(); // Close the window
    }
  });
  mainWindow.on("close", (event) => {
    event.preventDefault(); // Prevents the window from closing

    // Muestra el diálogo de confirmación
    const choice = dialog.showMessageBoxSync(mainWindow, {
      type: "question",
      buttons: ["Sí", "No"],
      title: "Confirmar",
      message:
        "Asegúrate de que siempre tengas guardado tus ultimos cambios. \n\n¿Estás seguro de que deseas cerrar la aplicación? ",
    });

    if (choice === 0) {
      // 0 is the index of 'Sí' button
      mainWindow.destroy(); // Close the window
    }
  });
}

module.exports = {
  createWindow,
};
