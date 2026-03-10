import { get_events } from "./collect_data";
import { type Pair } from "../lib/list";
import { create_route } from "./create_route";
import { get_open_pubs, extract_essentials } from "./extract_essential_data";
import { rl, ask } from "./user_input" 
import { NationNode } from "../lib/nation";
import { build_nation_index } from "./build_nation_matrix";

/**
 Creates a route based on user input.
 */
async function main() {
    try {
        const categories = await get_events();
        let openPubs = extract_essentials(get_open_pubs(categories))!
        driver_loop(openPubs)
    } catch (err) {
        console.error(err);
    }
}
/**
 * This driver loop ensures that the program runs continuously until the user terminates it.
 * @param {Array<NationNode>} openPubs - Array with all currenty open pubs. 
 */
async function driver_loop(openPubs: Array<NationNode>) {
    let runningLoop = true;
    console.log("Välkommen till nationskompassen!");
    console.log("─".repeat(50));
    while(runningLoop) {
        console.log("Vad vill du göra?")
        console.log("1. Skapa pubrunda")
        console.log("2. Visa öppna pubbar")
        console.log("Q. quit")
        console.log("_".repeat(50))
        let answer = await ask("Ditt svar: ")
        console.log("_".repeat(50))
        if(answer === "1") {
            let answer = await choice(openPubs);
            let route = create_route(answer, openPubs);
            CLI(route, "Här är din färdiga pubrunda");
        } else if (answer === "2") {
            openPubs.forEach((value) => {
                console.log("=".repeat(50));
                console.log(`${value.orginization}\n${value.pub}\n${value.contact}\n${value.schedule}`);
            })
            console.log("=".repeat(50));
        } else if(answer.toLowerCase() === "q") {
            runningLoop = false;
        } else {
            console.log("Välj ett av alternativen ovan(1, 2, Q)")
        }
    }
    rl.close();
}


/**
 * Creates a command line interface to act as user inteface.
 * @param {Array<String>} route - Created route. 
 * @param {string} text - Text to be displayed.
 */
function CLI(route: Array<String>, text: string): void {
    console.log("─".repeat(50));
    console.log(text)
    route.forEach((value) => {
    console.log(value);
    })
    console.log("─".repeat(50));
}

/**
 * Displays all open nations with their index and pub name, then prompts
 * the user to choose a starting pub and how many pubs to visit.
 * Reprompts if the chosen index is out of range.
 * @param {Array<NationNode>} openNations - Array of currently open NationNodes to choose from.
 * @returns {Promise<Pair<string, number>>} - A pair with starting pubname and nr of pubs to visit
 */
export async function choice(openNations: Array<NationNode>): Promise<Pair<string, number>> {
    let currentNations = build_nation_index(openNations);
    for (const nat of openNations) {
        console.log(`${currentNations.get(nat.orginization)}. ${nat.pub}`);
    }
    console.log("")
    console.log("Vilken pub vill du börja på?")
    console.log("-".repeat(50))
    let pubnameIndex = parseInt(await ask("Ditt svar: "));
    console.log("-".repeat(50))
    while(pubnameIndex < 0 || pubnameIndex > openNations.length) {
        console.log("Det numret var inte ett möjligt val")
        console.log("Vilken pub vill du börja på?")
        console.log("-".repeat(50))
        pubnameIndex = parseInt(await ask("Ditt svar: "));
        console.log("-".repeat(50))
    }
    console.log("Hur många pubbar vill du besöka?")
    console.log("-".repeat(50))
    const nrOfPubs = parseInt(await ask("Ditt svar: "));
    console.log("-".repeat(50))

    const pubname = openNations[pubnameIndex].orginization;
    return [pubname, nrOfPubs];
}

main();
