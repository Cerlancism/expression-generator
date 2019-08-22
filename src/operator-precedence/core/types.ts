import { IReducible } from "./IReducible";

/**
 * Start and end inclusive.
 */
export type SimpleRange = {
    start: number
    end: number
}

export type ExpressionNode = IReducible | number

export interface DeepArray<T> extends Array<T | DeepArray<T>> { }