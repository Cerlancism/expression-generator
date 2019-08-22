import { IReducible, IOperation, OperatorSign, SimpleRange } from "./core";
import { Digits, add } from "./ArithmeticUnits";

export const prioritySigns = [OperatorSign.Multiply, OperatorSign.Divide]

function sameOperatingPrecendence(reference: OperatorSign, input: OperatorSign)
{
    const AS = [OperatorSign.Add, OperatorSign.Subtract]
    const MD = [OperatorSign.Multiply, OperatorSign.Divide]

    return [reference, input].every(x => AS.some(y => y === x)) || [reference, input].every(x => MD.some(y => y === x))
}

export class FlatStep implements IReducible
{
    public readonly operations: IOperation[]
    public readonly canReduce: boolean

    constructor(public readonly head: number, ...operations: IOperation[])
    {
        this.operations = operations;

        this.canReduce = operations.length === 0 ? false : true
    }

    getPriorityPosition()
    {
        if (this.operations.length <= 1)
        {
            return 0
        }

        let [priority, ..._] = this.operations.filter(x => prioritySigns.some(y => x.operator.sign === y));

        if (priority)
        {
            for (let index = 0; index < this.operations.length; index++)
            {
                const element = this.operations[index];
                if (priority === element)
                {
                    return index
                }
            }
        }
        else
        {
            return 0
        }
    }

    getOperationStringRange(operationIndex: number): SimpleRange
    {
        const string = this.toString()
        let output: SimpleRange = { start: undefined, end: undefined }
        const against = this.operations.slice()
        let comparer = add(this.head)
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

    getFullOperationStringRange(): SimpleRange
    {
        const signs = this.operations.map(x => x.operator.sign)

        if (signs.every(x => sameOperatingPrecendence(signs[0], x)))
        {
            return { start: 0, end: this.toString().length - 1 }
        }

        const priorityRange = this.collectRange(this.getPriorityPosition())

        return priorityRange
    }

    getPriorityRanges()
    {
        const priorities = this.operations.map((x, i) => 
        {
            if (prioritySigns.some(y => x.operator.sign === y))
            {
                return { index: i, operation: x }
            }
            else
            {
                return undefined
            }
        })
            .filter(x => x)
            .map(x => this.collectRange(x.index))

        return priorities
    }

    private collectRange(start: number)
    {
        const priorityRange = this.getOperationStringRange(start)

        const string = this.toString()
        let tempEnd = priorityRange.end

        for (let index = priorityRange.end + 1; index < string.length; index++)
        {
            const element = string[index];
            // if (element === OperatorSign.Multiply || element === OperatorSign.Divide)
            // {
            //     if (hasAS)
            //     {
            //         return priorityRange
            //     }
            // }
            if (element === OperatorSign.Add || element === OperatorSign.Subtract)
            {
                // if (priorityRange.start !== 0)
                // {
                //     return priorityRange
                // }
                // hasAS = true
                priorityRange.end = tempEnd - 1
                return priorityRange
            }
            tempEnd = index
        }

        priorityRange.end = tempEnd

        return priorityRange
    }

    getAtPosition(operationIndex: number)
    {
        if (operationIndex === 0)
        {
            return add(this.head)
        }
        else
        {
            return this.operations[operationIndex - 1]
        }
    }

    reduce()
    {
        if (this.operations.length === 1)
        {
            return this.operations[0].evaluateWith(this.head);
        }

        let [priority, ..._] = this.operations.filter(x => prioritySigns.some(y => x.operator.sign === y));

        if (priority)
        {
            const indexTarget = this.operations.indexOf(priority);
            const rest = this.operations.slice()
            rest.splice(indexTarget, 1);
            if (indexTarget !== 0)
            {
                const left = this.operations[indexTarget - 1];
                rest[indexTarget - 1] = priority.pipe(left);
                return new FlatStep(this.head, ...rest);
            }
        }
        const [target, ...rest] = this.operations.slice();
        const left = this.head
        const result = target.evaluateWith(left)
        return new FlatStep(result, ...rest)
    }

    hasSomeConditionInValues(predicate: (x: number) => boolean)
    {
        return predicate(this.head) || this.operations.some(x => predicate(x.value))
    }

    result()
    {
        return eval(this.toString())
    }

    toString()
    {
        return `${this.head} ${this.operations.map(x => x.toString()).join(" ")}`;
    }
}
