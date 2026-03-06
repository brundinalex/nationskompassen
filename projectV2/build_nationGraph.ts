import { type Coordinates, coordinates_of_nations, type NationIndex,
         type NationMatrix, type NationNode
        } from "../lib/nation"

function get_distance(n1: Coordinates, n2: Coordinates): number {

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