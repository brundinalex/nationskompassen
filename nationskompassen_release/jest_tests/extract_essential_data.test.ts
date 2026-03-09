import { get_open_pubs, extract_essentials } from "../extract_essential_data";
import { NationGuideCategory, NationGuideEvent, NationNode } from "../../lib/nation";

//          Test-cases of extract_essential_data.ts

// --------------------------------------------------
// get_open_pubs tests
// --------------------------------------------------
describe("get_open_pubs", () => {
    test("get_open_pubs extracts all events from a Pub category", () => {
        const events: NationGuideEvent[] = [ 
            {
                title: "Pub A", 
                permalink: "",
                image: "",
                schedule: "",
                organiser: { title: "Stockholms nation", permalink: "" }
            },
            {
                title: "Pub B",
                permalink: "",
                image: "",
                schedule: "",
                organiser: { title: "Uplands nation", permalink: "" }
            }
        ];

        const pubs: NationGuideCategory[] = [
            {
                title: "Pub",
                icon: "",
                open: true,
                events: events
            }
        ];

        const open_pubs: NationGuideEvent[] = get_open_pubs(pubs);

        expect(open_pubs).toEqual(events);
    });

    test("get_open_pubs ignores non-Pub categories", () => {
        const breakfast: NationGuideEvent[] = [
            {
                title: "Frukost A", 
                permalink: "",
                image: "",
                schedule: "",
                organiser: { title: "Norrlands nation", permalink: "" }
            },
        ];

        const pubs: NationGuideEvent[] = [ 
            {
                title: "Pub A", 
                permalink: "",
                image: "",
                schedule: "",
                organiser: { title: "Stockholms nation", permalink: "" }
            },
            {
                title: "Pub B",
                permalink: "",
                image: "",
                schedule: "",
                organiser: { title: "Uplands nation", permalink: "" }
            }
        ];

        const categories: NationGuideCategory[] = [
            {
                title: "Frukost",
                icon: "",
                open: true,
                events: breakfast,
            },
            {
                title: "Pub",
                icon: "",
                open: true,
                events: pubs
            }
        ];

        const open_pubs: NationGuideEvent[] = get_open_pubs(categories);

        let boolean = true;

        for (const events of open_pubs) {
            if (events.title === "Frukost A") {
                boolean = false;
            }
        }

        expect(boolean).toEqual(true);
    });

    test("get_open_pubs returns an empty NationGuideEvent[] if there are no Pubs", () => {
        const breakfast: NationGuideEvent[] = [
            {
                title: "Frukost A", 
                permalink: "",
                image: "",
                schedule: "",
                organiser: { title: "Norrlands nation", permalink: "" }
            },
        ];

        const categories: NationGuideCategory[] = [
            {
                title: "Frukost",
                icon: "",
                open: true,
                events: breakfast,
            }
        ];

        const open_pubs: NationGuideEvent[] = get_open_pubs(categories);

        expect(open_pubs).toEqual([]);
    });

    test("get_open_pubs returns an empty array if json_parsed is an empty array", () => {
        const json_parsed: NationGuideCategory[] = [];

        const open_pubs: NationGuideEvent[] = get_open_pubs(json_parsed);

        expect(open_pubs).toEqual([]);
    });

    test("get_open_pubs filters only categories which title strictly equals 'Pub'", () => {
        const pub: NationGuideEvent[] = [
            {
                title: "pub A", 
                permalink: "",
                image: "",
                schedule: "",
                organiser: { title: "Norrlands nation", permalink: "" }
            },
        ];

        const categories: NationGuideCategory[] = [
            {
                title: "pub",
                icon: "",
                open: true,
                events: pub,
            }
        ];

        const open_pubs: NationGuideEvent[] = get_open_pubs(categories);

        expect(open_pubs).toEqual([]);
    });
})

// --------------------------------------------------
// extract_essentials tests
// --------------------------------------------------
describe("extract_essentials", () => {
    test("extract_essentials converts a single event into a NationNode", () => {

        const events: NationGuideEvent[] = [
            {
                title: "Pub A",
                permalink: "",
                image: "",
                schedule: "18:00",
                organiser: { title: "Stockholms nation", permalink: "" }
            }
        ];

        const result: NationNode[] = extract_essentials(events);

        expect(result.length).toEqual(1);
        expect(result[0].orginization).toEqual("Stockholms nation");
        expect(result[0].pub).toEqual("Pub A");
        expect(result[0].schedule).toEqual("18:00");
    });

    test("extract_essentials preserves the order of events", () => {

        const events: NationGuideEvent[] = [
            {
                title: "Pub A",
                permalink: "",
                image: "",
                schedule: "18:00",
                organiser: { title: "Stockholms nation", permalink: "" }
            },
            {
                title: "Pub B",
                permalink: "",
                image: "",
                schedule: "19:00",
                organiser: { title: "Uplands nation", permalink: "" }
            }
        ];

        const result = extract_essentials(events);

        expect(result[0].pub).toEqual("Pub A");
        expect(result[1].pub).toEqual("Pub B");
    });

    test("extract_essentials returns same number of NationNodes as events", () => {

        const events: NationGuideEvent[] = [
            {
                title: "Pub A",
                permalink: "",
                image: "",
                schedule: "18:00",
                organiser: { title: "Stockholms nation", permalink: "" }
            },
            {
                title: "Pub B",
                permalink: "",
                image: "",
                schedule: "19:00",
                organiser: { title: "Kalmar nation", permalink: "" }
            }
        ];

        const result = extract_essentials(events);

        expect(result.length).toEqual(events.length);
    });

    test("extract_essentials assigns default contact [['N/A','N/A']]", () => {

        const events: NationGuideEvent[] = [
            {
                title: "Pub A",
                permalink: "",
                image: "",
                schedule: "",
                organiser: { title: "Stockholms nation", permalink: "" }
            }
        ];

        const result = extract_essentials(events);

        expect(result[0].contact).toEqual([["N/A","N/A"]]);
    });

    test("extract_essentials sets weight to NaN", () => {

        const events: NationGuideEvent[] = [
            {
                title: "Pub A",
                permalink: "",
                image: "",
                schedule: "",
                organiser: { title: "Stockholms nation", permalink: "" }
            }
        ];

        const result = extract_essentials(events);

        expect(Number.isNaN(result[0].weight)).toEqual(true);
    });

    test("extract_essentials correctly assigns coordinates", () => {

        const events: NationGuideEvent[] = [
            {
                title: "Pub A",
                permalink: "",
                image: "",
                schedule: "",
                organiser: { title: "Uplands nation", permalink: "" }
            }
        ];

        const result = extract_essentials(events);

        expect(result[0].coordinate.name).toEqual("Uplands nation");
    });

    test("extract_essentials works for multiple nations", () => {

        const events: NationGuideEvent[] = [
            {
                title: "Pub A",
                permalink: "",
                image: "",
                schedule: "",
                organiser: { title: "Stockholms nation", permalink: "" }
            },
            {
                title: "Pub B",
                permalink: "",
                image: "",
                schedule: "",
                organiser: { title: "Kalmar nation", permalink: "" }
            }
        ];

        const result: NationNode[] = extract_essentials(events);

        expect(result[0].coordinate.name).toEqual("Stockholms nation");
        expect(result[1].coordinate.name).toEqual("Kalmar nation");
    });

    test("extract_essentials returns an empty array when input is empty", () => {

        const events: NationGuideEvent[] = [];

        const result = extract_essentials(events);

        expect(result).toEqual([]);
    });
})


// --------------------------------------------------
// Edge-case tests
// --------------------------------------------------
describe("edge-cases ectract_essentials", () => {
    test("extract_essentials returns an empty NationGuideEvent[] if no valid organiser is found", () => {

        const events: NationGuideEvent[] = [
            {
                title: "Unknown Pub",
                permalink: "",
                image: "",
                schedule: "",
                organiser: { title: "Fake nation", permalink: "" }
            }
        ];

        const result = extract_essentials(events);
        expect(result).toHaveLength(0);
    });

    test("extract_essentials does not modify the original input array", () => {

        const events: NationGuideEvent[] = [
            {
                title: "Pub A",
                permalink: "",
                image: "",
                schedule: "",
                organiser: { title: "Stockholms nation", permalink: "" }
            }
        ];

        const copy = structuredClone(events);

        extract_essentials(events);

        expect(events).toEqual(copy);
    });

    test("extract_essentials handles events with identical organisers", () => {

        const events: NationGuideEvent[] = [
            {
                title: "Pub A",
                permalink: "",
                image: "",
                schedule: "",
                organiser: { title: "Stockholms nation", permalink: "" }
            },
            {
                title: "Pub B",
                permalink: "",
                image: "",
                schedule: "",
                organiser: { title: "Stockholms nation", permalink: "" }
            }
        ];

        const result = extract_essentials(events);

        expect(result[0].coordinate.name).toEqual("Stockholms nation");
        expect(result[1].coordinate.name).toEqual("Stockholms nation");
    });
})
