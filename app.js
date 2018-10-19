var express = require('express');
var sqlite = require('sqlite3');
var app = express();
var bp = require('body-parser');
var db = new sqlite.Database('museum.db');

app.use(bp.urlencoded({extended: true}))
.use('/assets', express.static('public'))

.get('/', (request, response) => {
  response.setHeader("Content-Type", "text/html");
  db.all(`SELECT * FROM collections;`, (err, collections) => {
    response.render(`index.pug`, {collections: collections});
  })
})

.get(`/collection/:id`, (request, response) => {
  response.setHeader("Content-Type", "text/html");
  let id = request.params.id;
  db.each(`SELECT * FROM collections WHERE id = ${id}`, (error, collection) =>{
      let title = collection.name
      db.all(`SELECT * FROM categories`, (error, categories) => {
        if (request.query != {}) {
          let category = request.query.category;
          if(category != 0 && category !== undefined) {
            console.log("Request != 0");
            db.all(`SELECT o.name as oName, o.id as oId , ca.name as caName FROM oeuvres o, collections cl, categories ca WHERE collection_id = cl.id AND cl.id = ${id} AND category_id = ca.id AND ca.id AND ca.id = ${category}`, (request, oeuvres) => {
              response.render('category.pug', {title: title, oeuvres: oeuvres, categories: categories, sCategory: category});
            });
          } else {
            console.log("Request == 0");
            db.all(`SELECT o.name as oName, o.id as oId , ca.name as caName FROM oeuvres o, collections cl, categories ca WHERE collection_id = cl.id AND cl.id = ${id} AND category_id = ca.id`, (request, oeuvres) => {
              response.render('category.pug', {title: title, oeuvres: oeuvres, categories: categories, sCategory: category});
            });
          }
        } else {
          console.log("No parameter");
          db.all(`SELECT o.name as oName, o.id as oId , ca.name as caName FROM oeuvres o, collections cl, categories ca WHERE collection_id = cl.id AND cl.id = ${id} AND category_id = ca.id;`, (request, oeuvres) => {
            response.render('category.pug', {title: title, oeuvres: oeuvres, categories: categories, sCategory: 0});
          });
        }
      });
  });
})

.get('/collections/form', (request, response) => {
  response.setHeader("Content-Type", "text/html");
  db.all(`SELECT * FROM collections WHERE permanent = 0;`, (err, collections) => {
    response.render(`collections.pug`, {collections: collections});
  })
})

.post('/collections/delete', (request, response) => {
  response.setHeader("Content-Type", "text/html");
  db.run(`DELETE FROM collections WHERE id = ${request.body.collection}`);
  response.redirect('/collections/form');
})

.get('/oeuvre/form', (request, response) => {
  response.setHeader("Content-Type", "text/html");
  db.all(`SELECT * FROM collections;`, (err, collections) => {
    db.all(`SELECT * FROM categories;`, (err, categories) => {
      response.render(`oeuvre.pug`, {collections: collections, categories: categories});
    })
  })
})

.post('/oeuvre/create', (request, response) => {
  response.setHeader("Content-Type", "text/html");
  console.log(request.body);
  db.run(`INSERT INTO oeuvres (name, collection_id, category_id) VALUES ('${request.body.name}', ${request.body.collection}, ${request.body.category})`);
  response.redirect(`/collection/${request.body.collection}`);
})

.listen(3000);