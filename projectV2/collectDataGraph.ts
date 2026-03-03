import { AXAJresponse, NationGuideCategory, NationGuideEvent } from "../lib/nation";
// KOM IHÅG SÄG AI!!!!!!!!!!!!!!!!!!!!!!!!!!!
export async function getEvents(): Promise<NationGuideCategory[]> {


    const res = await fetch(
        "https://www.nationsguiden.se/wp-admin/admin-ajax.php",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            action: "di_filter_events",
            nonce: "bd3ce3b5a5",
            selected_date: new Date().toISOString().split('T')[0],
            //selected_date: "YYYY-MM-DD",
            only_load_dates: "false"
        })
    }
    );
    

    const data = await res.json() as AXAJresponse;
    // event_categories is a STRING
    const categories = JSON.parse(data.event_categories) as NationGuideCategory[];
    return categories;
}


// make as statement to another type on return categories.