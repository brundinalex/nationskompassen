import {type NationTable, type Nation, type VisitedNation, 
        type coordinates, coordinates_of_nations, type NationIndex, 
        type NationMatrix, type NationNode, type AXAJresponse,
        type NationGuideCategory, type NationGuideEvent
    } from "../lib/nation"
import { ListGraph, lg_bfs_visit_order, lg_dfs_visit_order } from "../lib/graphs";
import { type Pair, pair} from "../lib/list";
import { hash_id, HashFunction, ph_empty, ph_insert, ph_lookup, ProbingHashtable } from '../lib/hashtables';
import { getEvents } from "../projectV1/collectData";

/**
 * Extracts all NationGuideEvent objects from categories whose title is "Pub".
 * Iterates through the provided NationGuideCategory array and collects every
 * event belonging to categories named "Pub".
 * 
 * @param {Array<NationGuideCategory>} json_parsed - An array of NationGuideCategory objects to search through.
 * @returns {Array<NationGuideEvent>} - An array containing all NationGuideEvent objects from "Pub" categories.
 */
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

/**
 * Extracts all the essential information from an array containing NationGuideEvent to create a NationNode.
 * @param {Array<NationGuideEvent>} nation_events - An array of NationGuideEvent objects.
 * @returns {Array<NationNode>} An array with NationNode.
 */
export function extract_essentials(nation_events: Array<NationGuideEvent>): Array<NationNode> {

    // Compares the name of a NationGuideEvent and the names in coordinates_of_nations and tries to find
    // the coordinates of a give NationGuideEvent. If no coordinates are found, return undefined.
    function get_organiser_coordinates(nation_of_interest: NationGuideEvent): coordinates | undefined {
        for (const nation_coordinates of coordinates_of_nations) {
            if (nation_coordinates.name === nation_of_interest.organiser.title) {
                return nation_coordinates;
            }
        }
        return undefined;
    }
    const nations_of_selected_date: Array<NationNode> = [];

    for (const object of nation_events) {
        const valid_nation_node: NationNode = { orginization: object.organiser.title,
                                                pub: object.title,
                                                schedule: object.schedule,
                                                contact: [["N/A", "N/A"]],
                                                coordinate: get_organiser_coordinates(object)!,
                                                weight: NaN
                                              };

        nations_of_selected_date.push(valid_nation_node);
    }

    return nations_of_selected_date;
} 

/**
 * Maps every nation to an index.
 * @param {Array<NationNode>}nations_of_selected_date - NationNodes to be mapped.
 * @returns {NationIndex} A map with the name of all NationNode and an index. 
 */
export function build_nation_index(nations_of_selected_date: Array<NationNode>): NationIndex {
    const index: NationIndex = new Map()
        for (let i = 0; i < nations_of_selected_date.length; i++) {
            index.set(nations_of_selected_date[i].orginization, i);
        }
    return index;
}

/**
 * Builds a weighted 2D-matrix (graph) containing NationNode and gives each node its relative weight.
 * @param {Array<NationNode>} nation_nodes - An array with NationNodes.
 * @returns {NationMatrix} A weighted 2D-matrix.
 */
export function build_nation_distance_matrix(nation_nodes: Array<NationNode>): NationMatrix {
    const matrix: NationMatrix = [];

    for (let i: number = 0; i < nation_nodes.length; i++) {
        matrix[i] = [];

        for (let j: number = 0; j < nation_nodes.length; j++) {
        
            const weight = i === j
                           ? 0
                           : get_distance(nation_nodes[i].coordinate,
                                          nation_nodes[j].coordinate);
        
            // Create a fresh copy for this matrix cell
            matrix[i][j] = {
                ...nation_nodes[j],
                weight: weight
            };
        }
    }

    return matrix;
}

/**
 * Traverses all adjacent nodes to a given node in a NationMatrix and finds 
 * the adjacent node with the smallest weight (i.e the nearest nation). 
 * @param {NationMatrix} nation_matrix - A 2D-matrix of NatiionNode
 * @param {number} index - a number corresponding to the NationNode of which adjacent nodes that we want to traverse. 
 * @param {Set<number>} already_visisted - A set of numbers storing all adjacent nodes that has been visited.
 * @returns {number | undefined} - An index corresponding to the closest nation, if no such exists then undefined.
 */
function nearest_nation(nation_matrix: NationMatrix, index: number, already_visisted: Set<number>): number | undefined {
    let shortest_distance: number = Infinity;
    let closest_index: number | undefined = undefined;

    for (let i: number = 0; i < nation_matrix[index].length; i++) {
        if (already_visisted.has(i)) { 
            continue; 
        } else if (nation_matrix[index][i].weight === 0){
            continue;
        } else if (nation_matrix[index][i].weight < shortest_distance) {
            shortest_distance = nation_matrix[index][i].weight;
            closest_index = i;
        }
    }
    return closest_index;
}

/**
 * Creates a pubroute based on chosen start pub and number of pubs, all with regard to currently open pubs.
 * @param {Pair<string, number>} user_info - Start pub and amount of pubs to visit during the route.
 * @param {Array<NationNode> } nations_of_selected_date - All avaliable nations to visit.
 * @returns {Array<String>} - Array with pubs to visit.
 */
export function create_route(user_info: Pair<string, number>, nations_of_selected_date: Array<NationNode>): Array<String> {
    const available_nations = build_nation_distance_matrix(nations_of_selected_date);
    const index_decode = build_nation_index(nations_of_selected_date);
    const first_nation = user_info[0];
    const number_of_stops = user_info[1];

    let route: Set<number> = new Set();
    let start_index = index_decode.get(first_nation)
    let pubrunda: Array<string> = [];

    route.add(start_index!)

    while(route.size < number_of_stops) {
        const next_pub_index = nearest_nation(available_nations, start_index!, route)
        route.add(next_pub_index!)
        start_index = next_pub_index;
    }

    route.forEach((value) => {
        pubrunda.push(nations_of_selected_date[value].pub)
    })
    return pubrunda;
}   

/**
 * Computes the distance between two nations, using Pythagorean theorem.
 * @param {coordinates} n1 - First nations coordinates. 
 * @param {coordinates} n2 - Second nations coordinates.
 * @returns {number} - Distance between the two nations.
 */
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
/**
 * Asks user for start nation and the length of the route.
 * @param {NationTable} nationHT hashtable with nations.
 * @returns {Pair<Nation, number>} where string is the name of the start nation and number is amount to be visited, 
 */
export function userInput(nationHT: NationTable): Pair<Nation, number> {
    let startPub = prompt("Vilken nation vill du börja på?");
    while(!ph_lookup(nationHT, startPub!)) {
        startPub = prompt("Felstavat, Kom ihåg stor bokstav och mellanslag!!")
    }
    let nrOfNations = parseInt(prompt("Hur lång ska pubrundan vara? (Max 13)")!)
    const result: Pair<Nation, number> = [ph_lookup(nationHT, startPub!)!, nrOfNations]
    return result;
}
