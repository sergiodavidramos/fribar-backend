const BKP = require("mongodb-snapshot");
const path = require("path");
const fs = require("fs");
require("dotenv").config();
async function copiaSeguridad(restore = false) {
  restore = restore === "true" ? true : false;
  try {
    const mongo_connector = new BKP.MongoDBDuplexConnector({
      connection: { uri: process.env.DB_URI, dbname: process.env.NAMEDB },
    });
    const localfile_connector = new BKP.LocalFileSystemDuplexConnector({
      connection: { path: "./components/backup/files/backup.tar" },
    });
    const transferer = restore
      ? new BKP.MongoTransferer({
          source: localfile_connector,
          targets: [mongo_connector],
        })
      : new BKP.MongoTransferer({
          source: mongo_connector,
          targets: [localfile_connector],
        });
    for await (const { total, write } of transferer) {
    }
    const pathBack = path.join(__dirname, `./files/backup.tar`);
    if (!restore) {
      if (fs.existsSync(pathBack)) {
        console.log(path);
        return path.resolve(pathBack);
      }
    } else {
      return true;
    }
  } catch (error) {}
}
module.exports = {
  copiaSeguridad,
};
