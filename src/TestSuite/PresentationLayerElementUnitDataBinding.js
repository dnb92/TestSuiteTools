export class PresentationLayerElementUnitDataBinding{
    constructor(property){
        this.Property = property;
        this.Name = property.constructor.name;
        this.Value = this.Property;
    }

}