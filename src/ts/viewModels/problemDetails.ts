import * as AccUtils from "../accUtils";

//imports barra de filtros
import * as ko from "knockout";
import { whenDocumentReady } from "ojs/ojbootstrap";
import Message = require("ojs/ojmessaging");
import ArrayDataProvider = require("ojs/ojarraydataprovider");
import "ojs/ojknockout";
import "ojs/ojselectcombobox";
import "ojs/ojformlayout";
import "ojs/ojbutton";
import "ojs/ojtable";


import * as Bootstrap from "ojs/ojbootstrap";
import { IntlDateTimeConverter } from "ojs/ojconverter-datetime";
import * as ResponsiveUtils from "ojs/ojresponsiveutils";
import { ojDatePicker, ojDateTimePicker } from "ojs/ojdatetimepicker";
import "ojs/ojdatetimepicker";
import "ojs/ojlabel";
import "ojs/ojformlayout";
import "ojs/ojtimezonedata";

import "ojs/ojlistview";
import { ojListView } from "ojs/ojlistview";

import jsonFilex from "../appController";

//targetfilters
import { ojSelectMany } from "ojs/ojselectcombobox";
import ArrayTreeDataProvider = require("ojs/ojarraytreedataprovider");
type TreeNode = { value: string; children: Array<{ value: String }> };

class ProblemDetailsViewModel {

  applyTargetFilters = (
    event: ojSelectMany.valueChanged<string,Record<string,string>>,
  ) => {
    this.selectTargetValue(event.detail.value);
    this.targetsAppeared = [];
    this.uniqueProblemCount = 0;
    this.problemNameToID = new Map();
    this.problemArray = [];
    this.lengthProblem = 0;
    this.problemTargetSet = new Set();
    if(this.toDate()==="" || this.toDate()===undefined){
      this.toDate(this.fullEndDate);

    } 

    if(this.fromDate()==="" || this.fromDate()===undefined){
      this.fromDate(this.fullStartDate);
    }




    


    let testToDate = new Date(this.toDate());
    let testFromDate = new Date(this.fromDate());

    for(let i =0;i<this.selectTargetValue().length;i++){
      this.problemTargetSet.add(this.selectTargetValue()[i]);
    }

    

    let tmpArray : Array<{array: Array<{db:string,cluster:string,host:string,from:string,to:string,instance:string,belief:number,hash:string}>}> = [];
    for (var j =0;j<jsonFilex.jsonFile.length;j++){
      let testt1 = new Date(jsonFilex.jsonFile[j].t1);
      let jsonItem = jsonFilex.jsonFile[j];  
      if((testt1>=testFromDate && testt1<=testToDate)&&(this.IDSet.has(jsonItem.name) || this.IDSet.size==0) && (
        this.problemTargetSet.has(jsonItem.db) || this.problemTargetSet.has(jsonItem.cluster) ||
        this.problemTargetSet.has(jsonItem.instance) || this.problemTargetSet.has(jsonItem.host) ||
        this.problemTargetSet.has(jsonItem.onhost) || this.problemTargetSet.size==0
      )){
      
      
        if (this.problemNameToID.has(jsonItem.name)) {
          let tmpValue = this.problemArray[this.problemNameToID.get(jsonItem.name)]
            tmpValue.avgBelief += Number(jsonItem.belief);
            tmpValue.count++;
            this.targetsAppeared[this.problemNameToID.get(jsonItem.name)].set.add(jsonItem.db);
            this.targetsAppeared[this.problemNameToID.get(jsonItem.name)].set.add(jsonItem.cluster);
            this.targetsAppeared[this.problemNameToID.get(jsonItem.name)].set.add(jsonItem.instance);
            this.targetsAppeared[this.problemNameToID.get(jsonItem.name)].set.add(jsonItem.host);
            this.targetsAppeared[this.problemNameToID.get(jsonItem.name)].set.add(jsonItem.onHost); 

            tmpArray[this.problemNameToID.get(jsonItem.name)].array.push({db:jsonItem.db,cluster:jsonItem.cluster,host:jsonItem.onHost,from:jsonItem.t1,to:jsonItem.t2,instance:jsonItem.instance,belief:Number(jsonItem.belief),hash:jsonItem.hash});


          } else {

            this.problemArray.push({id:jsonItem.id,name:jsonItem.name,count: 1,avgBelief:Number(jsonItem.belief),description:jsonItem.descr,cause:jsonItem.cause,action:jsonItem.action,mainTarget:"N/A",mainTime:jsonItem.t1,allTargets:[]})
            this.targetsAppeared.push({set: new Set(jsonItem.db),array:[]});
            this.targetsAppeared[this.uniqueProblemCount].set.add(jsonItem.cluster);
            this.targetsAppeared[this.uniqueProblemCount].set.add(jsonItem.instance);
            this.targetsAppeared[this.uniqueProblemCount].set.add(jsonItem.host);
            this.targetsAppeared[this.uniqueProblemCount].set.add(jsonItem.onHost);


            let secondTmpArray : Array<{db:string,cluster:string,host:string,from:string,to:string,instance:string,belief:number,hash:string}> = [];
            secondTmpArray.push({db:jsonItem.db,cluster:jsonItem.cluster,host:jsonItem.onHost,from:jsonItem.t1,to:jsonItem.t2,instance:jsonItem.instance,belief:Number(jsonItem.belief),hash:jsonItem.hash})
            tmpArray.push({array:secondTmpArray});
            this.problemNameToID.set(jsonFilex.jsonFile[j].name,this.uniqueProblemCount);
            this.uniqueProblemCount++;
          }
        }
    }
    


    for(var j = 0;j<this.problemArray.length;j++){
      this.problemArray[j].avgBelief = this.problemArray[j].avgBelief/this.problemArray[j].count;
      
      this.problemArray[j].allTargets = tmpArray[j].array;

      if(this.problemArray[j].avgBelief<=this.higher && this.problemArray[j].avgBelief>this.medium+3){
        this.highProbProblems++;
        this.highCount++;
        this.highArray.push(this.problemArray[j]);
      }else if(this.problemArray[j].avgBelief>= this.lower && this.problemArray[j].avgBelief<this.medium-3){
        this.lowProbProblems++;
        this.lowCount++;
        this.lowArray.push(this.problemArray[j]);
      }else{
        this.mediumProbProblems++;
        this.mediumCount++;
        this.mediumArray.push(this.problemArray[j]);
      }
    }

    this.mediumProbQuantity = ko.observable(this.mediumProbProblems);
    this.highProbQuantity = ko.observable(this.highProbProblems);
    this.lowProbQuantity = ko.observable(this.lowProbProblems);
    this.high = ko.observable(this.higher);
    this.med = ko.observable(this.medium);
    this.low = ko.observable(this.lower);

    for(var j = 0;j<this.targetsAppeared.length;j++){
      for(let item of this.targetsAppeared[j].set.values()){
        //console.log(item);
        if(item!=undefined && item.length>1){
          this.targetsAppeared[j].array.push({target:item});
        }
      }
    }

    

    let jsonCount = JSON.stringify(this.problemArray);
    this.lengthProblem = this.problemArray.length;
    //console.log(this.problemAccessed());

    let tmpDataProvider = new ArrayDataProvider(JSON.parse(jsonCount), { keyAttributes: 'name' })
    this.dataProvider(tmpDataProvider);
    
  }

  problemDetailsTargetSet = new Set();
  applyDetailsTargetFilter = (
    event: ojSelectMany.valueChanged<string,Record<string,string>>,
  ) => {
    this.selectDetailsTargetValue(event.detail.value);
    this.problemDetailsTargetSet = new Set();
    for(let i =0;i<this.selectDetailsTargetValue().length;i++){
      this.problemDetailsTargetSet.add(this.selectDetailsTargetValue()[i]);
    }
    if(this.toDateDetails()==="" || this.toDateDetails()===undefined){
      this.toDateDetails(this.fullEndDate);

    } 

    if(this.fromDateDetails()==="" || this.fromDateDetails()===undefined){
      this.fromDateDetails(this.fullStartDate);
    }

    let testToDate = new Date(this.toDateDetails());
    let testFromDate = new Date(this.fromDateDetails());
    let tmpJSON = this.problemArray[this.selectedProblemID()].allTargets;
    let tmpArray: Array<{db:string,cluster:string,host:string,from:string,to:string,instance:string,belief:number,hash:string}> = [];
    for(let item of tmpJSON){
      let tempt1 = new Date(item.from);
      if((tempt1>=testFromDate && tempt1<=testToDate)&&(this.problemDetailsTargetSet.size===0 || (this.problemDetailsTargetSet.has(item.db) ||this.problemDetailsTargetSet.has(item.cluster) || this.problemDetailsTargetSet.has(item.host) || this.problemDetailsTargetSet.has(item.instance)))){
        tmpArray.push(item);
      }
    }
    let tmp = JSON.stringify(tmpArray);
    let tmpDetails = new ArrayDataProvider(JSON.parse(tmp), { keyAttributes: 'cluster' });
    this.detailsDataProvider(tmpDetails);
  }

  


 applyProblemFilters = (
    event: ojSelectMany.valueChanged<string,Record<string,string>>,
  ) => {

    this.selectProblemValue(event.detail.value);
    this.targetsAppeared = [];
    this.lengthProblem = 0;
    this.uniqueProblemCount = 0;
    this.problemNameToID = new Map();
    this.IDSet = new Set();
    if(this.toDate()==="" || this.toDate()===undefined){
      this.toDate(this.fullEndDate);

    } 

    if(this.fromDate()==="" || this.fromDate()===undefined){
      this.fromDate(this.fullStartDate);
    }




    


    let testToDate = new Date(this.toDate());
    let testFromDate = new Date(this.fromDate());
    this.problemArray = [];
    for(let i =0;i<this.selectProblemValue().length;i++){
      this.IDSet.add(this.selectProblemValue()[i]);
    }

    let tmpArray : Array<{array: Array<{db:string,cluster:string,host:string,from:string,to:string,instance:string,belief:number,hash:string}>}> = [];
    for (var j =0;j<jsonFilex.jsonFile.length;j++){
      let jsonItem = jsonFilex.jsonFile[j];
      let testt1 = new Date(jsonFilex.jsonFile[j].t1);
      if((testt1>=testFromDate && testt1<=testToDate)&&(this.IDSet.has(jsonItem.name) || this.IDSet.size==0) && (
        this.problemTargetSet.has(jsonItem.db) || this.problemTargetSet.has(jsonItem.cluster) ||
        this.problemTargetSet.has(jsonItem.instance) || this.problemTargetSet.has(jsonItem.host) ||
        this.problemTargetSet.has(jsonItem.onhost) || this.problemTargetSet.size==0
      )){
      
      
        if (this.problemNameToID.has(jsonItem.name)) {
          let tmpValue = this.problemArray[this.problemNameToID.get(jsonItem.name)]
            tmpValue.avgBelief += Number(jsonItem.belief);
            tmpValue.count++;
            this.targetsAppeared[this.problemNameToID.get(jsonItem.name)].set.add(jsonItem.db);
            this.targetsAppeared[this.problemNameToID.get(jsonItem.name)].set.add(jsonItem.cluster);
            this.targetsAppeared[this.problemNameToID.get(jsonItem.name)].set.add(jsonItem.instance);
            this.targetsAppeared[this.problemNameToID.get(jsonItem.name)].set.add(jsonItem.host);
            this.targetsAppeared[this.problemNameToID.get(jsonItem.name)].set.add(jsonItem.onHost); 

            tmpArray[this.problemNameToID.get(jsonItem.name)].array.push({db:jsonItem.db,cluster:jsonItem.cluster,host:jsonItem.onHost,from:jsonItem.t1,to:jsonItem.t2,instance:jsonItem.instance,belief:Number(jsonItem.belief),hash:jsonItem.hash});


          } else {

            this.problemArray.push({id:jsonItem.id,name:jsonItem.name,count: 1,avgBelief:Number(jsonItem.belief),description:jsonItem.descr,cause:jsonItem.cause,action:jsonItem.action,mainTarget:"N/A",mainTime:jsonItem.t1,allTargets:[]})
            this.targetsAppeared.push({set: new Set(jsonItem.db),array:[]});
            this.targetsAppeared[this.uniqueProblemCount].set.add(jsonItem.cluster);
            this.targetsAppeared[this.uniqueProblemCount].set.add(jsonItem.instance);
            this.targetsAppeared[this.uniqueProblemCount].set.add(jsonItem.host);
            this.targetsAppeared[this.uniqueProblemCount].set.add(jsonItem.onHost);


            let secondTmpArray : Array<{db:string,cluster:string,host:string,from:string,to:string,instance:string,belief:number,hash:string}> = [];
            secondTmpArray.push({db:jsonItem.db,cluster:jsonItem.cluster,host:jsonItem.onHost,from:jsonItem.t1,to:jsonItem.t2,instance:jsonItem.instance,belief:Number(jsonItem.belief),hash:jsonItem.hash})
            tmpArray.push({array:secondTmpArray});
            this.problemNameToID.set(jsonFilex.jsonFile[j].name,this.uniqueProblemCount);
            this.uniqueProblemCount++;
          }
        }
    }


    for(var j = 0;j<this.problemArray.length;j++){
      this.problemArray[j].avgBelief = this.problemArray[j].avgBelief/this.problemArray[j].count;
      
      this.problemArray[j].allTargets = tmpArray[j].array;

      if(this.problemArray[j].avgBelief<=this.higher && this.problemArray[j].avgBelief>this.medium+3){
        this.highProbProblems++;
        this.highCount++;
        this.highArray.push(this.problemArray[j]);
      }else if(this.problemArray[j].avgBelief>= this.lower && this.problemArray[j].avgBelief<this.medium-3){
        this.lowProbProblems++;
        this.lowCount++;
        this.lowArray.push(this.problemArray[j]);
      }else{
        this.mediumProbProblems++;
        this.mediumCount++;
        this.mediumArray.push(this.problemArray[j]);
      }


    }

    this.mediumProbQuantity = ko.observable(this.mediumProbProblems);
    this.highProbQuantity = ko.observable(this.highProbProblems);
    this.lowProbQuantity = ko.observable(this.lowProbProblems);
    this.high = ko.observable(this.higher);
    this.med = ko.observable(this.medium);
    this.low = ko.observable(this.lower);

    for(var j = 0;j<this.targetsAppeared.length;j++){
      for(let item of this.targetsAppeared[j].set.values()){
        //console.log(item);
        if(item!=undefined && item.length>1){
          this.targetsAppeared[j].array.push({target:item});
        }
      }
    }

    

    let jsonCount = JSON.stringify(this.problemArray);
    this.lengthProblem = this.problemArray.length;
    //console.log(this.problemAccessed());

    let tmpDataProvider = new ArrayDataProvider(JSON.parse(jsonCount), { keyAttributes: 'name' })
    this.dataProvider(tmpDataProvider);
    
  }

  currentFrequency = 1;

  applyFromFilter = (
    event: ojDateTimePicker.valueChanged,
  ) => {

    this.fromDate(event.detail.value);
    this.targetsAppeared = [];
    this.lengthProblem = 0;
    this.uniqueProblemCount = 0;
    this.problemNameToID = new Map();
    this.IDSet = new Set();

    if(this.toDate()==="" || this.toDate()===undefined){
      this.toDate(this.fullEndDate);
    }




    


    let testToDate = new Date(this.toDate());
    let testFromDate = new Date(this.fromDate());
    this.problemArray = [];
    for(let i =0;i<this.selectProblemValue().length;i++){
      this.IDSet.add(this.selectProblemValue()[i]);
    }

    let tmpArray : Array<{array: Array<{db:string,cluster:string,host:string,from:string,to:string,instance:string,belief:number,hash:string}>}> = [];
    for (var j =0;j<jsonFilex.jsonFile.length;j++){
      let jsonItem = jsonFilex.jsonFile[j];
      let testt1 = new Date(jsonFilex.jsonFile[j].t1);
      if((testt1>=testFromDate && testt1<=testToDate)&&(this.IDSet.has(jsonItem.name) || this.IDSet.size==0) && (
        this.problemTargetSet.has(jsonItem.db) || this.problemTargetSet.has(jsonItem.cluster) ||
        this.problemTargetSet.has(jsonItem.instance) || this.problemTargetSet.has(jsonItem.host) ||
        this.problemTargetSet.has(jsonItem.onhost) || this.problemTargetSet.size==0
      )){
      
      
        if (this.problemNameToID.has(jsonItem.name)) {
          let tmpValue = this.problemArray[this.problemNameToID.get(jsonItem.name)]
            tmpValue.avgBelief += Number(jsonItem.belief);
            tmpValue.count++;
            this.targetsAppeared[this.problemNameToID.get(jsonItem.name)].set.add(jsonItem.db);
            this.targetsAppeared[this.problemNameToID.get(jsonItem.name)].set.add(jsonItem.cluster);
            this.targetsAppeared[this.problemNameToID.get(jsonItem.name)].set.add(jsonItem.instance);
            this.targetsAppeared[this.problemNameToID.get(jsonItem.name)].set.add(jsonItem.host);
            this.targetsAppeared[this.problemNameToID.get(jsonItem.name)].set.add(jsonItem.onHost); 

            tmpArray[this.problemNameToID.get(jsonItem.name)].array.push({db:jsonItem.db,cluster:jsonItem.cluster,host:jsonItem.onHost,from:jsonItem.t1,to:jsonItem.t2,instance:jsonItem.instance,belief:Number(jsonItem.belief),hash:jsonItem.hash});


          } else {

            this.problemArray.push({id:jsonItem.id,name:jsonItem.name,count: 1,avgBelief:Number(jsonItem.belief),description:jsonItem.descr,cause:jsonItem.cause,action:jsonItem.action,mainTarget:"N/A",mainTime:jsonItem.t1,allTargets:[]})
            this.targetsAppeared.push({set: new Set(jsonItem.db),array:[]});
            this.targetsAppeared[this.uniqueProblemCount].set.add(jsonItem.cluster);
            this.targetsAppeared[this.uniqueProblemCount].set.add(jsonItem.instance);
            this.targetsAppeared[this.uniqueProblemCount].set.add(jsonItem.host);
            this.targetsAppeared[this.uniqueProblemCount].set.add(jsonItem.onHost);


            let secondTmpArray : Array<{db:string,cluster:string,host:string,from:string,to:string,instance:string,belief:number,hash:string}> = [];
            secondTmpArray.push({db:jsonItem.db,cluster:jsonItem.cluster,host:jsonItem.onHost,from:jsonItem.t1,to:jsonItem.t2,instance:jsonItem.instance,belief:Number(jsonItem.belief),hash:jsonItem.hash})
            tmpArray.push({array:secondTmpArray});
            this.problemNameToID.set(jsonFilex.jsonFile[j].name,this.uniqueProblemCount);
            this.uniqueProblemCount++;
          }
        }
    }


    for(var j = 0;j<this.problemArray.length;j++){
      this.problemArray[j].avgBelief = this.problemArray[j].avgBelief/this.problemArray[j].count;
      
      this.problemArray[j].allTargets = tmpArray[j].array;

      if(this.problemArray[j].avgBelief<=this.higher && this.problemArray[j].avgBelief>this.medium+3){
        this.highProbProblems++;
        this.highCount++;
        this.highArray.push(this.problemArray[j]);
      }else if(this.problemArray[j].avgBelief>= this.lower && this.problemArray[j].avgBelief<this.medium-3){
        this.lowProbProblems++;
        this.lowCount++;
        this.lowArray.push(this.problemArray[j]);
      }else{
        this.mediumProbProblems++;
        this.mediumCount++;
        this.mediumArray.push(this.problemArray[j]);
      }


    }

    this.mediumProbQuantity = ko.observable(this.mediumProbProblems);
    this.highProbQuantity = ko.observable(this.highProbProblems);
    this.lowProbQuantity = ko.observable(this.lowProbProblems);
    this.high = ko.observable(this.higher);
    this.med = ko.observable(this.medium);
    this.low = ko.observable(this.lower);

    for(var j = 0;j<this.targetsAppeared.length;j++){
      for(let item of this.targetsAppeared[j].set.values()){
        //console.log(item);
        if(item!=undefined && item.length>1){
          this.targetsAppeared[j].array.push({target:item});
        }
      }
    }

    

    let jsonCount = JSON.stringify(this.problemArray);
    this.lengthProblem = this.problemArray.length;
    //console.log(this.problemAccessed());

    let tmpDataProvider = new ArrayDataProvider(JSON.parse(jsonCount), { keyAttributes: 'name' })
    this.dataProvider(tmpDataProvider);
    
  }

  fromDateDetails = ko.observable("");
  toDateDetails = ko.observable("");


  applyFromFilterDetails = (
    event: ojDateTimePicker.valueChanged,
  ) => {
    this.fromDateDetails(event.detail.value);
    if(this.toDateDetails()==="" || this.toDateDetails()===undefined){
      this.toDateDetails(this.fullEndDate);
    }



    let testToDate = new Date(this.toDateDetails());
    let testFromDate = new Date(this.fromDateDetails());
    let tmpJSON = this.problemArray[this.selectedProblemID()].allTargets;
    let tmpArray: Array<{db:string,cluster:string,host:string,from:string,to:string,instance:string,belief:number,hash:string}> = [];
    for(let item of tmpJSON){
      let tempt1 = new Date(item.from);
      if((tempt1>=testFromDate && tempt1<=testToDate)&&(this.problemDetailsTargetSet.size===0 || (this.problemDetailsTargetSet.has(item.db) ||this.problemDetailsTargetSet.has(item.cluster) || this.problemDetailsTargetSet.has(item.host) || this.problemDetailsTargetSet.has(item.instance)))){
        tmpArray.push(item);
      }
    }
    let tmp = JSON.stringify(tmpArray);
    let tmpDetails = new ArrayDataProvider(JSON.parse(tmp), { keyAttributes: 'cluster' });
    this.detailsDataProvider(tmpDetails);


    }
  applyToFilterDetails = (
    event: ojDateTimePicker.valueChanged,
  ) => {
    this.toDateDetails(event.detail.value);
    if(this.fromDateDetails()==="" || this.fromDateDetails()===undefined){
      this.fromDateDetails(this.fullStartDate);
    }



    let testToDate = new Date(this.toDateDetails());
    let testFromDate = new Date(this.fromDateDetails());
    let tmpJSON = this.problemArray[this.selectedProblemID()].allTargets;
    let tmpArray: Array<{db:string,cluster:string,host:string,from:string,to:string,instance:string,belief:number,hash:string}> = [];
    for(let item of tmpJSON){
      let tempt1 = new Date(item.from);
      if((tempt1>=testFromDate && tempt1<=testToDate)&&(this.problemDetailsTargetSet.size===0 || (this.problemDetailsTargetSet.has(item.db) ||this.problemDetailsTargetSet.has(item.cluster) || this.problemDetailsTargetSet.has(item.host) || this.problemDetailsTargetSet.has(item.instance)))){
        tmpArray.push(item);
      }
    }
    let tmp = JSON.stringify(tmpArray);
    let tmpDetails = new ArrayDataProvider(JSON.parse(tmp), { keyAttributes: 'cluster' });
    this.detailsDataProvider(tmpDetails);


    }

  applyToFilter = (
    event: ojDateTimePicker.valueChanged,
  ) => {

    this.toDate(event.detail.value);
    this.targetsAppeared = [];
    this.lengthProblem = 0;
    this.uniqueProblemCount = 0;
    this.problemNameToID = new Map();
    this.IDSet = new Set();


    if(this.fromDate()==="" || this.fromDate()===undefined){
      this.fromDate(this.fullStartDate);
    }




    


    let testToDate = new Date(this.toDate());
    let testFromDate = new Date(this.fromDate());
    this.problemArray = [];
    for(let i =0;i<this.selectProblemValue().length;i++){
      this.IDSet.add(this.selectProblemValue()[i]);
    }

    let tmpArray : Array<{array: Array<{db:string,cluster:string,host:string,from:string,to:string,instance:string,belief:number,hash:string}>}> = [];
    for (var j =0;j<jsonFilex.jsonFile.length;j++){
      let jsonItem = jsonFilex.jsonFile[j];
      let testt1 = new Date(jsonFilex.jsonFile[j].t1);
      if((testt1>=testFromDate && testt1<=testToDate)&&(this.IDSet.has(jsonItem.name) || this.IDSet.size==0) && (
        this.problemTargetSet.has(jsonItem.db) || this.problemTargetSet.has(jsonItem.cluster) ||
        this.problemTargetSet.has(jsonItem.instance) || this.problemTargetSet.has(jsonItem.host) ||
        this.problemTargetSet.has(jsonItem.onhost) || this.problemTargetSet.size==0
      )){
      
      
        if (this.problemNameToID.has(jsonItem.name)) {
          let tmpValue = this.problemArray[this.problemNameToID.get(jsonItem.name)]
            tmpValue.avgBelief += Number(jsonItem.belief);
            tmpValue.count++;
            this.targetsAppeared[this.problemNameToID.get(jsonItem.name)].set.add(jsonItem.db);
            this.targetsAppeared[this.problemNameToID.get(jsonItem.name)].set.add(jsonItem.cluster);
            this.targetsAppeared[this.problemNameToID.get(jsonItem.name)].set.add(jsonItem.instance);
            this.targetsAppeared[this.problemNameToID.get(jsonItem.name)].set.add(jsonItem.host);
            this.targetsAppeared[this.problemNameToID.get(jsonItem.name)].set.add(jsonItem.onHost); 

            tmpArray[this.problemNameToID.get(jsonItem.name)].array.push({db:jsonItem.db,cluster:jsonItem.cluster,host:jsonItem.onHost,from:jsonItem.t1,to:jsonItem.t2,instance:jsonItem.instance,belief:Number(jsonItem.belief),hash:jsonItem.hash});


          } else {

            this.problemArray.push({id:jsonItem.id,name:jsonItem.name,count: 1,avgBelief:Number(jsonItem.belief),description:jsonItem.descr,cause:jsonItem.cause,action:jsonItem.action,mainTarget:"N/A",mainTime:jsonItem.t1,allTargets:[]})
            this.targetsAppeared.push({set: new Set(jsonItem.db),array:[]});
            this.targetsAppeared[this.uniqueProblemCount].set.add(jsonItem.cluster);
            this.targetsAppeared[this.uniqueProblemCount].set.add(jsonItem.instance);
            this.targetsAppeared[this.uniqueProblemCount].set.add(jsonItem.host);
            this.targetsAppeared[this.uniqueProblemCount].set.add(jsonItem.onHost);


            let secondTmpArray : Array<{db:string,cluster:string,host:string,from:string,to:string,instance:string,belief:number,hash:string}> = [];
            secondTmpArray.push({db:jsonItem.db,cluster:jsonItem.cluster,host:jsonItem.onHost,from:jsonItem.t1,to:jsonItem.t2,instance:jsonItem.instance,belief:Number(jsonItem.belief),hash:jsonItem.hash})
            tmpArray.push({array:secondTmpArray});
            this.problemNameToID.set(jsonFilex.jsonFile[j].name,this.uniqueProblemCount);
            this.uniqueProblemCount++;
          }
        }
    }


    for(var j = 0;j<this.problemArray.length;j++){
      this.problemArray[j].avgBelief = this.problemArray[j].avgBelief/this.problemArray[j].count;
      
      this.problemArray[j].allTargets = tmpArray[j].array;

      if(this.problemArray[j].avgBelief<=this.higher && this.problemArray[j].avgBelief>this.medium+3){
        this.highProbProblems++;
        this.highCount++;
        this.highArray.push(this.problemArray[j]);
      }else if(this.problemArray[j].avgBelief>= this.lower && this.problemArray[j].avgBelief<this.medium-3){
        this.lowProbProblems++;
        this.lowCount++;
        this.lowArray.push(this.problemArray[j]);
      }else{
        this.mediumProbProblems++;
        this.mediumCount++;
        this.mediumArray.push(this.problemArray[j]);
      }


    }

    this.mediumProbQuantity = ko.observable(this.mediumProbProblems);
    this.highProbQuantity = ko.observable(this.highProbProblems);
    this.lowProbQuantity = ko.observable(this.lowProbProblems);
    this.high = ko.observable(this.higher);
    this.med = ko.observable(this.medium);
    this.low = ko.observable(this.lower);

    for(var j = 0;j<this.targetsAppeared.length;j++){
      for(let item of this.targetsAppeared[j].set.values()){
        //console.log(item);
        if(item!=undefined && item.length>1){
          this.targetsAppeared[j].array.push({target:item});
        }
      }
    }

    

    let jsonCount = JSON.stringify(this.problemArray);
    this.lengthProblem = this.problemArray.length;
    //console.log(this.problemAccessed());

    let tmpDataProvider = new ArrayDataProvider(JSON.parse(jsonCount), { keyAttributes: 'name' })
    this.dataProvider(tmpDataProvider);
    
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
  higher;
  lower;
  medium;
  mediumProbQuantity: ko.Observable<number> = ko.observable(0);
  highProbQuantity: ko.Observable<number> = ko.observable(0);
  lowProbQuantity: ko.Observable<number> = ko.observable(0);

  high: ko.Observable<number> = ko.observable(0);
  med: ko.Observable<number> = ko.observable(0);
  low: ko.Observable<number> = ko.observable(0);




  public addTDPInfo() {
    this.targetFilterDP = new ArrayTreeDataProvider(this.arrayInfo, {
      keyAttributes: "value",
      keyAttributesScope: "sibling",
    });
    this.resultCount = ko.observable(this.arrayInfo.length);
    //console.log("lista de datos: "+ this.arrayInfo[2].value);
  }


  public fillData() {
    for (var j = 0; j < jsonFilex.jsonFile.length; j++) {


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


  }

  IDSet = new Set();
  //For each binding
  problemAccessed :ko.Observable<String> = ko.observable("null");
  lengthProblem : number = 0;
  mediumArray: Array<{id:string,name: string, count: number, avgBelief: number, description: string, cause: string, 
    action: string, mainTarget:string, mainTime: string, 
    allTargets: Array<{db:string,cluster:string,host:string,from:string,to:string,instance:string,belief:number,hash:string}>}> = [];

    lowArray: Array<{id:string,name: string, count: number, avgBelief: number, description: string, cause: string, 
      action: string, mainTarget:string, mainTime: string, 
      allTargets: Array<{db:string,cluster:string,host:string,from:string,to:string,instance:string,belief:number,hash:string}>}> = [];

    highArray: Array<{id:string,name: string, count: number, avgBelief: number, description: string, cause: string, 
      action: string, mainTarget:string, mainTime: string, 
      allTargets: Array<{db:string,cluster:string,host:string,from:string,to:string,instance:string,belief:number,hash:string}>}> = [];
  selectedProblemID: ko.Observable<number> = ko.observable(-1);
  selectedProblem : ko.Observable<{name: string, count: number, avgBelief: number, description: string, cause: string, 
    action: string, mainTarget:string, mainTime: string, id:string,
    allTargets: Array<{db:string,cluster:string,host:string,from:string,to:string,instance:string,belief:number,hash:string}>}> 
    = ko.observable({name: "N/A", count: -1, avgBelief: -1, description: "N/A", cause: "N/A", 
      action: "N/A", mainTarget:"N/A", mainTime: "N/A", id: "N/A", 
      allTargets: []});
  problemCount = new Map();
  problemNameToID = new Map();
  uniqueProblemCount : number = 0;
  dataProvider : ko.Observable<ArrayDataProvider<any, any>>;
  detailsDataProvider : ko.Observable<ArrayDataProvider<any, any>> = ko.observable();

  targetsAppearedProvider: ko.Observable<ArrayDataProvider<any,any>> = ko.observable();
  targetsAppeared : Array<{set: Set<string>,array:Array<{target: string}>}> = [];


  //BUTTON ACCESS PROBLEM

  accessProblem = (
    event: Event,
    current: { data: { name: string } },
    bindingContext: ko.BindingContext
  ) => {
    
    this.selectedProblemID(this.problemNameToID.get(current.data.name));
    this.selectedProblem(this.problemArray[this.selectedProblemID()]);
    let tmp = JSON.stringify(this.problemArray[this.selectedProblemID()].allTargets);
    let tmpDetails = new ArrayDataProvider(JSON.parse(tmp), { keyAttributes: 'cluster' });
    this.detailsDataProvider(tmpDetails);
    let tmp2 = JSON.stringify(this.targetsAppeared[this.selectedProblemID()].array);
    let tmpTargets = new ArrayDataProvider(JSON.parse(tmp2));
    this.targetsAppearedProvider(tmpTargets);
    this.problemAccessed(current.data.name);
    this.problemAccessed.valueHasMutated();


  };

//filter category
filterCategory = (
  event: Event,
  bindingContext: ko.BindingContext
) => {
  

  this.problemAccessed("null");
  this.problemAccessed.valueHasMutated();
  
  //console.log(this.currentCategory());
};

  //Go Back
  goBack = (
    event: Event,
    bindingContext: ko.BindingContext
  ) => {
    
    
    this.problemAccessed("null");
    this.problemAccessed.valueHasMutated();
  };

  resetFilters = (event: Event,
    bindingContext: ko.BindingContext) => {
    this.selectProblemValue([]);
    this.fromDate(this.fullStartDate); 
    this.toDate(this.fullEndDate); 
    this.selectTargetValue([]);
    
  };


  //Prev
  prev = (
    event: Event,
    bindingContext: ko.BindingContext
  ) => {
    this.selectedProblemID(this.selectedProblemID()-1);
    this.selectedProblem(this.problemArray[this.selectedProblemID()]);
    let tmp = JSON.stringify(this.problemArray[this.selectedProblemID()].allTargets);
    let tmpDetails = new ArrayDataProvider(JSON.parse(tmp), { keyAttributes: 'cluster' });
    this.detailsDataProvider(tmpDetails);
    let tmp2 = JSON.stringify(this.targetsAppeared[this.selectedProblemID()].array);
    let tmpTargets = new ArrayDataProvider(JSON.parse(tmp2));
    this.targetsAppearedProvider(tmpTargets); 
  };

  next = (
    event: Event,
    bindingContext: ko.BindingContext
  ) => {
    this.selectedProblemID(this.selectedProblemID()+1);
    this.selectedProblem(this.problemArray[this.selectedProblemID()]);
    let tmp = JSON.stringify(this.problemArray[this.selectedProblemID()].allTargets);
    let tmpDetails = new ArrayDataProvider(JSON.parse(tmp), { keyAttributes: 'cluster' });
    this.detailsDataProvider(tmpDetails);
    let tmp2 = JSON.stringify(this.targetsAppeared[this.selectedProblemID()].array);
    let tmpTargets = new ArrayDataProvider(JSON.parse(tmp2));
    this.targetsAppearedProvider(tmpTargets);
  };

  // Problems
  //PROBLEMS FILTER

  problemsDataProvider : ArrayDataProvider<any,any>;
  problemFilters = new Map();
  problemTargetSet = new Set();
  fullStartDate = "";
  fullEndDate = "";
  readonly selectProblemValue = ko.observableArray([]);
  readonly selectTargetValue = ko.observableArray([]);
  readonly fromDate : ko.Observable<string> = ko.observable("");
  readonly toDate : ko.Observable<string> = ko.observable("");
  readonly selectDetailsTargetValue = ko.observableArray([]);
  


  //ANALYZE

  problemArray: Array<{id:string,name: string, count: number, avgBelief: number, description: string, cause: string, 
    action: string, mainTarget:string, mainTime: string, 
    allTargets: Array<{db:string,cluster:string,host:string,from:string,to:string,instance:string,belief:number,hash:string}>}> = [];

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
    startDate :ko.Observable<string>= ko.observable("N/A");
  endDate: ko.Observable<string> = ko.observable("N/A");

    mediumCount : number = 0;
    highCount : number = 0;
    lowCount : number = 0;
    
    mediumProbProblems = 0;
    highProbProblems = 0;
    lowProbProblems = 0;
    
    currentCategory : ko.ObservableArray<string> = ko.observableArray(["Low","Medium","High"]);

    


  constructor() {


    this.fillData();
    this.addTDPInfo();
    let problemFilterArray: Array<{value:string,label:string}> = [];
    let dates = [];
    let tmpArray : Array<{array: Array<{db:string,cluster:string,host:string,from:string,to:string,instance:string,belief:number,hash:string}>}> = [];
    this.higher=jsonFilex.jsonFile[0].belief
    this.lower=this.higher
    for (var j =0;j<jsonFilex.jsonFile.length;j++){
      
      if(jsonFilex.jsonFile[j].belief<this.lower){
        this.lower=jsonFilex.jsonFile[j].belief
      }

      if(jsonFilex.jsonFile[j].belief>this.higher){
        this.higher=jsonFilex.jsonFile[j].belief
      }
   

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
      let jsonItem = jsonFilex.jsonFile[j];  
      if (this.problemNameToID.has(jsonItem.name)) {
        let tmpValue = this.problemArray[this.problemNameToID.get(jsonItem.name)]
          tmpValue.avgBelief += Number(jsonItem.belief);
          tmpValue.count++;
          this.targetsAppeared[this.problemNameToID.get(jsonItem.name)].set.add(jsonItem.db);
          this.targetsAppeared[this.problemNameToID.get(jsonItem.name)].set.add(jsonItem.cluster);
          this.targetsAppeared[this.problemNameToID.get(jsonItem.name)].set.add(jsonItem.instance);
          this.targetsAppeared[this.problemNameToID.get(jsonItem.name)].set.add(jsonItem.host);
          this.targetsAppeared[this.problemNameToID.get(jsonItem.name)].set.add(jsonItem.onHost); 

          tmpArray[this.problemNameToID.get(jsonItem.name)].array.push({db:jsonItem.db,cluster:jsonItem.cluster,host:jsonItem.onHost,from:jsonItem.t1,to:jsonItem.t2,instance:jsonItem.instance,belief:Number(jsonItem.belief),hash:jsonItem.hash});


        } else {

          this.problemArray.push({id:jsonItem.id,name:jsonItem.name,count: 1,avgBelief:Number(jsonItem.belief),description:jsonItem.descr,cause:jsonItem.cause,action:jsonItem.action,mainTarget:"N/A",mainTime:jsonItem.t1,allTargets:[]})
          this.targetsAppeared.push({set: new Set(jsonItem.db),array:[]});
          this.targetsAppeared[this.uniqueProblemCount].set.add(jsonItem.cluster);
          this.targetsAppeared[this.uniqueProblemCount].set.add(jsonItem.instance);
          this.targetsAppeared[this.uniqueProblemCount].set.add(jsonItem.host);
          this.targetsAppeared[this.uniqueProblemCount].set.add(jsonItem.onHost);


          let secondTmpArray : Array<{db:string,cluster:string,host:string,from:string,to:string,instance:string,belief:number,hash:string}> = [];
          secondTmpArray.push({db:jsonItem.db,cluster:jsonItem.cluster,host:jsonItem.onHost,from:jsonItem.t1,to:jsonItem.t2,instance:jsonItem.instance,belief:Number(jsonItem.belief),hash:jsonItem.hash})
          tmpArray.push({array:secondTmpArray});
          this.problemNameToID.set(jsonFilex.jsonFile[j].name,this.uniqueProblemCount);
          this.uniqueProblemCount++;
        }
    }

    if(!isNaN(Number(this.higher))){
      var higherValue = Number(this.higher);
    } else{
      higherValue = this.higher
    }
    if(!isNaN(Number(this.lower))){
      var lowerValue = Number(this.lower);
    } else{
      lowerValue = this.lower
    }

    this.medium=(lowerValue+higherValue)/2
    console.log("numero menor "+ this.lower)
    console.log("numero medio "+ this.medium)
    console.log("numero mayor "+ this.higher)

    let jsonFilterProblems = JSON.stringify(problemFilterArray);
    this.problemsDataProvider = new ArrayDataProvider(JSON.parse(jsonFilterProblems),{keyAttributes:'value'});

    console.log(this.problemArray)
    for(var j = 0;j<this.problemArray.length;j++){
      this.problemArray[j].avgBelief = this.problemArray[j].avgBelief/this.problemArray[j].count;
      
      this.problemArray[j].allTargets = tmpArray[j].array;

      if(this.problemArray[j].avgBelief<=this.higher && this.problemArray[j].avgBelief>this.medium+3){
        this.highCount++;
        this.highArray.push(this.problemArray[j]);
      }else if(this.problemArray[j].avgBelief>= this.lower && this.problemArray[j].avgBelief<this.medium-3){
        this.lowCount++;
        this.lowArray.push(this.problemArray[j]);
      }else{
        this.mediumCount++;
        this.mediumArray.push(this.problemArray[j]);
      }



    }
    this.mediumProbQuantity = ko.observable(this.mediumProbProblems);
    this.highProbQuantity = ko.observable(this.highProbProblems);
    this.lowProbQuantity = ko.observable(this.lowProbProblems);
    this.high = ko.observable(this.higher);
    this.med = ko.observable(this.medium);
    this.low = ko.observable(this.lower);
    console.log(this.higher)

    for(var j = 0;j<this.targetsAppeared.length;j++){
      for(let item of this.targetsAppeared[j].set.values()){
        //console.log(item);
        if(item!=undefined && item.length>1){
          this.targetsAppeared[j].array.push({target:item});
        }
      }
    }

    let startDate = dates[0].split(" ")[0];
    let endDate = dates[dates.length-1].split(" ")[0];

    this.startDate(startDate);
    this.endDate(endDate);
    this.fullStartDate = startDate + "T" + dates[0].split(" ")[1];
    this.fullEndDate = endDate + "T" + dates[dates.length-1].split(" ")[1];



    let jsonCount = JSON.stringify(this.problemArray);
    this.lengthProblem = this.problemArray.length;


    let tmpDataProvider = new ArrayDataProvider(JSON.parse(jsonCount), { keyAttributes: 'name' })
      this.dataProvider = ko.observable(tmpDataProvider);
  }


  
  connected(): void {
    AccUtils.announce("Problem Details page loaded.");
    document.title = "Problem Details";
    // implement further logic if needed
  }

  
  disconnected(): void {
    // implement if needed
  }

  
  transitionCompleted(): void {
    // implement if needed
  }
}

export = ProblemDetailsViewModel;
