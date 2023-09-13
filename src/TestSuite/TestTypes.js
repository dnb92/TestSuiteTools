

//ENUM class -- for creating enums as javascript doesnt have native Enum class.
class Enum {
    
    static create(enums) {
        const enumObj = {};
        for (const enumValue of enums) {
          enumObj[enumValue] = enumValue;
        }
        return Object.freeze(enumObj);
    }
}

//TEST ENUMS - These TestType's will be extended in the future, only 'InputAndOuput' and 'ErrorFound' are implemented at the moment
// In the future the architure will change to allow test types to be daisy chained on the same data so different test types can be 
// performed on the same data.
var TestType = Enum.create(["InputOutput","ErrorFound","ExternalObjectChanged","NoErrors"]);
var TestScenarioMode = Enum.create(["AllTypes", "SingleType"]);

export function getTestType(){
    return TestType;
}

export function getTestScenarioMode(){
    return TestScenarioMode;
}