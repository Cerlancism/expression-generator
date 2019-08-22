import { ExpressionNode, SimpleRange } from "./types";
import { IOperation } from ".";

export interface IReducible
{
    readonly canReduce?: boolean;
    reduce(): ExpressionNode;

    result(): number

    /**
     * Find the absolute operation postion in the expression.
     */
    getPriorityPosition(): number

    /**
     * The absolulte string postion range for the reducing step to take place.
     * @param operationIndex The operation position in the expression.
     */
    getOperationStringRange(operationIndex: number): SimpleRange

    getFullOperationStringRange(): SimpleRange

    getAtPosition(operationIndex: number): IOperation
}
