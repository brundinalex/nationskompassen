import * as collectData from "./collectData.js";
import * as handleData from "./handleData.js";
import {type NationTable, type Nation, type coordinates, nations } from "../lib/nation.js"
import { ListGraph, lg_bfs_visit_order, lg_dfs_visit_order } from "../lib/graphs.js";
import { type Pair, pair} from "../lib/list.js";
import { hash_id, HashFunction, ph_empty, ph_insert, ph_lookup, ProbingHashtable } from '../lib/hashtables.js';





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