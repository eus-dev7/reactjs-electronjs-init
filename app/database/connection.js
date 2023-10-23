const { app } = require("electron");
const Datastore = require("nedb");
//const crypto = require("crypto");

var appData = app.getPath("userData") + "/";
//console.log(app.getPath("userData"));
// para encriptar y desencriptar database
// const path = require('path') // path for database
// const Datastore = require("nedb") // of course you need NeDB
// const crypto = require('crypto') // now is in node default module

// let algorithm = 'aes-256-cbc' // you can choose many algorithm from supported openssl
// let secret = 'superSecretKey'
// let key = crypto.createHash('sha256').update(String(secret)).digest('base64').substr(0, 32)
// const ALGORITHM = "aes-256-cbc";
// const BLOCK_SIZE = 16;
// const KEY_SIZE = 32;
// const key = crypto.randomBytes(KEY_SIZE);
const IS_DEV = true;
if (IS_DEV) {
  appData = "";
}

exports.db = {
  appConfig: new Datastore({
    filename: appData + "appConfigs/appConfig.dat",
    autoload: false,
  }),
  settings: new Datastore({
    filename: appData + "datastores/settings.db",
    autoload: false,
  }),
  municipalities: new Datastore({
    filename: appData + "datastores/municipalities.db",
    autoload: false,
  }),
  municipalDivisions: new Datastore({
    filename: appData + "datastores/municipal_divisions.db",
    autoload: false,
  }),
  communities: new Datastore({
    filename: appData + "datastores/communities.db",
    autoload: false,
  }),
  houses: new Datastore({
    filename: appData + "datastores/houses.db",
    autoload: false,
  }),
  trafotypes: new Datastore({
    filename: appData + "datastores/trafotypes.db",
    autoload: false,
  }),
  trafos: new Datastore({
    filename: appData + "datastores/trafos.db",
    autoload: false,
  }),
  connections: new Datastore({
    filename: appData + "datastores/connections.db",
    autoload: false,
  }),
  oldMediumVoltage: new Datastore({
    filename: appData + "datastores/old_medium_voltage.db",
    autoload: false,
  }),
  newMediumVoltage: new Datastore({
    filename: appData + "datastores/new_medium_voltage.db",
    autoload: false,
  }),
  densifiedLines: new Datastore({
    filename: appData + "datastores/densified_lines.db",
    autoload: false,
  }),
  branchs: new Datastore({
    filename: appData + "datastores/branchs.db",
    autoload: false,
  }),
  type: new Datastore({
    filename: appData + "datastores/type.db",
    autoload: false,
  }),
  antennas: new Datastore({
    filename: appData + "datastores/antennas.db",
    autoload: false,
  }),
};
