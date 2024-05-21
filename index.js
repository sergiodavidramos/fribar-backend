const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const router = require("./network/routes");
const db = require("./db");
const path = require("path");
const cors = require("cors");
const server = require("http").Server(app);
const socket = require("./socket");
const errors = require("./network/errors");
const {
  escucharSockets,
  escucharMapaDelivery,
} = require("./components/Socket");

socket.connect(server);
require("dotenv").config();
//   origin: ["http://localhost:3000", "http://localhost:3002"],
var corsOptions = {
  origin: "*",
  methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
db(process.env.DB_URL);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, "./public")));

router(app);

escucharSockets();
app.use(errors);
server.listen(process.env.PORT, () => {
  console.log("Server listen en the PORT: ", process.env.PORT);
});
