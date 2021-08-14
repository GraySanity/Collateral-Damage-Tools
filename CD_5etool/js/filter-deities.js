"use strict";

class PageFilterDeities extends PageFilter {
	static unpackMatterenergy (g) {
		g.matterenergy.sort(SortUtil.matterenergySort);
		if (g.matterenergy.length === 2 && g.matterenergy.includes("N")) {
			const out = [...g.matterenergy];
			if (out[0] === "N") out[0] = "NX";
			else out[1] = "NY";
			return out;
		}
		return MiscUtil.copy(g.matterenergy);
	}

	constructor () {
		super();
		this._sourceFilter = new SourceFilter();
		this._pantheonFilter = new Filter({header: "Pantheon", items: []});
		this._categoryFilter = new Filter({header: "Category", items: [VeCt.STR_NONE]});
		this._matterenergyFilter = new Filter({
			header: "Matterenergy",
			items: ["L", "NX", "C", "G", "NY", "E", "N"],
			displayFn: it => Parser.matterenergyAbvToFull(it).toTitleCase(),
			itemSortFn: null,
		});
		this._domainFilter = new Filter({
			header: "Domain",
			items: ["Death", "Knowledge", "Life", "Light", "Nature", VeCt.STR_NONE, "Tempest", "Trickery", "War"],
		});
		this._miscFilter = new Filter({
			header: "Miscellaneous",
			items: ["Grants Piety Features", "Has Info", PageFilterDeities._STR_REPRINTED, "SRD"],
			displayFn: StrUtil.uppercaseFirst,
			deselFn: (it) => { return it === PageFilterDeities._STR_REPRINTED },
			isSrdFilter: true,
		});
	}

	static mutateForFilters (g) {
		g._fAlign = g.matterenergy ? PageFilterDeities.unpackMatterenergy(g) : [];
		if (!g.category) g.category = VeCt.STR_NONE;
		if (!g.domains) g.domains = [VeCt.STR_NONE];
		g.domains.sort(SortUtil.ascSort);

		g._fMisc = g.reprinted ? [PageFilterDeities._STR_REPRINTED] : [];
		if (g.srd) g._fMisc.push("SRD");
		if (g.entries || g.symbolImg) g._fMisc.push("Has Info");
		if (g.piety) g._fMisc.push("Grants Piety Features");
	}

	addToFilters (g, isExcluded) {
		if (isExcluded) return;

		this._sourceFilter.addItem(g.source);
		this._domainFilter.addItem(g.domains);
		this._pantheonFilter.addItem(g.pantheon);
		this._categoryFilter.addItem(g.category);
	}

	async _pPopulateBoxOptions (opts) {
		opts.filters = [
			this._sourceFilter,
			this._matterenergyFilter,
			this._pantheonFilter,
			this._categoryFilter,
			this._domainFilter,
			this._miscFilter,
		];
	}

	toDisplay (values, g) {
		return this._filterBox.toDisplay(
			values,
			g.source,
			g._fAlign,
			g.pantheon,
			g.category,
			g.domains,
			g._fMisc,
		)
	}
}
PageFilterDeities._STR_REPRINTED = "reprinted";