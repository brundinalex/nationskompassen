import {type NationTable, type Nation, type coordinates, nations } from "../lib/nation"
import { ListGraph, lg_bfs_visit_order, lg_dfs_visit_order } from "../lib/graphs";
import { type Pair, pair} from "../lib/list";
import { hash_id, HashFunction, ph_empty, ph_insert, ph_lookup, ProbingHashtable } from '../lib/hashtables';
import { getEvents } from "./collectData";


export function open_nation_pubs(json_parsed: any): NationTable {

    //Sparar alla nationers namn vars pub är öppen 
    function get_open_pubs(json_parsed: any): Array<any> {
        const open_pubs = [];
        for (const event of json_parsed) {
            if (event.title === "Pub") {
                const pub = event;
                for (const nation of pub.events) {
                open_pubs.push(nation)
                }
            }
        }
        return open_pubs;
    }

    // Plockar ut organization.title, pub.title & schedule
    function extract_essentials(nationarray: Array<any>): Array<Nation> | null {
        function get_cor(nation: any): coordinates | undefined {
            for (const nation_cor of nations) {
                if (nation_cor.name === nation.organiser.title) {
                    return nation_cor;
                }
            }
        }
        const nationer: Array<Nation> = [];

        for(const result of nationarray) {
            const nation: Nation = { orginization: result.organiser.title,
                        pub: result.title,
                        schedule: result.schedule,
                        contact: [["hej", "hej"]], //fixa array med konakt info,
                        coordinate: get_cor(result)!,
                        sorted_nation_distance: get_shortest_distance(result, nations)
};

            nationer.push(nation);
        }

        return nationer;
    } 

    function convert_to_hash_table(nations: Array<Nation>): NationTable {

        // Another hash function if needed.

        const hash_func = (key: string): number => {
            let hash = 0
            for (let i = 0; i < key.length; i++) {
                hash = hash * 31 + key.charCodeAt(i);
            }
            return hash;
        };

        if (nations.length === 0) {
            const new_empty_ht: NationTable = ph_empty<string, Nation>(1, hash_func);        
            return new_empty_ht;
        } else {
            let new_ht: NationTable = ph_empty(nations.length, hash_func)

            for (const nation of nations) {
                ph_insert(new_ht, nation.orginization, nation)
            }
            return new_ht;
        }
        
    }
    return convert_to_hash_table(extract_essentials(get_open_pubs(getEvents()))!)
}

function get_distance(n1: any, n2: coordinates): number {
    for (const nation of nations) {
        if (n1.organiser.title === nation.name) {
            const dx: number = Math.abs(n1.lat - n2.lat);
            const dy: number = Math.abs(n1.lng - n2.lng);
            const distance: number = Math.sqrt((dx * dx) + (dy * dy));
            return distance;
        }
    }
    return 0;
}

function get_shortest_distance(n1: any, nations: Array<coordinates>): Array<Pair<string, boolean>> {
    let distances: Array<Pair<string, boolean>> = [];
    let current_smallest: number = 1;
    let current_closest: any = n1;
    for (const nation of nations) {
        if (nation.name === n1.orginization) {
            // distances.push(1);
            distances.push([nation.name, false]);
        } else {
            const distance = get_distance(n1, nation)
            //distances.push(distance);
            distances.push([nation.name, false]);
            if (distance < current_smallest) {
                current_smallest = distance;
                current_closest = nation;
            }
        }
    }

    return distances;
}

export function userInput(nationHT: NationTable): Pair<Nation, number> {
    let startPub = prompt("Vilken nation vill du börja på?");
    while(!ph_lookup(nationHT, startPub!)) {
        startPub = prompt("Felstavat, Kom ihåg stor bokstav och mellanslag!!")
    }
    let nrOfNations = parseInt(prompt("Hur lång ska pubrundan vara? (Max 13)")!)
    const result: Pair<Nation, number> = [ph_lookup(nationHT, startPub!)!, nrOfNations]
    return result;
}

export function make_runda(nationHT: NationTable,userInfo: Pair<Nation, number>): Array<string> {
    let currentPub: Nation = userInfo[0];
    const nrOfPubs: number = userInfo[1];
    let addedPubs: number = 0;
    let tempCounter: number = 0;
    let pubrunda: Array<string> = [currentPub.pub];
    while(addedPubs < nrOfPubs) {
        while(currentPub.sorted_nation_distance[tempCounter][0][1]){
            tempCounter = tempCounter + 1;
        }
        currentPub.sorted_nation_distance[tempCounter][1] = true;
        let nextPub = currentPub.sorted_nation_distance[tempCounter][0][0];
        pubrunda.push(nextPub);
        let newCurrent = ph_lookup(nationHT, nextPub)!;
        currentPub = newCurrent;
        tempCounter = 0;
    }
    return pubrunda;
}
