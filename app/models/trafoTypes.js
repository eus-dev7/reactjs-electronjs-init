const { db } = require("../database/connection");
var trafoTypes = {
  getAll: (e) => {
    let i = 0;
    for (i = 0; i < 1000000; i++) {}
    db.trafotypes.loadDatabase();
    db.trafotypes.find({}, (err, data) => {
      if (err) e.returnValue = { status: false, data: [] };
      else
        e.returnValue = {
          status: true,
          data: data,
        };
    });
  },
  add: (e, trafoType) => {
    db.trafotypes.loadDatabase();
    db.trafotypes.insert(
      {
        name: trafoType.name,
        minH: trafoType.minH,
        maxH: trafoType.maxH,
        cost: trafoType.cost,
      },
      (err, data) => {
        if (err) e.returnValue = { status: false, data: [] };
        else
          e.returnValue = {
            status: true,
            data: data,
          };
      }
    );
  },
  update: (e, trafoType) => {
    db.trafotypes.loadDatabase();
    db.trafotypes.update(
      { _id: trafoType._id },
      { $set: trafoType },
      {},
      (err, data) => {
        if (err) e.returnValue = { status: false, data: [] };
        else
          e.returnValue = {
            status: true,
            data: data,
          };
      }
    );
  },
  remove: (e, idTrafoType) => {
    db.trafotypes.loadDatabase();
    db.trafotypes.remove({ _id: idTrafoType }, {}, (err, removed) => {
      if (err) e.returnValue = { status: false, data: [] };
      else
        e.returnValue = {
          status: true,
          data: removed,
        };
    });
  },
};

module.exports = trafoTypes;
