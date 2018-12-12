var express = require('express');
var app = express();
var path = require('path');
const sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database("./abcDispatch.db");

var table_cols = ["truck_id", "truck_year_made", "truck_model", "truck_owner"];

//template for return html page that has the option to contain a table
truck_template = "<html><head><style>.topnav {background-color: #333; overflow:hidden;} .topnav a{float:left; color: #f2f2f2; text-align: center;";
truck_template += "padding: 14px 16px; text-decoration: none; font-size: 17px;} .topnav a:hover { background-color:#ccc; color:black;} ";
truck_template += ".topnav a.active{ background-color: #00ace6; color:white;} body {background-color: #007399;} h2{color: #f2f2f2;} table, th, td";
truck_template += "{background-color: #f2f2f2; color: black; border: 1px solid black; padding: 2px 3px; text-align: center;} table{padding: 10px;}";
truck_template += " </style></head><body><div class=\"topnav\"><a href=\"http://localhost:8081/main.html\">Home</a>";
truck_template += "<a href=\"http://localhost:8081/driver.html\">Driver</a><a class=\"active\" href=\"http://localhost:8081/truck.html\">Truck</a>";
truck_template += "<a href=\"http://localhost:8081/inspection.html\">Inspection</a><a href=\"http://localhost:8081/owner.html\">Owner</a>";
truck_template += "<a href=\"http://localhost:8081/warehouse.html\">Warehouse</a><a href=\"http://localhost:8081/delivery.html\">Delivery</a></div>";

exports.createTruckTable = function(){
  db.serialize(function() {
    db.get("PRAGMA foreign_keys = ON");
    //I know the owner can't be null but I allow it to be null so that I can insert something the very first time and then I update it later.
    db.run("CREATE TABLE if not exists truck_info (truck_id TEXT, truck_year_made INTEGER NOT NULL, truck_model TEXT NOT NULL, truck_owner TEXT, PRIMARY KEY(truck_id), FOREIGN KEY(truck_owner) REFERENCES driver_info(driver_id) ON UPDATE CASCADE ON DELETE SET NULL)");
  });
}

exports.post_insert_truck = function(req, res){
  // Prepare output in JSON format
  response = {
     truck_id:req.body.truck_id,
     truck_year_made:req.body.truck_year_made,
     truck_model:req.body.truck_model,
     truck_owner:req.body.truck_owner
  };
  console.log(response);
  let query = insertTruckQuery("truck_info", table_cols, response);
  //SQLite ALTER TABLE does not support altering the foreign key restraints so I have to do some weird stuff with turning the restraints on and off to make up for that since driver and truck are linked in both directions.
  db.get("PRAGMA foreign_keys = OFF");
  db.run(query);
  db.get("PRAGMA foreign_keys = ON");
  db.all("SELECT * FROM truck_info", function(err, rows){
    if(err){
      console.log(err);
    }
    else{
      console.log(rows);
    }
  });
  var page = truck_template;
  page += "<h2> Truck successfully inserted!</h2><a href=\"http://localhost:8081/truck.html\">Go Back</a></body></html>";
  res.send(page);
}

exports.post_update_truck = function(req, res){
  // Prepare output in JSON format
  response = {
    truck_id:req.body.truck_id,
    truck_year_made:req.body.truck_year_made,
    truck_model:req.body.truck_model,
    truck_owner:req.body.truck_owner
  };
  console.log(response);
  let query = updateTruckQuery("truck_info", table_cols, response);
  db.run(query);
  db.all("SELECT * FROM truck_info", function(err, rows){
    if(err){
      console.log(err);
    }
    else{
      console.log(rows);
    }
  });
  var page = truck_template;
  page += "<h2> Truck successfully updated!</h2><a href=\"http://localhost:8081/truck.html\">Go Back</a></body></html>";
  res.send(page);
}

exports.post_delete_truck = function(req, res){
  // Prepare output in JSON format
  response = {
     truck_id:req.body.truck_id
  };
  console.log(response);
  let query = deleteTruckQuery("truck_info", table_cols, response);
  db.run(query);
  db.all("SELECT * FROM truck_info", function(err, rows){
    if(err){
      console.log(err);
    }
    else{
      console.log(rows);
    }
  });
  var page = truck_template;
  page += "<h2> Truck successfully deleted!</h2><a href=\"http://localhost:8081/truck.html\">Go Back</a></body></html>";
  res.send(page);
}

exports.get_truck_list = function(req, res){
  var page = truck_template;
  page += "<h2> Truck's Table</h2>";
  db.all("SELECT * FROM truck_info", function(err, rows){
    if(err){
      console.log(err);
    }
    else{
      page += generateTable(rows);
    }
    page += "</body></html>";
    res.send(page);
  });
}

exports.get_truck_report = function(req, res){
  var page = truck_template;
  page += "<h2> Truck's Table</h2>";
  var stats_q = "SELECT truck_info.truck_id, driver_info.driver_id, driver_info.driver_name,";
  stats_q += " truck_info.truck_owner, inspection_info.inspector_id, inspector_info.inspector_name FROM truck_info,";
  stats_q += " driver_info, inspection_info, inspector_info WHERE driver_info.truck_id = truck_info.truck_id AND";
  stats_q += " truck_info.truck_id = inspection_info.truck_id AND inspection_info.inspector_id = inspector_info.inspector_id";
  stats_q += " ORDER BY truck_info.truck_id";

  db.all(stats_q, function(err, rows){
    if(err){
      console.log(err);
    }
    else{
      page += generateReportTable(rows);
    }
    page += "</body></html>";
    res.send(page);
  });
}

exports.get_truck_region_report = function(req, res){
  var page = truck_template;
  page += "<h2> Truck's Table</h2>";
  var stats_q = "SELECT truck_region_info.region_id, region_info.region_name, truck_info.truck_id,";
  stats_q += " inspection_info.inspector_id, inspector_info.inspector_name FROM truck_region_info, truck_info,";
  stats_q += " region_info, inspection_info, inspector_info WHERE truck_region_info.region_id = region_info.region_id";
  stats_q += " AND truck_region_info.truck_id = truck_info.truck_id AND truck_info.truck_id = inspection_info.truck_id AND ";
  stats_q += "inspection_info.inspector_id = inspector_info.inspector_id ORDER BY truck_info.truck_id";

  db.all(stats_q, function(err, rows){
    if(err){
      console.log(err);
    }
    else{
      console.log(rows);
      page += generateRegionReportTable(rows);
    }
    page += "</body></html>";
    res.send(page);
  });
}

exports.search_truck_id = function(req, res){
  var page = truck_template;
  page += "<h2> Truck's Table</h2>";
  db.all(`SELECT * FROM truck_info WHERE truck_id = \'${req.body.truck_id}\';`, function(err, rows){
    if(err){
      console.log(err);
    }
    else{
      page += generateTable(rows);
    }
    page += "</body></html>";
    res.send(page);
  });
}

exports.search_truck_year = function(req, res){
  var page = truck_template;
  page += "<h2> Truck's Table</h2>";
  db.all(`SELECT * FROM truck_info WHERE truck_year_made = \'${req.body.truck_year_made}\';`, function(err, rows){
    if(err){
      console.log(err);
    }
    else{
      page += generateTable(rows);
    }
    page += "</body></html>";
    res.send(page);
  });
}

exports.search_truck_model = function(req, res){
  var page = truck_template;
  page += "<h2> Truck's Table</h2>";
  db.all(`SELECT * FROM truck_info WHERE truck_model = \'${req.body.truck_model}\';`, function(err, rows){
    if(err){
      console.log(err);
    }
    else{
      page += generateTable(rows);
    }
    page += "</body></html>";
    res.send(page);
  });
}

exports.search_truck_owner = function(req, res){
  var page = truck_template;
  page += "<h2> Truck's Table</h2>";
  db.all(`SELECT * FROM truck_info WHERE truck_owner = \'${req.body.truck_owner}\';`, function(err, rows){
    if(err){
      console.log(err);
    }
    else{
      page += generateTable(rows);
    }
    page += "</body></html>";
    res.send(page);
  });
}

function insertTruckQuery(tableName, columns, obj){
  var q;
  if(obj.truck_owner===''){
    q = generateSqlQuery(tableName, columns, obj) + '\'' + obj.truck_id + '\',' + obj.truck_year_made + ",\'" + obj.truck_model + "\', NULL)";
  }
  else{
    q = generateSqlQuery(tableName, columns, obj) + '\'' + obj.truck_id + '\',' + obj.truck_year_made + ",\'" + obj.truck_model + "\',\'" + obj.truck_owner + "\')";
  }
  console.log(q);
  return q;
}

function updateTruckQuery(tableName, columns, obj){
  var q = `UPDATE truck_info SET truck_year_made = \'${obj.truck_year_made}\', truck_model = \'${obj.truck_model}\', truck_owner = \'${obj.truck_owner}\' WHERE truck_id = \'${obj.truck_id}\';`;
  console.log(q);
  return q;
}

function deleteTruckQuery(tableName, columns, obj){
  var q;
  q = `DELETE FROM truck_info WHERE truck_id = \'${obj.truck_id}\';`;
  console.log(q);
  return q;
}

function generateTable(rows){
  var result = "<table><tr><th>Truck Id</th><th>Year Made</th><th>Truck Model</th><th>Truck Owner</th></tr>";
  var arr=[rows.length];
  for(var i=0; i<rows.length; i++) {
    var temp = [4];
    temp[0] = rows[i].truck_id;
    temp[1] = rows[i].truck_year_made;
    temp[2] = rows[i].truck_model;
    temp[3] = rows[i].truck_owner;
    arr[i] = temp;
  }

  for(var i=0; i<arr.length; i++) {
    result += "<tr>";
    for(var j=0; j<table_cols.length; j++){
        result += "<td>"+arr[i][j]+"</td>";
    }
    result += "</tr>";
  }
  result += "</table>";
  return result;
}

function generateReportTable(rows){
  var result = "<table><tr><th>Truck Id</th><th>Driver ID</th><th>Driver Name</th><th>Truck Owner</th><th>Inspector ID</th><th>Inspector Name</th></tr>";
  var arr=[rows.length];
  for(var i=0; i<rows.length; i++) {
    var temp = [6];
    temp[0] = rows[i].truck_id;
    temp[1] = rows[i].driver_id;
    temp[2] = rows[i].driver_name;
    temp[3] = rows[i].truck_owner;
    temp[4] = rows[i].inspector_id;
    temp[5] = rows[i].inspector_name;
    arr[i] = temp;
  }

  for(var i=0; i<6; i++) {
    result += "<tr>";
    for(var j=0; j<6; j++){
        result += "<td>"+arr[i][j]+"</td>";
    }
    result += "</tr>";
  }
  result += "</table>";
  return result;
}

function generateRegionReportTable(rows){
  var result = "<table><tr><th>Region ID</th><th>Region Name</th><th>Truck Id</th><th>Inspector ID</th><th>Inspector Name</th></tr>";
  var arr=[rows.length];
  for(var i=0; i<rows.length; i++) {
    var temp = [5];
    temp[0] = rows[i].region_id;
    temp[1] = rows[i].region_name;
    temp[2] = rows[i].truck_id;
    temp[3] = rows[i].inspector_id;
    temp[4] = rows[i].inspector_name;
    arr[i] = temp;
  }

  for(var i=0; i < arr.length; i++) {
    result += "<tr>";
    for(var j=0; j<5; j++){
        result += "<td>"+arr[i][j]+"</td>";
    }
    result += "</tr>";
  }
  result += "</table>";
  return result;
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
