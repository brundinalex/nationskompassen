import { type Coordinates, coordinates_of_nations, type NationNode,
         type NationGuideCategory, type NationGuideEvent
        } from "../lib/nation"
/**
 * Extracts all NationGuideEvent objects from categories whose title is "Pub".
 * Iterates through the provided NationGuideCategory array and collects every
 * event belonging to categories named "Pub".
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
    function get_organiser_coordinates(nation_of_interest: NationGuideEvent): Coordinates | undefined {
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