import * as collectData from "./collectDataGraph";
import * as handleData from "./handleDataGraph";
import { get_open_pubs, extract_essentials, build_nation_index, build_nationDistance_matrix, createRoute } from "./handleDataGraph";
import {type NationTable, type Nation, type coordinates, coordinates_of_nations } from "../lib/nation"
import { ListGraph, lg_bfs_visit_order, lg_dfs_visit_order } from "../lib/graphs";
import { type Pair, pair} from "../lib/list";
import { hash_id, HashFunction, ph_empty, ph_insert, ph_lookup, ProbingHashtable } from '../lib/hashtables';


async function main() {
    try {
        const categories = await collectData.getEvents();
        //const answer: Pair<Nation, number> = handleData.userInput(nationHT);
        const answer: Pair<string, number> = pair("Norrlands nation", 4)
        console.log(createRoute(answer, extract_essentials(get_open_pubs(categories))!))
            
    } catch (err) {
        console.error(err);
    }
}
main();