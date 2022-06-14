 var sqlite3 = require('sqlite3');
var mkdirp = require('mkdirp');

mkdirp.sync('var/db');

var db = new sqlite3.Database('var/db/volare.db');

db.serialize(function () {
  // create the database schema for the todos app
  db.run("CREATE TABLE IF NOT EXISTS users ( \
    username TEXT UNIQUE, \
    firstname TEXT, \
    lastname TEXT, \
    email TEXT UNIQUE, \
    email_verified INTEGER \
  )");

  db.run("CREATE TABLE IF NOT EXISTS applications ( \
    id TEXT UNIQUE, \
    username TEXT, \
    timestamp TEXT \
    sequence_number TEXT \
    country TEXT \
    form TEXT \
    status TEXT \
  )");


});

db.all('select * from applications', (error, rows) => {

  rows && rows.forEach(element => {
    console.log('>>> application: ', element);
  });
});

module.exports = db;
