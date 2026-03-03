import {type NationTable, type Nation, type VisitedNation, type coordinates, coordinates_of_nations } from "../lib/nation"
import { type Pair, pair} from "../lib/list";
import { hash_id, HashFunction, ph_empty, ph_insert, ph_lookup, ProbingHashtable } from '../lib/hashtables';

/**
 * Checks all open nation pubs.
 * @param json_parsed - Parsed JSON file fetched from website.
 * @returns An array with all nation pubs that will be open during the day.
 */
export function open_nation_pubs(json_parsed: any): NationTable {

    // Fetches all events from the parsed JSON file that has title equivivalent to "Pub", followed by storing them in an
    // an array. Then return the array.
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

    // Extracts the essentials (oragnization title, pub title and the schedule for the day) from the parsed JSON file. 
    function extract_essentials(nation_arr: Array<any>): Array<Nation> | null {

        // Takes an object from the JSON file and compares its name with the nations coordinates array. If the nation object
        // exists in the array, then we return the coordinates object. If the nation object doesn't exists the it returns undefined.
        function get_cor(nation_to_compare: any): coordinates | undefined {
            for (const nation_cor of coordinates_of_nations) {
                if (nation_cor.name === nation_to_compare.organiser.title) {
                    return nation_cor;
                }
            }
            return undefined;
        }
        const nations_of_selected_date: Array<Nation> = [];

        // Fetches the organiser title from a object and compares it to the array of nation coordinates, returns record witg nation name and coordinates
        // if the title matches or a symbolic error-record.
        function find_object_coordinates(object: any): coordinates {
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
                                           sorted_nation_distance: get_shortest_distance(find_object_coordinates(object), coordinates_of_nations)
                                            };

            nations_of_selected_date.push(valid_nation);
        }

        return nations_of_selected_date;
    } 

    // Converts an array filled with open nations, represented as records to a hashtable. 
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
/**
 * Calculates the distance between two nations.
 * @param n1 record with name and coordinates for the first nation.
 * @param n2 record with name and coordinates for the second nation.
 * @returns a number that represents the distance.
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
    return 0;
}

/**
 * Computes the shortest distance from a choosen nation to all other nations.
 * @param n1 the nation to wich we want to find the closest neighbornation.
 * @param coordinates_of_nations array containing all the nations and their coordinates. 
 * @returns array with nation closest to the chosen nation. 
 */
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
/**
 * Asks user for start nation and the length of the route.
 * @param nationHT hashtable with nations.
 * @returns pair<string, number>, where string is the name of the start nation and number is amount to be visited, 
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

/**
 * Generates a route with n amount of stops.
 * @param nationHT - hashtable filled with nations.
 * @param userInfo - Pair of <Nation, number> where Nation is the start of the route and number is the amount of stops.
 * @returns Array with strings, where the strings is the nations to be visited.
 */
export function make_runda(nationHT: NationTable, userInfo: Pair<Nation, number>): Array<string> {
    let currentPub: Nation = userInfo[0];
    const nrOfPubs: number = userInfo[1];
    let addedPubs: number = 0;
    let pubrunda: Array<string> = [currentPub.pub];
    const visitedNations: Array<string> = [currentPub.orginization];

    while (addedPubs < nrOfPubs) {
        let tempCounter = 0;
        let newCurrent: Nation | undefined = undefined;

        while (tempCounter < currentPub.sorted_nation_distance.length) {
            const nextPubName = currentPub.sorted_nation_distance[tempCounter][0];
            if (!checkIfVisited(nextPubName, visitedNations)) {
                const lookup = ph_lookup(nationHT, nextPubName);
                if (lookup) {
                    newCurrent = lookup;
                    visitedNations.push(nextPubName);
                    break;
                }
            }
            tempCounter++;
        }

        if (!newCurrent) {
            console.log("No more open unvisited nations!");
            break;
        }

        pubrunda.push(newCurrent.pub);
        currentPub = newCurrent;
        addedPubs++;
    }
    return pubrunda;
}

/**
 * Checks wheter or not a string exists in an array
 * @param s - string to be searched for
 * @param l - array to search in
 * @returns - boolean, true or false
 */
function checkIfVisited(s: string, l: Array<string>) {
    for (const v of l) {
        if(v === s) {
            return true
        }
    } 
    return false;
}
