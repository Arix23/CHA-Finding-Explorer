import * as AccUtils from "../accUtils";
import jsonFilex from "../appController";
//imports barra de filtros
import * as ko from "knockout";
import { whenDocumentReady } from "ojs/ojbootstrap";
import Message = require("ojs/ojmessaging");
import ArrayDataProvider = require("ojs/ojarraydataprovider");
import "ojs/ojknockout";
import "ojs/ojselectcombobox";
import "ojs/ojformlayout";
import "ojs/ojchart";
import "ojs/ojtoolbar";



import * as Bootstrap from "ojs/ojbootstrap";
import { IntlDateTimeConverter } from "ojs/ojconverter-datetime";
import * as ResponsiveUtils from "ojs/ojresponsiveutils";
import { ojDatePicker } from "ojs/ojdatetimepicker";
import "ojs/ojdatetimepicker";
import "ojs/ojlabel";
import "ojs/ojformlayout";
import "ojs/ojtimezonedata";

//targetfilters
import { ojSelectMany } from "ojs/ojselectcombobox";
import ArrayTreeDataProvider = require("ojs/ojarraytreedataprovider");
type TreeNode = { value: string; children: Array<{ value: String }> };

class DetailsViewModel {

  //FILTROS: HASHMAP → key String, value Array 
  // ejemplo - key: "taget", value: {diara3, diarac4}
  filterMap = new Map();

  //Filtros → Targets
  problemsDP: ko.Observable<ArrayDataProvider<any, any>> = ko.observable();
  targetFilterDP: ArrayTreeDataProvider<string, TreeNode>;
  setDB = new Set();
  setIns = new Set();
  setHost = new Set();
  setClust = new Set();
  setAll = new Set();
  //arreglo
  arrayDB: Array<{ value: string }> = [];
  arrayInstance: Array<{ value: string }> = [];
  arrayHost: Array<{ value: string }> = [];
  arrayCluster: Array<{ value: string }> = [];

  arrayInfo: Array<{ value: string, children: Array<{ value: string }> }> = [];

  resultCount;


  targetVC = (
    event: ojSelectMany.valueChanged<string, Record<string, string>>
  ) => {

    if (!this.filterMap.has("Target")) {
      this.filterMap.set("Target", event.detail.value);
    } else {
      this.filterMap.delete("Target");
      this.filterMap.set("Target", event.detail.value);
    }
    //console.log("Filter map " + this.filterMap.get("Target"));
    // this.graphTimeProblem();
  };


  public addTDPInfo() {
    this.targetFilterDP = new ArrayTreeDataProvider(this.arrayInfo, {
      keyAttributes: "value",
      keyAttributesScope: "sibling",
    });
    this.resultCount = ko.observable(this.arrayInfo.length);
    //console.log("lista de datos: "+ this.arrayInfo[2].value);
  }


  public fillData() {
    let problemFilterArray: Array<{value:string,label:string}> = [];
    

    for (var j = 0; j < jsonFilex.jsonFile.length; j++) {
      //llenar problemas 
      if(this.problemFilters.has(jsonFilex.jsonFile[j].name)){
        //Do nothing
      } else{
        this.problemFilters.set(jsonFilex.jsonFile[j].name,1)
        problemFilterArray.push({value:jsonFilex.jsonFile[j].name,label:jsonFilex.jsonFile[j].name});
       
      }

      //DBs
      if (jsonFilex.jsonFile[j].db != null) {
        if (!this.setDB.has(jsonFilex.jsonFile[j].db)) {
          this.setDB.add(jsonFilex.jsonFile[j].db);
          this.arrayDB.push({ value: jsonFilex.jsonFile[j].db });

        }
      }

      //Instances
      if (jsonFilex.jsonFile[j].instance != null) {
        if (!this.setIns.has(jsonFilex.jsonFile[j].instance)) {
          this.setIns.add(jsonFilex.jsonFile[j].instance);
          this.arrayInstance.push({ value: jsonFilex.jsonFile[j].instance });

        }
      }

      //Host
      if (jsonFilex.jsonFile[j].host != null) {
        if (!this.setHost.has(jsonFilex.jsonFile[j].host)) {
          this.setHost.add(jsonFilex.jsonFile[j].host);
          this.arrayHost.push({ value: jsonFilex.jsonFile[j].host });
        }
      }

      //OnHost
      if (jsonFilex.jsonFile[j].onhost != null) {
        if (!this.setHost.has(jsonFilex.jsonFile[j].onhost)) {
          this.setHost.add(jsonFilex.jsonFile[j].onhost);
          this.arrayHost.push({ value: jsonFilex.jsonFile[j].onhost });
        }
      }

      //Cluster
      if (jsonFilex.jsonFile[j].cluster != null) {
        if (!this.setClust.has(jsonFilex.jsonFile[j].cluster)) {
          this.setClust.add(jsonFilex.jsonFile[j].cluster);
          this.arrayCluster.push({ value: jsonFilex.jsonFile[j].cluster });
        }
      }

      

    }
    this.arrayInfo.push({ value: "Databases", children: this.arrayDB });
    this.arrayInfo.push({ value: "Instances", children: this.arrayInstance });
    this.arrayInfo.push({ value: "Hosts", children: this.arrayHost });
    this.arrayInfo.push({ value: "Cluster", children: this.arrayCluster });

    let jsonFilterProblems = JSON.stringify(problemFilterArray);
    this.problemsDataProvider = new ArrayDataProvider(JSON.parse(jsonFilterProblems),{keyAttributes:'value'});


  }
  



 // Problems
  //PROBLEMS FILTER

  problemsDataProvider : ArrayDataProvider<any,any>;
  problemFilters = new Map();
  readonly selectProblemValue = ko.observableArray(["CH"]);

  // Date picker
  timeFullConverter: IntlDateTimeConverter;
  error: Message[];
  warning: Message[];
  info: Message[];
  confirmation: Message[];
  value: ko.Observable<string>;
  numberOfMonths: number;
  datePickerMonths: ojDatePicker["datePicker"];
  largeScreenMatch: MediaQueryList;
  datePickerWeek: ojDatePicker["datePicker"];
  timePicker: object;


  readonly orientationValue = ko.observable("vertical");
  hourMap = new Map()
  targetMap = new Map()
  dbMap = new Map()
  dataProvider: ArrayDataProvider<any, any>;
  dataProvider2: ArrayDataProvider<any, any>;
  dataProvider3: ArrayDataProvider<any, any>;





  constructor() {
    this.fillData();
    this.addTDPInfo();

   
  }

  /**
   * Optional ViewModel method invoked after the View is inserted into the
   * document DOM.  The application can put logic that requires the DOM being
   * attached here.
   * This method might be called multiple times - after the View is created
   * and inserted into the DOM and after the View is reconnected
   * after being disconnected.
   */

  graphTimeProblem() {
    let problemArray: Array<{ hour: string, count: number, series: string }> = [];

    //en este for agregar los ifs para agregar info
    for (let item in jsonFilex.jsonFile) {
      if (this.hourMap.has(jsonFilex.jsonFile[item].t1)) { //checa si esta el t1
        if (this.hourMap.get(jsonFilex.jsonFile[item].t1).has(jsonFilex.jsonFile[item].name)) {
          let count = this.hourMap.get(jsonFilex.jsonFile[item].t1).get(jsonFilex.jsonFile[item].name) + 1;

          this.hourMap.get(jsonFilex.jsonFile[item].t1).set(jsonFilex.jsonFile[item].name, count);

        }
        else {
          this.hourMap.get(jsonFilex.jsonFile[item].t1).set(jsonFilex.jsonFile[item].name, 1);
        }
      }
      else { //crea t1
        let nameMap = new Map();
        nameMap.set(jsonFilex.jsonFile[item].name, 1);
        this.hourMap.set(jsonFilex.jsonFile[item].t1, nameMap);

      }
    }
    // console.log(this.hourMap);


    this.hourMap.forEach((map: Map<any, any>, key: string) => {
      map.forEach((value: number, key2: string) => {
        problemArray.push({ hour: key, count: value, series: key2 });
      });
    });


    //console.log(problemArray)
    let jsonCount = JSON.stringify(problemArray);

    this.dataProvider = new ArrayDataProvider(JSON.parse(jsonCount), { keyAttributes: 'hour' });

    document.getElementById("chart-container");


  }

  connected(): void {
    AccUtils.announce("Details page loaded.");
    document.title = "Details";

    //console.log(jsonFilex.jsonFile[0]);
    //console.log(jsonFilex.jsonFile[0].id);
    // implement further logic if needed

    this.graphTimeProblem();

    //Target
    let targetArray: Array<{ hour: string, count: number, series: string }> = [];
    for (let item in jsonFilex.jsonFile) {
      if (this.targetMap.has(jsonFilex.jsonFile[item].instance)) {
        if (this.targetMap.get(jsonFilex.jsonFile[item].instance).has(jsonFilex.jsonFile[item].onhost)) {
          let count = this.targetMap.get(jsonFilex.jsonFile[item].instance).get(jsonFilex.jsonFile[item].onhost) + 1;
          this.targetMap.get(jsonFilex.jsonFile[item].instance).set(jsonFilex.jsonFile[item].onhost, count);
        }
        else {
          this.targetMap.get(jsonFilex.jsonFile[item].instance).set(jsonFilex.jsonFile[item].onhost, 1);
        }
      }
      else {
        let nameMap = new Map();
        nameMap.set(jsonFilex.jsonFile[item].onhost, 1);
        this.targetMap.set(jsonFilex.jsonFile[item].instance, nameMap);
      }
    }


    this.targetMap.delete(undefined)
    console.log(this.targetMap);


    this.targetMap.forEach((map: Map<any, any>, key: string) => {
      map.forEach((value: number, key2: string) => {
        targetArray.push({ hour: "Instance: " + key, count: value, series: "Host: " + key2 });
      });
    });

    let json = JSON.stringify(targetArray);

    this.dataProvider2 = new ArrayDataProvider(JSON.parse(json), { keyAttributes: 'hour' });

    document.getElementById("chart-container2");



    //DB
    let dbArray: Array<{ hour: string, count: number, series: string }> = [];
    for (let item in jsonFilex.jsonFile) {
      if (this.dbMap.has(jsonFilex.jsonFile[item].db)) {
        let count2 = this.dbMap.get(jsonFilex.jsonFile[item].db) + 1;
        this.dbMap.set(jsonFilex.jsonFile[item].db, count2);
      }
      else {
        this.dbMap.set(jsonFilex.jsonFile[item].db, 1);
      }
    }

    this.dbMap.delete(undefined)

    this.dbMap.forEach((value: number, key: string) => {
      dbArray.push({ hour: key, count: value, series: "Database: " + key });
    });

    let jsonx = JSON.stringify(dbArray);

    this.dataProvider3 = new ArrayDataProvider(JSON.parse(jsonx), { keyAttributes: 'hour' });

    document.getElementById("chart-container3");

  }

  /**
   * Optional ViewModel method invoked after the View is disconnected from the DOM.
   */
  disconnected(): void {
    // implement if needed
  }

  /**
   * Optional ViewModel method invoked after transition to the new View is complete.
   * That includes any possible animation between the old and the new View.
   */
  transitionCompleted(): void {
    // implement if needed
  }
}

export = DetailsViewModel;