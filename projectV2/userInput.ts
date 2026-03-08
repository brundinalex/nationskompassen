import * as readline from 'readline';
import * as n from "../lib/nation"
import { type Pair} from "../lib/list";
import { build_nation_index } from './build_nationGraph';



//Creates an interface for typescript to read the terminal
export const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

/**
 * Wraps rl.question in a Promise to allow async/await usage.
 * @param question - The question to display to the user.
 * @returns The userinput as a string
 */
export function ask(question: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}

/**
 * Displays all open nations with their index and pub name, then prompts
 * the user to choose a starting pub and how many pubs to visit.
 * Reprompts if the chosen index is out of range.
 * @param openNations - Array of currently open NationNodes to choose from.
 * @returns A pair with starting pubname and nr of pubs to visit
 */
export async function choice(openNations: Array<n.NationNode>): Promise<Pair<string, number>> {
    let currentNations = build_nation_index(openNations);
    for (const nat of openNations) {
        console.log(`${currentNations.get(nat.orginization)} - ${nat.pub}`);
    }

    let pubnameIndex = parseInt(await ask("Vilken pub vill du börja på, välj ett nummer? "));
    while(pubnameIndex < 0 || pubnameIndex > openNations.length) {
        console.log("Det numret var inte ett möjligt val")
        pubnameIndex = parseInt(await ask("Vilken pub vill du börja på, välj ett nummer? "));
    }
    const nrOfPubs = parseInt(await ask("Hur många pubbar vill du besöka? "));

    const pubname = openNations[pubnameIndex].orginization;
    return [pubname, nrOfPubs];
}
/**
 * Asks the user if they want to plan a new pub route.
 * @returns A promise either true or false based on user input
 */
export async function newRoute(): Promise<boolean>{
    let answer = await ask("Vill du göra en ny pubrunda? Y/N: ");
    if(answer.toLowerCase() === "n") {
        console.log("SKÅL")
        return false;
    } else {
        return true;
    }
}

/**
 * Asks the user if they want contact information for the pubs in their route.
 * @returns A promise either true or false based on user input
 */
export async function nationInformation(): Promise<boolean>{
    let answer = await ask("Vill du ha kontaktinformation till pubbarna i din pubrunda? Y/N: ");
    if(answer.toLowerCase() === "n") {
        return false;
    } else {
        return true;
    }

}
