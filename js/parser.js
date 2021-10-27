// PARSING =============================================================================================================
Parser = {};
Parser._parse_aToB = function (abMap, a, fallback) {
	if (a === undefined || a === null) throw new TypeError("undefined or null object passed to parser");
	if (typeof a === "string") a = a.trim();
	if (abMap[a] !== undefined) return abMap[a];
	return fallback !== undefined ? fallback : a;
};

Parser._parse_bToA = function (abMap, b, fallback) {
	if (b === undefined || b === null) throw new TypeError("undefined or null object passed to parser");
	if (typeof b === "string") b = b.trim();
	for (const v in abMap) {
		if (!abMap.hasOwnProperty(v)) continue;
		if (abMap[v] === b) return v;
	}
	return fallback !== undefined ? fallback : b;
};

Parser.attrChooseToFull = function (attList) {
	if (attList.length === 1) return `${Parser.attAbvToFull(attList[0])} modifier`;
	else {
		const attsTemp = [];
		for (let i = 0; i < attList.length; ++i) {
			attsTemp.push(Parser.attAbvToFull(attList[i]));
		}
		return `${attsTemp.join(" or ")} modifier (your choice)`;
	}
};

Parser.numberToText = function (number) {
	if (number == null) throw new TypeError(`undefined or null object passed to parser`);
	if (Math.abs(number) >= 100) return `${number}`;

	function getAsText (num) {
		const abs = Math.abs(num);
		switch (abs) {
			case 0: return "zero";
			case 1: return "one";
			case 2: return "two";
			case 3: return "three";
			case 4: return "four";
			case 5: return "five";
			case 6: return "six";
			case 7: return "seven";
			case 8: return "eight";
			case 9: return "nine";
			case 10: return "ten";
			case 11: return "eleven";
			case 12: return "twelve";
			case 13: return "thirteen";
			case 14: return "fourteen";
			case 15: return "fifteen";
			case 16: return "sixteen";
			case 17: return "seventeen";
			case 18: return "eighteen";
			case 19: return "nineteen";
			case 20: return "twenty";
			case 30: return "thirty";
			case 40: return "forty";
			case 50: return "fiddy"; // :^)
			case 60: return "sixty";
			case 70: return "seventy";
			case 80: return "eighty";
			case 90: return "ninety";
			default: {
				const str = String(abs);
				return `${getAsText(Number(`${str[0]}0`))}-${getAsText(Number(str[1]))}`;
			}
		}
	}
	return `${number < 0 ? "negative " : ""}${getAsText(number)}`;
};

Parser.textToNumber = function (str) {
	str = str.trim().toLowerCase();
	if (!isNaN(str)) return Number(str);
	switch (str) {
		case "zero": return 0;
		case "one": case "a": case "an": return 1;
		case "two": return 2;
		case "three": return 3;
		case "four": return 4;
		case "five": return 5;
		case "six": return 6;
		case "seven": return 7;
		case "eight": return 8;
		case "nine": return 9;
		case "ten": return 10;
		case "eleven": return 11;
		case "twelve": return 12;
		case "thirteen": return 13;
		case "fourteen": return 14;
		case "fifteen": return 15;
		case "sixteen": return 16;
		case "seventeen": return 17;
		case "eighteen": return 18;
		case "nineteen": return 19;
		case "twenty": return 20;
		case "thirty": return 30;
		case "forty": return 40;
		case "fifty": case "fiddy": return 50;
		case "sixty": return 60;
		case "seventy": return 70;
		case "eighty": return 80;
		case "ninety": return 90;
	}
	return NaN;
};

Parser.numberToVulgar = function (number) {
	const isNeg = number < 0;
	const spl = `${number}`.replace(/^-/, "").split(".");
	if (spl.length === 1) return number;

	let preDot = spl[0] === "0" ? "" : spl[0];
	if (isNeg) preDot = `-${preDot}`;

	switch (spl[1]) {
		case "125": return `${preDot}⅛`;
		case "25": return `${preDot}¼`;
		case "375": return `${preDot}⅜`;
		case "5": return `${preDot}½`;
		case "625": return `${preDot}⅝`;
		case "75": return `${preDot}¾`;
		case "875": return `${preDot}⅞`;

		default: {
			// Handle recursive
			const asNum = Number(`0.${spl[1]}`);

			if (asNum.toFixed(2) === (1 / 3).toFixed(2)) return `${preDot}⅓`;
			if (asNum.toFixed(2) === (2 / 3).toFixed(2)) return `${preDot}⅔`;

			if (asNum.toFixed(2) === (1 / 6).toFixed(2)) return `${preDot}⅙`;
			if (asNum.toFixed(2) === (5 / 6).toFixed(2)) return `${preDot}⅚`;
		}
	}

	return Parser.numberToFractional(number);
};

Parser.vulgarToNumber = function (str) {
	const [, leading = "0", vulgar = ""] = /^(\d+)?([⅛¼⅜½⅝¾⅞⅓⅔⅙⅚])?$/.exec(str) || [];
	let out = Number(leading);
	switch (vulgar) {
		case "⅛": out += 0.125; break;
		case "¼": out += 0.25; break;
		case "⅜": out += 0.375; break;
		case "½": out += 0.5; break;
		case "⅝": out += 0.625; break;
		case "¾": out += 0.75; break;
		case "⅞": out += 0.875; break;
		case "⅓": out += 1 / 3; break;
		case "⅔": out += 2 / 3; break;
		case "⅙": out += 1 / 6; break;
		case "⅚": out += 5 / 6; break;
		case "": break;
		default: throw new Error(`Unhandled vulgar part "${vulgar}"`);
	}
	return out;
};

Parser.numberToSuperscript = function (number) {
	return `${number}`.split("").map(c => isNaN(c) ? c : Parser._NUMBERS_SUPERSCRIPT[Number(c)]).join("");
};
Parser._NUMBERS_SUPERSCRIPT = "⁰¹²³⁴⁵⁶⁷⁸⁹";

Parser.numberToSubscript = function (number) {
	return `${number}`.split("").map(c => isNaN(c) ? c : Parser._NUMBERS_SUBSCRIPT[Number(c)]).join("");
};
Parser._NUMBERS_SUBSCRIPT = "₀₁₂₃₄₅₆₇₈₉";

Parser._greatestCommonDivisor = function (a, b) {
	if (b < Number.EPSILON) return a;
	return Parser._greatestCommonDivisor(b, Math.floor(a % b));
};
Parser.numberToFractional = function (number) {
	const len = number.toString().length - 2;
	let denominator = 10 ** len;
	let numerator = number * denominator;
	const divisor = Parser._greatestCommonDivisor(numerator, denominator);
	numerator = Math.floor(numerator / divisor);
	denominator = Math.floor(denominator / divisor);

	return denominator === 1 ? String(numerator) : `${Math.floor(numerator)}/${Math.floor(denominator)}`;
};

Parser.ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

Parser.attAbvToFull = function (abv) {
	return Parser._parse_aToB(Parser.ATB_ABV_TO_FULL, abv);
};

Parser.attFullToAbv = function (full) {
	return Parser._parse_bToA(Parser.ATB_ABV_TO_FULL, full);
};

Parser.sizeAbvToFull = function (abv) {
	return Parser._parse_aToB(Parser.SIZE_ABV_TO_FULL, abv);
};

Parser.getAbilityModNumber = function (abilityScore) {
	return Math.floor((abilityScore - 10) / 2);
};

Parser.getAbilityModifier = function (abilityScore) {
	let modifier = Parser.getAbilityModNumber(abilityScore);
	if (modifier >= 0) modifier = `+${modifier}`;
	return `${modifier}`;
};

Parser.getSpeedString = (it) => {
	if (it.speed == null) return "\u2014";

	function procSpeed (propName) {
		function addSpeed (s) {
			stack.push(`${propName === "walk" ? "" : `${propName} `}${getVal(s)} m${getCond(s)}`);
		}

		if (it.speed[propName] || propName === "walk") addSpeed(it.speed[propName] || 0);
		if (it.speed.alternate && it.speed.alternate[propName]) it.speed.alternate[propName].forEach(addSpeed);
	}

	function getVal (speedProp) {
		return speedProp.number != null ? speedProp.number : speedProp;
	}

	function getCond (speedProp) {
		return speedProp.condition ? ` ${Renderer.get().render(speedProp.condition)}` : "";
	}

	const stack = [];
	if (typeof it.speed === "object") {
		let joiner = ", ";
		procSpeed("walk");
		procSpeed("burrow");
		procSpeed("climb");
		procSpeed("fly");
		procSpeed("swim");
		if (it.speed.choose) {
			joiner = "; ";
			stack.push(`${it.speed.choose.from.sort().joinConjunct(", ", " or ")} ${it.speed.choose.amount} m${it.speed.choose.note ? ` ${it.speed.choose.note}` : ""}`);
		}
		return stack.join(joiner) + (it.speed.note ? ` ${it.speed.note}` : "");
	} else {
		return it.speed + (it.speed === "Varies" ? "" : " m ");
	}
};

Parser.SPEED_TO_PROGRESSIVE = {
	"walk": "walking",
	"burrow": "burrowing",
	"climb": "climbing",
	"fly": "flying",
	"swim": "swimming",
};

Parser.speedToProgressive = function (prop) {
	return Parser._parse_aToB(Parser.SPEED_TO_PROGRESSIVE, prop);
};

Parser._addCommas = function (intNum) {
	return `${intNum}`.replace(/(\d)(?=(\d{3})+$)/g, "$1,");
};

Parser.raceCreatureTypesToFull = function (creatureTypes) {
	const hasSubOptions = creatureTypes.some(it => it.choose);
	return creatureTypes
		.map(it => {
			if (!it.choose) return Parser.monTypeToFullObj(it).asText.toTitleCase();
			return [...it.choose]
				.sort(SortUtil.ascSortLower)
				.map(sub => Parser.monTypeToFullObj(sub).asText.toTitleCase())
				.joinConjunct(", ", " or ");
		})
		.joinConjunct(hasSubOptions ? "; " : ", ", " and ")
};

Parser.crToXp = function (cr, {isDouble = false} = {}) {
	if (cr != null && cr.xp) return Parser._addCommas(`${isDouble ? cr.xp * 2 : cr.xp}`);

	const toConvert = cr ? (cr.cr || cr) : null;
	if (toConvert === "Unknown" || toConvert == null || !Parser.XP_CHART_ALT[toConvert]) return "Unknown";
	if (toConvert === "0") return "0 or 10";
	const xp = Parser.XP_CHART_ALT[toConvert];
	return Parser._addCommas(`${isDouble ? 2 * xp : xp}`);
};

Parser.crToXpNumber = function (cr) {
	if (cr != null && cr.xp) return cr.xp;
	const toConvert = cr ? (cr.cr || cr) : cr;
	if (toConvert === "Unknown" || toConvert == null) return null;
	return Parser.XP_CHART_ALT[toConvert] ?? null;
};

LEVEL_TO_XP_EASY = [0, 25, 50, 75, 125, 250, 300, 350, 450, 550, 600, 800, 1000, 1100, 1250, 1400, 1600, 2000, 2100, 2400, 2800];
LEVEL_TO_XP_MEDIUM = [0, 50, 100, 150, 250, 500, 600, 750, 900, 1100, 1200, 1600, 2000, 2200, 2500, 2800, 3200, 3900, 4100, 4900, 5700];
LEVEL_TO_XP_HARD = [0, 75, 150, 225, 375, 750, 900, 1100, 1400, 1600, 1900, 2400, 3000, 3400, 3800, 4300, 4800, 5900, 6300, 7300, 8500];
LEVEL_TO_XP_DEADLY = [0, 100, 200, 400, 500, 1100, 1400, 1700, 2100, 2400, 2800, 3600, 4500, 5100, 5700, 6400, 7200, 8800, 9500, 10900, 12700];
LEVEL_TO_XP_DAILY = [0, 300, 600, 1200, 1700, 3500, 4000, 5000, 6000, 7500, 9000, 10500, 11500, 13500, 15000, 18000, 20000, 25000, 27000, 30000, 40000];

Parser.LEVEL_XP_REQUIRED = [0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000, 85000, 100000, 120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000];

Parser.CRS = ["0", "1/8", "1/4", "1/2", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30"];

Parser.levelToXpThreshold = function (level) {
	return [LEVEL_TO_XP_EASY[level], LEVEL_TO_XP_MEDIUM[level], LEVEL_TO_XP_HARD[level], LEVEL_TO_XP_DEADLY[level]];
};

Parser.isValidCr = function (cr) {
	return Parser.CRS.includes(cr);
};

Parser.crToNumber = function (cr) {
	if (cr === "Unknown" || cr === "\u2014" || cr == null) return VeCt.CR_UNKNOWN;
	if (cr.cr) return Parser.crToNumber(cr.cr);

	const parts = cr.trim().split("/");

	if (parts.length === 1) {
		if (isNaN(parts[0])) return VeCt.CR_CUSTOM;
		return Number(parts[0]);
	} else if (parts.length === 2) {
		if (isNaN(parts[0]) || isNaN(Number(parts[1]))) return VeCt.CR_CUSTOM;
		return Number(parts[0]) / Number(parts[1]);
	} else return 0;
};

Parser.numberToCr = function (number, safe) {
	// avoid dying if already-converted number is passed in
	if (safe && typeof number === "string" && Parser.CRS.includes(number)) return number;

	if (number == null) return "Unknown";

	return Parser.numberToFractional(number);
};

Parser.crToPb = function (cr) {
	if (cr === "Unknown" || cr == null) return 0;
	cr = cr.cr || cr;
	if (Parser.crToNumber(cr) < 5) return 2;
	return Math.ceil(cr / 4) + 1;
};

Parser.levelToPb = function (level) {
	if (!level) return 2;
	return Math.ceil(level / 4) + 1;
};

Parser.SKILL_TO_ATB_ABV = {
	"athletics": "str",
	"acrobatics": "dex",
	"sleight of hand": "dex",
	"stealth": "dex",
	"mechanical manipulation": "dex",
	"stamina": "con",
	"pain tolerance": "con",
	"energenetics": "int",
	"history": "int",
	"investigation": "int",
	"scientific knowledge": "int",
	"computers": "int",
	"memory": "int",
	"animal handling": "wis",
	"insight": "wis",
	"medicine": "wis",
	"perception": "wis",
	"survival": "wis",
	"deception": "cha",
	"intimidation": "cha",
	"performance": "cha",
	"persuasion": "cha",
};

Parser.skillToAbilityAbv = function (skill) {
	return Parser._parse_aToB(Parser.SKILL_TO_ATB_ABV, skill);
};

Parser.SKILL_TO_SHORT = {
	"athletics": "ath",
	"acrobatics": "acro",
	"sleight of hand": "soh",
	"stealth": "slth",
	"mechanical manipulation": "mecm",
	"stamina": "sta",
	"pain tolerance": "ptol",
	"energenetics": "ener",
	"history": "hist",
	"investigation": "invn",
	"scientific knowledge": "sci",
	"computers": "comp",
	"memory": "mem",
	"animal handling": "hndl",
	"insight": "ins",
	"medicine": "med",
	"perception": "perp",
	"survival": "surv",
	"deception": "decp",
	"intimidation": "intm",
	"performance": "perf",
	"persuasion": "pers",
};

Parser.skillToShort = function (skill) {
	return Parser._parse_aToB(Parser.SKILL_TO_SHORT, skill);
};

Parser.LANGUAGES_STANDARD = [
	"Common",
	"Inkling",
	"Engi",
	"Kulrathi",
	"Mantis",
	"Musi",
	"Rockmen",
	"Turian",
	"Vulfen",
	"Zoltan"
	
];

Parser.LANGUAGES_EXOTIC = [
	"Uncommon",
	"Gem",
	"Lanius",
	"Binary",
	"Kandiof",
	"Ancient"

];

Parser.LANGUAGES_SECRET = [
	"Nature",
	"Rogueport"	
];

Parser.LANGUAGES_ALL = [
	...Parser.LANGUAGES_STANDARD,
	...Parser.LANGUAGES_EXOTIC,
	...Parser.LANGUAGES_SECRET,
].sort();

Parser.dragonColorToFull = function (c) {
	return Parser._parse_aToB(Parser.DRAGON_COLOR_TO_FULL, c);
};

Parser.DRAGON_COLOR_TO_FULL = {
	B: "black",
	U: "blue",
	G: "green",
	R: "red",
	W: "white",
	A: "brass",
	Z: "bronze",
	C: "copper",
	O: "gold",
	S: "silver",
};
Parser.alternianColorToFull = function (c) {
	return Parser._parse_aToB(Parser.ALTERNIAN_COLOR_TO_FULL, c);
};

Parser.ALTERNIAN_COLOR_TO_FULL = {
	R: "rust",
	B: "bronze",
	G: "gold",
	L: "lime",
	O: "olive",
	J: "jade",
	T: "teal",
	C: "cobalt",
	I: "Indigo",
	P: "purple",
	V: "violet",
	F: "fuchsia"
};

Parser.acToFull = function (ac, renderer) {
	if (typeof ac === "string") return ac; // handle classic format

	renderer = renderer || Renderer.get();

	let stack = "";
	let inBraces = false;
	for (let i = 0; i < ac.length; ++i) {
		const cur = ac[i];
		const nxt = ac[i + 1];

		if (cur.special != null) {
			if (inBraces) inBraces = false;

			stack += cur.special;
		} else if (cur.ac) {
			const isNxtBraces = nxt && nxt.braces;

			if (!inBraces && cur.braces) {
				stack += "(";
				inBraces = true;
			}

			stack += cur.ac;

			if (cur.from) {
				// always brace nested braces
				if (cur.braces) {
					stack += " (";
				} else {
					stack += inBraces ? "; " : " (";
				}

				inBraces = true;

				stack += cur.from.map(it => renderer.render(it)).join(", ");

				if (cur.braces) {
					stack += ")";
				} else if (!isNxtBraces) {
					stack += ")";
					inBraces = false;
				}
			}

			if (cur.condition) stack += ` ${renderer.render(cur.condition)}`;

			if (inBraces && !isNxtBraces) {
				stack += ")";
				inBraces = false;
			}
		} else {
			stack += cur;
		}

		if (nxt) {
			if (nxt.braces) {
				stack += inBraces ? "; " : " (";
				inBraces = true;
			} else stack += ", ";
		}
	}
	if (inBraces) stack += ")";

	return stack.trim();
};

Parser.drToFull = function (dr, renderer) {
	if (typeof dr == "undefined") return "0"; // handle if there is no dr
	if (typeof dr === "string") return dr; // handle classic format

	renderer = renderer || Renderer.get();

	let stack = "";
	let inBraces = false;
	for (let i = 0; i < dr.length; ++i) {
		const cur = dr[i];
		const nxt = dr[i + 1];

		if (cur.special != null) {
			if (inBraces) inBraces = false;

			stack += cur.special;
		} else if (cur.dr) {
			const isNxtBraces = nxt && nxt.braces;

			if (!inBraces && cur.braces) {
				stack += "(";
				inBraces = true;
			}

			stack += cur.dr;

			if (cur.from) {
				// always brace nested braces
				if (cur.braces) {
					stack += " (";
				} else {
					stack += inBraces ? "; " : " (";
				}

				inBraces = true;

				stack += cur.from.map(it => renderer.render(it)).join(", ");

				if (cur.braces) {
					stack += ")";
				} else if (!isNxtBraces) {
					stack += ")";
					inBraces = false;
				}
			}

			if (cur.condition) stack += ` ${renderer.render(cur.condition)}`;

			if (inBraces && !isNxtBraces) {
				stack += ")";
				inBraces = false;
			}
		} else {
			stack += cur;
		}

		if (nxt) {
			if (nxt.braces) {
				stack += inBraces ? "; " : " (";
				inBraces = true;
			} else stack += ", ";
		}
	}
	if (inBraces) stack += ")";

	return stack.trim();
};

MONSTER_COUNT_TO_XP_MULTIPLIER = [1, 1.5, 2, 2, 2, 2, 2.5, 2.5, 2.5, 2.5, 3, 3, 3, 3, 4];
Parser.numMonstersToXpMult = function (num, playerCount = 3) {
	const baseVal = (() => {
		if (num >= MONSTER_COUNT_TO_XP_MULTIPLIER.length) return 4;
		return MONSTER_COUNT_TO_XP_MULTIPLIER[num - 1];
	})();

	if (playerCount < 3) return baseVal >= 3 ? baseVal + 1 : baseVal + 0.5;
	else if (playerCount > 5) {
		return baseVal === 4 ? 3 : baseVal - 0.5;
	} else return baseVal;
};

Parser.armorFullToAbv = function (armor) {
	return Parser._parse_bToA(Parser.ARMOR_ABV_TO_FULL, armor);
};

Parser.weaponFullToAbv = function (weapon) {
	return Parser._parse_bToA(Parser.WEAPON_ABV_TO_FULL, weapon);
};

Parser._getSourceStringFromSource = function (source) {
	if (source && source.source) return source.source;
	return source;
};
Parser._buildSourceCache = function (dict) {
	const out = {};
	Object.entries(dict).forEach(([k, v]) => out[k.toLowerCase()] = v);
	return out;
};
Parser._sourceFullCache = null;
Parser.hasSourceFull = function (source) {
	Parser._sourceFullCache = Parser._sourceFullCache || Parser._buildSourceCache(Parser.SOURCE_JSON_TO_FULL);
	return !!Parser._sourceFullCache[source.toLowerCase()];
};
Parser._sourceAbvCache = null;
Parser.hasSourceAbv = function (source) {
	Parser._sourceAbvCache = Parser._sourceAbvCache || Parser._buildSourceCache(Parser.SOURCE_JSON_TO_ABV);
	return !!Parser._sourceAbvCache[source.toLowerCase()];
};
Parser._sourceDateCache = null;
Parser.hasSourceDate = function (source) {
	Parser._sourceDateCache = Parser._sourceDateCache || Parser._buildSourceCache(Parser.SOURCE_JSON_TO_DATE);
	return !!Parser._sourceDateCache[source.toLowerCase()];
};
Parser.sourceJsonToFull = function (source) {
	source = Parser._getSourceStringFromSource(source);
	if (Parser.hasSourceFull(source)) return Parser._sourceFullCache[source.toLowerCase()].replace(/'/g, "\u2019");
	if (BrewUtil.hasSourceJson(source)) return BrewUtil.sourceJsonToFull(source).replace(/'/g, "\u2019");
	return Parser._parse_aToB(Parser.SOURCE_JSON_TO_FULL, source).replace(/'/g, "\u2019");
};
Parser.sourceJsonToFullCompactPrefix = function (source) {
	return Parser.sourceJsonToFull(source)
		.replace(UA_PREFIX, UA_PREFIX_SHORT)
		.replace(AL_PREFIX, AL_PREFIX_SHORT)
		.replace(PS_PREFIX, PS_PREFIX_SHORT);
};
Parser.sourceJsonToAbv = function (source) {
	source = Parser._getSourceStringFromSource(source);
	if (Parser.hasSourceAbv(source)) return Parser._sourceAbvCache[source.toLowerCase()];
	if (BrewUtil.hasSourceJson(source)) return BrewUtil.sourceJsonToAbv(source);
	return Parser._parse_aToB(Parser.SOURCE_JSON_TO_ABV, source);
};
Parser.sourceJsonToDate = function (source) {
	source = Parser._getSourceStringFromSource(source);
	if (Parser.hasSourceDate(source)) return Parser._sourceDateCache[source.toLowerCase()];
	if (BrewUtil.hasSourceJson(source)) return BrewUtil.sourceJsonToDate(source);
	return Parser._parse_aToB(Parser.SOURCE_JSON_TO_DATE, source, null);
};

Parser.sourceJsonToColor = function (source) {
	return `source${Parser.sourceJsonToAbv(source)}`;
};

Parser.stringToSlug = function (str) {
	return str.trim().toLowerCase().replace(/[^\w ]+/g, "").replace(/ +/g, "-");
};

Parser.stringToCasedSlug = function (str) {
	return str.replace(/[^\w ]+/g, "").replace(/ +/g, "-");
};

Parser.ITEM_SPELLCASTING_FOCUS_CLASSES = ["Bard", "Cleric", "Druid", "Paladin", "Ranger", "Sorcerer", "Warlock", "Wizard"];

Parser.itemValueToFull = function (item, opts = {isShortForm: false, isSmallUnits: false}) {
	return Parser._moneyToFull(item, "value", "valueMult", opts);
};

Parser.itemValueToFullMultiCurrency = function (item, opts = {isShortForm: false, isSmallUnits: false, multiplier: 1}) {
	return Parser._moneyToFullMultiCurrency(item, "value", "valueMult", opts);
};

Parser.itemVehicleCostsToFull = function (item, isShortForm) {
	return {
		travelCostFull: Parser._moneyToFull(item, "travelCost", "travelCostMult", {isShortForm}),
		shippingCostFull: Parser._moneyToFull(item, "shippingCost", "shippingCostMult", {isShortForm}),
	};
};

Parser.spellComponentCostToFull = function (item, isShortForm) {
	return Parser._moneyToFull(item, "cost", "costMult", {isShortForm});
};

Parser._moneyToFull = function (it, prop, propMult, opts = {isShortForm: false, isSmallUnits: false}) {
	if (it[prop] == null && it[propMult] == null) return "";
	if (it[prop] != null) {
		const {coin, mult} = Parser.getCurrencyAndMultiplier(it[prop], it.currencyConversion);
		return `${(it[prop] * mult).toLocaleString(undefined, {maximumFractionDigits: 5})}${opts.isSmallUnits ? `<span class="small ml-1">${coin}</span>` : ` ${coin}`}`;
	} else if (it[propMult] != null) return opts.isShortForm ? `×${it[propMult]}` : `base value ×${it[propMult]}`;
	return "";
};

Parser._moneyToFullMultiCurrency = function (it, prop, propMult, {isShortForm, multiplier} = {}) {
	if (it[prop]) return it[prop]+" credits"; 

};

Parser.DEFAULT_CURRENCY_CONVERSION_TABLE = [
	{
		coin: "cred",
		mult: 1,
		isFallback: true,
	},
];
Parser.FULL_CURRENCY_CONVERSION_TABLE = [
	{
		coin: "cred",
		mult: 1,
		isFallback: true,
	}
];
Parser.getCurrencyConversionTable = function (currencyConversionId) {
	const fromBrew = currencyConversionId ? MiscUtil.get(BrewUtil.homebrewMeta, "currencyConversions", currencyConversionId) : null;
	const conversionTable = fromBrew && fromBrew.length ? fromBrew : Parser.DEFAULT_CURRENCY_CONVERSION_TABLE;
	if (conversionTable !== Parser.DEFAULT_CURRENCY_CONVERSION_TABLE) conversionTable.sort((a, b) => SortUtil.ascSort(b.mult, a.mult));
	return conversionTable;
};
Parser.getCurrencyAndMultiplier = function (value, currencyConversionId) {
	const conversionTable = Parser.getCurrencyConversionTable(currencyConversionId);

	if (!value) return conversionTable.find(it => it.isFallback) || conversionTable[0];
	if (conversionTable.length === 1) return conversionTable[0];
	if (!Number.isInteger(value) && value < conversionTable[0].mult) return conversionTable[0];

	for (let i = conversionTable.length - 1; i >= 0; --i) {
		if (Number.isInteger(value * conversionTable[i].mult)) return conversionTable[i];
	}

	return conversionTable.last();
};

Parser.COIN_ABVS = ["cred"];
Parser.COIN_ABV_TO_FULL = {
	"cred": "credits"
};
Parser.COIN_CONVERSIONS = [1];

Parser.coinAbvToFull = function (coin) {
	return Parser._parse_aToB(Parser.COIN_ABV_TO_FULL, coin);
};

Parser.itemWeightToFull = function (item, isShortForm) {
	if (item.weight) {
		// Handle pure integers
		if (item.weight === item.weight) return `${item.weight} kg${(item.weightNote ? ` ${item.weightNote}` : "")}`;
	}
	if (item.weightMult) return isShortForm ? `×${item.weightMult}` : `base weight ×${item.weightMult}`;
	return "";
};

Parser.ITEM_RECHARGE_TO_FULL = {
	round: "Every Round",
	restShort: "Short Rest",
	restLong: "Long Rest",
	dawn: "Dawn",
	dusk: "Dusk",
	midnight: "Midnight",
	special: "Special",
	rest: "Rest"
}
Parser.itemRechargeToFull = function (recharge) {
	return Parser._parse_aToB(Parser.ITEM_RECHARGE_TO_FULL, recharge);
};

Parser.ITEM_CABILITY_TO_FULL = {
	"WM":"From Watchmaker",
	"IA":"From Improvised Attachments",
	"AA":"From Advanced Attachments",
	"EA":"From Experimental Attachments",
	"MHO":"From Magister Horologium Opus",
	"DIM":"From Deus Intus Machina",
	"FN":"From Fraudulentus Naturae"
};
Parser.itemCabilityToFull = function (cability) {
	return Parser._parse_aToB(Parser.ITEM_CABILITY_TO_FULL, cability);
};

Parser.ITEM_MAINTENENCECOST_TO_FULL = {
	"0 MP": "0 MP",
	"1 MP": "1 MP",
	"2 MP": "2 MP",
	"3 MP": "3 MP",
	"4 MP": "4 MP",
	"5 MP": "5 MP",
	"6 MP": "6 MP",
	"7 MP": "7 MP",
	"8 MP": "8 MP",
	"9 MP": "9 MP",
	"10 MP": "10 MP"
};
Parser.itemMaintenenceCostToFull = function (MC) {
	return Parser._parse_aToB(Parser.ITEM_MAINTENENCECOST_TO_FULL, MC);
};

Parser._decimalSeparator = (0.1).toLocaleString().substring(1, 2);
Parser._numberCleanRegexp = Parser._decimalSeparator === "." ? new RegExp(/[\s,]*/g, "g") : new RegExp(/[\s.]*/g, "g");
Parser._costSplitRegexp = Parser._decimalSeparator === "." ? new RegExp(/(\d+(\.\d+)?)([csegp]p)/) : new RegExp(/(\d+(,\d+)?)([csegp]p)/);

/** input e.g. "25 gp", "1,000pp" */
Parser.coinValueToNumber = function (value) {
	if (!value) return 0;
	// handle oddities
	if (value === "Varies") return 0;

	value = value
		.replace(/\s*/, "")
		.replace(Parser._numberCleanRegexp, "")
		.toLowerCase();
	const m = Parser._costSplitRegexp.exec(value);
	if (!m) throw new Error(`Badly formatted value "${value}"`);
	const ixCoin = Parser.COIN_ABVS.indexOf(m[0]);
	if (!~ixCoin) throw new Error(`Unknown coin type "${m[0]}"`);
	return Number(m[0]) * Parser.COIN_CONVERSIONS[ixCoin];
};

Parser.weightValueToNumber = function (value) {
	if (!value) return 0;

	if (Number(value)) return Number(value);
	else throw new Error(`Badly formatted value ${value}`);
};

Parser.dmgTypeToFull = function (dmgType) {
	return Parser._parse_aToB(Parser.DMGTYPE_JSON_TO_FULL, dmgType);
};

Parser.skillToExplanation = function (skillType) {
	const fromBrew = MiscUtil.get(BrewUtil.homebrewMeta, "skills", skillType);
	if (fromBrew) return fromBrew;
	return Parser._parse_aToB(Parser.SKILL_JSON_TO_FULL, skillType);
};

Parser.senseToExplanation = function (senseType) {
	senseType = senseType.toLowerCase();
	const fromBrew = MiscUtil.get(BrewUtil.homebrewMeta, "senses", senseType);
	if (fromBrew) return fromBrew;
	return Parser._parse_aToB(Parser.SENSE_JSON_TO_FULL, senseType, ["No explanation available."]);
};

Parser.skillProficienciesToFull = function (skillProficiencies) {
	function renderSingle (skProf) {
		const keys = Object.keys(skProf).sort(SortUtil.ascSortLower);

		const ixChoose = keys.indexOf("choose");
		if (~ixChoose) keys.splice(ixChoose, 1);

		const baseStack = [];
		keys.filter(k => skProf[k]).forEach(k => baseStack.push(Renderer.get().render(`{@skill ${k.toTitleCase()}}`)));

		const chooseStack = [];
		if (~ixChoose) {
			const chObj = skProf.choose;
			if (chObj.from.length === 18) {
				chooseStack.push(`choose any ${!chObj.count || chObj.count === 1 ? "skill" : chObj.count}`);
			} else {
				chooseStack.push(`choose ${chObj.count || 1} from ${chObj.from.map(it => Renderer.get().render(`{@skill ${it.toTitleCase()}}`)).joinConjunct(", ", " and ")}`);
			}
		}

		const base = baseStack.joinConjunct(", ", " and ");
		const choose = chooseStack.join(""); // this should currently only ever be 1-length

		if (baseStack.length && chooseStack.length) return `${base}; and ${choose}`;
		else if (baseStack.length) return base;
		else if (chooseStack.length) return choose;
	}

	return skillProficiencies.map(renderSingle).join(" <i>or</i> ");
};

// sp-prefix functions are for parsing spell data, and shared with the roll20 script
Parser.spSchoolAndSubschoolsAbvsToFull = function (school, subschools) {
	if (!subschools || !subschools.length) return Parser.spSchoolAbvToFull(school);
	else return `${Parser.spSchoolAbvToFull(school)} (${subschools.map(sub => Parser.spSchoolAbvToFull(sub)).join(", ")})`;
};

Parser.spSchoolAbvToFull = function (schoolOrSubschool) {
	const out = Parser._parse_aToB(Parser.SP_SCHOOL_ABV_TO_FULL, schoolOrSubschool);
	if (Parser.SP_SCHOOL_ABV_TO_FULL[schoolOrSubschool]) return out;
	if (BrewUtil.homebrewMeta && BrewUtil.homebrewMeta.spellSchools && BrewUtil.homebrewMeta.spellSchools[schoolOrSubschool]) return BrewUtil.homebrewMeta.spellSchools[schoolOrSubschool].full;
	return out;
};

Parser.spSchoolAndSubschoolsAbvsShort = function (school, subschools) {
	if (!subschools || !subschools.length) return Parser.spSchoolAbvToShort(school);
	else return `${Parser.spSchoolAbvToShort(school)} (${subschools.map(sub => Parser.spSchoolAbvToShort(sub)).join(", ")})`;
};

Parser.spSchoolAbvToShort = function (school) {
	const out = Parser._parse_aToB(Parser.SP_SCHOOL_ABV_TO_SHORT, school);
	if (Parser.SP_SCHOOL_ABV_TO_SHORT[school]) return out;
	if (BrewUtil.homebrewMeta && BrewUtil.homebrewMeta.spellSchools && BrewUtil.homebrewMeta.spellSchools[school]) return BrewUtil.homebrewMeta.spellSchools[school].short;
	return out;
};

Parser.spSchoolAbvToStyle = function (school) { // For homebrew
	const stylePart = Parser.spSchoolAbvToStylePart(school);
	if (!stylePart) return stylePart;
	return `style="${stylePart}"`;
};

Parser.spSchoolAbvToStylePart = function (school) { // For homebrew
	const rawColor = MiscUtil.get(BrewUtil, "homebrewMeta", "spellSchools", school, "color");
	if (!rawColor || !rawColor.trim()) return "";
	const validColor = BrewUtil.getValidColor(rawColor);
	if (validColor.length) return `color: #${validColor};`;
	return "";
};

Parser.getOrdinalForm = function (i) {
	i = Number(i);
	if (isNaN(i)) return "";
	const j = i % 10; const k = i % 100;
	if (j === 1 && k !== 11) return `${i}st`;
	if (j === 2 && k !== 12) return `${i}nd`;
	if (j === 3 && k !== 13) return `${i}rd`;
	return `${i}th`;
};

Parser.spLevelToFull = function (level) {
	if (level === 0) return "Cantrip";
	else return Parser.getOrdinalForm(level);
};

Parser.getArticle = function (str) {
	str = `${str}`;
	str = str.replace(/\d+/g, (...m) => Parser.numberToText(m[0]));
	return /^[aeiou]/.test(str) ? "an" : "a";
};

Parser.spLevelToFullLevelText = function (level, dash) {
	return `${Parser.spLevelToFull(level)}${(level === 0 ? "s" : `${dash ? "-" : " "}level`)}`;
};

Parser.spLevelToSpellPoints = function (lvl) {
	lvl = Number(lvl);
	if (isNaN(lvl) || lvl === 0) return 0;
	return Math.ceil(1.34 * lvl);
};

Parser.spMetaToArr = function (meta) {
	if (!meta) return [];
	return Object.entries(meta)
		.filter(([_, v]) => v)
		.sort(SortUtil.ascSort)
		.map(([k]) => k);
};

Parser.spMetaToFull = function (meta) {
	if (!meta) return "";
	const metaTags = Parser.spMetaToArr(meta);
	if (metaTags.length) return ` (${metaTags.join(", ")})`;
	return "";
};

Parser.spLevelSchoolMetaToFull = function (level, school, meta, subschools) {
	const levelPart = level === 0 ? Parser.spLevelToFull(level).toLowerCase() : `${Parser.spLevelToFull(level)}-level`;
	const levelSchoolStr = level === 0 ? `${Parser.spSchoolAbvToFull(school)} ${levelPart}` : `${levelPart} ${Parser.spSchoolAbvToFull(school).toLowerCase()}`;

	const metaArr = Parser.spMetaToArr(meta);
	if (metaArr.length || (subschools && subschools.length)) {
		const metaAndSubschoolPart = [
			(subschools || []).map(sub => Parser.spSchoolAbvToFull(sub)).join(", "),
			metaArr.join(", "),
		].filter(Boolean).join("; ").toLowerCase();
		return `${levelSchoolStr} (${metaAndSubschoolPart})`;
	}
	return levelSchoolStr;
};

Parser.spTimeListToFull = function (times, isStripTags) {
	return times.map(t => `${Parser.getTimeToFull(t)}${t.condition ? `, ${isStripTags ? Renderer.stripTags(t.condition) : Renderer.get().render(t.condition)}` : ""}`).join(" or ");
};

Parser.getTimeToFull = function (time) {
	return `${time.number ? `${time.number} ` : ""}${time.unit === "bonus" ? "bonus action" : time.unit}${time.number > 1 ? "s" : ""}`;
};

RNG_SPECIAL = "special";
RNG_POINT = "point";
RNG_LINE = "line";
RNG_CUBE = "cube";
RNG_CONE = "cone";
RNG_RADIUS = "radius";
RNG_SPHERE = "sphere";
RNG_HEMISPHERE = "hemisphere";
RNG_CYLINDER = "cylinder"; // homebrew only
RNG_SELF = "self";
RNG_SIGHT = "sight";
RNG_UNLIMITED = "unlimited";
RNG_UNLIMITED_SAME_PLANE = "plane";
RNG_TOUCH = "touch";
Parser.SP_RANGE_TYPE_TO_FULL = {
	[RNG_SPECIAL]: "Special",
	[RNG_POINT]: "Point",
	[RNG_LINE]: "Line",
	[RNG_CUBE]: "Cube",
	[RNG_CONE]: "Cone",
	[RNG_RADIUS]: "Radius",
	[RNG_SPHERE]: "Sphere",
	[RNG_HEMISPHERE]: "Hemisphere",
	[RNG_CYLINDER]: "Cylinder",
	[RNG_SELF]: "Self",
	[RNG_SIGHT]: "Sight",
	[RNG_UNLIMITED]: "Unlimited",
	[RNG_UNLIMITED_SAME_PLANE]: "Unlimited on the same plane",
	[RNG_TOUCH]: "Touch",
};

Parser.spRangeTypeToFull = function (range) {
	return Parser._parse_aToB(Parser.SP_RANGE_TYPE_TO_FULL, range);
};

UNT_METERS = "meter";
UNT_CENTIMETERS = "centimeters";
UNT_DECIMETERS = "decimeters";
UNT_KILOMETERS = "kilometers";
UNT_LIGHTYEARS = "lightyears";
UNT_PARSECS = "parsecs"

Parser.SP_DIST_TYPE_TO_FULL = {
	[UNT_METERS]: "Meters",
	[UNT_CENTIMETERS]: "Centimeters",
	[UNT_DECIMETERS]: "Decimeters",
	[UNT_KILOMETERS]: "Kilometers",
	[UNT_LIGHTYEARS]: "Lightyears",
	[UNT_PARSECS]: "Parsecs",
	[RNG_SELF]: Parser.SP_RANGE_TYPE_TO_FULL[RNG_SELF],
	[RNG_TOUCH]: Parser.SP_RANGE_TYPE_TO_FULL[RNG_TOUCH],
	[RNG_SIGHT]: Parser.SP_RANGE_TYPE_TO_FULL[RNG_SIGHT],
	[RNG_UNLIMITED]: Parser.SP_RANGE_TYPE_TO_FULL[RNG_UNLIMITED],
	[RNG_UNLIMITED_SAME_PLANE]: Parser.SP_RANGE_TYPE_TO_FULL[RNG_UNLIMITED_SAME_PLANE],
};

Parser.spDistanceTypeToFull = function (range) {
	return Parser._parse_aToB(Parser.SP_DIST_TYPE_TO_FULL, range);
};

Parser.SP_RANGE_TO_ICON = {
	[RNG_SPECIAL]: "fa-star",
	[RNG_POINT]: "",
	[RNG_LINE]: "fa-grip-lines-vertical",
	[RNG_CUBE]: "fa-cube",
	[RNG_CONE]: "fa-traffic-cone",
	[RNG_RADIUS]: "fa-hockey-puck",
	[RNG_SPHERE]: "fa-globe",
	[RNG_HEMISPHERE]: "fa-globe",
	[RNG_CYLINDER]: "fa-database",
	[RNG_SELF]: "fa-street-view",
	[RNG_SIGHT]: "fa-eye",
	[RNG_UNLIMITED_SAME_PLANE]: "fa-globe-americas",
	[RNG_UNLIMITED]: "fa-infinity",
	[RNG_TOUCH]: "fa-hand-paper",
};

Parser.spRangeTypeToIcon = function (range) {
	return Parser._parse_aToB(Parser.SP_RANGE_TO_ICON, range);
};

Parser.spRangeToShortHtml = function (range) {
	switch (range.type) {
		case RNG_SPECIAL: return `<span class="fas fa-fw ${Parser.spRangeTypeToIcon(range.type)} help-subtle" title="Special"></span>`;
		case RNG_POINT: return Parser.spRangeToShortHtml._renderPoint(range);
		case RNG_LINE:
		case RNG_CUBE:
		case RNG_CONE:
		case RNG_RADIUS:
		case RNG_SPHERE:
		case RNG_HEMISPHERE:
		case RNG_CYLINDER:
			return Parser.spRangeToShortHtml._renderArea(range);
	}
};
Parser.spRangeToShortHtml._renderPoint = function (range) {
	const dist = range.distance;
	switch (dist.type) {
		case RNG_SELF:
		case RNG_SIGHT:
		case RNG_UNLIMITED:
		case RNG_UNLIMITED_SAME_PLANE:
		case RNG_SPECIAL:
		case RNG_TOUCH: return `<span class="fas fa-fw ${Parser.spRangeTypeToIcon(dist.type)} help-subtle" title="${Parser.spRangeTypeToFull(dist.type)}"></span>`;
		case UNT_METERS:
		case UNT_CENTIMETERS:
		case UNT_DECIMETERS:
		case UNT_KILOMETERS:
		case UNT_LIGHTYEARS:
		case UNT_PARSECS:
		default:
			return `${dist.amount} <span class="ve-small">${Parser.getSingletonUnit(dist.type, true)}</span>`;
	}
};
Parser.spRangeToShortHtml._renderArea = function (range) {
	const size = range.distance;
	return `<span class="fas fa-fw ${Parser.spRangeTypeToIcon(RNG_SELF)} help-subtle" title="Self"></span> ${size.amount}<span class="ve-small">-${Parser.getSingletonUnit(size.type, true)}</span> ${Parser.spRangeToShortHtml._getAreaStyleString(range)}`;
};
Parser.spRangeToShortHtml._getAreaStyleString = function (range) {
	return `<span class="fas fa-fw ${Parser.spRangeTypeToIcon(range.type)} help-subtle" title="${Parser.spRangeTypeToFull(range.type)}"></span>`
};

Parser.spRangeToFull = function (range) {
	switch (range.type) {
		case RNG_SPECIAL: return Parser.spRangeTypeToFull(range.type);
		case RNG_POINT: return Parser.spRangeToFull._renderPoint(range);
		case RNG_LINE:
		case RNG_CUBE:
		case RNG_CONE:
		case RNG_RADIUS:
		case RNG_SPHERE:
		case RNG_HEMISPHERE:
		case RNG_CYLINDER:
			return Parser.spRangeToFull._renderArea(range);
	}
};
Parser.spRangeToFull._renderPoint = function (range) {
	const dist = range.distance;
	switch (dist.type) {
		case RNG_SELF:
		case RNG_SIGHT:
		case RNG_UNLIMITED:
		case RNG_UNLIMITED_SAME_PLANE:
		case RNG_SPECIAL:
		case RNG_TOUCH: return Parser.spRangeTypeToFull(dist.type);
		case UNT_METERS:
		case UNT_CENTIMETERS:
		case UNT_DECIMETERS:
		case UNT_KILOMETERS:
		case UNT_LIGHTYEARS:
		case UNT_PARSECS:
		default:
			return `${dist.amount} ${dist.amount === 1 ? Parser.getSingletonUnit(dist.type) : dist.type}`;
	}
};
Parser.spRangeToFull._renderArea = function (range) {
	const size = range.distance;
	return `Self (${size.amount}-${Parser.getSingletonUnit(size.type)}${Parser.spRangeToFull._getAreaStyleString(range)}${range.type === RNG_CYLINDER ? `${size.amountSecondary != null && size.typeSecondary != null ? `, ${size.amountSecondary}-${Parser.getSingletonUnit(size.typeSecondary)}-high` : ""} cylinder` : ""})`;
};
Parser.spRangeToFull._getAreaStyleString = function (range) {
	switch (range.type) {
		case RNG_SPHERE: return " radius";
		case RNG_HEMISPHERE: return `-radius ${range.type}`;
		case RNG_CYLINDER: return "-radius";
		default: return ` ${range.type}`;
	}
};

Parser.getSingletonUnit = function (unit, isShort) {
	switch (unit) {
		case UNT_METERS:
			return isShort ? "m" : "meter";
		case UNT_CENTIMETERS:
			return isShort ? "cm" : "centimeter";
		case UNT_DECIMETERS:
			return isShort ? "dm" : "decimeter";
		case UNT_KILOMETERS:
			return isShort ? "km" : "kilometer";
		case UNT_LIGHTYEARS:
			return isShort ? "ly" : "lightyear";
		case UNT_PARSECS:
			return isShort ? "pc" : "parsec";			
		default: {
			const fromBrew = MiscUtil.get(BrewUtil.homebrewMeta, "spellDistanceUnits", unit, "singular");
			if (fromBrew) return fromBrew;
			if (unit.charAt(unit.length - 1) === "s") return unit.slice(0, -1);
			return unit;
		}
	}
};

Parser.RANGE_TYPES = [
	{type: RNG_POINT, hasDistance: true, isRequireAmount: false},

	{type: RNG_LINE, hasDistance: true, isRequireAmount: true},
	{type: RNG_CUBE, hasDistance: true, isRequireAmount: true},
	{type: RNG_CONE, hasDistance: true, isRequireAmount: true},
	{type: RNG_RADIUS, hasDistance: true, isRequireAmount: true},
	{type: RNG_SPHERE, hasDistance: true, isRequireAmount: true},
	{type: RNG_HEMISPHERE, hasDistance: true, isRequireAmount: true},
	{type: RNG_CYLINDER, hasDistance: true, isRequireAmount: true},

	{type: RNG_SPECIAL, hasDistance: false, isRequireAmount: false},
];

Parser.DIST_TYPES = [
	{type: RNG_SELF, hasAmount: false},
	{type: RNG_TOUCH, hasAmount: false},

	{type: UNT_METERS, hasAmount: true},
	{type: UNT_CENTIMETERS, hasAmount: true},
	{type: UNT_DECIMETERS, hasAmount: true},
	{type: UNT_KILOMETERS, hasAmount: true},
	{type: UNT_LIGHTYEARS, hasAmount: true},
	{type: UNT_PARSECS, hasAmount: true},

	{type: RNG_SIGHT, hasAmount: false},
	{type: RNG_UNLIMITED_SAME_PLANE, hasAmount: false},
	{type: RNG_UNLIMITED, hasAmount: false},
];

Parser.spComponentsToFull = function (comp, level) {
	if (!comp) return "None";
	const out = [];
	if (comp.v) out.push("V");
	if (comp.s) out.push("S");
	if (comp.m != null) out.push(`M${comp.m !== true ? ` (${comp.m.text != null ? comp.m.text : comp.m})` : ""}`);
	if (comp.r) out.push(`R (${level} gp)`);
	return out.join(", ") || "None";
};

Parser.SP_END_TYPE_TO_FULL = {
	"dispel": "dispelled",
	"trigger": "triggered",
	"discharge": "discharged",
};
Parser.spEndTypeToFull = function (type) {
	return Parser._parse_aToB(Parser.SP_END_TYPE_TO_FULL, type);
};

Parser.spDurationToFull = function (dur) {
	let hasSubOr = false;
	const outParts = dur.map(d => {
		switch (d.type) {
			case "special":
				return "Special";
			case "instant":
				return `Instantaneous${d.condition ? ` (${d.condition})` : ""}`;
			case "timed":
				return `${d.concentration ? "Concentration, " : ""}${d.concentration ? "u" : d.duration.upTo ? "U" : ""}${d.concentration || d.duration.upTo ? "p to " : ""}${d.duration.amount} ${d.duration.amount === 1 ? d.duration.type : `${d.duration.type}s`}`;
			case "permanent": {
				if (d.ends) {
					const endsToJoin = d.ends.map(m => Parser.spEndTypeToFull(m));
					hasSubOr = hasSubOr || endsToJoin.length > 1;
					return `Until ${endsToJoin.joinConjunct(", ", " or ")}`;
				} else {
					return "Permanent";
				}
			}
		}
	});
	return `${outParts.joinConjunct(hasSubOr ? "; " : ", ", " or ")}${dur.length > 1 ? " (see below)" : ""}`;
};

Parser.DURATION_TYPES = [
	{type: "instant", full: "Instantaneous"},
	{type: "timed", hasAmount: true},
	{type: "permanent", hasEnds: true},
	{type: "special"},
];

Parser.DURATION_AMOUNT_TYPES = [
	"turn",
	"round",
	"minute",
	"hour",
	"day",
	"week",
	"year",
];

Parser.spClassesToFull = function (sp, isTextOnly, subclassLookup = {}) {
	const fromSubclassList = Renderer.spell.getCombinedClasses(sp, "fromSubclass");
	const fromSubclasses = Parser.spSubclassesToFull(fromSubclassList, isTextOnly, subclassLookup);
	const fromClassList = Renderer.spell.getCombinedClasses(sp, "fromClassList");
	return `${Parser.spMainClassesToFull(fromClassList, isTextOnly)}${fromSubclasses ? `, ${fromSubclasses}` : ""}`
};

Parser.spMainClassesToFull = function (fromClassList, textOnly = false) {
	return fromClassList
		.map(c => ({hash: UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_CLASSES](c), c}))
		.filter(it => !ExcludeUtil.isInitialised || !ExcludeUtil.isExcluded(it.hash, "class", it.c.source))
		.sort((a, b) => SortUtil.ascSort(a.c.name, b.c.name))
		.map(it => textOnly ? it.c.name : `<a title="${it.c.definedInSource ? `Class source` : "Source"}: ${Parser.sourceJsonToFull(it.c.source)}${it.c.definedInSource ? `. Spell list defined in: ${Parser.sourceJsonToFull(it.c.definedInSource)}.` : ""}" href="${UrlUtil.PG_CLASSES}#${it.hash}">${it.c.name}</a>`)
		.join(", ") || "";
};

Parser.spSubclassesToFull = function (fromSubclassList, textOnly, subclassLookup = {}) {
	return fromSubclassList
		.filter(mt => {
			if (!ExcludeUtil.isInitialised) return true;
			const excludeClass = ExcludeUtil.isExcluded(UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_CLASSES](mt.class), "class", mt.class.source);
			if (excludeClass) return false;
			const fromLookup = MiscUtil.get(subclassLookup, mt.class.source, mt.class.name, mt.subclass.source, mt.subclass.name);
			if (!fromLookup) return true;
			const excludeSubclass = ExcludeUtil.isExcluded(
				UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_CLASSES]({name: fromLookup.name || mt.subclass.name, source: mt.subclass.source}),
				"subclass",
				mt.subclass.source,
			);
			return !excludeSubclass;
		})
		.sort((a, b) => {
			const byName = SortUtil.ascSort(a.class.name, b.class.name);
			return byName || SortUtil.ascSort(a.subclass.name, b.subclass.name);
		})
		.map(c => Parser._spSubclassItem(c, textOnly, subclassLookup))
		.join(", ") || "";
};

Parser._spSubclassItem = function (fromSubclass, textOnly, subclassLookup) {
	const c = fromSubclass.class;
	const sc = fromSubclass.subclass;
	const text = `${sc.name}${sc.subSubclass ? ` (${sc.subSubclass})` : ""}`;
	if (textOnly) return text;
	const classPart = `<a href="${UrlUtil.PG_CLASSES}#${UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_CLASSES](c)}" title="Source: ${Parser.sourceJsonToFull(c.source)}">${c.name}</a>`;
	const fromLookup = subclassLookup ? MiscUtil.get(subclassLookup, c.source, c.name, sc.source, sc.name) : null;
	if (fromLookup) return `<a class="italic" href="${UrlUtil.PG_CLASSES}#${UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_CLASSES](c)}${HASH_PART_SEP}${UrlUtil.getClassesPageStatePart({subclass: {shortName: sc.name, source: sc.source}})}" title="Source: ${Parser.sourceJsonToFull(fromSubclass.subclass.source)}">${text}</a> ${classPart}`;
	else return `<span class="italic" title="Source: ${Parser.sourceJsonToFull(fromSubclass.subclass.source)}">${text}</span> ${classPart}`;
};

Parser.SPELL_ATTACK_TYPE_TO_FULL = {};
Parser.SPELL_ATTACK_TYPE_TO_FULL["M"] = "Melee";
Parser.SPELL_ATTACK_TYPE_TO_FULL["R"] = "Ranged";
Parser.SPELL_ATTACK_TYPE_TO_FULL["O"] = "Other/Unknown";

Parser.spAttackTypeToFull = function (type) {
	return Parser._parse_aToB(Parser.SPELL_ATTACK_TYPE_TO_FULL, type);
};

Parser.SPELL_AREA_TYPE_TO_FULL = {
	ST: "Single Target",
	MT: "Multiple Targets",
	C: "Cube",
	N: "Cone",
	Y: "Cylinder",
	S: "Sphere",
	R: "Circle",
	Q: "Square",
	L: "Line",
	H: "Hemisphere",
	W: "Wall",
};
Parser.spAreaTypeToFull = function (type) {
	return Parser._parse_aToB(Parser.SPELL_AREA_TYPE_TO_FULL, type);
};

Parser.SP_MISC_TAG_TO_FULL = {
	HL: "Healing",
	THP: "Grants Temporary Hit Points",
	SGT: "Requires Sight",
	PRM: "Permanent Effects",
	SCL: "Scaling Effects",
	SMN: "Summons Creature",
	MAC: "Modifies AC",
	TP: "Teleportation",
	FMV: "Forced Movement",
};
Parser.spMiscTagToFull = function (type) {
	return Parser._parse_aToB(Parser.SP_MISC_TAG_TO_FULL, type);
};

Parser.SP_CASTER_PROGRESSION_TO_FULL = {
	full: "Full",
	"1/2": "Half",
	"1/3": "One-Third",
	"pact": "Pact Magic",
};
Parser.spCasterProgressionToFull = function (type) {
	return Parser._parse_aToB(Parser.SP_CASTER_PROGRESSION_TO_FULL, type);
};

// mon-prefix functions are for parsing monster data, and shared with the roll20 script
Parser.monTypeToFullObj = function (type) {
	const out = {type: "", tags: [], asText: ""};

	if (typeof type === "string") {
		// handles e.g. "fey"
		out.type = type;
		out.asText = type;
		return out;
	}

	const tempTags = [];
	if (type.tags) {
		for (const tag of type.tags) {
			if (typeof tag === "string") {
				// handles e.g. "fiend (devil)"
				out.tags.push(tag);
				tempTags.push(tag);
			} else {
				// handles e.g. "humanoid (Chondathan human)"
				out.tags.push(tag.tag);
				tempTags.push(`${tag.prefix} ${tag.tag}`);
			}
		}
	}
	out.type = type.type;
	if (type.swarmSize) {
		out.tags.push("swarm");
		out.asText = `swarm of ${Parser.sizeAbvToFull(type.swarmSize).toLowerCase()} ${Parser.monTypeToPlural(type.type)}`;
		out.swarmSize = type.swarmSize;
	} else {
		out.asText = `${type.type}`;
	}
	if (tempTags.length) out.asText += ` (${tempTags.join(", ")})`;
	return out;
};

Parser.monTypeToPlural = function (type) {
	return Parser._parse_aToB(Parser.MON_TYPE_TO_PLURAL, type);
};

Parser.monTypeFromPlural = function (type) {
	return Parser._parse_bToA(Parser.MON_TYPE_TO_PLURAL, type);
};

Parser.monCrToFull = function (cr, {xp = null, isMythic = false} = {}) {
	if (cr == null) return "";

	if (typeof cr === "string") {
		if (Parser.crToNumber(cr) >= VeCt.CR_CUSTOM) return `${cr}${xp != null ? ` (${xp} XP)` : ""}`;

		xp = xp != null ? Parser._addCommas(xp) : Parser.crToXp(cr);
		return `${cr} (${xp} XP${isMythic ? `, or ${Parser.crToXp(cr, {isDouble: true})} XP as a mythic encounter` : ""})`;
	} else {
		const stack = [Parser.monCrToFull(cr.cr, {xp: cr.xp, isMythic})];
		if (cr.lair) stack.push(`${Parser.monCrToFull(cr.lair)} when encountered in lair`);
		if (cr.coven) stack.push(`${Parser.monCrToFull(cr.coven)} when part of a coven`);
		return stack.joinConjunct(", ", " or ");
	}
};

Parser.getFullImmRes = function (toParse) {
	if (!toParse.length) return "";

	let maxDepth = 0;

	function toString (it, depth = 0) {
		maxDepth = Math.max(maxDepth, depth);
		if (typeof it === "string") {
			return it;
		} else if (it.special) {
			return it.special;
		} else {
			const stack = [];

			if (it.preNote) stack.push(it.preNote);

			const prop = it.immune ? "immune" : it.resist ? "resist" : it.vulnerable ? "vulnerable" : null;
			if (prop) {
				const toJoin = it[prop].map(nxt => toString(nxt, depth + 1));
				stack.push(depth ? toJoin.join(maxDepth ? "; " : ", ") : toJoin.joinConjunct(", ", " and "));
			}

			if (it.note) stack.push(it.note);

			return stack.join(" ");
		}
	}

	const arr = toParse.map(it => toString(it));

	if (arr.length <= 1) return arr.join("");

	let out = "";
	for (let i = 0; i < arr.length - 1; ++i) {
		const it = arr[i];
		const nxt = arr[i + 1];

		const orig = toParse[i];
		const origNxt = toParse[i + 1];

		out += it;
		out += (it.includes(",") || nxt.includes(",") || (orig && orig.cond) || (origNxt && origNxt.cond)) ? "; " : ", ";
	}
	out += arr.last();
	return out;
};

Parser.getFullCondImm = function (condImm, isPlainText) {
	function render (condition) {
		return isPlainText ? condition : Renderer.get().render(`{@condition ${condition}}`);
	}
	return condImm.map(it => {
		if (it.special) return it.special;
		if (it.conditionImmune) return `${it.preNote ? `${it.preNote} ` : ""}${it.conditionImmune.map(render).join(", ")}${it.note ? ` ${it.note}` : ""}`;
		return render(it);
	}).sort(SortUtil.ascSortLower).join(", ");
};

Parser.MON_SENSE_TAG_TO_FULL = {
	"B": "blindsight",
	"D": "darkvision",
	"SD": "superior darkvision",
	"T": "tremorsense",
	"U": "truesight",
};
Parser.monSenseTagToFull = function (tag) {
	return Parser._parse_aToB(Parser.MON_SENSE_TAG_TO_FULL, tag);
};

Parser.MON_SPELLCASTING_TAG_TO_FULL = {
	"P": "Psionics",
	"I": "Innate",
	"F": "Form Only",
	"S": "Shared",
	"CA": "Class, Artificer",
	"CB": "Class, Bard",
	"CC": "Class, Cleric",
	"CD": "Class, Druid",
	"CP": "Class, Paladin",
	"CR": "Class, Ranger",
	"CS": "Class, Sorcerer",
	"CL": "Class, Warlock",
	"CW": "Class, Wizard",
};
Parser.monSpellcastingTagToFull = function (tag) {
	return Parser._parse_aToB(Parser.MON_SPELLCASTING_TAG_TO_FULL, tag);
};

Parser.MON_MISC_TAG_TO_FULL = {
	"AOE": "Has Areas of Effect",
	"MW": "Has Weapon Attacks, Melee",
	"RW": "Has Weapon Attacks, Ranged",
	"RNG": "Has Ranged Weapons",
	"RCH": "Has Reach Attacks",
	"THW": "Has Thrown Weapons",
};
Parser.monMiscTagToFull = function (tag) {
	return Parser._parse_aToB(Parser.MON_MISC_TAG_TO_FULL, tag);
};

Parser.MON_LANGUAGE_TAG_TO_FULL = {
	"C": "Common",
	"INK": "Inklink",
	"ENG": "Engi",
	"KUL": "Kulrathi",
	"MAN": "Mantis",
	"MUS": "Musi",
	"ROK": "Rockmen",
	"TUR": "Turian",
	"VUL": "Vulfen",
	"ZOL": "Zoltan",
	"U": "Uncommon",
	"GEM": "Gem",
	"LAN": "Lanius",
	"BI": "Binary",
	"KA": "Kandiof",
	"AN": "Ancient",
	"NA": "Nature",
	"ROG": "Rogueport",
	"TP": "Telepathy",
	"CS": "Can't Speak Known Languages",
	"LF": "Languages Known in Life",
	"OTH": "Other",
	"X": "Any (Choose)",
	"XX": "All",
};
Parser.monLanguageTagToFull = function (tag) {
	return Parser._parse_aToB(Parser.MON_LANGUAGE_TAG_TO_FULL, tag);
};

Parser.ENVIRONMENTS = ["arctic", "barren", "caustic", "coastal", "desert", "forest", "grassland", "jungle", "mountainous", "oceanic", "parasitic", "space", "special", "swamp", "underdark", "underwater", "urban", "volcanic"];

// psi-prefix functions are for parsing psionic data, and shared with the roll20 script
Parser.PSI_ABV_TYPE_TALENT = "T";
Parser.PSI_ABV_TYPE_DISCIPLINE = "D";
Parser.PSI_ORDER_NONE = "None";
Parser.psiTypeToFull = type => Parser.psiTypeToMeta(type).full;

Parser.psiTypeToMeta = type => {
	let out = {};
	if (type === Parser.PSI_ABV_TYPE_TALENT) out = {hasOrder: false, full: "Talent"};
	else if (type === Parser.PSI_ABV_TYPE_DISCIPLINE) out = {hasOrder: true, full: "Discipline"};
	else if (BrewUtil.homebrewMeta && BrewUtil.homebrewMeta.psionicTypes && BrewUtil.homebrewMeta.psionicTypes[type]) out = BrewUtil.homebrewMeta.psionicTypes[type];
	out.full = out.full || "Unknown";
	out.short = out.short || out.full;
	return out;
};

Parser.psiOrderToFull = (order) => {
	return order === undefined ? Parser.PSI_ORDER_NONE : order;
};

Parser.prereqSpellToFull = function (spell, {isTextOnly = false} = {}) {
	if (spell) {
		const [text, suffix] = spell.split("#");
		if (!suffix) return isTextOnly ? spell : Renderer.get().render(`{@spell ${spell}}`);
		else if (suffix === "c") return (isTextOnly ? Renderer.stripTags : Renderer.get().render.bind(Renderer.get()))(`{@spell ${text}} cantrip`);
		else if (suffix === "x") return (isTextOnly ? Renderer.stripTags : Renderer.get().render.bind(Renderer.get()))("{@spell hex} spell or a warlock feature that curses");
	} else return VeCt.STR_NONE;
};

Parser.prereqPactToFull = function (pact) {
	if (pact === "Chain") return "Pact of the Chain";
	if (pact === "Tome") return "Pact of the Tome";
	if (pact === "Blade") return "Pact of the Blade";
	if (pact === "Talisman") return "Pact of the Talisman";
	return pact;
};

Parser.prereqPatronToShort = function (patron) {
	if (patron === "Any") return patron;
	const mThe = /^The (.*?)$/.exec(patron);
	if (mThe) return mThe[1];
	return patron;
};

// NOTE: These need to be reflected in omnidexer.js to be indexed
Parser.OPT_FEATURE_TYPE_TO_FULL = {
	AI: "Artificer Infusion",
	"MV": "Maneuver",
	OTH: "Other",
	"PB": "Pact Boon"
};

Parser.optFeatureTypeToFull = function (type) {
	if (Parser.OPT_FEATURE_TYPE_TO_FULL[type]) return Parser.OPT_FEATURE_TYPE_TO_FULL[type];
	if (BrewUtil.homebrewMeta && BrewUtil.homebrewMeta.optionalFeatureTypes && BrewUtil.homebrewMeta.optionalFeatureTypes[type]) return BrewUtil.homebrewMeta.optionalFeatureTypes[type];
	return type;
};

Parser.CHAR_OPTIONAL_FEATURE_TYPE_TO_FULL = {
	"SG": "Supernatural Gift",
	"OF": "Optional Feature",
	"DG": "Dark Gift",
	"RF:B": "Replacement Feature: Background",
};

Parser.charCreationOptionTypeToFull = function (type) {
	if (Parser.CHAR_OPTIONAL_FEATURE_TYPE_TO_FULL[type]) return Parser.CHAR_OPTIONAL_FEATURE_TYPE_TO_FULL[type];
	if (BrewUtil.homebrewMeta && BrewUtil.homebrewMeta.charOption && BrewUtil.homebrewMeta.charOption[type]) return BrewUtil.homebrewMeta.charOption[type];
	return type;
};

Parser.matterenergyAbvToFull = function (matterenergy) {
	if (!matterenergy) return null; // used in sidekicks
	if (typeof matterenergy === "object") {
		if (matterenergy.special != null) {
			// use in MTF Sacred Statue
			return matterenergy.special;
		} else {
			// e.g. `{matterenergy: ["N", "G"], chance: 50}` or `{matterenergy: ["N", "G"]}`
			return `${matterenergy.matterenergy.map(a => Parser.matterenergyAbvToFull(a)).join(" ")}${matterenergy.chance ? ` (${matterenergy.chance}%)` : ""}${matterenergy.note ? ` (${matterenergy.note})` : ""}`;
		}
	} else {
		matterenergy = matterenergy.toUpperCase();
		switch (matterenergy) {
			case "MF":
				return "full-materialistic";
			case "MS":
				return "semi-materialistic";
			case "MH":
				return "half-materialistic";
			case "MN":
				return "full-energenetic";
			case "EN":
				return "non-energenistic";
			case "ES":
				return "semi-energenistic";
			case "EH":
				return "high-energenistic";
			// "special" values
			case "UN":
				return "unkown";
		}
		return matterenergy;
	}
};

Parser.matterenergyListToFull = function (alignList) {
	if (alignList.some(it => typeof it !== "string")) {
		if (alignList.some(it => typeof it === "string")) throw new Error(`Mixed matterenergy types: ${JSON.stringify(alignList)}`);
		// filter out any nonexistent matterenergys, as we don't care about "matterenergy does not exist" if there are other matterenergys
		alignList = alignList.filter(it => it.matterenergy === undefined || it.matterenergy != null);
		return alignList.map(it => it.special != null || it.chance != null || it.note != null ? Parser.matterenergyAbvToFull(it) : Parser.matterenergyListToFull(it.matterenergy)).join(", ");
	} else {
		// assume all single-length arrays can be simply parsed
		if (alignList.length === 1) return Parser.matterenergyAbvToFull(alignList[0]);
		// a pair of abv's, e.g. "L" "G"
		if (alignList.length === 2) {
			return alignList.map(a => Parser.matterenergyAbvToFull(a)).join(" ");
		}

		if (alignList.length === 3) {
			throw new Error(`Incorrect material energenetic-capability; too many types: ${JSON.stringify(alignList)}`);
		};
	}
};

Parser.weightToFull = function (lbs, isSmallUnit) {
	const tons = Math.floor(lbs / 2000);
	lbs = lbs - (2000 * tons);
	return [
		tons ? `${tons}${isSmallUnit ? `<span class="ve-small ml-1">` : " "}ton${tons === 1 ? "" : "s"}${isSmallUnit ? `</span>` : ""}` : null,
		lbs ? `${lbs}${isSmallUnit ? `<span class="ve-small ml-1">` : " "}lb.${isSmallUnit ? `</span>` : ""}` : null,
	].filter(Boolean).join(", ");
};

Parser.ITEM_RARITIES = ["none", "common", "uncommon", "rare", "very rare", "legendary", "artifact", "unknown", "unknown (magic)", "other", "special", "WM MOD", "IA MOD", "AA MOD", "EA MOD"];

Parser.CAT_ID_CREATURE = 1;
Parser.CAT_ID_SPELL = 2;
Parser.CAT_ID_BACKGROUND = 3;
Parser.CAT_ID_ITEM = 4;
Parser.CAT_ID_CLASS = 5;
Parser.CAT_ID_CONDITION = 6;
Parser.CAT_ID_FEAT = 7;
Parser.CAT_ID_ELDRITCH_INVOCATION = 8;
Parser.CAT_ID_PSIONIC = 9;
Parser.CAT_ID_RACE = 10;
Parser.CAT_ID_OTHER_REWARD = 11;
Parser.CAT_ID_VARIANT_OPTIONAL_RULE = 12;
Parser.CAT_ID_ADVENTURE = 13;
Parser.CAT_ID_DEITY = 14;
Parser.CAT_ID_OBJECT = 15;
Parser.CAT_ID_TRAP = 16;
Parser.CAT_ID_HAZARD = 17;
Parser.CAT_ID_QUICKREF = 18;
Parser.CAT_ID_CULT = 19;
Parser.CAT_ID_BOON = 20;
Parser.CAT_ID_DISEASE = 21;
Parser.CAT_ID_METAMAGIC = 22;
Parser.CAT_ID_MANEUVER_BATTLEMASTER = 23;
Parser.CAT_ID_TABLE = 24;
Parser.CAT_ID_TABLE_GROUP = 25;
Parser.CAT_ID_MANEUVER_CAVALIER = 26;
Parser.CAT_ID_ARCANE_SHOT = 27;
Parser.CAT_ID_OPTIONAL_FEATURE_OTHER = 28;
Parser.CAT_ID_FIGHTING_STYLE = 29;
Parser.CAT_ID_CLASS_FEATURE = 30;
Parser.CAT_ID_VEHICLE = 31;
Parser.CAT_ID_PACT_BOON = 32;
Parser.CAT_ID_ELEMENTAL_DISCIPLINE = 33;
Parser.CAT_ID_ARTIFICER_INFUSION = 34;
Parser.CAT_ID_SHIP_UPGRADE = 35;
Parser.CAT_ID_INFERNAL_WAR_MACHINE_UPGRADE = 36;
Parser.CAT_ID_ONOMANCY_RESONANT = 37;
Parser.CAT_ID_RUNE_KNIGHT_RUNE = 37;
Parser.CAT_ID_ALCHEMICAL_FORMULA = 38;
Parser.CAT_ID_MANEUVER = 39;
Parser.CAT_ID_SUBCLASS = 40;
Parser.CAT_ID_SUBCLASS_FEATURE = 41;
Parser.CAT_ID_ACTION = 42;
Parser.CAT_ID_LANGUAGE = 43;
Parser.CAT_ID_BOOK = 44;
Parser.CAT_ID_PAGE = 45;
Parser.CAT_ID_LEGENDARY_GROUP = 46;
Parser.CAT_ID_CHAR_CREATION_OPTIONS = 47;
Parser.CAT_ID_RECIPES = 48;

Parser.CAT_ID_SONG = 49;
Parser.CAT_ID_DRUG = 50;
Parser.CAT_ID_MODIFICATION = 51;
Parser.CAT_ID_CREATION = 52;


Parser.CAT_ID_TO_FULL = {};
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_CREATURE] = "Bestiary";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_SPELL] = "Spell";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_BACKGROUND] = "Background";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_ITEM] = "Item";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_CLASS] = "Class";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_CONDITION] = "Condition";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_FEAT] = "Feat";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_ELDRITCH_INVOCATION] = "Eldritch Invocation";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_PSIONIC] = "Psionic";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_RACE] = "Race";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_OTHER_REWARD] = "Other Reward";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_VARIANT_OPTIONAL_RULE] = "Variant/Optional Rule";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_ADVENTURE] = "Adventure";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_DEITY] = "Deity";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_OBJECT] = "Object";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_TRAP] = "Trap";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_HAZARD] = "Hazard";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_QUICKREF] = "Quick Reference";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_CULT] = "Cult";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_BOON] = "Boon";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_DISEASE] = "Disease";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_METAMAGIC] = "Metamagic";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_MANEUVER_BATTLEMASTER] = "Maneuver; Battlemaster";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_TABLE] = "Table";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_TABLE_GROUP] = "Table";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_MANEUVER_CAVALIER] = "Maneuver; Cavalier";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_ARCANE_SHOT] = "Arcane Shot";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_OPTIONAL_FEATURE_OTHER] = "Optional Feature";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_FIGHTING_STYLE] = "Fighting Style";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_CLASS_FEATURE] = "Class Feature";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_VEHICLE] = "Vehicle";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_PACT_BOON] = "Pact Boon";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_ELEMENTAL_DISCIPLINE] = "Elemental Discipline";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_ARTIFICER_INFUSION] = "Infusion";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_SHIP_UPGRADE] = "Ship Upgrade";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_INFERNAL_WAR_MACHINE_UPGRADE] = "Infernal War Machine Upgrade";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_ONOMANCY_RESONANT] = "Onomancy Resonant";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_RUNE_KNIGHT_RUNE] = "Rune Knight Rune";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_ALCHEMICAL_FORMULA] = "Alchemical Formula";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_MANEUVER] = "Maneuver";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_SUBCLASS] = "Subclass";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_SUBCLASS_FEATURE] = "Subclass Feature";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_ACTION] = "Action";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_LANGUAGE] = "Language";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_BOOK] = "Book";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_PAGE] = "Page";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_LEGENDARY_GROUP] = "Legendary Group";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_CHAR_CREATION_OPTIONS] = "Character Creation Option";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_RECIPES] = "Recipe";

Parser.CAT_ID_TO_FULL[Parser.CAT_ID_SONG] = "Song";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_DRUG] = "Drug";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_MODIFICATION] = "Modification";
Parser.CAT_ID_TO_FULL[Parser.CAT_ID_CREATION] = "Creation";

Parser.pageCategoryToFull = function (catId) {
	return Parser._parse_aToB(Parser.CAT_ID_TO_FULL, catId);
};

Parser.CAT_ID_TO_PROP = {};
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_CREATURE] = "monster";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_SPELL] = "spell";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_BACKGROUND] = "background";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_ITEM] = "item";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_CLASS] = "class";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_CONDITION] = "condition";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_FEAT] = "feat";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_PSIONIC] = "psionic";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_RACE] = "race";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_OTHER_REWARD] = "reward";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_VARIANT_OPTIONAL_RULE] = "variantrule";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_ADVENTURE] = "adventure";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_DEITY] = "deity";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_OBJECT] = "object";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_TRAP] = "trap";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_HAZARD] = "hazard";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_CULT] = "cult";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_BOON] = "boon";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_DISEASE] = "condition";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_TABLE] = "table";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_TABLE_GROUP] = "tableGroup";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_VEHICLE] = "vehicle";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_ELDRITCH_INVOCATION] = "optionalfeature";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_MANEUVER_CAVALIER] = "optionalfeature";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_ARCANE_SHOT] = "optionalfeature";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_OPTIONAL_FEATURE_OTHER] = "optionalfeature";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_FIGHTING_STYLE] = "optionalfeature";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_METAMAGIC] = "optionalfeature";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_MANEUVER_BATTLEMASTER] = "optionalfeature";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_PACT_BOON] = "optionalfeature";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_ELEMENTAL_DISCIPLINE] = "optionalfeature";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_ARTIFICER_INFUSION] = "optionalfeature";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_SHIP_UPGRADE] = "vehicleUpgrade";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_INFERNAL_WAR_MACHINE_UPGRADE] = "vehicleUpgrade";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_ONOMANCY_RESONANT] = "optionalfeature";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_RUNE_KNIGHT_RUNE] = "optionalfeature";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_ALCHEMICAL_FORMULA] = "optionalfeature";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_MANEUVER] = "optionalfeature";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_QUICKREF] = null;
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_CLASS_FEATURE] = "classFeature";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_SUBCLASS] = "subclass";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_SUBCLASS_FEATURE] = "subclassFeature";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_ACTION] = "action";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_LANGUAGE] = "language";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_BOOK] = "book";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_PAGE] = null;
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_LEGENDARY_GROUP] = null;
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_CHAR_CREATION_OPTIONS] = "charoption";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_RECIPES] = "recipe";

Parser.CAT_ID_TO_PROP[Parser.CAT_ID_SONG] = "song";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_DRUG] = "drug";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_MODIFICATION] = "modification";
Parser.CAT_ID_TO_PROP[Parser.CAT_ID_CREATION] = "creation";

Parser.pageCategoryToProp = function (catId) {
	return Parser._parse_aToB(Parser.CAT_ID_TO_PROP, catId);
};

Parser.ABIL_ABVS = ["str", "dex", "con", "int", "wis", "cha"];

Parser.spClassesToCurrentAndLegacy = function (fromClassList) {
	const current = [];
	const legacy = [];
	fromClassList.forEach(cls => {
		if ((cls.name === "Artificer" && cls.source === "UAArtificer") || (cls.name === "Artificer (Revisited)" && cls.source === "UAArtificerRevisited")) legacy.push(cls);
		else current.push(cls);
	});
	return [current, legacy];
};

/**
 * Build a pair of strings; one with all current subclasses, one with all legacy subclasses
 *
 * @param sp a spell
 * @param subclassLookup Data loaded from `generated/gendata-subclass-lookup.json`. Of the form: `{PHB: {Barbarian: {PHB: {Berserker: "Path of the Berserker"}}}}`
 * @returns {*[]} A two-element array. First item is a string of all the current subclasses, second item a string of
 * all the legacy/superseded subclasses
 */
Parser.spSubclassesToCurrentAndLegacyFull = function (sp, subclassLookup) {
	const fromSubclass = Renderer.spell.getCombinedClasses(sp, "fromSubclass");
	if (!fromSubclass.length) return ["", ""];

	const out = [[], []];
	const curNames = new Set();
	const toCheck = [];
	fromSubclass
		.filter(c => {
			const excludeClass = ExcludeUtil.isExcluded(
				UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_CLASSES]({name: c.class.name, source: c.class.source}),
				"class",
				c.class.source,
			);
			if (excludeClass) return false;

			const fromLookup = MiscUtil.get(subclassLookup, c.class.source, c.class.name, c.subclass.source, c.subclass.name);
			const excludeSubclass = ExcludeUtil.isExcluded(
				UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_CLASSES]({name: (fromLookup || {}).name || c.subclass.name, source: c.subclass.source}),
				"subclass",
				c.subclass.source,
			);
			return !excludeSubclass;
		})
		.sort((a, b) => {
			const byName = SortUtil.ascSort(a.subclass.name, b.subclass.name);
			return byName || SortUtil.ascSort(a.class.name, b.class.name);
		})
		.forEach(c => {
			const nm = c.subclass.name;
			const src = c.subclass.source;
			const toAdd = Parser._spSubclassItem(c, false, subclassLookup);

			const fromLookup = MiscUtil.get(
				subclassLookup,
				c.class.source,
				c.class.name,
				c.subclass.source,
				c.subclass.name,
			);

			if (fromLookup && fromLookup.isReprinted) {
				out[1].push(toAdd);
			} else if (Parser.sourceJsonToFull(src).startsWith(UA_PREFIX) || Parser.sourceJsonToFull(src).startsWith(PS_PREFIX)) {
				const cleanName = mapClassShortNameToMostRecent(nm.split("(")[0].trim().split(/v\d+/)[0].trim());
				toCheck.push({"name": cleanName, "ele": toAdd});
			} else {
				out[0].push(toAdd);
				curNames.add(nm);
			}
		});
	toCheck.forEach(n => {
		if (curNames.has(n.name)) {
			out[1].push(n.ele);
		} else {
			out[0].push(n.ele);
		}
	});
	return [out[0].join(", "), out[1].join(", ")];

	/**
	 * Get the most recent iteration of a subclass name
	 */
	function mapClassShortNameToMostRecent (shortName) {
		switch (shortName) {
			case "Favored Soul":
				return "Divine Soul";
			case "Undying Light":
				return "Celestial";
			case "Deep Stalker":
				return "Gloom Stalker";
		}
		return shortName;
	}
};

Parser.spVariantClassesToCurrentAndLegacy = function (fromVariantClassList) {
	const current = [];
	const legacy = [];
	fromVariantClassList.forEach(cls => {
		if (cls.definedInSource === SRC_CDPH) legacy.push(cls);
		else current.push(cls);
	});
	return [current, legacy];
}

Parser.attackTypeToFull = function (attackType) {
	return Parser._parse_aToB(Parser.ATK_TYPE_TO_FULL, attackType);
};

Parser.trapHazTypeToFull = function (type) {
	return Parser._parse_aToB(Parser.TRAP_HAZARD_TYPE_TO_FULL, type);
};

Parser.TRAP_HAZARD_TYPE_TO_FULL = {
	MECH: "Mechanical trap",
	MAG: "Magical trap",
	SMPL: "Simple trap",
	CMPX: "Complex trap",
	HAZ: "Hazard",
	WTH: "Weather",
	ENV: "Environmental Hazard",
	WLD: "Wilderness Hazard",
	GEN: "Generic",
	EST: "Eldritch Storm",
};

Parser.tierToFullLevel = function (tier) {
	return Parser._parse_aToB(Parser.TIER_TO_FULL_LEVEL, tier);
};

Parser.TIER_TO_FULL_LEVEL = {};
Parser.TIER_TO_FULL_LEVEL[1] = "level 1\u20144";
Parser.TIER_TO_FULL_LEVEL[2] = "level 5\u201410";
Parser.TIER_TO_FULL_LEVEL[3] = "level 11\u201416";
Parser.TIER_TO_FULL_LEVEL[4] = "level 17\u201420";

Parser.threatToFull = function (threat) {
	return Parser._parse_aToB(Parser.THREAT_TO_FULL, threat);
};

Parser.THREAT_TO_FULL = {};
Parser.THREAT_TO_FULL[1] = "moderate";
Parser.THREAT_TO_FULL[2] = "dangerous";
Parser.THREAT_TO_FULL[3] = "deadly";

Parser.trapInitToFull = function (init) {
	return Parser._parse_aToB(Parser.TRAP_INIT_TO_FULL, init);
};

Parser.TRAP_INIT_TO_FULL = {};
Parser.TRAP_INIT_TO_FULL[1] = "initiative count 10";
Parser.TRAP_INIT_TO_FULL[2] = "initiative count 20";
Parser.TRAP_INIT_TO_FULL[3] = "initiative count 20 and initiative count 10";

Parser.ATK_TYPE_TO_FULL = {};
Parser.ATK_TYPE_TO_FULL["MW"] = "Melee Weapon Attack";
Parser.ATK_TYPE_TO_FULL["RW"] = "Ranged Weapon Attack";

Parser.bookOrdinalToAbv = (ordinal, preNoSuff) => {
	if (ordinal === undefined) return "";
	switch (ordinal.type) {
		case "part": return `${preNoSuff ? " " : ""}Part ${ordinal.identifier}${preNoSuff ? "" : " \u2014 "}`;
		case "chapter": return `${preNoSuff ? " " : ""}Ch. ${ordinal.identifier}${preNoSuff ? "" : ": "}`;
		case "episode": return `${preNoSuff ? " " : ""}Ep. ${ordinal.identifier}${preNoSuff ? "" : ": "}`;
		case "appendix": return `${preNoSuff ? " " : ""}App.${ordinal.identifier != null ? ` ${ordinal.identifier}` : ""}${preNoSuff ? "" : ": "}`;
		case "level": return `${preNoSuff ? " " : ""}Level ${ordinal.identifier}${preNoSuff ? "" : ": "}`;
		default: throw new Error(`Unhandled ordinal type "${ordinal.type}"`);
	}
};

Parser.nameToTokenName = function (name) {
	return name
		.toAscii()
		.replace(/"/g, "");
};

Parser.bytesToHumanReadable = function (bytes, {fixedDigits = 2} = {}) {
	if (bytes == null) return "";
	if (!bytes) return "0 B";
	const e = Math.floor(Math.log(bytes) / Math.log(1024));
	return `${(bytes / Math.pow(1024, e)).toFixed(fixedDigits)} ${`\u200bKMGTP`.charAt(e)}B`;
};

SKL_ABV_ABJ = "A";
SKL_ABV_EVO = "V";
SKL_ABV_ENC = "E";
SKL_ABV_ILL = "I";
SKL_ABV_DIV = "D";
SKL_ABV_NEC = "N";
SKL_ABV_TRA = "T";
SKL_ABV_CON = "C";
SKL_ABV_PSI = "P";
Parser.SKL_ABVS = [
	SKL_ABV_ABJ,
	SKL_ABV_CON,
	SKL_ABV_DIV,
	SKL_ABV_ENC,
	SKL_ABV_EVO,
	SKL_ABV_ILL,
	SKL_ABV_NEC,
	SKL_ABV_PSI,
	SKL_ABV_TRA,
];

Parser.SP_TM_ACTION = "action";
Parser.SP_TM_B_ACTION = "bonus";
Parser.SP_TM_REACTION = "reaction";
Parser.SP_TM_ROUND = "round";
Parser.SP_TM_MINS = "minute";
Parser.SP_TM_HRS = "hour";
Parser.SP_TIME_SINGLETONS = [Parser.SP_TM_ACTION, Parser.SP_TM_B_ACTION, Parser.SP_TM_REACTION, Parser.SP_TM_ROUND];
Parser.SP_TIME_TO_FULL = {
	[Parser.SP_TM_ACTION]: "Action",
	[Parser.SP_TM_B_ACTION]: "Bonus Action",
	[Parser.SP_TM_REACTION]: "Reaction",
	[Parser.SP_TM_ROUND]: "Rounds",
	[Parser.SP_TM_MINS]: "Minutes",
	[Parser.SP_TM_HRS]: "Hours",
};
Parser.spTimeUnitToFull = function (timeUnit) {
	return Parser._parse_aToB(Parser.SP_TIME_TO_FULL, timeUnit);
};

Parser.SP_TIME_TO_SHORT = {
	[Parser.SP_TM_ROUND]: "Rnd.",
	[Parser.SP_TM_MINS]: "Min.",
	[Parser.SP_TM_HRS]: "Hr.",
}
Parser.spTimeUnitToShort = function (timeUnit) {
	return Parser._parse_aToB(Parser.SP_TIME_TO_SHORT, timeUnit);
};

Parser.SP_TIME_TO_ABV = {
	[Parser.SP_TM_ACTION]: "A",
	[Parser.SP_TM_B_ACTION]: "BA",
	[Parser.SP_TM_REACTION]: "R",
	[Parser.SP_TM_ROUND]: "rnd",
	[Parser.SP_TM_MINS]: "min",
	[Parser.SP_TM_HRS]: "hr",
};
Parser.spTimeUnitToAbv = function (timeUnit) {
	return Parser._parse_aToB(Parser.SP_TIME_TO_ABV, timeUnit);
};

Parser.spTimeToShort = function (time, isHtml) {
	if (!time) return "";
	return (time.number === 1 && Parser.SP_TIME_SINGLETONS.includes(time.unit))
		? `${Parser.spTimeUnitToAbv(time.unit).uppercaseFirst()}${time.condition ? "*" : ""}`
		: `${time.number} ${isHtml ? `<span class="ve-small">` : ""}${Parser.spTimeUnitToAbv(time.unit)}${isHtml ? `</span>` : ""}${time.condition ? "*" : ""}`;
};

SKL_ABJ = "Abjuration";
SKL_EVO = "Evocation";
SKL_ENC = "Enchantment";
SKL_ILL = "Illusion";
SKL_DIV = "Divination";
SKL_NEC = "Necromancy";
SKL_TRA = "Transmutation";
SKL_CON = "Conjuration";
SKL_PSI = "Psionic";

Parser.SP_SCHOOL_ABV_TO_FULL = {};
Parser.SP_SCHOOL_ABV_TO_FULL[SKL_ABV_ABJ] = SKL_ABJ;
Parser.SP_SCHOOL_ABV_TO_FULL[SKL_ABV_EVO] = SKL_EVO;
Parser.SP_SCHOOL_ABV_TO_FULL[SKL_ABV_ENC] = SKL_ENC;
Parser.SP_SCHOOL_ABV_TO_FULL[SKL_ABV_ILL] = SKL_ILL;
Parser.SP_SCHOOL_ABV_TO_FULL[SKL_ABV_DIV] = SKL_DIV;
Parser.SP_SCHOOL_ABV_TO_FULL[SKL_ABV_NEC] = SKL_NEC;
Parser.SP_SCHOOL_ABV_TO_FULL[SKL_ABV_TRA] = SKL_TRA;
Parser.SP_SCHOOL_ABV_TO_FULL[SKL_ABV_CON] = SKL_CON;
Parser.SP_SCHOOL_ABV_TO_FULL[SKL_ABV_PSI] = SKL_PSI;

Parser.SP_SCHOOL_ABV_TO_SHORT = {};
Parser.SP_SCHOOL_ABV_TO_SHORT[SKL_ABV_ABJ] = "Abj.";
Parser.SP_SCHOOL_ABV_TO_SHORT[SKL_ABV_EVO] = "Evoc.";
Parser.SP_SCHOOL_ABV_TO_SHORT[SKL_ABV_ENC] = "Ench.";
Parser.SP_SCHOOL_ABV_TO_SHORT[SKL_ABV_ILL] = "Illu.";
Parser.SP_SCHOOL_ABV_TO_SHORT[SKL_ABV_DIV] = "Divin.";
Parser.SP_SCHOOL_ABV_TO_SHORT[SKL_ABV_NEC] = "Necro.";
Parser.SP_SCHOOL_ABV_TO_SHORT[SKL_ABV_TRA] = "Trans.";
Parser.SP_SCHOOL_ABV_TO_SHORT[SKL_ABV_CON] = "Conj.";
Parser.SP_SCHOOL_ABV_TO_SHORT[SKL_ABV_PSI] = "Psi.";

Parser.ATB_ABV_TO_FULL = {
	"str": "Strength",
	"dex": "Dexterity",
	"con": "Constitution",
	"int": "Intelligence",
	"wis": "Wisdom",
	"cha": "Charisma",
};

TP_BEAST = "beast";
TP_AI = "non-sentient AI"
TP_NSAI = "non-sapient AI";
TP_SAI = "sapient AI";
TP_CONSTRUCT = "construct";
TP_HUMANOID = "humanoid";
TP_PLANT = "plant";
TP_INSECT = "insectoid";
TP_MOLLUSC = "molluscoid";
TP_EPROJECT = "energenetic projection";
TP_BEING = "otherworldly being"

Parser.MON_TYPES = [TP_BEAST, TP_AI, TP_NSAI, TP_SAI, TP_CONSTRUCT, TP_HUMANOID, TP_PLANT, TP_INSECT, TP_MOLLUSC, TP_EPROJECT, TP_BEING];
Parser.MON_TYPE_TO_PLURAL = {};
Parser.MON_TYPE_TO_PLURAL[TP_BEAST] = "beasts";
Parser.MON_TYPE_TO_PLURAL[TP_AI] = "non-sentient AI's";
Parser.MON_TYPE_TO_PLURAL[TP_NSAI] = "non-sapient AI's";
Parser.MON_TYPE_TO_PLURAL[TP_SAI] = "sapient AI's";
Parser.MON_TYPE_TO_PLURAL[TP_CONSTRUCT] = "constructs";
Parser.MON_TYPE_TO_PLURAL[TP_HUMANOID] = "humanoids";
Parser.MON_TYPE_TO_PLURAL[TP_PLANT] = "plants";
Parser.MON_TYPE_TO_PLURAL[TP_INSECT] = "insects";
Parser.MON_TYPE_TO_PLURAL[TP_MOLLUSC] = "molluscoids";
Parser.MON_TYPE_TO_PLURAL[TP_EPROJECT] = "energenetic projections";
Parser.MON_TYPE_TO_PLURAL[TP_BEING] = "otherworldly beings";


SZ_SUBCELL = "C-";
SZ_CELL = "C";
SZ_DUST= "D";
SZ_TINY = "T";
SZ_SMALL = "S";
SZ_MEDIUM = "M";
SZ_LARGE = "L";
SZ_HUGE = "H";
SZ_GIANT = "G";
SZ_COLOSSAL = "C";
SZ_ASTRONOMICAL = "A";
SZ_GALACTICAL = "G";
SZ_DIMENSIONAL = "D"
SZ_VARIES = "V";
SZ_NONE = "";
Parser.SIZE_ABVS = [SZ_SUBCELL, SZ_CELL, SZ_DUST, SZ_TINY, SZ_SMALL, SZ_MEDIUM, SZ_LARGE, SZ_HUGE, SZ_GIANT, SZ_COLOSSAL, SZ_ASTRONOMICAL, SZ_GALACTICAL, SZ_DIMENSIONAL, SZ_VARIES, SZ_NONE];
Parser.SIZE_ABV_TO_FULL = {};
Parser.SIZE_ABV_TO_FULL[SZ_SUBCELL] = "Submicroscopic";
Parser.SIZE_ABV_TO_FULL[SZ_CELL] = "Microscopic";
Parser.SIZE_ABV_TO_FULL[SZ_DUST] = "Minute";
Parser.SIZE_ABV_TO_FULL[SZ_TINY] = "Tiny";
Parser.SIZE_ABV_TO_FULL[SZ_SMALL] = "Small";
Parser.SIZE_ABV_TO_FULL[SZ_MEDIUM] = "Medium";
Parser.SIZE_ABV_TO_FULL[SZ_LARGE] = "Large";
Parser.SIZE_ABV_TO_FULL[SZ_HUGE] = "Huge";
Parser.SIZE_ABV_TO_FULL[SZ_GIANT] = "Giant";
Parser.SIZE_ABV_TO_FULL[SZ_COLOSSAL] = "Colossal";
Parser.SIZE_ABV_TO_FULL[SZ_ASTRONOMICAL] = "Astronomical";
Parser.SIZE_ABV_TO_FULL[SZ_GALACTICAL] = "Galactical";
Parser.SIZE_ABV_TO_FULL[SZ_DIMENSIONAL] = "Dimensional";
Parser.SIZE_ABV_TO_FULL[SZ_VARIES] = "Varies";
Parser.SIZE_ABV_TO_FULL[SZ_NONE] = "";


Parser.XP_CHART_ALT = {
	"0": 10,
	"1/8": 25,
	"1/4": 50,
	"1/2": 100,
	"1": 200,
	"2": 450,
	"3": 700,
	"4": 1100,
	"5": 1800,
	"6": 2300,
	"7": 2900,
	"8": 3900,
	"9": 5000,
	"10": 5900,
	"11": 7200,
	"12": 8400,
	"13": 10000,
	"14": 11500,
	"15": 13000,
	"16": 15000,
	"17": 18000,
	"18": 20000,
	"19": 22000,
	"20": 25000,
	"21": 33000,
	"22": 41000,
	"23": 50000,
	"24": 62000,
	"25": 75000,
	"26": 90000,
	"27": 105000,
	"28": 120000,
	"29": 135000,
	"30": 155000,
};

Parser.ARMOR_ABV_TO_FULL = {
	"l.": "light",
	"m.": "medium",
	"h.": "heavy",
	"p.": "power"
};

Parser.WEAPON_ABV_TO_FULL = {
	"s.": "simple",
	"m.": "martial",
};

Parser.CONDITION_TO_COLOR = {
	"Blinded": "#525252",
	"Charmed": "#f01789",
	"Deafened": "#ababab",
	"Exhausted": "#947a47",
	"Frightened": "#c9ca18",
	"Grappled": "#8784a0",
	"Incapacitated": "#3165a0",
	"Invisible": "#7ad2d6",
	"Paralyzed": "#c00900",
	"Petrified": "#a0a0a0",
	"Poisoned": "#4dc200",
	"Prone": "#5e60a0",
	"Restrained": "#d98000",
	"Stunned": "#a23bcb",
	"Unconscious": "#3a40ad",

	"Concentration": "#009f7a",
};

Parser.RULE_TYPE_TO_FULL = {
	"O": "Optional",
	"V": "Variant",
	"VO": "Variant Optional",
	"VV": "Variant Variant",
	"U": "Unknown",
};

Parser.ruleTypeToFull = function (ruleType) {
	return Parser._parse_aToB(Parser.RULE_TYPE_TO_FULL, ruleType);
};

Parser.VEHICLE_TYPE_TO_FULL = {
	"SHIP": "Ship",
	"CREATURE": "Creature",
	"OBJECT": "Object",
	"SHP:H": "Ship Upgrade, Hull",
	"SHP:M": "Ship Upgrade, Movement",
	"SHP:W": "Ship Upgrade, Weapon",
	"SHP:F": "Ship Upgrade, Figurehead",
	"SHP:O": "Ship Upgrade, Miscellaneous",
	"IWM:W": "Infernal War Machine Variant, Weapon",
	"IWM:A": "Infernal War Machine Upgrade, Armor",
	"IWM:G": "Infernal War Machine Upgrade, Gadget",
};

Parser.vehicleTypeToFull = function (vehicleType) {
	return Parser._parse_aToB(Parser.VEHICLE_TYPE_TO_FULL, vehicleType);
};

SRC_5ETOOLS_TMP = "SRC_5ETOOLS_TMP"; // Temp source, used as a placeholder value

SRC_CDPH = "CDPH";
SRC_DMG = "DMG";
SRC_TZH = "TZH";


SRC_3PP_SUFFIX = " 3pp";


Parser.SOURCE_JSON_TO_FULL = {};
Parser.SOURCE_JSON_TO_FULL[SRC_CDPH] = "Collateral Damage Players Handbook";
Parser.SOURCE_JSON_TO_FULL[SRC_DMG] = "Dungeon Master's Guide";
Parser.SOURCE_JSON_TO_FULL[SRC_TZH] = "The Zenithian Hurdle";
Parser.SOURCE_JSON_TO_FULL[SRC_TftC] = "Tales from the City of White Nights and Dark Days";

Parser.SOURCE_JSON_TO_ABV = {};
Parser.SOURCE_JSON_TO_ABV[SRC_CDPH] = "CDPH";
Parser.SOURCE_JSON_TO_ABV[SRC_DMG] = "DMG";
Parser.SOURCE_JSON_TO_ABV[SRC_TZH] = "TZH";
Parser.SOURCE_JSON_TO_ABV[SRC_TftC] = "TfTC";


Parser.SOURCE_JSON_TO_DATE = {};
Parser.SOURCE_JSON_TO_DATE[SRC_CDPH] = "2021-07-01";
Parser.SOURCE_JSON_TO_DATE[SRC_DMG] = "2014-12-09";
Parser.SOURCE_JSON_TO_DATE[SRC_TZH] = "2021-11-26";
Parser.SOURCE_JSON_TO_DATE[SRC_TftC] = "2021-11-01";


Parser.SOURCES_ADVENTURES = new Set([
]);
Parser.SOURCES_CORE_SUPPLEMENTS = new Set(Object.keys(Parser.SOURCE_JSON_TO_FULL).filter(it => !Parser.SOURCES_ADVENTURES.has(it)));
Parser.SOURCES_NON_STANDARD_WOTC = new Set([
]);
Parser.SOURCES_VANILLA = new Set([ // An opinionated set of source that could be considered "core-core"
	SRC_CDPH,
	SRC_DMG
]);
Parser.SOURCES_AVAILABLE_DOCS_BOOK = {};
[
	SRC_CDPH,
	SRC_DMG

].forEach(src => {
	Parser.SOURCES_AVAILABLE_DOCS_BOOK[src] = src;
	Parser.SOURCES_AVAILABLE_DOCS_BOOK[src.toLowerCase()] = src;
});
Parser.SOURCES_AVAILABLE_DOCS_ADVENTURE = {};
[SRC_TZH].forEach(src => {
	Parser.SOURCES_AVAILABLE_DOCS_ADVENTURE[src] = src;
	Parser.SOURCES_AVAILABLE_DOCS_ADVENTURE[src.toLowerCase()] = src;
});

Parser.TAG_TO_DEFAULT_SOURCE = {
	"spell": SRC_CDPH,
	"item": SRC_CDPH,
	"class":SRC_CDPH,
	"creature": SRC_CDPH,
	"condition": SRC_CDPH,
	"disease": SRC_CDPH,
	"status": SRC_CDPH,
	"background": SRC_CDPH,
	"race": SRC_CDPH,
	"optfeature": SRC_CDPH,
	"reward": SRC_CDPH,
	"feat": SRC_CDPH,
	"psionic": SRC_CDPH,
	"object": SRC_CDPH,
	"cult": SRC_CDPH,
	"boon": SRC_CDPH,
	"trap": SRC_CDPH,
	"hazard":SRC_CDPH,
	"deity":SRC_CDPH,
	"variantrule": SRC_CDPH,
	"vehicle": SRC_CDPH,
	"vehupgrade": SRC_CDPH,
	"action": SRC_CDPH,
	"classFeature": SRC_CDPH,
	"subclassFeature": SRC_CDPH,
	"table": SRC_CDPH,
	"language": SRC_CDPH,
	"charoption": SRC_CDPH,
	"recipe": SRC_CDPH,
	"itemEntry": SRC_CDPH,

	"song": SRC_CDPH,
	"drug": SRC_CDPH,
	"modification": SRC_CDPH,
	"creation": SRC_CDPH
};
Parser.getTagSource = function (tag, source) {
	if (source && source.trim()) return source;

	tag = tag.trim();
	if (tag.startsWith("@")) tag = tag.slice(1);

	if (!Parser.TAG_TO_DEFAULT_SOURCE[tag]) throw new Error(`Unhandled tag "${tag}"`);
	return Parser.TAG_TO_DEFAULT_SOURCE[tag];
};

Parser.ITEM_TYPE_JSON_TO_ABV = {
	"Mod": "Modification",
	"Ammo": "Ammunition",
	"ArtT": "Artisan's Tools",
	"Expl": "Explosive",
	"Food": "Food and Drink",
	"Gear": "Gear",
	"Drug": "Drug",
	"PGS" : "Physical Gaming Set",
	"ArmorL": "Light Armor",
	"ArmorM": "Medium Armor",
	"ArmorH": "Heavy Armor",
	"ArmorP": "Power Armor",
	"INS": "Instrument",
	"WeaponM": "Melee Weapon",
	"WeaponRU": "Ranged Weapon",
	"WeaponRR": "Ranged Weapon (Recoverable Ammunition)",
	"Shield": "Shield",
	"Other": "Other",
	"Tool": "Tool",
	"Trade": "Trade Good",
	"treasure": "Treasure",
	"VEHL": "Land Vehicle",
	"VEHF": "Liquid Vehicle",
	"VEHA": "Air Vehicle",
	"VEHS": "Space Vehicle",
	"VEHAR": "General Use Space Vehicle"
};

Parser.DMGTYPE_JSON_TO_FULL = {
	"A": "acid",
	"B": "bludgeoning",
	"C": "cold",
	"CD": "constitution",
	"EG": "energenetic",
	"EG:D": "dark",
	"EG:L": "light",
	"EG:T": "time",
	"EG:S": "space",
	"EG:C": "chaos",
	"EG:M": "magic",
	"EG:P": "psychic",
	"EM": "electromagnetic",
	"EL": "electric",
	"EX": "explosion",	
	"F": "fire",
	"Fa": "fall",
	"H": "heat",
	"KO": "knockout",
	"La": "laser",
	"P": "piercing",
	"PLC": "cold plasma",
	"PL": "plasma",
	"S": "slashing",
	"T": "true damage"
};

Parser.DMG_TYPES = ["acid", "bludgeoning", "cold", "constitution", "energy", "energenetic", "dark", "light", "time", "space", "chaos", "magic", "psychic", "electromagnetic", "electric", "explosion", "fire", "heat", "kinetic", "knockout", "photonic", "laser", "piercing", "cold plasma", "plasma", "slashing", "true damage", "temperature"];
Parser.CONDITIONS = ["blinded", "charmed", "deafened", "exhaustion", "frightened", "grappled", "incapacitated", "invisible", "paralyzed", "petrified", "poisoned", "prone", "restrained", "stunned", "unconscious"];
Parser.ENERGENETICS = ["Dark","Light","Time","Space","Chaos","Magic","Psychic"];

Parser.SKILL_JSON_TO_FULL = {
	"Acrobatics": [
		"Your Dexterity (Acrobatics) check covers your attempt to stay on your feet in a tricky situation, such as when you're trying to run across a sheet of ice, balance on a tightrope, or stay upright on a rocking ship's deck. The DM might also call for a Dexterity (Acrobatics) check to see if you can perform acrobatic stunts, including dives, rolls, somersaults, and flips.",
	],
	"Animal Handling": [
		"When there is any question whether you can calm down a domesticated animal, keep a mount from getting spooked, or intuit an animal's intentions, the DM might call for a Wisdom (Animal Handling) check. You also make a Wisdom (Animal Handling) check to control your mount when you attempt a risky maneuver.",
	],
	"Arcana": [
		"Your Intelligence (Arcana) check measures your ability to recall lore about spells, magic items, eldritch symbols, magical traditions, the planes of existence, and the inhabitants of those planes.",
	],
	"Athletics": [
		"Your Strength (Athletics) check covers difficult situations you encounter while climbing, jumping, or swimming. Examples include the following activities:",
		{
			"type": "list",
			"items": [
				"You attempt to climb a sheer or slippery cliff, avoid hazards while scaling a wall, or cling to a surface while something is trying to knock you off.",
				"You try to jump an unusually long distance or pull off a stunt mid jump.",
				"You struggle to swim or stay afloat in treacherous currents, storm-tossed waves, or areas of thick seaweed. Or another creature tries to push or pull you underwater or otherwise interfere with your swimming.",
			],
		},
	],
	"Computers": [
		"Computers skill stuff",
	],
	"Deception": [
		"Your Charisma (Deception) check determines whether you can convincingly hide the truth, either verbally or through your actions. This deception can encompass everything from misleading others through ambiguity to telling outright lies. Typical situations include trying to fast-talk a guard, con a merchant, earn money through gambling, pass yourself off in a disguise, dull someone's suspicions with false assurances, or maintain a straight face while telling a blatant lie.",
	],
	"Energenetics": [
		"Energenetics skill stuff",
	],
	"History": [
		"Your Intelligence (History) check measures your ability to recall lore about historical events, legendary people, ancient kingdoms, past disputes, recent wars, and lost civilizations.",
	],
	"Insight": [
		"Your Wisdom (Insight) check decides whether you can determine the true intentions of a creature, such as when searching out a lie or predicting someone's next move. Doing so involves gleaning clues from body language, speech habits, and changes in mannerisms.",
	],
	"Intimidation": [
		"When you attempt to influence someone through overt threats, hostile actions, and physical violence, the DM might ask you to make a Charisma (Intimidation) check. Examples include trying to pry information out of a prisoner, convincing street thugs to back down from a confrontation, or using the edge of a broken bottle to convince a sneering vizier to reconsider a decision.",
	],
	"Investigation": [
		"When you look around for clues and make deductions based on those clues, you make an Intelligence (Investigation) check. You might deduce the location of a hidden object, discern from the appearance of a wound what kind of weapon dealt it, or determine the weakest point in a tunnel that could cause it to collapse. Poring through ancient scrolls in search of a hidden fragment of knowledge might also call for an Intelligence (Investigation) check.",
	],
	"Mechanical Manipulation": [
		"Mechanical Manipulation skill stuff",
	],
	"Medicine": [
		"A Wisdom (Medicine) check lets you try to stabilize a dying companion or diagnose an illness.",
	],
	"Memory": [
		"Memory skill stuff.",
	],
	"Nature": [
		"Your Intelligence (Nature) check measures your ability to recall lore about terrain, plants and animals, the weather, and natural cycles.",
	],
	"Pain Tolerance": [
		"Pain Tolerance skill stuff",
	],
	"Perception": [
		"Your Wisdom (Perception) check lets you spot, hear, or otherwise detect the presence of something. It measures your general awareness of your surroundings and the keenness of your senses.", "For example, you might try to hear a conversation through a closed door, eavesdrop under an open window, or hear monsters moving stealthily in the forest. Or you might try to spot things that are obscured or easy to miss, whether they are orcs lying in ambush on a road, thugs hiding in the shadows of an alley, or candlelight under a closed secret door.",
	],
	"Performance": [
		"Your Charisma (Performance) check determines how well you can delight an audience with music, dance, acting, storytelling, or some other form of entertainment.",
	],
	"Persuasion": [
		"When you attempt to influence someone or a group of people with tact, social graces, or good nature, the DM might ask you to make a Charisma (Persuasion) check. Typically, you use persuasion when acting in good faith, to foster friendships, make cordial requests, or exhibit proper etiquette. Examples of persuading others include convincing a chamberlain to let your party see the king, negotiating peace between warring tribes, or inspiring a crowd of townsfolk.",
	],
	"Religion": [
		"Your Intelligence (Religion) check measures your ability to recall lore about deities, rites and prayers, religious hierarchies, holy symbols, and the practices of secret cults.",
	],
	"Scientific Knowledge": [
		"Scientific Knowledge skill stuff",
	],
	"Sleight of Hand": [
		"Whenever you attempt an act of legerdemain or manual trickery, such as planting something on someone else or concealing an object on your person, make a Dexterity (Sleight of Hand) check. The DM might also call for a Dexterity (Sleight of Hand) check to determine whether you can lift a coin purse off another person or slip something out of another person's pocket.",
	],
	"Stamina": [
		"Stamina skill stuff",
	],
	"Stealth": [
		"Make a Dexterity (Stealth) check when you attempt to conceal yourself from enemies, slink past guards, slip away without being noticed, or sneak up on someone without being seen or heard.",
	],
	"Survival": [
		"The DM might ask you to make a Wisdom (Survival) check to follow tracks, hunt wild game, guide your group through frozen wastelands, identify signs that owlbears live nearby, predict the weather, or avoid quicksand and other natural hazards.",
	],
};

Parser.SENSE_JSON_TO_FULL = {
	"blindsight": [
		"A creature with blindsight can perceive its surroundings without relying on sight, within a specific radius. Creatures without eyes, such as oozes, and creatures with echolocation or heightened senses, such as bats and true dragons, have this sense.",
	],
	"darkvision": [
		"Many creatures in fantasy gaming worlds, especially those that dwell underground, have darkvision. Within a specified range, a creature with darkvision can see in dim light as if it were bright light and in darkness as if it were dim light, so areas of darkness are only lightly obscured as far as that creature is concerned. However, the creature can't discern color in that darkness, only shades of gray.",
	],
	"tremorsense": [
		"A creature with tremorsense can detect and pinpoint the origin of vibrations within a specific radius, provided that the creature and the source of the vibrations are in contact with the same ground or substance. Tremorsense can't be used to detect flying or incorporeal creatures. Many burrowing creatures, such as ankhegs and umber hulks, have this special sense.",
	],
	"truesight": [
		"A creature with truesight can, out to a specific range, see in normal and magical darkness, see invisible creatures and objects, automatically detect visual illusions and succeed on saving throws against them, and perceives the original form of a shapechanger or a creature that is transformed by magic. Furthermore, the creature can see into the Ethereal Plane.",
	],
};

Parser.NUMBERS_ONES = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
Parser.NUMBERS_TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
Parser.NUMBERS_TEENS = ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
