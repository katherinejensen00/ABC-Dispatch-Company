var express = require('express');
var app = express();
var path = require('path');
const sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database("./abcDispatch.db");

var table_cols = ["driver_id", "driver_name", "driver_lic_no", "trained_by", "truck_id"];

//template for return html page that has the option to contain a table
driver_template = "<html><head><style>.topnav {background-color: #333; overflow:hidden;} .topnav a{float:left; color: #f2f2f2; text-align: center;";
driver_template += "padding: 14px 16px; text-decoration: none; font-size: 17px;} .topnav a:hover { background-color:#ccc; color:black;} ";
driver_template += ".topnav a.active{ background-color: #00ace6; color:white;} body {background-color: #007399;} h2{color: #f2f2f2;} table, th, td";
driver_template += "{background-color: #f2f2f2; color: black; border: 1px solid black; padding: 2px 3px; text-align: center;} table{padding: 10px;}";
driver_template += " </style></head><body><div class=\"topnav\"><a href=\"http://localhost:8081/main.html\">Home</a><a class=\"active\"";
driver_template += "href=\"http://localhost:8081/driver.html\">Driver</a><a href=\"http://localhost:8081/truck.html\">Truck</a>";
driver_template += "<a href=\"http://localhost:8081/inspection.html\">Inspection</a><a href=\"http://localhost:8081/owner.html\">Owner</a>";
driver_template += "<a href=\"http://localhost:8081/warehouse.html\">Warehouse</a><a href=\"http://localhost:8081/delivery.html\">Delivery</a></div>";

exports.createDriverTable = function(){
  db.serialize(function() {
    //SQLite ALTER TABLE does not support altering the foreign key restraints so I have to do some weird stuff with turning the restraints on and off to make up for that since driver and truck are linked in both directions.
    db.get("PRAGMA foreign_keys = OFF");
    db.run("CREATE TABLE if not exists driver_info (driver_id TEXT, driver_name TEXT NOT NULL, driver_lic_no TEXT NOT NULL UNIQUE, trained_by TEXT, truck_id TEXT NOT NULL, PRIMARY KEY(driver_id), FOREIGN KEY(trained_by) REFERENCES driver_info(driver_id) ON UPDATE CASCADE ON DELETE SET NULL, FOREIGN KEY(truck_id) REFERENCES truck_info(truck_id) ON UPDATE CASCADE ON DELETE SET NULL)");
    db.get("PRAGMA foreign_keys = ON");
  });
}

exports.post_insert_driver = function(req, res){
  // Prepare output in JSON format
  response = {
     driver_id:req.body.driver_id,
     driver_name:req.body.driver_name,
     driver_lic_no:req.body.driver_lic_no,
     trainer:req.body.trainer,
     truck_id:req.body.truck_id
  };
  console.log(response);
  let query = insertDriverQuery("driver_info", table_cols, response);
  db.run(query);
  db.all("SELECT * FROM driver_info", function(err, rows){
    if(err){
      console.log(err);
    }
    else{
      console.log(rows);
    }
  });
  var page = driver_template;
  page += "<h2> Driver successfully inserted!</h2><a href=\"http://localhost:8081/driver.html\">Go Back</a></body></html>";
  res.send(page);
}

exports.post_update_driver = function(req, res){
  // Prepare output in JSON format
  response = {
     driver_id:req.body.driver_id,
     driver_name:req.body.driver_name,
     driver_lic_no:req.body.driver_lic_no,
     trainer:req.body.trainer,
     truck_id:req.body.truck_id
  };
  console.log(response);
  let query = updateDriverQuery("driver_info", table_cols, response);
  db.run(query);
  db.all("SELECT * FROM driver_info", function(err, rows){
    if(err){
      console.log(err);
    }
    else{
      console.log(rows);
    }
  });
  var page = driver_template;
  page += "<h2> Driver successfully updated!</h2><a href=\"http://localhost:8081/driver.html\">Go Back</a></body></html>";
  res.send(page);
}

exports.post_delete_driver = function(req, res){
  // Prepare output in JSON format
  response = {
     driver_id:req.body.driver_id
  };
  console.log(response);
  let query = deleteDriverQuery("driver_info", table_cols, response);
  db.run(query);
  db.all("SELECT * FROM driver_info", function(err, rows){
    if(err){
      console.log(err);
    }
    else{
      console.log(rows);
    }
  });
  var page = driver_template;
  page += "<h2> Driver successfully deleted!</h2><a href=\"http://localhost:8081/driver.html\">Go Back</a></body></html>";
  res.send(page);
}

exports.get_driver_list = function(req, res){
  var page = driver_template;
  page += "<h2> Driver's Table</h2>";
  db.all("SELECT * FROM driver_info", function(err, rows){
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

exports.get_driver_stats = function(req, res){
  var page = driver_template;
  page += "<h2> Driver's Table</h2>";
  db.all("SELECT * FROM driver_info", function(err, rows){
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

exports.search_driver_id = function(req, res){
  var page = driver_template;
  page += "<h2> Driver's Table</h2>";
  db.all(`SELECT * FROM driver_info WHERE driver_id = \'${req.body.driver_id}\';`, function(err, rows){
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

exports.search_driver_name = function(req, res){
  var page = driver_template;
  page += "<h2> Driver's Table</h2>";
  db.all(`SELECT * FROM driver_info WHERE driver_name = \'${req.body.driver_name}\';`, function(err, rows){
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

exports.search_driver_license = function(req, res){
  var page = driver_template;
  page += "<h2> Driver's Table</h2>";
  db.all(`SELECT * FROM driver_info WHERE driver_lic_no = \'${req.body.driver_lic_no}\';`, function(err, rows){
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

exports.search_driver_trainer = function(req, res){
  var page = driver_template;
  page += "<h2> Driver's Table</h2>";
  db.all(`SELECT * FROM driver_info WHERE trained_by = \'${req.body.trainer}\';`, function(err, rows){
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

exports.search_driver_truck = function(req, res){
  var page = driver_template;
  page += "<h2> Driver's Table</h2>";
  db.all(`SELECT * FROM driver_info WHERE truck_id = \'${req.body.truck_id}\';`, function(err, rows){
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

function insertDriverQuery(tableName, columns, obj){
  var q;
  if(obj.trainer===''){
    q = generateSqlQuery(tableName, columns, obj) + "\'" + obj.driver_id + "\',\'" + obj.driver_name + "\',\'" + obj.driver_lic_no + "\', NULL,\'" + obj.truck_id + "\')";
  }
  else{
    q = generateSqlQuery(tableName, columns, obj) + "\'" + obj.driver_id + "\',\'" + obj.driver_name + "\',\'" + obj.driver_lic_no + "\',\'" + obj.trainer + "\',\'" + obj.truck_id + "\')";
  }
  //let q = generateSqlQuery(tableName, columns, obj) + "\'" + obj.driver_id + "\',\'" + obj.driver_name + "\',\'" + obj.driver_lic_no + "\',\'" + obj.trainer + "\',\'" + obj.truck_id + "\')";
  console.log(q);
  return q;
}

function updateDriverQuery(tableName, columns, obj){
  var q;
  if(obj.trainer===''){
    // Update only updates if it find a matching record but it doesn't error if it doesn't find a match
    q = `UPDATE driver_info SET driver_name = \'${obj.driver_name}\', driver_lic_no = \'${obj.driver_lic_no}\', trained_by = NULL, truck_id = \'${obj.truck_id}\' WHERE driver_id = \'${obj.driver_id}\';`;
  }
  else{
    // Delete only updates if it find a matching record but it doesn't error if it doesn't find a match
    q = `UPDATE driver_info SET driver_name = \'${obj.driver_name}\', driver_lic_no = \'${obj.driver_lic_no}\', trained_by = \'${obj.trainer}\', truck_id = \'${obj.truck_id}\' WHERE driver_id = \'${obj.driver_id}\';`;
  }
  console.log(q);
  return q;
}

function deleteDriverQuery(tableName, columns, obj){
  var q;
  q = `DELETE FROM driver_info WHERE driver_id = \'${obj.driver_id}\';`;
  console.log(q);
  return q;
}

function generateTable(rows){
  var result = "<table><tr><th>Driver Id</th><th>Name</th><th>License Number</th><th>Trained By</th><th>Truck Id</th></tr>";
  var arr=[rows.length];
  for(var i=0; i<rows.length; i++) {
    var temp = [5];
    temp[0] = rows[i].driver_id;
    temp[1] = rows[i].driver_name;
    temp[2] = rows[i].driver_lic_no;
    temp[3] = rows[i].trained_by;
    temp[4] = rows[i].truck_id;
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
