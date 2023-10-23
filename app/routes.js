const { ipcMain } = require("electron");
const { db } = require("./database/connection");
const appConfig = require("./models/appConfig");
const trafoTypes = require("./models/trafoTypes");
const os = require("os");
const { machineId, machineIdSync } = require("node-machine-id");

ipcMain.on("macaddress", (event, arg) => {
  event.returnValue = {
    macaddress: machineIdSync({ original: true }),
    name_pc: os.hostname(),
  };
});
ipcMain.on("asynchronous-message", (event, arg) => {
  //console.log(arg); // prints "ping"
  event.returnValue = "pong";
});

//TrafoTypes
ipcMain.on("get-trafo-types", (e) => trafoTypes.getAll(e));

ipcMain.on("add-trafo-type", (e, trafoType) => trafoTypes.add(e, trafoType));
ipcMain.on("update-trafo-type", (e, trafoType) =>
  trafoTypes.update(e, trafoType)
);
ipcMain.on("delete-trafo-type", (e, idTrafoType) =>
  trafoTypes.remove(e, idTrafoType)
);
//get app config
ipcMain.on("get-app-config", (e) => appConfig.getById(e, "1"));
ipcMain.on("update-app-config", (e, config) =>
  appConfig.updateAppConfig(e, config)
);
//Comunication database configuraciones
ipcMain.on("showSetting", (e) => {
  db.settings.loadDatabase();
  db.settings.findOne({ _id: "1" }, (err, setting) =>
    e.reply("showedSetting", setting)
  );
});
ipcMain.on("updateSetting", (e, setting) => {
  db.settings.loadDatabase();
  db.settings.update({ _id: "1" }, { $set: setting }, {}, (err) => {
    if (err) throw new Error(err);
  });
  e.reply("updatedSetting", setting);
});
//Comunication database municipalities
ipcMain.on("listMunicipalities", (e) => {
  db.municipalities.loadDatabase();
  db.municipalities.find({}, (err, municipalities) =>
    e.reply("loadedMunicipalities", municipalities)
  );
});
// Listar municipios,divisiones,comunidades,viviendas
ipcMain.on("showTreeMunicipalities", (e) => {
  //var dataMunicipalities = [];
  db.houses.loadDatabase();
  db.houses.find({}, (err, houses) => {
    db.communities.loadDatabase();
    db.communities.find({}, (err, communities) => {
      communities.forEach((community, c) => {
        communities[c].houses = houses.filter(
          (house) => house.id_community === community._id
        );
      });
      db.municipalDivisions.loadDatabase();
      db.municipalDivisions.find({}, (err, municipalDivisions) => {
        municipalDivisions.map((municipalDivision, d) => {
          municipalDivisions[d].communities = communities.filter(
            (community) =>
              community.id_municipal_division === municipalDivision._id
          );
        });
        db.municipalities.loadDatabase();

        db.municipalities.find({}, (err, municipalities) => {
          municipalities.map((municipality, m) => {
            municipalities[m].municipalDivisions = municipalDivisions.filter(
              (municipalDivision) =>
                municipalDivision.id_municipality === municipality._id
            );

            // if (m === municipalities.length - 1) {
            //   e.reply("treeMunicipalities", municipalities);
            // }
          });
          e.reply("treeMunicipalities", municipalities);
        });
      });
    });
  });
});

ipcMain.on("addMunicipality", (e, municipality) => {
  db.municipalities.loadDatabase();
  db.municipalities.insert(municipality, (err) => {
    if (err) throw new Error(err);
  });

  e.reply("addedMunicipality", municipality);
});
ipcMain.on("showMunicipality", (e, idMunicipality) => {
  db.municipalities.loadDatabase();
  db.municipalities.findOne({ _id: idMunicipality }, (err, municipality) =>
    e.reply("showedMunicipality", municipality)
  );
});
ipcMain.on("updateMunicipality", (e, municipality) => {
  db.municipalities.loadDatabase();
  db.municipalities.update(
    { _id: municipality._id },
    { $set: municipality },
    {},
    (err) => {
      if (err) throw new Error(err);
    }
  );

  e.reply("updatedMunicipality", municipality);
});
ipcMain.on("importMunicipalities", (e, municipalities) => {
  db.municipalities.loadDatabase();
  db.municipalities.insert(municipalities, (err) => {
    if (err) throw new Error(err);
  });
});
ipcMain.on("deleteMunicipality", (e, idMunicipality) => {
  db.municipalities.loadDatabase();
  db.municipalities.remove({ _id: idMunicipality }, {}, (err, docs) => {
    db.municipalDivisions.loadDatabase();
    db.municipalDivisions.remove(
      { id_municipality: idMunicipality },
      { multi: true },
      (err, divisionsDeleted) => {
        db.communities.loadDatabase();
        db.communities.remove(
          { id_municipality: idMunicipality },
          { multi: true },
          (err, communitiesDeleted) => {
            db.houses.loadDatabase();
            db.houses.remove(
              { id_municipality: idMunicipality },
              { multi: true },
              (err, housesDeleted) => {
                if (err) throw new Error(err);
                e.reply("deletedMunicipality", idMunicipality);
              }
            );
          }
        );
      }
    );
  });
});
//Comunication database municipal division

ipcMain.on("listMunicipalDivisions", (e) => {
  db.municipalDivisions.loadDatabase();
  db.municipalDivisions.find({}, (err, municipalDivisions) =>
    e.reply("loadedMunicipalDivisions", municipalDivisions)
  );
});
ipcMain.on("listDivisionsByMunicipality", (e, idMunicipality) => {
  db.municipalDivisions.loadDatabase();
  db.municipalDivisions.find(
    { id_municipality: idMunicipality },
    (err, municipalDivisions) => {
      e.reply("loadedDivisionsByMunicipality", municipalDivisions);
    }
  );
});

ipcMain.on("addMunicipalDivision", (e, municipalDivision) => {
  db.municipalDivisions.loadDatabase();
  db.municipalDivisions.insert(municipalDivision, (err) => {
    if (err) throw new Error(err);
  });

  e.reply("addedMunicipalDivision", municipalDivision);
});

ipcMain.on("showMunicipalDivision", (e, idMunicipalDivision) => {
  db.municipalDivisions.loadDatabase();
  db.municipalDivisions.findOne(
    { _id: idMunicipalDivision },
    (err, municipalDivision) =>
      e.reply("showedMunicipalDivision", municipalDivision)
  );
});
ipcMain.on("updateMunicipalDivision", (e, municipalDivision) => {
  db.municipalDivisions.loadDatabase();
  db.municipalDivisions.update(
    { _id: municipalDivision._id },
    { $set: municipalDivision },
    {},
    (err) => {
      if (err) throw new Error(err);
    }
  );

  e.reply("updatedMunicipalDivision", municipalDivision);
});
ipcMain.on("importMunicipalDivisions", (e, municipalDivisions) => {
  db.municipalDivisions.loadDatabase();
  db.municipalDivisions.insert(municipalDivisions, (err) => {
    if (err) throw new Error(err);
  });
});
ipcMain.on("deleteMunicipalDivision", (e, idMunicipalDivision) => {
  db.municipalDivisions.loadDatabase();
  db.municipalDivisions.remove(
    { _id: idMunicipalDivision },
    {},
    (err, docs) => {
      db.communities.loadDatabase();
      db.communities.remove(
        { id_municipal_division: idMunicipalDivision },
        { multi: true },
        (err, communitiesDeleted) => {
          db.houses.loadDatabase();
          db.houses.remove(
            { id_municipal_division: idMunicipalDivision },
            { multi: true },
            (err, housesDeleted) => {
              if (err) throw new Error(err);
              e.reply("deletedMunicipalDivision", idMunicipalDivision);
            }
          );
        }
      );
    }
  );
});
//Comunication database Communities

ipcMain.on("listCommunities", (e) => {
  db.communities.loadDatabase();
  db.communities.find({}, (err, communities) => {
    e.reply("loadedCommunities", communities);
  });
});
ipcMain.on("listCommunitiesByMunicipalDivision", (e, idMunicipalDivision) => {
  db.communities.loadDatabase();
  db.communities.find(
    { id_municipal_division: idMunicipalDivision },
    (err, communities) => {
      e.reply("loadedCommunitiesByMunicipalDivision", communities);
    }
  );
});

ipcMain.on("addCommunity", (e, community) => {
  db.communities.loadDatabase();
  db.communities.insert(community, (err) => {
    if (err) throw new Error(err);
  });

  e.reply("addedCommutnity", community);
});

ipcMain.on("showCommunity", (e, idCommunity) => {
  db.communities.loadDatabase();
  db.communities.findOne({ _id: idCommunity }, (err, community) =>
    e.reply("showedCommunity", community)
  );
});
ipcMain.on("updateCommunnity", (e, community) => {
  db.communities.loadDatabase();
  db.communities.update(
    { _id: community._id },
    { $set: community },
    {},
    (err) => {
      if (err) throw new Error(err);
    }
  );

  e.reply("updatedCommunity", community);
});
ipcMain.on("importCommunities", (e, communities) => {
  db.communities.loadDatabase();
  db.communities.insert(communities, (err) => {
    if (err) throw new Error(err);
  });
});
ipcMain.on("deleteCommunity", (e, idCommunity) => {
  db.communities.loadDatabase();
  db.communities.remove({ _id: idCommunity }, {}, (err, docs) => {
    db.houses.loadDatabase();
    db.houses.remove(
      { id_community: idCommunity },
      { multi: true },
      (err, housesDeleted) => {
        if (err) throw new Error(err);
        e.reply("deletedCommunity", idCommunity);
      }
    );
  });
});

//Comunication database houses

ipcMain.on("listHouses", (e) => {
  db.houses.loadDatabase();
  db.houses.find({}, (err, Houses) => e.reply("loadedHouses", Houses));
});

ipcMain.on("listHousesByCommunity", (e, idCommunity) => {
  db.houses.loadDatabase();
  db.houses.find({ id_community: idCommunity }, (err, Houses) => {
    e.reply("loadedHousesByCommunity", Houses);
  });
});
ipcMain.on("listHousesByCommunities", (e, idsCommunity) => {
  db.houses.loadDatabase();
  db.houses.find({ id_community: { $in: idsCommunity } }, (err, Houses) => {
    e.reply("loadedHousesByCommunities", Houses);
  });
});
ipcMain.on("listHousesByMunicipality", (e, idMunicipality) => {
  db.houses.loadDatabase();
  db.houses.find({ id_municipality: idMunicipality }, (err, Houses) => {
    e.reply("loadedHousesByMunicipality", Houses);
  });
});

ipcMain.on("addHouse", (e, house) => {
  db.houses.loadDatabase();
  db.houses.insert(house, (err) => {
    if (err) throw new Error(err);
  });

  e.reply("addedHouse", house);
});
ipcMain.on("importHouses", (e, houses) => {
  db.houses.loadDatabase();
  db.houses.insert(houses, (err) => {
    if (err) throw new Error(err);
  });

  e.reply("importedHouses", houses);
});

ipcMain.on("showHouse", (e, idHouse) => {
  db.houses.loadDatabase();
  db.houses.findOne({ _id: idHouse }, (err, house) =>
    e.reply("showedHouse", house)
  );
});
ipcMain.on("updateHouse", (e, house) => {
  db.houses.loadDatabase();
  db.houses.update({ _id: house._id }, { $set: house }, {}, (err) => {
    if (err) throw new Error(err);
  });

  e.reply("updatedHouse", house);
});
ipcMain.on("updateHouseConditionElectrify", (e, house) => {
  db.houses.loadDatabase();
  db.houses.update(
    { _id: house._id },
    { $set: { conditionElectrify: house.conditionElectrify } },
    {},
    (err) => {
      if (err) throw new Error(err);
    }
  );

  e.reply("updatedHouse", house);
});
ipcMain.on("deleteHouse", (e, idHouse) => {
  db.houses.loadDatabase();
  db.houses.remove({ _id: idHouse }, {}, (err, docs) => {
    if (err) throw new Error(err);
    e.reply("deletedHouse", idHouse);
  });
});
ipcMain.on("changeConditionElectrifyDensifcation", (e) => {
  db.houses.loadDatabase();
  db.houses.update(
    { conditionElectrify: "densification" },
    { $set: { conditionElectrify: "solar" } },
    {},
    (err) => {
      if (err) throw new Error(err);
    }
  );

  e.reply("updatedHouse", "added");
});
ipcMain.on("resetElectrify", (event, arg) => {
  //resetear todos las viviendas electriicadas
  db.houses.loadDatabase((err) => {
    db.houses.find({ conditionElectrify: "to_electrify" }, (err, houses) => {
      houses.forEach((h) => {
        db.houses.update(
          { _id: h._id },
          { $set: { conditionElectrify: "solar" } },
          {},
          (err) => {
            if (err) console.log(err);
          }
        );
      });
    });
  });
  //eliminar todos los trafos creados
  db.trafos.loadDatabase((err) => {
    db.trafos.remove({}, { multi: true }, (err, docs) => {
      if (err) throw new Error(err);
    });
  });
  //Eliminar todos los redes media tension
  db.connections.loadDatabase((err) => {
    db.connections.remove({}, { multi: true }, (err, docs) => {
      if (err) throw new Error(err);
    });
  });
  //eliminar conexiones media tension
  db.newMediumVoltage.loadDatabase((err) => {
    db.newMediumVoltage.remove({}, { multi: true }, (err, docs) => {
      if (err) throw new Error(err);
    });
  });
  //eliminar ramas
  db.branchs.loadDatabase((err) => {
    db.branchs.remove({}, { multi: true }, (err, docs) => {
      if (err) throw new Error(err);
    });
  });
  event.returnValue = "Datos actualizados correctamente";
});

//Comunication database types

ipcMain.on("listTypes", (e) => {
  db.types.loadDatabase();
  db.types.find({}, (err, types) => e.reply("loadedTypes", types));
});

//Comunication database trafos

ipcMain.on("listTrafos", (e) => {
  db.trafos.loadDatabase();
  db.trafos.find({}, (err, trafos) => e.reply("loadedTrafos", trafos));
});

ipcMain.on("addTrafo", (e, trafo) => {
  db.trafos.loadDatabase();
  db.trafos.insert(trafo, (err) => {
    if (err) throw new Error(err);
  });

  e.reply("addedTrafo", trafo);
});

ipcMain.on("showTrafo", (e, idTrafo) => {
  db.trafos.loadDatabase();
  db.trafos.findOne({ _id: idTrafo }, (err, trafo) =>
    e.reply("showedTrafo", trafo)
  );
});
ipcMain.on("updateTrafo", (e, trafo) => {
  db.trafos.loadDatabase();
  db.trafos.update({ _id: trafo._id }, { $set: trafo }, {}, (err) => {
    if (err) throw new Error(err);
  });
  e.reply("updatedTrafo", trafo);
});
ipcMain.on("deleteTrafo", (e, idTrafo) => {
  db.trafos.loadDatabase();
  db.trafos.remove({ _id: idTrafo }, {}, (err, docs) => {
    if (err) throw new Error(err);
    e.reply("deletedTrafo", idTrafo);
  });
});

//Comunication database connections

ipcMain.on("listConnections", (e) => {
  db.connections.loadDatabase();
  db.connections.find({}, (err, connections) =>
    e.reply("loadedConnections", connections)
  );
});
ipcMain.on("addConnection", (e, connection) => {
  db.connections.loadDatabase();
  db.connections.remove(
    {
      $or: [
        {
          "position.lat": connection.position.lat,
          "position.lng": connection.position.lng,
        },
        { id_trafo: connection.id_trafo },
      ],
    },
    {},
    (err, docs) => {}
  );
  db.connections.insert(connection, (err) => {
    if (err) throw new Error(err);
  });
  // db.connections.find({ id_trafo: connection.id_trafo }, (err, connections) => {
  //   console.log(connections);
  //   if (connections.length > 0) {
  //   } else {
  //     db.connections.insert(connection, (err) => {
  //       if (err) throw new Error(err);
  //     });
  //   }
  // });
  e.reply("addedConnection", connection);
});

ipcMain.on("showConnection", (e, idConnection) => {
  db.connections.loadDatabase();
  db.connections.findOne({ _id: idConnection }, (err, connection) =>
    e.reply("showedConnection", connection)
  );
});
ipcMain.on("updateConnection", (e, connection) => {
  db.connections.loadDatabase();
  db.connections.update(
    { _id: connection._id },
    { $set: connection },
    {},
    (err) => {
      if (err) throw new Error(err);
    }
  );
  e.reply("updatedConnection", connection);
});
ipcMain.on("deleteConnection", (e, idConnection) => {
  db.connections.loadDatabase();
  db.connections.remove({ _id: idConnection }, {}, (err, docs) => {
    if (err) throw new Error(err);
    e.reply("deletedConnection", idConnection);
  });
});

//Comunication database oldMediumVoltage

ipcMain.on("listOldMediumVoltage", (e) => {
  db.oldMediumVoltage.loadDatabase();
  db.oldMediumVoltage.find({}, (err, oldMediumVoltage) =>
    e.reply("loadedOldMediumVoltage", oldMediumVoltage)
  );
});

ipcMain.on("addOldMediumVoltage", (e, oldMediumVoltage) => {
  db.oldMediumVoltage.loadDatabase();
  db.oldMediumVoltage.insert(oldMediumVoltage, (err) => {
    if (err) throw new Error(err);
  });

  e.reply("addedOldMediumVoltage", oldMediumVoltage);
});
ipcMain.on("updateNetwork", (e, oldMediumVoltage) => {
  db.oldMediumVoltage.loadDatabase();
  db.oldMediumVoltage.update(
    { _id: oldMediumVoltage._id },
    { $set: oldMediumVoltage },
    {},
    (err) => {
      if (err) throw new Error(err);
    }
  );
});
ipcMain.on("importOldMediumVoltage", (e, oldMediumVoltages) => {
  db.oldMediumVoltage.loadDatabase();
  db.oldMediumVoltage.insert(oldMediumVoltages, (err) => {
    if (err) throw new Error(err);
  });

  e.reply("importedOldMediumVoltage", oldMediumVoltages);
});

ipcMain.on("showOldMediumVoltage", (e, idOldMediumVoltage) => {
  db.oldMediumVoltage.loadDatabase();
  db.oldMediumVoltage.findOne(
    { _id: idOldMediumVoltage },
    (err, oldMediumVoltage) =>
      e.reply("showedOldMediumVoltage", oldMediumVoltage)
  );
});
ipcMain.on("updateOldMediumVoltage", (e, oldMediumVoltage) => {
  db.oldMediumVoltage.loadDatabase();
  db.oldMediumVoltage.update(
    { _id: oldMediumVoltage._id },
    { $set: oldMediumVoltage },
    {},
    (err) => {
      if (err) throw new Error(err);
    }
  );

  e.reply("updatedOldMediumVoltage", oldMediumVoltage);
});
ipcMain.on("deleteOldMediumVoltage", (e, idOldMediumVoltage) => {
  db.oldMediumVoltage.loadDatabase();
  db.oldMediumVoltage.remove({ _id: idOldMediumVoltage }, {}, (err, docs) => {
    if (err) throw new Error(err);
    e.reply("deletedOldMediumVoltage", idOldMediumVoltage);
  });
});
ipcMain.on("deleteAllOldMediumVoltage", () => {
  db.oldMediumVoltage.loadDatabase();
  db.oldMediumVoltage.remove({}, { multi: true }, (err, docs) => {
    if (err) throw new Error(err);
  });
});

//Comunication database newMediumVoltage

ipcMain.on("listNewMediumVoltage", (e) => {
  db.newMediumVoltage.loadDatabase();
  db.newMediumVoltage.find({}, (err, newMediumVoltage) =>
    e.reply("loadedNewMediumVoltage", newMediumVoltage)
  );
});

ipcMain.on("addNewMediumVoltage", (e, newMediumVoltage) => {
  db.newMediumVoltage.loadDatabase();
  db.newMediumVoltage.insert(newMediumVoltage, (err) => {
    if (err) throw new Error(err);
  });
  e.reply("addedNewMediumVoltage", newMediumVoltage);
});
ipcMain.on("importNewMediumVoltage", (e, newMediumVoltages) => {
  db.newMediumVoltage.loadDatabase();
  db.newMediumVoltage.insert(newMediumVoltages, (err) => {
    if (err) throw new Error(err);
  });

  e.reply("importedNewMediumVoltage", newMediumVoltages);
});

ipcMain.on("showNewMediumVoltage", (e, idNewMediumVoltage) => {
  db.newMediumVoltage.loadDatabase();
  db.newMediumVoltage.findOne(
    { _id: idNewMediumVoltage },
    (err, newMediumVoltage) =>
      e.reply("showedNewMediumVoltage", newMediumVoltage)
  );
});
ipcMain.on("updateNewMediumVoltage", (e, newMediumVoltage) => {
  db.newMediumVoltage.loadDatabase();
  db.newMediumVoltage.update(
    { _id: newMediumVoltage._id },
    { $set: newMediumVoltage },
    {},
    (err) => {
      if (err) throw new Error(err);
    }
  );

  e.reply("updatedNewMediumVoltage", newMediumVoltage);
});
ipcMain.on("deleteNewMediumVoltage", (e, idNewMediumVoltage) => {
  db.newMediumVoltage.loadDatabase();
  db.newMediumVoltage.remove({ _id: idNewMediumVoltage }, {}, (err, docs) => {
    if (err) throw new Error(err);
    e.reply("deletedNewMediumVoltage", idNewMediumVoltage);
  });
});
ipcMain.on("deleteAllNewMediumVoltage", (e) => {
  db.newMediumVoltage.loadDatabase();
  db.newMediumVoltage.remove({}, { multi: true }, (err, docs) => {
    if (err) throw new Error(err);
  });
});

//Comunication database newMediumVoltage

ipcMain.on("listDensifiedLines", (e) => {
  db.densifiedLines.loadDatabase();
  db.densifiedLines.find({}, (err, densifiedLines) =>
    e.reply("loadedDensifiedLines", densifiedLines)
  );
});

ipcMain.on("addDensifiedLine", (e, densifiedLines) => {
  db.densifiedLines.loadDatabase();
  db.densifiedLines.insert(densifiedLines, (err) => {
    if (err) throw new Error(err);
  });
  e.reply("addedDensifiedLines", densifiedLines);
});

ipcMain.on("importDensifiedLines", (e, densifiedLines) => {
  db.densifiedLines.loadDatabase();
  db.densifiedLines.insert(densifiedLines, (err) => {
    if (err) throw new Error(err);
  });

  e.reply("importedDensifiedLines", densifiedLines);
});

ipcMain.on("showDensifiedLines", (e, idDensifiedLines) => {
  db.densifiedLines.loadDatabase();
  db.densifiedLines.findOne({ _id: idDensifiedLines }, (err, densifiedLines) =>
    e.reply("showedDensifiedLines", densifiedLines)
  );
});
ipcMain.on("updateDensifiedLines", (e, densifiedLines) => {
  db.densifiedLines.loadDatabase();
  db.densifiedLines.update(
    { _id: densifiedLines._id },
    { $set: densifiedLines },
    {},
    (err) => {
      if (err) throw new Error(err);
    }
  );

  e.reply("updatedDensifiedLines", densifiedLines);
});
ipcMain.on("deleteDensifiedLines", (e, idDensifiedLines) => {
  db.densifiedLines.loadDatabase();
  db.densifiedLines.remove({ _id: idDensifiedLines }, {}, (err, docs) => {
    if (err) throw new Error(err);
    e.reply("deletedDensifiedLines", idDensifiedLines);
  });
});
ipcMain.on("deleteAllDensifiedLine", () => {
  db.densifiedLines.loadDatabase();
  db.densifiedLines.remove({}, { multi: true }, (err, docs) => {
    if (err) throw new Error(err);
  });
});

//Comunication database branchs

ipcMain.on("listBranchs", (e) => {
  db.branchs.loadDatabase();
  db.branchs.find({}, (err, branchs) => e.reply("loadedBranchs", branchs));
});

ipcMain.on("addBranch", (e, branch) => {
  db.branchs.loadDatabase();
  db.branchs.insert(branch, (err) => {
    if (err) throw new Error(err);
  });

  e.reply("addedBranch", branch);
});
ipcMain.on("importBranchs", (e, brachs) => {
  db.branchs.loadDatabase();
  db.branchs.insert(brachs, (err) => {
    if (err) throw new Error(err);
  });

  e.reply("importedBranchs", brachs);
});

ipcMain.on("showBranch", (e, idBranch) => {
  db.branchs.loadDatabase();
  db.branchs.findOne({ _id: idBranch }, (err, branch) =>
    e.reply("showedBrach", branch)
  );
});
ipcMain.on("updateBrach", (e, branch) => {
  db.branchs.loadDatabase();
  db.branchs.update({ _id: branch._id }, { $set: branch }, {}, (err) => {
    if (err) throw new Error(err);
  });

  e.reply("updatedBrach", branch);
});
ipcMain.on("deleteBranch", (e, idBranch) => {
  db.branchs.loadDatabase();
  db.branchs.remove({ _id: idBranch }, {}, (err, docs) => {
    if (err) throw new Error(err);
    e.reply("deletedBranch", idBranch);
  });
});
ipcMain.on("deleteBranchs", () => {
  db.branchs.loadDatabase();
  db.branchs.remove({}, { multi: true }, (err, docs) => {
    if (err) throw new Error(err);
  });
});

//Exportar datos
ipcMain.on("exportData", (e) => {
  var data = {};
  db.municipalities.loadDatabase();
  db.municipalities.find({}, { multi: true }, function (err, municipalities) {
    data.municipalities = municipalities;
    db.municipalDivisions.loadDatabase();
    db.municipalDivisions.find(
      {},
      { multi: true },
      function (err, municipalDivisions) {
        data.municipalDivisions = municipalDivisions;
        db.communities.loadDatabase();
        db.communities.find({}, { multi: true }, function (err, communities) {
          data.communities = communities;
          db.houses.loadDatabase();
          db.houses.find({}, { multi: true }, function (err, houses) {
            data.houses = houses;
            db.trafos.loadDatabase();
            db.trafos.find({}, { multi: true }, function (err, trafos) {
              data.trafos = trafos;
              db.oldMediumVoltage.loadDatabase();
              db.oldMediumVoltage.find(
                {},
                { multi: true },
                function (err, oldMediumVoltage) {
                  data.oldMediumVoltage = oldMediumVoltage;
                  db.newMediumVoltage.loadDatabase();
                  db.newMediumVoltage.find(
                    {},
                    { multi: true },
                    function (err, newMediumVoltage) {
                      data.newMediumVoltage = newMediumVoltage;
                      db.branchs.loadDatabase();
                      db.branchs.find(
                        {},
                        { multi: true },
                        function (err, branchs) {
                          data.branchs = branchs;
                          db.connections.loadDatabase();
                          db.connections.find(
                            {},
                            { multi: true },
                            function (err, connections) {
                              data.connections = connections;
                              db.settings.loadDatabase();
                              db.settings.find(
                                {},
                                { multi: true },
                                function (err, settings) {
                                  data.settings = settings;
                                  db.antennas.loadDatabase();
                                  db.antennas.find({});
                                  e.reply("loadedExportData", data);
                                }
                              );
                            }
                          );
                        }
                      );
                    }
                  );
                }
              );
            });
          });
        });
      }
    );
  });
});
ipcMain.on("importData", (e, data) => {
  db.municipalities.loadDatabase();
  db.municipalities.remove({}, { multi: true }, function (err, municipalities) {
    db.municipalities.insert(data.municipalities, (err) => {
      if (err) throw new Error(err);
    });
    db.municipalDivisions.loadDatabase();
    db.municipalDivisions.remove(
      {},
      { multi: true },
      function (err, municipalDivisions) {
        db.municipalDivisions.insert(data.municipalDivisions, (err) => {
          if (err) throw new Error(err);
        });
        db.communities.loadDatabase();
        db.communities.remove({}, { multi: true }, function (err, communities) {
          db.communities.insert(data.communities, (err) => {
            if (err) throw new Error(err);
          });
          db.houses.loadDatabase();
          db.houses.remove({}, { multi: true }, function (err, houses) {
            db.houses.insert(data.houses, (err) => {
              if (err) throw new Error(err);
            });
            db.trafos.loadDatabase();
            db.trafos.remove({}, { multi: true }, function (err, trafos) {
              db.trafos.insert(data.trafos, (err) => {
                if (err) throw new Error(err);
              });
              db.oldMediumVoltage.loadDatabase();
              db.oldMediumVoltage.remove(
                {},
                { multi: true },
                function (err, oldMediumVoltage) {
                  db.oldMediumVoltage.insert(data.oldMediumVoltage, (err) => {
                    if (err) throw new Error(err);
                  });
                  db.newMediumVoltage.loadDatabase();
                  db.newMediumVoltage.remove(
                    {},
                    { multi: true },
                    function (err, newMediumVoltage) {
                      db.newMediumVoltage.insert(
                        data.newMediumVoltage,
                        (err) => {
                          if (err) throw new Error(err);
                        }
                      );
                      db.branchs.loadDatabase();
                      db.branchs.remove(
                        {},
                        { multi: true },
                        function (err, branchs) {
                          db.branchs.insert(data.branchs, (err) => {
                            if (err) throw new Error(err);
                          });
                          db.connections.loadDatabase();
                          db.connections.remove(
                            {},
                            { multi: true },
                            function (err, connections) {
                              db.connections.insert(data.connections, (err) => {
                                if (err) throw new Error(err);
                              });
                              db.settings.loadDatabase();
                              db.settings.remove(
                                {},
                                { multi: true },
                                function (err, settings) {
                                  db.settings.insert(data.settings, (err) => {
                                    if (err) throw new Error(err);
                                  });
                                  db.antennas.loadDatabase();
                                  db.antennas.remove(
                                    {},
                                    { multi: true },
                                    function (err, antennas) {
                                      db.antennas.insert(
                                        data.antennas,
                                        (err) => {
                                          if (err) var str = err;
                                        }
                                      );
                                      e.reply("importedData", data);
                                    }
                                  );
                                }
                              );
                            }
                          );
                        }
                      );
                    }
                  );
                }
              );
            });
          });
        });
      }
    );
  });
});
//
ipcMain.on("deleteAllDataStore", (e) => {
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
    db.connections.remove({}, { multi: true }, function (err, numRemoved) {
      e.reply("allDeleted", numRemoved);
    });
  });
  db.antennas.loadDatabase();
  db.antennas.remove({}, { multi: true }, function (err, numRemoved) {});
});
// Antennas
//Comunication database Antennas

ipcMain.on("listAntennas", (e) => {
  db.antennas.loadDatabase();
  db.antennas.find({}, (err, antennas) => e.reply("loadedAntennas", antennas));
});

ipcMain.on("addAntenna", (e, antenna) => {
  db.antennas.loadDatabase();
  db.antennas.insert(antenna, (err) => {
    if (err) throw new Error(err);
  });

  e.reply("addedAntenna", antenna);
});

ipcMain.on("showAntenna", (e, idAntenna) => {
  db.antennas.loadDatabase();
  db.antennas.findOne({ _id: idAntenna }, (err, antenna) =>
    e.reply("showedAntenna", antenna)
  );
});
ipcMain.on("updateAntenna", (e, antenna) => {
  db.antennas.loadDatabase();
  db.antennas.update({ _id: antenna._id }, { $set: antenna }, {}, (err) => {
    if (err) throw new Error(err);
  });
  e.reply("updatedAntenna", antenna);
});
ipcMain.on("deleteAntenna", (e, idAntenna) => {
  db.antennas.loadDatabase();
  db.antennas.remove({ _id: idAntenna }, {}, (err, docs) => {
    if (err) throw new Error(err);
    e.reply("deletedAntenna", idAntenna);
  });
});
ipcMain.on("importAntennas", (e, antennas) => {
  db.antennas.loadDatabase();
  db.antennas.insert(antennas, (err) => {
    if (err) throw new Error(err);
  });

  e.reply("importedAntennas", antennas);
});

module.exports = { ipcMain };
