function open_nation_pubs(json_parsed: any): hashtable {

    //Sparar alla nationers namn vars pub är öppen 
    function get_open_pubs(json_parsed: any): Array<any> {
        const open_pubs = [];
        for (const event of json_parsed) {
            if (event.title === "Pub") {
                const pub = event;
                for (const nation of pub.events) {
                open_pubs.push(nation)
                }
            }
        }
    return open_pubs;
    }

    // Plockar ut organization.title, pub.title & schedule
    function extract_essentials(nationarray: Array<any>): Array<Nation> | null {
        function get_cor(nation: any): coordinates | undefined {
            for (const nation_cor of nations) {
                if (nation_cor.name === nation.organiser.title) {
                    return nation_cor;
                }
            }
        }
        const nationer: Array<Nation> = [];

        for(const result of nationarray) {
            const nation: Nation = { orginization: result.organiser.title,
                                     pub: result.title,
                                    schedule: result.schedule,
                                    contact: "hej", //fixa array med konakt info,
                                    coordinate: get_cor(result)!,
                                    sorted_nation_distance: undefined
            };

            nationer.push(nation);
        }

        return nationer;
    } 
}