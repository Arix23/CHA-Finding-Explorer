import * as AccUtils from "../accUtils";
import * as ko from "knockout";
import * as Bootstrap from "ojs/ojbootstrap";
import Message = require("ojs/ojmessaging");
import "ojs/ojknockout";
import "ojs/ojformlayout";
import "ojs/ojslider";
import "ojs/ojtable";

import "ojs/ojselectsingle";
import { ojSelectSingle } from "ojs/ojselectsingle";

//imports barra de filtros
import ArrayDataProvider = require("ojs/ojarraydataprovider");
import "ojs/ojknockout";
import "ojs/ojselectcombobox";
import "ojs/ojformlayout";
import "ojs/ojselectsingle";

import { IntlDateTimeConverter } from "ojs/ojconverter-datetime";
import * as ResponsiveUtils from "ojs/ojresponsiveutils";
import { ojDatePicker } from "ojs/ojdatetimepicker";
import "ojs/ojdatetimepicker";
import "ojs/ojlabel";
import "ojs/ojformlayout";
import "ojs/ojtimezonedata";
import jsonFilex from "../appController";
import { ojButtonEventMap } from "@oracle/oraclejet/dist/types/ojbutton";

//Button
import "ojs/ojbutton";


class TargetDetailsViewModel {

  //Table


  //slider
  isSmall: ko.Observable<boolean>;
  columns: ko.Computed<number>;
  error: Message[];
  warning: Message[];
  info: Message[];
  confirmation: Message[];

  // Select Target Category

  setDB = new Set();
  setIns = new Set();
  setHost = new Set();
  setClust = new Set();
  setAll = new Set();

  arrayDBnames: Array<{ value: string, label: string }> = [];
  arrayInsnames: Array<{ value: string, label: string }> = [];
  arrayHostnames: Array<{ value: string, label: string }> = [];
  arrayClusternames: Array<{ value: string, label: string }> = [];

  tableData: Array<{ name: string, database: string, instance: string, host: string, from: string, to: string }> = [];

  selectionDP: ko.Observable<ArrayDataProvider<any, any>> = ko.observable();
  
  selectionTableDP: ko.Observable<ArrayDataProvider<any, any>> = ko.observable();

  selectedType = "";

  //readonly selectionDP = ko.observable("none");

  private readonly category = [
    { value: "Database", label: "Database" },
    { value: "Instance", label: "Instance" },
    { value: "OnHost", label: "OnHost" },
    { value: "Cluster", label: "Cluster" },
  ];

  readonly categoryDP = new ArrayDataProvider(this.category, {
    keyAttributes: "value",
  });


  selectType = (
    event: ojSelectSingle.valueChanged<string, Record<string, string>>
  ) => {
    if (event.detail.value == "Database") {
      let tempSelect = new ArrayDataProvider(this.arrayDBnames);
      this.selectionDP(tempSelect);
      this.selectedType = "Database";
      console.log("Selected: " + this.selectedType);

    } else if (event.detail.value == "Instance") {
      let tempSelect = new ArrayDataProvider(this.arrayInsnames);
      this.selectionDP(tempSelect);
      this.selectedType = "Instance";
    } else if (event.detail.value == "OnHost") {
      let tempSelect = new ArrayDataProvider(this.arrayHostnames);
      this.selectionDP(tempSelect);
      this.selectedType = "OnHost";
    } else if (event.detail.value == "Cluster") {
      let tempSelect = new ArrayDataProvider(this.arrayClusternames);
      this.selectionDP(tempSelect);
      this.selectedType = "Cluster";
    } else {
      // let tempSelect = new ArrayDataProvider(this.setAll);
      // this.selectionDP(tempSelect);

    }
    console.log(event.detail.value)
  }

  fillSelected = (
    event: ojSelectSingle.valueChanged<string, Record<string, string>>
  ) => {
    console.log("detail: " + this.arrayDBnames[event.detail.value]);
    for (var j = 0; j < jsonFilex.jsonFile.length; j++) {
      if (this.selectedType === "Database" && jsonFilex.jsonFile[j].db === event.detail.value) {
        console.log("Agrega db");
        this.tableData.push({ name: jsonFilex.jsonFile[j].name, database : jsonFilex.jsonFile[j].db, instance : jsonFilex.jsonFile[j].instance, host : jsonFilex.jsonFile[j].host, from  : jsonFilex.jsonFile[j].t1, to : jsonFilex.jsonFile[j].t2});
      }else if (this.selectedType === "Instance" && jsonFilex.jsonFile[j].instance == event.detail.value) {
        this.tableData.push({ name: jsonFilex.jsonFile[j].name, database : jsonFilex.jsonFile[j].db, instance : jsonFilex.jsonFile[j].instance, host : jsonFilex.jsonFile[j].host, from  : jsonFilex.jsonFile[j].t1, to : jsonFilex.jsonFile[j].t2});
      }else if (this.selectedType === "OnHost" && jsonFilex.jsonFile[j].host == event.detail.value) {
        this.tableData.push({ name: jsonFilex.jsonFile[j].name, database : jsonFilex.jsonFile[j].db, instance : jsonFilex.jsonFile[j].instance, host : jsonFilex.jsonFile[j].host, from  : jsonFilex.jsonFile[j].t1, to : jsonFilex.jsonFile[j].t2});
      }else if (this.selectedType === "OnHost" && jsonFilex.jsonFile[j].onhost == event.detail.value) {
        this.tableData.push({ name: jsonFilex.jsonFile[j].name, database : jsonFilex.jsonFile[j].db, instance : jsonFilex.jsonFile[j].instance, host : jsonFilex.jsonFile[j].host, from  : jsonFilex.jsonFile[j].t1, to : jsonFilex.jsonFile[j].t2});
      }else if (this.selectedType === "Cluster" && jsonFilex.jsonFile[j].cluster == event.detail.value) {
        this.tableData.push({ name: jsonFilex.jsonFile[j].name, database : jsonFilex.jsonFile[j].db, instance : jsonFilex.jsonFile[j].instance, host : jsonFilex.jsonFile[j].host, from  : jsonFilex.jsonFile[j].t1, to : jsonFilex.jsonFile[j].t2});
      }

    }
    //Array <{name : string, database : string, instance : string, host : string, from : string, to : string}>;
    console.log(this.tableData);
    let temTableData = new ArrayDataProvider(this.tableData);
    // this.selectionTableDP(temTableData);

  }

  public fillData() {

    for (var j = 0; j < jsonFilex.jsonFile.length; j++) {
      //DBs
      if (jsonFilex.jsonFile[j].db != null) {
        if (!this.setDB.has(jsonFilex.jsonFile[j].db)) {
          this.setDB.add(jsonFilex.jsonFile[j].db);
          this.arrayDBnames.push({ value: jsonFilex.jsonFile[j].db, label: jsonFilex.jsonFile[j].db });

        }
      }

      //Instances
      if (jsonFilex.jsonFile[j].instance != null) {
        if (!this.setIns.has(jsonFilex.jsonFile[j].instance)) {
          this.setIns.add(jsonFilex.jsonFile[j].instance);
          this.arrayInsnames.push({ value: jsonFilex.jsonFile[j].instance, label: jsonFilex.jsonFile[j].instance });
        }
      }

      //Hosts
      if (jsonFilex.jsonFile[j].host != null) {
        if (!this.setHost.has(jsonFilex.jsonFile[j].host)) {
          this.setHost.add(jsonFilex.jsonFile[j].host);
          this.arrayHostnames.push({ value: jsonFilex.jsonFile[j].host, label: jsonFilex.jsonFile[j].host });
        }
      }

      if (jsonFilex.jsonFile[j].onhost != null) {
        if (!this.setHost.has(jsonFilex.jsonFile[j].onhost)) {
          this.setHost.add(jsonFilex.jsonFile[j].onhost);
          this.arrayHostnames.push({ value: jsonFilex.jsonFile[j].onhost, label: jsonFilex.jsonFile[j].onhost });
        }
      }

      //Cluster
      if (jsonFilex.jsonFile[j].cluster != null) {
        if (!this.setClust.has(jsonFilex.jsonFile[j].cluster)) {
          this.setClust.add(jsonFilex.jsonFile[j].cluster);
          this.arrayClusternames.push({ value: jsonFilex.jsonFile[j].cluster, label: jsonFilex.jsonFile[j].cluster });
        }
      }

      //All
      this.setAll = new Set([this.setClust, this.setDB, this.setIns, this.setHost]);
      // this.setHost.forEach((value: boolean, key: string) => {
      //   console.log(value);
      // });
    }

  }




  // Date picker
  timeFullConverter: IntlDateTimeConverter;
  numberOfMonths: number;
  datePickerMonths: ojDatePicker["datePicker"];
  largeScreenMatch: MediaQueryList;
  datePickerWeek: ojDatePicker["datePicker"];
  timePicker: object;

  problemCount = new Map();
  dataProvider: ArrayDataProvider<any, any>;

  //Add Target Button
  addTarget: ko.Observable<boolean>;

  public addTargetButton = (event: ojButtonEventMap['ojAction']) => {
    console.log("Click en boton add");
    this.addTarget(false);

  }
  public removeTargetButton = (event: ojButtonEventMap['ojAction']) => {
    this.addTarget(true);

  }

  constructor() {
    this.addTarget = ko.observable(true);
    this.fillData();
    // let tempSelect = new ArrayDataProvider(Array.from(this.setAll.values));
    // this.selectionDP(tempSelect);

    console.log(Array.from(this.setAll))

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

    AccUtils.announce("Target Details page loaded.");
    document.title = "Target Details";
    // implement further logic if needed

    //procesamiento de json :)
    let problemArray: Array<{ name: string, count: number, database: string, instance: string, onhost: string, from: string, to: string }> = [];
    for (var j = 0; j < jsonFilex.jsonFile.length; j++) {
      if (jsonFilex.jsonFile[j].db == "diarac") {
        if (this.problemCount.has(jsonFilex.jsonFile[j].name)) {
          let count = this.problemCount.get(jsonFilex.jsonFile[j].name) + 1;
          this.problemCount.set(jsonFilex.jsonFile[j].name, count);

        }
        else {
          this.problemCount.set(jsonFilex.jsonFile[j].name, 1);
        }
      }
    }

    for (var j = 0; j < jsonFilex.jsonFile.length; j++) {
      if (jsonFilex.jsonFile[j].db == "diarac" && this.problemCount.get(jsonFilex.jsonFile[j].name) != -1) {
        problemArray.push({
          name: jsonFilex.jsonFile[j].name, count: this.problemCount.get(jsonFilex.jsonFile[j].name), database:
            jsonFilex.jsonFile[j].db, instance: jsonFilex.jsonFile[j].instance, onhost: jsonFilex.jsonFile[j].onhost,
          from: jsonFilex.jsonFile[j].from, to: jsonFilex.jsonFile[j].to
        })
        this.problemCount.set(jsonFilex.jsonFile[j].name, -1);
      }
    }



    let jsonCount = JSON.stringify(problemArray);
    // console.log(jsonCount);

    this.dataProvider = new ArrayDataProvider(JSON.parse(jsonCount), { keyAttributes: 'name' });
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

export = TargetDetailsViewModel;