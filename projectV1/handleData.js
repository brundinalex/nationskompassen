"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.open_nation_pubs = open_nation_pubs;
exports.userInput = userInput;
exports.make_runda = make_runda;
var nation_1 = require("../lib/nation");
var hashtables_1 = require("../lib/hashtables");
var collectData_1 = require("./collectData");
function open_nation_pubs(json_parsed) {
    //Sparar alla nationers namn vars pub är öppen 
    function get_open_pubs(json_parsed) {
        var open_pubs = [];
        for (var _i = 0, json_parsed_1 = json_parsed; _i < json_parsed_1.length; _i++) {
            var event_1 = json_parsed_1[_i];
            if (event_1.title === "Pub") {
                var pub = event_1;
                for (var _a = 0, _b = pub.events; _a < _b.length; _a++) {
                    var nation = _b[_a];
                    open_pubs.push(nation);
                }
            }
        }
        return open_pubs;
    }
    // Plockar ut organization.title, pub.title & schedule
    function extract_essentials(nationarray) {
        function get_cor(nation) {
            for (var _i = 0, nations_1 = nation_1.nations; _i < nations_1.length; _i++) {
                var nation_cor = nations_1[_i];
                if (nation_cor.name === nation.organiser.title) {
                    return nation_cor;
                }
            }
        }
        var nationer = [];
        for (var _i = 0, nationarray_1 = nationarray; _i < nationarray_1.length; _i++) {
            var result = nationarray_1[_i];
            var nation = { orginization: result.organiser.title,
                pub: result.title,
                schedule: result.schedule,
                contact: [["hej", "hej"]], //fixa array med konakt info,
                coordinate: get_cor(result),
                sorted_nation_distance: get_shortest_distance(result, nation_1.nations) };
            nationer.push(nation);
        }
        return nationer;
    }
    function convert_to_hash_table(nations) {
        // Another hash function if needed.
        var hash_func = function (key) {
            var hash = 0;
            for (var i = 0; i < key.length; i++) {
                hash = hash * 31 + key.charCodeAt(i);
            }
            return hash;
        };
        if (nations.length === 0) {
            var new_empty_ht = (0, hashtables_1.ph_empty)(1, hash_func);
            return new_empty_ht;
        }
        else {
            var new_ht = (0, hashtables_1.ph_empty)(nations.length, hash_func);
            for (var _i = 0, nations_2 = nations; _i < nations_2.length; _i++) {
                var nation = nations_2[_i];
                (0, hashtables_1.ph_insert)(new_ht, nation.orginization, nation);
            }
            return new_ht;
        }
    }
    return convert_to_hash_table(extract_essentials(get_open_pubs((0, collectData_1.getEvents)())));
}
function get_distance(n1, n2) {
    for (var _i = 0, nations_3 = nation_1.nations; _i < nations_3.length; _i++) {
        var nation = nations_3[_i];
        if (n1.organiser.title === nation.name) {
            var dx = Math.abs(n1.lat - n2.lat);
            var dy = Math.abs(n1.lng - n2.lng);
            var distance = Math.sqrt((dx * dx) + (dy * dy));
            return distance;
        }
    }
    return 0;
}
function get_shortest_distance(n1, nations) {
    var distances = [];
    var current_smallest = 1;
    var current_closest = n1;
    for (var _i = 0, nations_4 = nations; _i < nations_4.length; _i++) {
        var nation = nations_4[_i];
        if (nation.name === n1.orginization) {
            // distances.push(1);
            distances.push([nation.name, false]);
        }
        else {
            var distance = get_distance(n1, nation);
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
    while (addedPubs < nrOfPubs) {
        while (currentPub.sorted_nation_distance[tempCounter][0][1]) {
            tempCounter = tempCounter + 1;
        }
        currentPub.sorted_nation_distance[tempCounter][1] = true;
        var nextPub = currentPub.sorted_nation_distance[tempCounter][0][0];
        pubrunda.push(nextPub);
        var newCurrent = (0, hashtables_1.ph_lookup)(nationHT, nextPub);
        currentPub = newCurrent;
        tempCounter = 0;
    }
    return pubrunda;
}
