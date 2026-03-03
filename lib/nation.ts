import { ListGraph, lg_bfs_visit_order, lg_dfs_visit_order } from "./graphs";
import { type Pair } from "./list";
import { hash_id, HashFunction, ph_empty, ph_insert, ph_lookup, ProbingHashtable } from './hashtables';

// import { lg_shortest_path } from "./homework10/shortest_path";
// import { toHashtable, descendants } from "./homework9/person_table";

// type Nation = {name: string, lat: number, lng: number}

// TYPES FOR THE JSON-RESPONSE SO WE CAN AVOID TYPE ANY !!!
export type AXAJresponse = {
    dates: string
    event_categories: string
}
export type NationGuideCategory = {
    title: string,
    icon: string,
    open: boolean,
    events: NationGuideEvent[];
}
export type NationGuideEvent = {
    title: string,
    permalink: string,
    image: string,
    schedule: string,
    organiser: { title: string, permalink: string }
}


export type NationTable = ProbingHashtable<string, Nation>

export type NationMatrix = Array<Array<NationNode>>
export type NationIndex = Map<string, number>;

export type VisitedNation = [string, number, boolean]

export type Nation = { orginization: string,
                pub: string,
                schedule: string,
                contact: Array<[string, string]>,
                coordinate: coordinates,
                sorted_nation_distance: Array<VisitedNation>
            }
export type NationNode = { orginization: string,
                pub: string,
                schedule: string,
                contact: Array<[string, string]>,
                coordinate: coordinates,
                weight: number
            }
export type coordinates = {name: string, lat: number, lng: number }

// , relative_distance: Array<number>

const stockholms_nation_cor: coordinates =            { name: "Stockholms nation", lat: 59.856661, lng: 17.634163 }
const uplands_nation_cor: coordinates=               { name: "Uplands nation", lat: 59.859728, lng: 17.629315 }
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


export const coordinates_of_nations: Array<coordinates> = [
    stockholms_nation_cor,
    uplands_nation_cor,
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