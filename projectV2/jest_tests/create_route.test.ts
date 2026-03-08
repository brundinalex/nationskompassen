import { create_route, nearest_nation } from "../create_route"
import { pair } from "../../lib/list"
import { NationNode, NationMatrix } from "../../lib/nation"

//          Test-cases of create_route.ts

// --------------------------------------------------
// nearest_nation tests:
// --------------------------------------------------
describe("nearest_nation", () => {

    test("returns index of closest nation", () => {

        const matrix: NationMatrix = [
            [
                { weight: 0 },
                { weight: 10 },
                { weight: 5 }
            ],
            [
                { weight: 10 },
                { weight: 0 },
                { weight: 2 }
            ],
            [
                { weight: 5 },
                { weight: 2 },
                { weight: 0 }
            ]
        ] as NationMatrix

        const visited = new Set<number>([0])

        const result = nearest_nation(matrix, 0, visited)

        expect(result).toBe(2)
    })

    test("skips already visited nations", () => {

        const matrix: NationMatrix = [
            [
                { weight: 0 },
                { weight: 10 },
                { weight: 5 }
            ]
        ] as NationMatrix

        const visited = new Set<number>([0,2])

        const result = nearest_nation(matrix, 0, visited)

        expect(result).toBe(1)
    })

    test("ignores weight 0 (self node)", () => {

        const matrix: NationMatrix = [
            [
                { weight: 0 },
                { weight: 0 },
                { weight: 5 }
            ]
        ] as NationMatrix

        const visited = new Set<number>([0])

        const result = nearest_nation(matrix, 0, visited)

        expect(result).toBe(2)
    })

    test("returns undefined if all nations are visited", () => {

        const matrix: NationMatrix = [
            [
                { weight: 0 },
                { weight: 3 }
            ]
        ] as NationMatrix

        const visited = new Set<number>([0,1])

        const result = nearest_nation(matrix, 0, visited)

        expect(result).toBeUndefined()
    })

    test("returns undefined if only weight 0 nodes exist", () => {

        const matrix: NationMatrix = [
            [
                { weight: 0 },
                { weight: 0 }
            ]
        ] as NationMatrix

        const visited = new Set<number>([0])

        const result = nearest_nation(matrix, 0, visited)

        expect(result).toBeUndefined()
    })

})

// --------------------------------------------------
// create_route tests:
// --------------------------------------------------
describe("create_route", () => {

    const mockNodes: NationNode[] = [
        {
            orginization: "Norrlands nation",
            pub: "PubA",
            schedule: "18:00",
            contact: [["N/A","N/A"]],
            coordinate: { name:"Norrlands nation", lat:0, lng:0 },
            weight: 0
        },
        {
            orginization: "Uplands nation",
            pub: "PubB",
            schedule: "19:00",
            contact: [["N/A","N/A"]],
            coordinate: { name:"Uplands nation", lat:0, lng:1 },
            weight: 0
        },
        {
            orginization: "Värmlands nation",
            pub: "PubC",
            schedule: "20:00",
            contact: [["N/A","N/A"]],
            coordinate: { name:"Värmlands nation", lat:1, lng:1 },
            weight: 0
        }
    ]

    test("returns empty array if no nations exist", () => {

        const user = pair("Norrlands nation", 3)

        const result = create_route(user, [])

        expect(result).toEqual([])
    })

    test("returns route starting from selected nation", () => {

        const user = pair("Norrlands nation", 1)

        const result = create_route(user, mockNodes)

        expect(result[0]).toBe("PubA")
    })

    test("route length equals number_of_stops when possible", () => {

        const user = pair("Norrlands nation", 3)

        const result = create_route(user, mockNodes)

        expect(result.length).toBe(3)
    })

    test("does not revisit the same pub", () => {

        const user = pair("Norrlands nation", 3)

        const result = create_route(user, mockNodes)

        const unique = new Set(result)

        expect(unique.size).toBe(result.length)
    })

    test("stops early if not enough pubs exist", () => {

        const user = pair("Norrlands nation", 10)

        const result = create_route(user, mockNodes)

        expect(result.length).toBeLessThanOrEqual(mockNodes.length)
    })

    test("route always contains valid pub names", () => {

        const user = pair("Norrlands nation", 3)

        const result = create_route(user, mockNodes)

        result.forEach(pub => {
            expect(["PubA","PubB","PubC"]).toContain(pub)
        })
    })

})

// --------------------------------------------------
// integration tests:
// --------------------------------------------------
describe("integration tests (route generation)", () => {

    test("route generation works across multiple nations", () => {
                const nodes: NationNode[] = [
        {
            orginization: "Norrlands nation",
            pub: "Pub1",
            schedule: "18:00",
            contact: [["N/A","N/A"]],
            coordinate: { name:"Norrlands nation", lat:0, lng:0 },
            weight: 0
        },
        {
            orginization: "Uplands nation",
            pub: "Pub2",
            schedule: "19:00",
            contact: [["N/A","N/A"]],
            coordinate: { name:"Uplands nation", lat:0, lng:2 },
            weight: 0
        },
        {
            orginization: "Värmlands nation",
            pub: "Pub3",
            schedule: "20:00",
            contact: [["N/A","N/A"]],
            coordinate: { name:"Värmlands nation", lat:1, lng:1 },
            weight: 0
        }
    ]
        const user = pair("Norrlands nation", 3)

        const result = create_route(user, nodes)

        expect(result.length).toBe(3)
        expect(result[0]).toBe("Pub1")
    })

    test("integration: route never includes undefined pubs", () => {

        const nodes: NationNode[] = [
            {
                orginization: "NationX",
                pub: "PubX",
                schedule: "18:00",
                contact: [["N/A","N/A"]],
                coordinate: { name:"NationX", lat:1, lng:1 },
                weight: 0
            }
        ]

        const user = pair("NationX", 3)

        const result = create_route(user, nodes)

        result.forEach(pub => {
            expect(pub).toBeDefined()
        })
    })

})