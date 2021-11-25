/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */


let validAriaLiveValues: string[] = ["off", "polite", "assertive"];

export function announce(message: string, manner?: string): void {
  if (manner === undefined || validAriaLiveValues.indexOf(manner) === -1) {
    manner = "polite";
  }

  let params: {
    bubbles: boolean;
    detail: { message: string, manner: string };
  } = {
    "bubbles": true,
    "detail": { "message": message, "manner": manner }
  };

  let globalBodyElement: HTMLElement = document.getElementById("globalBody") as HTMLElement;
  globalBodyElement.dispatchEvent(new CustomEvent("announce", params));
}