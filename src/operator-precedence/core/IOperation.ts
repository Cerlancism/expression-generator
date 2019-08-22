import { IOperator } from "./IOperator"

export interface IOperation
{
    operator: IOperator
    readonly value: number
    updateValue(input: number): IOperation
    evaluateWith(left: number): number
    /**
     * Evaluates with a left and transforms to its operator
     * @param left 
     */
    pipe(left: IOperation): IOperation
}
