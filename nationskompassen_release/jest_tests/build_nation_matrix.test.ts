import { type NationNode, type NationMatrix } from "../../lib/nation";
import { get_distance, 
         build_nation_index, build_nation_distance_matrix 
       } from "../build_nation_matrix";

// --------------------
// Test data for nodes
// --------------------
const node1: NationNode = {
    orginization: "Stockholms nation",
    pub: "Pub1",
    schedule: "18:00",
    contact: [["N/A", "N/A"]],
    coordinate: { name: "Stockholms nation", lat: 59.856661, lng: 17.634163 },
    weight: NaN
};

const node2: NationNode = {
    orginization: "Uplands nation",
    pub: "Pub2",
    schedule: "19:00",
    contact: [["N/A", "N/A"]],
    coordinate: { name: "Uplands nation", lat: 59.859728, lng: 17.629315 },
    weight: NaN
};

const nodeInvalid: NationNode = {
    orginization: "Nonexistent nation",
    pub: "PubX",
    schedule: "20:00",
    contact: [["N/A", "N/A"]],
    coordinate: { name: "Nonexistent nation", lat: 0, lng: 0 },
    weight: NaN
};

// --------------------
// get_distance tests
// --------------------
describe("get_distance", () => {
    test("distance between a nation and itself should be 0", () => {
        const dist = get_distance(node1.coordinate, node1.coordinate);
        expect(dist).toBe(0);
    });

    test("distance between two valid nations should be > 0", () => {
        const dist = get_distance(node1.coordinate, node2.coordinate);
        expect(dist).toBeGreaterThan(0);
    });

    test("distance for a nation not in coordinates_of_nations should return NaN", () => {
        const dist = get_distance(nodeInvalid.coordinate, node2.coordinate);
        expect(dist).toBeNaN();
    });

    test("distance symmetric: distance(a,b) === distance(b,a) for valid nations", () => {
        const d1 = get_distance(node1.coordinate, node2.coordinate);
        const d2 = get_distance(node2.coordinate, node1.coordinate);
        expect(d1).toEqual(d2);
    });
});

// --------------------
// build_nation_index tests
// --------------------
describe("build_nation_index", () => {
    test("correctly maps each nation's name to its index", () => {
        const nodes: NationNode[] = [node1, node2];
        const indexMap = build_nation_index(nodes);
        expect(indexMap.get("Stockholms nation")).toBe(0);
        expect(indexMap.get("Uplands nation")).toBe(1);
    });

    test("returns empty map when input is empty", () => {
        const indexMap = build_nation_index([]);
        expect(indexMap.size).toBe(0);
    });

    test("map contains all input nations, including invalid ones", () => {
        const nodes: NationNode[] = [node1, nodeInvalid];
        const indexMap = build_nation_index(nodes);
        expect(indexMap.get("Stockholms nation")).toBe(0);
        expect(indexMap.get("Nonexistent nation")).toBe(1);
    });
});

// --------------------
// build_nation_distance_matrix tests
// --------------------
describe("build_nation_distance_matrix", () => {
    test("matrix diagonal weights are 0", () => {
        const nodes: NationNode[] = [node1, node2];
        const matrix = build_nation_distance_matrix(nodes);
        expect(matrix[0][0].weight).toBe(0);
        expect(matrix[1][1].weight).toBe(0);
    });

    test("matrix off-diagonal weights are positive for valid nations", () => {
        const nodes: NationNode[] = [node1, node2];
        const matrix = build_nation_distance_matrix(nodes);
        expect(matrix[0][1].weight).toBeGreaterThan(0);
        expect(matrix[1][0].weight).toBeGreaterThan(0);
    });

    test("matrix retains all nation properties", () => {
        const nodes: NationNode[] = [node1];
        const matrix = build_nation_distance_matrix(nodes);
        expect(matrix[0][0].pub).toBe("Pub1");
        expect(matrix[0][0].orginization).toBe("Stockholms nation");
    });

    test("matrix with invalid nations has NaN weights", () => {
        const nodes: NationNode[] = [node1, nodeInvalid];
        const matrix = build_nation_distance_matrix(nodes);
        expect(matrix[0][1].weight).toBeNaN();
        expect(matrix[1][0].weight).toBeNaN();
    });

    test("matrix size matches input nodes length", () => {
        const nodes: NationNode[] = [node1, node2, nodeInvalid];
        const matrix = build_nation_distance_matrix(nodes);
        expect(matrix.length).toBe(nodes.length);
        expect(matrix[0].length).toBe(nodes.length);
        expect(matrix[1].length).toBe(nodes.length);
    });

    test("matrix is symmetric for valid nations", () => {
        const nodes: NationNode[] = [node1, node2];
        const matrix = build_nation_distance_matrix(nodes);
        expect(matrix[0][1].weight).toEqual(matrix[1][0].weight);
    });
});

// --------------------
// integration test: build index + distance matrix
// --------------------
describe("integration tests for nation graph", () => {
    test("index and matrix correspond correctly", () => {
        const nodes: NationNode[] = [node1, node2];
        const indexMap = build_nation_index(nodes);
        const matrix = build_nation_distance_matrix(nodes);

        const firstNodeIndex = indexMap.get("Stockholms nation")!;
        expect(matrix[firstNodeIndex][0].orginization).toBe("Stockholms nation");
        expect(matrix[firstNodeIndex][1].orginization).toBe("Uplands nation");
    });
});