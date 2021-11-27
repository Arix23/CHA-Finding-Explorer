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
import { ojDatePicker, ojDateTimePicker, ojInputDateTime } from "ojs/ojdatetimepicker";
import "ojs/ojdatetimepicker";
import "ojs/ojlabel";
import "ojs/ojformlayout";
import "ojs/ojtimezonedata";

//targetfilters
import { ojSelectMany } from "ojs/ojselectcombobox";
import ArrayTreeDataProvider = require("ojs/ojarraytreedataprovider");
import { AvailableTimeZoneType } from "@oracle/oraclejet/dist/types/ojtimezoneutils";
import { ojButtonEventMap } from "@oracle/oraclejet/dist/types/ojbutton";
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

  applyTargetFilters = (
    event: ojSelectMany.valueChanged<string,Record<string,string>>,
  ) => {
    this.problemTargetMap = new Map();
    this.hourMap= new Map();
    this.targetMap = new Map();
    this.dbMap = new Map();
    let targetArray: Array<{ hour: string, count: number, series: string }> = [];
    let dbArray: Array<{ hour: string, count: number, series: string }> = [];
    this.selectTargetValue(event.detail.value);
    if(this.toDate()==="" || this.toDate()===undefined){
      this.toDate(this.fullEndDate);

    } 

    if(this.fromDate()==="" || this.fromDate()===undefined){
      this.fromDate(this.fullStartDate);
    }




    


    let testToDate = new Date(this.toDate());
    let testFromDate = new Date(this.fromDate());

    let problemArray: Array<{ hour: string, count: number, series: string }> = [];
    for(let i = 0;i<this.selectTargetValue().length;i++){
      this.problemTargetMap.set(this.selectTargetValue()[i],1);
    }
    

    for (let item in jsonFilex.jsonFile) {
      let testt1 = new Date(jsonFilex.jsonFile[item].t1);
      //FIRST GRAPH
      if((testt1>=testFromDate && testt1<=testToDate)&&(this.problemFilterMap.has(jsonFilex.jsonFile[item].name) || this.problemFilterMap.size==0) && (
        this.problemTargetMap.has(jsonFilex.jsonFile[item].db) || this.problemTargetMap.has(jsonFilex.jsonFile[item].cluster) ||
        this.problemTargetMap.has(jsonFilex.jsonFile[item].instance) || this.problemTargetMap.has(jsonFilex.jsonFile[item].host) ||
        this.problemTargetMap.has(jsonFilex.jsonFile[item].onhost) || this.problemTargetMap.size==0
      )){

        if (this.hourMap.has(jsonFilex.jsonFile[item].t1)) {
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

      //SECOND GRAPH
      if((testt1>=testFromDate && testt1<=testToDate)&&(this.problemFilterMap.has(jsonFilex.jsonFile[item].name) || this.problemFilterMap.size==0) && (
        this.problemTargetMap.has(jsonFilex.jsonFile[item].db) || this.problemTargetMap.has(jsonFilex.jsonFile[item].cluster) ||
        this.problemTargetMap.has(jsonFilex.jsonFile[item].instance) || this.problemTargetMap.has(jsonFilex.jsonFile[item].host) ||
        this.problemTargetMap.has(jsonFilex.jsonFile[item].onhost) || this.problemTargetMap.size==0
      )){
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

      //THIRD GRAPH
      if((testt1>=testFromDate && testt1<=testToDate)&&(this.problemFilterMap.has(jsonFilex.jsonFile[item].name) || this.problemFilterMap.size==0) && (
        this.problemTargetMap.has(jsonFilex.jsonFile[item].db) || this.problemTargetMap.has(jsonFilex.jsonFile[item].cluster) ||
        this.problemTargetMap.has(jsonFilex.jsonFile[item].instance) || this.problemTargetMap.has(jsonFilex.jsonFile[item].host) ||
        this.problemTargetMap.has(jsonFilex.jsonFile[item].onhost) || this.problemTargetMap.size==0
      )){
        if (this.dbMap.has(jsonFilex.jsonFile[item].db)) {
          let count2 = this.dbMap.get(jsonFilex.jsonFile[item].db) + 1;
          this.dbMap.set(jsonFilex.jsonFile[item].db, count2);
        }
        else {
        
          this.dbMap.set(jsonFilex.jsonFile[item].db, 1);
        
        }

      }
    }

    //FIRST GRAPH
    this.hourMap.forEach((map: Map<any, any>, key: string) => {
      map.forEach((value: number, key2: string) => {
        problemArray.push({ hour: key, count: value, series: key2 });
      });
    });

    let jsonCount = JSON.stringify(problemArray);

    this.dataProvider = new ArrayDataProvider(JSON.parse(jsonCount), { keyAttributes: 'hour' });
    this.dataObservableProvider(this.dataProvider);

    //SECOND GRAPH
    this.targetMap.delete(undefined)


    this.targetMap.forEach((map: Map<any, any>, key: string) => {
      map.forEach((value: number, key2: string) => {
        targetArray.push({ hour: "Instance: " + key, count: value, series: "Host: " + key2 });
      });
    });

    let json = JSON.stringify(targetArray);

    this.dataProvider2 = new ArrayDataProvider(JSON.parse(json), { keyAttributes: 'hour' });
    this.dataObservableProvider2(this.dataProvider2);

    //THIRD GRAPH
    this.dbMap.delete(undefined)

    this.dbMap.forEach((value: number, key: string) => {
      dbArray.push({ hour: key, count: value, series: "Database: " + key });
    });

    let jsonx = JSON.stringify(dbArray);

    this.dataProvider3 = new ArrayDataProvider(JSON.parse(jsonx), { keyAttributes: 'hour' });
    this.dataObservableProvider3(this.dataProvider3);
  }

  applyFromFilter = (
    event: ojDateTimePicker.valueChanged,
  ) => {
    this.hourMap= new Map();
    this.targetMap = new Map();
    this.dbMap = new Map();
    let targetArray: Array<{ hour: string, count: number, series: string }> = [];
    let dbArray: Array<{ hour: string, count: number, series: string }> = [];
    let problemArray: Array<{ hour: string, count: number, series: string }> = [];
    this.fromDate(event.detail.value);
    

    if(this.toDate()==="" || this.toDate()===undefined){
      this.toDate(this.fullEndDate);

    }




    


    let testToDate = new Date(this.toDate());
    let testFromDate = new Date(this.fromDate());
    

    for (let item in jsonFilex.jsonFile) {

      let testt1 = new Date(jsonFilex.jsonFile[item].t1);

    

      //FIRST GRAPH
      if((testt1>=testFromDate && testt1<=testToDate)&&(this.problemFilterMap.has(jsonFilex.jsonFile[item].name) || this.problemFilterMap.size==0) && (
        this.problemTargetMap.has(jsonFilex.jsonFile[item].db) || this.problemTargetMap.has(jsonFilex.jsonFile[item].cluster) ||
        this.problemTargetMap.has(jsonFilex.jsonFile[item].instance) || this.problemTargetMap.has(jsonFilex.jsonFile[item].host) ||
        this.problemTargetMap.has(jsonFilex.jsonFile[item].onhost) || this.problemTargetMap.size==0
      )){

        if (this.hourMap.has(jsonFilex.jsonFile[item].t1)) {
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

      //SECOND GRAPH
      if((testt1>=testFromDate && testt1<=testToDate)&&(this.problemFilterMap.has(jsonFilex.jsonFile[item].name) || this.problemFilterMap.size==0) && (
        this.problemTargetMap.has(jsonFilex.jsonFile[item].db) || this.problemTargetMap.has(jsonFilex.jsonFile[item].cluster) ||
        this.problemTargetMap.has(jsonFilex.jsonFile[item].instance) || this.problemTargetMap.has(jsonFilex.jsonFile[item].host) ||
        this.problemTargetMap.has(jsonFilex.jsonFile[item].onhost) || this.problemTargetMap.size==0
      )){
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

      //THIRD GRAPH
      if((testt1>=testFromDate && testt1<=testToDate)&&(this.problemFilterMap.has(jsonFilex.jsonFile[item].name) || this.problemFilterMap.size==0) && (
        this.problemTargetMap.has(jsonFilex.jsonFile[item].db) || this.problemTargetMap.has(jsonFilex.jsonFile[item].cluster) ||
        this.problemTargetMap.has(jsonFilex.jsonFile[item].instance) || this.problemTargetMap.has(jsonFilex.jsonFile[item].host) ||
        this.problemTargetMap.has(jsonFilex.jsonFile[item].onhost) || this.problemTargetMap.size==0
      )){
        if (this.dbMap.has(jsonFilex.jsonFile[item].db)) {
          let count2 = this.dbMap.get(jsonFilex.jsonFile[item].db) + 1;
          this.dbMap.set(jsonFilex.jsonFile[item].db, count2);
        }
        else {
        
          this.dbMap.set(jsonFilex.jsonFile[item].db, 1);
        
        }

      }
    }

    //FIRST GRAPH
    this.hourMap.forEach((map: Map<any, any>, key: string) => {
      map.forEach((value: number, key2: string) => {
        problemArray.push({ hour: key, count: value, series: key2 });
      });
    });

    let jsonCount = JSON.stringify(problemArray);

    this.dataProvider = new ArrayDataProvider(JSON.parse(jsonCount), { keyAttributes: 'hour' });
    this.dataObservableProvider(this.dataProvider);

    //SECOND GRAPH
    this.targetMap.delete(undefined)


    this.targetMap.forEach((map: Map<any, any>, key: string) => {
      map.forEach((value: number, key2: string) => {
        targetArray.push({ hour: "Instance: " + key, count: value, series: "Host: " + key2 });
      });
    });

    let json = JSON.stringify(targetArray);

    this.dataProvider2 = new ArrayDataProvider(JSON.parse(json), { keyAttributes: 'hour' });
    this.dataObservableProvider2(this.dataProvider2);

    //THIRD GRAPH
    this.dbMap.delete(undefined)

    this.dbMap.forEach((value: number, key: string) => {
      dbArray.push({ hour: key, count: value, series: "Database: " + key });
    });

    let jsonx = JSON.stringify(dbArray);

    this.dataProvider3 = new ArrayDataProvider(JSON.parse(jsonx), { keyAttributes: 'hour' });
    this.dataObservableProvider3(this.dataProvider3);
  }

  applyToFilter = (
    event: ojDateTimePicker.valueChanged,
    ) => {
      this.hourMap= new Map();
    this.targetMap = new Map();
    this.dbMap = new Map();
    let targetArray: Array<{ hour: string, count: number, series: string }> = [];
    let dbArray: Array<{ hour: string, count: number, series: string }> = [];
    let problemArray: Array<{ hour: string, count: number, series: string }> = [];
    this.toDate(event.detail.value);
    

    if(this.fromDate()==="" || this.fromDate()===undefined){
      this.fromDate(this.fullStartDate);

    }




    


    let testToDate = new Date(this.toDate());
    let testFromDate = new Date(this.fromDate());
    

    for (let item in jsonFilex.jsonFile) {

      let testt1 = new Date(jsonFilex.jsonFile[item].t1);

    

      //FIRST GRAPH
      if((testt1>=testFromDate && testt1<=testToDate)&&(this.problemFilterMap.has(jsonFilex.jsonFile[item].name) || this.problemFilterMap.size==0) && (
        this.problemTargetMap.has(jsonFilex.jsonFile[item].db) || this.problemTargetMap.has(jsonFilex.jsonFile[item].cluster) ||
        this.problemTargetMap.has(jsonFilex.jsonFile[item].instance) || this.problemTargetMap.has(jsonFilex.jsonFile[item].host) ||
        this.problemTargetMap.has(jsonFilex.jsonFile[item].onhost) || this.problemTargetMap.size==0
      )){

        if (this.hourMap.has(jsonFilex.jsonFile[item].t1)) {
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

      //SECOND GRAPH
      if((testt1>=testFromDate && testt1<=testToDate)&&(this.problemFilterMap.has(jsonFilex.jsonFile[item].name) || this.problemFilterMap.size==0) && (
        this.problemTargetMap.has(jsonFilex.jsonFile[item].db) || this.problemTargetMap.has(jsonFilex.jsonFile[item].cluster) ||
        this.problemTargetMap.has(jsonFilex.jsonFile[item].instance) || this.problemTargetMap.has(jsonFilex.jsonFile[item].host) ||
        this.problemTargetMap.has(jsonFilex.jsonFile[item].onhost) || this.problemTargetMap.size==0
      )){
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

      //THIRD GRAPH
      if((testt1>=testFromDate && testt1<=testToDate)&&(this.problemFilterMap.has(jsonFilex.jsonFile[item].name) || this.problemFilterMap.size==0) && (
        this.problemTargetMap.has(jsonFilex.jsonFile[item].db) || this.problemTargetMap.has(jsonFilex.jsonFile[item].cluster) ||
        this.problemTargetMap.has(jsonFilex.jsonFile[item].instance) || this.problemTargetMap.has(jsonFilex.jsonFile[item].host) ||
        this.problemTargetMap.has(jsonFilex.jsonFile[item].onhost) || this.problemTargetMap.size==0
      )){
        if (this.dbMap.has(jsonFilex.jsonFile[item].db)) {
          let count2 = this.dbMap.get(jsonFilex.jsonFile[item].db) + 1;
          this.dbMap.set(jsonFilex.jsonFile[item].db, count2);
        }
        else {
        
          this.dbMap.set(jsonFilex.jsonFile[item].db, 1);
        
        }

      }
    }

    //FIRST GRAPH
    this.hourMap.forEach((map: Map<any, any>, key: string) => {
      map.forEach((value: number, key2: string) => {
        problemArray.push({ hour: key, count: value, series: key2 });
      });
    });

    let jsonCount = JSON.stringify(problemArray);

    this.dataProvider = new ArrayDataProvider(JSON.parse(jsonCount), { keyAttributes: 'hour' });
    this.dataObservableProvider(this.dataProvider);

    //SECOND GRAPH
    this.targetMap.delete(undefined)


    this.targetMap.forEach((map: Map<any, any>, key: string) => {
      map.forEach((value: number, key2: string) => {
        targetArray.push({ hour: "Instance: " + key, count: value, series: "Host: " + key2 });
      });
    });

    let json = JSON.stringify(targetArray);

    this.dataProvider2 = new ArrayDataProvider(JSON.parse(json), { keyAttributes: 'hour' });
    this.dataObservableProvider2(this.dataProvider2);

    //THIRD GRAPH
    this.dbMap.delete(undefined)

    this.dbMap.forEach((value: number, key: string) => {
      dbArray.push({ hour: key, count: value, series: "Database: " + key });
    });

    let jsonx = JSON.stringify(dbArray);

    this.dataProvider3 = new ArrayDataProvider(JSON.parse(jsonx), { keyAttributes: 'hour' });
    this.dataObservableProvider3(this.dataProvider3);
    }

  applyProblemFilters = (
    event: ojSelectMany.valueChanged<string,Record<string,string>>,
  ) => {
    this.problemFilterMap = new Map();
    this.hourMap= new Map();
    this.targetMap = new Map();
    this.dbMap = new Map();
    let targetArray: Array<{ hour: string, count: number, series: string }> = [];
    let dbArray: Array<{ hour: string, count: number, series: string }> = [];
    this.selectProblemValue(event.detail.value);

    if(this.toDate()==="" || this.toDate()===undefined){
      this.toDate(this.fullEndDate);

    } 

    if(this.fromDate()==="" || this.fromDate()===undefined){
      this.fromDate(this.fullStartDate);
    }




    


    let testToDate = new Date(this.toDate());
    let testFromDate = new Date(this.fromDate());
    let problemArray: Array<{ hour: string, count: number, series: string }> = [];
    for(let i = 0;i<this.selectProblemValue().length;i++){
      this.problemFilterMap.set(this.selectProblemValue()[i],1);
    }
    

    for (let item in jsonFilex.jsonFile) {
      let testt1 = new Date(jsonFilex.jsonFile[item].t1);
      //FIRST GRAPH
      if((testt1>=testFromDate && testt1<=testToDate)&&(this.problemFilterMap.has(jsonFilex.jsonFile[item].name) || this.problemFilterMap.size==0) && (
        this.problemTargetMap.has(jsonFilex.jsonFile[item].db) || this.problemTargetMap.has(jsonFilex.jsonFile[item].cluster) ||
        this.problemTargetMap.has(jsonFilex.jsonFile[item].instance) || this.problemTargetMap.has(jsonFilex.jsonFile[item].host) ||
        this.problemTargetMap.has(jsonFilex.jsonFile[item].onhost) || this.problemTargetMap.size==0
      )){

        if (this.hourMap.has(jsonFilex.jsonFile[item].t1)) {
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

      //SECOND GRAPH
      if((testt1>=testFromDate && testt1<=testToDate)&&(this.problemFilterMap.has(jsonFilex.jsonFile[item].name) || this.problemFilterMap.size==0) && (
        this.problemTargetMap.has(jsonFilex.jsonFile[item].db) || this.problemTargetMap.has(jsonFilex.jsonFile[item].cluster) ||
        this.problemTargetMap.has(jsonFilex.jsonFile[item].instance) || this.problemTargetMap.has(jsonFilex.jsonFile[item].host) ||
        this.problemTargetMap.has(jsonFilex.jsonFile[item].onhost) || this.problemTargetMap.size==0
      )){
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

      //THIRD GRAPH
      if((testt1>=testFromDate && testt1<=testToDate)&&(this.problemFilterMap.has(jsonFilex.jsonFile[item].name) || this.problemFilterMap.size==0) && (
        this.problemTargetMap.has(jsonFilex.jsonFile[item].db) || this.problemTargetMap.has(jsonFilex.jsonFile[item].cluster) ||
        this.problemTargetMap.has(jsonFilex.jsonFile[item].instance) || this.problemTargetMap.has(jsonFilex.jsonFile[item].host) ||
        this.problemTargetMap.has(jsonFilex.jsonFile[item].onhost) || this.problemTargetMap.size==0
      )){
        if (this.dbMap.has(jsonFilex.jsonFile[item].db)) {
          let count2 = this.dbMap.get(jsonFilex.jsonFile[item].db) + 1;
          this.dbMap.set(jsonFilex.jsonFile[item].db, count2);
        }
        else {
        
          this.dbMap.set(jsonFilex.jsonFile[item].db, 1);
        
        }

      }
    }

    //FIRST GRAPH
    this.hourMap.forEach((map: Map<any, any>, key: string) => {
      map.forEach((value: number, key2: string) => {
        problemArray.push({ hour: key, count: value, series: key2 });
      });
    });

    let jsonCount = JSON.stringify(problemArray);

    this.dataProvider = new ArrayDataProvider(JSON.parse(jsonCount), { keyAttributes: 'hour' });
    this.dataObservableProvider(this.dataProvider);

    //SECOND GRAPH
    this.targetMap.delete(undefined)


    this.targetMap.forEach((map: Map<any, any>, key: string) => {
      map.forEach((value: number, key2: string) => {
        targetArray.push({ hour: "Instance: " + key, count: value, series: "Host: " + key2 });
      });
    });

    let json = JSON.stringify(targetArray);

    this.dataProvider2 = new ArrayDataProvider(JSON.parse(json), { keyAttributes: 'hour' });
    this.dataObservableProvider2(this.dataProvider2);

    //THIRD GRAPH
    this.dbMap.delete(undefined)

    this.dbMap.forEach((value: number, key: string) => {
      dbArray.push({ hour: key, count: value, series: "Database: " + key });
    });

    let jsonx = JSON.stringify(dbArray);

    this.dataProvider3 = new ArrayDataProvider(JSON.parse(jsonx), { keyAttributes: 'hour' });
    this.dataObservableProvider3(this.dataProvider3);
  }


  public addTDPInfo() {
    this.targetFilterDP = new ArrayTreeDataProvider(this.arrayInfo, {
      keyAttributes: "value",
      keyAttributesScope: "sibling",
    });
    this.resultCount = ko.observable(this.arrayInfo.length);
    //console.log("lista de datos: "+ this.arrayInfo[2].value);
  }


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
    this.fullStartDate = startDate + "T" + dates[0].split(" ")[1];
    this.fullEndDate = endDate + "T" + dates[dates.length-1].split(" ")[1];
    this.endDate(endDate);
    this.arrayInfo.push({ value: "Databases", children: this.arrayDB });
    this.arrayInfo.push({ value: "Instances", children: this.arrayInstance });
    this.arrayInfo.push({ value: "Hosts", children: this.arrayHost });
    this.arrayInfo.push({ value: "Cluster", children: this.arrayCluster });


  }

  fullStartDate = "";
  fullEndDate = "";



  resetFilters = (event: Event,
    bindingContext: ko.BindingContext) => {
    this.selectProblemValue([]);
    this.fromDate(this.fullStartDate); 
    this.toDate(this.fullEndDate); 
    this.selectTargetValue([]);
    
  };


  startDate :ko.Observable<string>= ko.observable("N/A");
  endDate: ko.Observable<string> = ko.observable("N/A");
  problemFilterMap = new Map();
  problemTargetMap = new Map();


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
  dataObservableProvider : ko.Observable<ArrayDataProvider<any, any>> = ko.observable();
  dataObservableProvider2 : ko.Observable<ArrayDataProvider<any, any>> = ko.observable();
  dataObservableProvider3 : ko.Observable<ArrayDataProvider<any, any>> = ko.observable();
  problemsDataProvider : ArrayDataProvider<any,any>;
  readonly selectProblemValue = ko.observableArray([]);
  readonly fromDate : ko.Observable<string> = ko.observable("");
  readonly toDate : ko.Observable<string> = ko.observable("");
  readonly selectTargetValue = ko.observableArray([]);
  problemFilters = new Map();



  constructor() {
    this.fillData();
    this.addTDPInfo();
  }

  

  graphTimeProblem() {
    let problemArray: Array<{ hour: string, count: number, series: string }> = [];
    let problemFilterArray: Array<{value:string,label:string}> = [];
    let targetArray: Array<{ hour: string, count: number, series: string }> = [];
    let dbArray: Array<{ hour: string, count: number, series: string }> = [];

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
      else { //crea t1
        let nameMap = new Map();
        nameMap.set(jsonFilex.jsonFile[item].name, 1);
        this.hourMap.set(jsonFilex.jsonFile[item].t1, nameMap);

      }
      

      //SECOND GRAPH
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

      //THIRD GRAPH
      if (this.dbMap.has(jsonFilex.jsonFile[item].db)) {
        let count2 = this.dbMap.get(jsonFilex.jsonFile[item].db) + 1;
        this.dbMap.set(jsonFilex.jsonFile[item].db, count2);
      }
      else {
        this.dbMap.set(jsonFilex.jsonFile[item].db, 1);
      }
    }


    this.hourMap.forEach((map: Map<any, any>, key: string) => {
      map.forEach((value: number, key2: string) => {
        problemArray.push({ hour: key, count: value, series: key2 });
      });
    });

    let jsonFilterProblems = JSON.stringify(problemFilterArray);


    //console.log(problemArray)
    let jsonCount = JSON.stringify(problemArray);

    this.dataProvider = new ArrayDataProvider(JSON.parse(jsonCount), { keyAttributes: 'hour' });
    this.dataObservableProvider(this.dataProvider);
    this.problemsDataProvider = new ArrayDataProvider(JSON.parse(jsonFilterProblems),{keyAttributes:'value'});


    //SECOND GRAPH FINISH
    this.targetMap.delete(undefined)


    this.targetMap.forEach((map: Map<any, any>, key: string) => {
      map.forEach((value: number, key2: string) => {
        targetArray.push({ hour: "Instance: " + key, count: value, series: "Host: " + key2 });
      });
    });

    let json = JSON.stringify(targetArray);

    this.dataProvider2 = new ArrayDataProvider(JSON.parse(json), { keyAttributes: 'hour' });
    this.dataObservableProvider2(this.dataProvider2);


    //THIRD GRAPH FINISH
    this.dbMap.delete(undefined)

    this.dbMap.forEach((value: number, key: string) => {
      dbArray.push({ hour: key, count: value, series: "Database: " + key });
    });

    let jsonx = JSON.stringify(dbArray);

    this.dataProvider3 = new ArrayDataProvider(JSON.parse(jsonx), { keyAttributes: 'hour' });
    this.dataObservableProvider3(this.dataProvider3);
  }


  connected(): void {
    AccUtils.announce("Details page loaded.");
    document.title = "Details";

    this.graphTimeProblem();


  }

  
  disconnected(): void {
    // implement if needed
  }

  
  transitionCompleted(): void {
    // implement if needed
  }
}

export = DetailsViewModel;