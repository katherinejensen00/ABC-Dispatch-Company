var express = require('express');
var app = express();
var path = require('path');
const sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database("./abcDispatch.db");

var table_cols = ["driver_id", "benefit_id"];

exports.createDriverBenefitTable = function(){
  db.serialize(function() {
    db.get("PRAGMA foreign_keys = ON");
    db.run("CREATE TABLE if not exists driver_benefit_info (driver_id TEXT NOT NULL, benefit_id TEXT NOT NULL, PRIMARY KEY(driver_id, benefit_id), FOREIGN KEY(driver_id) REFERENCES driver_info(driver_id) ON UPDATE CASCADE ON DELETE SET NULL, FOREIGN KEY(benefit_id) REFERENCES benefit_info(benefit_id) ON UPDATE CASCADE ON DELETE SET NULL)");
  });
}

exports.post_insert_driver_benefit = function(req, res){
  // Prepare output in JSON format
  response = {
     driver_id:req.body.driver_id,
     benefit_id:req.body.benefit_id
  };
  console.log(response);
  let query = insertDriverBenefitQuery("driver_benefit_info", table_cols, response);
  db.run(query);
  db.all("SELECT * FROM driver_benefit_info", function(err, rows){
    if(err){
      console.log(err);
    }
    else{
      console.log(rows);
    }
  });
  res.send("<html><head><style> body {background-color: #007399; color: #f2f2f2} </style></head><body><h2> Driver's Benefit successfully inserted!</h2><a href=\"./driver.html\">Go Back</a></body></html>");
  //res.sendFile('main.html', {root: __dirname});
  //app.use('/',express.static(path.join(__dirname, '../driver.html')));
}

exports.post_delete_driver_benefit = function(req, res){
  // Prepare output in JSON format
  response = {
     driver_id:req.body.driver_id,
     benefit_id:req.body.benefit_id
  };
  console.log(response);
  let query = deleteDriverBenefitQuery(table_cols, response);
  db.run(query);
  db.all("SELECT * FROM driver_benefit_info", function(err, rows){
    if(err){
      console.log(err);
    }
    else{
      console.log(rows);
    }
  });
  res.send("<html><head><style> body {background-color: #007399; color: #f2f2f2} </style></head><body><h2> Driver's Benefit successfully deleted!</h2><a href=\"./driver.html\">Go Back</a></body></html>");
  //res.sendFile('main.html', {root: __dirname});
  //app.use('/',express.static(path.join(__dirname, '../driver.html')));
}

function insertDriverBenefitQuery(tableName, columns, obj){
  //Come back to this and deal with null values for optional trained_by and add truck_id once you work out foreign key
  let q = generateSqlQuery(tableName, columns, obj) + '\'' + obj.driver_id + '\',\'' + obj.benefit_id + "\')";
  console.log(q);
  return q;
}

function deleteDriverBenefitQuery(columns, obj){
  var q;
  q = `DELETE FROM driver_benefit_info WHERE driver_id = \'${obj.driver_id}\' AND benefit_id = \'${obj.benefit_id}\';`;
  console.log(q);
  return q;
}

function generateSqlQuery(tableName, columns, obj){
  this.generatedSqlQuery = `INSERT INTO ${tableName}`;
  let columnList = "";
  columnList = columnList + "("
  for (let index = 0; index < columns.length; index++) {
    if (index == columns.length - 1) {
      columnList = columnList + columns[index];
    } else {
      columnList = columnList + columns[index] + ",";
    }
  }
  this.generatedSqlQuery = this.generatedSqlQuery + columnList + ") VALUES (";
  return this.generatedSqlQuery;
}
