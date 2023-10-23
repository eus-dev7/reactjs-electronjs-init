var old_medium_voltage = {
  _id: "asdfw", //id unique
  coordinates: [
    [
      [1, 1],
      [2, 2],
    ],
    [
      [3, 3],
      [4, 4],
    ],
  ], // [[[1,1],[2,2]],[[3,3],[4,4]]]
};
var municipalities = {
  _id: "asdf",
  name: "Colomi",
  lat: -17.188306274640915,
  lng: -65.89609131217003,
  polylines: [{ lat: -17.1984610076374, lng: -66.0023943366263 }],
};
var municipal_divisions = {
  _id: "asdf",
  name: "Distrito 1",
  lat: -17.188306274640915,
  lng: -65.89609131217003,
  polylines: [{ lat: -17.1984610076374, lng: -66.0023943366263 }],
  id_municipality: "asdf",
};
var communities = {
  _id: "asdf",
  name: "Distrito 1",
  lat: -17.188306274640915,
  lng: -65.89609131217003,
  polylines: [{ lat: -17.1984610076374, lng: -66.0023943366263 }],
  id_municipality: "asdf",
  id_municipal_division: "asfd",
};
var houses = {
  _id: "03becc8cd38bbac9",
  code: "DL10", //code for house
  family: "", // family name
  lat: -17.200431, // latitude
  lng: -65.998074, // longitude
  conditionElectrify: "free", //conditions free:to_electrify:solar:densification
  state: "Permanete",
  id_municipality: "TscLzrxnSWqKr07I",
  id_municipal_division: "fd14618536c8edf9",
  id_community: "4e4001faed0503dc",
};
var trafos = {
  _id: "asdfsad", // string
  position: {
    lat: 0, // latutide
    lng: 0, // longitude
  },
  draggable: true, // marker draggable true:false
  radius: 700, //trafo radius distace low voltaje
  type: "", // tower:connection
  name: "", //name for trafo
  houses: [], //list houses
  mvTrafos: [], //list trafos medium voltage
  lvLines: [], //lineas low voltage
  mvLines: [], //lines medium voltage
  id_community: "",
  id_municipal_division: "",
  id_municipality: "",
};

var conn_mv = {
  _id: "asdf", //id unique
  position: {
    lat: 0,
    lng: 0,
  },
  name: "",
  draggable: true,
  trafos: [],
};

var new_medium_voltage = {
  _id: "d0efbe5bebb46e67",
  distance: 979.96,
  from: {
    _id: "93aa0bdc76564138",
    position: [-17.920837799793865, -64.99657032990771],
    name: "R1-A1",
    type: "tower",
    levelNode: 0,
  },
  to: {
    _id: "8c1f0063a7ea427c",
    position: [-17.923526157484837, -65.00538041663594],
    name: "R1-B1",
    type: "tower",
    levelNode: 0,
  },
  middle: { lat: -17.92218197863935, lng: -65.00097537327183 },
  level: 0,
};
// settings solo hay una sola configuracion
var settings = {
  _id: "1",
  projectName: "Proyecto de electrificación Omereque",
  lastOpenedFile: "",
  radioDistance: 700,
  poleDistanceLV: 50,
  poleCostLV: 0,
  cordCostLV: 7,
  poleDistanceMV: 70,
  poleCostMV: 0,
  cordCostMV: 10,
  transformerCostMV: 3000,
  limitCost: 35000,
  flexibleCost: 3500,
  flexiblePercentage: 10,
  densificationDistance: 100,
};

var connections = {
  _id: "f06870dc367c5f13",
  position: { lat: -17.93004267092971, lng: -64.98807283073818 },
  draggable: true,
  radius: 0,
  type: "connection",
  name: "Punto de conexion-1",
  lines: [],
  id_trafo: "93aa0bdc76564138",
  enabled: true,
};
