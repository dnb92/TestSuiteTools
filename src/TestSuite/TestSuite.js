import { TestSuitePresentationLayer } from "./TestSuitePresentationLayer.js";
import { TestBed } from "./TestBed.js";

export class TestSuite{
    constructor(presentationLayer, testSuiteInstanceName, testBedName){
        this.PresentationLayer = presentationLayer;
        this.InstanceName = testSuiteInstanceName;
        this.PresentationLayer = presentationLayer;
        this.TestBeds = new TestBed(this.PresentationLayer,testBedName); //ONLY ONE ALLOWED ATM
        this.defaultTestSuiteToolsName = "testSuiteTools";
        this.defaultPropertyName = "enabled"
        this.defaultSessionStorageItemName = this.defaultTestSuiteToolsName + "_" + this.defaultPropertyName;
        this.divIdName = this.InstanceName + "_div";
        

    }

    AddTestBed(name){
        if (this.TestScenarios.indexOf(testBed => testBed.Name == name) != -1){
            throw new Error(`[${name}] Already Exists for an existing TestBed, please enter unique name`);
        }else{
            var testBed = new TestBed(this.PresentationLayer, name);
            this.TestBeds.push(testBed);
            console.log(`TestBed: [${name}] Added Successfully.`)
        }
}

    GetTestBed(testBedName){
        this.TestBeds.forEach(function(testBed) { if (testBed.Name == testBedName){
            return test;
        }});
    }

    ToggleAllTestBeds(enabled){
        if (this.TestBeds.length > 0){
            this.TestBeds.forEach(function (testBed){testBed.ToggleAllTestScenarios(enabled)});
        }
    }
}