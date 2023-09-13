

export class PresentationLayerElementPageUnit{
    constructor(pageModuleParentName,nameOfPageElement, elementTemplate){//basically you only add templates to this object then then gets attached to a pageTemplate
        this.Name = nameOfPageElement;
        this.Parent = pageModuleParentName;
        if (elementTemplate.constructor.name == this.constructor.name){
            this.PageElement = elementTemplate;
        }else{
            throw new Error("WRONG_TYPE: PresentationLayerPageElementTemplate only accpets type of PresentationLayerElementTemplate object");
        }
        
    }
}

//so basically a pageTemplate is a way of storing page formats. PageElementTemplates are a way of storing future state changes on the page.
//so you would store PageElementTemplates
//Basically this is the top of the inheritance chain before being added to the page.
//if you add multiple of these to a page the will always link to the same module on the page.
//A UNIT HOLDS A SINGLE ELEMENT