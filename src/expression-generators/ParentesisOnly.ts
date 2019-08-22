import { pickRandomInArray, getRandomInt2_99, getRandomInt2_100, getRandomInt2_10, randomBool } from "./Helpers";
import { add, subtract, multiply, divide, CompositeStep, FlatStep } from "../operator-precedence";
import { IOperation, DeepArray, IReducible } from "../operator-precedence/core";
import { inValueBound } from "./MDAS";

export const BracketLayouts = [
    [1, 2], // a + (b + c)
    [2, 1], // (a + b) + c,
    [2, 1, 1], // (a + b) + c + d
    [1, 2, 1],
    [1, 1, 2],
    [2, 2],
    [3, 1], // (a + b + c) + d
    [1, 3]
]

// Must contain parentesis, operations can either only addition with subtraction or multiplication with division

const randomAddSubtract = () => pickRandomInArray([add, subtract])
const randomMultiplyDivide = () => pickRandomInArray([multiply, divide])
const getRng = (input: () => (input: number) => IOperation) => input === randomAddSubtract ? getRandomInt2_99 : getRandomInt2_10

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

/**
 * Messy alert.
 */
export function generateRandom(questionNumber: number)
{
    let operations: DeepArray<IOperation>
    const layout = BracketLayouts[questionNumber - 1]
    const generatorOperationSet = pickRandomInArray([randomAddSubtract, randomMultiplyDivide])

    let generatedSigns: ((input: number) => IOperation)[]
    do
    {
        generatedSigns = Array(layout.reduce((x, y) => x + y, 0) - 1).fill(0).map(() => generatorOperationSet())
    }
    while (generatedSigns.every(x => x(1).operator.sign === (generatedSigns[0](1).operator.sign))) // Very inefficient, but prevent all randomised operations be the same type

    const signs = [add, ...generatedSigns]
    const rng = getRng(generatorOperationSet)

    let threshold = 0

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
                        operations.push(signsCopy.shift()(rng()))
                        break;
                    }

                case 2:
                    {
                        const a = signsCopy.shift()(rng())
                        const b = signsCopy.shift()(rng())
                        operations.push([a, b])
                        break;
                    }

                case 3:
                    {
                        const a = signsCopy.shift()(rng())
                        const b = signsCopy.shift()(rng())
                        const c = signsCopy.shift()(rng())
                        operations.push([a, b, c])
                        break;
                    }
            }
        }
        threshold++

        if (threshold === 100)
        {
            console.warn("Rejected", new CompositeStep(operations).toString())
            return generateRandom(questionNumber)
        }
    }
    while (checkReject(operations.slice()));

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