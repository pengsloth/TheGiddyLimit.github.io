const STR_SLUG_DASH = "-";
const STR_JOIN_MODE_LIST = ",";
const STR_JOIN_MODE_TITLE_BRACKET_PART_LIST = "; ";
const STR_JOIN_MODE_TITLE = " ";
const STR_ABV_TYPE_TALENT = "T";
const STR_ABV_TYPE_DISCIPLINE = "D";
const STR_TYPE_TALENT = "Talent";
const STR_TYPE_DISCIPLINE = "Discipline";
const STR_ORDER_NONE = "None";

const TMP_WINDOW_HASH = "#{0}";
const TMP_TYPE_ORDER = "{0} {1}";
const TMP_DISCIPLINE_TEXT = "{0}{1}{2}";
const TMP_DESCRIPTION = "<p>{0}</p>";
const TMP_FOCUS = "<p><span class='psi-focus-title'>Psycic Focus.</span> {0}</p>";
const TMP_HIDDEN_MODE = "\"{0}\"";
const TMP_MODE_TITLE = "<span class='psi-mode-title'>{0}.</span> ";
const TMP_MODE_WITH_SUB_MODE = "{0}{1}";
const TMP_MODE_TITLE_BRACKET_PART = "({0})";
const TMP_MODE_TITLE_COST = "{0} psi";
const TMP_MODE_TITLE_COST_RANGE = "{0}-{1}";
const TMP_MODE_TITLE_CONCENTRATION = "conc., {0} {1}.";

const ID_PSIONICS_LIST = "psionicsList";
const ID_LIST_CONTAINER = "listContainer";
const ID_SEARCH_BAR = "filter-search-input-group";
const ID_STATS_NAME = "name";
const ID_STATS_ORDER_AND_TYPE = "orderAndType";
const ID_STATS_DURATION = "duration";
const ID_TEXT = "text";

const JSON_ITEM_NAME = "name";
const JSON_ITEM_SOURCE = "source";
const JSON_ITEM_TYPE = "type";
const JSON_ITEM_ORDER = "order";
const JSON_ITEM_TEXT = "text";
const JSON_ITEM_DURATION = "duration";
const JSON_ITEM_DESCRIPTION = "description";
const JSON_ITEM_FOCUS = "focus";
const JSON_ITEM_MODES = "modes";
const JSON_ITEM_SUBMODES = "submodes";
const JSON_ITEM_MODE_TITLE = "title";
const JSON_ITEM_MODE_TEXT = "text";
const JSON_ITEM_MODE_COST = "cost";
const JSON_ITEM_MODE_COST_MIN = "min";
const JSON_ITEM_MODE_COST_MAX = "max";
const JSON_ITEM_MODE_CONCENTRATION = "concentration";
const JSON_ITEM_MODE_CONCENTRATION_DURATION = "duration";
const JSON_ITEM_MODE_CONCENTRATION_UNIT = "unit";

const CLS_PSIONICS = "psionics";
const CLS_ROW = "row";
const CLS_COL1 = "col-xs-5";
const CLS_COL2 = "col-xs-2";
const CLS_COL3 = "col-xs-2";
const CLS_COL4 = "col-xs-2";
const CLS_HIDDEN = "hidden";
const CLS_LI_NONE = "list-entry-none";

const LIST_NAME = "name";
const LIST_SOURCE = "source";
const LIST_TYPE = "type";
const LIST_ORDER = "order";
const LIST_MODE_LIST = "mode-list";

window.onload = function load() {
	const TABLE_VIEW = document.getElementById(ID_PSIONICS_LIST);

	const PSIONIC_LIST = psionicdata.compendium.psionic;
	populateListView();
	let listView = initListLibrary();
	initFiltersAndSearch(listView);
	selectInitialPsionic();

	function populateListView() {
		for (let i = 0; i < PSIONIC_LIST.length; ++i) {
			let psionic = PSIONIC_LIST[i];

			let listItem = getListItem(psionic, i);
			listItem.appendChild(getNameSpan(psionic));
			listItem.appendChild(getSourceSpan(psionic));
			listItem.appendChild(getTypeSpan(psionic));
			listItem.appendChild(getOrderSpan(psionic));
			listItem.appendChild(getHiddenModeSpan(psionic));
			listItem.addEventListener(EVNT_CLICK, listItemClick, false);

			TABLE_VIEW.appendChild(listItem);
		}

		function getListItem(psionic, i) {
			let listItem = document.createElement(ELE_LI);
			listItem.setAttribute(ATB_CLASS, CLS_ROW);
			listItem.setAttribute(ATB_ID, String(i));
			listItem.setAttribute(ATB_DATA_LINK, utils_nameToDataLink(psionic[JSON_ITEM_NAME]));
			listItem.setAttribute(ATB_TITLE, psionic[JSON_ITEM_NAME]);
			return listItem;
		}
		function getNameSpan(psionic) {
			let span = document.createElement(ELE_SPAN);
			span.classList.add(LIST_NAME);
			span.classList.add(CLS_COL1);
			span.innerHTML = psionic[JSON_ITEM_NAME];
			return span;
		}
		function getSourceSpan(psionic) {
			let span = document.createElement(ELE_SPAN);
			span.classList.add(LIST_SOURCE);
			span.classList.add(CLS_COL2);
			span.innerHTML = parse_sourceToAbv(psionic[JSON_ITEM_SOURCE]);
			return span;
		}
		function getTypeSpan(psionic) {
			let span = document.createElement(ELE_SPAN);
			span.classList.add(LIST_TYPE);
			span.classList.add(CLS_COL3);
			span.innerHTML = parse_psionicTypeToFull(psionic[JSON_ITEM_TYPE]);
			return span;
		}
		function getOrderSpan(psionic) {
			let span = document.createElement(ELE_SPAN);
			span.classList.add(LIST_ORDER);
			span.classList.add(CLS_COL4);
			let spanText = parse_psionicOrderToFull(psionic[JSON_ITEM_ORDER]);
			if (spanText === STR_ORDER_NONE) {
				span.classList.add(CLS_LI_NONE);
			}
			span.innerHTML = spanText;
			return span;
		}
		function getHiddenModeSpan(psionic) {
			let span = document.createElement(ELE_SPAN);
			span.classList.add(LIST_MODE_LIST);
			span.classList.add(CLS_HIDDEN);
			span.innerHTML = getHiddenModeList(psionic);
			return span;
		}
		function getHiddenModeList(psionic) {
			let modeList = psionic[JSON_ITEM_MODES];
			if (modeList === undefined) return STR_EMPTY;
			let outArray = [];
			for (let i = 0; i < modeList.length; ++i) {
				outArray.push(TMP_HIDDEN_MODE.formatUnicorn(modeList[i][JSON_ITEM_MODE_TITLE]));
			}
			return outArray.join(STR_JOIN_MODE_LIST);
		}
		function listItemClick(event) {
			loadDataLink(this);

			function loadDataLink(listItem) {
				window.location = TMP_WINDOW_HASH.formatUnicorn(listItem.getAttribute(ATB_DATA_LINK));
			}
		}
	}

	function initFiltersAndSearch(listView) {
		const HDR_SOURCE = "Source";
		const HDR_TYPE = "Type";
		const HDR_ORDER = "Order";

		const filters = {};
		filters[HDR_SOURCE] = {item: JSON_ITEM_SOURCE, list: [], renderer: function(str) { return parse_sourceToFull(str); }};
		filters[HDR_TYPE] = {item: JSON_ITEM_TYPE, list: [], renderer: function(str) { return parse_psionicTypeToFull(str); }};
		filters[HDR_ORDER] = {item: JSON_ITEM_ORDER, list: [], renderer: function(str) { return parse_psionicOrderToFull(str); }};

		populateFilterSets();
		sortFilterSets();
		let filterBox = initFilters();

		function populateFilterSets() {
			for (let i = 0; i < PSIONIC_LIST.length; ++i) {
				let psionic = PSIONIC_LIST[i];
				for (let id in filters) {
					if (filters.hasOwnProperty(id)) {
						let filterObj = filters[id];

						if (psionic[filterObj.item] !== undefined && filterObj.list.indexOf(psionic[filterObj.item]) === -1) {
							filterObj.list.push(psionic[filterObj.item]);
						}
					}
				}
			}
		}
		function sortFilterSets() {
			for (let id in filters) {
				if (filters.hasOwnProperty(id)) {
					sortStrings(filters[id].list);
				}
			}

			// add this after sorting, as the last element
			filters[HDR_ORDER].list.push(STR_ORDER_NONE);

			function sortStrings(toSort) {
				toSort.sort(sortStringsComparator);
			}
			function sortStringsComparator(a, b) {
				a = a.toLowerCase();
				b = b.toLowerCase();
				if (a === b) return 0;
				else if (b < a) return 1;
				else if (a > b) return -1;
			}
		}

		function initFilters() {
			let filterAndSearchBar = document.getElementById(ID_SEARCH_BAR);
			let filterList = [];
			for (let title in filters) {
				if (filters.hasOwnProperty(title)) {
					filterList.push(new Filter(title, filters[title].item, filters[title].list, filters[title].renderer, parse_stringToSlug));
				}
			}
			let filterBox = new FilterBox(filterAndSearchBar, filterList);
			filterBox.render();

			filterBox.addEventListener(
				FilterBox.EVNT_VALCHANGE,
				function (event) {
					listView.filter(function(item) {
						let f = filterBox.getValues();
						let v = item.values();

						return filterMatches(HDR_SOURCE, LIST_SOURCE) && filterMatches(HDR_TYPE, LIST_TYPE) && filterMatches(HDR_ORDER, LIST_ORDER);

						function filterMatches(header, listAttrib) {
							if (header === HDR_ORDER) console.log(f, v);
							for (let t in f[header]) {
								if (!f[header].hasOwnProperty(t)) continue;
								if (t === FilterBox.VAL_SELECT_ALL && f[header][t]) return true;
								if (!f[header][t]) continue;

								let originalList = filters[header].list;
								for (let i = 0; i < originalList.length; ++i) {
									if (parse_stringToSlug(originalList[i]) === t) {
										if (v[listAttrib] === filters[header].renderer(originalList[i])) return true;
									}
								}
							}
							return false;
						}
					});
				}
			);

			return filterBox;
		}

	}

	function initListLibrary() {
		return search({
			valueNames: [LIST_NAME, LIST_SOURCE, LIST_TYPE, LIST_ORDER, LIST_MODE_LIST],
			listClass: CLS_PSIONICS,
			sortFunction: listSort
		});

		function listSort(itemA, itemB, options) {
			if (options.valueName === LIST_NAME) return compareBy(LIST_NAME);
			else return compareByOrDefault(options.valueName, LIST_NAME);

			function compareBy(valueName) {
				let aValue = itemA.values()[valueName].toLowerCase();
				let bValue = itemB.values()[valueName].toLowerCase();
				if (aValue === bValue) return 0;
				return (aValue > bValue) ? 1 : -1;
			}
			function compareByOrDefault(valueName, defaultValueName) {
				let initialCompare = compareBy(valueName);
				return initialCompare === 0 ? compareBy(defaultValueName) : initialCompare;
			}
		}
	}

	function selectInitialPsionic() {
		if (window.location.hash.length === 0) {
			let listItems = TABLE_VIEW.getElementsByTagName(ELE_LI);
			if (listItems.length > 0) {
				listItems[0].click();
			}
		} else {
			window.onhashchange();
		}
	}
};

function loadhash (jsonIndex) {
	const STATS_NAME = document.getElementById(ID_STATS_NAME);
	const STATS_ORDER_AND_TYPE = document.getElementById(ID_STATS_ORDER_AND_TYPE);
	const STATS_DURATION = document.getElementById(ID_STATS_DURATION);
	const STATS_TEXT = document.getElementById(ID_TEXT);

	let selectedPsionic = psionicdata.compendium.psionic[jsonIndex];

	STATS_NAME.innerHTML = selectedPsionic[JSON_ITEM_NAME];
	if (selectedPsionic[JSON_ITEM_TYPE] === STR_ABV_TYPE_TALENT) loadTalent();
	else if (selectedPsionic[JSON_ITEM_TYPE] === STR_ABV_TYPE_DISCIPLINE) loadDiscipline();

	function loadTalent() {
		STATS_ORDER_AND_TYPE.innerHTML = parse_psionicTypeToFull(selectedPsionic[JSON_ITEM_TYPE]);
		STATS_TEXT.innerHTML = utils_combineText(selectedPsionic[JSON_ITEM_TEXT], ELE_P);
		STATS_DURATION.innerHTML = STR_EMPTY;
	}
	function loadDiscipline() {
		STATS_ORDER_AND_TYPE.innerHTML = TMP_TYPE_ORDER.formatUnicorn(selectedPsionic[JSON_ITEM_ORDER], parse_psionicTypeToFull(selectedPsionic[JSON_ITEM_TYPE]));
		STATS_TEXT.innerHTML = getTextString();
		STATS_DURATION.innerHTML = getDurationString();

		function getTextString() {
			let modeStringArray = [];
			for (let i = 0; i < selectedPsionic[JSON_ITEM_MODES].length; ++i) {
				modeStringArray.push(getModeString(i));
			}

			return TMP_DISCIPLINE_TEXT.formatUnicorn(getDescriptionString(), getFocusString(), modeStringArray.join(STR_EMPTY));
		}
		function getDescriptionString() {
			return TMP_DESCRIPTION.formatUnicorn(selectedPsionic[JSON_ITEM_DESCRIPTION]);
		}
		function getFocusString() {
			return TMP_FOCUS.formatUnicorn(selectedPsionic[JSON_ITEM_FOCUS]);
		}
		function getModeString(modeIndex) {
			let modeString = utils_combineText(selectedPsionic[JSON_ITEM_MODES][modeIndex][JSON_ITEM_MODE_TEXT], ELE_P, getModeTitle());
			if (selectedPsionic[JSON_ITEM_MODES][modeIndex][JSON_ITEM_SUBMODES] === undefined) return modeString;
			let subModeString = ""; // TODO
			return TMP_MODE_WITH_SUB_MODE.formatUnicorn(modeString, subModeString);

			function getModeTitle() {
				let modeTitleArray = [];
				modeTitleArray.push(selectedPsionic[JSON_ITEM_MODES][modeIndex][JSON_ITEM_MODE_TITLE]);
				let bracketPart = getModeTitleBracketPart();
				if (bracketPart !== null) modeTitleArray.push(bracketPart);
				return TMP_MODE_TITLE.formatUnicorn(modeTitleArray.join(STR_JOIN_MODE_TITLE));

				function getModeTitleBracketPart() {
					let modeTitleBracketArray = [];

					if (selectedPsionic[JSON_ITEM_MODES][modeIndex][JSON_ITEM_MODE_COST]) modeTitleBracketArray.push(getModeTitleCost());
					if (selectedPsionic[JSON_ITEM_MODES][modeIndex][JSON_ITEM_MODE_CONCENTRATION]) modeTitleBracketArray.push(getModeTitleConcentration());

					if (modeTitleBracketArray.length === 0) return null;
					return TMP_MODE_TITLE_BRACKET_PART.formatUnicorn(modeTitleBracketArray.join(STR_JOIN_MODE_TITLE_BRACKET_PART_LIST));

					function getModeTitleCost() {
						let costMin = selectedPsionic[JSON_ITEM_MODES][modeIndex][JSON_ITEM_MODE_COST][JSON_ITEM_MODE_COST_MIN];
						let costMax = selectedPsionic[JSON_ITEM_MODES][modeIndex][JSON_ITEM_MODE_COST][JSON_ITEM_MODE_COST_MAX];
						let costString = costMin === costMax ? costMin : TMP_MODE_TITLE_COST_RANGE.formatUnicorn(costMin, costMax);
						return TMP_MODE_TITLE_COST.formatUnicorn(costString)
					}
					function getModeTitleConcentration() {
						return TMP_MODE_TITLE_CONCENTRATION.formatUnicorn(selectedPsionic[JSON_ITEM_MODES][modeIndex][JSON_ITEM_MODE_CONCENTRATION][JSON_ITEM_MODE_CONCENTRATION_DURATION], selectedPsionic[JSON_ITEM_MODES][modeIndex][JSON_ITEM_MODE_CONCENTRATION][JSON_ITEM_MODE_CONCENTRATION_UNIT])
					}
				}
			}
		}
	}
	function getDurationString() {
		let duration = selectedPsionic[JSON_ITEM_DURATION];
		if (duration === undefined) return STR_EMPTY;
		else return getDurationElement();

		function getDurationElement() {

		}
	}
}

function parse_psionicTypeToFull(type) {
	if (type === STR_ABV_TYPE_TALENT) return STR_TYPE_TALENT;
	else if (type === STR_ABV_TYPE_DISCIPLINE) return STR_TYPE_DISCIPLINE;
	else return type;
}
function parse_psionicOrderToFull(order) {
	return order === undefined ? STR_ORDER_NONE : order;
}
