import { PresentationLayerElementUnit } from "../PresentationLayerElementUnit.js";

function ElementUnit_UnitTest(){
    var parent = document.createElement("div");
    parent.id= "parentDiv";
    parent.innerHTML = "PARENT";
    var elementUnit = new PresentationLayerElementUnit(parent,"testElementUnit","p","elementUnit1","unit");
    elementUnit.addAttributeChange("innerHTML","ELEMENT_UNIT: Test");
    elementUnit.renderElement();
    document.body.appendChild(parent);
    elementUnit.addAttributeChange("innerHTML","ELEMENT_UNIT: Changed");
    console.log("Going Back to previous value");
    elementUnit.updateStyle();
    elementUnit.historyBack();
    elementUnit.renderElement();
}

document.body.onload = function (){ElementUnit_UnitTest()};
