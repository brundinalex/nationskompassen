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
exports.build_nation_index = build_nation_index;
exports.build_nation_distance_matrix = build_nation_distance_matrix;
var nation_1 = require("../lib/nation");
function get_distance(n1, n2) {
    for (var _i = 0, coordinates_of_nations_1 = nation_1.coordinates_of_nations; _i < coordinates_of_nations_1.length; _i++) {
        var nation = coordinates_of_nations_1[_i];
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
