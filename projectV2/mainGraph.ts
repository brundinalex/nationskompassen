import * as collectData from "./collectDataGraph";
import * as handleData from "./handleDataGraph";
import {type NationTable, type Nation, type coordinates, coordinates_of_nations } from "../lib/nation"
import { ListGraph, lg_bfs_visit_order, lg_dfs_visit_order } from "../lib/graphs";
import { type Pair, pair} from "../lib/list";
import { hash_id, HashFunction, ph_empty, ph_insert, ph_lookup, ProbingHashtable } from '../lib/hashtables';





async function main() {
    try {
        const categories = await collectData.getEvents();
        const nationHT = handleData.open_nation_pubs(categories);
        //const answer: Pair<Nation, number> = handleData.userInput(nationHT);
        const answer: Pair<Nation, number> = pair("Norrlands nation", 4)
        console.log(handleData.make_runda(nationHT, answer));
        //console.log(ph_lookup(nationHT, "Norrlands nation"))
    } catch (err) {
        console.error(err);
    }


}
main();