// ==UserScript==
// @name           tooltips_fix
// @namespace      tooltips_fix
// @version        1.0.0
// @author         FallenStar
// @ignorecache
// @description    fix the ugly ass tooltips of firefox with 3 styles (deep is better)
// ==/UserScript==

//Need https://github.com/MrOtherGuy/fx-autoconfig
// ignorecache needed for quick testing
// load order probably irrelevant

//https://searchfox.org/mozilla-central/source/browser/components/tabbrowser/content/tabbrowser.js
//gBrowser stuff & more, also events & def for stuff

(function () {
	//classic backdrop
	const css1 = /* css */ ` 
    tooltip {
            background-color: rgba(5, 5, 5, 0.5) !important;
            border-radius   : 12px !important;
            box-shadow      : 0 4px 8px rgba(0, 0, 0, 0.1) !important;
            backdrop-filter : blur(100px) saturate(110%) !important;
            transition      : background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out !important;
            padding         : 5px !important;
            border          : none !important;
    }
    `;
	//deep
	const css2 = /* css */ `
    tooltip {
        border-radius   : 12px !important;
        transition      : background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
        padding         : 5px;
        border          : none !important;
        background-color: rgba(5, 5, 5, 0.88) !important;
        box-shadow      : inset 0px 2px 0px 0px #00000020, inset 0px 2px 8px 0px #00000040 !important;    }
    `;
	//elevated
	const css3 = /* css */ `
    tooltip {
            box-shadow: 0px 2px 0px 0px #FFFFFF0f, 
            0px 2px 8px 0px #00000040,
            inset 0px 8px 8px 0px #FFFFFF07 !important;
            outline: 1px solid #ffffff10 !important;
            outline-offset: -1px !important;
            background-color: transparent !important;
            border          : none !important;
            padding         : 5px !important;
            transition      : background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out !important;
    }
    `;
	var sss = Cc["@mozilla.org/content/style-sheet-service;1"].getService(
		Ci.nsIStyleSheetService
	);
	var uri = makeURI(
		"data:text/css;charset=UTF=8," + encodeURIComponent(css1)
	);
	sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);
})();
