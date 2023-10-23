const { db } = require("../database/connection");
var appConfig = {
  getById: (e, id) => {
    db.appConfig.loadDatabase();
    db.appConfig.findOne({ _id: id }, (err, response) => {
      if (err) e.returnValue = { status: false, data: [] };
      else
        e.returnValue = {
          status: true,
          data: response,
        };
    });
  },
  updateAppConfig: (e, config) => {
    db.appConfig.loadDatabase();
    db.appConfig.update({ _id: "1" }, { $set: config }, {}, (err, response) => {
      if (err) e.returnValue = { status: false, data: [] };
      else
        e.returnValue = {
          status: true,
          data: response,
        };
    });
  },
};

module.exports = appConfig;
