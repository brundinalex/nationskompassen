"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rl = void 0;
exports.ask = ask;
var readline = require("readline");
//Creates an interface for typescript to read the terminal
exports.rl = readline.createInterface({ input: process.stdin, output: process.stdout });
/**
 * Wraps rl.question in a Promise to allow async/await usage.
 * @param question - The question to display to the user.
 * @returns The userinput as a string
 */
function ask(question) {
    return new Promise(function (resolve) {
        exports.rl.question(question, function (answer) {
            resolve(answer);
        });
    });
}
