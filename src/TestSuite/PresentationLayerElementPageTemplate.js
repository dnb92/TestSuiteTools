import { PresentationLayerElementTemplate } from "./PresentationLayerElementTemplate.js";

export class PresentationLayerPageTemplate extends PresentationLayerElementTemplate{
    constructor(nameOfTemplateGroup){
        this.PageModules = null; // order of execution for page templates;
        this.PageModuleDictionary; // contains all PageUnit states for each module
        this.Name = nameOfTemplateGroup;
    }

    addPageUnit(){
        //match Parent to element id of PageModules
    }

    removePageUnit(){
        //match Parent to element id of PageModules
    }

    

    addPageModule(){
        //page module is the lowest level div container that makes the macro page structure
    }

    removePageModule(){
        //removes page module
    }


    movePageModule(moduleName,positionIdOrPageModuleElementId){
        //
    }

}
