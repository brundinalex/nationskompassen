"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_open_pubs = get_open_pubs;
exports.extract_essentials = extract_essentials;
var nation_1 = require("../lib/nation");
/**
 * Extracts all NationGuideEvent objects from categories whose title is "Pub".
 * Iterates through the provided NationGuideCategory array and collects every
 * event belonging to categories named "Pub".
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
