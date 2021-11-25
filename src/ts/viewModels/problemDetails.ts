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
import { ojDatePicker } from "ojs/ojdatetimepicker";
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
    for(let i =0;i<this.selectTargetValue().length;i++){
      this.problemTargetSet.add(this.selectTargetValue()[i]);
    }

    let tmpArray : Array<{array: Array<{db:string,cluster:string,host:string,from:string,to:string,instance:string,belief:number,hash:string}>}> = [];
    for (var j =0;j<jsonFilex.jsonFile.length;j++){
      let jsonItem = jsonFilex.jsonFile[j];  
      if((this.IDSet.has(jsonItem.name) || this.IDSet.size==0) && (
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

      if(this.problemArray[j].avgBelief>=75){
        this.highCount++;
        this.highArray.push(this.problemArray[j]);
      } else{
        this.mediumCount++;
        this.mediumArray.push(this.problemArray[j]);
      }
    }

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
  applyDetailsTargetFilter = (
    event: ojSelectMany.valueChanged<string,Record<string,string>>,
  ) => {
    this.selectDetailsTargetValue(event.detail.value);
    let problemDetailsTargetSet = new Set();
    for(let i =0;i<this.selectDetailsTargetValue().length;i++){
      problemDetailsTargetSet.add(this.selectDetailsTargetValue()[i]);
    }
    let tmpJSON = this.problemArray[this.selectedProblemID()].allTargets;
    let tmpArray: Array<{db:string,cluster:string,host:string,from:string,to:string,instance:string,belief:number,hash:string}> = [];
    for(let item of tmpJSON){
      if(problemDetailsTargetSet.size===0 || (problemDetailsTargetSet.has(item.db) ||problemDetailsTargetSet.has(item.cluster) || problemDetailsTargetSet.has(item.host) || problemDetailsTargetSet.has(item.instance))){
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
    this.problemArray = [];
    for(let i =0;i<this.selectProblemValue().length;i++){
      this.IDSet.add(this.selectProblemValue()[i]);
    }

    let tmpArray : Array<{array: Array<{db:string,cluster:string,host:string,from:string,to:string,instance:string,belief:number,hash:string}>}> = [];
    for (var j =0;j<jsonFilex.jsonFile.length;j++){
      let jsonItem = jsonFilex.jsonFile[j];  
      if((this.IDSet.has(jsonItem.name) || this.IDSet.size==0) && (
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

      if(this.problemArray[j].avgBelief>=75){
        this.highCount++;
        this.highArray.push(this.problemArray[j]);
      } else{
        this.mediumCount++;
        this.mediumArray.push(this.problemArray[j]);
      }
    }

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
  if(this.currentCategory().length==0){
    let tmpDataProvider = new ArrayDataProvider([])
      this.dataProvider(tmpDataProvider);

  } else if (this.currentCategory().length==2){
    let tmp = JSON.stringify(this.problemArray);
    let tmpDataProvider = new ArrayDataProvider(JSON.parse(tmp), { keyAttributes: 'name' })
      this.dataProvider(tmpDataProvider);
  } else{
    if(this.currentCategory()[0]=="High"){
      let tmp = JSON.stringify(this.highArray);
      let tmpDataProvider = new ArrayDataProvider(JSON.parse(tmp), { keyAttributes: 'name' })
      this.dataProvider(tmpDataProvider);
    } else{
      let tmp = JSON.stringify(this.mediumArray);
      let tmpDataProvider = new ArrayDataProvider(JSON.parse(tmp), { keyAttributes: 'name' })
      this.dataProvider(tmpDataProvider);
    }
  }

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
  readonly selectProblemValue = ko.observableArray([]);
  readonly selectTargetValue = ko.observableArray([]);
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

    mediumCount : number = 0;
    highCount : number = 0;
    currentCategory : ko.ObservableArray<string> = ko.observableArray(["Medium","High"]);



  constructor() {

    this.fillData();
    this.addTDPInfo();
    let problemFilterArray: Array<{value:string,label:string}> = [];
    let tmpArray : Array<{array: Array<{db:string,cluster:string,host:string,from:string,to:string,instance:string,belief:number,hash:string}>}> = [];
    for (var j =0;j<jsonFilex.jsonFile.length;j++){

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

    let jsonFilterProblems = JSON.stringify(problemFilterArray);
    this.problemsDataProvider = new ArrayDataProvider(JSON.parse(jsonFilterProblems),{keyAttributes:'value'});

    for(var j = 0;j<this.problemArray.length;j++){
      this.problemArray[j].avgBelief = this.problemArray[j].avgBelief/this.problemArray[j].count;
      
      this.problemArray[j].allTargets = tmpArray[j].array;

      if(this.problemArray[j].avgBelief>=75){
        this.highCount++;
        this.highArray.push(this.problemArray[j]);
      } else{
        this.mediumCount++;
        this.mediumArray.push(this.problemArray[j]);
      }
    }

    for(var j = 0;j<this.targetsAppeared.length;j++){
      for(let item of this.targetsAppeared[j].set.values()){
        //console.log(item);
        if(item!=undefined && item.length>1){
          this.targetsAppeared[j].array.push({target:item});
        }
      }
    }

    

    console.log(this.problemArray)

    let jsonCount = JSON.stringify(this.problemArray);
    this.lengthProblem = this.problemArray.length;
    //console.log(this.problemAccessed());

    let tmpDataProvider = new ArrayDataProvider(JSON.parse(jsonCount), { keyAttributes: 'name' })
      this.dataProvider = ko.observable(tmpDataProvider);
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
    AccUtils.announce("Problem Details page loaded.");
    document.title = "Problem Details";
    // implement further logic if needed
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

export = ProblemDetailsViewModel;
