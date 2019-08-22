import { OperatorSign, IOperation, IOperator } from "./core";

export const Digits = "0123456789I"

function constructOperator(sign: OperatorSign, evaluater: (x: number, y: number) => number): IOperator
{
    return {
        sign,
        evaluate(left: number, right: number): number
        {
            return evaluater(left, right)
        },
        toString()
        {
            return this.sign.toString()
        }
    }
}

function constructOperation(operator: IOperator): (input: number) => IOperation
{
    return (input: number) => ({
        operator,
        value: input,
        updateValue(input: number)
        {
            return constructOperation(this.operator)(input)
        },
        evaluateWith(left: number): number
        {
            return operator.evaluate(left, this.value)
        },
        pipe(left: IOperation): IOperation
        {
            const result = operator.evaluate(left.value, this.value)
            const operation = constructOperation(left.operator)
            return operation(result)
        },
        toString()
        {
            return `${this.operator.sign} ${this.value}`
        }
    })
}

const adder = constructOperator(OperatorSign.Add, (x, y) => x + y);
const substracter = constructOperator(OperatorSign.Subtract, (x, y) => x - y);
const multiplier = constructOperator(OperatorSign.Multiply, (x, y) => x * y);
const divider = constructOperator(OperatorSign.Divide, (x, y) => x / y);

export const add = constructOperation(adder);
export const subtract = constructOperation(substracter);
export const multiply = constructOperation(multiplier);
export const divide = constructOperation(divider);
