import { FlatStep, add, subtract, divide, multiply, CompositeStep } from "../operator-precedence";
import { pickRandomInArray, getRandomInt2_99, getRandomInt2_10 } from "./Helpers";
import { BracketLayouts } from "./ParentesisOnly";
import { DeepArray, IOperation, OperatorSign, IReducible } from "../operator-precedence/core";
import { inValueBound } from "./MDAS";

function getRng(sign: OperatorSign)
{
    switch (sign)
    {
        case OperatorSign.Add:
        case OperatorSign.Subtract:
            return getRandomInt2_99

        case OperatorSign.Multiply:
        case OperatorSign.Divide:
            return getRandomInt2_10
    }
}

function getSign(operation: (input: number) => IOperation)
{
    switch (operation)
    {
        case add:
            return OperatorSign.Add
        case subtract:
            return OperatorSign.Subtract
        case multiply:
            return OperatorSign.Multiply
        case divide:
            return OperatorSign.Divide
    }
}

function generatorOperationSet()
{
    return pickRandomInArray([add, subtract, multiply, divide])
}

function checkReject(input: DeepArray<IOperation>)
{
    const steps = new CompositeStep(input.slice())

    const result = steps.result()
    if (inValueBound(result))
    {
        let reduced = steps as IReducible
        do
        {
            reduced = reduced.reduce() as IReducible

            if (reduced instanceof CompositeStep)
            {
                if (reduced.canFlatten())
                {
                    reduced = reduced.tryFlatten() // Jump point to next if
                }
                else
                {
                    if (reduced.hasSomeConditionInValues(x => !inValueBound(x)))
                    {
                        return true
                    }
                }
            }

            if (reduced instanceof FlatStep)
            {
                if (reduced.hasSomeConditionInValues(x => !inValueBound(x)))
                {
                    return true
                }
            }

        }
        while (reduced.canReduce);

        return false
    }
    else
    {
        return true
    }
}

function generateOperation(operation: (input: number) => IOperation)
{
    return operation(getRng(getSign(operation))())
}

const ASSet = [OperatorSign.Add, OperatorSign.Subtract]
const MDSet = [OperatorSign.Multiply, OperatorSign.Divide]

function rejectSigns(operations: ((input: number) => IOperation)[])
{
    if (operations.every(x => getSign(x) === getSign(operations[0])))
    {
        return true
    }

    // Needs to invert this for flow consistency
    if (operations.some(x => ASSet.includes(getSign(x))) && operations.some(x => MDSet.includes(getSign(x))))
    {
        return false
    }

    return true
}

export function generateRandom(questionNumber: number)
{
    let operations: DeepArray<IOperation>
    const layout = BracketLayouts[questionNumber - 1]

    let generatedSigns: ((input: number) => IOperation)[]
    do
    {
        generatedSigns = Array(layout.reduce((x, y) => x + y, 0) - 1).fill(0).map(() => generatorOperationSet())
    }
    while (rejectSigns(generatedSigns)) // Very inefficient, prevent all randomised operations be the same

    const signs = [add, ...generatedSigns]

    do
    {
        operations = []
        const signsCopy = signs.slice()
        for (const iterator of layout)
        {
            switch (iterator) // Bracketed operations
            {
                case 1:
                    {
                        operations.push(generateOperation(signsCopy.shift()))
                        break;
                    }

                case 2:
                    {
                        const a = generateOperation(signsCopy.shift())
                        const b = generateOperation(signsCopy.shift())
                        operations.push([a, b])
                        break;
                    }

                case 3:
                    {
                        const a = generateOperation(signsCopy.shift())
                        const b = generateOperation(signsCopy.shift())
                        const c = generateOperation(signsCopy.shift())
                        operations.push([a, b, c])
                        break;
                    }
            }
        }

        //console.log("Iterate", new CompositeStep(operations.slice()), "=", new CompositeStep(operations.slice()).result())

    } while (checkReject(operations.slice()));

    return new CompositeStep(operations)
}

// let qq = 8

// while (qq--)
// {
//     let ii = 1000
//     console.log(`Q${qq + 1}-----------------------`)
//     while (ii--)
//     {
//         let ee = generateRandom(qq + 1).toString()
//         if (ii % 100 === 0)
//         {
//             console.log(ee.toString())
//         }
//     }
// }