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
import { ojDatePicker, ojDateTimePicker } from "ojs/ojdatetimepicker";
import "ojs/ojdatetimepicker";
import "ojs/ojlabel";
import "ojs/ojformlayout";
import "ojs/ojtimezonedata";

//targetfilters
import { ojSelectMany } from "ojs/ojselectcombobox";
import ArrayTreeDataProvider = require("ojs/ojarraytreedataprovider");
type TreeNode = { value: string; children: Array<{ value: String }> };

class ConcurrentProblemCountViewModel {

  startDate :ko.Observable<string>= ko.observable("N/A");
  endDate: ko.Observable<string> = ko.observable("N/A");


  fullStartDate = "";
  fullEndDate = "";
  applyToFilter = (
    event: ojDateTimePicker.valueChanged,
  ) => {

    this.toDate(event.detail.value);

    if(this.fromDate()==="" || this.fromDate()===undefined){
      this.fromDate(this.fullStartDate);
    }
    let testToDate = new Date(this.toDate());
    let testFromDate = new Date(this.fromDate());
    let problemArray: Array<{hour: string, count: number, series: string}> = [];
    this.hourCount = new Map();


    for (let item in jsonFilex.jsonFile){
      let testt1 = new Date(jsonFilex.jsonFile[item].t1);
      if((testt1>=testFromDate && testt1<=testToDate)){
        if (this.hourCount.has(jsonFilex.jsonFile[item].t1)&& (this.problemFilterMap.has(jsonFilex.jsonFile[item].name)||this.problemFilterMap.size==0)&&(this.selectedTargetsFilterMap.has(
          jsonFilex.jsonFile[item].db) || this.selectedTargetsFilterMap.has(jsonFilex.jsonFile[item].host) ||
          this.selectedTargetsFilterMap.has(jsonFilex.jsonFile[item].onhost) || this.selectedTargetsFilterMap.has(jsonFilex.jsonFile[item].instance)
            || this.selectedTargetsFilterMap.has(jsonFilex.jsonFile[item].cluster) || this.selectedTargetsFilterMap.size===0)){
          let count = this.hourCount.get(jsonFilex.jsonFile[item].t1) + 1;
          this.hourCount.set(jsonFilex.jsonFile[item].t1, count);
        }
        else {
          if(this.problemFilterMap.size===0 && this.selectedTargetsFilterMap.size===0){
            this.hourCount.set(jsonFilex.jsonFile[item].t1, 1);
          } else{
            if((this.problemFilterMap.has(jsonFilex.jsonFile[item].name) ||this.problemFilterMap.size===0)&& (this.selectedTargetsFilterMap.has(
              jsonFilex.jsonFile[item].db) || this.selectedTargetsFilterMap.has(jsonFilex.jsonFile[item].host) ||
              this.selectedTargetsFilterMap.has(jsonFilex.jsonFile[item].onhost) || this.selectedTargetsFilterMap.has(jsonFilex.jsonFile[item].instance)
                || this.selectedTargetsFilterMap.has(jsonFilex.jsonFile[item].cluster) || this.selectedTargetsFilterMap.size===0)){
              this.hourCount.set(jsonFilex.jsonFile[item].t1, 1);
            }
          }
          
        }
      }
      
    }
    let i = 0;
    this.hourCount.forEach((value: number, key: string) => {
      problemArray.push({ hour: key, count: value, series: "Problems"});
      i = i + 1;
    });

    let jsonCount = JSON.stringify(problemArray);
    this.dataProvider = new ArrayDataProvider(JSON.parse(jsonCount), { keyAttributes: 'hour' });
    this.dataObservableProvider(this.dataProvider);
  }

  applyFromFilter = (
    event: ojDateTimePicker.valueChanged,
  ) => {

    if(this.toDate()==="" || this.toDate()===undefined){
      this.toDate(this.fullEndDate);

    } 

    
    
    let problemArray: Array<{hour: string, count: number, series: string}> = [];
    this.hourCount = new Map();
    this.fromDate(event.detail.value);
    let testToDate = new Date(this.toDate());
    let testFromDate = new Date(this.fromDate());

    for (let item in jsonFilex.jsonFile){
      let testt1 = new Date(jsonFilex.jsonFile[item].t1);
      if((testt1>=testFromDate && testt1<=testToDate)){
        if (this.hourCount.has(jsonFilex.jsonFile[item].t1)&& (this.problemFilterMap.has(jsonFilex.jsonFile[item].name)||this.problemFilterMap.size==0)&&(this.selectedTargetsFilterMap.has(
          jsonFilex.jsonFile[item].db) || this.selectedTargetsFilterMap.has(jsonFilex.jsonFile[item].host) ||
          this.selectedTargetsFilterMap.has(jsonFilex.jsonFile[item].onhost) || this.selectedTargetsFilterMap.has(jsonFilex.jsonFile[item].instance)
            || this.selectedTargetsFilterMap.has(jsonFilex.jsonFile[item].cluster) || this.selectedTargetsFilterMap.size===0)){
          let count = this.hourCount.get(jsonFilex.jsonFile[item].t1) + 1;
          this.hourCount.set(jsonFilex.jsonFile[item].t1, count);
        }
        else {
          if(this.problemFilterMap.size===0 && this.selectedTargetsFilterMap.size===0){
            this.hourCount.set(jsonFilex.jsonFile[item].t1, 1);
          } else{
            if((this.problemFilterMap.has(jsonFilex.jsonFile[item].name) ||this.problemFilterMap.size===0)&& (this.selectedTargetsFilterMap.has(
              jsonFilex.jsonFile[item].db) || this.selectedTargetsFilterMap.has(jsonFilex.jsonFile[item].host) ||
              this.selectedTargetsFilterMap.has(jsonFilex.jsonFile[item].onhost) || this.selectedTargetsFilterMap.has(jsonFilex.jsonFile[item].instance)
                || this.selectedTargetsFilterMap.has(jsonFilex.jsonFile[item].cluster) || this.selectedTargetsFilterMap.size===0)){
              this.hourCount.set(jsonFilex.jsonFile[item].t1, 1);
            }
          }
          
        }
      }
      
    }
    let i = 0;
    this.hourCount.forEach((value: number, key: string) => {
      problemArray.push({ hour: key, count: value, series: "Problems"});
      i = i + 1;
    });

    let jsonCount = JSON.stringify(problemArray);
    this.dataProvider = new ArrayDataProvider(JSON.parse(jsonCount), { keyAttributes: 'hour' });
    this.dataObservableProvider(this.dataProvider);
  }

  applyProblemFilters = (
    event: ojSelectMany.valueChanged<string,Record<string,string>>,
  ) => {

    if(this.toDate()==="" || this.toDate()===undefined){
      this.toDate(this.fullEndDate);

    } 

    if(this.fromDate()==="" || this.fromDate()===undefined){
      this.fromDate(this.fullStartDate);
    }
    let testToDate = new Date(this.toDate());
    let testFromDate = new Date(this.fromDate());
    let problemArray: Array<{hour: string, count: number, series: string}> = [];
    this.problemFilterMap = new Map();
    this.hourCount = new Map();
    this.selectProblemValue(event.detail.value);

    for(let i = 0;i<this.selectProblemValue().length;i++){
      this.problemFilterMap.set(this.selectProblemValue()[i],1);
    }

    for (let item in jsonFilex.jsonFile){
      let testt1 = new Date(jsonFilex.jsonFile[item].t1);
      if((testt1>=testFromDate && testt1<=testToDate)){
        if (this.hourCount.has(jsonFilex.jsonFile[item].t1)&& (this.problemFilterMap.has(jsonFilex.jsonFile[item].name)||this.problemFilterMap.size==0)&&(this.selectedTargetsFilterMap.has(
          jsonFilex.jsonFile[item].db) || this.selectedTargetsFilterMap.has(jsonFilex.jsonFile[item].host) ||
          this.selectedTargetsFilterMap.has(jsonFilex.jsonFile[item].onhost) || this.selectedTargetsFilterMap.has(jsonFilex.jsonFile[item].instance)
            || this.selectedTargetsFilterMap.has(jsonFilex.jsonFile[item].cluster) || this.selectedTargetsFilterMap.size===0)){
          let count = this.hourCount.get(jsonFilex.jsonFile[item].t1) + 1;
          this.hourCount.set(jsonFilex.jsonFile[item].t1, count);
        }
        else {
          if(this.problemFilterMap.size===0 && this.selectedTargetsFilterMap.size===0){
            this.hourCount.set(jsonFilex.jsonFile[item].t1, 1);
          } else{
            if((this.problemFilterMap.has(jsonFilex.jsonFile[item].name)|| this.problemFilterMap.size===0)&& (this.selectedTargetsFilterMap.has(
              jsonFilex.jsonFile[item].db) || this.selectedTargetsFilterMap.has(jsonFilex.jsonFile[item].host) ||
              this.selectedTargetsFilterMap.has(jsonFilex.jsonFile[item].onhost) || this.selectedTargetsFilterMap.has(jsonFilex.jsonFile[item].instance)
                || this.selectedTargetsFilterMap.has(jsonFilex.jsonFile[item].cluster) || this.selectedTargetsFilterMap.size===0)){
              this.hourCount.set(jsonFilex.jsonFile[item].t1, 1);
            }
          }
          
        }
      }
      
    }
    let i = 0;
    this.hourCount.forEach((value: number, key: string) => {
      problemArray.push({ hour: key, count: value, series: "Problems"});
      i = i + 1;
    });

    let jsonCount = JSON.stringify(problemArray);
    this.dataProvider = new ArrayDataProvider(JSON.parse(jsonCount), { keyAttributes: 'hour' });
    this.dataObservableProvider(this.dataProvider);
  }

  //crear un observable array que está inicializado → selectproblemvalue
  applyTargetFilters = (
    event: ojSelectMany.valueChanged<string,Record<string,string>>,
  ) => {
    this.selectTargetValue(event.detail.value);
    if(this.toDate()==="" || this.toDate()===undefined){
      this.toDate(this.fullEndDate);

    } 

    if(this.fromDate()==="" || this.fromDate()===undefined){
      this.fromDate(this.fullStartDate);
    }

    
    let testToDate = new Date(this.toDate());
    let testFromDate = new Date(this.fromDate());
    let problemArray: Array<{hour: string, count: number, series: string}> = [];
    this.selectedTargetsFilterMap = new Map();
    this.hourCount = new Map();
    

    for(let i = 0;i<this.selectTargetValue().length;i++){
      this.selectedTargetsFilterMap.set(this.selectTargetValue()[i],1);
    }



    for (let item in jsonFilex.jsonFile){
      let testt1 = new Date(jsonFilex.jsonFile[item].t1);
      if((testt1>=testFromDate && testt1<=testToDate)){
        if (this.hourCount.has(jsonFilex.jsonFile[item].t1)&& (this.problemFilterMap.has(jsonFilex.jsonFile[item].name)||this.problemFilterMap.size==0)&&(this.selectedTargetsFilterMap.has(
          jsonFilex.jsonFile[item].db) || this.selectedTargetsFilterMap.has(jsonFilex.jsonFile[item].host) ||
          this.selectedTargetsFilterMap.has(jsonFilex.jsonFile[item].onhost) || this.selectedTargetsFilterMap.has(jsonFilex.jsonFile[item].instance)
            || this.selectedTargetsFilterMap.has(jsonFilex.jsonFile[item].cluster) || this.selectedTargetsFilterMap.size===0)){
              let count = this.hourCount.get(jsonFilex.jsonFile[item].t1) + 1;
          this.hourCount.set(jsonFilex.jsonFile[item].t1, count);
        }
        else {
          if(this.problemFilterMap.size===0 && this.selectedTargetsFilterMap.size===0){
            this.hourCount.set(jsonFilex.jsonFile[item].t1, 1);
          } else{
            if((this.problemFilterMap.has(jsonFilex.jsonFile[item].name )|| this.problemFilterMap.size===0)&& (this.selectedTargetsFilterMap.has(
              jsonFilex.jsonFile[item].db) || this.selectedTargetsFilterMap.has(jsonFilex.jsonFile[item].host) ||
              this.selectedTargetsFilterMap.has(jsonFilex.jsonFile[item].onhost) || this.selectedTargetsFilterMap.has(jsonFilex.jsonFile[item].instance)
                || this.selectedTargetsFilterMap.has(jsonFilex.jsonFile[item].cluster) || this.selectedTargetsFilterMap.size===0)){
              this.hourCount.set(jsonFilex.jsonFile[item].t1, 1);
            }
          }
          
        }
      }
    }
    let i = 0;
    this.hourCount.forEach((value: number, key: string) => {
      problemArray.push({ hour: key, count: value, series: "Problems"});
      i = i + 1;
    });

    let jsonCount = JSON.stringify(problemArray);
    this.dataProvider = new ArrayDataProvider(JSON.parse(jsonCount), { keyAttributes: 'hour' });
    this.dataObservableProvider(this.dataProvider);
  }

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


  public addTDPInfo() {
    this.targetFilterDP = new ArrayTreeDataProvider(this.arrayInfo, {
      keyAttributes: "value",
      keyAttributesScope: "sibling",
    });
    this.resultCount = ko.observable(this.arrayInfo.length);
    //console.log("lista de datos: "+ this.arrayInfo[2].value);
  }

  resetFilters = (event: Event,
    bindingContext: ko.BindingContext) => {
    this.selectProblemValue([]);
    this.fromDate(this.fullStartDate); 
    this.toDate(this.fullEndDate);
    this.selectTargetValue([]);
    
  };


  public fillData() {
    let dates = [];
    for (var j = 0; j < jsonFilex.jsonFile.length; j++) {

      dates.push(jsonFilex.jsonFile[j].t1);
        if(jsonFilex.jsonFile[j].t2!=undefined && jsonFilex.jsonFile[j].t2!=""){
          dates.push(jsonFilex.jsonFile[j].t2);
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
    let startDate = dates[0].split(" ")[0];
    let endDate = dates[dates.length-1].split(" ")[0];

    this.startDate(startDate);
    this.endDate(endDate);
    this.fullStartDate = startDate + "T" + dates[0].split(" ")[1];
    this.fullEndDate = endDate + "T" + dates[dates.length-1].split(" ")[1];
    this.arrayInfo.push({ value: "Databases", children: this.arrayDB });
    this.arrayInfo.push({ value: "Instances", children: this.arrayInstance });
    this.arrayInfo.push({ value: "Hosts", children: this.arrayHost });
    this.arrayInfo.push({ value: "Cluster", children: this.arrayCluster });


  }


  readonly selectProblemValue = ko.observableArray([]);
  readonly selectTargetValue = ko.observableArray([]);


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

    problemFilterMap = new Map();
    selectedTargetsFilterMap = new Map();

    readonly orientationValue = ko.observable("vertical");
    hourCount = new Map();
    problemFilters = new Map();
    dataProvider : ArrayDataProvider<any, any>;
    dataObservableProvider: ko.Observable<ArrayDataProvider<any,any>> = ko.observable();
    problemsDataProvider : ArrayDataProvider<any,any>;
    readonly fromDate : ko.Observable<string> = ko.observable("");
  readonly toDate : ko.Observable<string> = ko.observable("");

  constructor() {
    this.fillData();
    this.addTDPInfo();

  }

  
  connected(): void {
    AccUtils.announce("Concurrent Problem Count page loaded.");
    document.title = "Concurrent Problem Count";
    // implement further logic if needed
    let problemArray: Array<{hour: string, count: number, series: string}> = [];
    let problemFilterArray: Array<{value:string,label:string}> = [];
    for (let item in jsonFilex.jsonFile){
      if(this.problemFilters.has(jsonFilex.jsonFile[item].name)){
        //Do nothing
      } else{
        this.problemFilters.set(jsonFilex.jsonFile[item].name,1)
        problemFilterArray.push({value:jsonFilex.jsonFile[item].name,label:jsonFilex.jsonFile[item].name});
       
      }
      if (this.hourCount.has(jsonFilex.jsonFile[item].t1)){
        let count = this.hourCount.get(jsonFilex.jsonFile[item].t1) + 1;
        this.hourCount.set(jsonFilex.jsonFile[item].t1, count);
      }
      else {
        this.hourCount.set(jsonFilex.jsonFile[item].t1, 1);
      }
    }

    let i = 0;
    this.hourCount.forEach((value: number, key: string) => {
      problemArray.push({ hour: key, count: value, series: "Problems"});
      i = i + 1;
    });

    let jsonCount = JSON.stringify(problemArray);
    let jsonFilterProblems = JSON.stringify(problemFilterArray);

    this.dataProvider = new ArrayDataProvider(JSON.parse(jsonCount), { keyAttributes: 'hour' });
    this.dataObservableProvider(this.dataProvider);
    this.problemsDataProvider = new ArrayDataProvider(JSON.parse(jsonFilterProblems),{keyAttributes:'value'});
    document.getElementById("chart-container");
  }


  disconnected(): void {
    // implement if needed
  }


  transitionCompleted(): void {
    // implement if needed
  }
}

export = ConcurrentProblemCountViewModel;
