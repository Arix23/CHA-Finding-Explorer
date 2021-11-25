import * as ko from "knockout";
import { whenDocumentReady } from "ojs/ojbootstrap";
import rootViewModel from "./appController";
import "ojs/ojknockout";
import "ojs/ojmodule";
import "ojs/ojnavigationlist";
import "ojs/ojbutton";
import "ojs/ojtoolbar";

function init(): void {
  
  ko.applyBindings(rootViewModel, document.getElementById("globalBody"));
}

whenDocumentReady().then(function(){
  
  if (document.body.classList.contains("oj-hybrid")) {
    document.addEventListener("deviceready", init);
  } else {
    init();
  }
});
