import { IReducible } from "../../operator-precedence/core";

function getRandomInt(min, max)
{
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function allRandomGenerator(questionNumber: number)
{
    const generators: ((questionNumber?: number) => IReducible)[] = [
        require('../AdditionSubtraction').generateRandom,
        require('../MultiplicationDivision').generateRandom,
        require('../MDAS').generateRandom,
        require('../PMDAS').generateRandom
    ]

    return generators[getRandomInt(0, generators.length)](questionNumber)
}

window["debugLog"] = console.info

var urlParams = new URLSearchParams(location.search);

let i = Number(urlParams.get("count"))

if (isNaN(i) || i <= 0)
{
    i = 100
    urlParams.set("count", "100")
    location.search = urlParams.toString()
}

while (i--)
{
    const exp = allRandomGenerator(getRandomInt(1, 9))
    console.log(exp, "=", exp.result())
}