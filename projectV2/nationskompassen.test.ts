import { get_open_pubs } from "./extract_essential_data";
import { NationGuideCategory, NationGuideEvent } from "../lib/nation";


//          Test-cases of extract_essential_data.ts

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

    let boolean = true
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

