import { IReducible, IOperation, DeepArray, SimpleRange } from "./core/"
import { FlatStep } from "./FlatStep"
import { Digits } from "./ArithmeticUnits";

function flatten<T>(items: DeepArray<T>): T[]
{
    const flat: T[] = []
    items.forEach(item =>
    {
        if (Array.isArray(item))
        {
            flat.push(...flatten(item))
        }
        else
        {
            flat.push(item)
        }
    })
    return flat
}

function deepString<T>(input: DeepArray<T>): string
{
    let output = ""
    for (const iterator of input)
    {
        if (Array.isArray(iterator))
        {
            output += "[" + deepString(iterator) + "], "
        }
        else
        {
            output += iterator + ", "
        }
    }
    return output
}

function deepLength<T>(input: DeepArray<T>): number
{
    let length = 0
    for (const iterator of input)
    {
        if (Array.isArray(iterator))
        {
            length += deepLength(iterator)
        }
        else
        {
            length += 1
        }
    }
    return length
}

/**
 * TODO: This implementation depends on too many recursive patterns, flatten them to iterative patterns.
 */
export class CompositeStep implements IReducible
{
    public readonly canReduce: boolean
    public readonly operations: DeepArray<IOperation>

    public readonly operationsFlat: IOperation[]

    constructor(operations: DeepArray<IOperation>)
    {
        this.operations = operations

        this.operationsFlat = flatten(this.operations)

        this.canReduce = operations.length <= 1 ? false : true
    }

    public static getDepth(input: IOperation | DeepArray<IOperation>)
    {
        const traverseRecursive = (target: IOperation | DeepArray<IOperation>): number =>
        {
            let depth = 0
            if (Array.isArray(target))
            {
                let candidate = 0
                for (const iterator of target)
                {
                    let result = depth + traverseRecursive(iterator) + 1
                    if (result > candidate)
                    {
                        candidate = result
                    }
                    candidate
                }
                depth = candidate
            }
            return depth
        }
        return traverseRecursive(input) - 1
    }

    public getAtPosition(operationIndex: number): IOperation
    {
        return this.operationsFlat[operationIndex]
    }

    private getDepth()
    {
        return CompositeStep.getDepth(this.operations)
    }

    hasSomeConditionInValues(predicate: (x: number) => boolean)
    {
        return this.operationsFlat.some(x => predicate(x.value))
    }

    getPriorityPosition(): number
    {
        const firstDepth = CompositeStep.getDepth(this.operations[0])

        if (this.getDepth() <= 1 && this.operations.every(x => CompositeStep.getDepth(x) === firstDepth))
        {
            if (this.getDepth() === 0)
            {
                const [head, ...rest] = this.operations as IOperation[]
                return new FlatStep(head.value, ...rest).getPriorityPosition()
            }
            else
            {
                return 0
            }
        }

        const operations = this.operations.slice() as DeepArray<IOperation>

        const deepFindRecursive = (targets: DeepArray<IOperation>): number =>
        {
            const maxDepth = targets.reduce((x, y) =>
            {
                const depth = CompositeStep.getDepth(y)
                return depth > x ? depth : x
            }, 0)

            let skip = 0
            for (const iterator of targets)
            {
                const depth = CompositeStep.getDepth(iterator)
                if (depth < maxDepth)
                {
                    if (depth > -1)
                    {
                        skip += deepLength(iterator as DeepArray<IOperation>)
                    }
                    else
                    {
                        skip += 1
                    }
                }
                else
                {
                    if (CompositeStep.getDepth(iterator) === 0)
                    {
                        const [head, ...rest] = iterator as IOperation[]
                        return skip + new FlatStep(head.value, ...rest).getPriorityPosition()
                    }
                    else
                    {
                        return skip + deepFindRecursive(iterator as DeepArray<IOperation>)
                    }
                }
            }
        }

        return deepFindRecursive(operations)
    }

    getOperationStringRange(operationIndex: number): SimpleRange
    {
        const string = this.toString()
        const output: SimpleRange = { start: undefined, end: undefined }
        const against = this.operationsFlat.slice()
        let comparer = against.shift()
        let currentOperationIndex = -1

        for (let index = 0; index < string.length; index++)
        {
            const element = string[index];
            if (Digits.includes(element))
            {
                const target = index
                const targetOperation = comparer
                index += comparer.value.toString().length - 1
                comparer = against.shift()
                currentOperationIndex++

                if (currentOperationIndex >= operationIndex)
                {
                    if (output.start === undefined)
                    {
                        output.start = target
                        continue
                    }
                    if (output.end === undefined)
                    {
                        output.end = target + targetOperation.value.toString().length - 1
                        return output
                    }
                }
            }
        }
        return output
    }

    getFullOperationStringRange()
    {
        const range = this.getOperationStringRange(this.getPriorityPosition())

        for (const iterator of this.operations)
        {
            if (Array.isArray(iterator) && iterator.every(x => !Array.isArray(x)))
            {
                const [head, ...rest] = iterator as IOperation[]
                const flatten = new FlatStep(head.value, ...rest)
                const flatOperationRange = flatten.getFullOperationStringRange()
                range.end = range.start + (flatOperationRange.end - flatOperationRange.start)
                return range
            }
        }

        return range
    }

    /**
     * Single bracket depth only.
     */
    getBracketRanges()
    {
        if (this.getDepth() > 1)
        {
            throw "getBracketRanges() does not support depth > 1 as of yet."
        }
        const string = this.toString()
        const indexes = string.split("").reduce((x, y, i) => y === "(" || y === ")" ? x.push(i) && x : x, [] as number[])
        let ranges: SimpleRange[] = []
        while (indexes.length)
        {
            ranges.push({ start: indexes.shift(), end: indexes.shift() })
        }
        return ranges
    }

    canFlatten()
    {
        return this.operations.every(x => !Array.isArray(x))
    }

    tryFlatten()
    {
        if (this.canFlatten())
        {
            const [head, ...rest] = this.operations as IOperation[]
            return new FlatStep(head.value, ...rest)
        }
        else
        {
            return this
        }
    }

    reduce(): IReducible
    {
        if (this.canFlatten())
        {
            return this.tryFlatten().reduce() as IReducible
        }

        const subReduceRecursive = (operations: DeepArray<IOperation>) =>
        {
            let depth = -1
            let priority: DeepArray<IOperation>
            let priorityIndex = -1

            for (let index = 0; index < operations.length; index++)
            {
                const element = operations[index]
                let candidate = CompositeStep.getDepth(element)
                if (candidate > depth)
                {
                    depth = candidate
                    priority = element as DeepArray<IOperation>
                    priorityIndex = index
                }
            }

            if (CompositeStep.getDepth(operations) <= 1)
            {
                for (let index = 0; index < operations.length; index++)
                {
                    if (Array.isArray(operations[index]))
                    {
                        const [head, ...rest] = operations[index] as IOperation[]
                        const flat = new FlatStep(head.value, ...rest).reduce()
                        if (typeof (flat) === "number")
                        {
                            operations[index] = head.updateValue(flat)
                            return new CompositeStep(operations).tryFlatten()
                        }
                        else
                        {
                            operations[index] = [head.updateValue(flat.head), ...flat.operations]
                            return new CompositeStep(operations).tryFlatten()
                        }
                    }
                }
            }
            else
            {
                const reduced = subReduceRecursive(priority)
                operations[priorityIndex] = reduced.operations as IOperation[]
                return new CompositeStep(operations).tryFlatten()
            }
        }

        return subReduceRecursive(this.operations.slice())
    }

    result()
    {
        return eval(this.toString())
    }

    toString()
    {
        const getInnerMostFirst = (steps: DeepArray<IOperation>): IOperation =>
        {
            const target = steps[0]
            if (Array.isArray(target))
            {
                return getInnerMostFirst(target)
            }
            else
            {
                return target
            }
        }

        const getBracketedStepStringRecursive = (steps: DeepArray<IOperation>, braceSign?: boolean): string =>
        {
            if (Array.isArray(steps))
            {
                return (braceSign ? getInnerMostFirst(steps).operator.sign + " " : "") + "(" + steps.map((x, i) =>
                {
                    if (i === 0 && !Array.isArray(x))
                    {
                        return `${x.value}`
                    }
                    else if (i === 0 && Array.isArray(x))
                    {
                        return `${getBracketedStepStringRecursive(x)}`
                    }
                    else if (Array.isArray(x))
                    {
                        return getBracketedStepStringRecursive(x, true)
                    }
                    else
                    {
                        return x.toString()
                    }
                }).join(" ") + ")"
            }
            else
            {
                return (steps as IOperation).toString()
            }
        }
        return this.operations.map(x => getBracketedStepStringRecursive(x as DeepArray<IOperation>, true)).join(" ").substring(2)
    }
}
