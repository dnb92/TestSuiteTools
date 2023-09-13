export class TestSuiteToolsEventHandler{

    constructor(eventHandler, propertyName){
        if(typeof(eventHandler) == 'function'){
            if (typeof(propertyName) == "string"){
                this.EventHandler = eventHandler;
                this.PropertyName = propertyName;
            }else{
                return Error("PROPERTY_NAME_IS_NOT_A_STRING");
            }
            
        }else{
            return Error("EVENT_HANDLER_NOT_AN_EVENT_HANDLER");
        }
    }

    
}