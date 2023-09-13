export class PresentationLayerElementUnitEventHandler{
    constuctor(eventHandlerName, elementUnit, eventHandler,eventType, eventDataBinding, attributeNameToBindTo){
        this.Name = eventHandlerName;
        this.ElementUnit = elementUnit;
        this.EventHandler = eventHandler;
        this.EventType = eventType;
        this.AttributeName = attributeNameToBindTo;
        this.DataBinding = eventDataBinding; // retrives this data value and changes the element with it;
    }

    getEventHandler(){
        var newEventHandler = function (){this.EventHandler(); this.ElementUnit.addAttributeChange(this.AttributeName, this.DataBinding.Value, true)}
        return newEventHandler;
    }

    createCopyWithNewBindings(newDataBinding, newAttributeNameToBindTo = false){
        var copyOfEventHandlerWithNewBindings;
        if (newAttributeNameToBindTo == false){
            copyOfEventHandlerWithNewBindings = new PresentationLayerElementUnitEventHandler(this.Name,this.ElementUnit,this.EventHandler,newDataBinding,this.AttributeName);
    
        }else{
            copyOfEventHandlerWithNewBindings = new PresentationLayerElementUnitEventHandler(this.Name,this.ElementUnit,this.EventHandler,newDataBinding,newAttributeNameToBindTo);
        }
        return copyOfEventHandlerWithNewBindings;
    }


}