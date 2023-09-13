//----------------------------------------------------------------------------------------
//TEST_KIT_TEMPLATE -- This is where testing methodology is implemented for a TestScenario
//----------------------------------------------------------------------------------------


//[REQUIRED] FUNCTION_TO_BE_TESTED_FROM_WEBSITE - this is defined as a window variable with
//in 'TestKit_Functions.js' file in the 'TestKit' folder.
export function functionToTest(){
  var func = window.getMarks;
  return func;
}

//[REQUIRED] TEST_SCENARIO_CALLBACK_TO_SET_UP_TEST_CASES 
export function testCallback(testScenario){
    
    //DATASET first test
    let testDataOne = [10,12,16,14,18];
    let testDataOneExpectedResult = [71,15];
    
    //DATASET second test
    let testDataTwo = [17,17,19,20,17];
    let testDataTwoExpectedResult = [91,18];
    
    //DATASET Third Test
    let testDataThree = ["A","B","D","A","C"];
  
    
    //ADD testScenarios to testBed in order you would like them to be tested.
    testScenario.AddTestCase_InputOutput("Test One: Integer Data",testDataOne,null,testDataOneExpectedResult);
    testScenario.AddTestCase_InputOutput("Test One: HTML Text",testDataOne,testFunction_CheckHTMLValues,testDataOneExpectedResult);
    testScenario.AddTestCase_InputOutput("Test Two: Integer Data",testDataTwo,null,testDataTwoExpectedResult);
    testScenario.AddTestCase_InputOutput("Test Two: HTML Text",testDataTwo,testFunction_CheckHTMLValues,testDataTwoExpectedResult);
    testScenario.AddTestCase_ErrorFound("Test Three: Letter Data",testDataThree,null,"", EvalError);

}

//[OPTIONAL] POST_TEST_CALLBACK_TO_USE_POST_TEST_RESULTS_FOR_OTHER_THINGS
export function postTestCallback(testScenario){
    
    var testString = ` post_test_callback: \n [TESTING COMPLETE]\n [TEST_SCENARIO NAME: ${testScenario.Name}] |`
    var testResult;
    testResult = testString + `\n [PASSED: [${testScenario.Passed.toString().toUpperCase()}] ]\n [DATE: ${testScenario.DateTestCompleted.toString()}] \n [TIME: ${testScenario.TimeTestCompleted.toString()}]`
    alert(testResult);
    
}









//OPTIONAL ADDITIONAL CUSTOM TEST FUNCTION for getting HTML values on the page.
function testFunction_CheckHTMLValues(){
  let av = document.getElementById("average").innerHTML;
  let sum = document.getElementById("sum").innerHTML;

  let avNumber = parseInt(av.substring(av.length - 3, av.length));
  let sumNumber = parseInt(sum.substring(sum.length - 3, sum.length));
  return [sumNumber,avNumber];
}









//OTHER FUNCTIONS!!
//LOCAL SCOPE ONLY
//OPTIONAL ADDITIONAL CUSTOM TEST FUNCTION for getting HTML values on the page.

//!!REQUIRED!!
//TestSuite.js and main js method you want to test are only dependencies needed to run.
//NEEDED To setup testing environment and run tests

//!!REQUIRED!!
//CALLBACK FUNCTION - required for any TestBed, Each test bed will have its own callback function to add TestScenarios.
//Make sure you follow this naming convention: "[testBedVariableName]_Tests_Callback(testBed)"

//DIRECTIONS: every TestSuite must be made global using "window". Every TestBed must have a callback function for adding 
// TestScenarios, naming convention is "[testBedName]_[TestName]_CallBack". Callback will call "GenerateTestReport" to render to Page;
// To implement the test you need to import "createTestBeds()" on your main JS file for your site then call it. Once run, the test Beds,
// are created as global variables. Then in the main JS file you need to call the TestBed.EnableTest() method to see the "Run Test" button
// at the bottom of your webpage. When this button is pressed it will call the TestBed Callback function then "TestBed.GenerateTestReport()"
// The report will be printed out in a textarea box that is not editable, you can press "Save To File" to download the test results.
