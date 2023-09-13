
import { PresentationLayerElementState } from "./PresentationLayerElementUnitState.js";


export class PresentationLayerElementTemplate{
    constructor(elementTemplateName, elementGroup, dataObject ){
        this.Name = elementTemplateName;
        this.ElementGroup = elementGroup;
        this.ElementGroupState = []; //list of state change objects
        this.Data = dataObject;
    }

    

    addNewElement(elementUnitName,elementType,attributeDictionary,dataToBindTo = false){
        if (dataToBindTo = false){
            var newElementState = new PresentationLayerElementState(elementUnitName,elementType,dataToBindTo,attributeDictionary, this.ElementGroup);
        }else{
            var newElementState = new PresentationLayerElementState(elementUnitName,elementType,this.dataToBindTo,attributeDictionary, this.ElementGroup);
        }
        
    }
        

    
}