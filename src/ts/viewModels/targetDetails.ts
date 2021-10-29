import * as AccUtils from "../accUtils";
import * as ko from "knockout";
import * as Bootstrap from "ojs/ojbootstrap";
import Message = require("ojs/ojmessaging");
import "ojs/ojknockout";
import "ojs/ojformlayout";
import "ojs/ojslider";
import "ojs/ojtable";

//imports barra de filtros
import ArrayDataProvider = require("ojs/ojarraydataprovider");
import "ojs/ojknockout";
import "ojs/ojselectcombobox";
import "ojs/ojformlayout";
import "ojs/ojselectsingle";

import { IntlDateTimeConverter } from "ojs/ojconverter-datetime";
import * as ResponsiveUtils from "ojs/ojresponsiveutils";
import { ojDatePicker } from "ojs/ojdatetimepicker";
import "ojs/ojdatetimepicker";
import "ojs/ojlabel";
import "ojs/ojformlayout";
import "ojs/ojtimezonedata";
import jsonFilex from "../appController";
import { ojButtonEventMap } from "@oracle/oraclejet/dist/types/ojbutton";

//Button
import "ojs/ojbutton";


class TargetDetailsViewModel {

  //Table


  //slider
  isSmall: ko.Observable<boolean>;
  columns: ko.Computed<number>;
  error: Message[];
  warning: Message[];
  info: Message[];
  confirmation: Message[];

  // Select Target Type
  private readonly browsers = [
    { value: "Database", label: "Database" },
    { value: "Instance", label: "Instance" },
    { value: "OnHost", label: "OnHost" },
  ];
  readonly browsersDP = new ArrayDataProvider(this.browsers, {
    keyAttributes: "value",
  });



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

  }

  constructor() {
    this.addTarget = ko.observable(true);

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
    AccUtils.announce("Target Details page loaded.");
    document.title = "Target Details";
    // implement further logic if needed

    let problemArray: Array<{ name: string, count: number, database: string, instance: string, onhost: string, from: string, to: string }> = [];
    for (var j = 0; j < jsonFilex.jsonFile.length; j++) {
      if (jsonFilex.jsonFile[j].db == "diarac") {
        if (this.problemCount.has(jsonFilex.jsonFile[j].name)) {
          let count = this.problemCount.get(jsonFilex.jsonFile[j].name) + 1;
          this.problemCount.set(jsonFilex.jsonFile[j].name, count);

        }
        else {
          this.problemCount.set(jsonFilex.jsonFile[j].name, 1);
        }
      }
    }

    for (var j = 0; j < jsonFilex.jsonFile.length; j++) {
      if (jsonFilex.jsonFile[j].db == "diarac" && this.problemCount.get(jsonFilex.jsonFile[j].name) != -1) {
        problemArray.push({
          name: jsonFilex.jsonFile[j].name, count: this.problemCount.get(jsonFilex.jsonFile[j].name), database:
            jsonFilex.jsonFile[j].db, instance: jsonFilex.jsonFile[j].instance, onhost: jsonFilex.jsonFile[j].onhost,
          from: jsonFilex.jsonFile[j].from, to: jsonFilex.jsonFile[j].to
        })
        this.problemCount.set(jsonFilex.jsonFile[j].name, -1);
      }
    }



    let jsonCount = JSON.stringify(problemArray);
    console.log(jsonCount);

    this.dataProvider = new ArrayDataProvider(JSON.parse(jsonCount), { keyAttributes: 'name' });
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

export = TargetDetailsViewModel;