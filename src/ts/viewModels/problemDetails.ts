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


import * as Bootstrap from "ojs/ojbootstrap";
import { IntlDateTimeConverter } from "ojs/ojconverter-datetime";
import * as ResponsiveUtils from "ojs/ojresponsiveutils";
import { ojDatePicker } from "ojs/ojdatetimepicker";
import "ojs/ojdatetimepicker";
import "ojs/ojlabel";
import "ojs/ojformlayout";
import "ojs/ojtimezonedata";

import jsonFilex from "../appController";



class ProblemDetailsViewModel {


  //For each binding
  problemAccessed :ko.Observable<String> = ko.observable("null");
  problemCount = new Map();
  dataProvider : ArrayDataProvider<any, any>;

  //BUTTON ACCESS PROBLEM

  accessProblem = (
    event: Event,
    current: { data: { name: string } },
    bindingContext: ko.BindingContext
  ) => {
    this.problemAccessed(current.data.name);
    this.problemAccessed.valueHasMutated();
    console.log(current.data.name);
  };

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
    let problemArray: Array<{name: string, count: number, belief: number, database: string, instance: string, onhost: string, from: string, to:string}> = [];
    for (var j =0;j<jsonFilex.jsonFile.length;j++){

      //console.log(jsonFilex.jsonFile[j].cluster);

        if (this.problemCount.has(jsonFilex.jsonFile[j].name)) {
          let count = this.problemCount.get(jsonFilex.jsonFile[j].name) + 1;
          this.problemCount.set(jsonFilex.jsonFile[j].name, count);
        } else {
          this.problemCount.set(jsonFilex.jsonFile[j].name, 1);
        }
    }




    for (var j =0;j<jsonFilex.jsonFile.length;j++){
      if(this.problemCount.get(jsonFilex.jsonFile[j].name)!=-1){
        problemArray.push({name:jsonFilex.jsonFile[j].name,count:this.problemCount.get(jsonFilex.jsonFile[j].name),belief: jsonFilex.jsonFile[j].belief,database:
        jsonFilex.jsonFile[j].db,instance:jsonFilex.jsonFile[j].instance,onhost:jsonFilex.jsonFile[j].onhost,
      from:jsonFilex.jsonFile[j].from,to:jsonFilex.jsonFile[j].to})
          this.problemCount.set(jsonFilex.jsonFile[j].name,-1);
      }
    }

    

    let jsonCount = JSON.stringify(problemArray);
    console.log(this.problemAccessed());

    this.dataProvider = new ArrayDataProvider(JSON.parse(jsonCount), { keyAttributes: 'name' });
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