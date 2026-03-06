"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_open_pubs = get_open_pubs;
exports.extract_essentials = extract_essentials;
exports.build_nation_index = build_nation_index;
exports.build_nation_distance_matrix = build_nation_distance_matrix;
exports.create_route = create_route;
exports.userInput = userInput;
var nation_1 = require("../lib/nation");
var hashtables_1 = require("../lib/hashtables");
/**
 * Extracts all NationGuideEvent objects from categories whose title is "Pub".
 * Iterates through the provided NationGuideCategory array and collects every
 * event belonging to categories named "Pub".
 *
 * @param {Array<NationGuideCategory>} json_parsed - An array of NationGuideCategory objects to search through.
 * @returns {Array<NationGuideEvent>} - An array containing all NationGuideEvent objects from "Pub" categories.
 */
function get_open_pubs(json_parsed) {
    var open_pubs = [];
    for (var _i = 0, json_parsed_1 = json_parsed; _i < json_parsed_1.length; _i++) {
        var event_1 = json_parsed_1[_i];
        if (event_1.title === "Pub") {
            var pub = event_1;
            for (var _a = 0, _b = pub.events; _a < _b.length; _a++) {
                var nation_of_pub = _b[_a];
                open_pubs.push(nation_of_pub);
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
function extract_essentials(nation_events) {
    // Compares the name of a NationGuideEvent and the names in coordinates_of_nations and tries to find
    // the coordinates of a give NationGuideEvent. If no coordinates are found, return undefined.
    function get_organiser_coordinates(nation_of_interest) {
        for (var _i = 0, coordinates_of_nations_1 = nation_1.coordinates_of_nations; _i < coordinates_of_nations_1.length; _i++) {
            var nation_coordinates = coordinates_of_nations_1[_i];
            if (nation_coordinates.name === nation_of_interest.organiser.title) {
                return nation_coordinates;
            }
        }
        return undefined;
    }
    var nations_of_selected_date = [];
    for (var _i = 0, nation_events_1 = nation_events; _i < nation_events_1.length; _i++) {
        var object = nation_events_1[_i];
        var valid_nation_node = { orginization: object.organiser.title,
            pub: object.title,
            schedule: object.schedule,
            contact: [["N/A", "N/A"]],
            coordinate: get_organiser_coordinates(object),
            weight: NaN };
        nations_of_selected_date.push(valid_nation_node);
    }
    return nations_of_selected_date;
}
/**
 * Maps every nation to an index.
 * @param {Array<NationNode>}nations_of_selected_date - NationNodes to be mapped.
 * @returns {NationIndex} A map with the name of all NationNode and an index.
 */
function build_nation_index(nations_of_selected_date) {
    var index = new Map();
    for (var i = 0; i < nations_of_selected_date.length; i++) {
        index.set(nations_of_selected_date[i].orginization, i);
    }
    return index;
}
/**
 * Builds a weighted 2D-matrix (graph) containing NationNode and gives each node its relative weight.
 * @param {Array<NationNode>} nation_nodes - An array with NationNodes.
 * @returns {NationMatrix} A weighted 2D-matrix.
 */
function build_nation_distance_matrix(nation_nodes) {
    var matrix = [];
    for (var i = 0; i < nation_nodes.length; i++) {
        matrix[i] = [];
        for (var j = 0; j < nation_nodes.length; j++) {
            var weight = i === j
                ? 0
                : get_distance(nation_nodes[i].coordinate, nation_nodes[j].coordinate);
            // Create a fresh copy for this matrix cell
            matrix[i][j] = __assign(__assign({}, nation_nodes[j]), { weight: weight });
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
function nearest_nation(nation_matrix, index, already_visisted) {
    var shortest_distance = Infinity;
    var closest_index = undefined;
    for (var i = 0; i < nation_matrix[index].length; i++) {
        if (already_visisted.has(i)) {
            continue;
        }
        else if (nation_matrix[index][i].weight === 0) {
            continue;
        }
        else if (nation_matrix[index][i].weight < shortest_distance) {
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
function create_route(user_info, nations_of_selected_date) {
    var available_nations = build_nation_distance_matrix(nations_of_selected_date);
    var index_decode = build_nation_index(nations_of_selected_date);
    var first_nation = user_info[0];
    var number_of_stops = user_info[1];
    var route = new Set();
    var start_index = index_decode.get(first_nation);
    var pubrunda = [];
    route.add(start_index);
    while (route.size < number_of_stops) {
        var next_pub_index = nearest_nation(available_nations, start_index, route);
        route.add(next_pub_index);
        start_index = next_pub_index;
    }
    route.forEach(function (value) {
        pubrunda.push(nations_of_selected_date[value].pub);
    });
    return pubrunda;
}
/**
 * Computes the distance between two nations, using Pythagorean theorem.
 * @param {Coordinates} n1 - First nations coordinates.
 * @param {Coordinates} n2 - Second nations coordinates.
 * @returns {number} - Distance between the two nations.
 */
function get_distance(n1, n2) {
    for (var _i = 0, coordinates_of_nations_2 = nation_1.coordinates_of_nations; _i < coordinates_of_nations_2.length; _i++) {
        var nation = coordinates_of_nations_2[_i];
        if (n1.name === nation.name) {
            var dx = Math.abs(n1.lat - n2.lat);
            var dy = Math.abs(n1.lng - n2.lng);
            var distance = Math.sqrt((dx * dx) + (dy * dy));
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
function userInput(nationHT) {
    var startPub = prompt("Vilken nation vill du börja på?");
    while (!(0, hashtables_1.ph_lookup)(nationHT, startPub)) {
        startPub = prompt("Felstavat, Kom ihåg stor bokstav och mellanslag!!");
    }
    var nrOfNations = parseInt(prompt("Hur lång ska pubrundan vara? (Max 13)"));
    var result = [(0, hashtables_1.ph_lookup)(nationHT, startPub), nrOfNations];
    return result;
}
