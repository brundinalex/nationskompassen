import { AJAXresponse, NationGuideCategory, NationGuideEvent } from "../lib/nation";

/**
 * Sends an AJAX-call and tries to get an AJAX-response from nationsguiden.se.
 * NOTE: This function is AI generated with openAI ChatGPT-5.
 * @returns a parsed version of the JSON formated AJAX-response.
 * @precondition - the used URL for nationsguiden is online and all headers and payload for nationsguiden are valid.
 */
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
            nonce: "87a912e791",
            selected_date: new Date().toISOString().split('T')[0],  //Gets the current date.
            only_load_dates: "false"
        })
    }
    );
    
    // Parses the JSON formated data from strings to JavaScript objects.
    const data = await res.json() as AJAXresponse;
    const categories = JSON.parse(data.event_categories) as NationGuideCategory[];
    return categories;
};