import * as AccUtils from "../accUtils";
import jsonFilex from "../appController"

//imports barra de filtros
import * as ko from "knockout";
import { whenDocumentReady } from "ojs/ojbootstrap";
import Message = require("ojs/ojmessaging");
import ArrayDataProvider = require("ojs/ojarraydataprovider");
import "ojs/ojknockout";
import "ojs/ojselectcombobox";
import { ojSelectMany } from "ojs/ojselectcombobox";
import "ojs/ojformlayout";
import "ojs/ojchart";
import "ojs/ojtoolbar";
//import "jet-composites/demo-chart-orientation-control/loader";
//import "jet-composites/demo-chart-stack-control/loader";


import * as Bootstrap from "ojs/ojbootstrap";
import { IntlDateTimeConverter } from "ojs/ojconverter-datetime";
import * as ResponsiveUtils from "ojs/ojresponsiveutils";
import { ojDatePicker } from "ojs/ojdatetimepicker";
import "ojs/ojdatetimepicker";
import "ojs/ojlabel";
import "ojs/ojformlayout";
import "ojs/ojtimezonedata";
import { ojSelect } from "ojs/ojselectcombobox";




class ProblemFrequencyViewModel {


  applyProblemFilters = (
    event: ojSelectMany.valueChanged<string,Record<string,string>>,
  ) => {
    this.problemCount = new Map();
    this.selectedProblemsFiltersMap = new Map();
    
    let i = 0;
    this.selectProblemValue(event.detail.value);
    for(i;i<this.selectProblemValue().length;i++){
      this.selectedProblemsFiltersMap.set(this.selectProblemValue()[i],1);
    }
    

    for (let item in jsonFilex.jsonFile){
      if (this.problemCount.has(jsonFilex.jsonFile[item].name)){
        let count = this.problemCount.get(jsonFilex.jsonFile[item].name) + 1;
        this.problemCount.set(jsonFilex.jsonFile[item].name, count);
      }
      else {
        if(this.selectedProblemsFiltersMap.size==0){
          this.problemCount.set(jsonFilex.jsonFile[item].name, 1);
        } else{
          if(this.selectedProblemsFiltersMap.has(jsonFilex.jsonFile[item].name)){
            this.problemCount.set(jsonFilex.jsonFile[item].name, 1);
          } else{
            //Do Nothing
          }
        }
        
        
      }



      
    }
    let problemArray: Array<{name: string, count: number, group: string}> = [];
    i = 0;
    this.problemCount.forEach((value: number, key: string) => {
      problemArray.push({ name: key, count: value , group: "A"});
      i = i + 1;
    });

    let jsonCount = JSON.stringify(problemArray);
    this.dataProvider = new ArrayDataProvider(JSON.parse(jsonCount), { keyAttributes: 'name' });
    this.dataObservableProvider(this.dataProvider);
  }
  readonly selectProblemValue = ko.observableArray();
  

  dataObservableProvider : ko.Observable<ArrayDataProvider<any,any>> = ko.observable();
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
  problemCount = new Map();

  selectedProblemsFiltersMap = new Map();

  dataProvider : ArrayDataProvider<any, any>;

  problemFilters = new Map();
  problemsDataProvider : ArrayDataProvider<any,any>;
  /*dataProvider = new ArrayDataProvider(this.problemCount, {
    keyAttributes: "key",
  });*/
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
    AccUtils.announce("Problem Frequency page loaded.");
    document.title = "Problem Frequency";
    // implement further logic if needed
    // creates a map {problem, count}

    let problemArray: Array<{name: string, count: number, group: string}> = [];
    let problemFilterArray: Array<{value:string,label:string}> = [];
    for (let item in jsonFilex.jsonFile){
      if(this.problemFilters.has(jsonFilex.jsonFile[item].name)){
        //Do nothing
      } else{
        this.problemFilters.set(jsonFilex.jsonFile[item].name,1)
        problemFilterArray.push({value:jsonFilex.jsonFile[item].name,label:jsonFilex.jsonFile[item].name});
       
      }
      if (this.problemCount.has(jsonFilex.jsonFile[item].name)){
        let count = this.problemCount.get(jsonFilex.jsonFile[item].name) + 1;
        this.problemCount.set(jsonFilex.jsonFile[item].name, count);
      }
      else {
        this.problemCount.set(jsonFilex.jsonFile[item].name, 1);
      }
    }

    let i = 0;
    this.problemCount.forEach((value: number, key: string) => {
      problemArray.push({ name: key, count: value , group: "A"});
      i = i + 1;
    });

    let jsonCount = JSON.stringify(problemArray);
    let jsonFilterProblems = JSON.stringify(problemFilterArray);
    this.dataProvider = new ArrayDataProvider(JSON.parse(jsonCount), { keyAttributes: 'name' });
    this.dataObservableProvider(this.dataProvider);
    this.problemsDataProvider = new ArrayDataProvider(JSON.parse(jsonFilterProblems),{keyAttributes:'value'});
    document.getElementById("chart-container");

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

export = ProblemFrequencyViewModel;
