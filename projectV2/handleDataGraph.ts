import {type NationTable, type Nation, type VisitedNation, 
        type coordinates, coordinates_of_nations, type NationIndex, 
        type NationMatrix, type NationNode, type AXAJresponse,
        type NationGuideCategory, type NationGuideEvent
    } from "../lib/nation"
import { ListGraph, lg_bfs_visit_order, lg_dfs_visit_order } from "../lib/graphs";
import { type Pair, pair} from "../lib/list";
import { hash_id, HashFunction, ph_empty, ph_insert, ph_lookup, ProbingHashtable } from '../lib/hashtables';
import { getEvents } from "../projectV1/collectData";


//Sparar alla nationers namn vars pub är öppen 
export function get_open_pubs(json_parsed: NationGuideCategory[]): NationGuideEvent[] {
    const open_pubs: NationGuideEvent[] = [];
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
export function extract_essentials(nation_arr: Array<NationGuideEvent>): Array<NationNode> {
    function get_cor(nation_to_compare: NationGuideEvent): coordinates | undefined {
        for (const nation_cor of coordinates_of_nations) {
            if (nation_cor.name === nation_to_compare.organiser.title) {
                return nation_cor;
            }
        }
        return undefined;
    }
    const nations_of_selected_date: Array<NationNode> = [];

    for (const object of nation_arr) {
        const valid_nation: NationNode = { orginization: object.organiser.title,
                                        pub: object.title,
                                        schedule: object.schedule,
                                        contact: [["hej", "hej"]], //fixa array med konakt info,
                                        coordinate: get_cor(object)!,
                                        weight: NaN
                                        };

        nations_of_selected_date.push(valid_nation);
    }

    return nations_of_selected_date;
} 

//Matrix Graph testing
export function build_nation_index(nations_of_selected_date: Array<NationNode>): NationIndex {
    const index: NationIndex = new Map()
        for (let i = 0; i < nations_of_selected_date.length; i++) {
            index.set(nations_of_selected_date[i].orginization, i);
        }
    return index;
}

export function build_nationDistance_matrix(nations: Array<NationNode>): NationMatrix {
    const matrix: NationMatrix = [];

    for (let i = 0; i < nations.length; i++) {
        matrix[i] = [];

        for (let j = 0; j < nations.length; j++) {

            const weight =
                i === j
                    ? 0
                    : get_distance(
                        nations[i].coordinate,
                        nations[j].coordinate
                    );

            // Create a fresh copy for this matrix cell
            matrix[i][j] = {
                ...nations[j],
                coordinate: { ...nations[j].coordinate },
                contact: [...nations[j].contact],
                weight: weight
            };
        }
    }

    return matrix;
}

function nearestNation(m: NationMatrix, index: number, alreadyVisisted: Set<number>): number | undefined {
    let shortestDistance = Infinity;
    let closestIndex: number | undefined = undefined;

    for(let i = 0; i < m[index].length; i++) {
        if(alreadyVisisted.has(i)) continue;
        else if (m[index][i].weight === 0) continue;
        else if(m[index][i].weight < shortestDistance) {
            shortestDistance = m[index][i].weight;
            closestIndex = i;
        }
    }
    return closestIndex;
}

export function createRoute(userInfo: Pair<string, number>, c: Array<NationNode>): Array<String> {
    const availableNations = build_nationDistance_matrix(c);
    const indexDecode = build_nation_index(c);
    const firstNation = userInfo[0];
    const nr = userInfo[1];
    let route: Set<number> = new Set();
    let startIndex = indexDecode.get(firstNation)
    let pubrunda: Array<string> = [];
    route.add(startIndex!)

    while(route.size < nr) {
        const nextPubIndex = nearestNation(availableNations, startIndex!, route)
        route.add(nextPubIndex!)
        startIndex = nextPubIndex;
    }

    route.forEach((value) => {
        pubrunda.push(c[value].pub)
    })
    return pubrunda;
}   
//hashtable code under

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
    return NaN;
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
