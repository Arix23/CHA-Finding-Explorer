import * as AccUtils from "../accUtils";
import * as ko from "knockout";
import jsonFilex from "../appController"
import { whenDocumentReady } from "ojs/ojbootstrap";
import { FilePickerElement } from 'ojs/ojfilepicker';
import "ojs/ojknockout";
import "ojs/ojfilepicker";
import "ojs/ojinputtext";
import "ojs/ojlabel";
import "ojs/ojcheckboxset";

//imports barra de filtros
import Message = require("ojs/ojmessaging");
import ArrayDataProvider = require("ojs/ojarraydataprovider");
import "ojs/ojknockout";
import "ojs/ojselectcombobox";
import "ojs/ojformlayout";


import * as Bootstrap from "ojs/ojbootstrap";
import { IntlDateTimeConverter } from "ojs/ojconverter-datetime";
import * as ResponsiveUtils from "ojs/ojresponsiveutils";
import { ojDatePicker } from "ojs/ojdatetimepicker";
import "ojs/ojdatetimepicker";
import "ojs/ojlabel";
import "ojs/ojformlayout";
import "ojs/ojtimezonedata";
import { oj } from "@oracle/oraclejet/dist/types";



class DashboardViewModel {

  // Problems
  private readonly browsers = [
    { value: "Private Network Trafficer", label: "Private Network Traffic" },
    { value: "Firefox", label: "Firefox" },
    { value: "Chrome", label: "Chrome" },
    { value: "Opera", label: "Opera" },
    { value: "Safari", label: "Safari" },
  ];
  readonly browsersDP = new ArrayDataProvider(this.browsers, {
    keyAttributes: "value",
  });

  // Date picker
  timeFullConverter: IntlDateTimeConverter;
  error: Message[];
  warning: Message[];
  info: Message[];
  confirmation: Message[];
  value: ko.Observable<string>;
  jsonUploaded: ko.Observable<boolean>;
  numberOfMonths: number;
  datePickerMonths: ojDatePicker["datePicker"];
  largeScreenMatch: MediaQueryList;
  datePickerWeek: ojDatePicker["datePicker"];
  timePicker: object;

  map = new Map();
  databaseMaxCount = 0;
  instanceMaxCount = 0;
  onHostMaxCount = 0;
  problemMaxCount = 0;
  clusterMaxCount = 0;
  maxProblem = "N/A";
  maxDataBase = "N/A";
  maxInstance = "N/A";
  maxOnHost = "N/A";
  maxCluster = "N/A";
  mediumProbProblems = 0;
  highProbProblems = 0;

  
  
  constructor() {
    
    
    if(jsonFilex.jsonFile!=null){
      
      this.jsonUploaded = ko.observable(true);
      this.calculateInfo();
      
    } else{
      this.jsonUploaded = ko.observable(false);
    }


  }

  public calculateInfo() {
    if (jsonFilex.jsonFile != null) {
      //console.log("HOLA");
      this.jsonFile = jsonFilex.jsonFile;
      console.log(this.jsonFile.length);
      this.numberProblems(this.jsonFile.length); 
      


      //PROCESAMIENTO DEL JSON PARA OBTENER VALORES NECESARIOS PARA EL FUNCIONAMIENTO DEL DASHBOARD
      let maxHourValue = 0;
      let maxDayValue = 0;
      let month = 0;
      let year = 0;
      for (var i = 0; i < this.jsonFile.length; i++) {


        //CALCULATE HOUR MOST PROBLEMS
        let split1 = this.jsonFile[i].t1.split(" ");
        let date = split1[0].split("-");
        let day = date[2];
        let hour = split1[1].split(":");
        let hourExtracted = hour[0];
        let hourMap = new Map();
        let maxHourCount = 0
        

        if(hourMap.has(hourExtracted+day)){
          hourMap.set(hourExtracted,hourMap.get(hourExtracted+day)+1);
        } else{
          hourMap.set(hourExtracted+day,1);
        }

        if(hourMap.get(hourExtracted+day)>maxHourCount){
          maxHourCount=hourMap.get(hourExtracted+day);
          maxHourValue=hourExtracted;
          maxDayValue = day;
          month = date[1];
          year = date[0];
        }


        //GET QUANTITY OF PROBLEMS OF A CERTAIN PROBABILITY

        if(this.jsonFile[i].belief<75.0){
          this.mediumProbProblems++;
        } else{
          this.highProbProblems++;
        }

        //GET MOST FREQUENT PROBLEM
        if(this.map.has(this.jsonFile[i].name)){
          this.map.set(this.jsonFile[i].name,this.map.get(this.jsonFile[i].name)+1)
        } else{
          this.map.set(this.jsonFile[i].name,1);
        }
        if(this.map.get(this.jsonFile[i].name)>this.problemMaxCount){
          this.problemMaxCount= this.map.get(this.jsonFile[i].name);
          this.maxProblem = this.jsonFile[i].name
        }

        

        //GET DB WITH MOST ERRORS




        if (this.map.has(this.jsonFile[i].db)) {
          if (this.jsonFile[i].db != undefined) {
            this.map.set(this.jsonFile[i].db, this.map.get(this.jsonFile[i].db) + 1);
          }

        } else {
          if (this.jsonFile[i].db != undefined) {
            this.map.set(this.jsonFile[i].db, 1);
          }

        }

        if (this.jsonFile[i].db != undefined) {
          if (this.map.get(this.jsonFile[i].db) > this.databaseMaxCount) {
            this.databaseMaxCount = this.map.get(this.jsonFile[i].db);
            this.maxDataBase = this.jsonFile[i].db
          }

        }



        // GET HOST WITH MOST ERRORS

        if (this.map.has(this.jsonFile[i].onhost) || this.map.has(this.jsonFile[i].onhost)) {
          console.log("entro en host");
          if (this.jsonFile[i].onhost != undefined) {
            this.map.set(this.jsonFile[i].onhost, this.map.get(this.jsonFile[i].onhost) + 1)
          } else if (this.jsonFile[i].host != undefined) {
            this.map.set(this.jsonFile[i].host, this.map.get(this.jsonFile[i].host) + 1)
          }
        } else {
          console.log("entro en host");
          if (this.jsonFile[i].onhost != undefined) {
            this.map.set(this.jsonFile[i].onhost, 1);
          } else if (this.jsonFile[i].host != undefined) {
           this.map.set(this.jsonFile[i].host, 1);
          }
        }

        if (this.jsonFile[i].onhost != undefined) {
          if (this.map.get(this.jsonFile[i].onhost) > this.onHostMaxCount) {
            this.onHostMaxCount = this.map.get(this.jsonFile[i].onhost);
            this.maxOnHost = this.jsonFile[i].onhost
          }
        } else if (this.jsonFile[i].host != undefined) {
          if (this.map.get(this.jsonFile[i].host) > this.onHostMaxCount) {
            this.onHostMaxCount = this.map.get(this.jsonFile[i].host);
            this.maxOnHost = this.jsonFile[i].host
          }

        }

        //GET INSTANCE WITH MOST ERRORS


        if (this.map.has(this.jsonFile[i].instance)) {
          if (this.jsonFile[i].instance != undefined){
            this.map.set(this.jsonFile[i].instance, this.map.get(this.jsonFile[i].instance) + 1)
          }
        } else {
          if (this.jsonFile[i].instance != undefined){
            this.map.set(this.jsonFile[i].instance, 1);
          }
        }
        if (this.jsonFile[i].instance != undefined){
          if (this.map.get(this.jsonFile[i].instance) > this.instanceMaxCount) {
            this.instanceMaxCount = this.map.get(this.jsonFile[i].instance);
            this.maxInstance = this.jsonFile[i].instance
          }
        }

        //GET CLUSTER WITH MOST ERRORS
        if (this.map.has(this.jsonFile[i].cluster)) {
          if (this.jsonFile[i].cluster != undefined) {
            this.map.set(this.jsonFile[i].cluster, this.map.get(this.jsonFile[i].cluster) + 1);
          }

        } else {
          if (this.jsonFile[i].cluster != undefined) {
            this.map.set(this.jsonFile[i].cluster, 1);
          }

        }

        if (this.jsonFile[i].cluster != undefined) {
          if (this.map.get(this.jsonFile[i].cluster) > this.clusterMaxCount) {
            this.clusterMaxCount = this.map.get(this.jsonFile[i].cluster);
            this.maxCluster = this.jsonFile[i].cluster
          }

        }
        


      }
      let maxHourValueString = "";
      maxHourValueString += year;
      maxHourValueString += "-";
      maxHourValueString += month;
      maxHourValueString += "-";
      maxHourValueString += maxDayValue;
      maxHourValueString += " "
      maxHourValueString += maxHourValue;
      maxHourValueString+=":00"
      this.hourMostProblems = ko.observable(maxHourValueString);
      }
    
      
      this.dataBaseMostProblems = ko.observable(this.maxDataBase);
      this.instanceMostProblems = ko.observable(this.maxInstance);
      this.onHostMostProblems = ko.observable(this.maxOnHost);
      this.mostFrequentProblem = ko.observable(this.maxProblem);
      this.mediumProbQuantity = ko.observable(this.mediumProbProblems);
      this.highProbQuantity = ko.observable(this.highProbProblems);

      
      this.dataBaseMostProblems = ko.observable(this.maxDataBase);
      this.instanceMostProblems = ko.observable(this.maxInstance);
      this.onHostMostProblems = ko.observable(this.maxOnHost);
      this.clusterMostProblems = ko.observable(this.maxCluster);
      this.mostFrequentProblem = ko.observable(this.maxProblem);
      this.mediumProbQuantity = ko.observable(this.mediumProbProblems);
      this.highProbQuantity = ko.observable(this.highProbProblems);

    this.jsonUploaded(true);
  }
  jsonFile: ko.Observable<JSON> = jsonFilex.jsonFile;
  numberProblems: ko.Observable<number> = ko.observable(0);
  hourMostProblems: ko.Observable<string> = ko.observable("N/A");
  dataBaseMostProblems: ko.Observable<string> = ko.observable("N/A");
  instanceMostProblems: ko.Observable<string> = ko.observable("N/A");
  onHostMostProblems: ko.Observable<string> = ko.observable("N/A");
  clusterMostProblems: ko.Observable<string> = ko.observable("N/A");
  mostFrequentProblem: ko.Observable<string> = ko.observable("N/A");
  mediumProbQuantity: ko.Observable<number> = ko.observable(0);
  highProbQuantity: ko.Observable<number> = ko.observable(0);


  multiple: ko.ObservableArray<string> = ko.observableArray(["single"]);
  multipleStr: ko.Computed<string> = ko.pureComputed(() => {
    return this.multiple()[0] ? "multiple" : "single";
  });
  disabled: ko.ObservableArray<string> = ko.observableArray();
  isDisabled: ko.Computed<boolean> = ko.pureComputed(() => {
    return this.disabled()[0] === "disable" ? true : false;
  });
  invalidMessage: ko.Observable<string> = ko.observable("");
  invalidListener = (event: FilePickerElement.ojInvalidSelect) => {
    this.fileNames([]);
    this.invalidMessage(
      "{severity: '" +
      event.detail.messages[0].severity +
      "', summary: '" +
      event.detail.messages[0].summary +
      "'}"
    );
    const promise = event.detail.until;

    if (promise) {
      promise.then(() => {
        this.invalidMessage("");
      });
    }
  };
  acceptStr: ko.Observable<string> = ko.observable("application/json");
  acceptArr: ko.Computed<string[]> = ko.pureComputed(() => {
    const accept = this.acceptStr();
    return accept ? accept.split(",") : [];
  });
  fileNames: ko.Observable<string[]> = ko.observable([]);
  selectListener = (event: FilePickerElement.ojSelect) => {
    this.invalidMessage("");
    const files = event.detail.files;
    this.fileNames(
      Array.prototype.map.call(files, (file) => {
        var fileReader = new FileReader();
        fileReader.readAsText(file);
        var self = this;
        fileReader.onload = function () {
          //console.log(fileReader.result.toString());

          jsonFilex.jsonFile = JSON.parse(fileReader.result.toString());
          

          var tmp = JSON.parse(fileReader.result.toString());
          if (tmp.length == undefined) {
            tmp = tmp.diagnoses;
          } else {

          }
          jsonFilex.jsonFile = tmp;

          jsonFilex.enabledModule();
          self.calculateInfo();

          //VALIDACION DE JSON




          //console.log(jsonFilex.jsonFile[0].id);
          //console.log(jsonFilex.jsonFile);
        }

        return file.name;
      })

    );
  };



  /**
   * Optional ViewModel method invoked after the View is inserted into the
   * document DOM.  The application can put logic that requires the DOM being
   * attached here.
   * This method might be called multiple times - after the View is created
   * and inserted into the DOM and after the View is reconnected
   * after being disconnected.
   */
  connected(): void {
    AccUtils.announce("Dashboard page loaded.");
    document.title = "Dashboard";
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

export = DashboardViewModel;
