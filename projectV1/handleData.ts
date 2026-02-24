


export function open_nation_pubs(json_parsed: any): hashtable {

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

    function converty_to_hash(arr: Array<Nation>): any {
        return null
    }
}

export function convert_to_hash_table(nations: Array<Nation>): NationTable {

    // Another hash function if needed.

    const hash_func = (key: number): number => {
        let hash = 0
        for (let i = 0; i < key.toString().length; i++) {
            hash = hash * 31 + key.toString().charCodeAt(i);
        }
        return hash;
    };

    if (nations.length === 0) {
        const new_empty_ht: NationTable = ph_empty(1, hash_func);
        return new_empty_ht;
    }
}

function get_distance(n1: Nation, n2: Nation): number {
    const dx: number = Math.abs(n1.lat - n2.lat);
    const dy: number = Math.abs(n1.lng - n2.lng);
    const distance: number = Math.sqrt((dx * dx) + (dy * dy));
    return distance;
}

function get_shortest_distance(n1: Nation, nations: Array<Nation>): Nation {
    let distances: Array<number> = [];
    let current_smallest: number = 1;
    let current_closest: Nation = n1;
    for (const nation of nations) {
        if (nation.name === n1.name) {
            distances.push(1);
        } else {
            const distance = get_distance(n1, nation)
            distances.push(distance);
            if (distance < current_smallest) {
                current_smallest = distance;
                current_closest = nation;
            }
        }
    }
    console.log(distances);
    console.log(current_smallest);
    console.log(current_closest);

    return current_closest;
}

function userInput(): Pair<Nation, number> {
    let startPub = prompt("Vilken nation vill du börja på?");
    while(startPub !== nation_table) {
        startPub = prompt("Felstavat, Kom ihåg stor bokstav och mellanslag!!")
    }
    let nrOfNations = parseInt(prompt("Hur lång ska pubrundan vara? (Max 13)")!)
    const result: Pair<Nation, number> = [stringToNation(startPub!), nrOfNations]
    return result;
}

function make_runda(initial: Nation, userInfo: Pair<Nation, number>, nations: Array<Nation>): Array<string> {
    let currentPub: Nation = userInfo[0];
    const nrOfPubs: number = userInfo[1];
    let addedPubs: number = 0;
    let tempCounter: number = 0;
    let pubrunda: Array<string> = [currentPub.pub];
    while(addedPubs < nrOfPubs) {
        while(currentPub.sorted_nation_distance[tempCounter][0][1]){
            tempCounter = tempCounter + 1;
        }
        currentPub.sorted_nation_distance[tempCounter][0][1] = true;
        let nextPub = currentPub.sorted_nation_distance[tempCounter][0][0];
        pubrunda.push(nextPub);
        let newCurrent = stringToNation(nextPub);
        currentPub = newCurrent;
        tempCounter = 0;
    }
    return pubrunda;
}
