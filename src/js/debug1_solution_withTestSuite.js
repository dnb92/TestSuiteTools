//NEEDED TO RUN TESTING algorith will work without this import.
import { RunTestSuiteTools } from '../TestSuite/StartFile.js';
//import _ from 'lodash';




//Attach Event Listener to link via inline function.
var getmarksEventHandler = function(){getMarks(false,true)};
var marks = document.getElementById("EnterMarks");
marks.addEventListener('click', getmarksEventHandler);


function checkForClass(className, singleEntry){
    var checkForClass = document.getElementsByClassName(className);
    if (checkForClass.length == 0 && singleEntry == true){
        return true;
    }else if(checkForClass.length > 0 && singleEntry != true){
        return true;
    }else if(checkForClass.length == 0 && singleEntry != true)
        return true;
    else{
        return false;
    }
}

function getMarksInputPrompt(i, count, marksList, userInput, singleEntry){
    
        if (userInput == false){
            let input = parseInt(prompt("Enter mark #"+ count +":"));
            
            if (isNaN(input) == false){
                marksList[i] = input;
                
                if (i == marksList.length -1 && singleEntry == true){
                    //DISABLE enter marks;

                    //EVENT HANDLER IF class of 'test' is found on the page, indicating test is complete, remove eventlistener for click otherwise alert.
                    var notAllowedEventHandler = function (){
                        var testCompleted = document.getElementsByClassName("test");
                        if (testCompleted.length == 0){
                            alert("ENTRY LIMIT REACHED: Please Refresh Page.");
                        }else{
                            marks.removeEventListener('click', getmarksEventHandler);
                        }
                    };

                    marks.removeEventListener('click', getmarksEventHandler);
                    marks.addEventListener('click', notAllowedEventHandler);
                }
            }else{
                alert("Please enter only whole numbers");
                return getMarksInputPrompt(i, count, marksList, userInput, singleEntry);
                
            }
            
        }else{
            if (isNaN(userInput[i]) == false){
                marksList[i] = userInput[i];
            }else{
                throw new TypeError;
            }
             
        }

    return marksList;
}

//CREATES HTML elements on page dynamically to show marks entered, this allows for an expansion of marks array.
function printMarks(marksList, userInput){
    //GET title count of Mark Elements
    var titleCount = 1;
    try{
        titleCount = document.getElementsByClassName("MarkTitle").length + 1;
    }catch(e){
        console.log("No Titles");
    }
     
    //GET Strings to print to page for Marks
    let listOfMarks = new Array();
        
        if (typeof(userInput) == "boolean"){
            listOfMarks.push(`[USER] MARKS ENTRIES ${titleCount}: `);
        }else{
            listOfMarks.push(`[TEST] MARKS ENTRIES ${titleCount}:`)
        }
        
        for (let i = 0; i <= 4; i++){
            listOfMarks.push(`Mark ${i + 1}: ${marksList[i]} \n`);
        }
        listOfMarks.push("");

    //CREATE elements for each mark and its value and append to page dynamically.
    listOfMarks.forEach( function (value,index) { 
        
        var newElement = document.createElement("p");
        newElement.textContent = value;
        newElement.className = "mark"
        if(index != 0){
            newElement.id = `mark${index}`;
            
        }else{
            if (typeof(userInput) == "boolean"){
                newElement.className = "MarkTitle mark";
            }else{
                newElement.className = "MarkTitle mark test";
            }
            
            newElement.style.fontWeight = "bold"; 
        }
        document.body.appendChild(newElement);
        
    });
}

//MAIN ALGORITHM - singleEntry if true makes sure only one set of marks can be entered, if false: multiple.
export function getMarks(userInput = false, singleEntry = false){
	var marksList = new Array(5);
	var total = 0,average=0,count=1;
    

        if (checkForClass("MarkTitle", singleEntry) == true){
            for(var i = 0; i < marksList.length; i++){
                
                marksList = getMarksInputPrompt(i,count,marksList,userInput,singleEntry);
                total = marksList[i] + parseInt(total);
                count++;

            }
        }
    
    //PRINT RESULTS TO PAGE ELEMENTS
	document.getElementById("sum").innerHTML="The total of the entered marks is " + total;
	average = total/5;
	document.getElementById("average").innerHTML= "The average of the entered marks is " + average;
    let results = [total,average];

    //DISPLAY array of marks on page.
    if (checkForClass("MarkTitle", singleEntry) == true){
        printMarks(marksList, userInput);
    }

    return results;

}


//NEED THIS FOR TESTING TO WORK - pass "false" as argument to disable test environment.
RunTestSuiteTools(true);





    



