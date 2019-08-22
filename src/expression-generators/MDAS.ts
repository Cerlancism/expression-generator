import { ExpressionGenerator } from "./core";
import { pickRandomInArray, randomBool, getRandomInt2_99, getRandomInt2_10, getRandomFactor, getRandomMultiple } from "./Helpers";
import { FlatStep, add, subtract, multiply, divide, prioritySigns } from "../operator-precedence";
import { randomAS2Set } from "./AdditionSubtraction";
import { randomMD2Set } from "./MultiplicationDivision";
import { IReducible, IOperation, OperatorSign } from "../operator-precedence/core";

export function inValueBound(x: number)
{
    return x % 1 === 0 && x > 0 && x <= 100
}

const generatorsSet2 = [randomAS2Set, randomMD2Set]
const generatorsASOperations = [add, subtract]
const generatorsMDOperations = [multiply, divide]

const generators: ExpressionGenerator[] = [
    () => // 3 numbers
    {
        let operation: IReducible
        let precursor = pickRandomInArray(generatorsSet2)()

        let postOperation: (input: number) => IOperation
        let rng: () => number

        if (randomBool()) // AS
        {
            postOperation = pickRandomInArray(generatorsASOperations)
            rng = getRandomInt2_99
        }
        else // MD
        {
            postOperation = pickRandomInArray(generatorsMDOperations)
            rng = getRandomInt2_10
        }

        let result: number
        do
        {
            if (postOperation === divide && prioritySigns.every(x => x !== precursor.operations[0].operator.sign)) // Dividing at End
            {
                const divider = getRandomInt2_10()
                precursor.operations[0] = precursor.operations[0].updateValue(getRandomMultiple(divider, 100))
                operation = new FlatStep(precursor.head, ...precursor.operations, postOperation(divider))
                result = operation.result()
            }
            else
            {
                operation = new FlatStep(precursor.head, ...precursor.operations, postOperation(rng()))
                result = operation.result()
            }
            precursor = pickRandomInArray(generatorsSet2)()
        }
        while (result < 0 || result % 1 !== 0);

        return operation
    },
    () => // 4 numbers
    {
        let precursor = generators[0]() as FlatStep
        if (randomBool())
        {
            if (randomBool()) // Add
            {
                return new FlatStep(precursor.head, ...precursor.operations, add(getRandomInt2_99()))
            }
            else // Multiply
            {
                let output: IReducible
                do
                {
                    precursor = generators[0]() as FlatStep
                    output = new FlatStep(precursor.head, ...precursor.operations, multiply(getRandomInt2_10()))
                }
                while (output.result() < 0);
                return output
            }
        }
        else
        {
            if (randomBool()) // Subtract
            {
                let output: IReducible
                do
                {
                    precursor = generators[0]() as FlatStep
                    output = new FlatStep(precursor.head, ...precursor.operations, subtract(getRandomInt2_99()))
                }
                while (output.result() < 0);
                return output
            }
            else // Divide
            {
                let output: IReducible
                let result: number
                do
                {
                    precursor = generators[0]() as FlatStep
                    let divident = precursor.operations[precursor.operations.length - 1].value
                    output = new FlatStep(precursor.head, ...precursor.operations, divide(getRandomFactor(divident)))
                    result = output.result()
                }
                while (result < 0 || result % 1 !== 0);
                return output
            }
        }
    }
]

export function generateRandom(questionNumber: number)
{
    const generator = questionNumber <= 3 ? generators[0] : generators[1]
    let output: FlatStep
    let operationSigns: OperatorSign[]
    do
    {
        output = generator() as FlatStep
        operationSigns = output.operations.map(x => x.operator.sign)
    }
    while (operationSigns.every(x => x === OperatorSign.Add || x === OperatorSign.Subtract) || operationSigns.every(x => x === OperatorSign.Multiply || x === OperatorSign.Divide))
    return output
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

