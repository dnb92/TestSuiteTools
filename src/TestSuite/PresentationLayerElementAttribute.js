export class PresentationLayerElementAttribute{
    set Value(value) {
        this.ValueHistory.push(value);
        this._Value = value;  
    }

    get Value(){
        return this._Value;
    }
    
    constructor(parent,element,attribute, value){
        this.Parent = parent;
        this.Element = element;
        this.Property = attribute;
        this.ValueHistory = [];
        this._Value = null;
        this.Value = value;
        //this.Value(value);
    }

    applyAttributeChange(){
        this.Element[this.Property] = this.Value;
        console.log(this.Element[this.Property]);
        
    }
}