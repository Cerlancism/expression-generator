import { OperatorSign } from "./OperatorSign"

export interface IOperator
{
    sign: OperatorSign
    evaluate(left: number, right: number): number
    toString(): string
}
