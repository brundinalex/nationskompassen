import * as collectData from "./collectData";
import * as handleData from "./handleData";
import {type NationTable, type Nation, type coordinates, nations } from "../lib/nation"




async function main() {
    try {
        const categories = await collectData.getEvents();
        const nationHT = handleData.open_nation_pubs(categories);
        const answer: Pair<Nation, number> = handleData.userInput(nationHT);
        console.log(handleData.make_runda(nationHT, answer));
    } catch (err) {
        console.error(err);
    }


}
main();