import { IReducible } from "../../operator-precedence/core";

//import { generateRandom } from "../AdditionSubtraction";
//import { generateRandom } from "../MultiplicationDivision";
//import { generateRandom } from '../MDAS'
//import { generateRandom } from '../ParentesisOnly'
import { generateRandom } from '../PMDAS'


let step: IReducible = generateRandom(1)

/**
 * The "---->" string
 * @param start 
 * @param end 
 */
function getRangeIndicator(start: number, end: number)
{
    return Array(end + 1).fill(" ").map((x, i) => i >= start && i < end ? "-" : i === end ? ">" : x).join("")
}

do
{
    console.log(step, "priority:", step.getPriorityPosition())
    const range = step.getFullOperationStringRange()
    console.log(getRangeIndicator(range.start, range.end))

    step = step.reduce() as IReducible
}
while (step.canReduce)

console.log(step.toString())