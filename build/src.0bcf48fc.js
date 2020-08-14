// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"Wx4v":[function(require,module,exports) {

},{}],"jtIn":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.replaceSigns = replaceSigns;
exports.OperatorSign = void 0;
var OperatorSign;
exports.OperatorSign = OperatorSign;

(function (OperatorSign) {
  OperatorSign["Add"] = "+";
  OperatorSign["Subtract"] = "-";
  OperatorSign["Multiply"] = "*";
  OperatorSign["Divide"] = "/";
})(OperatorSign || (exports.OperatorSign = OperatorSign = {}));

function replaceSigns(input) {
  return input.map(x => {
    switch (x) {
      case OperatorSign.Multiply:
        return "×";

      case OperatorSign.Divide:
        return "÷";

      default:
        return x;
    }
  });
}
},{}],"bxzU":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _types = require("./types");

Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types[key];
    }
  });
});

var _IOperation = require("./IOperation");

Object.keys(_IOperation).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _IOperation[key];
    }
  });
});

var _IOperator = require("./IOperator");

Object.keys(_IOperator).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _IOperator[key];
    }
  });
});

var _IReducible = require("./IReducible");

Object.keys(_IReducible).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _IReducible[key];
    }
  });
});

var _OperatorSign = require("./OperatorSign");

Object.keys(_OperatorSign).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _OperatorSign[key];
    }
  });
});
},{"./types":"Wx4v","./IOperation":"Wx4v","./IOperator":"Wx4v","./IReducible":"Wx4v","./OperatorSign":"jtIn"}],"ckG8":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.divide = exports.multiply = exports.subtract = exports.add = exports.Digits = void 0;

var _core = require("./core");

const Digits = "0123456789I";
exports.Digits = Digits;

function constructOperator(sign, evaluater) {
  return {
    sign,

    evaluate(left, right) {
      return evaluater(left, right);
    },

    toString() {
      return this.sign.toString();
    }

  };
}

function constructOperation(operator) {
  return input => ({
    operator,
    value: input,

    updateValue(input) {
      return constructOperation(this.operator)(input);
    },

    evaluateWith(left) {
      return operator.evaluate(left, this.value);
    },

    pipe(left) {
      const result = operator.evaluate(left.value, this.value);
      const operation = constructOperation(left.operator);
      return operation(result);
    },

    toString() {
      return `${this.operator.sign} ${this.value}`;
    }

  });
}

const adder = constructOperator(_core.OperatorSign.Add, (x, y) => x + y);
const substracter = constructOperator(_core.OperatorSign.Subtract, (x, y) => x - y);
const multiplier = constructOperator(_core.OperatorSign.Multiply, (x, y) => x * y);
const divider = constructOperator(_core.OperatorSign.Divide, (x, y) => x / y);
const add = constructOperation(adder);
exports.add = add;
const subtract = constructOperation(substracter);
exports.subtract = subtract;
const multiply = constructOperation(multiplier);
exports.multiply = multiply;
const divide = constructOperation(divider);
exports.divide = divide;
},{"./core":"bxzU"}],"fW6r":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FlatStep = exports.prioritySigns = void 0;

var _core = require("./core");

var _ArithmeticUnits = require("./ArithmeticUnits");

const prioritySigns = [_core.OperatorSign.Multiply, _core.OperatorSign.Divide];
exports.prioritySigns = prioritySigns;

function sameOperatingPrecendence(reference, input) {
  const AS = [_core.OperatorSign.Add, _core.OperatorSign.Subtract];
  const MD = [_core.OperatorSign.Multiply, _core.OperatorSign.Divide];
  return [reference, input].every(x => AS.some(y => y === x)) || [reference, input].every(x => MD.some(y => y === x));
}

class FlatStep {
  constructor(head, ...operations) {
    this.head = head;
    this.operations = operations;
    this.canReduce = operations.length === 0 ? false : true;
  }

  getPriorityPosition() {
    if (this.operations.length <= 1) {
      return 0;
    }

    let [priority, ..._] = this.operations.filter(x => prioritySigns.some(y => x.operator.sign === y));

    if (priority) {
      for (let index = 0; index < this.operations.length; index++) {
        const element = this.operations[index];

        if (priority === element) {
          return index;
        }
      }
    } else {
      return 0;
    }
  }

  getOperationStringRange(operationIndex) {
    const string = this.toString();
    let output = {
      start: undefined,
      end: undefined
    };
    const against = this.operations.slice();
    let comparer = (0, _ArithmeticUnits.add)(this.head);
    let currentOperationIndex = -1;

    for (let index = 0; index < string.length; index++) {
      const element = string[index];

      if (_ArithmeticUnits.Digits.includes(element)) {
        const target = index;
        const targetOperation = comparer;
        index += comparer.value.toString().length - 1;
        comparer = against.shift();
        currentOperationIndex++;

        if (currentOperationIndex >= operationIndex) {
          if (output.start === undefined) {
            output.start = target;
            continue;
          }

          if (output.end === undefined) {
            output.end = target + targetOperation.value.toString().length - 1;
            return output;
          }
        }
      }
    }

    return output;
  }

  getFullOperationStringRange() {
    const signs = this.operations.map(x => x.operator.sign);

    if (signs.every(x => sameOperatingPrecendence(signs[0], x))) {
      return {
        start: 0,
        end: this.toString().length - 1
      };
    }

    const priorityRange = this.collectRange(this.getPriorityPosition());
    return priorityRange;
  }

  getPriorityRanges() {
    const priorities = this.operations.map((x, i) => {
      if (prioritySigns.some(y => x.operator.sign === y)) {
        return {
          index: i,
          operation: x
        };
      } else {
        return undefined;
      }
    }).filter(x => x).map(x => this.collectRange(x.index));
    return priorities;
  }

  collectRange(start) {
    const priorityRange = this.getOperationStringRange(start);
    const string = this.toString();
    let tempEnd = priorityRange.end;

    for (let index = priorityRange.end + 1; index < string.length; index++) {
      const element = string[index]; // if (element === OperatorSign.Multiply || element === OperatorSign.Divide)
      // {
      //     if (hasAS)
      //     {
      //         return priorityRange
      //     }
      // }

      if (element === _core.OperatorSign.Add || element === _core.OperatorSign.Subtract) {
        // if (priorityRange.start !== 0)
        // {
        //     return priorityRange
        // }
        // hasAS = true
        priorityRange.end = tempEnd - 1;
        return priorityRange;
      }

      tempEnd = index;
    }

    priorityRange.end = tempEnd;
    return priorityRange;
  }

  getAtPosition(operationIndex) {
    if (operationIndex === 0) {
      return (0, _ArithmeticUnits.add)(this.head);
    } else {
      return this.operations[operationIndex - 1];
    }
  }

  reduce() {
    if (this.operations.length === 1) {
      return this.operations[0].evaluateWith(this.head);
    }

    let [priority, ..._] = this.operations.filter(x => prioritySigns.some(y => x.operator.sign === y));

    if (priority) {
      const indexTarget = this.operations.indexOf(priority);
      const rest = this.operations.slice();
      rest.splice(indexTarget, 1);

      if (indexTarget !== 0) {
        const left = this.operations[indexTarget - 1];
        rest[indexTarget - 1] = priority.pipe(left);
        return new FlatStep(this.head, ...rest);
      }
    }

    const [target, ...rest] = this.operations.slice();
    const left = this.head;
    const result = target.evaluateWith(left);
    return new FlatStep(result, ...rest);
  }

  hasSomeConditionInValues(predicate) {
    return predicate(this.head) || this.operations.some(x => predicate(x.value));
  }

  result() {
    return eval(this.toString());
  }

  toString() {
    return `${this.head} ${this.operations.map(x => x.toString()).join(" ")}`;
  }

}

exports.FlatStep = FlatStep;
},{"./core":"bxzU","./ArithmeticUnits":"ckG8"}],"UdiW":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CompositeStep = void 0;

var _FlatStep = require("./FlatStep");

var _ArithmeticUnits = require("./ArithmeticUnits");

function flatten(items) {
  const flat = [];
  items.forEach(item => {
    if (Array.isArray(item)) {
      flat.push(...flatten(item));
    } else {
      flat.push(item);
    }
  });
  return flat;
}

function deepString(input) {
  let output = "";

  for (const iterator of input) {
    if (Array.isArray(iterator)) {
      output += "[" + deepString(iterator) + "], ";
    } else {
      output += iterator + ", ";
    }
  }

  return output;
}

function deepLength(input) {
  let length = 0;

  for (const iterator of input) {
    if (Array.isArray(iterator)) {
      length += deepLength(iterator);
    } else {
      length += 1;
    }
  }

  return length;
}
/**
 * TODO: This implementation depends on too many recursive patterns, flatten them to iterative patterns.
 */


class CompositeStep {
  constructor(operations) {
    this.operations = operations;
    this.operationsFlat = flatten(this.operations);
    this.canReduce = operations.length <= 1 ? false : true;
  }

  static getDepth(input) {
    const traverseRecursive = target => {
      let depth = 0;

      if (Array.isArray(target)) {
        let candidate = 0;

        for (const iterator of target) {
          let result = depth + traverseRecursive(iterator) + 1;

          if (result > candidate) {
            candidate = result;
          }

          candidate;
        }

        depth = candidate;
      }

      return depth;
    };

    return traverseRecursive(input) - 1;
  }

  getAtPosition(operationIndex) {
    return this.operationsFlat[operationIndex];
  }

  getDepth() {
    return CompositeStep.getDepth(this.operations);
  }

  hasSomeConditionInValues(predicate) {
    return this.operationsFlat.some(x => predicate(x.value));
  }

  getPriorityPosition() {
    const firstDepth = CompositeStep.getDepth(this.operations[0]);

    if (this.getDepth() <= 1 && this.operations.every(x => CompositeStep.getDepth(x) === firstDepth)) {
      if (this.getDepth() === 0) {
        const [head, ...rest] = this.operations;
        return new _FlatStep.FlatStep(head.value, ...rest).getPriorityPosition();
      } else {
        return 0;
      }
    }

    const operations = this.operations.slice();

    const deepFindRecursive = targets => {
      const maxDepth = targets.reduce((x, y) => {
        const depth = CompositeStep.getDepth(y);
        return depth > x ? depth : x;
      }, 0);
      let skip = 0;

      for (const iterator of targets) {
        const depth = CompositeStep.getDepth(iterator);

        if (depth < maxDepth) {
          if (depth > -1) {
            skip += deepLength(iterator);
          } else {
            skip += 1;
          }
        } else {
          if (CompositeStep.getDepth(iterator) === 0) {
            const [head, ...rest] = iterator;
            return skip + new _FlatStep.FlatStep(head.value, ...rest).getPriorityPosition();
          } else {
            return skip + deepFindRecursive(iterator);
          }
        }
      }
    };

    return deepFindRecursive(operations);
  }

  getOperationStringRange(operationIndex) {
    const string = this.toString();
    const output = {
      start: undefined,
      end: undefined
    };
    const against = this.operationsFlat.slice();
    let comparer = against.shift();
    let currentOperationIndex = -1;

    for (let index = 0; index < string.length; index++) {
      const element = string[index];

      if (_ArithmeticUnits.Digits.includes(element)) {
        const target = index;
        const targetOperation = comparer;
        index += comparer.value.toString().length - 1;
        comparer = against.shift();
        currentOperationIndex++;

        if (currentOperationIndex >= operationIndex) {
          if (output.start === undefined) {
            output.start = target;
            continue;
          }

          if (output.end === undefined) {
            output.end = target + targetOperation.value.toString().length - 1;
            return output;
          }
        }
      }
    }

    return output;
  }

  getFullOperationStringRange() {
    const range = this.getOperationStringRange(this.getPriorityPosition());

    for (const iterator of this.operations) {
      if (Array.isArray(iterator) && iterator.every(x => !Array.isArray(x))) {
        const [head, ...rest] = iterator;
        const flatten = new _FlatStep.FlatStep(head.value, ...rest);
        const flatOperationRange = flatten.getFullOperationStringRange();
        range.end = range.start + (flatOperationRange.end - flatOperationRange.start);
        return range;
      }
    }

    return range;
  }
  /**
   * Single bracket depth only.
   */


  getBracketRanges() {
    if (this.getDepth() > 1) {
      throw "getBracketRanges() does not support depth > 1 as of yet.";
    }

    const string = this.toString();
    const indexes = string.split("").reduce((x, y, i) => y === "(" || y === ")" ? x.push(i) && x : x, []);
    let ranges = [];

    while (indexes.length) {
      ranges.push({
        start: indexes.shift(),
        end: indexes.shift()
      });
    }

    return ranges;
  }

  canFlatten() {
    return this.operations.every(x => !Array.isArray(x));
  }

  tryFlatten() {
    if (this.canFlatten()) {
      const [head, ...rest] = this.operations;
      return new _FlatStep.FlatStep(head.value, ...rest);
    } else {
      return this;
    }
  }

  reduce() {
    if (this.canFlatten()) {
      return this.tryFlatten().reduce();
    }

    const subReduceRecursive = operations => {
      let depth = -1;
      let priority;
      let priorityIndex = -1;

      for (let index = 0; index < operations.length; index++) {
        const element = operations[index];
        let candidate = CompositeStep.getDepth(element);

        if (candidate > depth) {
          depth = candidate;
          priority = element;
          priorityIndex = index;
        }
      }

      if (CompositeStep.getDepth(operations) <= 1) {
        for (let index = 0; index < operations.length; index++) {
          if (Array.isArray(operations[index])) {
            const [head, ...rest] = operations[index];
            const flat = new _FlatStep.FlatStep(head.value, ...rest).reduce();

            if (typeof flat === "number") {
              operations[index] = head.updateValue(flat);
              return new CompositeStep(operations).tryFlatten();
            } else {
              operations[index] = [head.updateValue(flat.head), ...flat.operations];
              return new CompositeStep(operations).tryFlatten();
            }
          }
        }
      } else {
        const reduced = subReduceRecursive(priority);
        operations[priorityIndex] = reduced.operations;
        return new CompositeStep(operations).tryFlatten();
      }
    };

    return subReduceRecursive(this.operations.slice());
  }

  result() {
    return eval(this.toString());
  }

  toString() {
    const getInnerMostFirst = steps => {
      const target = steps[0];

      if (Array.isArray(target)) {
        return getInnerMostFirst(target);
      } else {
        return target;
      }
    };

    const getBracketedStepStringRecursive = (steps, braceSign) => {
      if (Array.isArray(steps)) {
        return (braceSign ? getInnerMostFirst(steps).operator.sign + " " : "") + "(" + steps.map((x, i) => {
          if (i === 0 && !Array.isArray(x)) {
            return `${x.value}`;
          } else if (i === 0 && Array.isArray(x)) {
            return `${getBracketedStepStringRecursive(x)}`;
          } else if (Array.isArray(x)) {
            return getBracketedStepStringRecursive(x, true);
          } else {
            return x.toString();
          }
        }).join(" ") + ")";
      } else {
        return steps.toString();
      }
    };

    return this.operations.map(x => getBracketedStepStringRecursive(x, true)).join(" ").substring(2);
  }

}

exports.CompositeStep = CompositeStep;
},{"./FlatStep":"fW6r","./ArithmeticUnits":"ckG8"}],"PcmK":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ArithmeticUnits = require("./ArithmeticUnits");

Object.keys(_ArithmeticUnits).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _ArithmeticUnits[key];
    }
  });
});

var _FlatStep = require("./FlatStep");

Object.keys(_FlatStep).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _FlatStep[key];
    }
  });
});

var _CompositeStep = require("./CompositeStep");

Object.keys(_CompositeStep).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _CompositeStep[key];
    }
  });
});
},{"./ArithmeticUnits":"ckG8","./FlatStep":"fW6r","./CompositeStep":"UdiW"}],"skTz":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRandomInt = getRandomInt;
exports.getRandomInt2_99 = getRandomInt2_99;
exports.getRandomInt2_10 = getRandomInt2_10;
exports.getRandomInt2_100 = getRandomInt2_100;
exports.getRandomMultiple = getRandomMultiple;
exports.generateMultiples = generateMultiples;
exports.getRandomFactor = getRandomFactor;
exports.generatorFactors = generatorFactors;
exports.pickRandomInArray = pickRandomInArray;
exports.pickRandomIterative = pickRandomIterative;
exports.randomBool = randomBool;

/**
 * Generate a random integer.
 * @param min lower bound inclusive.
 * @param max uppper bound exclusive.
 */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function getRandomInt2_99() {
  return getRandomInt(2, 100);
}

function getRandomInt2_10() {
  return getRandomInt(2, 11);
}

function getRandomInt2_100() {
  return getRandomInt(2, 101);
}

function getRandomMultiple(base, limit) {
  if (base === 0) {
    base = 1;
    console.warn("Base Multiple is 0");
  }

  const generator = () => generateMultiples(base, limit);

  return pickRandomIterative(generator, 0, limit);
}

function* generateMultiples(base, limit) {
  let next = base;
  let counter = 1;

  do {
    yield next;
    counter++;
    next = base * counter;
  } while (next <= limit);
}
/**
 * Low effort algorithm to randomly pick a possible factor
 * @param target number to factorise
 */


function getRandomFactor(target) {
  // const end = target % 2 === 0 ? target / 2 : target
  const values = Array.from(generatorFactors(target, target));
  return pickRandomInArray(values);
}

function* generatorFactors(target, end) {
  let current = 2;

  do {
    if (target / current % 1 === 0) {
      yield current;
    }

    current++;
  } while (current <= end);
}

function pickRandomInArray(array) {
  return array[getRandomInt(0, array.length)];
}

function pickRandomIterative(generator, limitLow, limitHigh) {
  const random = getRandomInt(limitLow, limitHigh);
  let output;
  const values = generator();

  for (let item of values) {
    output = item;

    if (random <= item) {
      return output;
    }
  }

  if (output) {
    return output;
  }

  console.warn("pickRandomIterative failed", Array.from(generator()), "low", limitLow, "high", limitHigh, "random", random, "output", output);
  return 1;
}

function randomBool() {
  return Math.random() >= 0.5;
}
},{}],"nuR5":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateRandom = generateRandom;
exports.randomAS2Set = randomAS2Set;
exports.randomAS3Set = randomAS3Set;

var _operatorPrecedence = require("../operator-precedence");

var _Helpers = require("./Helpers");

/*
    Specification:
    x, y, z, p, q, r, s [2 to 99]

    x – y + z, x > y
    x + y – z, x + y > z
    p + q + r – s, p + q + r > s
    p + q – r + s, p + q > r
    p – q + r + s, p > q
    p + q – r – s, p + q > r + s
    p – q – r + s, p > q + r
    p – q + r – s, p > q, r > s
*/
const generators = [() => {
  const x = (0, _Helpers.getRandomInt)(2, 100);
  const y = (0, _Helpers.getRandomInt)(2, x);
  const z = (0, _Helpers.getRandomInt2_99)();
  return new _operatorPrecedence.FlatStep(x, (0, _operatorPrecedence.subtract)(y), (0, _operatorPrecedence.add)(z)); // x – y + z, x > y
}, () => {
  const z = (0, _Helpers.getRandomInt)(3, 100);
  const x = (0, _Helpers.getRandomInt)(z, 100);
  const y = (0, _Helpers.getRandomInt)(x - z + 1, 100);
  return new _operatorPrecedence.FlatStep(x, (0, _operatorPrecedence.add)(y), (0, _operatorPrecedence.subtract)(z)); // x + y – z, x + y > z
}, () => {
  const p = (0, _Helpers.getRandomInt)(2, 97);
  const q = (0, _Helpers.getRandomInt)(2, 97 - p);
  const r = (0, _Helpers.getRandomInt)(2, 97 - p - q);
  const s = (0, _Helpers.getRandomInt)(2, p + q + r);
  return new _operatorPrecedence.FlatStep(p, (0, _operatorPrecedence.add)(q), (0, _operatorPrecedence.add)(r), (0, _operatorPrecedence.subtract)(s)); // p + q + r – s, p + q + r > s
}, () => {
  const r = (0, _Helpers.getRandomInt)(3, 100);
  const p = (0, _Helpers.getRandomInt)(r / 2 + 1, 100);
  const q = (0, _Helpers.getRandomInt)(p, 100);
  const s = (0, _Helpers.getRandomInt)(2, 100);
  return new _operatorPrecedence.FlatStep(p, (0, _operatorPrecedence.add)(q), (0, _operatorPrecedence.subtract)(r), (0, _operatorPrecedence.add)(s)); // p + q – r + s, p + q > r
}, () => {
  const p = (0, _Helpers.getRandomInt)(2, 100);
  const q = (0, _Helpers.getRandomInt)(2, p);
  const r = (0, _Helpers.getRandomInt2_99)();
  const s = (0, _Helpers.getRandomInt2_99)();
  return new _operatorPrecedence.FlatStep(p, (0, _operatorPrecedence.subtract)(q), (0, _operatorPrecedence.add)(r), (0, _operatorPrecedence.add)(s)); // p – q + r + s, p > q
}, () => {
  const p = (0, _Helpers.getRandomInt2_99)();
  const q = (0, _Helpers.getRandomInt2_99)();
  const temp = (0, _Helpers.randomBool)() ? p : q;
  const r = (0, _Helpers.getRandomInt)(2, temp - 1);
  const s = (0, _Helpers.getRandomInt)(2, (temp === p ? q : p) - 1);
  return new _operatorPrecedence.FlatStep(p, (0, _operatorPrecedence.add)(q), (0, _operatorPrecedence.subtract)(r), (0, _operatorPrecedence.subtract)(s)); // p + q – r – s, p + q > r + s
}, () => {
  const p = (0, _Helpers.getRandomInt)(3, 100);
  const q = (0, _Helpers.getRandomInt)(2, p - 1);
  const r = (0, _Helpers.getRandomInt)(2, p - q);
  const s = (0, _Helpers.getRandomInt2_99)();
  return new _operatorPrecedence.FlatStep(p, (0, _operatorPrecedence.subtract)(q), (0, _operatorPrecedence.subtract)(r), (0, _operatorPrecedence.add)(s)); // p – q – r + s, p > q + r
}, () => {
  const p = (0, _Helpers.getRandomInt)(2, 100);
  const q = (0, _Helpers.getRandomInt)(2, p);
  const r = (0, _Helpers.getRandomInt)(2, 100);
  const s = (0, _Helpers.getRandomInt)(2, r);
  return new _operatorPrecedence.FlatStep(p, (0, _operatorPrecedence.subtract)(q), (0, _operatorPrecedence.add)(r), (0, _operatorPrecedence.subtract)(s)); // p – q + r – s, p > q, r > s
}];

function generateRandom(questionNumber) {
  return generators[questionNumber - 1]();
}

function randomAS2Set() {
  if ((0, _Helpers.randomBool)()) // Add
    {
      return new _operatorPrecedence.FlatStep((0, _Helpers.getRandomInt2_99)(), (0, _operatorPrecedence.add)((0, _Helpers.getRandomInt2_99)()));
    } else // Subtract
    {
      const a = (0, _Helpers.getRandomInt)(2, 99);
      const b = (0, _Helpers.getRandomInt)(2, a);
      return new _operatorPrecedence.FlatStep(a, (0, _operatorPrecedence.subtract)(b));
    }
}

function randomAS3Set() {
  if ((0, _Helpers.randomBool)()) // Add
    {
      const precursor = randomAS2Set();
      return new _operatorPrecedence.FlatStep(precursor.head, ...precursor.operations, (0, _operatorPrecedence.add)((0, _Helpers.getRandomInt2_99)()));
    } else // Subtract
    {
      let operation;

      do {
        const precursor = randomAS2Set();
        operation = new _operatorPrecedence.FlatStep(precursor.head, ...precursor.operations, (0, _operatorPrecedence.subtract)((0, _Helpers.getRandomInt)(2, 97)));
      } while (operation.result() < 0);

      return operation;
    }
} // let qq = 8
// while (qq--)
// {
//     let ii = 1000
//     console.log(`Q${qq + 1}-----------------------`)
//     while (ii--)
//     {
//         let ee = generateRandom(qq + 1).toString()
//         if (ii % 100 === 0)
//         {
//             console.log(ee.toString())
//         }
//     }
// }
},{"../operator-precedence":"PcmK","./Helpers":"skTz"}],"km1k":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateRandom = generateRandom;
exports.randomMD2Set = randomMD2Set;
exports.randomMD3Set = randomMD3Set;

var _Helpers = require("./Helpers");

var _operatorPrecedence = require("../operator-precedence");

/*
    Specification:
    a, b, c [1 to 10]
    p, q, r [1 to 100]

    a x b ÷ p, p factor of a x b
    p ÷ q x r, q factor of p
    a x b x c ÷ p, p factor of a x b x c
    a x b ÷ p x c, p factor of a x b
    p ÷ a x b x c, a factor of p
    a x b ÷ p ÷ q, p factor of a x b, q factor of a x b ÷ p
    p ÷ q ÷ a x b, q factor of p, a factor of p ÷ q
    p ÷ a x b ÷ q, a factor of p, q factor of p ÷ a x b.
*/
const generators = [() => {
  const a = (0, _Helpers.getRandomInt2_10)();
  const b = (0, _Helpers.getRandomInt2_10)();
  const p = (0, _Helpers.getRandomFactor)(a * b);
  return new _operatorPrecedence.FlatStep(a, (0, _operatorPrecedence.multiply)(b), (0, _operatorPrecedence.divide)(p)); // a x b ÷ p, p factor of a x b
}, () => {
  const p = (0, _Helpers.getRandomMultiple)((0, _Helpers.getRandomInt2_10)(), 100);
  const q = (0, _Helpers.getRandomFactor)(p);
  const r = (0, _Helpers.getRandomInt2_100)();
  return new _operatorPrecedence.FlatStep(p, (0, _operatorPrecedence.divide)(q), (0, _operatorPrecedence.multiply)(r)); // p ÷ q x r, q factor of p
}, () => {
  const a = (0, _Helpers.getRandomInt2_10)();
  const b = (0, _Helpers.getRandomInt2_10)();
  const c = (0, _Helpers.getRandomInt)(2, Math.floor(100 / (a * b)));
  const p = (0, _Helpers.getRandomFactor)(a * b * c);
  return new _operatorPrecedence.FlatStep(a, (0, _operatorPrecedence.multiply)(b), (0, _operatorPrecedence.multiply)(c), (0, _operatorPrecedence.divide)(p)); // a x b x c ÷ p, p factor of a x b x c
}, () => {
  const a = (0, _Helpers.getRandomInt2_10)();
  const b = (0, _Helpers.getRandomInt2_10)();
  const p = (0, _Helpers.getRandomFactor)(a * b);
  const c = (0, _Helpers.getRandomInt2_10)();
  return new _operatorPrecedence.FlatStep(a, (0, _operatorPrecedence.multiply)(b), (0, _operatorPrecedence.divide)(p), (0, _operatorPrecedence.multiply)(c)); // a x b ÷ p x c, p factor of a x b
}, () => {
  const a = (0, _Helpers.getRandomInt2_10)();
  const p = (0, _Helpers.getRandomMultiple)(a, 100);
  const b = (0, _Helpers.getRandomInt2_10)();
  const c = (0, _Helpers.getRandomInt2_10)();
  return new _operatorPrecedence.FlatStep(p, (0, _operatorPrecedence.divide)(a), (0, _operatorPrecedence.multiply)(b), (0, _operatorPrecedence.multiply)(c)); //p ÷ a x b x c, a factor of p
}, () => {
  const a = (0, _Helpers.getRandomInt2_10)();
  const b = (0, _Helpers.getRandomInt2_10)();
  const p = (0, _Helpers.getRandomFactor)(a * b);
  const q = (0, _Helpers.getRandomFactor)(a * b / p);
  return new _operatorPrecedence.FlatStep(a, (0, _operatorPrecedence.multiply)(b), (0, _operatorPrecedence.divide)(p), (0, _operatorPrecedence.divide)(q)); // a x b ÷ p ÷ q, p factor of a x b, q factor of a x b ÷ p
}, () => {
  const p = (0, _Helpers.getRandomInt2_100)();
  const q = (0, _Helpers.getRandomFactor)(p);
  const a = (0, _Helpers.getRandomFactor)(p / q);
  const b = (0, _Helpers.getRandomInt2_10)();
  return new _operatorPrecedence.FlatStep(p, (0, _operatorPrecedence.divide)(q), (0, _operatorPrecedence.divide)(a), (0, _operatorPrecedence.multiply)(b)); // p ÷ q ÷ a x b, q factor of p, a factor of p ÷ q
}, () => {
  const a = (0, _Helpers.getRandomInt2_10)();
  const p = (0, _Helpers.getRandomMultiple)(a, 100);
  const temp = 100 / (p / a);
  const b = temp > 10 ? (0, _Helpers.getRandomInt2_10)() : (0, _Helpers.getRandomInt)(2, temp);
  const q = (0, _Helpers.getRandomFactor)(p / a * b);
  return new _operatorPrecedence.FlatStep(p, (0, _operatorPrecedence.divide)(a), (0, _operatorPrecedence.multiply)(b), (0, _operatorPrecedence.divide)(q)); // p ÷ a x b ÷ q, a factor of p, q factor of p ÷ a x b
}];

function generateRandom(questionNumber) {
  let output;

  do {
    output = generators[questionNumber - 1]();

    if (output.hasSomeConditionInValues(x => isNaN(x))) {
      debugLog(output.toString(), "Reject due to contain NaN");
    }
  } while (output.hasSomeConditionInValues(x => isNaN(x)));

  return output;
}

function randomMD2Set() {
  if ((0, _Helpers.randomBool)()) // Divide
    {
      const a = (0, _Helpers.getRandomInt2_100)();
      const b = (0, _Helpers.getRandomFactor)(a);
      return new _operatorPrecedence.FlatStep(a, (0, _operatorPrecedence.divide)(b));
    } else // Multiply
    {
      const a = (0, _Helpers.getRandomInt2_10)();
      const b = (0, _Helpers.getRandomInt2_10)();
      return new _operatorPrecedence.FlatStep(a, (0, _operatorPrecedence.multiply)(b));
    }
}

function randomMD3Set() {
  if ((0, _Helpers.randomBool)()) // Divide 
    {
      let precursor = randomMD2Set();
      let a = (0, _Helpers.getRandomFactor)(precursor.result());
      return new _operatorPrecedence.FlatStep(precursor.head, ...precursor.operations, (0, _operatorPrecedence.divide)(a));
    } else // Multiply 
    {
      let precursor = randomMD2Set();
      return new _operatorPrecedence.FlatStep(precursor.head, ...precursor.operations, (0, _operatorPrecedence.multiply)((0, _Helpers.getRandomInt2_10)()));
    }
} // let qq = 8
// while (qq--)
// {
//     let ii = 1000
//     console.log(`Q${qq + 1}-----------------------`)
//     while (ii--)
//     {
//         let ee = generateRandom(qq + 1).toString()
//         if (ii % 100 === 0)
//         {
//             console.log(ee.toString())
//         }
//     }
// }
},{"./Helpers":"skTz","../operator-precedence":"PcmK"}],"ueG4":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inValueBound = inValueBound;
exports.generateRandom = generateRandom;

var _Helpers = require("./Helpers");

var _operatorPrecedence = require("../operator-precedence");

var _AdditionSubtraction = require("./AdditionSubtraction");

var _MultiplicationDivision = require("./MultiplicationDivision");

var _core = require("../operator-precedence/core");

function inValueBound(x) {
  return x % 1 === 0 && x > 0 && x <= 100;
}

const generatorsSet2 = [_AdditionSubtraction.randomAS2Set, _MultiplicationDivision.randomMD2Set];
const generatorsASOperations = [_operatorPrecedence.add, _operatorPrecedence.subtract];
const generatorsMDOperations = [_operatorPrecedence.multiply, _operatorPrecedence.divide];
const generators = [() => // 3 numbers
{
  let operation;
  let precursor = (0, _Helpers.pickRandomInArray)(generatorsSet2)();
  let postOperation;
  let rng;

  if ((0, _Helpers.randomBool)()) // AS
    {
      postOperation = (0, _Helpers.pickRandomInArray)(generatorsASOperations);
      rng = _Helpers.getRandomInt2_99;
    } else // MD
    {
      postOperation = (0, _Helpers.pickRandomInArray)(generatorsMDOperations);
      rng = _Helpers.getRandomInt2_10;
    }

  let result;

  do {
    if (postOperation === _operatorPrecedence.divide && _operatorPrecedence.prioritySigns.every(x => x !== precursor.operations[0].operator.sign)) // Dividing at End
      {
        const divider = (0, _Helpers.getRandomInt2_10)();
        precursor.operations[0] = precursor.operations[0].updateValue((0, _Helpers.getRandomMultiple)(divider, 100));
        operation = new _operatorPrecedence.FlatStep(precursor.head, ...precursor.operations, postOperation(divider));
        result = operation.result();
      } else {
      operation = new _operatorPrecedence.FlatStep(precursor.head, ...precursor.operations, postOperation(rng()));
      result = operation.result();
    }

    precursor = (0, _Helpers.pickRandomInArray)(generatorsSet2)();
  } while (result < 0 || result % 1 !== 0);

  return operation;
}, () => // 4 numbers
{
  let precursor = generators[0]();

  if ((0, _Helpers.randomBool)()) {
    if ((0, _Helpers.randomBool)()) // Add
      {
        return new _operatorPrecedence.FlatStep(precursor.head, ...precursor.operations, (0, _operatorPrecedence.add)((0, _Helpers.getRandomInt2_99)()));
      } else // Multiply
      {
        let output;

        do {
          precursor = generators[0]();
          output = new _operatorPrecedence.FlatStep(precursor.head, ...precursor.operations, (0, _operatorPrecedence.multiply)((0, _Helpers.getRandomInt2_10)()));
        } while (output.result() < 0);

        return output;
      }
  } else {
    if ((0, _Helpers.randomBool)()) // Subtract
      {
        let output;

        do {
          precursor = generators[0]();
          output = new _operatorPrecedence.FlatStep(precursor.head, ...precursor.operations, (0, _operatorPrecedence.subtract)((0, _Helpers.getRandomInt2_99)()));
        } while (output.result() < 0);

        return output;
      } else // Divide
      {
        let output;
        let result;

        do {
          precursor = generators[0]();
          let divident = precursor.operations[precursor.operations.length - 1].value;
          output = new _operatorPrecedence.FlatStep(precursor.head, ...precursor.operations, (0, _operatorPrecedence.divide)((0, _Helpers.getRandomFactor)(divident)));
          result = output.result();
        } while (result < 0 || result % 1 !== 0);

        return output;
      }
  }
}];

function generateRandom(questionNumber) {
  const generator = questionNumber <= 3 ? generators[0] : generators[1];
  let output;
  let operationSigns;

  do {
    output = generator();
    operationSigns = output.operations.map(x => x.operator.sign);
  } while (operationSigns.every(x => x === _core.OperatorSign.Add || x === _core.OperatorSign.Subtract) || operationSigns.every(x => x === _core.OperatorSign.Multiply || x === _core.OperatorSign.Divide));

  return output;
} // let qq = 8
// while (qq--)
// {
//     let ii = 1000
//     console.log(`Q${qq + 1}-----------------------`)
//     while (ii--)
//     {
//         let ee = generateRandom(qq + 1).toString()
//         if (ii % 100 === 0)
//         {
//             console.log(ee.toString())
//         }
//     }
// }
},{"./Helpers":"skTz","../operator-precedence":"PcmK","./AdditionSubtraction":"nuR5","./MultiplicationDivision":"km1k","../operator-precedence/core":"bxzU"}],"tixY":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateRandom = generateRandom;
exports.BracketLayouts = void 0;

var _Helpers = require("./Helpers");

var _operatorPrecedence = require("../operator-precedence");

var _MDAS = require("./MDAS");

const BracketLayouts = [[1, 2], [2, 1], [2, 1, 1], [1, 2, 1], [1, 1, 2], [2, 2], [3, 1], [1, 3]]; // Must contain parentesis, operations can either only addition with subtraction or multiplication with division

exports.BracketLayouts = BracketLayouts;

const randomAddSubtract = () => (0, _Helpers.pickRandomInArray)([_operatorPrecedence.add, _operatorPrecedence.subtract]);

const randomMultiplyDivide = () => (0, _Helpers.pickRandomInArray)([_operatorPrecedence.multiply, _operatorPrecedence.divide]);

const getRng = input => input === randomAddSubtract ? _Helpers.getRandomInt2_99 : _Helpers.getRandomInt2_10;

function checkReject(input) {
  const steps = new _operatorPrecedence.CompositeStep(input.slice());
  const result = steps.result();

  if ((0, _MDAS.inValueBound)(result)) {
    let reduced = steps;

    do {
      reduced = reduced.reduce();

      if (reduced instanceof _operatorPrecedence.CompositeStep) {
        if (reduced.canFlatten()) {
          reduced = reduced.tryFlatten(); // Jump point to next if
        } else {
          if (reduced.hasSomeConditionInValues(x => !(0, _MDAS.inValueBound)(x))) {
            return true;
          }
        }
      }

      if (reduced instanceof _operatorPrecedence.FlatStep) {
        if (reduced.hasSomeConditionInValues(x => !(0, _MDAS.inValueBound)(x))) {
          return true;
        }
      }
    } while (reduced.canReduce);

    return false;
  } else {
    return true;
  }
}
/**
 * Messy alert.
 */


function generateRandom(questionNumber) {
  let operations;
  const layout = BracketLayouts[questionNumber - 1];
  const generatorOperationSet = (0, _Helpers.pickRandomInArray)([randomAddSubtract, randomMultiplyDivide]);
  let generatedSigns;

  do {
    generatedSigns = Array(layout.reduce((x, y) => x + y, 0) - 1).fill(0).map(() => generatorOperationSet());
  } while (generatedSigns.every(x => x(1).operator.sign === generatedSigns[0](1).operator.sign)); // Very inefficient, but prevent all randomised operations be the same type


  const signs = [_operatorPrecedence.add, ...generatedSigns];
  const rng = getRng(generatorOperationSet);
  let threshold = 0;

  do {
    operations = [];
    const signsCopy = signs.slice();

    for (const iterator of layout) {
      switch (iterator) {
        // Bracketed operations
        case 1:
          {
            operations.push(signsCopy.shift()(rng()));
            break;
          }

        case 2:
          {
            const a = signsCopy.shift()(rng());
            const b = signsCopy.shift()(rng());
            operations.push([a, b]);
            break;
          }

        case 3:
          {
            const a = signsCopy.shift()(rng());
            const b = signsCopy.shift()(rng());
            const c = signsCopy.shift()(rng());
            operations.push([a, b, c]);
            break;
          }
      }
    }

    threshold++;

    if (threshold === 100) {
      console.warn("Rejected", new _operatorPrecedence.CompositeStep(operations).toString());
      return generateRandom(questionNumber);
    }
  } while (checkReject(operations.slice()));

  return new _operatorPrecedence.CompositeStep(operations);
} // let qq = 8
// while (qq--)
// {
//     let ii = 1000
//     console.log(`Q${qq + 1}-----------------------`)
//     while (ii--)
//     {
//         let ee = generateRandom(qq + 1).toString()
//         if (ii % 100 === 0)
//         {
//             console.log(ee.toString())
//         }
//     }
// }
},{"./Helpers":"skTz","../operator-precedence":"PcmK","./MDAS":"ueG4"}],"XaZL":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateRandom = generateRandom;

var _operatorPrecedence = require("../operator-precedence");

var _Helpers = require("./Helpers");

var _ParentesisOnly = require("./ParentesisOnly");

var _core = require("../operator-precedence/core");

var _MDAS = require("./MDAS");

function getRng(sign) {
  switch (sign) {
    case _core.OperatorSign.Add:
    case _core.OperatorSign.Subtract:
      return _Helpers.getRandomInt2_99;

    case _core.OperatorSign.Multiply:
    case _core.OperatorSign.Divide:
      return _Helpers.getRandomInt2_10;
  }
}

function getSign(operation) {
  switch (operation) {
    case _operatorPrecedence.add:
      return _core.OperatorSign.Add;

    case _operatorPrecedence.subtract:
      return _core.OperatorSign.Subtract;

    case _operatorPrecedence.multiply:
      return _core.OperatorSign.Multiply;

    case _operatorPrecedence.divide:
      return _core.OperatorSign.Divide;
  }
}

function generatorOperationSet() {
  return (0, _Helpers.pickRandomInArray)([_operatorPrecedence.add, _operatorPrecedence.subtract, _operatorPrecedence.multiply, _operatorPrecedence.divide]);
}

function checkReject(input) {
  const steps = new _operatorPrecedence.CompositeStep(input.slice());
  const result = steps.result();

  if ((0, _MDAS.inValueBound)(result)) {
    let reduced = steps;

    do {
      reduced = reduced.reduce();

      if (reduced instanceof _operatorPrecedence.CompositeStep) {
        if (reduced.canFlatten()) {
          reduced = reduced.tryFlatten(); // Jump point to next if
        } else {
          if (reduced.hasSomeConditionInValues(x => !(0, _MDAS.inValueBound)(x))) {
            return true;
          }
        }
      }

      if (reduced instanceof _operatorPrecedence.FlatStep) {
        if (reduced.hasSomeConditionInValues(x => !(0, _MDAS.inValueBound)(x))) {
          return true;
        }
      }
    } while (reduced.canReduce);

    return false;
  } else {
    return true;
  }
}

function generateOperation(operation) {
  return operation(getRng(getSign(operation))());
}

const ASSet = [_core.OperatorSign.Add, _core.OperatorSign.Subtract];
const MDSet = [_core.OperatorSign.Multiply, _core.OperatorSign.Divide];

function rejectSigns(operations) {
  if (operations.every(x => getSign(x) === getSign(operations[0]))) {
    return true;
  } // Needs to invert this for flow consistency


  if (operations.some(x => ASSet.includes(getSign(x))) && operations.some(x => MDSet.includes(getSign(x)))) {
    return false;
  }

  return true;
}

function generateRandom(questionNumber) {
  let operations;
  const layout = _ParentesisOnly.BracketLayouts[questionNumber - 1];
  let generatedSigns;

  do {
    generatedSigns = Array(layout.reduce((x, y) => x + y, 0) - 1).fill(0).map(() => generatorOperationSet());
  } while (rejectSigns(generatedSigns)); // Very inefficient, prevent all randomised operations be the same


  const signs = [_operatorPrecedence.add, ...generatedSigns];

  do {
    operations = [];
    const signsCopy = signs.slice();

    for (const iterator of layout) {
      switch (iterator) {
        // Bracketed operations
        case 1:
          {
            operations.push(generateOperation(signsCopy.shift()));
            break;
          }

        case 2:
          {
            const a = generateOperation(signsCopy.shift());
            const b = generateOperation(signsCopy.shift());
            operations.push([a, b]);
            break;
          }

        case 3:
          {
            const a = generateOperation(signsCopy.shift());
            const b = generateOperation(signsCopy.shift());
            const c = generateOperation(signsCopy.shift());
            operations.push([a, b, c]);
            break;
          }
      }
    } //console.log("Iterate", new CompositeStep(operations.slice()), "=", new CompositeStep(operations.slice()).result())

  } while (checkReject(operations.slice()));

  return new _operatorPrecedence.CompositeStep(operations);
} // let qq = 8
// while (qq--)
// {
//     let ii = 1000
//     console.log(`Q${qq + 1}-----------------------`)
//     while (ii--)
//     {
//         let ee = generateRandom(qq + 1).toString()
//         if (ii % 100 === 0)
//         {
//             console.log(ee.toString())
//         }
//     }
// }
},{"../operator-precedence":"PcmK","./Helpers":"skTz","./ParentesisOnly":"tixY","../operator-precedence/core":"bxzU","./MDAS":"ueG4"}],"BhBE":[function(require,module,exports) {
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function allRandomGenerator(questionNumber) {
  const generators = [require('../AdditionSubtraction').generateRandom, require('../MultiplicationDivision').generateRandom, require('../MDAS').generateRandom, require('../PMDAS').generateRandom];
  return generators[getRandomInt(0, generators.length)](questionNumber);
}

window["debugLog"] = console.info;
var urlParams = new URLSearchParams(location.search);
let i = Number(urlParams.get("count"));

if (isNaN(i) || i <= 0) {
  i = 100;
  urlParams.set("count", "100");
  history.replaceState(null, null, "?" + decodeURIComponent(urlParams.toString()));
}

while (i--) {
  const exp = allRandomGenerator(getRandomInt(1, 9));
  console.log(exp, "=", exp.result());
}
},{"../AdditionSubtraction":"nuR5","../MultiplicationDivision":"km1k","../MDAS":"ueG4","../PMDAS":"XaZL"}],"QCba":[function(require,module,exports) {
"use strict";

require("./expression-generators/test/AllRandomTest");
},{"./expression-generators/test/AllRandomTest":"BhBE"}]},{},["QCba"], null)
//# sourceMappingURL=src.0bcf48fc.js.map