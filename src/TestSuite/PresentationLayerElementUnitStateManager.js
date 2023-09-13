import { PresentationLayerElementUnitDataBinding } from "./PresentationLayerElementUnitDataBinding.js";
import { PresentationLayerElementUnitEventHandler } from "./PresentationLayerElementUnitEventHandler.js";

export class PresentationLayerElementUnitStateManager{
    //this is what is stored on elementGroup when we want to create a new element this element state wraps it so that attributes are created automatically by the attributeValueDictionary provided.
    constructor(elementUnitName, elementType, dataToCreateDataBindingsOff, attributeDictionary, elementGroup, eventHandler = false){
        this.ElementGroup = elementGroup;
        this.ElementUnit = null;
        this.ElementUnitName = elementUnitName;
        this.ElementType = elementType;
        this.Data = dataToCreateDataBindingsOff;
        this.DataBindings = null;
        this.AttributeDictionary = attributeDictionary;
        this.ElementUnitEventHandlers = [];
        if (eventHandler != false){
            this.CurrentEventHandler = eventHandler;
        }else{
            this.CurrentEventHandler = null;
        }

        this.createDataBindings();
        this.createElementUnit();

    }

    changeEventHandler(eventHandlerName, eventHandler, eventType, nameOfDataBinding, attributeNameToBindTo, overwrite = false){
        var eventDataBinding = null;
        for (var binding in this.DataBindings){
            if (binding.Name == nameOfDataBinding){
                eventDataBinding == binding;
            }
        }
        if (eventDataBinding != null){
            var boundEventHandler = new PresentationLayerElementUnitEventHandler(eventHandlerName, this.ElementUnit, eventHandler, eventType, eventDataBinding, attributeNameToBindTo).getEventHandler();
            this.ElementUnitEventHandlers.push(boundEventHandler);
            this.ElementGroup.changeEventListener(this.ElementUnitName,boundEventHandler,overwrite);
        }else{
            throw new Error(`FAILED_TO_FIND_DATABINDING: while running changeEventHandler on ${this.constructor.name} of name: ${this.ElementUnitName}`)
        }
        
    }

    createDataBindings(){
       
            for (var property in this.Data){
                if (Object.prototype.hasOwnProperty.call(this.Data, property)){
                    var newDataBinding = new PresentationLayerElementUnitDataBinding(property);
                    this.DataBindings = [];
                    this.DataBindings.push(newDataBinding);
                }
            }
        
        
    }

    createElementUnit(){
        this.ElementGroup.addElementUnit(this.ElementUnitName, this.ElementType);
        this.ElementUnit = this.ElementGroup.ElementUnits[(this.ElementGroup.ElementUnits.length - 1)];
        for(var attribute in this.AttributeDictionary){
            this.ElementGroup.changeStyleAttribute(this.ElementUnitName,attribute.name,attribute.value);
        }
    }


}