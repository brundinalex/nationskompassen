"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
function create_current_nation(json_parsed) {
}
// , relative_distance: Array<number>
var stockholms_nation_cor = { name: "Stockholms nation", lat: 59.856661, lng: 17.634163 };
var upplands_nation_cor = { name: "Upplands nation", lat: 59.859728, lng: 17.629315 };
var gästrike_hälsingland_nation_cor = { name: "Gästrike-Hälsinge nation", lat: 59.856263, lng: 17.636763 };
var östgöra_nation_cor = { name: "Östgöta nation", lat: 59.855211, lng: 17.638281 };
var västgöta_nation_cor = { name: "Västgöta nation", lat: 59.856710, lng: 17.638541 };
var södermanlands_nerikes_nation_cor = { name: "Södermanlands-Nerikes nation", lat: 59.85904, lng: 17.63073 };
var västmanlands_dala_nation_cor = { name: "Västmanlands-Dala nation", lat: 59.86021, lng: 17.62890 };
var smålands_nation_cor = { name: "Smålands nation", lat: 59.85919, lng: 17.63121 };
var göteborgs_nation_cor = { name: "Göteborgs nation", lat: 59.859447, lng: 17.630017 };
var kalmar_nation_cor = { name: "Kalmar nation", lat: 59.85906, lng: 17.62704 };
var värmlands_nation_cor = { name: "Värmlands nation", lat: 59.856708, lng: 17.633470 };
var norrlands_nation_cor = { name: "Norrlands nation", lat: 59.857350, lng: 17.638009 };
var gotlands_nation_cor = { name: "Gotlands nation", lat: 59.859837, lng: 17.634898 };
var nations = [
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
function getEvents() {
    return __awaiter(this, void 0, void 0, function () {
        var res, data, categories;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("https://www.nationsguiden.se/wp-admin/admin-ajax.php", {
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
                    })];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    data = _a.sent();
                    categories = JSON.parse(data.event_categories);
                    return [2 /*return*/, categories];
            }
        });
    });
}
function get_pubs(json_parsed) {
    //let events = [];
    for (var _i = 0, json_parsed_1 = json_parsed; _i < json_parsed_1.length; _i++) {
        var event_1 = json_parsed_1[_i];
        if (event_1.title === "Pub") {
            var pub = event_1;
            for (var _a = 0, _b = pub.events; _a < _b.length; _a++) {
                var nation = _b[_a];
                //console.log(nation);
                console.log(nation.title, " / ", nation.schedule, " / ", nation.organiser.title);
                console.log("----------------");
            }
        }
    }
}
function remove_element(arr, el) {
    var new_arr = [];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] !== el) {
            new_arr.push(arr[i]);
        }
    }
    return new_arr;
}
// function get_distance(n1: Nation, n2: Nation): number {
//     const dx: number = Math.abs(n1.lat - n2.lat);
//     const dy: number = Math.abs(n1.lng - n2.lng);
//     const distance: number = Math.sqrt((dx * dx) + (dy * dy));
//     return distance;
// }
// function get_shortest_distance(n1: Nation, nations: Array<Nation>): Nation {
//     let distances: Array<number> = [];
//     let current_smallest: number = 1;
//     let current_closest: Nation = n1;
//     for (const nation of nations) {
//         if (nation.name === n1.name) {
//             distances.push(1);
//         } else {
//             const distance = get_distance(n1, nation)
//             distances.push(distance);
//             if (distance < current_smallest) {
//                 current_smallest = distance;
//                 current_closest = nation;
//             }
//         }
//     }
//     console.log(distances);
//     console.log(current_smallest);
//     console.log(current_closest);
//     return current_closest;
// }
// get_shortest_distance(stockholms_nation, nations);
// console.log(get_distance(stockholms_nation, värmlands_nation));
// function make_runda(initial: Nation, nations: Array<Nation>): Array<string> {
//     let pubrunda: Array<string> = [initial.name];
//     let current = initial;
//     //nations = remove_element(nations, current);
//     for (let i: number = 0; i < nations.length; i++) {
//         const closest = get_shortest_distance(current, nations)
//         pubrunda.push(closest.name);
//         //nations = remove_element(nations, current);
//         current = closest;
//     }
//     return pubrunda;
// }
// [
//   'Stockholms nation',
//   'Värmlands nation',
//   'Stockholms nation',
//   'Gästrike-Hälsinge nation',
//   'Norrlands nation',
//   'Västgöta nation',
//   'Östgöta nation',
//   'Gotlands nation'
// console.log(make_runda(stockholms_nation, nations));
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var categories, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, getEvents()];
                case 1:
                    categories = _a.sent();
                    console.log(categories[7]);
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    console.error(err_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
main();
/**
 * vissa nationer går inte att boka
 * välja om man vill göra en bokningsbar pubrunda eller inte?
 */
console.log("Hello world! This is a test file for Nationskompassen.");
