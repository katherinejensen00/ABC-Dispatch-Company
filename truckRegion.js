var express = require('express');
var app = express();
var path = require('path');
const sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database("./abcDispatch.db");

var table_cols = ["truck_id", "region_id"];

//template for return html page that has the option to contain a table
truck_region_template = "<html><head><style>.topnav {background-color: #333; overflow:hidden;} .topnav a{float:left; color: #f2f2f2; text-align: center;";
truck_region_template += "padding: 14px 16px; text-decoration: none; font-size: 17px;} .topnav a:hover { background-color:#ccc; color:black;} ";
truck_region_template += ".topnav a.active{ background-color: #00ace6; color:white;} body {background-color: #007399;} h2{color: #f2f2f2;} table, th, td";
truck_region_template += "{background-color: #f2f2f2; color: black; border: 1px solid black; padding: 2px 3px; text-align: center;} table{padding: 10px;}";
truck_region_template += " </style></head><body><div class=\"topnav\"><a href=\"http://localhost:8081/main.html\">Home</a>";
truck_region_template += "<a href=\"http://localhost:8081/driver.html\">Driver</a><a class=\"active\" href=\"http://localhost:8081/truck.html\">Truck</a>";
truck_region_template += "<a href=\"http://localhost:8081/inspection.html\">Inspection</a><a href=\"http://localhost:8081/owner.html\">Owner</a>";
truck_region_template += "<a href=\"http://localhost:8081/warehouse.html\">Warehouse</a><a href=\"http://localhost:8081/delivery.html\">Delivery</a></div>";

exports.createTruckRegionTable = function(){
  db.serialize(function() {
    db.get("PRAGMA foreign_keys = ON");
    db.run("CREATE TABLE if not exists truck_region_info (truck_id TEXT NOT NULL, region_id TEXT NOT NULL, PRIMARY KEY(truck_id, region_id), FOREIGN KEY(truck_id) REFERENCES truck_info(truck_id) ON UPDATE CASCADE ON DELETE SET NULL, FOREIGN KEY(region_id) REFERENCES region_info(region_id) ON UPDATE CASCADE ON DELETE SET NULL)");
  });
}

exports.post_insert_truck_region = function(req, res){
  // Prepare output in JSON format
  response = {
     truck_id:req.body.truck_id,
     region_id:req.body.region_id
  };
  console.log(response);
  let query = insertTruckRegionQuery("truck_region_info", table_cols, response);
  try{
      db.run(query);
  }
  catch (e){
    var page = truck_region_template;
    page += "<h2> Truck Region failed to insert. Did you enter a truck and a region that already exist?</h2><a href=\"http://localhost:8081/truck.html\">Go Back</a></body></html>";
    res.send(page);
  }
  db.all("SELECT * FROM truck_region_info", function(err, rows){
    if(err){
      console.log(err);
    }
    else{
      console.log(rows);
    }
  });
  var page = truck_region_template;
  page += "<h2> Truck Region successfully inserted!</h2><a href=\"http://localhost:8081/truck.html\">Go Back</a></body></html>";
  res.send(page);
}

exports.post_delete_truck_region = function(req, res){
  // Prepare output in JSON format
  response = {
     truck_id:req.body.truck_id,
     region_id:req.body.region_id
  };
  console.log(response);
  let query = deleteTruckRegionQuery(table_cols, response);
  db.run(query);
  db.all("SELECT * FROM truck_region_info", function(err, rows){
    if(err){
      console.log(err);
    }
    else{
      console.log(rows);
    }
  });
  var page = truck_region_template;
  page += "<h2> Truck Region successfully deleted!</h2><a href=\"http://localhost:8081/truck.html\">Go Back</a></body></html>";
  res.send(page);
}

function insertTruckRegionQuery(tableName, columns, obj){
  let q = generateSqlQuery(tableName, columns, obj) + '\'' + obj.truck_id + '\',\'' + obj.region_id + "\')";
  console.log(q);
  return q;
}

function deleteTruckRegionQuery(columns, obj){
  var q;
  q = `DELETE FROM truck_region_info WHERE truck_id = \'${obj.truck_id}\' AND region_id = \'${obj.region_id}\';`;
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
