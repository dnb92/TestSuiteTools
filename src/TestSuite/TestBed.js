//-------------------------------------------------------------------
//TEST_SUITE_001 - Unit Testing Tools using TestScenarios on TestBed.
//-------------------------------------------------------------------

//IMPORT TestBed Enums
import { getTestType } from "./TestTypes.js";
import { getTestScenarioMode } from "./TestTypes.js";


//IMPORT Objects Needed
import { TestScenario } from "./TestScenario.js"

var TestType = getTestType();
var TestScenarioMode = getTestScenarioMode();


//testBed
export class TestBed{
    constructor(presentationLayer,testBedName){
        this.PresentationLayer = presentationLayer;
        this.Name = testBedName;
        this.TestScenarios = [];
        this.divIdName = this.Name + "_div";
    }

    RunAllTestScenarios(){
        for (var testScenario of this.TestScenarios){
            testScenario.RunAllTestCases();
        }
    }

    BuildAllTestScenarios(){
        for (var testScenario of this.TestScenarios){
            this.PresentationLayer.BuildTestBeds(testScenario);
        }
    }
    
    AddTestScenario(name, testKit, testBedMode, testBedType, functionToTest, functionLock, testsCallbackFunction, postTestsCallbackFunction){
            if (this.TestScenarios.indexOf(testBed => testBed.Name == name) != -1){
                throw new Error(`[${name}] Already Exists for an existing TestScenario, please enter unique name`);
            }else{
                var testBed = new TestScenario(this.PresentationLayer, name, testKit, testBedMode, testBedType, functionToTest, functionLock, testsCallbackFunction,postTestsCallbackFunction);
                this.TestScenarios.push(testBed);
                console.log(`TestScenario: [${name}] Added Successfully.`)
            }
    }

    AddTestScenario_SingleType_IO(name, testsCallbackFunction, postTestsCallbackFunction){
        this.AddTestScenario(name, TestScenarioMode.SingleType,TestType.InputOutput,null,false,testsCallbackFunction,postTestsCallbackFunction);
    }

    AddTestScenario_SingleType_EF(name, testsCallbackFunction, postTestsCallbackFunction){
        this.AddTestScenario(name, TestScenarioMode.SingleType,TestType.ErrorFound,null,false,testsCallbackFunction,postTestsCallbackFunction);
    }

    AddTestScenario_AllTypes(name, testKit, functionToTest = null ,testsCallbackFunction, postTestsCallbackFunction){
        this.AddTestScenario(name, testKit, TestScenarioMode.AllTypes,null,functionToTest,false,testsCallbackFunction,postTestsCallbackFunction);
    }


    RemoveTestBed(name){
        var index = this.TestScenarios.indexOf(testBed => testBed.Name == name);
        if (index != -1){
            this.TestScenarios.splice(1,index);
        } 
    }

    ToggleTestBed(name, enabled){
        var index = this.TestScenarios.indexOf(testBed => testBed.Name == name);
        if (index != -1){
            this.TestScenarios.EnableTest(enabled);
        } 
    }

    ToggleAllTestScenarios(enabled){
        if (this.TestScenarios.length > 0){
            this.TestScenarios.forEach(function (testScenario){testScenario.EnableTestScenario(enabled);});
        }
    }
}
 


