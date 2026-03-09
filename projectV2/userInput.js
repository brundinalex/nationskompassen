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
exports.rl = void 0;
exports.ask = ask;
exports.choice = choice;
exports.newRoute = newRoute;
exports.nationInformation = nationInformation;
var readline = require("readline");
var build_nationGraph_1 = require("./build_nationGraph");
//Creates an interface for typescript to read the terminal
exports.rl = readline.createInterface({ input: process.stdin, output: process.stdout });
/**
 * Wraps rl.question in a Promise to allow async/await usage.
 * @param question - The question to display to the user.
 * @returns The userinput as a string
 */
function ask(question) {
    return new Promise(function (resolve) {
        exports.rl.question(question, function (answer) {
            resolve(answer);
        });
    });
}
/**
 * Displays all open nations with their index and pub name, then prompts
 * the user to choose a starting pub and how many pubs to visit.
 * Reprompts if the chosen index is out of range.
 * @param openNations - Array of currently open NationNodes to choose from.
 * @returns A pair with starting pubname and nr of pubs to visit
 */
function choice(openNations) {
    return __awaiter(this, void 0, void 0, function () {
        var currentNations, _i, openNations_1, nat, pubnameIndex, _a, _b, nrOfPubs, _c, pubname;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    currentNations = (0, build_nationGraph_1.build_nation_index)(openNations);
                    for (_i = 0, openNations_1 = openNations; _i < openNations_1.length; _i++) {
                        nat = openNations_1[_i];
                        console.log("".concat(currentNations.get(nat.orginization), " - ").concat(nat.pub));
                    }
                    _a = parseInt;
                    return [4 /*yield*/, ask("Vilken pub vill du börja på, välj ett nummer? ")];
                case 1:
                    pubnameIndex = _a.apply(void 0, [_d.sent()]);
                    _d.label = 2;
                case 2:
                    if (!(pubnameIndex < 0 || pubnameIndex > openNations.length)) return [3 /*break*/, 4];
                    console.log("Det numret var inte ett möjligt val");
                    _b = parseInt;
                    return [4 /*yield*/, ask("Vilken pub vill du börja på, välj ett nummer? ")];
                case 3:
                    pubnameIndex = _b.apply(void 0, [_d.sent()]);
                    return [3 /*break*/, 2];
                case 4:
                    _c = parseInt;
                    return [4 /*yield*/, ask("Hur många pubbar vill du besöka? ")];
                case 5:
                    nrOfPubs = _c.apply(void 0, [_d.sent()]);
                    pubname = openNations[pubnameIndex].orginization;
                    return [2 /*return*/, [pubname, nrOfPubs]];
            }
        });
    });
}
/**
 * Asks the user if they want to plan a new pub route.
 * @returns A promise either true or false based on user input
 */
function newRoute() {
    return __awaiter(this, void 0, void 0, function () {
        var answer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ask("Vill du göra en ny pubrunda? Y/N: ")];
                case 1:
                    answer = _a.sent();
                    if (answer.toLowerCase() === "n") {
                        console.log("SKÅL");
                        return [2 /*return*/, false];
                    }
                    else {
                        return [2 /*return*/, true];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Asks the user if they want contact information for the pubs in their route.
 * @returns A promise either true or false based on user input
 */
function nationInformation() {
    return __awaiter(this, void 0, void 0, function () {
        var answer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ask("Vill du ha kontaktinformation till pubbarna i din pubrunda? Y/N: ")];
                case 1:
                    answer = _a.sent();
                    if (answer.toLowerCase() === "n") {
                        return [2 /*return*/, false];
                    }
                    else {
                        return [2 /*return*/, true];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
