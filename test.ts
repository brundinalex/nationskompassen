import * as cheerio from "cheerio";
import { ListGraph, lg_bfs_visit_order, lg_dfs_visit_order } from "./lib/graphs";
// import { lg_shortest_path } from "./homework10/shortest_path";
// import { toHashtable, descendants } from "./homework9/person_table";

// type Nation = {name: string, lat: number, lng: number}
type Nation = { orginization: string,
                pub: string,
                schedule: string,
                contact: Array<[string, string]>,
                coordinates: coordinates,
                sorted_nation_distance: Array<[Pair<[string, boolean]>]>
            }
type coordinates = {name: string, lat: number, lng: number }

// , relative_distance: Array<number>

const stockholms_nation_cor: coordinates =            { name: "Stockholms nation", lat: 59.856661, lng: 17.634163 }
const upplands_nation_cor: coordinates=               { name: "Upplands nation", lat: 59.859728, lng: 17.629315 }
const gästrike_hälsingland_nation_cor: coordinates =  { name: "Gästrike-Hälsinge nation", lat: 59.856263, lng: 17.636763 }
const östgöra_nation_cor: coordinates =               { name: "Östgöta nation", lat: 59.855211, lng: 17.638281 }
const västgöta_nation_cor: coordinates =              { name: "Västgöta nation", lat: 59.856710, lng: 17.638541 }
const södermanlands_nerikes_nation_cor: coordinates = { name: "Södermanlands-Nerikes nation", lat: 59.85904, lng: 17.63073 }
const västmanlands_dala_nation_cor: coordinates =     { name: "Västmanlands-Dala nation", lat: 59.86021, lng: 17.62890 }
const smålands_nation_cor: coordinates =              { name: "Smålands nation", lat: 59.85919, lng: 17.63121 }
const göteborgs_nation_cor: coordinates =             { name: "Göteborgs nation", lat: 59.859447, lng: 17.630017 }
const kalmar_nation_cor: coordinates =                { name: "Kalmar nation", lat: 59.85906, lng: 17.62704 }
const värmlands_nation_cor: coordinates =             { name: "Värmlands nation", lat: 59.856708, lng: 17.633470 }
const norrlands_nation_cor: coordinates =             { name: "Norrlands nation", lat: 59.857350, lng: 17.638009 }
const gotlands_nation_cor: coordinates =              { name: "Gotlands nation", lat: 59.859837, lng: 17.634898 }


const nations: Array<coordinates> = [
    stockholms_nation_cor,
    upplands_nation_cor,
    gästrike_hälsingland_nation_cor,
    östgöra_nation_cor,
    västgöta_nation_cor,
    södermanlands_nerikes_nation_cor,
    västmanlands_dala_nation_cor,
    smålands_nation_cor,
    göteborgs_nation_cor,
    kalmar_nation_cor,
    värmlands_nation_cor,
    norrlands_nation_cor,
    gotlands_nation_cor
];

// // Generated with chat-gpt
// const nations: Array<coordinates> = [
//   { name: "Stockholms nation", lat: 59.856661, lng: 17.634163 },
//   { name: "Upplands nation", lat: 59.859728, lng: 17.629315 },
//   { name: "Gästrike-Hälsinge nation", lat: 59.856263, lng: 17.636763 },
//   { name: "Östgöta nation", lat: 59.855211, lng: 17.638281 },
//   { name: "Västgöta nation", lat: 59.856710, lng: 17.638541 },
//   { name: "Södermanlands-Nerikes nation", lat: 59.85904, lng: 17.63073 },
//   { name: "Västmanlands-Dala nation", lat: 59.86021, lng: 17.62890 },
//   { name: "Smålands nation", lat: 59.85919, lng: 17.63121 },
//   { name: "Göteborgs nation", lat: 59.859447, lng: 17.630017 },
//   { name: "Kalmar nation", lat: 59.85906, lng: 17.62704 },
//   { name: "Värmlands nation", lat: 59.856708, lng: 17.633470 },
//   { name: "Norrlands nation", lat: 59.857350, lng: 17.638009 },
//   { name: "Gotlands nation", lat: 59.859837, lng: 17.634898 }
// ];

async function getEvents() {
  const res = await fetch(
    "https://www.nationsguiden.se/wp-admin/admin-ajax.php",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        action: "di_filter_events",
        nonce: "80b93a5453",
        selected_date: "2026-02-24",
        only_load_dates: "false"
      })
    }
  );

  const data = await res.json();
    // event_categories is a STRING
    const categories = JSON.parse(data.event_categories);
    return categories;
}

function open_nation_pubs(json_parsed: any): hashtable {

    //Sparar alla nationers namn vars pub är öppen 
    function get_open_pubs(json_parsed: any): Array<Nation> {
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
    function extract_essentials(nationarray: Array<object>): Array<Nation> {

        for(const result of nationarray) {

        }
    } 

    function converty_to_hash(Array<Nation>)
}


function get_pubs(json_parsed: any): any {
        //let events = [];
    for (const event of json_parsed) {
        if (event.title === "Pub") {
            const pub = event;
            for (const nation of pub.events) {
                //console.log(nation);
                console.log(nation.title," / ", nation.schedule, " / ", nation.organiser.title)
                console.log("----------------")
            }
        }
    }
}

function remove_element<T>(arr: Array<T>, el: T): Array<T> {
    let new_arr = [];
    for (let i: number = 0; i < arr.length; i++) {
        if (arr[i] !== el) {
            new_arr.push(arr[i]);
        }
    }
    return new_arr;
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
// get_shortest_distance(stockholms_nation, nations);
// console.log(get_distance(stockholms_nation, värmlands_nation));

function make_runda(initial: Nation, nations: Array<Nation>): Array<string> {
    let pubrunda: Array<string> = [initial.name];
    let current = initial;
    //nations = remove_element(nations, current);
    for (let i: number = 0; i < nations.length; i++) {
        const closest = get_shortest_distance(current, nations)
        pubrunda.push(closest.name);
        //nations = remove_element(nations, current);
        current = closest;
        
    }
    return pubrunda;
}

async function main() {
  try {
    const categories = await getEvents();
    console.log(categories[2].events);
    //get_pubs(categories);
    // console.log(get_distance(nations[0], nations[1]));
  } catch (err) {
    console.error(err);
  }
}
main();



/**
 * vissa nationer går inte att boka
 * välja om man vill göra en bokningsbar pubrunda eller inte?
 */
console.log("Hello world! This is a test file for Nationskompassen.");