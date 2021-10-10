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
    }



  }
  jsonFile: ko.Observable<JSON> = jsonFilex.jsonFile;
  numberProblems: ko.Observable<number> = ko.observable(0);


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
    console.log(this.jsonFile);
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
