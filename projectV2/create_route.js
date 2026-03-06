"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create_route = create_route;
var build_nationGraph_1 = require("./build_nationGraph");
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
    var available_nations = (0, build_nationGraph_1.build_nation_distance_matrix)(nations_of_selected_date);
    var index_decode = (0, build_nationGraph_1.build_nation_index)(nations_of_selected_date);
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
