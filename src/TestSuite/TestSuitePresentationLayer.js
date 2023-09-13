import { TestSuiteProperties } from "./TestSuiteProperties.js";
import { TestSuite } from "./TestSuite.js";
import { TestSuitePropertiesEventHandlers } from "./TestSuitePropertiesEventHandlers.js";
import {DraggableElement} from "./DraggableElement.js";

//This file is all the visual elements for the program, i have kept them all in one file because they will be condensed 
//into templates with the use of ElementGroups and ElementUnits in a future revision, these classes will allow me to
//go through this document sequentiallty and make templates out of all these element commands. 

export class TestSuitePresentationLayer{
    constructor(defaults){
        this.Defaults = defaults;
        this.Data = null;
        this.mainWindowId = null;
        this.mainWindowElement = null;
        this.scrollWindowElement;
        this.clickCount = 0;
        this.TestKits = [];
    }

    AddTestSuite(presentationLayer, testSuiteName, testBedName){
        var testSuite = new TestSuite(presentationLayer, testSuiteName,testBedName)
        this.Data = testSuite;
        this.mainWindowId = this.Data.divIdName;
    }

    #assignEventsToProperties(testSuiteProperties,eventHandlers,parentNameForAllCustomEvents,i,max){
        var eventhandlers = eventHandlers;

        for (var property in testSuiteProperties) {
            
            var eventName = `${parentNameForAllCustomEvents}_${property}`; //Create event name

            //Create Session Data Variable for eventName.
            if (window.sessionStorage.getItem(eventName) == null){
                window.sessionStorage.setItem(eventName, "false");
            }

            if (i < max){
                if (Object.prototype.hasOwnProperty.call(testSuiteProperties, property)) { //check property to see if it is unique to class
                    i = i + 1;
                    Object.defineProperty(testSuiteProperties, property, { //define property setter to create event when property is set
                        set: function(value) {
                            //SET new value to property
                            property = value;
                        
                            var testSuiteEvent = new CustomEvent(eventName, { detail: { value: value} });
                                
                            //DISPATCH event
                            document.dispatchEvent(testSuiteEvent);
                        },
                        get: function() {
                            // Return the current value
                            return property;
                        },
                        enumerable: true
                    });
                    
                    var eventHandlersFound = [];
                    var eventHandlerFound = null;
                    //CHECK EventHandlers for handlers that match property
                    var check = eventHandlers[0];
                    for (let eventH of eventHandlers){
                        
                        if(eventH.PropertyName == property){
                            eventHandlersFound.push(eventH);
                            if (eventHandlerFound == null){
                                eventHandlerFound = eventH;
                            }
                        }
                    }

                    if (eventHandlersFound.length > 1){
                        return Error(`MULTIPLE_EVENT_HANDLERS_FOUND_FOR_PROPERTY: ${eventHandlerFound.foreach(handler => {return `${handler.name} `})} `)
                    }else if(eventHandlersFound.length == 1){
                        document.addEventListener(eventName, eventHandlerFound.EventHandler.bind(this)); //creat an event listener on DOM and add event handler to that event
                        console.log(`EVENT_LISTENER_FOR_EVENT: [${eventName}] CREATED`);
                    }else{
                        return Error("NO_EVENT_HANDLER_FOUND_WITH_MATCHING_PROPERTY_NAME");
                    }
                }    
            }
        }
    }

    #assignEventsToPropertiesOnObject(testSuiteProperties, parentNameForAllCustomEvents){

    var eventHandlers = testSuiteProperties.tspEventHandlers;
    var eventHCheck = eventHandlers[0];
    var i = 0;
    var max = Object.keys(testSuiteProperties.baseObject).length;
    var inputType = testSuiteProperties.baseObject.constructor.name;

    //THIS STAGE CHECKS FOR EXPECTED "TestSuiteProperties" Type, if it is not that type algorthm will run general purpose use case which basically checks that all eventHandlers given to it are actually event handlers 
    if (inputType == "TestSuiteProperties" ){
        this.#assignEventsToProperties(testSuiteProperties.baseObject,eventHandlers,parentNameForAllCustomEvents,i,max);
    }else{
        if (eventHandlers.length == max){
            let ieventCounter = 0;
            let eventsThatAreNotAnEvent = [];
            eventHandlers.foreach((eventHandler) => { if (typeof(eventHandler) == "function"){ieventCounter = ieventCounter++;}else{eventsThatAreNotAnEvent.push(ieventCounter);ieventCounter = ieventCounter++;}});//check 
            
            if (eventsThatAreNotAnEvent.length == 0){

                this.#assignEventsToProperties(testSuiteProperties.baseObject,eventHandlers,parentNameForAllCustomEvents,i,max);
                
            }else{
                
                return Error(`EVENT_HANDLERS_THAT_ARE_NOT_AN_EVENT: [${eventsThatAreNotAnEvent.toString()}]`);
            }
            
        }else{
            let result;
            let moreLess;
            if (max > eventHandlers.Length){
                result = Math.abs(max - eventHandler.length);
                moreLess = "more";
            }else if (max < eventHandlers.length){
                result = Math.abs(eventHandler.length - max);
                moreLess = "less";
            }
            return Error(`Event_Handlers_Range_Error: ${result} ${moreLess} event handlers needed. Please enter only ${max} events into eventHandler argument, you provided ${eventHandlers.length}`);
        } 
    }

    }

    createConsoleTestSuiteTools(){
    if (!window.testSuiteTools){
        
        //Create window variable
        window.testSuiteTools = new TestSuiteProperties();

        var tspEventHandlers = new TestSuitePropertiesEventHandlers(window.testSuiteTools);


        var testSuiteToolsEventHandler = function(e) {
                    
            window.sessionStorage.setItem(e.type,JSON.stringify(e.detail.value));
            if (e.detail.value == true){
                console.log(`${e.type} : Enabled`);
            }else{
                console.log(`${e.type} : Disabled`);        
            }
                
            
            this.EnableTestSuiteTools(JSON.parse(window.sessionStorage.getItem(e.type)));
            
        };

        tspEventHandlers.AddNewTstEventHandler(testSuiteToolsEventHandler,this.Defaults.defaultPropertyName);

        this.#assignEventsToPropertiesOnObject(tspEventHandlers,this.Defaults.defaultTestSuiteToolsName);

        }
    }

  

    EnableTestSuiteTools(testMode = true){
        
        //Control visibility of "Run Test" button through testMode variable, default is false - MUST CHAGE TO TRUE TO GET TEST BUTTON.
        if (testMode == true){
            this.BuildMainWindow();


            var clearButton = document.createElement("button");
            clearButton.style.padding = "10px";
            clearButton.style.fontFamily = "Helvetica";
            clearButton.style.fontWeight = "bold";
            clearButton.style.textAlign = "center";
            clearButton.style.border = "none";
            clearButton.style.boxShadow = "3px 3px";
            clearButton.style.borderRadius = "0px 0px 10px 10px";
            clearButton.style.backgroundColor = "lightgrey";
            clearButton.id = "clearAll";
            clearButton.textContent = `CLEAR TESTS`;
            clearButton.pointerEvents = "auto";
            clearButton.disabled = true;
            clearButton.onclick = function(e) {console.log("CLEAR_ALL_TEST_SCENARIOS"); 
            //this.Data.TestBeds.BuildAllTestScenarios();
            
            var testScenariosExisting = [];
            for (var ts of this.Data.TestBeds.TestScenarios){
                if (document.querySelector(".TESTBED") != null){
                    testScenariosExisting.push(document.getElementById(ts.Name));
                }
                
            }
            
            if (testScenariosExisting.length !=0){
                for (var div of testScenariosExisting){
                
                    div.remove()
                }
            }

            for (var ts of this.Data.TestBeds.TestScenarios){
                var buttId = `tkEntry_${ts.Name}`;
                var viewButt = document.getElementById(buttId);
                viewButt.style.backgroundColor = "white";
            }

            var welcome = document.getElementById('headingMessage');
            welcome.innerHTML = "...";

        }.bind(this);


            var button = document.createElement("button");
            button.style.padding = "10px";
            button.style.fontFamily = "Helvetica";
            button.style.fontWeight = "bold";
            button.style.textAlign = "center";
            button.style.border = "none";
            button.style.boxShadow = "3px 3px";
            button.style.borderRadius = "0px 0px 10px 10px";
            button.style.backgroundColor = "orange";
            button.id = "runTest"
            button.textContent = `RUN TESTBED`;
            button.pointerEvents = "auto";
            button.disabled = true;
            button.onclick = function(e) {console.log("RUN_ALL_TEST_SCENARIOS"); 
                //this.Data.TestBeds.BuildAllTestScenarios();
                this.mainWindowOpenCloseButtonElement.innerHTML= `[Running All TestKits]`;
                this.mainWindowOpenCloseButtonElement.style.backgroundColor= "white";
                var testScenariosExisting = [];
                for (var ts of this.Data.TestBeds.TestScenarios){
                    if (document.querySelector(".TESTBED") != null){
                        testScenariosExisting.push(document.getElementById(ts.Name));
                    }
                    
                }
                
                if (testScenariosExisting.length !=0){
                    for (var div of testScenariosExisting){
                    
                        div.remove()
                    }
                }
                console.log(this.Data.TestBeds.TestScenarios.length);
                this.Data.TestBeds.RunAllTestScenarios();
               
                for (var ts of this.Data.TestBeds.TestScenarios){
                    var buttId = `tkEntry_${ts.Name}`;
                    var viewButt = document.getElementById(buttId);
                    ts.AllTestCasesPassed();
                    if (ts.Passed == true){
                        viewButt.style.backgroundColor = "forestgreen";
                    }else if(ts.Passed == false){
                        viewButt.style.backgroundColor = "crimson";
                    }else{
                        viewButt.style.backgroundColor = "darkorange";
                    }
                }
                
                button.textContent = "RUN TESTBED AGAIN";
                var clearButt = document.getElementById("clearAll");
                clearButt.disabled = false;

            }.bind(this);

            var welcome = document.createElement('p');
            welcome.style.fontFamily = "Helvetica";
            welcome.id = "headingMessage";
            welcome.style.backgroundColor = "none";
            welcome.style.color = "lightgrey";
            welcome.style.letterSpacing = "10px";
            welcome.style.display = "block";
            welcome.style.fontStyle = "bold";
            welcome.style.whiteSpace = "wrap";
            welcome.style.width = "50%";
            welcome.style.fontSize = "50px"
            welcome.style.width = "100%";
            welcome.style.borderRadius = "50px";
            welcome.style.marginBottom = "10px";           
            welcome.innerHTML = "<sup><b>WELCOME\n\nto TestSuite Webpage Unit-Testing Software. _version_0.01beta</sup>";

            var testBedDiv = document.createElement("div");
            testBedDiv.style.margin = "10px";
            testBedDiv.style.fontFamily = "Helvetica";
            testBedDiv.style.color = "black";
            testBedDiv.style.fontWeight = "bold";
            testBedDiv.style.fontSize = "20px"
            testBedDiv.style.width = "95%";
            testBedDiv.style.borderRadius = "10px";
            testBedDiv.style.padding = "20px";
            testBedDiv.style.pointerEvents = "auto";
            testBedDiv.style.height = "content";
            testBedDiv.style.marginTop = "10px";
            testBedDiv.style.backgroundColor = "white";
            testBedDiv.style.backgroundBlendMode = "none";
            testBedDiv.style.whiteSpace = "wrap";
            testBedDiv.style.textAlign = "center";
            testBedDiv.style.position = "relative";
            testBedDiv.style.pointerEvents = "auto";
            testBedDiv.style.marginBottom = "20px";
            testBedDiv.style.borderRadius = "20px";
            testBedDiv.style.borderWidth = "1px";
            testBedDiv.style.borderStyle = "dashed";
            testBedDiv.style.borderColor = "black";
            
            var testBedHeader = document.createElement("div");
            testBedHeader.style.margin = "0px";
            testBedHeader.style.fontFamily = "Helvetica";
            testBedHeader.style.color = "black";
            testBedHeader.style.fontWeight = "bold";
            testBedHeader.style.fontSize = "20px"
            testBedHeader.style.width = "auto";
            testBedHeader.style.borderRadius = "10px";
            testBedHeader.style.padding = "20px";
            testBedHeader.style.pointerEvents = "auto";
            testBedHeader.style.height = "content";
            testBedHeader.style.marginTop = "0px";
            testBedHeader.style.backgroundColor = "white";
            testBedHeader.style.backgroundBlendMode = "none";
            testBedHeader.style.whiteSpace = "wrap";
            testBedHeader.style.textAlign = "left";
            testBedHeader.style.position = "relative";
            testBedHeader.style.pointerEvents = "auto";
            testBedHeader.style.marginBottom = "15px";
            testBedHeader.style.borderRadius = "20px";
            testBedHeader.style.borderWidth = "1px";
            testBedHeader.style.borderStyle = "dashed";
            testBedHeader.style.borderColor = "black";
            testBedHeader.innerHTML = `[TESTBED 1]`;

            var pickerHeader = document.createElement("div");
            pickerHeader.style.margin = "0px";
            pickerHeader.style.fontFamily = "Helvetica";
            pickerHeader.style.color = "black";
            pickerHeader.style.fontWeight = "bold";
            pickerHeader.style.fontSize = "20px"
            pickerHeader.style.width = "auto";
            pickerHeader.style.borderRadius = "10px";
            pickerHeader.style.padding = "20px";
            pickerHeader.style.pointerEvents = "auto";
            pickerHeader.style.height = "content";
            pickerHeader.style.marginTop = "0px";
            pickerHeader.style.backgroundColor = "white";
            pickerHeader.style.backgroundBlendMode = "none";
            pickerHeader.style.whiteSpace = "wrap";
            pickerHeader.style.textAlign = "left";
            pickerHeader.style.position = "relative";
            pickerHeader.style.pointerEvents = "auto";
            pickerHeader.style.marginBottom = "15px";
            pickerHeader.style.borderRadius = "20px";
            pickerHeader.style.borderWidth = "1px";
            pickerHeader.style.borderStyle = "dashed";
            pickerHeader.style.borderColor = "black";
            pickerHeader.innerHTML = `CHOOSE TEST KIT(S): `;

            var pickerDiv = document.createElement("div");
            pickerDiv.style.margin = "0px";
            pickerDiv.style.fontFamily = "Helvetica";
            pickerDiv.style.color = "black";
            pickerDiv.style.fontWeight = "bold";
            pickerDiv.style.fontSize = "20px"
            pickerDiv.style.width = "auto";
            pickerDiv.style.borderRadius = "10px";
            pickerDiv.style.padding = "20px";
            pickerDiv.style.pointerEvents = "auto";
            pickerDiv.style.height = "content";
            pickerDiv.style.marginTop = "0px";
            pickerDiv.style.backgroundColor = "white";
            pickerDiv.style.backgroundBlendMode = "none";
            pickerDiv.style.whiteSpace = "wrap";
            pickerDiv.style.textAlign = "center";
            pickerDiv.style.position = "relative";
            pickerDiv.style.pointerEvents = "auto";
            pickerDiv.style.marginBottom = "10px";
            pickerDiv.style.borderRadius = "20px";
            pickerDiv.style.borderWidth = "1px";
            pickerDiv.style.borderStyle = "dashed";
            pickerDiv.style.borderColor = "black";
            
            var directions = document.createElement("div");
            directions.style.backgroundColor = "lightgrey"
            directions.style.fontSize = "70%";
            directions.style.fontWeight = "normal";
            directions.style.color = "black";
            directions.style.textAlign = 'left';
            directions.style.padding = "50px";
            directions.style.pointerEvents = "none";
            directions.style.width = "auto";
            directions.style.height = "auto";
            directions.style.overflow = "wrap";
            directions.style.borderRadius = "30px";
            directions.style.marginBottom = "15px";
            var helptext = "<b>WINDOW RESIZE:</b> Drag the top heading to change the window size it has a snapping feature, there are four positons you can drag it to. You can also completely collapse the panel to the bottom of the screen by simply clicking once on the panel header.<br><br><b>ENABLE / DISABLE TEST_SUITE_TOOLS:</b> Go to console window and type 'testSuiteTools.enabled = false' to disable and the inverse to enable.<br><br><b>ADDING TESTKIT:</b> Pick a TestKit from file, the default location is in the 'TestKitTemplates' folder in the 'TestSuite' folder.<br><br><b>TESTKIT FORMATTING:</b> Please make sure you have formatted your TestKit according to the TestKit template provided.<br><br><b>TESTBED EXECUTION:</b> Once you have loaded a TestKit you can run a TestScenario Individually by pressing the yellow button with the TestKit file name on it, alternatively you<br> can press the 'Run TestBed' button below to run all TestKits you have loaded.<br><br><b>RESULTS:</b> To see the results of your tests you can scroll down the page, a TestScenario is created for each TestKit and the TestCases are displayed below.";
            directions.innerHTML = helptext;

            var helpHeading = document.createElement('div');
            helpHeading.style.backgroundColor = "grey";
            helpHeading.style.fontSize = "70%";
            helpHeading.style.fontWeight = "normal";
            helpHeading.style.backgroundColor = "white";
            helpHeading.style.borderStyle = "dashed";
            helpHeading.style.borderWidth = "1px";
            helpHeading.style.textAlign = 'left';
            helpHeading.style.padding = "10px";
            helpHeading.style.pointerEvents = "auto";
            helpHeading.style.width = "auto";
            helpHeading.style.height = "auto";
            helpHeading.style.overflow = "none";
            helpHeading.style.borderRadius = "30px";
            helpHeading.style.marginBottom = "15px";
            helpHeading.innerHTML = "<b>HELP MENU:</b> <i>click to close...</i>";
            helpHeading.onclick = function(){if (directions.style.height == "0px"){
                directions.style.height = "auto";
                directions.innerHTML = helptext;
                directions.style.padding = "50px";
                helpHeading.innerHTML = "<b>HELP MENU:</b> <i>click to close...</i>"
            }else{
                directions.style.height = "0px";
                directions.innerHTML = "";
                directions.style.padding = "0px";
                helpHeading.innerHTML = "<b>HELP MENU:</b> <i>click to expand...</i>";
            }}
            helpHeading.click();

            var pickTestKit = document.createElement("input");
            pickTestKit.type = "file";
            pickTestKit.marginLeft = "50px";
            pickTestKit.multiple = true;
            pickTestKit.style.pointerEvents = "auto";
            pickTestKit.id= "testKitPicker";
            pickTestKit.innerHTML = "Choose TestKit:"
            pickTestKit.style.position = "relative";
            pickTestKit.style.textAlign = "center";
            button.disabled = true;
            var breakEle = document.createElement('p');
            breakEle.innerHTML = "<br><br>";

            var functionToCall = function (obj = 1,fileUrl,testKit){
            
                    import(fileUrl).then(({ functionToTest, testCallback, postTestCallback} ) => {
                        var len = obj.TestKits.length;
                        var funcToTest = functionToTest();
                        obj.Data.TestBeds.AddTestScenario_AllTypes(`${this.Data.TestBeds.Name}__Scenario${(obj.TestKits.findIndex(function (file){ return file.name == testKit.name})) + 1}`,testKit, funcToTest, testCallback, postTestCallback);
                        var ts = obj.Data.TestBeds.TestScenarios[obj.Data.TestBeds.TestScenarios.length -1];
                        try{
                            ts.Build();

                            this.mainWindowOpenCloseButtonElement.innerHTML= `[${ts.Name} Added to TestBed]`;
                            this.mainWindowOpenCloseButtonElement.style.backgroundColor= "white";
                            button.disabled = false;

                            var tkdispdiv = document.createElement('div');
                            tkdispdiv.id = `tkEntry_${ts.Name}`;
                            tkdispdiv.style.display = "flex";
                            tkdispdiv.style.borderRadius = "20px";
                            tkdispdiv.style.borderStyle = "dashed";
                            tkdispdiv.style.borderWidth = "1px";
                            tkdispdiv.style.marginBottom = "5px";
                            
                            tkdispdiv.style.position = "relative";
                            tkdispdiv.style.textAlign = "center";
                            tkdispdiv.style.pointerEvents = "auto";
                            var testKitDisplay = document.createElement("div");
                            testKitDisplay.style.width = "50%";
                            testKitDisplay.innerHTML = `RUN: ${testKit.name.replace(/.js/g,'')}`;
                            testKitDisplay.style.padding = "20px";
                            
                            testKitDisplay.style.fontFamily = "Helvetica";
                            testKitDisplay.style.pointerEvents = "auto";
                            testKitDisplay.style.fontWeight = "bold";
                            
                            testKitDisplay.style.border = "none";
                            testKitDisplay.style.margin = "10px";
                        
                            testKitDisplay.style.borderRadius = "10px 10px 10px 10px";
                            testKitDisplay.style.backgroundColor = "orange";
                            testKitDisplay.id = "testKit";
                            testKitDisplay.style.pointerEvents = "auto";
                            
                            var viewButton = document.createElement("div");
                            viewButton.id = `vbutt_${ts.Name}`;
                            viewButton.style.width = "50%";
                            viewButton.style.height = "content"
                            viewButton.innerHTML = `VIEW`;
                            viewButton.style.padding = "20px";
                            viewButton.style.fontFamily = "Helvetica";
                            viewButton.style.fontWeight = "bold";
                            viewButton.style.textAlign = "center";
                            viewButton.style.border = "dashed";
                            viewButton.style.borderWidth = "1px";
                            viewButton.style.margin = "10px";
                            viewButton.style.borderRadius = "10px 10px 10px 10px";
                            viewButton.style.backgroundColor = "lightgrey";
                            viewButton.style.pointerEvents = "auto";
                            viewButton.disabled = true;
                            
                            viewButton.onclick = function (){var ele = document.getElementById(`tag_${ts.Name}`);
                                if (ele != null){
                                    this.scrollWindowElement.scrollTop = ele.offsetTop; 
                                } 
                            }.bind(this);
                            
                            var resetButton = document.createElement("div");
                            resetButton.id = `rbutt_${ts.Name}`;
                            resetButton.style.width = "25%";
                            resetButton.style.height = "content"
                            resetButton.innerHTML = `RESET`;
                            resetButton.style.padding = "20px";
                            resetButton.style.fontFamily = "Helvetica";
                            resetButton.style.fontWeight = "bold";
                            resetButton.style.textAlign = "center";
                            resetButton.style.color = "white";
                            resetButton.style.border = "dashed";
                            resetButton.style.borderWidth = "1px";
                            resetButton.style.margin = "10px";
                            resetButton.style.borderRadius = "10px 10px 10px 10px";
                            resetButton.style.backgroundColor = "grey";
                            resetButton.style.pointerEvents = "auto";
                            resetButton.onclick = function (e){
                                var tsGui = document.getElementById(`${ts.Name}`);
                                tsGui.remove();
                                
                                var buttId = `tkEntry_${ts.Name}`;
                                var viewButt = document.getElementById(buttId);
                                viewButt.style.backgroundColor = "white";
                                var welcome = document.getElementById('headingMessage');
                                welcome.innerHTML = "...";
                                
                            };

                            var deleteButt = document.createElement("div");
                            deleteButt.id = `dbutt_${ts.Name}`;
                            deleteButt.style.width = "25%";
                            deleteButt.style.height = "content"
                            deleteButt.innerHTML = `DELETE`;
                            deleteButt.style.padding = "20px";
                            deleteButt.style.fontFamily = "Helvetica";
                            deleteButt.style.fontWeight = "bold";
                            deleteButt.style.textAlign = "center";
                            deleteButt.style.color = "white";
                            deleteButt.style.border = "dashed";
                            deleteButt.style.borderWidth = "1px";
                            deleteButt.style.margin = "10px";
                            deleteButt.style.borderRadius = "10px 10px 10px 10px";
                            deleteButt.style.backgroundColor = "black";
                            deleteButt.style.pointerEvents = "auto";
                            deleteButt.onclick = function (e){
                                //remove GUI elements
                                var ts = obj.Data.TestBeds.TestScenarios[obj.Data.TestBeds.TestScenarios.findIndex(ts => ts.TestKit.name == testKit.name)]; 
                                
                                var oldName = ts.Name;
                                var tsGui = document.getElementById(`${ts.Name}`);
                                if (tsGui != null){
                                    tsGui.remove();
                                }
                                
                                //remove testScenario
                                var index = obj.Data.TestBeds.TestScenarios.indexOf(ts); 
                                obj.Data.TestBeds.TestScenarios.splice(index, 1);
                                console.log(obj.Data.TestBeds.TestScenarios.length);
                                //remove TestKit.
                                var tkindex = obj.TestKits.findIndex(function (file){ return file.name == testKit.name});
                                obj.TestKits.splice(tkindex, 1);
                                //remove buttons
                                document.getElementById(`tkEntry_${ts.Name}`).remove();
                                var count = 1;
                                if (obj.Data.TestBeds.TestScenarios.length != 0){
                                    for (var tse of obj.Data.TestBeds.TestScenarios){
                                        var chop = tse.Name.slice(0, -2);
                                        var fix = chop + count + "]";
                                        if (fix != tse.Name){
                                            //var pageElement = document.getElementById(tse.Name);
                                            var tkEntry = document.getElementById(`tkEntry_${tse.Name}`);
                                            var viewButt = document.getElementById(`vbutt_${tse.Name}`);
                                            var resetButt = document.getElementById(`rbutt_${tse.Name}`);
                                            var deleteButt = document.getElementById(`dbutt_${tse.Name}`);
                                            tkEntry.id = `tkEntry_${fix}`;
                                            viewButt.id = `vbutt_${fix}`;
                                            resetButt.id = `rbutt_${fix}`;
                                            deleteButt.id = `dbutt_${fix}`;
    
                                            tse.Name = fix;
                                        }
                                        count++;
                                    }

                                    this.mainWindowOpenCloseButtonElement.innerHTML= `[${oldName} Removed]`;
                                    this.mainWindowOpenCloseButtonElement.style.backgroundColor= "white";
                                }else{
                                    pickTestKit.addEventListener('change', (testKits) => {
                                        var Files = testKits;
                                        if (this.Data == null){
                                            var presentationLayer = this;
                                            this.AddTestSuite(presentationLayer,"TestSuite","TestBed1");
                                        }
                                        
                                        var nameExistsAlready = false;
                                        for (var testKit of Files.target.files){
                                            
                                            if (this.TestKits.length > 0){
                                                for (var tk of this.TestKits){
                                                    if (tk.name == testKit.name){
                                                        nameExistsAlready = true;
                                                    }
                                                }
                                            }
                                            
                        
                                            if (nameExistsAlready === false){
                                                this.TestKits.push(testKit);
                        
                                                var file = new Blob([testKit], {type: "text/javascript"});
                                                var fileUrl = window.URL.createObjectURL(file);
                                            
                                                console.log(fileUrl.innerHTML);
                                                functionToCall(this,fileUrl,testKit);
                                            }else{
                                                alert("TestKit Already in TestBed please use another TestKit and try again!");
                                            }
                                            
                                        }
                        
                                        button.disabled = false;
                                    
                                    });
                                }
                            };
                            
                            testKitDisplay.onclick = function(e) {
                            
                                var testKitname = e.target.innerHTML;
                                console.log(`BUTTON_PRESSED: [${testKitname}] `);
                                var ts = obj.Data.TestBeds.TestScenarios[obj.Data.TestBeds.TestScenarios.findIndex(ts => ts.TestKit.name == testKit.name)]; 
                                ts.RunAllTestCases();
                                var buttId = `tkEntry_${ts.Name}`;
                                var viewButt = document.getElementById(buttId);
                                
                                ts.AllTestCasesPassed();
                                if (ts.Passed == true){
                                    viewButt.style.backgroundColor = "forestgreen";
                                }else if(ts.Passed == false){
                                    viewButt.style.backgroundColor = "crimson";
                                }else{
                                    viewButt.style.backgroundColor = "darkorange";
                                }

                            }.bind(this);
                            
                            
                            tkdispdiv.append(testKitDisplay);
                            tkdispdiv.append(viewButton);
                            tkdispdiv.append(resetButton);
                            tkdispdiv.append(deleteButt);
                            pickerDiv.append(tkdispdiv);
                            
                            
                        }catch(e)
                        {alert("Test Scenario not correct format, please choose a different file.");
                            var index = obj.Data.TestBeds.TestScenarios.indexOf(ts); 
                            obj.Data.TestBeds.TestScenarios.splice(index, 1);
                            console.log(obj.Data.TestBeds.TestScenarios.length);
                            var tkindex = obj.TestKits.findIndex(function (file){ return file.name == testKit.name});
                            obj.TestKits.splice(tkindex, 1);
                        }
                });

        }.bind(this);
                
            
            pickTestKit.addEventListener('change', (testKits) => {
                var Files = testKits;
                if (this.Data == null){
                    var presentationLayer = this;
                    this.AddTestSuite(presentationLayer,"TestSuite","TestBed1");
                }
                
                var nameExistsAlready = false;
                for (var testKit of Files.target.files){
                    
                    if (this.TestKits.length > 0){
                        for (var tk of this.TestKits){
                            if (tk.name == testKit.name){
                                nameExistsAlready = true;
                            }
                        }
                    }
                    

                    if (nameExistsAlready === false){
                        this.TestKits.push(testKit);

                        var file = new Blob([testKit], {type: "text/javascript"});
                        var fileUrl = window.URL.createObjectURL(file);
                    
                        console.log(fileUrl.innerHTML);
                        functionToCall(this,fileUrl,testKit);
                    }else{
                        alert("TestKit Already in TestBed please use another TestKit and try again!");
                    }
                    
                } 
            button.disabled = false;
            });

            testBedDiv.append(testBedHeader);
            testBedDiv.append(pickerDiv);
            testBedDiv.append(helpHeading);
            testBedDiv.append(directions);
            testBedDiv.append(button);
            testBedDiv.append(clearButton);
            pickerHeader.append(pickTestKit);
            pickerDiv.append(pickerHeader);
            this.scrollWindowElement.append(testBedDiv);
            this.scrollWindowElement.append(welcome);
            
        }else{
            
            if (this.scrollWindowElement != null){
                this.mainWindowOpenCloseButtonElement.remove();
                this.scrollWindowElement.remove();
                
            }
        }
    }

    BuildMainWindow(){

        var ancestor = document.createElement('div');
        ancestor.style.position = "fixed";
        ancestor.style.width =  "100%";
        ancestor.style.height = "content";
        ancestor.style.bottom = "0px";
        ancestor.style.textAlign = "center";
        //ancestor.style.overflow = "auto";

        var openCloseMainWindow = function (){
            DraggableElement.dragElement(this.mainWindowOpenCloseButtonElement,this.scrollWindowElement,ancestor);
    
        };
        
        var scrollWindow = document.createElement('div');
        scrollWindow.id = "scrollWindow";
        scrollWindow.style.position = "absolute";
        scrollWindow.style.textAlign = "center";
        scrollWindow.style.paddingLeft = "50px";
        scrollWindow.style.paddingRight = "50px";
        scrollWindow.style.backgroundColor = "lightgrey";
        scrollWindow.style.bottom = "0px";
        
        scrollWindow.style.height = (window.innerHeight / 2) + "px";
        scrollWindow.style.width = "95%";
        scrollWindow.style.overflowY = "scroll";
        scrollWindow.style.overflowX = "none";
        
        scrollWindow.style.backgroundImage = "url('../src/resources/background_dotted.jpg')";
        scrollWindow.style.backgroundRepeat = "repeat";
        scrollWindow.style.backgroundSize = "contain";
        scrollWindow.style.backgroundBlendMode = "lighten";
        this.scrollWindowElement = scrollWindow;
        
        //CREATE Open Close Button
        var mainWindowOpenClose = document.createElement("div");
        mainWindowOpenClose.className = "testsuiteTools mainWindow";
        mainWindowOpenClose.id = "ts_main_openclose";
        mainWindowOpenClose.style.position = "absolute";
        mainWindowOpenClose.style.bottom = (window.innerHeight / 2) + "px";
        mainWindowOpenClose.style.fontWeight = "bold";
        mainWindowOpenClose.style.textAlign = "center";
        mainWindowOpenClose.style.borderRadius = "10px 10px 0px 0px";
        mainWindowOpenClose.style.padding = "10px";
        mainWindowOpenClose.style.borderWidth = "1px";
        mainWindowOpenClose.style.borderColor = "black";
        mainWindowOpenClose.style.borderStyle = "dashed";
        mainWindowOpenClose.style.fontFamily = "Helvetica";
        document.body.appendChild(mainWindowOpenClose);
        mainWindowOpenClose.style.backgroundColor = "white";
        mainWindowOpenClose.style.height = "20px";
        mainWindowOpenClose.style.width = "98%";
        mainWindowOpenClose.innerHTML = `[TestSuiteTools]`;
        this.mainWindowOpenCloseButtonElement = mainWindowOpenClose;
        mainWindowOpenClose.onclick = openCloseMainWindow.bind(this);
        mainWindowOpenClose.click();
        mainWindowOpenClose.style.bottom = (window.innerHeight / 2) + "px";
        scrollWindow.style.height = (window.innerHeight / 2) + "px";

        ancestor.append(mainWindowOpenClose);
        ancestor.append(scrollWindow);
        document.body.append(ancestor);
    }

    BuildTestBeds(testScenario){
            
            var testBed = this.Data.TestBeds;
            if (testBed.TestScenarios.length > 0){
            
                this.testBedElements = [];
                this.testBedElements.push("")
            
                if(this.testBedElements.length >= 1 ){
                    var loading = document.getElementById("headingMessage");
                    loading.innerHTML = "Loading TestBeds...";

                        var heading = document.createElement("p");
                            
                            heading.style.backgroundColor = "Black";
                            heading.style.textAlign = "center";
                            heading.style.color = "white";
                            heading.style.fontWeight = "bold";
                            heading.style.fontSize = "40px"
                            heading.style.width = "100%";
                            heading.style.borderRadius = "10px";
                            heading.style.padding = "20px";
                            heading.style.position = "relative";
                            heading.style.marginBottom = "10px";
                            
                            var tag = document.createElement('p');
                            tag.id = `tag_${testScenario.Name}`;
                            tag.hieght = "0px";
                            
                            var containerForTestBed = document.createElement('div');
                            containerForTestBed.style.position = "relative";
                            containerForTestBed.id = testScenario.Name;
                            containerForTestBed.style.width = "auto";
                            containerForTestBed.style.height = "auto";
                            
                            
                            containerForTestBed.append(heading);
                            containerForTestBed.classList.add("TESTBED");
                            this.scrollWindowElement.append(tag);
                            this.scrollWindowElement.append(containerForTestBed);
                            
                            
                        this.BuildTestScenarios(heading,containerForTestBed,testScenario);
                            
                    loading.innerHTML = "Building TestScenarios...";
                }

                var loading = document.getElementById("headingMessage");
                loading.innerHTML = "TESTING COMPLETE...";
                loading.style.borderWidth = "1px";
                loading.style.borderStyle = "dashed";
                loading.style.borderColor = "black";
                loading.style.backgroundColor = "white";
                loading.style.color = "darkgrey";
            }
        
    }

    BuildTestScenarios(heading,containerForTestBed,testScenario){

            var testResults;
            
        if(testScenario.TestCases.length > 0){
            
            testResults = testScenario.GenerateTestResults().replace(/[,]+/g," ");

            //testScenario.cloneAndAddListener();

            if (testScenario.Passed == true){
                heading.innerHTML = "TEST SCENARIO: " + testScenario.Name + " PASSED";
                heading.style.backgroundColor = "green";
                this.mainWindowOpenCloseButtonElement.style.backgroundColor = "green";
                this.mainWindowOpenCloseButtonElement.innerHTML= `TESTBED1 | LAST_TEST_SCENARIO_RUN: ${testScenario.Name} | Result: [ALL TEST CASES PASS]`;
                this.mainWindowOpenCloseButtonElement.style.color = "white";
            }else if(testScenario.Passed == false){
                heading.innerHTML = "TEST SCENARIO: " + testScenario.Name + " FAILED ";
                heading.style.backgroundColor = "red";
                this.mainWindowOpenCloseButtonElement.style.backgroundColor = "red";
                this.mainWindowOpenCloseButtonElement.innerHTML= `TESTBED1 | LAST_TEST_SCENARIO_RUN: ${testScenario.Name} | Result: [ALL TEST CASES FAIL]`;
                this.mainWindowOpenCloseButtonElement.style.color = "white";
            }else{
                heading.innerHTML = "TEST SCENARIO: " + testScenario.Name + " PARTIAL ";
                heading.style.backgroundColor = "orange";
                this.mainWindowOpenCloseButtonElement.style.backgroundColor = "orange";
                this.mainWindowOpenCloseButtonElement.innerHTML= `TESTBED1 | LAST_TEST_SCENARIO_RUN: ${testScenario.Name} | Result: [MIXED RESULTS]`;
                this.mainWindowOpenCloseButtonElement.style.color = "white";
            }

            var testResultsContainer = document.createElement("div");
            
            testResultsContainer.appendChild(heading);
            testResultsContainer.style.position = "relative";
            testResultsContainer.style.display = "block";
            testResultsContainer.style.width = "90%";
            //testResultsContainer.style.overflowY = "scroll";
            testResultsContainer.style.padding = "20px";
            testResultsContainer.style.pointerEvents = "none";
            
            containerForTestBed.style.textAlign = "center";
            containerForTestBed.style.fontFamily = "Helvetica";
            containerForTestBed.appendChild(testResultsContainer);

            var testResultPanel = document.createElement("div");
            testResultPanel.style.position = "relative";
            testResultPanel.style.textAlign = "center";
            testResultPanel.style.overflowX = "scroll";
            testResultPanel.style.overflowY = "hidden";
            testResultPanel.style.whiteSpace = "nowrap";
            testResultPanel.style.display = "inline-block";
            testResultPanel.style.width = "95%";
            testResultPanel.style.borderStyle = "dashed";
            testResultPanel.style.borderWidth = "1px";
            testResultPanel.style.borderColor = "black";
            testResultPanel.style.height = "content";
            testResultPanel.style.padding = "200px";
            testResultPanel.style.borderRadius = "50px";
            testResultPanel.style.backgroundColor = "none";
            testResultPanel.style.backgroundBlendMode = "overlay";
            testResultPanel.style.background - "rgba(0,0,0,0.5)";
            testResultPanel.style.padding = "5px";
            testResultPanel.style.paddingTop = "50px";
            testResultPanel.style.paddingBottom = "50px";
            testResultPanel.style.margin = "20px";
            testResultPanel.style.pointerEvents = "auto";
            //testResultPanel.style.boxShadow = "10px 10px lightblue";
            
        
            var textField = document.createElement('p');
            textField.style.margin = "10px";
            textField.style.fontFamily = "Helvetica";
            textField.style.color = "black";
            textField.style.fontWeight = "bold";
            textField.style.fontSize = "20px"
            textField.style.width = "98.5%";
            textField.style.borderRadius = "10px";
            textField.style.padding = "20px";
            textField.style.height = "content";
            textField.style.marginTop = "30px";
            textField.style.backgroundColor = "white";
            textField.style.backgroundBlendMode = "none";
            textField.style.whiteSpace = "wrap";
            textField.style.textAlign = "left";
            textField.style.position = "relative";
            textField.style.pointerEvents = "none";
            textField.style.marginBottom = "50px";
            textField.style.borderRadius = "20px";
            textField.style.borderWidth = "1px";
            textField.style.borderStyle = "dashed";
            textField.style.borderColor = "black";
            textField.innerHTML = "TEST_CASES:"
        
            textField.appendChild(testResultPanel);
            testResultsContainer.appendChild(textField);
            
            var heading = document.getElementById("headingMessage");
            heading.innerHTML = "Building TestCases...";
            //Generate Test Case Presentations
            for (var testCase of testScenario.TestCases){
                var testCaseElement = document.createElement('div');
                testCaseElement.style.display = "inline-block";
                testCaseElement.style.position = "relative";
                testCaseElement.class = "TestBed_" + testCase.Name + "_container";
                testCaseElement.style.height = "content";
                testCaseElement.style.width = "100%";
                testCaseElement.style.padding = "10px";
                testCaseElement.style.backgroundColor = "lightgrey";

                this.testCaseElements = [];
                this.testCaseElements.push(testCaseElement);
                this.BuildTestCases(testResultsContainer, textField, testResultPanel,testCaseElement,testScenario,testCase);

            }

            var heading = document.getElementById("headingMessage");
            heading.innerHTML = "Loading User Interface...";
            
            var textField1 = document.createElement('p');
            textField1.style.margin = "10px";
            textField1.style.height = "content";
            textField1.style.fontFamily = "Helvetica";
            textField1.style.color = "black";
            textField1.style.fontWeight = "bold";
            textField1.style.fontSize = "20px"
            textField1.style.width = "98.5%";
            textField1.style.borderRadius = "10px";
            textField1.style.padding = "20px";
            textField1.style.backgroundColor = "white";
            textField1.style.backgroundBlendMode = "none";
            textField1.style.whiteSpace = "wrap";
            textField1.style.textAlign = "left";
            textField1.style.position = "relative";
            textField1.style.pointerEvents = "auto";
            textField1.style.marginBottom = "10px";
                    
            textField1.style.borderRadius = "20px";
            textField1.style.borderWidth = "1px";
            textField1.style.borderStyle = "dashed";
            textField1.style.borderColor = "black";
            textField1.innerHTML = "TEST_OUTPUT:"
            testResultsContainer.appendChild(textField1);
                    
            var textField2 = document.createElement('div');
            textField2.style.pointerEvents = "auto";
            textField2.style.textAlign = "center";
            textField1.appendChild(textField2);
    
            //CREATE Test title
            var titleResult = document.createElement("p");
            titleResult.textContent = `TEST: [${testScenario.Name.toUpperCase()}]  RESULTS:`;
            titleResult.style.fontWeight = "bold";
            textField2.appendChild(titleResult);
        
            //PRINT Test Results to text field
            var textField = document.createElement("textarea");
            textField.id = "testResultArea";
            textField.cols = 100;
            textField.rows = 15;
            textField.innerHTML = testResults;
            textField.disabled = "disabled";
            textField.style.verticalAlign = "middle";
            textField2.appendChild(textField);
    
            //ADD break lines
            var breakLine = document.createElement("br");
            var breakLine2 = document.createElement("br");
            var breakLine3 = document.createElement("br");
            var breakLine4 = document.createElement("br");
            
            textField2.appendChild(breakLine);
            textField2.appendChild(breakLine4);
    
            //SAVE BUTTON 
            var file = new Blob([testResults], {type: "text/javascript"});
            var fileName = `TB_${testScenario.Name}_results.txt`
            var saveButton = document.createElement("button");
            saveButton.style.padding = "10px";
            saveButton.style.fontFamily = "Helvetica";
            saveButton.style.fontWeight = "bold";
            saveButton.style.textAlign = "center";
            saveButton.style.border = "none";
            saveButton.style.boxShadow = "3px 3px";
            saveButton.style.borderRadius = "0px 0px 10px 10px";
            saveButton.style.backgroundColor = "orange";
            saveButton.innerHTML = "Save To File";
            saveButton.style.color = "black";
            var func = function (){alert("ALERT: TEST RESULTS WILL BE SAVED TO DOWNLOAD FOLDER.");testScenario.saveToFile(file, fileName)};
            saveButton.onclick = func.bind(this.Data.TestBeds.TestScenarios[0]);
            
            textField2.appendChild(saveButton);
            textField2.appendChild(breakLine2);
            textField2.appendChild(breakLine3);
    
            //RESET LINK
            var resetButton = document.createElement("button");
            resetButton.id = "refreshPageButton";
            resetButton.style.padding = "10px";
            resetButton.style.fontFamily = "Helvetica";
            resetButton.style.fontWeight = "bold";
            resetButton.style.textAlign = "center";
            resetButton.style.border = "none";
            resetButton.style.boxShadow = "3px 3px";
            resetButton.style.borderRadius = "0px 0px 10px 10px";
            resetButton.style.backgroundColor = "orange";
            resetButton.innerHTML = "Refresh Page";
            resetButton.style.color = "black";
            resetButton.onclick = function (){window.location.reload();};
            
            textField2.appendChild(resetButton);
    
            //DISABLE run test button
            var runButt = document.getElementById("runTest");
            //runButt.disabled = true;
            
            //RUN POST TEST CALLBACK
            testScenario.RunPostTestCallback();
            this.mainWindowOpenCloseButtonElement.click();

            
        }

        window.sessionStorage.setItem("testBedsRun", true);
            
    }
    BuildTestCases(testResultsContainer, textFieldPanel,testResultsPanel,testCaseElement,testScenario,testCase){
        
            //Create Test Case Info:
            var propertyNames = ["TestName","TestType","TestData","TestResult","ExpectedResult","FunctionToTest","ErrorTypeFound","ExpectedErrorType","Time"];
            var testCaseElement = document.createElement('div');
            testCaseElement.style.display = "inline-block";
            testCaseElement.style.position = "relative";
            testCaseElement.class = "TestBed_" + testCase.Name + "_container";
            for (var property in testCase){
                if (Object.prototype.hasOwnProperty.call(testCase,property)){
                    for (var name of propertyNames){
                        if(property == name){
                            var textField = document.createElement('p');
                            textField.style.margin = "5px";
                            textField.style.fontFamily = "Helvetica";
                            
                            if (property == "TestName"){
                                textField.style.backgroundColor = "Black";
                                textField.style.color = "white";
                                textField.style.fontStyle = "bold";
                                textField.style.fontSize = "20px"
                                textField.style.width = "90%";
                                textField.style.borderRadius = "10px";
                                textField.style.padding = "20px";
                                textField.style.whiteSpace = "wrap";
                                textField.style.verticalAlign = "middle";
                                textField.style.position = "relative";
                                textField.style.marginBottom = "10px";

                            }else{
                                textField.style.padding = "5px";
                                textField.style.backgroundColor = "lightgrey";
                                textField.style.fontSize = "12px"
                                textField.style.color = "black";
                                textField.style.borderRadius = "15px";
                                textField.style.whiteSpace = "wrap";
                            }
                            
                            if (typeof(testCase[property]) == 'function'){
                                textField.innerHTML = `<b>${property.toUpperCase()}<b> : ${testCase[property].name}`;
                            }else{
                                textField.innerHTML = `<b>${property.toUpperCase()}<b> : ${testCase[property]}`;
                            }
                            testCaseElement.appendChild(textField);
                        }
                    }
                } 
            }
            //PASS FAIL BUTTON
            var passFailButton = document.createElement('div');
            var br= document.createElement('br');

            passFailButton.style.fontFamily = "Helvetica";
            passFailButton.style.fontWeight = "bold";
            passFailButton.style.fontSize = "20px";
            passFailButton.style.margin = "10px";
            passFailButton.style.padding = "30px";
            passFailButton.style.marginTop = "20px";
            passFailButton.style.textAlign = "center";
            passFailButton.style.width = "content";
            passFailButton.style.borderRadius = "15px";
            
            if (testCase.Passed == true){
                passFailButton.innerHTML = "PASSED";
                passFailButton.style.backgroundColor = "lightgreen";
                testCaseElement.style.backgroundColor = "green";
            }else{
                passFailButton.innerHTML = "FAILED";
                passFailButton.style.color = "white";
                passFailButton.style.borderStyle = "dashed";
                passFailButton.style.borderWidth = "2px";
                passFailButton.style.borderColor = "white";
                passFailButton.style.backgroundColor = "#DC143C";
                testCaseElement.style.backgroundColor = "red";
                testCaseElement.style.borderStyle = "dashed";
                testCaseElement.style.borderWidth = "2px";
                testCaseElement.style.borderColor = "white";
            }
            testCaseElement.style.margin = "20px";
            testCaseElement.style.padding = "20px";
            testCaseElement.style.borderRadius = "20px";
            testCaseElement.style.width = "33.33%";
            
            testCaseElement.appendChild(passFailButton);
            testCaseElement.appendChild(br);
            testResultsPanel.appendChild(testCaseElement);
            textFieldPanel.append(testResultsPanel);
    }
}