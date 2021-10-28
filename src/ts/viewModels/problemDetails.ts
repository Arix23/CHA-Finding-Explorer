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
  detailsDataProvider : ArrayDataProvider<any, any>;
  //hostArray: Array<{host: string, database: string, instance: string, from: string,
  //                  to: string, belief: string, value: number, hash: string}> = [];
  detailArray: Array<{id: string, count: number, avBelief: number, description: string,
                        causes: string, action: string, hostTable: Array<any>}> = [];


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

    // private users = ko.observableArray([
    //   {
    //     name: "Bert",
    //   },
    //   {
    //     name: "Charles",
    //   },
    //   {
    //     name: "Denise",
    //   },
    // ]);
    // readonly dataProvider = new ArrayDataProvider(this.users, {
    //   keyAttributes: "name",
    // });

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
          //sumBelief += jsonFilex.jsonFile[j].belief;

        } else {
          this.problemCount.set(jsonFilex.jsonFile[j].name, 1);
          //sumBelief = jsonFilex.jsonFile[j].belief;
        }
    }

    this.problemCount.forEach((value: number, key: string) => {
      let sumBelief = 0;
      let i;
      let hostArray: Array<{host: string, database: string, instance: string, from: string,
                        to: string, belief: string, hash: string}> = [];
      for (let item in jsonFilex.jsonFile){
        if (jsonFilex.jsonFile[item].name == key){
          hostArray.push({host: jsonFilex.jsonFile[item].onhost, database: jsonFilex.jsonFile[item].db,
                          instance: jsonFilex.jsonFile[item].instance, from: jsonFilex.jsonFile[item].from,
                          to: jsonFilex.jsonFile[item].to, belief: jsonFilex.jsonFile[item].belief,
                          hash: jsonFilex.jsonFile[item].hash});
          sumBelief += jsonFilex.jsonFile[item].belief;
          i = item;
        }
      }

      sumBelief /= value;
      this.detailArray.push({id: jsonFilex.jsonFile[i].id, count: value, avBelief: sumBelief,
                            description: jsonFilex.jsonFile[i].descr, causes: jsonFilex.jsonFile[i].cause,
                            action: jsonFilex.jsonFile[i].action, hostTable: hostArray});
    });


    for (var j =0;j<jsonFilex.jsonFile.length;j++){
      if(this.problemCount.get(jsonFilex.jsonFile[j].name)!=-1){
        problemArray.push({name:jsonFilex.jsonFile[j].name,count:this.problemCount.get(jsonFilex.jsonFile[j].name),belief: jsonFilex.jsonFile[j].belief,database:
        jsonFilex.jsonFile[j].db,instance:jsonFilex.jsonFile[j].instance,onhost:jsonFilex.jsonFile[j].onhost,
      from:jsonFilex.jsonFile[j].from,to:jsonFilex.jsonFile[j].to})
          this.problemCount.set(jsonFilex.jsonFile[j].name,-1);
      }
    }

    console.log(this.detailArray);
    let jsonDetails = JSON.stringify(this.detailArray);

    let jsonCount = JSON.stringify(problemArray);
    //console.log(this.problemAccessed());

    this.detailsDataProvider = new ArrayDataProvider(JSON.parse(jsonDetails), { keyAttributes: 'id'});
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
