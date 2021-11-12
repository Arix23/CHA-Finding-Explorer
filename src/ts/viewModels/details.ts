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

class DetailsViewModel {


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
  problemsDataProvider : ArrayDataProvider<any,any>;
  readonly selectProblemValue = ko.observableArray(["CH"]);
  problemFilters = new Map();



  constructor() {

  }

  /**
   * Optional ViewModel method invoked after the View is inserted into the
   * document DOM.  The application can put logic that requires the DOM being
   * attached here.
   * This method might be called multiple times - after the View is created
   * and inserted into the DOM and after the View is reconnected
   * after being disconnected.
   */
  connected(): void {
    AccUtils.announce("Details page loaded.");
    document.title = "Details";

    //console.log(jsonFilex.jsonFile[0]);
    //console.log(jsonFilex.jsonFile[0].id);
    // implement further logic if needed

    let problemArray: Array<{ hour: string, count: number, series: string }> = [];
    let problemFilterArray: Array<{value:string,label:string}> = [];


    for (let item in jsonFilex.jsonFile) {
      if(this.problemFilters.has(jsonFilex.jsonFile[item].name)){
        //Do nothing
      } else{
        this.problemFilters.set(jsonFilex.jsonFile[item].name,1)
        problemFilterArray.push({value:jsonFilex.jsonFile[item].name,label:jsonFilex.jsonFile[item].name});
       
      }
      if (this.hourMap.has(jsonFilex.jsonFile[item].t1)) {
        if (this.hourMap.get(jsonFilex.jsonFile[item].t1).has(jsonFilex.jsonFile[item].name)) {
          let count = this.hourMap.get(jsonFilex.jsonFile[item].t1).get(jsonFilex.jsonFile[item].name) + 1;
          this.hourMap.get(jsonFilex.jsonFile[item].t1).set(jsonFilex.jsonFile[item].name, count);
        }
        else {
          this.hourMap.get(jsonFilex.jsonFile[item].t1).set(jsonFilex.jsonFile[item].name, 1);
        }
      }
      else {
        let nameMap = new Map();
        nameMap.set(jsonFilex.jsonFile[item].name, 1);
        this.hourMap.set(jsonFilex.jsonFile[item].t1, nameMap);
      }
    }
    //console.log(this.hourMap);


    this.hourMap.forEach((map: Map<any, any>, key: string) => {
      map.forEach((value: number, key2: string) => {
        problemArray.push({ hour: key, count: value, series: key2 });
      });
    });

    let jsonFilterProblems = JSON.stringify(problemFilterArray);


    //console.log(problemArray)
    let jsonCount = JSON.stringify(problemArray);

    this.dataProvider = new ArrayDataProvider(JSON.parse(jsonCount), { keyAttributes: 'hour' });
    this.problemsDataProvider = new ArrayDataProvider(JSON.parse(jsonFilterProblems),{keyAttributes:'value'});
    document.getElementById("chart-container");








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
        targetArray.push({ hour: "Instance: "+key, count: value, series: "Host: "+key2 });
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
      dbArray.push({ hour: key, count: value, series: "Database: "+ key });
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