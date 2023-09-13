import { PresentationLayerElementUnit } from './PresentationLayerElementUnit.js';
import { PresentationLayerElementUnitStateManager } from './PresentationLayerElementUnitStateManager.js';

//Group for multiple elements can be wrapped in a new div. - need to add this functionality.
export class PresentationLayerElementGroup{
    constructor(parentToRenderTo, elementTemplateName, elementTemplateId, elementTemplateClassName){
        this.ParentToRenderTo = parentToRenderTo;
        this.TemplateName = elementTemplateName;
        this.TemplateId = elementTemplateId;
        this.TemplateClass = elementTemplateClassName;
        this.ElementUnits = null;
    }

    //leave first argument blank if you want to create a new element, otherwise add existing element with no other arguments. if this code doesnt work refactor into two functions, one for adding a new element unit and one for adding existing
    addElementUnit(addExistingElementUnit = null, elementUnitName=null, elementType=null){ //Element unit Name : for example 'heading'
        if (this.ElementUnits != null){
            for (var elementUnit in ElementUnits){ //check for elementUnits with the same name
                if(elementUnitName != null && elementUnit.Name == elementUnitName || elementUnitName == null && elementUnit.Name == addExistingElementUnit.Name){
                    throw new Error(`ERROR: ElementUnit with name [${elementUnitName}] already exists, please use unique name`);
                }
            }
            var elementUnit;
            if (addExistingElementUnit == null){
                if (elementType != null){
                    elementUnit = new PresentationLayerElementUnit(this.ParentToRenderTo,elementUnitName,elementType,`${this.TemplateName}_${elementName}`,`${this.TemplateClass} ${elementName}`);
                }else{
                    throw new Error(`ELEMENT_TYPE_NULL_ERROR: \nPresentationLayerElementTemplate: [${this.TemplateName}] Please enter element type`);
                }
            }else{
                elementUnit = addExistingElementUnit;
            }
            this.ElementUnits.push(elementUnit);

        }else{
            this.ElementUnits = [];
            var elementUnit;
            if (addExistingElementUnit == null){
                if (elementType != null){
                    elementUnit = new PresentationLayerElementUnit(this.ParentToRenderTo,elementUnitName,elementType,`${this.TemplateName}_${elementName}`,`${this.TemplateClass} ${elementName}`);
                }else{
                    throw new Error(`ELEMENT_TYPE_NULL_ERROR: \nPresentationLayerElementTemplate: [${this.TemplateName}] Please enter element type`);
                }
            }else{
                elementUnit = addExistingElementUnit;
            }
            this.ElementUnits.push(elementUnit);
        } 
    }

    removeElementUnit(elementUnitName){ 
        for (var elementUnit in ElementUnits){
            if(elementUnit.Name == elementUnitName){
                this.ElementUnits.splice(this.ElementUnits.indexof(elementUnit),1);
            }
        }
    }

    //ElementUnitName: for example 'black_heading' could be an element unit name, they are templates for single elements.
    changeStyleAttribute(elementUnitName, elementAttributeName, valueToChangeTo){
        try{
            var count = 0;
            var max = this.ElementUnits.length;
            for (var elementUnit in ElementUnits){
                count ++
                if (elementUnit.Name == elementUnitName){ 
                    for (var attributeStyle in elementUnit.Style.AttributeStyles){
                        if (attributeStyle.Property == elementAttributeName){
                            var previousValue = attributeStyle.Value;
                            attributeStyle.Value = valueToChangeTo;
                            elementUnit.Style.applyStyle();
                            console.log(`ATTRIBUTE_STYLE_CHANGED: \nPresentationLayerTemplate: [${this.TemplateName}] \nElementUnitName: [${elementUnitName}] \nAttributeName: [${elementAttributeName}] \nPreviousValue: [${previousValue}] \nNewValue: [${valueToChangeTo}]`)
                        }else{
                            throw new Error(`NO_ATTRIBUTE_FOUND: No attribute of type ${elementAttributeName} found in ${attributeStyle.Name}`)
                        }
                    }
                    
                }
            }
            if(count > max){
                throw new Error(`NO_ELEMENT_UNITS_FOUND: No element units of name ${elementUnitName} found in PresentationLayerTemplate: [${this.TemplateName}]`);
            }


        }catch(e){
            throw new Error(`ERROR_OCCURED: PresentationLayerElementTemplate: [${this.TemplateName}] Error Message: ${e.message}`);
        }
        
    }

    changeEventListener(elementUnitName,eventHandler,eventType, overwrite = false){
        for (var elementUnit in this.ElementUnits){
            if(elementUnit.Name == elementUnitName){
                elementUnit.changeEventListener(overwrite,eventHandler,eventType);
            }
        }
    }

    

    render(changeParent = null){
        if (changeParent == null){
            for (var elementUnit in this.ElementUnits){
                elementUnit.renderElement();
            }
        }else{
            for (var elementUnit in this.ElementUnits){
                elementUnit.renderElement(changeParent);
            }
        }
        
    }



    
}