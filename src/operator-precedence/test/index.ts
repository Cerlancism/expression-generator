import { IReducible, IOperation, DeepArray } from "../core";
import { add, subtract, multiply, divide } from "../ArithmeticUnits";
import { CompositeStep } from "../CompositeStep";

const flatE = new CompositeStep([add(1), add(2), subtract(3), multiply(4)])
const composite1E = new CompositeStep([[add(10), subtract(3)], [subtract(20), subtract(4)], [divide(2), add(5)]])
const composite2E = new CompositeStep([[add(10), multiply(3)], [[subtract(20), subtract(4)], [add(2), add(5)]]])
const composite3E = new CompositeStep([[[add(10), [add(2), subtract(1)]], multiply(3)], [[subtract(20), subtract(4)], [divide(2), add(6), divide(2)]], multiply(2)])
const composite4E = new CompositeStep([[add(1), add(2), add(3)], add(4)])
const composite5E = new CompositeStep([add(4), [add(1), add(2), add(3)]])

const compositeXE = new CompositeStep(Array(8).fill(0).map((x, i) => generateFlat(x + i + 1)) as DeepArray<IOperation>)

const expression: IReducible = compositeXE

function generateFlat(input: number): (IOperation | IOperation[])[]
{
    const random = Math.ceil(Math.random() * 5)
    const output = [Math.random() <= 0.5 ? Math.random() <= 0.5 ? add(random) : subtract(random) : Math.random() <= 0.5 ? multiply(random) : divide(random)]

    if (random < 3)
    {
        return [...output, ...Array(random).fill(input).map((x, i) => Math.random() <= 0.5 ? Math.random() <= 0.5 ? add(x + i) : subtract(x + i) : Math.random() <= 0.5 ? multiply(x + i) : divide(x + i))]
    }
    else
    {
        return (Math.random() >= 0.5 ? [...output, generateFlat(input)] : [generateFlat(input), ...output]) as (IOperation | IOperation[])[]
    }
}

/**
 * The "---->" string
 * @param start 
 * @param end 
 */
function getRangeIndicator(start: number, end: number)
{
    return Array(end + 1).fill(" ").map((x, i) => i >= start && i < end ? "-" : i === end ? ">" : x).join("")
}


let step = expression

do
{
    console.log(step, "priority:", step.getPriorityPosition())
    const range = step.getOperationStringRange(step.getPriorityPosition())
    console.log(getRangeIndicator(range.start, range.end))

    step = step.reduce() as IReducible
}
while (step.canReduce)

console.log(step.toString())