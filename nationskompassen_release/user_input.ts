import * as readline from 'readline';

//Creates an interface for typescript to read the terminal
export const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

/**
 * Wraps rl.question in a Promise to allow async/await usage.
 * @param {string} question - The question to display to the user.
 * @returns {Promise<string>} The userinput as a string
 */
export function ask(question: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}



