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
  numberOfMonths: number;
  datePickerMonths: ojDatePicker["datePicker"];
  largeScreenMatch: MediaQueryList;
  datePickerWeek: ojDatePicker["datePicker"];
  timePicker: object;


  constructor() {
    if (this.jsonFile != null) {
      this.numberProblems = ko.observable(this.jsonFile.length);
      var map = new Map();
      var databaseMaxCount = 0;
      var instanceMaxCount = 0;
      var onHostMaxCount = 0;
      var problemMaxCount = 0;
      var maxProblem = "Default";
      var maxDataBase = "Default";
      var maxInstance = "Default";
      var maxOnHost = "Default";
      var mediumProbProblems = 0;
      var highProbProblems = 0;

      //PROCESAMIENTO DEL JSON PARA OBTENER VALORES NECESARIOS PARA EL FUNCIONAMIENTO DEL DASHBOARD
      for(var i = 0;i<this.jsonFile.length;i++){

        //GET QUANTITY OF PROBLEMS OF A CERTAIN PROBABILITY
        if(this.jsonFile[i].belief<75.0){
          mediumProbProblems++;
        } else{
          highProbProblems++;
        }

        //GET MOST FREQUENT PROBLEM
        if(map.has(this.jsonFile[i].name)){
          map.set(this.jsonFile[i].name,map.get(this.jsonFile[i].name)+1)
        } else{
          map.set(this.jsonFile[i].name,1);
        }
        if(map.get(this.jsonFile[i].name)>problemMaxCount){
          problemMaxCount= map.get(this.jsonFile[i].name);
          maxProblem = this.jsonFile[i].name
        }


        //GET DB WITH MOST ERRORS

        if(map.has(this.jsonFile[i].db)){
          map.set(this.jsonFile[i].db,map.get(this.jsonFile[i].db)+1)
        } else{
          map.set(this.jsonFile[i].db,1);
        }

        if(map.get(this.jsonFile[i].db)>databaseMaxCount){
          databaseMaxCount= map.get(this.jsonFile[i].db);
          maxDataBase = this.jsonFile[i].db
        }
        

        // GET HOST WITH MOST ERRORS
        if(map.has(this.jsonFile[i].onhost)){
          map.set(this.jsonFile[i].onhost,map.get(this.jsonFile[i].onhost)+1)
        } else{
          map.set(this.jsonFile[i].onhost,1);
        }
        if(map.get(this.jsonFile[i].onhost)>onHostMaxCount){
          onHostMaxCount= map.get(this.jsonFile[i].onhost);
          maxOnHost = this.jsonFile[i].onhost
        }

        //GET INSTANCE WITH MOST ERRORS

        if(map.has(this.jsonFile[i].instance)){
          map.set(this.jsonFile[i].instance,map.get(this.jsonFile[i].instance)+1)
        } else{
          map.set(this.jsonFile[i].instance,1);
        }
        if(map.get(this.jsonFile[i].instance)>instanceMaxCount){
          instanceMaxCount= map.get(this.jsonFile[i].instance);
          maxInstance = this.jsonFile[i].instance
        }
        

        
        

      }
      this.dataBaseMostProblems = ko.observable(maxDataBase);
      this.instanceMostProblems = ko.observable(maxInstance);
      this.onHostMostProblems = ko.observable(maxOnHost);
      this.mostFrequentProblem = ko.observable(maxProblem);
      this.mediumProbQuantity = ko.observable(mediumProbProblems);
      this.highProbQuantity = ko.observable(highProbProblems);
    }



  }
  jsonFile: ko.Observable<JSON> = jsonFilex.jsonFile;
  numberProblems: ko.Observable<number> = ko.observable(0);
  dataBaseMostProblems: ko.Observable<string> = ko.observable("Default");
  instanceMostProblems: ko.Observable<string> = ko.observable("Default");
  onHostMostProblems: ko.Observable<string> = ko.observable("Default");
  mostFrequentProblem: ko.Observable<string> = ko.observable("Default");
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
        fileReader.onload = function () {
          //console.log(fileReader.result.toString());
          jsonFilex.jsonFile = JSON.parse(fileReader.result.toString());
          whenDocumentReady().then(() => {
            ko.cleanNode(document.getElementById('if-statement'));
            ko.applyBindings(new DashboardViewModel(), document.getElementById("if-statement"));
          });
          
          

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
