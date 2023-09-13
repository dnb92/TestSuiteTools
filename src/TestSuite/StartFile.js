//var testKitPath = `${window.testKitPath.path}`;
//import { enableTestEnvironment } from testKitPath.toString();



//TEST_KIT_FUNCTIONS - 
import { functionsToTest } from '../TestSuite/TestKit/TestKit_Functions.js';

import { TestSuitePresentationLayer } from "./TestSuitePresentationLayer.js";
import { Defaults } from "./Defaults.js";

functionsToTest();

//START_UP variables.
var testSuiteNames;
var defaults;
var testSuitePresentationLayer;


function createPresentationLayer(){
  testSuiteNames = ["TestSuitePARTIAL","TestBed1"];
  defaults = new Defaults();
  testSuitePresentationLayer = new TestSuitePresentationLayer(defaults);
}


export function RunTestSuiteTools(enabled = true){
    createPresentationLayer();
    if (window.sessionStorage.getItem(defaults.defaultSessionStorageItemName) == null){
        testSuitePresentationLayer.createConsoleTestSuiteTools();
        window.testSuiteTools.enabled = enabled;
      }else{
        window.testSuiteTools.enabled = enabled;
        window.testSuiteTools.enabled = JSON.parse(window.sessionStorage.getItem(defaults.defaultSessionStorageItemName));
      }

}