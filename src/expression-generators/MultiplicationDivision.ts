import { ExpressionGenerator } from "./core";
import { getRandomInt, getRandomInt2_10, getRandomMultiple, getRandomFactor, getRandomInt2_100, randomBool, pickRandomInArray } from "./Helpers";
import { FlatStep, multiply, divide } from "../operator-precedence";
import { IReducible } from "../operator-precedence/core";

/*
    Specification:
    a, b, c [1 to 10]
    p, q, r [1 to 100]

    a x b ÷ p, p factor of a x b
    p ÷ q x r, q factor of p
    a x b x c ÷ p, p factor of a x b x c
    a x b ÷ p x c, p factor of a x b
    p ÷ a x b x c, a factor of p
    a x b ÷ p ÷ q, p factor of a x b, q factor of a x b ÷ p
    p ÷ q ÷ a x b, q factor of p, a factor of p ÷ q
    p ÷ a x b ÷ q, a factor of p, q factor of p ÷ a x b.
*/

const generators: ExpressionGenerator[] = [
    () =>
    {
        const a = getRandomInt2_10()
        const b = getRandomInt2_10()
        const p = getRandomFactor(a * b)
        return new FlatStep(a, multiply(b), divide(p)) // a x b ÷ p, p factor of a x b
    },
    () =>
    {
        const p = getRandomMultiple(getRandomInt2_10(), 100)
        const q = getRandomFactor(p)
        const r = getRandomInt2_100()
        return new FlatStep(p, divide(q), multiply(r)) // p ÷ q x r, q factor of p
    },
    () =>
    {
        const a = getRandomInt2_10()
        const b = getRandomInt2_10()
        const c = getRandomInt(2, Math.floor(100 / (a * b)))
        const p = getRandomFactor(a * b * c)
        return new FlatStep(a, multiply(b), multiply(c), divide(p)) // a x b x c ÷ p, p factor of a x b x c
    },
    () =>
    {
        const a = getRandomInt2_10()
        const b = getRandomInt2_10()
        const p = getRandomFactor(a * b)
        const c = getRandomInt2_10()
        return new FlatStep(a, multiply(b), divide(p), multiply(c)) // a x b ÷ p x c, p factor of a x b
    },
    () =>
    {
        const a = getRandomInt2_10()
        const p = getRandomMultiple(a, 100)
        const b = getRandomInt2_10()
        const c = getRandomInt2_10()
        return new FlatStep(p, divide(a), multiply(b), multiply(c)) //p ÷ a x b x c, a factor of p
    },
    () =>
    {
        const a = getRandomInt2_10()
        const b = getRandomInt2_10()
        const p = getRandomFactor(a * b)
        const q = getRandomFactor(a * b / p)
        return new FlatStep(a, multiply(b), divide(p), divide(q)) // a x b ÷ p ÷ q, p factor of a x b, q factor of a x b ÷ p
    },
    () =>
    {
        const p = getRandomInt2_100()
        const q = getRandomFactor(p)
        const a = getRandomFactor(p / q)
        const b = getRandomInt2_10()
        return new FlatStep(p, divide(q), divide(a), multiply(b)) // p ÷ q ÷ a x b, q factor of p, a factor of p ÷ q
    },
    () =>
    {
        const a = getRandomInt2_10()
        const p = getRandomMultiple(a, 100)
        const temp = 100 / (p / a)
        const b = temp > 10 ? getRandomInt2_10() : getRandomInt(2, temp)
        const q = getRandomFactor(p / a * b)
        return new FlatStep(p, divide(a), multiply(b), divide(q)) // p ÷ a x b ÷ q, a factor of p, q factor of p ÷ a x b
    }
]

export function generateRandom(questionNumber: number)
{
    let output: FlatStep
    do
    {
        output = generators[questionNumber - 1]() as FlatStep
        if (output.hasSomeConditionInValues(x => isNaN(x)))
        {
            debugLog(output.toString(), "Reject due to contain NaN")
        }
    } while (output.hasSomeConditionInValues(x => isNaN(x)))
    return output
}

export function randomMD2Set()
{
    if (randomBool()) // Divide
    {
        const a = getRandomInt2_100()
        const b = getRandomFactor(a)
        return new FlatStep(a, divide(b))
    }
    else // Multiply
    {
        const a = getRandomInt2_10()
        const b = getRandomInt2_10()
        return new FlatStep(a, multiply(b))
    }
}

export function randomMD3Set()
{
    if (randomBool()) // Divide 
    {
        let precursor = randomMD2Set()
        let a = getRandomFactor(precursor.result())
        return new FlatStep(precursor.head, ...precursor.operations, divide(a))
    }
    else // Multiply 
    {
        let precursor = randomMD2Set()
        return new FlatStep(precursor.head, ...precursor.operations, multiply(getRandomInt2_10()))
    }
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