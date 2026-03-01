import {type NationTable, type Nation, type VisitedNation, type coordinates, coordinates_of_nations } from "../lib/nation"
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
                for (const nation_of_pub of pub.events) {
                open_pubs.push(nation_of_pub)
                }
            }
        }
        return open_pubs;
    }

    // Plockar ut organization.title, pub.title & schedule
    function extract_essentials(nation_arr: Array<any>): Array<Nation> | null {
        function get_cor(nation_to_compare: any): coordinates | undefined {
            for (const nation_cor of coordinates_of_nations) {
                if (nation_cor.name === nation_to_compare.organiser.title) {
                    return nation_cor;
                }
            }
            return undefined;
        }
        const nations_of_selected_date: Array<Nation> = [];
        function find_objet_coordinates(object: any): coordinates {
            for (const nation of coordinates_of_nations) {
                if (object.organiser.title === nation.name) {
                    return nation;
                }
            }
            return { name: "fel", lat: 1000000, lng: 1000000 };
        }

        for (const object of nation_arr) {
            const valid_nation: Nation = { orginization: object.organiser.title,
                                           pub: object.title,
                                           schedule: object.schedule,
                                           contact: [["hej", "hej"]], //fixa array med konakt info,
                                           coordinate: get_cor(object)!,
                                           sorted_nation_distance: get_shortest_distance(find_objet_coordinates(object), coordinates_of_nations)
                                            };

            nations_of_selected_date.push(valid_nation);
        }

        return nations_of_selected_date;
    } 

    function convert_to_hash_table(nations_of_selected_date: Array<Nation>): NationTable {

        // Another hash function if needed.

        const hash_func = (key: string): number => {
            let hash = 0
            for (let i = 0; i < key.length; i++) {
                hash = hash * 31 + key.charCodeAt(i);
            }
            return hash;
        };

        if (nations_of_selected_date.length === 0) {
            const new_empty_ht: NationTable = ph_empty<string, Nation>(1, hash_func);        
            return new_empty_ht;
        } else {
            let new_ht: NationTable = ph_empty(nations_of_selected_date.length, hash_func)

            for (const nation of nations_of_selected_date) {
                ph_insert(new_ht, nation.orginization, nation)
            }
            return new_ht;
        }
        
    }
    return convert_to_hash_table(extract_essentials(get_open_pubs(json_parsed))!)
}

function get_distance(n1: coordinates, n2: coordinates): number {
    for (const nation of coordinates_of_nations) {
        if (n1.name === nation.name) {
            const dx: number = Math.abs(n1.lat - n2.lat);
            const dy: number = Math.abs(n1.lng - n2.lng);
            const distance: number = Math.sqrt((dx * dx) + (dy * dy));
            return distance;
        }
    }
    //should return undefined otherwise, and avoid using promises (!).
    return 0;
}

function get_shortest_distance(n1: coordinates, coordinates_of_nations: Array<coordinates>): Array<VisitedNation> {
    let distances: Array<VisitedNation> = [];
    let current_smallest: number = 1;
    let current_closest: coordinates = n1;
    for (const nation of coordinates_of_nations) {
        if (nation.name === n1.name) {
            // distances.push(distance)
            distances.push([nation.name, 0, false]);
        } else {
            const distance = get_distance(n1, nation)
            //distances.push(distance);
            distances.push([nation.name, distance, false]);
            if (distance < current_smallest) {
                current_smallest = distance;
                current_closest = nation;
            }
        }
    }
    const sorted_distances = distances.sort((a: VisitedNation, b: VisitedNation) => a[1] - b[1])
    return sorted_distances;
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

export function make_runda(nationHT: NationTable, userInfo: Pair<Nation, number>): Array<string> {
    let currentPub: Nation = userInfo[0];
    const nrOfPubs: number = userInfo[1];
    let addedPubs: number = 0;
    let tempCounter: number = 0;
    let pubrunda: Array<string> = [currentPub.pub];
    currentPub.sorted_nation_distance[tempCounter][0][1] = true;     
    while(addedPubs < nrOfPubs) {
        while(currentPub.sorted_nation_distance[tempCounter][0][1]){
            tempCounter = tempCounter + 1;
        }
        currentPub.sorted_nation_distance[tempCounter][0][1] = true;
        let nextPub = currentPub.sorted_nation_distance[tempCounter][0];
        let newCurrent = ph_lookup(nationHT, nextPub[0])!;//funkar inte atm
        pubrunda.push(newCurrent.pub);
        currentPub = newCurrent;
        tempCounter = 0;
        addedPubs += 1;
    }
    return pubrunda;
}
