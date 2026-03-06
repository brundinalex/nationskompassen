import { ListGraph, lg_bfs_visit_order, lg_dfs_visit_order } from "./graphs";
import { type Pair } from "./list";
import { hash_id, HashFunction, ph_empty, ph_insert, ph_lookup, ProbingHashtable } from './hashtables';

// GLÖM INTE TYP-EXEMPEL

// TYPES FOR THE JSON-RESPONSE SO WE CAN AVOID TYPE ANY !!!
/**
 * A {AJAXresponse} is a record {dates: string, event_categories: string}.
 * The value of the key {dates} is a string containing a JSON-formated array of dates.
 * The value of the key {event_categories} is a string containing a JSON-formated array of event categories.
 * Invariant:
 *  The record follows the structure of the JSON-response from nationsguiden.se, which is expected to have the keys {dates} and
 *  {event_categories} with their respective string values and formats.
 */
export type AJAXresponse = {
    dates: string
    event_categories: string
}

/**
 * A {NationGuideCategory} is a record {title: string, icon: string, open: boolean, events: NationGuideEvent[]}.
 * The value of the key {title} is a string representing the title of the event category.
 * The value of the key {icon} is a string representing the URL of the icon for the event category.
 * The value of the key {open} is a boolean indicating whether the event category is open or not.
 * The value of the key {events} is an array of {NationGuideEvent} objects representing the events in the category.
 * Invariant:
 *  The record follows the structure of the event_category objects in the JSON-response from nationsguiden.se, i.e following the
 *  structure found in AJAXresponse.event_categories.
 */
export type NationGuideCategory = {
    title: string,
    icon: string,
    open: boolean,
    events: NationGuideEvent[];
}

/**
 * A {NationGuideEvent} is a record {title: string, permalink: string, image: string, schedule: string, organiser: { title: string, permalink: string }}.
 * The value of the key {title} is a string representing the title of the event.
 * The value of the key {permalink} is a string representing the URL of the event's page on nationsguiden.se.
 * The value of the key {image} is a string representing the URL of the image for the event.
 * The value of the key {schedule} is a string representing the schedule of the event.
 * The value of the key {organiser} is a record with keys {title} and {permalink}, where {title} is a string representing the
 * title of the organiser and {permalink} is a string representing the URL of the organiser's page on nationsguiden.se.
 * Invariant:
 *  The record follows the structure of the event objects in the JSON-response from nationsguiden.se, i.e following the
 *  structure found in AJAXresponse.event_categories.events.
 */
export type NationGuideEvent = {
    title: string,
    permalink: string,
    image: string,
    schedule: string,
    organiser: { title: string, permalink: string }
}

/**
 * A {NationMatrix} is a graph represented as a 2D-matrix where each 'node' is a NationNode.
 */
export type NationMatrix = Array<Array<NationNode>>

/**
 * A {NationIndex} is a map Map<string, number>.
 * The key of the map is a string representing the title (name) of a nation. The number associated with each key represents an
 * index of that nation (in this program an index of that nation in a NationMatrix).
 * Invariant:
 *  The number associated with each key is non-negative.
 */
export type NationIndex = Map<string, number>;
/**
 * A {NationNode} is a record {orginization: string, pub: string, schedule: string, contact: Array<[string, string]>,
 *                             coordinate: coordinates, weight: number}.
 * The value of the key {orginization} is a string representing the name of the nation.
 * The value of the key {pub} is a string representing the name of the pub associated with the nation.
 * The value of the key {schedule} is a string representing the schedule of the nation.
 * The value of the key {contact} ..........
 * The value of the key {coordinate} is a Coordinates.
 */
export type NationNode = { orginization: string,
                pub: string,
                schedule: string,
                contact: Array<[string, string]>,
                coordinate: Coordinates,
                weight: number
            }
/**
 * A {Coordinates} is a record {name: string, lat: number, lng: number}.
 * The value of the key {name} is a string representing the name of a nation.
 * The value of the key {lat} is a number representing the latitude of the nation.
 * The value of the key {lng} is a number representing the longitude of the nation.
 * Invariant:
 *  the string of {name} is equal to the string that Nationsguiden.se uses to name a nation.
 */
export type Coordinates = {name: string, lat: number, lng: number }

// All 13 nations declater as Coordinates.
const stockholms_nation_cor: Coordinates =            { name: "Stockholms nation", lat: 59.856661, lng: 17.634163 }
const uplands_nation_cor: Coordinates=                { name: "Uplands nation", lat: 59.859728, lng: 17.629315 }
const gästrike_hälsingland_nation_cor: Coordinates =  { name: "Gästrike-Hälsinge nation", lat: 59.856263, lng: 17.636763 }
const östgöra_nation_cor: Coordinates =               { name: "Östgöta nation", lat: 59.855211, lng: 17.638281 }
const västgöta_nation_cor: Coordinates =              { name: "Västgöta nation", lat: 59.856710, lng: 17.638541 }
const södermanlands_nerikes_nation_cor: Coordinates = { name: "Södermanlands-Nerikes nation", lat: 59.85904, lng: 17.63073 }
const västmanlands_dala_nation_cor: Coordinates =     { name: "Västmanlands-Dala nation", lat: 59.86021, lng: 17.62890 }
const smålands_nation_cor: Coordinates =              { name: "Smålands nation", lat: 59.85919, lng: 17.63121 }
const göteborgs_nation_cor: Coordinates =             { name: "Göteborgs nation", lat: 59.859447, lng: 17.630017 }
const kalmar_nation_cor: Coordinates =                { name: "Kalmar nation", lat: 59.85906, lng: 17.62704 }
const värmlands_nation_cor: Coordinates =             { name: "Värmlands nation", lat: 59.856708, lng: 17.633470 }
const norrlands_nation_cor: Coordinates =             { name: "Norrlands nation", lat: 59.857350, lng: 17.638009 }
const gotlands_nation_cor: Coordinates =              { name: "Gotlands nation", lat: 59.859837, lng: 17.634898 }

// All 13 Coordinates stored in an Array.
export const coordinates_of_nations: Array<Coordinates> = [
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


// These are for the hashtable, maybe remove? mabye save?
export type NationTable = ProbingHashtable<string, Nation>

export type VisitedNation = [string, number, boolean]

export type Nation = { orginization: string,
                pub: string,
                schedule: string,
                contact: Array<[string, string]>,
                coordinate: Coordinates,
                sorted_nation_distance: Array<VisitedNation>
                }