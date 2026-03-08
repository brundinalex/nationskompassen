import { getEvents } from "./collectDataGraph";
// import * as handleData from "./handleDataGraph";
// import { get_open_pubs, extract_essentials, build_nation_index, build_nation_distance_matrix, create_route } from "./handleDataGraph";
// import {type NationTable, type Nation, type Coordinates, coordinates_of_nations } from "../lib/nation"
// import { ListGraph, lg_bfs_visit_order, lg_dfs_visit_order } from "../lib/graphs";
import { for_each, type Pair, pair} from "../lib/list";
import { create_route } from "./create_route";
import { get_open_pubs, extract_essentials } from "./extract_essential_data";
import { choice, newRoute, rl, nationInformation } from "./userInput" 

// import { hash_id, HashFunction, ph_empty, ph_insert, ph_lookup, ProbingHashtable } from '../lib/hashtables';



/**
 Creates a route based on user input.
 */
async function main() {
    let runningLoop = true;
    while(runningLoop) {
        try {
            const categories = await getEvents();
            let openPubs = extract_essentials(get_open_pubs(categories))!
            let answer = await choice(openPubs);
            let route = create_route(answer, openPubs)
            GUI(route, "Här är din färdiga pubrunda");
            let nationInfo = await nationInformation();
            if(nationInfo) {
                openPubs.forEach((value) => {
                    console.log(`${value.orginization} - ${value.contact}`)
                })
            }
        } catch (err) {
            console.error(err);
        }
        runningLoop = await newRoute();
    }
    rl.close();
}


function GUI(r: Array<String>, text: string) {
    console.log("─".repeat(50));
    console.log(text)
    r.forEach((value) => {
    console.log(value);
    })
    console.log("─".repeat(50));
}
main();

//mer info ska console.loggas, tider, nation, alla öppna osv.
//fixa med user input