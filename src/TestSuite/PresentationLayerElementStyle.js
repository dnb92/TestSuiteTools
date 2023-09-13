export class PresentationLayerElementStyle{
    constructor(styleName,elementType){
        this.ElementType = elementType;
        this.StyleName = styleName;
        this.AttributeStyles = null;
    }

    //possibly add check that the element type will match attributeChange
    addAttributeStyle(attributeChange){
        if (this.AttributeStyles == null){
            this.AttributeStyles = [];
            this.AttributeStyles.push(attributeChange);
        }else{
            this.AttributeStyles.push(attributeChange);
        }
    }

    applyStyle(){
        for (var attributeStyle of this.AttributeStyles){
            attributeStyle.applyAttributeChange();
        }
    }
}