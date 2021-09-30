require(["require", "exports", "knockout", "ojs/ojbootstrap", "ojs/ojknockout", "ojs/ojfilepicker", "ojs/ojinputtext", "ojs/ojlabel", "ojs/ojcheckboxset"], function (require, exports, ko, ojbootstrap_1) {
  "use strict";
  
  class BasicModel {
      constructor() {
          this.disabled = ko.observableArray();
          this.isDisabled = ko.pureComputed(() => {
              return this.disabled()[0] === "disable" ? true : false;
          });
          this.invalidMessage = ko.observable("");
          this.invalidListener = (event) => {
              this.fileNames([]);
              this.invalidMessage("{severity: '" +
                  event.detail.messages[0].severity +
                  "', summary: '" +
                  event.detail.messages[0].summary +
                  "'}");
              const promise = event.detail.until;
              if (promise) {
                  promise.then(() => {
                      this.invalidMessage("");
                  });
              }
          };
          this.acceptStr = ko.observable("application/json");
          this.acceptArr = ko.pureComputed(() => {
              const accept = this.acceptStr();
              return accept ? accept.split(",") : [];
          });
          this.fileNames = ko.observable([]);
          this.selectListener = (event) => {
              this.invalidMessage("");
              const files = event.detail.files;
              this.fileNames(Array.prototype.map.call(files, (file) => {
                  const fr = new FileReader();
                  fr.readAsText(file);
                  return file.name;
              }));
          };
      }
  }

  ko.cleanNode(document.getElementById("parentContainer"));
  ojbootstrap_1.whenDocumentReady().then(() => {
      ko.applyBindings(new BasicModel(), document.getElementById("parentContainer"));
  });
});