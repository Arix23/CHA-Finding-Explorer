import * as AccUtils from "../accUtils";
import jsonFilex from "../appController"

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



class ProblemFrequencyViewModel {


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

  readonly orientationValue = ko.observable("vertical");
  //dataProvider: ArrayDataProvider;
  problemCount = new Map();
  dataProvider : ArrayDataProvider<any, any>;
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
    //let problemCount = new Map();
    let problemArray: Array<{name: string, count: number, group: string}> = [];
    for (let item in jsonFilex.jsonFile){
      if (this.problemCount.has(jsonFilex.jsonFile[item].name)){
        let count = this.problemCount.get(jsonFilex.jsonFile[item].name) + 1;
        this.problemCount.set(jsonFilex.jsonFile[item].name, count);
        console.log(jsonFilex.jsonFile[item].name);
        console.log(count);
      }
      else {
        this.problemCount.set(jsonFilex.jsonFile[item].name, 1);
        console.log(jsonFilex.jsonFile[item].name);
      }
    }

    let i = 0;
    this.problemCount.forEach((value: number, key: string) => {
      problemArray.push({ name: key, count: value , group: "A"});
      console.log(key, value);
      console.log(problemArray[i]);
      i = i + 1;
    });

    let jsonCount = JSON.stringify(problemArray);
    console.log(jsonCount);

    this.dataProvider = new ArrayDataProvider(JSON.parse(jsonCount), { keyAttributes: 'name' });

    document.getElementById("chart-container");
    //console.log(this.problemCount);

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
