// KOM IHÅG SÄG AI!!!!!!!!!!!!!!!!!!!!!!!!!!!
export async function getEvents() {


    const res = await fetch(
        "https://www.nationsguiden.se/wp-admin/admin-ajax.php",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            action: "di_filter_events",
            nonce: "2fbfbafd32",
            selected_date: new Date().toISOString().split('T')[0],
            only_load_dates: "false"
        })
    }
    );
    

    const data = await res.json();
    // event_categories is a STRING
    const categories = JSON.parse(data.event_categories);
    return categories;
}


// make as statement to another type on return categories.