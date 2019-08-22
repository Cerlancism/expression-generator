import { add, subtract, FlatStep } from '../operator-precedence'
import { ExpressionGenerator } from './core/';
import { getRandomInt2_99, getRandomInt, randomBool, pickRandomInArray } from './Helpers';
import { IReducible } from '../operator-precedence/core';

/*
    Specification:
    x, y, z, p, q, r, s [2 to 99]

    x – y + z, x > y
    x + y – z, x + y > z
    p + q + r – s, p + q + r > s
    p + q – r + s, p + q > r
    p – q + r + s, p > q
    p + q – r – s, p + q > r + s
    p – q – r + s, p > q + r
    p – q + r – s, p > q, r > s
*/

const generators: ExpressionGenerator[] = [
    () =>
    {
        const x = getRandomInt(2, 100)
        const y = getRandomInt(2, x)
        const z = getRandomInt2_99()
        return new FlatStep(x, subtract(y), add(z)) // x – y + z, x > y
    },
    () =>
    {
        const z = getRandomInt(3, 100)
        const x = getRandomInt(z, 100)
        const y = getRandomInt(x - z + 1, 100)
        return new FlatStep(x, add(y), subtract(z)) // x + y – z, x + y > z
    },
    () =>
    {
        const p = getRandomInt(2, 97)
        const q = getRandomInt(2, 97 - p)
        const r = getRandomInt(2, 97 - p - q)
        const s = getRandomInt(2, p + q + r)
        return new FlatStep(p, add(q), add(r), subtract(s)) // p + q + r – s, p + q + r > s
    },
    () =>
    {
        const r = getRandomInt(3, 100)
        const p = getRandomInt(r / 2 + 1, 100)
        const q = getRandomInt(p, 100)
        const s = getRandomInt(2, 100)
        return new FlatStep(p, add(q), subtract(r), add(s)) // p + q – r + s, p + q > r
    },
    () =>
    {
        const p = getRandomInt(2, 100)
        const q = getRandomInt(2, p)
        const r = getRandomInt2_99()
        const s = getRandomInt2_99()
        return new FlatStep(p, subtract(q), add(r), add(s)) // p – q + r + s, p > q
    },
    () =>
    {
        const p = getRandomInt2_99()
        const q = getRandomInt2_99()
        const temp = randomBool() ? p : q
        const r = getRandomInt(2, temp - 1)
        const s = getRandomInt(2, (temp === p ? q : p) - 1)
        return new FlatStep(p, add(q), subtract(r), subtract(s)) // p + q – r – s, p + q > r + s
    },
    () =>
    {
        const p = getRandomInt(3, 100)
        const q = getRandomInt(2, p - 1)
        const r = getRandomInt(2, p - q)
        const s = getRandomInt2_99()
        return new FlatStep(p, subtract(q), subtract(r), add(s)) // p – q – r + s, p > q + r
    },
    () =>
    {
        const p = getRandomInt(2, 100)
        const q = getRandomInt(2, p)
        const r = getRandomInt(2, 100)
        const s = getRandomInt(2, r)
        return new FlatStep(p, subtract(q), add(r), subtract(s)) // p – q + r – s, p > q, r > s
    }
]

export function generateRandom(questionNumber: number)
{
    return generators[questionNumber - 1]()
}

export function randomAS2Set()
{
    if (randomBool()) // Add
    {
        return new FlatStep(getRandomInt2_99(), add(getRandomInt2_99()))
    }
    else // Subtract
    {
        const a = getRandomInt(2, 99)
        const b = getRandomInt(2, a)
        return new FlatStep(a, subtract(b))
    }
}

export function randomAS3Set()
{
    if (randomBool()) // Add
    {
        const precursor = randomAS2Set()
        return new FlatStep(precursor.head, ...precursor.operations, add(getRandomInt2_99()))
    }
    else // Subtract
    {
        let operation: IReducible
        do
        {
            const precursor = randomAS2Set()
            operation = new FlatStep(precursor.head, ...precursor.operations, subtract(getRandomInt(2, 97)))
        }
        while (operation.result() < 0)
        return operation
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