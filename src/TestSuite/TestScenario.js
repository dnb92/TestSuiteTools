//IMPORT TestSuite Enums
import { getTestType } from "./TestTypes.js";
import { getTestScenarioMode } from "./TestTypes.js";

//IMPORT Objects Needed
import { TestCase } from "./TestCase.js";

var TestType = getTestType();
var TestScenarioMode = getTestScenarioMode();


//TEST_Scenario -- TestCase Objects are stored on the test bed and they have to conform to TestScenario rules
//TestCase are executed in the order that they are in the array.
//TestCase can only be created by a TestBed - hence why they are not exported.
export class TestScenario {
    constructor(presentationLayer, name, testKit, testScenarioMode, testScenarioType, functionToTest, functionLock = false, testsCallbackFunction,postTestsCallbackFunction = null){
        
        this.PresentationLayer = presentationLayer;
        this.FunctionToTest = functionToTest;
        this.PostTestCallback = function (){postTestsCallbackFunction(this)};
        this.FunctionLock = functionLock;
        this.StageScenario = function (){testsCallbackFunction(this)} //maybe put posttestcallback here};
        this.Name = `[${name}]`;
        this.TestCases = [];
        this.Passed = false;
        this.TimeTestCompleted = "Not Completed";
        this.DateTestCompleted = "Not Completed";
        this.DateTestStarted = TestScenario.getTimeAndDate()[0];
        this.TimeTestStarted = TestScenario.getTimeAndDate()[1];
        this.TestKit = testKit;
        this.divIdName = this.Name + "_div";
        this.isBuilt = false;

        
        if (Object.keys(TestScenarioMode).find(element => element == testScenarioMode)){
            this.TestScenarioMode = testScenarioMode;
            
        }else{
            throw new TypeError("Wrong Type: Please enter an enum value from TestScenarioTypes and try again.")
        }
        if (this.TestScenarioMode == TestScenarioMode.SingleType && Object.keys(TestType).find(element => element == testScenarioType)){
            this.TestScenarioType = testScenarioType;
            
        }else{
            this.TestScenarioType = null;
        }

    }

    static getTimeAndDate(){

        var date = new Date();
        var currentDate = date.getDate() + "/"
            + (date.getMonth()+1)  + "/" 
            + date.getFullYear();  
        var currentTime = date.getHours() + ":"  
            + date.getMinutes() + ":" 
            + date.getSeconds();
        return [currentDate,currentTime];

    }

    Build(){
        
            this.StageScenario();
            this.isBuilt = true;
       
    }

    RunAllTestCases(){
        if (this.isBuilt == false){
            this.Build();
            this.TestCases.forEach(function(testCase) {testCase.Run()});
            this.PresentationLayer.BuildTestBeds(this);
        }else{
            this.TestCases.forEach(function(testCase) {testCase.Run()});
            this.PresentationLayer.BuildTestBeds(this);
        }
        

    }

    AllTestCasesPassed() {
        if (this.TestCases.every(function(e){ return e.Passed == true})){
            this.Passed = true;
        }else if (this.TestCases.every(function(e){ return e.Passed == false})){
            this.Passed = false;
        }else{
            this.Passed = "partial";
        }

    }

    GetTestCase(testName){
        this.TestCases.forEach(function(test) {if (test.Name == testName){
            return test;
        }});
    }

    
    AddTestCase_InputOutput(testName,testData,functionToTest,expectedResult){
        this.#AddTestCase(testName,TestType.InputOutput,testData,functionToTest,expectedResult);
    }
    AddTestCase_ErrorFound(testName,testData,functionToTest,expectedResult, expectedError){
        this.#AddTestCase(testName,TestType.ErrorFound,testData,functionToTest,expectedResult,expectedError);
    }

    #getNameOfFunction(functionToGetNameFrom){
        let funcString = functionToGetNameFrom.toString();
        let funcStringArray = funcString.split('');
        let indexStart = funcStringArray.indexOf(" ") +1;
        let indexEnd = funcStringArray.indexOf("(");
        return "[" + funcString.substring(indexStart,indexEnd) + "()" + "]";
    }

    #AddTestCase(testName, testType, testData, functionToTest = null, expectedResult, expectedError = TypeError) {
        
        //should be 'testcase' not testscenario - please change later.
        var testCase = new TestCase(this.PresentationLayer, testName, testType, testData, functionToTest, expectedResult, expectedError);
        //check function exists if not use testbed function
        if (testCase.FunctionToTest == null){
            testCase.FunctionToTest = this.FunctionToTest;
        }
        if (this.FunctionLock == true){
            if (testCase.FunctionToTest != this.FunctionToTest){
                var typeName = this.#getNameOfFunction(this.FunctionToTest);
                
                let error = new Error(`TestScenario: ${testScenario.TestName} is not using same function as TestScenario: ${this.Name}. Expected: ${typeName}`);
                alert(error.message);
                throw error;
            }
        }
        if (this.TestScenarioMode == TestScenarioMode.SingleType){
            if (testCase.TestType == this.TestScenarioType){
                
                this.TestCases.push(testCase);
                console.log(`${this.Name} TEST_SCENARIO_ADDED: ${testCase.TestName} `)
                
            }else{
                throw new TypeError("TestScenario is different TestType to this TestScenario TestType");
            }
        }else if (this.TestScenarioMode == TestScenarioMode.AllTypes){
            this.TestCases.push(testCase);
            console.log(`${this.Name} TEST_SCENARIO_ADDED: ${testCase.TestName} `)
            
        }else{
            throw new Error("Unexpected error when adding new TestScenario");
        }
        
        
    }

    saveToFile(file, fileName){
    
        var saveLink = document.createElement("a");
        saveLink.download = fileName;
        
        if (window.webkitURL != null) {
            saveLink.href = window.webkitURL.createObjectURL(file);
          } else {
            saveLink.href = window.URL.createObjectURL(textFileAsBlob);
            saveLink.style.display = "none";
            document.body.appendChild(saveLink);
          }
        
          saveLink.click();
        
    }

    //CLONES all href and button nodes, adds eventHandler with alert for TESTMODE activated.
    cloneAndAddListener(){
        var eventHandler = function (){alert("TEST MODE ENABLED: Please deactive to use page as normal. Press 'OK' to refresh page..."); window.location.reload();};
        var links = document.querySelectorAll("[href],button");
        var max1 = links.length - 1;
        
        for (let i = 0; i <= max1; i++){
            var element = links[i];
                if (element.id != "runTest" && element.id != "clearAll" ){
                    var clone = element.cloneNode(true);
                    clone.addEventListener('click', eventHandler);
                    element.replaceWith(clone);
                    console.log(`TESTMODE | PAGE_LINKS_REPLACED: NodeType: [${element.nodeName}] NodeText: [${element.innerHTML}]`);
         
                }
        }
    
    }

    GenerateTestResults(){
        this.AllTestCasesPassed();
        this.DateTestCompleted = TestScenario.getTimeAndDate()[0];
        this.TimeTestCompleted = TestScenario.getTimeAndDate()[1];

        let divider = "\n----------------\n";
        let currentTestScenario = `TESTBED NAME: ${this.Name} \nALL TESTS PASSED: [${this.Passed.toString().toUpperCase()}] \nDATE STARTED: [${this.DateTestStarted}] \nTIME STARTED: [${this.TimeTestStarted}] \nDATE COMPLETED: [${this.DateTestCompleted}] \nTIME COMPLETED: [${this.TimeTestCompleted}] \n\nLOGGING DATA:`;
        let results = [currentTestScenario];
        this.TestCases.forEach(function(test) {results.push(divider + test.TestResultMessage + "\n");});

        return results.toString();
    }

    //RUNS TestCases, ADDS elements, PRINTS results, SAVE results.
    RunPostTestCallback(){

        //POST-TEST Callback
        if (this.PostTestCallback != undefined || this.PostTestCallback != null){
            try{
                this.PostTestCallback();
                var typeName = this.#getNameOfFunction(this.PostTestCallback);
                console.log(`${this.Name} POST_TEST_CALLBACK_SUCCESSFUL : ${typeName}`);
            }catch(e){
                throw new Error("PostTestCallback function failed when called, please check implementation. ERROR: " + e.message);
            }
            
        }
        
    }
     
}