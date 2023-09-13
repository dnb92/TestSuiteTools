//IMPORT TestBed Enums
import { getTestType } from "./TestTypes.js";
import { TestScenario } from "./TestScenario.js";

var TestType = getTestType();


//TEST_SCENARIO -- This is your Unit Test Object that can be used to test input and output of various types.
export class TestCase{
    constructor(presentationLayer, testName, testType, testData, functionToTest = null, expectedResult, expectedError = TypeError){
        this.presentationLayer = presentationLayer;
        this.TestName = `[${testName}]`;
        this.TestData = testData;
        this.TestResult = null;
        this.ExpectedResult = expectedResult;
        this.ErrorTypeFound = "[No Error]";
        this.ExpectedErrorType = expectedError;
        this.FunctionToTest = functionToTest;
        this.Date = new Date();
        this.Time = TestScenario.getTimeAndDate().toString()
        this.Passed = false;
        this.TestResultMessage = "Test Not Run";
        this.divIdName = this.TestName + "_div";
        if (Object.keys(TestType).find(element => element == testType)){
            this.TestType = testType;
        }else{
            throw new TypeError("Enum Type is not found, please use one of the enums from TestType.")
        }

        console.log(`$TEST_CASE:${this.TestName} ADDED_SUCCESSFULLY`);
    }

    getNameOfFunction(functionToGetNameFrom){
        let funcString = functionToGetNameFrom.toString();
        let funcStringArray = funcString.split('');
        let indexStart = funcStringArray.indexOf(" ") +1;
        let indexEnd = funcStringArray.indexOf("(");
        return "[" + funcString.substring(indexStart,indexEnd) + "()" + "]";
    }

    Run(){
        let testPass = this.TestName + " [PASS]";
        let testFail = this.TestName + " [FAIL]";
        let testResult = null;

        //TRY DELEGATE FUNCTION
        try{
                if (this.TestData == undefined){
                    testResult = this.FunctionToTest();
                    this.TestResult = testResult.toString();
                }else{
                    testResult = this.FunctionToTest(this.TestData);
                    this.TestResult = testResult.toString();
                }
        
        //ERROR CHECKING SECTION - compares to ExpectedErrorType provided by TestCase
        }catch(e){
            var errorString = ` [${this.TestData.constructor.name}] ` + `[${this.TestData[0].constructor.name}]` + "\nData Set: " + this.TestData.toString() + `\nError Found: [${e.name}]` + `\nExpected Error: [${this.ExpectedErrorType.name}] `;
            this.ErrorTypeFound = `[${e.constructor.name}]`;
            if (e instanceof this.ExpectedErrorType){
                this.TestResultMessage = testPass + errorString;
                this.Passed = true;
                return errorString;
            }else{
                this.TestResultMessage = testFail + errorString;
                this.Passed = false;
                
                return errorString;
            }
        }

        // check expected result types
        //ARRAY
        var typeString = ` [${this.TestData.constructor.name}] ` + `[${this.TestData[0].constructor.name}]` + "\nData Set: " + this.TestData.toString() + "\nTest Results: " + testResult.toString() + "\nExpected Results: " + this.ExpectedResult.toString();
        if (Array.isArray(this.ExpectedResult) == true && Array.isArray(this.ExpectedResult) == true && this.ExpectedResult.length == testResult.length){
            if (JSON.stringify(testResult) === JSON.stringify(this.ExpectedResult)){
                this.TestResultMessage = testPass + typeString;
                this.Passed = true;
            }else{
                this.TestResultMessage = testFail + typeString;
                this.Passed = false;
            }
        }
        //Any Other Types
        else if (typeof(this.ExpectedResult) === typeof(testResult) && this.ExpectedResult.length == testResult.length)
        {
            if (testResult == this.ExpectedResult){
                this.TestResultMessage = testPass + typeString;
                this.Passed = true;
            }else{
                this.TestResultMessage = testFail + typeString;
                this.Passed = false;
            }
        }
        
    }
     
}