// console.log(arguments);
// console.log(require('module').wrapper);
// console.log(require('./event.js'));

const MyCalculatorClass = require('./my_calculator');
const MyCalculatorObject = require('./my_calculator2');

const calculator = new MyCalculatorClass();
console.log(calculator.add(1, 2));

console.log(MyCalculatorObject.add(1, 2));

require('./console_log_module')();
require('./console_log_module')();
require('./console_log_module')();
