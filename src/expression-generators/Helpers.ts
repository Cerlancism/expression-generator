/**
 * Generate a random integer.
 * @param min lower bound inclusive.
 * @param max uppper bound exclusive.
 */
export function getRandomInt(min: number, max: number)
{
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

export function getRandomInt2_99()
{
    return getRandomInt(2, 100)
}

export function getRandomInt2_10()
{
    return getRandomInt(2, 11)
}

export function getRandomInt2_100()
{
    return getRandomInt(2, 101)
}

export function getRandomMultiple(base: number, limit: number)
{
    if (base === 0)
    {
        base = 1
        console.warn("Base Multiple is 0")
    }
    const generator = () => generateMultiples(base, limit)
    return pickRandomIterative(generator, 0, limit)
}

export function* generateMultiples(base: number, limit: number)
{
    let next = base;
    let counter = 1;
    do
    {
        yield next;
        counter++;
        next = base * counter;
    }
    while (next <= limit)
}

/**
 * Low effort algorithm to randomly pick a possible factor
 * @param target number to factorise
 */
export function getRandomFactor(target: number)
{
    // const end = target % 2 === 0 ? target / 2 : target
    const values = Array.from(generatorFactors(target, target))
    return pickRandomInArray(values)
}

export function* generatorFactors(target: number, end: number)
{
    let current = 2
    do
    {
        if ((target / current) % 1 === 0)
        {
            yield current
        }
        current++
    }
    while (current <= end)
}

export function pickRandomInArray<T>(array: T[])
{
    return array[getRandomInt(0, array.length)]
}

export function pickRandomIterative(generator: () => IterableIterator<number>, limitLow: number, limitHigh: number)
{
    const random = getRandomInt(limitLow, limitHigh)

    let output: number
    const values = generator()

    for (let item of values)
    {
        output = item
        if (random <= item)
        {
            return output
        }
    }
    if (output)
    {
        return output
    }
    console.warn("pickRandomIterative failed", Array.from(generator()), "low", limitLow, "high", limitHigh, "random", random, "output", output)
    return 1
}

export function randomBool()
{
    return Math.random() >= 0.5
}