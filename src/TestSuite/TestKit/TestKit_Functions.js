//TEST_KIT_FUNCTIONS_TO_TEST

//IMPORT any functions from your project that you want to test here
import { getMarks } from "../../js/debug1_solution_withTestSuite.js";

//MAKE them available to the global window context, then access them in your TestKit Definition

export function functionsToTest(){
    window.getMarks = getMarks;
}
