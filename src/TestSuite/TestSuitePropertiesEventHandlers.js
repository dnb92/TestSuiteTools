import { TestSuiteToolsEventHandler } from "./TestSuiteToolsEventHandler.js";

export class TestSuitePropertiesEventHandlers{
    constructor(objectToCreateEventHandlersFrom){
        this.baseObject = objectToCreateEventHandlersFrom;
        this.tspEventHandlers = [];
    }

    #propertyNameOfEventHandlerMatchesPropertyNameOnObject(tstEventHandler){
        for (var property in this.baseObject){
            if(Object.prototype.hasOwnProperty.call(this.baseObject, property)){
                if(property == tstEventHandler.PropertyName){
                    return true;
                }
            }
        }
        return false;
    }

    AddExistingTstEventHandler(tstEventHandler){
        if(this.#propertyNameOfEventHandlerMatchesPropertyNameOnObject(tstEventHandler) == true){
            this.tspEventHandlers.push(tstEventHandler);
        }
    }

    AddNewTstEventHandler(eventHandler, propertyNameToApplyEventOn){
        if(typeof(eventHandler) == "function"){
            if (typeof(propertyNameToApplyEventOn) == "string"){
                var newTst = new TestSuiteToolsEventHandler(eventHandler,propertyNameToApplyEventOn);
                var checkIfPropertyExists = this.#propertyNameOfEventHandlerMatchesPropertyNameOnObject(newTst)
                if (checkIfPropertyExists == true){
                    this.tspEventHandlers.push(newTst);
                }else{
                    return Error(`PROPERTY_DOES_NOT_EXIST: ${this.baseObject.name}`);
                }
                
            }else{
                return Error("PROPERTY_NAME_ARGUMENT_NOT_STRING");
            }
        }else{
            return Error("EVENT_HANDLER_ARGUMENT_NOT_FUNCTION");
        }
        
    }

}