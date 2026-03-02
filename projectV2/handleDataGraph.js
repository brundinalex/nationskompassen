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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_open_pubs = get_open_pubs;
exports.extract_essentials = extract_essentials;
exports.build_nation_index2 = build_nation_index2;
exports.build_nationDistance_matrix2 = build_nationDistance_matrix2;
exports.createRoute = createRoute;
exports.userInput = userInput;
var nation_1 = require("../lib/nation");
var hashtables_1 = require("../lib/hashtables");
//Sparar alla nationers namn vars pub är öppen 
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
// Plockar ut organization.title, pub.title & schedule
function extract_essentials(nation_arr) {
    function get_cor(nation_to_compare) {
        for (var _i = 0, coordinates_of_nations_1 = nation_1.coordinates_of_nations; _i < coordinates_of_nations_1.length; _i++) {
            var nation_cor = coordinates_of_nations_1[_i];
            if (nation_cor.name === nation_to_compare.organiser.title) {
                return nation_cor;
            }
        }
        return undefined;
    }
    var nations_of_selected_date = [];
    function find_objet_coordinates(object) {
        for (var _i = 0, coordinates_of_nations_2 = nation_1.coordinates_of_nations; _i < coordinates_of_nations_2.length; _i++) {
            var nation = coordinates_of_nations_2[_i];
            if (object.organiser.title === nation.name) {
                return nation;
            }
        }
        return { name: "fel", lat: 1000000, lng: 1000000 };
    }
    for (var _i = 0, nation_arr_1 = nation_arr; _i < nation_arr_1.length; _i++) {
        var object = nation_arr_1[_i];
        var valid_nation = { orginization: object.organiser.title,
            pub: object.title,
            schedule: object.schedule,
            contact: [["hej", "hej"]], //fixa array med konakt info,
            coordinate: get_cor(object),
            weight: NaN };
        nations_of_selected_date.push(valid_nation);
    }
    return nations_of_selected_date;
}
//Matrix Graph testing
function build_nation_index(nation) {
    var index = new Map();
    for (var i = 0; i < nation.length; i++) {
        index.set(nation[i].name, i);
    }
    return index;
}
function build_nation_index2(nations_of_selected_date) {
    var index = new Map();
    for (var i = 0; i < nations_of_selected_date.length; i++) {
        index.set(nations_of_selected_date[i].orginization, i);
    }
    return index;
}
// function build_nationDistance_matrix(nation: Array<coordinates>): NationMatrix {
//     const matrix: NationMatrix = [];
//     for(let i = 0; i < nation.length; i++) {
//         matrix[i] = [];
//         for(let j = 0; j < nation.length; j++) {
//             if(i === j) {
//                 matrix[i][j] = 0
//             } else {
//                 matrix[i][j] = get_distance(nation[i], nation[j]);
//             }
//         }
//     }
//     return matrix;
// }
function build_nationDistance_matrix2(nations) {
    var matrix = [];
    for (var i = 0; i < nations.length; i++) {
        matrix[i] = [];
        for (var j = 0; j < nations.length; j++) {
            var weight = i === j
                ? 0
                : get_distance(nations[i].coordinate, nations[j].coordinate);
            // Create a fresh copy for this matrix cell
            matrix[i][j] = __assign(__assign({}, nations[j]), { coordinate: __assign({}, nations[j].coordinate), contact: __spreadArray([], nations[j].contact, true), weight: weight });
        }
    }
    return matrix;
}
function nearestNation(m, index, alreadyVisisted) {
    var shortestDistance = Infinity;
    var closestIndex = undefined;
    for (var i = 0; i < m[index].length; i++) {
        if (alreadyVisisted.has(i))
            continue;
        else if (m[index][i].weight === 0)
            continue;
        else if (m[index][i].weight < shortestDistance) {
            shortestDistance = m[index][i].weight;
            closestIndex = i;
        }
    }
    return closestIndex;
}
function createRoute(userInfo, c) {
    var availableNations = build_nationDistance_matrix2(c);
    var indexDecode = build_nation_index2(c);
    var firstNation = userInfo[0];
    var nr = userInfo[1];
    var route = new Set();
    var startIndex = indexDecode.get(firstNation);
    var pubrunda = [];
    route.add(startIndex);
    while (route.size < nr) {
        var nextPubIndex = nearestNation(availableNations, startIndex, route);
        route.add(nextPubIndex);
        startIndex = nextPubIndex;
    }
    route.forEach(function (value) {
        pubrunda.push(c[value].pub);
    });
    return pubrunda;
}
//hashtable code under
function get_distance(n1, n2) {
    for (var _i = 0, coordinates_of_nations_3 = nation_1.coordinates_of_nations; _i < coordinates_of_nations_3.length; _i++) {
        var nation = coordinates_of_nations_3[_i];
        if (n1.name === nation.name) {
            var dx = Math.abs(n1.lat - n2.lat);
            var dy = Math.abs(n1.lng - n2.lng);
            var distance = Math.sqrt((dx * dx) + (dy * dy));
            return distance;
        }
    }
    //should return undefined otherwise, and avoid using promises (!).
    return 0;
}
function userInput(nationHT) {
    var startPub = prompt("Vilken nation vill du börja på?");
    while (!(0, hashtables_1.ph_lookup)(nationHT, startPub)) {
        startPub = prompt("Felstavat, Kom ihåg stor bokstav och mellanslag!!");
    }
    var nrOfNations = parseInt(prompt("Hur lång ska pubrundan vara? (Max 13)"));
    var result = [(0, hashtables_1.ph_lookup)(nationHT, startPub), nrOfNations];
    return result;
}
