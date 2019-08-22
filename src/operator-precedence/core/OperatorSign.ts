export enum OperatorSign
{
    Add = "+",
    Subtract = "-",
    Multiply = "*",
    Divide = "/"
}

export function replaceSigns(input: string[])
{
    return input.map(x =>
    {
        switch (x)
        {
            case OperatorSign.Multiply:
                return "×"
            case OperatorSign.Divide:
                return "÷"
            default:
                return x
        }
    })
}
