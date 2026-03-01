"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.open_nation_pubs = open_nation_pubs;
exports.userInput = userInput;
exports.make_runda = make_runda;
var nation_1 = require("../lib/nation");
var hashtables_1 = require("../lib/hashtables");
function open_nation_pubs(json_parsed) {
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
                sorted_nation_distance: get_shortest_distance(find_objet_coordinates(object), nation_1.coordinates_of_nations) };
            nations_of_selected_date.push(valid_nation);
        }
        return nations_of_selected_date;
    }
    function convert_to_hash_table(nations_of_selected_date) {
        // Another hash function if needed.
        var hash_func = function (key) {
            var hash = 0;
            for (var i = 0; i < key.length; i++) {
                hash = hash * 31 + key.charCodeAt(i);
            }
            return hash;
        };
        if (nations_of_selected_date.length === 0) {
            var new_empty_ht = (0, hashtables_1.ph_empty)(1, hash_func);
            return new_empty_ht;
        }
        else {
            var new_ht = (0, hashtables_1.ph_empty)(nations_of_selected_date.length, hash_func);
            for (var _i = 0, nations_of_selected_date_1 = nations_of_selected_date; _i < nations_of_selected_date_1.length; _i++) {
                var nation = nations_of_selected_date_1[_i];
                (0, hashtables_1.ph_insert)(new_ht, nation.orginization, nation);
            }
            return new_ht;
        }
    }
    return convert_to_hash_table(extract_essentials(get_open_pubs(json_parsed)));
}
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
function get_shortest_distance(n1, coordinates_of_nations) {
    var distances = [];
    var current_smallest = 1;
    var current_closest = n1;
    for (var _i = 0, coordinates_of_nations_4 = coordinates_of_nations; _i < coordinates_of_nations_4.length; _i++) {
        var nation = coordinates_of_nations_4[_i];
        if (nation.name === n1.name) {
            // distances.push(distance)
            distances.push([nation.name, 0, false]);
        }
        else {
            var distance = get_distance(n1, nation);
            //distances.push(distance);
            distances.push([nation.name, distance, false]);
            if (distance < current_smallest) {
                current_smallest = distance;
                current_closest = nation;
            }
        }
    }
    var sorted_distances = distances.sort(function (a, b) { return a[1] - b[1]; });
    return sorted_distances;
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
function make_runda(nationHT, userInfo) {
    var currentPub = userInfo[0];
    var nrOfPubs = userInfo[1];
    var addedPubs = 0;
    var tempCounter = 0;
    var pubrunda = [currentPub.pub];
    currentPub.sorted_nation_distance[tempCounter][0][1] = true;
    while (addedPubs < nrOfPubs) {
        while (currentPub.sorted_nation_distance[tempCounter][0][1]) {
            tempCounter = tempCounter + 1;
        }
        currentPub.sorted_nation_distance[tempCounter][0][1] = true;
        var nextPub = currentPub.sorted_nation_distance[tempCounter][0];
        var newCurrent = (0, hashtables_1.ph_lookup)(nationHT, nextPub[0]); //funkar inte atm
        pubrunda.push(newCurrent.pub);
        currentPub = newCurrent;
        tempCounter = 0;
        addedPubs += 1;
    }
    return pubrunda;
}
