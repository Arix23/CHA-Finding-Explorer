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
import { ojDatePicker } from "ojs/ojdatetimepicker";
import "ojs/ojdatetimepicker";
import "ojs/ojlabel";
import "ojs/ojformlayout";
import "ojs/ojtimezonedata";

class ConcurrentProblemCountViewModel {

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
    hourCount = new Map();
    dataProvider : ArrayDataProvider<any, any>;

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
    AccUtils.announce("Concurrent Problem Count page loaded.");
    document.title = "Concurrent Problem Count";
    // implement further logic if needed
    let problemArray: Array<{hour: string, count: number, series: string}> = [];
    for (let item in jsonFilex.jsonFile){
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

    this.dataProvider = new ArrayDataProvider(JSON.parse(jsonCount), { keyAttributes: 'hour' });

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

export = ConcurrentProblemCountViewModel;
