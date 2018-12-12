var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
const sqlite3 = require('sqlite3').verbose();

//variables that represent the js files for each page
var driver = require("./driver.js");
var benefit = require("./benefit.js");
var driverBenefit = require("./driverBenefit.js");
var truck = require("./truck.js");
var region = require("./region.js");
var truckRegion = require("./truckRegion.js");
var inspector = require("./inspector.js");
var inspection = require("./inspection.js");
var warehouse = require("./warehouse.js");
var loadingDock = require("./loadingDock.js");
var owner = require("./owner.js");
var ownership = require("./ownership.js");
var item = require("./item.js");
var delivery = require("./delivery.js");

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

//Create tables if they have not been created already.
driver.createDriverTable();
benefit.createBenefitsTable();
driverBenefit.createDriverBenefitTable();
truck.createTruckTable();
region.createRegionTable();
truckRegion.createTruckRegionTable();
inspector.createInspectorTable();
inspection.createInspectionTable();
warehouse.createWarehouseTable();
loadingDock.createLoadingDockTable();
owner.createOwnerTable();
ownership.createOwnershipTable();
item.createItemTable();
delivery.createDeliveryTable();

app.use('/',express.static(__dirname +'/'));

// Redirect calls to their respective js files
// Insert Calls
app.post('/insert_driver_post/', urlencodedParser, function (req, res) {
    driver.post_insert_driver(req, res);
 });

 app.post('/insert_benefit_post/', urlencodedParser, function (req, res) {
   benefit.post_insert_benefit(req, res);
});

app.post('/insert_truck_post/', urlencodedParser, function (req, res) {
  truck.post_insert_truck(req, res);
});

app.post('/insert_region_post/', urlencodedParser, function (req, res) {
   region.post_insert_region(req, res);
});
app.post('/insert_inspection_post/', urlencodedParser, function (req, res) {
    inspection.post_insert_inspection(req, res);
 });

app.post('/insert_inspector_post/', urlencodedParser, function (req, res) {
    inspector.post_insert_inspector(req, res);
});

app.post('/insert_owner_post/', urlencodedParser, function (req, res) {
    owner.post_insert_owner(req, res);
});

app.post('/insert_ownership_post/', urlencodedParser, function (req, res) {
    ownership.post_insert_ownership(req, res);
});

app.post('/insert_warehouse_post/', urlencodedParser, function (req, res) {
    warehouse.post_insert_warehouse(req, res);
});

app.post('/insert_loading_dock_post/', urlencodedParser, function (req, res) {
    loadingDock.post_insert_loading_dock(req, res);
});

app.post('/insert_delivery_post/', urlencodedParser, function (req, res) {
    delivery.post_insert_delivery(req, res);
});

app.post('/insert_item_post/', urlencodedParser, function (req, res) {
    item.post_insert_item(req, res);
});

app.post('/insert_truck_region_post/', urlencodedParser, function (req, res) {
    truckRegion.post_insert_truck_region(req, res);
});

app.post('/insert_driver_benefit_post/', urlencodedParser, function (req, res) {
    driverBenefit.post_insert_driver_benefit(req, res);
});

// Update Calls
app.post('/update_driver_post/', urlencodedParser, function (req, res) {
    driver.post_update_driver(req, res);
});

app.post('/update_benefit_post/', urlencodedParser, function (req, res) {
    benefit.post_update_benefit(req, res);
});

app.post('/update_truck_post/', urlencodedParser, function (req, res) {
    truck.post_update_truck(req, res);
});

app.post('/update_region_post/', urlencodedParser, function (req, res) {
    region.post_update_region(req, res);
});

app.post('/update_inspection_post/', urlencodedParser, function (req, res) {
    inspection.post_update_inspection(req, res);
});

app.post('/update_inspector_post/', urlencodedParser, function (req, res) {
    inspector.post_update_inspector(req, res);
});

app.post('/update_owner_post/', urlencodedParser, function (req, res) {
    owner.post_update_owner(req, res);
});

app.post('/update_warehouse_post/', urlencodedParser, function (req, res) {
    warehouse.post_update_warehouse(req, res);
});

app.post('/update_loading_dock_post/', urlencodedParser, function (req, res) {
    loadingDock.post_update_loading_dock(req, res);
});

app.post('/update_item_post/', urlencodedParser, function (req, res) {
    item.post_update_item(req, res);
});

// Delete calls
app.post('/delete_driver_post/', urlencodedParser, function (req, res) {
    driver.post_delete_driver(req, res);
});

app.post('/delete_benefit_post/', urlencodedParser, function (req, res) {
    benefit.post_delete_benefit(req, res);
});

app.post('/delete_truck_region_post/', urlencodedParser, function (req, res) {
    truckRegion.post_delete_truck_region(req, res);
});

app.post('/delete_driver_benefit_post/', urlencodedParser, function (req, res) {
    driverBenefit.post_delete_driver_benefit(req, res);
});

app.post('/delete_truck_post/', urlencodedParser, function (req, res) {
    truck.post_delete_truck(req, res);
});

app.post('/delete_region_post/', urlencodedParser, function (req, res) {
    region.post_delete_region(req, res);
});

app.post('/delete_inspection_post/', urlencodedParser, function (req, res) {
    inspection.post_delete_inspection(req, res);
});

app.post('/delete_inspector_post/', urlencodedParser, function (req, res) {
    inspector.post_delete_inspector(req, res);
});

app.post('/delete_owner_post/', urlencodedParser, function (req, res) {
    owner.post_delete_owner(req, res);
});

app.post('/delete_ownership_post/', urlencodedParser, function (req, res) {
    ownership.post_delete_ownership(req, res);
});

app.post('/delete_warehouse_post/', urlencodedParser, function (req, res) {
    warehouse.post_delete_warehouse(req, res);
});

app.post('/delete_loading_dock_post/', urlencodedParser, function (req, res) {
    loadingDock.post_delete_loading_dock(req, res);
});

app.post('/delete_delivery_post/', urlencodedParser, function (req, res) {
    delivery.post_delete_delivery(req, res);
});

app.post('/delete_item_post/', urlencodedParser, function (req, res) {
    item.post_delete_item(req, res);
});

// Get List Calls
app.get('/get_driver_list/', function (req, res){
  driver.get_driver_list(req, res);
});

app.get('/get_benefit_list/', function (req, res){
  benefit.get_benefit_list(req, res);
});

app.get('/get_truck_list/', function (req, res){
  truck.get_truck_list(req, res);
});

app.get('/get_region_list/', function (req, res){
  region.get_region_list(req, res);
});

app.get('/get_inspection_list/', function (req, res){
  inspection.get_inspection_list(req, res);
});

app.get('/get_inspector_list/', function (req, res){
  inspector.get_inspector_list(req, res);
});

app.get('/get_owner_list/', function (req, res){
  owner.get_owner_list(req, res);
});

app.get('/get_ownership_list/', function (req, res){
  ownership.get_ownership_list(req, res);
});

app.get('/get_warehouse_list/', function (req, res){
  warehouse.get_warehouse_list(req, res);
});

app.get('/get_loading_dock_list/', function (req, res){
  loadingDock.get_loading_dock_list(req, res);
});

app.get('/get_delivery_list/', function (req, res){
  delivery.get_delivery_list(req, res);
});

app.get('/get_item_list/', function (req, res){
  item.get_item_list(req, res);
});

app.get('/get_delivery_warehouse_list/', function (req, res){
  delivery.get_delivery_warehouse_list(req, res);
});

// Get Report Calls
app.get('/get_truck_report/', function (req, res){
  truck.get_truck_report(req, res);
});

app.get('/get_delivery_report/', function (req, res){
  delivery.get_delivery_report(req, res);
});

app.get('/get_truck_delivery_report/', function (req, res){
  delivery.get_truck_delivery_report(req, res);
});

app.get('/get_truck_region_report/', function (req, res){
  truck.get_truck_region_report(req, res);
});

// Search Calls
app.post('/search_driver_id_post/', urlencodedParser, function (req, res) {
    driver.search_driver_id(req, res);
});

app.post('/search_driver_name_post/', urlencodedParser, function (req, res) {
    driver.search_driver_name(req, res);
});

app.post('/search_driver_license_post/', urlencodedParser, function (req, res) {
    driver.search_driver_license(req, res);
});

app.post('/search_driver_trainer_post/', urlencodedParser, function (req, res) {
    driver.search_driver_trainer(req, res);
});

app.post('/search_driver_truck_post/', urlencodedParser, function (req, res) {
    driver.search_driver_truck(req, res);
});

app.post('/search_truck_id_post/', urlencodedParser, function (req, res) {
    truck.search_truck_id(req, res);
});

app.post('/search_truck_year_post/', urlencodedParser, function (req, res) {
    truck.search_truck_year(req, res);
});

app.post('/search_truck_model_post/', urlencodedParser, function (req, res) {
    truck.search_truck_model(req, res);
});

app.post('/search_truck_owner_post/', urlencodedParser, function (req, res) {
    truck.search_truck_owner(req, res);
});

app.post('/search_inspector_id_post/', urlencodedParser, function (req, res) {
    inspection.search_inspector_id(req, res);
});

app.post('/search_inspection_truck_post/', urlencodedParser, function (req, res) {
    inspection.search_truck_id(req, res);
});

app.post('/search_date_last_post/', urlencodedParser, function (req, res) {
    inspection.search_inspection_last_date(req, res);
});

app.post('/search_date_next_post/', urlencodedParser, function (req, res) {
    inspection.search_inspection_next_date(req, res);
});

app.post('/search_inspection_month_post/', urlencodedParser, function (req, res) {
    inspection.get_next_inspection_list(req, res);
});

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port

   console.log("Listening at http://%s:%s", host, port)
});
