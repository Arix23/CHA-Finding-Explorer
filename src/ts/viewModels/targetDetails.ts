import * as AccUtils from "../accUtils";
import * as ko from "knockout";
import * as Bootstrap from "ojs/ojbootstrap";
import Message = require("ojs/ojmessaging");
import "ojs/ojknockout";
import "ojs/ojformlayout";
import "ojs/ojslider";
import "ojs/ojtable";
import "ojs/ojchart";

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
import { ojDatePicker, ojDateTimePicker } from "ojs/ojdatetimepicker";
import "ojs/ojdatetimepicker";
import "ojs/ojlabel";
import "ojs/ojformlayout";
import "ojs/ojtimezonedata";
import jsonFilex from "../appController";
import { ojButtonEventMap } from "@oracle/oraclejet/dist/types/ojbutton";
import {ojSelectMany} from "ojs/ojselectcombobox"

//Button
import "ojs/ojbutton";


class TargetDetailsViewModel {
  applyToFilter = (
    event: ojDateTimePicker.valueChanged,
  ) => {
    this.problemCount = new Map();
    this.selectedProblemsFiltersMap = new Set();
    this.toDate(event.detail.value)

    if(this.fromDate()==="" || this.fromDate()===undefined){
      this.fromDate(this.fullStartDate);
    }




    


    let testToDate = new Date(this.toDate());
    let testFromDate = new Date(this.fromDate());
    let i = 0;



    this.tableData = [];
    for (var j = 0; j < jsonFilex.jsonFile.length; j++) {
      let testt1 = new Date(jsonFilex.jsonFile[j].t1);
      if ((testt1>=testFromDate && testt1<=testToDate)&&this.selectedType === "Database" && jsonFilex.jsonFile[j].db === this.selectedTarget&& (this.selectedProblemsFiltersMap.has(jsonFilex.jsonFile[j].name)||this.selectedProblemsFiltersMap.size==0)) {
        this.tableData.push({ name: jsonFilex.jsonFile[j].name, database : jsonFilex.jsonFile[j].db, instance : jsonFilex.jsonFile[j].instance, host : jsonFilex.jsonFile[j].host, from  : jsonFilex.jsonFile[j].t1, to : jsonFilex.jsonFile[j].t2});
      }else if ((testt1>=testFromDate && testt1<=testToDate)&&this.selectedType === "Instance" && jsonFilex.jsonFile[j].instance == this.selectedTarget&& (this.selectedProblemsFiltersMap.has(jsonFilex.jsonFile[j].name)||this.selectedProblemsFiltersMap.size==0)) {
        this.tableData.push({ name: jsonFilex.jsonFile[j].name, database : jsonFilex.jsonFile[j].db, instance : jsonFilex.jsonFile[j].instance, host : jsonFilex.jsonFile[j].host, from  : jsonFilex.jsonFile[j].t1, to : jsonFilex.jsonFile[j].t2});
      }else if ((testt1>=testFromDate && testt1<=testToDate)&&this.selectedType === "OnHost" && jsonFilex.jsonFile[j].host == this.selectedTarget&& (this.selectedProblemsFiltersMap.has(jsonFilex.jsonFile[j].name)||this.selectedProblemsFiltersMap.size==0)) {
        this.tableData.push({ name: jsonFilex.jsonFile[j].name, database : jsonFilex.jsonFile[j].db, instance : jsonFilex.jsonFile[j].instance, host : jsonFilex.jsonFile[j].host, from  : jsonFilex.jsonFile[j].t1, to : jsonFilex.jsonFile[j].t2});
      }else if ((testt1>=testFromDate && testt1<=testToDate)&&this.selectedType === "OnHost" && jsonFilex.jsonFile[j].onhost == this.selectedTarget&& (this.selectedProblemsFiltersMap.has(jsonFilex.jsonFile[j].name)||this.selectedProblemsFiltersMap.size==0)) {
        this.tableData.push({ name: jsonFilex.jsonFile[j].name, database : jsonFilex.jsonFile[j].db, instance : jsonFilex.jsonFile[j].instance, host : jsonFilex.jsonFile[j].onhost, from  : jsonFilex.jsonFile[j].t1, to : jsonFilex.jsonFile[j].t2});
      }else if ((testt1>=testFromDate && testt1<=testToDate)&&this.selectedType === "Cluster" && jsonFilex.jsonFile[j].cluster == this.selectedTarget&& (this.selectedProblemsFiltersMap.has(jsonFilex.jsonFile[j].name)||this.selectedProblemsFiltersMap.size==0)) {
        this.tableData.push({ name: jsonFilex.jsonFile[j].name, database : jsonFilex.jsonFile[j].db, instance : jsonFilex.jsonFile[j].instance, host : jsonFilex.jsonFile[j].host, from  : jsonFilex.jsonFile[j].t1, to : jsonFilex.jsonFile[j].t2});
      }

    }
    let temTableData = new ArrayDataProvider(this.tableData);
    this.selectionTableDP(temTableData);


    //SECOND TABLE
    this.tableData2 = [];
    for (var j = 0; j < jsonFilex.jsonFile.length; j++) {
      let testt1 = new Date(jsonFilex.jsonFile[j].t1);
      if ((testt1>=testFromDate && testt1<=testToDate)&&this.selectedType2 === "Database" && jsonFilex.jsonFile[j].db === this.selectedTarget2 && (this.selectedProblemsFiltersMap.has(jsonFilex.jsonFile[j].name)||this.selectedProblemsFiltersMap.size==0)) {
        this.tableData2.push({ name: jsonFilex.jsonFile[j].name, database : jsonFilex.jsonFile[j].db, instance : jsonFilex.jsonFile[j].instance, host : jsonFilex.jsonFile[j].host, from  : jsonFilex.jsonFile[j].t1, to : jsonFilex.jsonFile[j].t2});
      }else if ((testt1>=testFromDate && testt1<=testToDate)&&this.selectedType2 === "Instance" && jsonFilex.jsonFile[j].instance == this.selectedTarget2&& (this.selectedProblemsFiltersMap.has(jsonFilex.jsonFile[j].name)||this.selectedProblemsFiltersMap.size==0)) {
        this.tableData2.push({ name: jsonFilex.jsonFile[j].name, database : jsonFilex.jsonFile[j].db, instance : jsonFilex.jsonFile[j].instance, host : jsonFilex.jsonFile[j].host, from  : jsonFilex.jsonFile[j].t1, to : jsonFilex.jsonFile[j].t2});
      }else if ((testt1>=testFromDate && testt1<=testToDate)&&this.selectedType2 === "OnHost" && jsonFilex.jsonFile[j].host == this.selectedTarget2&& (this.selectedProblemsFiltersMap.has(jsonFilex.jsonFile[j].name)||this.selectedProblemsFiltersMap.size==0)) {
        this.tableData2.push({ name: jsonFilex.jsonFile[j].name, database : jsonFilex.jsonFile[j].db, instance : jsonFilex.jsonFile[j].instance, host : jsonFilex.jsonFile[j].host, from  : jsonFilex.jsonFile[j].t1, to : jsonFilex.jsonFile[j].t2});
      }else if ((testt1>=testFromDate && testt1<=testToDate)&&this.selectedType2 === "OnHost" && jsonFilex.jsonFile[j].onhost == this.selectedTarget2&& (this.selectedProblemsFiltersMap.has(jsonFilex.jsonFile[j].name)||this.selectedProblemsFiltersMap.size==0)) {
        this.tableData2.push({ name: jsonFilex.jsonFile[j].name, database : jsonFilex.jsonFile[j].db, instance : jsonFilex.jsonFile[j].instance, host : jsonFilex.jsonFile[j].onhost, from  : jsonFilex.jsonFile[j].t1, to : jsonFilex.jsonFile[j].t2});
      }else if ((testt1>=testFromDate && testt1<=testToDate)&&this.selectedType2 === "Cluster" && jsonFilex.jsonFile[j].cluster == this.selectedTarget2&& (this.selectedProblemsFiltersMap.has(jsonFilex.jsonFile[j].name)||this.selectedProblemsFiltersMap.size==0)) {
        this.tableData2.push({ name: jsonFilex.jsonFile[j].name, database : jsonFilex.jsonFile[j].db, instance : jsonFilex.jsonFile[j].instance, host : jsonFilex.jsonFile[j].host, from  : jsonFilex.jsonFile[j].t1, to : jsonFilex.jsonFile[j].t2});
      }

    }
    let temTableData2 = new ArrayDataProvider(this.tableData2);
    this.selectionTableDP2(temTableData2);


    //GRAPHS
    this.problemCountTB1 = new Map();

    for (let i in this.tableData){
      if(this.selectedProblemsFiltersMap.has(this.tableData[i].name) || this.selectedProblemsFiltersMap.size===0 ){
        if (this.problemCountTB1.has(this.tableData[i].from)){
          let count = this.problemCountTB1.get(this.tableData[i].from) + 1;
          this.problemCountTB1.set(this.tableData[i].from, count);
        }
        else {
          this.problemCountTB1.set(this.tableData[i].from, 1);
        }
      }
      
    }

    let problemCountTB = new Map();

    for (let i in this.tableData2){
      if(this.selectedProblemsFiltersMap.has(this.tableData2[i].name) || this.selectedProblemsFiltersMap.size===0 ){
        if (problemCountTB.has(this.tableData2[i].from)){
          let count = this.problemCountTB1.get(this.tableData2[i].from) + 1;
          problemCountTB.set(this.tableData2[i].from, count);
        }
        else {
          problemCountTB.set(this.tableData2[i].from, 1);
        }
      }
      
    }

    this.problemArrayTB1 = [];
    this.problemArrayTB = [];
    //console.log(this.problemCountTB1);
    this.problemCountTB1.forEach((value: number, key: string) => {
      this.problemArrayTB1.push({ hour: key, count: value , series: "Target 1"});
      //this.problemArrayTB.push({ hour: key, count: value , series: "Target 1"});
    });

    problemCountTB.forEach((value: number, key: string) => {
      this.problemArrayTB.push({ hour: key, count: value , series: "Target 2"});
      //this.problemArrayTB.push({ hour: key, count: value , series: "Target 1"});
    });

    let temGraphData = new ArrayDataProvider(this.problemArrayTB1);
    this.selectionGraph1(temGraphData);
    temGraphData = new ArrayDataProvider(this.problemArrayTB);
    this.selectionGraph2(temGraphData);


    this.frequencyArray1 = [];
    this.problemFrequency1 = new Map();
    for (let i in this.tableData){
      if (this.problemFrequency1.has(this.tableData[i].name)){
        let count = this.problemFrequency1.get(this.tableData[i].name) + 1;
        this.problemFrequency1.set(this.tableData[i].name, count);
      }
      else {
        this.problemFrequency1.set(this.tableData[i].name, 1);
      }
    }
    this.problemFrequency1.forEach((value: number, key: string) => {
      if(this.selectedProblemsFiltersMap.size===0 || this.selectedProblemsFiltersMap.has(key)){
        this.frequencyArray1.push({name: key, count:value, group: "Target 1"});
      }
      
    });

    let temPieData = new ArrayDataProvider(this.frequencyArray1);
    this.selectionPie1(temPieData);


    this.frequencyArray2 = [];
    //this.frequencyArray1.forEach(val => this.frequencyArray2.push(Object.assign({}, val)));
    this.problemFrequency2 = new Map();
    for (let i in this.tableData2){
      if (this.problemFrequency2.has(this.tableData2[i].name)){
        let count = this.problemFrequency2.get(this.tableData2[i].name) + 1;
        this.problemFrequency2.set(this.tableData2[i].name, count);
      }
      else {
        this.problemFrequency2.set(this.tableData2[i].name, 1);
      }
    }
    this.problemFrequency2.forEach((value: number, key: string) => {
      if(this.selectedProblemsFiltersMap.size===0 || this.selectedProblemsFiltersMap.has(key)){
        this.frequencyArray2.push({name: key, count:value, group: "Target 2"});
      }
      
    });


    temPieData = new ArrayDataProvider(this.frequencyArray2);
    this.selectionPie2(temPieData);
    

    
  }

  applyFromFilter = (
    event: ojDateTimePicker.valueChanged,
  ) => {
    this.problemCount = new Map();
    this.fromDate(event.detail.value)

    if(this.toDate()==="" || this.toDate()===undefined){
      this.toDate(this.fullEndDate);
    }




    


    let testToDate = new Date(this.toDate());
    let testFromDate = new Date(this.fromDate());
    let i = 0;



    this.tableData = [];
    for (var j = 0; j < jsonFilex.jsonFile.length; j++) {
      let testt1 = new Date(jsonFilex.jsonFile[j].t1);
      if ((testt1>=testFromDate && testt1<=testToDate)&&this.selectedType === "Database" && jsonFilex.jsonFile[j].db === this.selectedTarget&& (this.selectedProblemsFiltersMap.has(jsonFilex.jsonFile[j].name)||this.selectedProblemsFiltersMap.size==0)) {
        this.tableData.push({ name: jsonFilex.jsonFile[j].name, database : jsonFilex.jsonFile[j].db, instance : jsonFilex.jsonFile[j].instance, host : jsonFilex.jsonFile[j].host, from  : jsonFilex.jsonFile[j].t1, to : jsonFilex.jsonFile[j].t2});
      }else if ((testt1>=testFromDate && testt1<=testToDate)&&this.selectedType === "Instance" && jsonFilex.jsonFile[j].instance == this.selectedTarget&& (this.selectedProblemsFiltersMap.has(jsonFilex.jsonFile[j].name)||this.selectedProblemsFiltersMap.size==0)) {
        this.tableData.push({ name: jsonFilex.jsonFile[j].name, database : jsonFilex.jsonFile[j].db, instance : jsonFilex.jsonFile[j].instance, host : jsonFilex.jsonFile[j].host, from  : jsonFilex.jsonFile[j].t1, to : jsonFilex.jsonFile[j].t2});
      }else if ((testt1>=testFromDate && testt1<=testToDate)&&this.selectedType === "OnHost" && jsonFilex.jsonFile[j].host == this.selectedTarget&& (this.selectedProblemsFiltersMap.has(jsonFilex.jsonFile[j].name)||this.selectedProblemsFiltersMap.size==0)) {
        this.tableData.push({ name: jsonFilex.jsonFile[j].name, database : jsonFilex.jsonFile[j].db, instance : jsonFilex.jsonFile[j].instance, host : jsonFilex.jsonFile[j].host, from  : jsonFilex.jsonFile[j].t1, to : jsonFilex.jsonFile[j].t2});
      }else if ((testt1>=testFromDate && testt1<=testToDate)&&this.selectedType === "OnHost" && jsonFilex.jsonFile[j].onhost == this.selectedTarget&& (this.selectedProblemsFiltersMap.has(jsonFilex.jsonFile[j].name)||this.selectedProblemsFiltersMap.size==0)) {
        this.tableData.push({ name: jsonFilex.jsonFile[j].name, database : jsonFilex.jsonFile[j].db, instance : jsonFilex.jsonFile[j].instance, host : jsonFilex.jsonFile[j].onhost, from  : jsonFilex.jsonFile[j].t1, to : jsonFilex.jsonFile[j].t2});
      }else if ((testt1>=testFromDate && testt1<=testToDate)&&this.selectedType === "Cluster" && jsonFilex.jsonFile[j].cluster == this.selectedTarget&& (this.selectedProblemsFiltersMap.has(jsonFilex.jsonFile[j].name)||this.selectedProblemsFiltersMap.size==0)) {
        this.tableData.push({ name: jsonFilex.jsonFile[j].name, database : jsonFilex.jsonFile[j].db, instance : jsonFilex.jsonFile[j].instance, host : jsonFilex.jsonFile[j].host, from  : jsonFilex.jsonFile[j].t1, to : jsonFilex.jsonFile[j].t2});
      }

    }
    let temTableData = new ArrayDataProvider(this.tableData);
    this.selectionTableDP(temTableData);


    //SECOND TABLE
    this.tableData2 = [];
    for (var j = 0; j < jsonFilex.jsonFile.length; j++) {
      let testt1 = new Date(jsonFilex.jsonFile[j].t1);
      if ((testt1>=testFromDate && testt1<=testToDate)&&this.selectedType2 === "Database" && jsonFilex.jsonFile[j].db === this.selectedTarget2 && (this.selectedProblemsFiltersMap.has(jsonFilex.jsonFile[j].name)||this.selectedProblemsFiltersMap.size==0)) {
        this.tableData2.push({ name: jsonFilex.jsonFile[j].name, database : jsonFilex.jsonFile[j].db, instance : jsonFilex.jsonFile[j].instance, host : jsonFilex.jsonFile[j].host, from  : jsonFilex.jsonFile[j].t1, to : jsonFilex.jsonFile[j].t2});
      }else if ((testt1>=testFromDate && testt1<=testToDate)&&this.selectedType2 === "Instance" && jsonFilex.jsonFile[j].instance == this.selectedTarget2&& (this.selectedProblemsFiltersMap.has(jsonFilex.jsonFile[j].name)||this.selectedProblemsFiltersMap.size==0)) {
        this.tableData2.push({ name: jsonFilex.jsonFile[j].name, database : jsonFilex.jsonFile[j].db, instance : jsonFilex.jsonFile[j].instance, host : jsonFilex.jsonFile[j].host, from  : jsonFilex.jsonFile[j].t1, to : jsonFilex.jsonFile[j].t2});
      }else if ((testt1>=testFromDate && testt1<=testToDate)&&this.selectedType2 === "OnHost" && jsonFilex.jsonFile[j].host == this.selectedTarget2&& (this.selectedProblemsFiltersMap.has(jsonFilex.jsonFile[j].name)||this.selectedProblemsFiltersMap.size==0)) {
        this.tableData2.push({ name: jsonFilex.jsonFile[j].name, database : jsonFilex.jsonFile[j].db, instance : jsonFilex.jsonFile[j].instance, host : jsonFilex.jsonFile[j].host, from  : jsonFilex.jsonFile[j].t1, to : jsonFilex.jsonFile[j].t2});
      }else if ((testt1>=testFromDate && testt1<=testToDate)&&this.selectedType2 === "OnHost" && jsonFilex.jsonFile[j].onhost == this.selectedTarget2&& (this.selectedProblemsFiltersMap.has(jsonFilex.jsonFile[j].name)||this.selectedProblemsFiltersMap.size==0)) {
        this.tableData2.push({ name: jsonFilex.jsonFile[j].name, database : jsonFilex.jsonFile[j].db, instance : jsonFilex.jsonFile[j].instance, host : jsonFilex.jsonFile[j].onhost, from  : jsonFilex.jsonFile[j].t1, to : jsonFilex.jsonFile[j].t2});
      }else if ((testt1>=testFromDate && testt1<=testToDate)&&this.selectedType2 === "Cluster" && jsonFilex.jsonFile[j].cluster == this.selectedTarget2&& (this.selectedProblemsFiltersMap.has(jsonFilex.jsonFile[j].name)||this.selectedProblemsFiltersMap.size==0)) {
        this.tableData2.push({ name: jsonFilex.jsonFile[j].name, database : jsonFilex.jsonFile[j].db, instance : jsonFilex.jsonFile[j].instance, host : jsonFilex.jsonFile[j].host, from  : jsonFilex.jsonFile[j].t1, to : jsonFilex.jsonFile[j].t2});
      }

    }
    let temTableData2 = new ArrayDataProvider(this.tableData2);
    this.selectionTableDP2(temTableData2);


    //GRAPHS
    this.problemCountTB1 = new Map();

    for (let i in this.tableData){
      if(this.selectedProblemsFiltersMap.has(this.tableData[i].name) || this.selectedProblemsFiltersMap.size===0 ){
        if (this.problemCountTB1.has(this.tableData[i].from)){
          let count = this.problemCountTB1.get(this.tableData[i].from) + 1;
          this.problemCountTB1.set(this.tableData[i].from, count);
        }
        else {
          this.problemCountTB1.set(this.tableData[i].from, 1);
        }
      }
      
    }

    let problemCountTB = new Map();

    for (let i in this.tableData2){
      if(this.selectedProblemsFiltersMap.has(this.tableData2[i].name) || this.selectedProblemsFiltersMap.size===0 ){
        if (problemCountTB.has(this.tableData2[i].from)){
          let count = this.problemCountTB1.get(this.tableData2[i].from) + 1;
          problemCountTB.set(this.tableData2[i].from, count);
        }
        else {
          problemCountTB.set(this.tableData2[i].from, 1);
        }
      }
      
    }

    this.problemArrayTB1 = [];
    this.problemArrayTB = [];
    //console.log(this.problemCountTB1);
    this.problemCountTB1.forEach((value: number, key: string) => {
      this.problemArrayTB1.push({ hour: key, count: value , series: "Target 1"});
      //this.problemArrayTB.push({ hour: key, count: value , series: "Target 1"});
    });

    problemCountTB.forEach((value: number, key: string) => {
      this.problemArrayTB.push({ hour: key, count: value , series: "Target 2"});
      //this.problemArrayTB.push({ hour: key, count: value , series: "Target 1"});
    });

    let temGraphData = new ArrayDataProvider(this.problemArrayTB1);
    this.selectionGraph1(temGraphData);
    temGraphData = new ArrayDataProvider(this.problemArrayTB);
    this.selectionGraph2(temGraphData);


    this.frequencyArray1 = [];
    this.problemFrequency1 = new Map();
    for (let i in this.tableData){
      if (this.problemFrequency1.has(this.tableData[i].name)){
        let count = this.problemFrequency1.get(this.tableData[i].name) + 1;
        this.problemFrequency1.set(this.tableData[i].name, count);
      }
      else {
        this.problemFrequency1.set(this.tableData[i].name, 1);
      }
    }
    this.problemFrequency1.forEach((value: number, key: string) => {
      if(this.selectedProblemsFiltersMap.size===0 || this.selectedProblemsFiltersMap.has(key)){
        this.frequencyArray1.push({name: key, count:value, group: "Target 1"});
      }
      
    });

    let temPieData = new ArrayDataProvider(this.frequencyArray1);
    this.selectionPie1(temPieData);

    this.problemFrequency2 = new Map();
    for (let i in this.tableData2){
      if (this.problemFrequency2.has(this.tableData2[i].name)){
        let count = this.problemFrequency2.get(this.tableData2[i].name) + 1;
        this.problemFrequency2.set(this.tableData2[i].name, count);
      }
      else {
        this.problemFrequency2.set(this.tableData2[i].name, 1);
      }
    }
    this.frequencyArray2 = [];
    //this.frequencyArray1.forEach(val => this.frequencyArray2.push(Object.assign({}, val)));

    this.problemFrequency2.forEach((value: number, key: string) => {
      if(this.selectedProblemsFiltersMap.size===0 || this.selectedProblemsFiltersMap.has(key)){
        this.frequencyArray2.push({name: key, count:value, group: "Target 2"});
      }
      
    });


    temPieData = new ArrayDataProvider(this.frequencyArray2);
    this.selectionPie2(temPieData);
    

    
  }
  applyProblemFilters = (
    event: ojSelectMany.valueChanged<string,Record<string,string>>,
  ) => {
    this.problemCount = new Map();
    if(this.toDate()==="" || this.toDate()===undefined){
      this.toDate(this.fullEndDate);

    } 

    if(this.fromDate()==="" || this.fromDate()===undefined){
      this.fromDate(this.fullStartDate);
    }




    


    let testToDate = new Date(this.toDate());
    let testFromDate = new Date(this.fromDate());
    let i = 0;
    this.selectProblemValue(event.detail.value);
    for(i;i<this.selectProblemValue().length;i++){
      this.selectedProblemsFiltersMap.add(this.selectProblemValue()[i]);
    }

    this.tableData = [];
    for (var j = 0; j < jsonFilex.jsonFile.length; j++) {
      let testt1 = new Date(jsonFilex.jsonFile[j].t1);
      if ((testt1>=testFromDate && testt1<=testToDate)&&this.selectedType === "Database" && jsonFilex.jsonFile[j].db === this.selectedTarget&& (this.selectedProblemsFiltersMap.has(jsonFilex.jsonFile[j].name)||this.selectedProblemsFiltersMap.size==0)) {
        this.tableData.push({ name: jsonFilex.jsonFile[j].name, database : jsonFilex.jsonFile[j].db, instance : jsonFilex.jsonFile[j].instance, host : jsonFilex.jsonFile[j].host, from  : jsonFilex.jsonFile[j].t1, to : jsonFilex.jsonFile[j].t2});
      }else if ((testt1>=testFromDate && testt1<=testToDate)&&this.selectedType === "Instance" && jsonFilex.jsonFile[j].instance == this.selectedTarget&& (this.selectedProblemsFiltersMap.has(jsonFilex.jsonFile[j].name)||this.selectedProblemsFiltersMap.size==0)) {
        this.tableData.push({ name: jsonFilex.jsonFile[j].name, database : jsonFilex.jsonFile[j].db, instance : jsonFilex.jsonFile[j].instance, host : jsonFilex.jsonFile[j].host, from  : jsonFilex.jsonFile[j].t1, to : jsonFilex.jsonFile[j].t2});
      }else if ((testt1>=testFromDate && testt1<=testToDate)&&this.selectedType === "OnHost" && jsonFilex.jsonFile[j].host == this.selectedTarget&& (this.selectedProblemsFiltersMap.has(jsonFilex.jsonFile[j].name)||this.selectedProblemsFiltersMap.size==0)) {
        this.tableData.push({ name: jsonFilex.jsonFile[j].name, database : jsonFilex.jsonFile[j].db, instance : jsonFilex.jsonFile[j].instance, host : jsonFilex.jsonFile[j].host, from  : jsonFilex.jsonFile[j].t1, to : jsonFilex.jsonFile[j].t2});
      }else if ((testt1>=testFromDate && testt1<=testToDate)&&this.selectedType === "OnHost" && jsonFilex.jsonFile[j].onhost == this.selectedTarget&& (this.selectedProblemsFiltersMap.has(jsonFilex.jsonFile[j].name)||this.selectedProblemsFiltersMap.size==0)) {
        this.tableData.push({ name: jsonFilex.jsonFile[j].name, database : jsonFilex.jsonFile[j].db, instance : jsonFilex.jsonFile[j].instance, host : jsonFilex.jsonFile[j].onhost, from  : jsonFilex.jsonFile[j].t1, to : jsonFilex.jsonFile[j].t2});
      }else if ((testt1>=testFromDate && testt1<=testToDate)&&this.selectedType === "Cluster" && jsonFilex.jsonFile[j].cluster == this.selectedTarget&& (this.selectedProblemsFiltersMap.has(jsonFilex.jsonFile[j].name)||this.selectedProblemsFiltersMap.size==0)) {
        this.tableData.push({ name: jsonFilex.jsonFile[j].name, database : jsonFilex.jsonFile[j].db, instance : jsonFilex.jsonFile[j].instance, host : jsonFilex.jsonFile[j].host, from  : jsonFilex.jsonFile[j].t1, to : jsonFilex.jsonFile[j].t2});
      }

    }
    let temTableData = new ArrayDataProvider(this.tableData);
    this.selectionTableDP(temTableData);


    //SECOND TABLE
    this.tableData2 = [];
    for (var j = 0; j < jsonFilex.jsonFile.length; j++) {
      let testt1 = new Date(jsonFilex.jsonFile[j].t1);
      if ((testt1>=testFromDate && testt1<=testToDate)&&this.selectedType2 === "Database" && jsonFilex.jsonFile[j].db === this.selectedTarget2 && (this.selectedProblemsFiltersMap.has(jsonFilex.jsonFile[j].name)||this.selectedProblemsFiltersMap.size==0)) {
        this.tableData2.push({ name: jsonFilex.jsonFile[j].name, database : jsonFilex.jsonFile[j].db, instance : jsonFilex.jsonFile[j].instance, host : jsonFilex.jsonFile[j].host, from  : jsonFilex.jsonFile[j].t1, to : jsonFilex.jsonFile[j].t2});
      }else if ((testt1>=testFromDate && testt1<=testToDate)&&this.selectedType2 === "Instance" && jsonFilex.jsonFile[j].instance == this.selectedTarget2&& (this.selectedProblemsFiltersMap.has(jsonFilex.jsonFile[j].name)||this.selectedProblemsFiltersMap.size==0)) {
        this.tableData2.push({ name: jsonFilex.jsonFile[j].name, database : jsonFilex.jsonFile[j].db, instance : jsonFilex.jsonFile[j].instance, host : jsonFilex.jsonFile[j].host, from  : jsonFilex.jsonFile[j].t1, to : jsonFilex.jsonFile[j].t2});
      }else if ((testt1>=testFromDate && testt1<=testToDate)&&this.selectedType2 === "OnHost" && jsonFilex.jsonFile[j].host == this.selectedTarget2&& (this.selectedProblemsFiltersMap.has(jsonFilex.jsonFile[j].name)||this.selectedProblemsFiltersMap.size==0)) {
        this.tableData2.push({ name: jsonFilex.jsonFile[j].name, database : jsonFilex.jsonFile[j].db, instance : jsonFilex.jsonFile[j].instance, host : jsonFilex.jsonFile[j].host, from  : jsonFilex.jsonFile[j].t1, to : jsonFilex.jsonFile[j].t2});
      }else if ((testt1>=testFromDate && testt1<=testToDate)&&this.selectedType2 === "OnHost" && jsonFilex.jsonFile[j].onhost == this.selectedTarget2&& (this.selectedProblemsFiltersMap.has(jsonFilex.jsonFile[j].name)||this.selectedProblemsFiltersMap.size==0)) {
        this.tableData2.push({ name: jsonFilex.jsonFile[j].name, database : jsonFilex.jsonFile[j].db, instance : jsonFilex.jsonFile[j].instance, host : jsonFilex.jsonFile[j].onhost, from  : jsonFilex.jsonFile[j].t1, to : jsonFilex.jsonFile[j].t2});
      }else if ((testt1>=testFromDate && testt1<=testToDate)&&this.selectedType2 === "Cluster" && jsonFilex.jsonFile[j].cluster == this.selectedTarget2&& (this.selectedProblemsFiltersMap.has(jsonFilex.jsonFile[j].name)||this.selectedProblemsFiltersMap.size==0)) {
        this.tableData2.push({ name: jsonFilex.jsonFile[j].name, database : jsonFilex.jsonFile[j].db, instance : jsonFilex.jsonFile[j].instance, host : jsonFilex.jsonFile[j].host, from  : jsonFilex.jsonFile[j].t1, to : jsonFilex.jsonFile[j].t2});
      }

    }
    let temTableData2 = new ArrayDataProvider(this.tableData2);
    this.selectionTableDP2(temTableData2);


    //GRAPHS
    this.problemCountTB1 = new Map();

    for (let i in this.tableData){
      if(this.selectedProblemsFiltersMap.has(this.tableData[i].name) || this.selectedProblemsFiltersMap.size===0 ){
        if (this.problemCountTB1.has(this.tableData[i].from)){
          let count = this.problemCountTB1.get(this.tableData[i].from) + 1;
          this.problemCountTB1.set(this.tableData[i].from, count);
        }
        else {
          this.problemCountTB1.set(this.tableData[i].from, 1);
        }
      }
      
    }

    let problemCountTB = new Map();

    for (let i in this.tableData2){
      if(this.selectedProblemsFiltersMap.has(this.tableData2[i].name) || this.selectedProblemsFiltersMap.size===0 ){
        if (problemCountTB.has(this.tableData2[i].from)){
          let count = this.problemCountTB1.get(this.tableData2[i].from) + 1;
          problemCountTB.set(this.tableData2[i].from, count);
        }
        else {
          problemCountTB.set(this.tableData2[i].from, 1);
        }
      }
      
    }

    this.problemArrayTB1 = [];
    this.problemArrayTB = [];
    //console.log(this.problemCountTB1);
    this.problemCountTB1.forEach((value: number, key: string) => {
      this.problemArrayTB1.push({ hour: key, count: value , series: "Target 1"});
      //this.problemArrayTB.push({ hour: key, count: value , series: "Target 1"});
    });

    problemCountTB.forEach((value: number, key: string) => {
      this.problemArrayTB.push({ hour: key, count: value , series: "Target 2"});
      //this.problemArrayTB.push({ hour: key, count: value , series: "Target 1"});
    });

    let temGraphData = new ArrayDataProvider(this.problemArrayTB1);
    this.selectionGraph1(temGraphData);
    temGraphData = new ArrayDataProvider(this.problemArrayTB);
    this.selectionGraph2(temGraphData);


    this.frequencyArray1 = [];
    this.problemFrequency1.forEach((value: number, key: string) => {
      if(this.selectedProblemsFiltersMap.size===0 || this.selectedProblemsFiltersMap.has(key)){
        this.frequencyArray1.push({name: key, count:value, group: "Target 1"});
      }
      
    });

    let temPieData = new ArrayDataProvider(this.frequencyArray1);
    this.selectionPie1(temPieData);


    this.frequencyArray2 = [];
    //this.frequencyArray1.forEach(val => this.frequencyArray2.push(Object.assign({}, val)));

    this.problemFrequency2.forEach((value: number, key: string) => {
      if(this.selectedProblemsFiltersMap.size===0 || this.selectedProblemsFiltersMap.has(key)){
        this.frequencyArray2.push({name: key, count:value, group: "Target 2"});
      }
      
    });


    temPieData = new ArrayDataProvider(this.frequencyArray2);
    this.selectionPie2(temPieData);
    

    
  }
  //PROBLEMS FILTER

  problemsDataProvider : ArrayDataProvider<any,any>;
  problemFilters = new Map();
  readonly selectProblemValue = ko.observableArray([]);
  //Table


  //slider
  isSmall: ko.Observable<boolean>;
  columns: ko.Computed<number>;
  error: Message[];
  warning: Message[];
  info: Message[];
  confirmation: Message[];

  // Select Target Category

  private readonly category = [
    { value: "Database", label: "Database" },
    { value: "Instance", label: "Instance" },
    { value: "OnHost", label: "OnHost" },
    { value: "Cluster", label: "Cluster" },
  ];

  readonly categoryDP = new ArrayDataProvider(this.category, {
    keyAttributes: "value",
  });

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
  tableData2: Array<{ name: string, database: string, instance: string, host: string, from: string, to: string }> = [];

  selectionDP: ko.Observable<ArrayDataProvider<any, any>> = ko.observable();
  selectionDP2: ko.Observable<ArrayDataProvider<any, any>> = ko.observable();

  selectionTableDP: ko.Observable<ArrayDataProvider<any, any>> = ko.observable();
  selectionTableDP2: ko.Observable<ArrayDataProvider<any, any>> = ko.observable();

  selectionGraph1: ko.Observable<ArrayDataProvider<any, any>> = ko.observable();
  selectionGraph2: ko.Observable<ArrayDataProvider<any, any>> = ko.observable();

  selectionPie1: ko.Observable<ArrayDataProvider<any, any>> = ko.observable();
  selectionPie2: ko.Observable<ArrayDataProvider<any, any>> = ko.observable();

  selectedType = "";
  selectedType2 = "";
  startDate :ko.Observable<string>= ko.observable("N/A");
  endDate: ko.Observable<string> = ko.observable("N/A");
  readonly orientationValue = ko.observable("vertical");
  problemCountTB1 = new Map();
  dataProviderTB1 : ArrayDataProvider<any, any>;
  problemCountTB2 = new Map();
  dataProviderTB2 : ArrayDataProvider<any, any>;
  problemArrayTB: Array<{hour: string, count: number, series: string}> = [];
  problemArrayTB1: Array<{hour: string, count: number, series: string}> = [];

  problemFrequency1 = new Map();
  problemFrequency2 = new Map();
  frequencyArray1: Array<{name: string, count: number, group: string}> = [];
  frequencyArray2: Array<{name: string, count: number, group: string}> = [];

  readonly innerRadius = ko.observable(0.5);
  readonly centerLabel1 = ko.observable("Target 1");
  readonly centerLabel2 = ko.observable("Target 2");
  readonly labelStyle = ko.observable({ fontSize: "20px", color: "#999999" });

  selectedTarget = "";
  selectedTarget2 = "";

  //readonly selectionDP = ko.observable("none");

  selectType2 = (
    event: ojSelectSingle.valueChanged<string, Record<string, string>>
  ) => {
    if (event.detail.value == "Database") {
      let tempSelect = new ArrayDataProvider(this.arrayDBnames, {
        keyAttributes: "value",
      });
      this.selectionDP2(tempSelect);
      this.selectedType2 = "Database";
      console.log("2");
      console.log(this.selectionDP2());

    } else if (event.detail.value == "Instance") {
      let tempSelect = new ArrayDataProvider(this.arrayInsnames, {
        keyAttributes: "value",
      });
      this.selectionDP2(tempSelect);
      this.selectedType2 = "Instance";
    } else if (event.detail.value == "OnHost") {
      let tempSelect = new ArrayDataProvider(this.arrayHostnames, {
        keyAttributes: "value",
      });
      this.selectionDP2(tempSelect);
      this.selectedType2 = "OnHost";
    } else if (event.detail.value == "Cluster") {
      let tempSelect = new ArrayDataProvider(this.arrayClusternames, {
        keyAttributes: "value",
      });
      this.selectionDP2(tempSelect);
      this.selectedType2 = "Cluster";
    } else {
      // let tempSelect = new ArrayDataProvider(this.setAll);
      // this.selectionDP(tempSelect);

    }
    console.log(event.detail.value)
  }

  selectType = (
    event: ojSelectSingle.valueChanged<string, Record<string, string>>
  ) => {
    if (event.detail.value == "Database") {
      let tempSelect = new ArrayDataProvider(this.arrayDBnames, {
        keyAttributes: "value",
      });
      this.selectionDP(tempSelect);
      this.selectedType = "Database";
      console.log(this.selectionDP());

    } else if (event.detail.value == "Instance") {
      let tempSelect = new ArrayDataProvider(this.arrayInsnames, {
        keyAttributes: "value",
      });
      this.selectionDP(tempSelect);
      this.selectedType = "Instance";
    } else if (event.detail.value == "OnHost") {
      let tempSelect = new ArrayDataProvider(this.arrayHostnames, {
        keyAttributes: "value",
      });
      this.selectionDP(tempSelect);
      this.selectedType = "OnHost";
    } else if (event.detail.value == "Cluster") {
      let tempSelect = new ArrayDataProvider(this.arrayClusternames, {
        keyAttributes: "value",
      });
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
    this.tableData = [];
    this.selectedTarget = event.detail.value;
    for (var j = 0; j < jsonFilex.jsonFile.length; j++) {
      if (this.selectedType === "Database" && jsonFilex.jsonFile[j].db === event.detail.value && (this.selectedProblemsFiltersMap.has(jsonFilex.jsonFile[j].name)||this.selectedProblemsFiltersMap.size==0)) {
        this.tableData.push({ name: jsonFilex.jsonFile[j].name, database : jsonFilex.jsonFile[j].db, instance : jsonFilex.jsonFile[j].instance, host : jsonFilex.jsonFile[j].host, from  : jsonFilex.jsonFile[j].t1, to : jsonFilex.jsonFile[j].t2});
      }else if (this.selectedType === "Instance" && jsonFilex.jsonFile[j].instance == event.detail.value&& (this.selectedProblemsFiltersMap.has(jsonFilex.jsonFile[j].name)||this.selectedProblemsFiltersMap.size==0)) {
        this.tableData.push({ name: jsonFilex.jsonFile[j].name, database : jsonFilex.jsonFile[j].db, instance : jsonFilex.jsonFile[j].instance, host : jsonFilex.jsonFile[j].host, from  : jsonFilex.jsonFile[j].t1, to : jsonFilex.jsonFile[j].t2});
      }else if (this.selectedType === "OnHost" && jsonFilex.jsonFile[j].host == event.detail.value&& (this.selectedProblemsFiltersMap.has(jsonFilex.jsonFile[j].name)||this.selectedProblemsFiltersMap.size==0)) {
        this.tableData.push({ name: jsonFilex.jsonFile[j].name, database : jsonFilex.jsonFile[j].db, instance : jsonFilex.jsonFile[j].instance, host : jsonFilex.jsonFile[j].host, from  : jsonFilex.jsonFile[j].t1, to : jsonFilex.jsonFile[j].t2});
      }else if (this.selectedType === "OnHost" && jsonFilex.jsonFile[j].onhost == event.detail.value&& (this.selectedProblemsFiltersMap.has(jsonFilex.jsonFile[j].name)||this.selectedProblemsFiltersMap.size==0)) {
        this.tableData.push({ name: jsonFilex.jsonFile[j].name, database : jsonFilex.jsonFile[j].db, instance : jsonFilex.jsonFile[j].instance, host : jsonFilex.jsonFile[j].onhost, from  : jsonFilex.jsonFile[j].t1, to : jsonFilex.jsonFile[j].t2});
      }else if (this.selectedType === "Cluster" && jsonFilex.jsonFile[j].cluster == event.detail.value&& (this.selectedProblemsFiltersMap.has(jsonFilex.jsonFile[j].name)||this.selectedProblemsFiltersMap.size==0)) {
        this.tableData.push({ name: jsonFilex.jsonFile[j].name, database : jsonFilex.jsonFile[j].db, instance : jsonFilex.jsonFile[j].instance, host : jsonFilex.jsonFile[j].host, from  : jsonFilex.jsonFile[j].t1, to : jsonFilex.jsonFile[j].t2});
      }

    }
    //Array <{name : string, database : string, instance : string, host : string, from : string, to : string}>;
    //console.log(this.tableData);
    let temTableData = new ArrayDataProvider(this.tableData);
    this.selectionTableDP(temTableData);

    this.problemCountTB1 = new Map();

    for (let i in this.tableData){
      if (this.problemCountTB1.has(this.tableData[i].from)){
        let count = this.problemCountTB1.get(this.tableData[i].from) + 1;
        this.problemCountTB1.set(this.tableData[i].from, count);
      }
      else {
        this.problemCountTB1.set(this.tableData[i].from, 1);
      }
    }

    this.problemArrayTB1 = [];
    this.problemArrayTB = [];
    //console.log(this.problemCountTB1);
    this.problemCountTB1.forEach((value: number, key: string) => {
      this.problemArrayTB1.push({ hour: key, count: value , series: "Target 1"});
      //this.problemArrayTB.push({ hour: key, count: value , series: "Target 1"});
    });

    let temGraphData = new ArrayDataProvider(this.problemArrayTB1);
    this.selectionGraph1(temGraphData);
    temGraphData = new ArrayDataProvider(this.problemArrayTB);
    this.selectionGraph2(temGraphData);


    this.problemFrequency1 = new Map();
    for (let i in this.tableData){
      if (this.problemFrequency1.has(this.tableData[i].name)){
        let count = this.problemFrequency1.get(this.tableData[i].name) + 1;
        this.problemFrequency1.set(this.tableData[i].name, count);
      }
      else {
        this.problemFrequency1.set(this.tableData[i].name, 1);
      }
    }

    this.frequencyArray1 = [];
    this.problemFrequency1.forEach((value: number, key: string) => {
      this.frequencyArray1.push({name: key, count:value, group: "Target 1"});
    });

    let temPieData = new ArrayDataProvider(this.frequencyArray1);
    this.selectionPie1(temPieData);

    //let jsonCountTB1 = JSON.stringify(this.problemArrayTB1);
    //this.dataProviderTB1 = new ArrayDataProvider(JSON.parse(jsonCountTB1), { keyAttributes: 'hour' });
  }

  fillSelected2 = (
    event: ojSelectSingle.valueChanged<string, Record<string, string>>
  ) => {
    this.tableData2 = [];
    this.selectedTarget2 = event.detail.value;
    for (var j = 0; j < jsonFilex.jsonFile.length; j++) {
      if (this.selectedType2 === "Database" && jsonFilex.jsonFile[j].db === event.detail.value&& (this.selectedProblemsFiltersMap.has(jsonFilex.jsonFile[j].name)||this.selectedProblemsFiltersMap.size==0)) {
        this.tableData2.push({ name: jsonFilex.jsonFile[j].name, database : jsonFilex.jsonFile[j].db, instance : jsonFilex.jsonFile[j].instance, host : jsonFilex.jsonFile[j].host, from  : jsonFilex.jsonFile[j].t1, to : jsonFilex.jsonFile[j].t2});
      }else if (this.selectedType2 === "Instance" && jsonFilex.jsonFile[j].instance == event.detail.value&& (this.selectedProblemsFiltersMap.has(jsonFilex.jsonFile[j].name)||this.selectedProblemsFiltersMap.size==0)) {
        this.tableData2.push({ name: jsonFilex.jsonFile[j].name, database : jsonFilex.jsonFile[j].db, instance : jsonFilex.jsonFile[j].instance, host : jsonFilex.jsonFile[j].host, from  : jsonFilex.jsonFile[j].t1, to : jsonFilex.jsonFile[j].t2});
      }else if (this.selectedType2 === "OnHost" && jsonFilex.jsonFile[j].host == event.detail.value&& (this.selectedProblemsFiltersMap.has(jsonFilex.jsonFile[j].name)||this.selectedProblemsFiltersMap.size==0)) {
        this.tableData2.push({ name: jsonFilex.jsonFile[j].name, database : jsonFilex.jsonFile[j].db, instance : jsonFilex.jsonFile[j].instance, host : jsonFilex.jsonFile[j].host, from  : jsonFilex.jsonFile[j].t1, to : jsonFilex.jsonFile[j].t2});
      }else if (this.selectedType2 === "OnHost" && jsonFilex.jsonFile[j].onhost == event.detail.value&& (this.selectedProblemsFiltersMap.has(jsonFilex.jsonFile[j].name)||this.selectedProblemsFiltersMap.size==0)) {
        this.tableData2.push({ name: jsonFilex.jsonFile[j].name, database : jsonFilex.jsonFile[j].db, instance : jsonFilex.jsonFile[j].instance, host : jsonFilex.jsonFile[j].onhost, from  : jsonFilex.jsonFile[j].t1, to : jsonFilex.jsonFile[j].t2});
      }else if (this.selectedType2 === "Cluster" && jsonFilex.jsonFile[j].cluster == event.detail.value&& (this.selectedProblemsFiltersMap.has(jsonFilex.jsonFile[j].name)||this.selectedProblemsFiltersMap.size==0)) {
        this.tableData2.push({ name: jsonFilex.jsonFile[j].name, database : jsonFilex.jsonFile[j].db, instance : jsonFilex.jsonFile[j].instance, host : jsonFilex.jsonFile[j].host, from  : jsonFilex.jsonFile[j].t1, to : jsonFilex.jsonFile[j].t2});
      }

    }
    //Array <{name : string, database : string, instance : string, host : string, from : string, to : string}>;
    //console.log(this.tableData2);
    let temTableData = new ArrayDataProvider(this.tableData2);
    this.selectionTableDP2(temTableData);

    this.problemCountTB2 = new Map();
    //let problemArrayTB2: Array<{hour: string, count: number, series: string}> = [];
    for (let i in this.tableData2){
      if (this.problemCountTB2.has(this.tableData2[i].from)){
        let count = this.problemCountTB2.get(this.tableData2[i].from) + 1;
        this.problemCountTB2.set(this.tableData2[i].from, count);
      }
      else {
        this.problemCountTB2.set(this.tableData2[i].from, 1);
      }
    }

    this.problemArrayTB = [];
    //this.problemArrayTB = this.problemArrayTB1;
    //console.log(this.problemCountTB2);

    this.problemArrayTB1.forEach(val => this.problemArrayTB.push(Object.assign({}, val)));

    this.problemCountTB2.forEach((value: number, key: string) => {
      this.problemArrayTB.push({ hour: key, count: value , series: "Target 2"});
    });

    console.log("Array2");
    console.log(this.problemArrayTB);
    let temGraphData = new ArrayDataProvider(this.problemArrayTB);
    this.selectionGraph2(temGraphData);


    this.problemFrequency2 = new Map();
    for (let i in this.tableData2){
      if (this.problemFrequency2.has(this.tableData2[i].name)){
        let count = this.problemFrequency2.get(this.tableData2[i].name) + 1;
        this.problemFrequency2.set(this.tableData2[i].name, count);
      }
      else {
        this.problemFrequency2.set(this.tableData2[i].name, 1);
      }
    }

    this.frequencyArray2 = [];
    //this.frequencyArray1.forEach(val => this.frequencyArray2.push(Object.assign({}, val)));

    this.problemFrequency2.forEach((value: number, key: string) => {
      this.frequencyArray2.push({name: key, count:value, group: "Target 2"});
    });

    console.log(this.frequencyArray2);

    let temPieData = new ArrayDataProvider(this.frequencyArray2);
    this.selectionPie2(temPieData);

    //let jsonCountTB2 = JSON.stringify(this.problemArrayTB);
    //console.log(jsonCountTB2);
    //this.dataProviderTB2 = new ArrayDataProvider(JSON.parse(jsonCountTB2), { keyAttributes: 'hour' });
  }


  public fillData() {
    let problemFilterArray: Array<{value:string,label:string}> = [];
    let dates = [];
    for (var j = 0; j < jsonFilex.jsonFile.length; j++) {
      dates.push(jsonFilex.jsonFile[j].t1);
        if(jsonFilex.jsonFile[j].t2!=undefined && jsonFilex.jsonFile[j].t2!=""){
          dates.push(jsonFilex.jsonFile[j].t2);
        }
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
    let jsonFilterProblems = JSON.stringify(problemFilterArray);
    let startDate = dates[0].split(" ")[0];
    let endDate = dates[dates.length-1].split(" ")[0];

    this.startDate(startDate);
    this.endDate(endDate);
    this.fullStartDate = startDate + "T" + dates[0].split(" ")[1];
    this.fullEndDate = endDate + "T" + dates[dates.length-1].split(" ")[1];
    //console.log(jsonFilterProblems);
    this.problemsDataProvider = new ArrayDataProvider(JSON.parse(jsonFilterProblems),{keyAttributes:'value'});

  }



  selectedProblemsFiltersMap = new Set();
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
    //let temGraphData = new ArrayDataProvider(this.problemArrayTB1);
    //this.selectionGraph1(temGraphData);

  }
  readonly fromDate : ko.Observable<string> = ko.observable("");
  readonly toDate : ko.Observable<string> = ko.observable("");
  fullStartDate = "";
  fullEndDate = "";
  resetFilters = (event: Event,
    bindingContext: ko.BindingContext) => {
    this.selectProblemValue([]);
    this.fromDate(this.fullStartDate); 
    this.toDate(this.fullEndDate); 
    
  };

  constructor() {

    this.addTarget = ko.observable(true);
    this.fillData();
    

  }

  
  connected(): void {

    AccUtils.announce("Target Details page loaded.");
    document.title = "Target Details";
    
  }

  
  disconnected(): void {
    // implement if needed
  }

  
  transitionCompleted(): void {
    // implement if needed
  }



}

export = TargetDetailsViewModel;
