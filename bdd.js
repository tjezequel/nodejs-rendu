const sqlite = require("sqlite3");
var db = new sqlite.Database("museum.db");

db.serialize(() => {

  db.run(
    `CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      name
    );`
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS collections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name,
      permanent INTEGER
    );`
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS oeuvres (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name,
      collection_id INTEGER,
      category_id INTEGER,
      FOREIGN KEY (collection_id) REFERENCES collections(id),
      FOREIGN KEY (category_id) REFERENCES categories(id)
    )`
  );

  let insertCategories = db.prepare("INSERT INTO categories (name) VALUES (?);");
  let categories = [
      "Peinture",
      "Sculpture"
  ]
  for (let i in categories) {
      insertCategories.run(categories[i]);
  }

  let insertCollections = db.prepare("INSERT INTO collections (name, permanent) VALUES (?,?);");
  let collections = [
      {name: "Art Oriental", permanent: 1},
      {name: "Art Nouveau", permanent: 1},
      {name: "Art Moderne", permanent: 0}
  ]
  for (let i in collections) {
      insertCollections.run(collections[i].name, collections[i].permanent);
  }

  let insertOeuvres = db.prepare("INSERT INTO oeuvres (name, collection_id, category_id) VALUES (?,?,?);");
  let oeuvres = [
      {name: "Haricot perdu... Sérieusement ?", collection_id: 1, category_id: 1},
      {name: "Ki", collection_id: 1, category_id: 2},
      {name: "Le Chapiteau dressé", collection_id: 2, category_id: 1},
      {name: "De Bon Matin", collection_id: 2, category_id: 2},
      {name: "Street Art On Plate", collection_id: 3, category_id: 1},
      {name: "Plate For Street Art", collection_id: 3, category_id: 2}
  ]
  for (let i in oeuvres) {
      insertOeuvres.run(oeuvres[i].name, oeuvres[i].collection_id, oeuvres[i].category_id);
  }
  
})