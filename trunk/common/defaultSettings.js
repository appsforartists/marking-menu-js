/*	Marking Menu JS
 *  by Brenton Simpson
 *  bsimpson@appsforartists.com
 *	7/24/2011
 */

const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

const MIDDLE_MOUSE = '1';
const RIGHT_MOUSE = '2';

const MarkingMenuEvent = {
	'VARIABLES_INITIALIZED':	'com.appsforartists.markingMenu.variablesInitialized'
}

var defaultSettings = {
	'actions':	[
		'com.appsforartists.pageDown',
		'com.appsforartists.newTab',
		'com.appsforartists.previousPage',
		'com.appsforartists.previousTab',
		'com.appsforartists.pageUp',
		'com.appsforartists.nextTab',
		'com.appsforartists.nextPage',
		'com.appsforartists.closeTab'
	],
	'actionImages':		[],
	'triggerButton':	MIDDLE_MOUSE
}

defaultSettings['actionImages'] = defaultSettings.actions.map(imageForAction);

var distanceToItems = 55;
var itemSize = 42;
var rimSize = 13;
var menuDiameter = 2 * rimSize + itemSize + 2 * distanceToItems;

var firstRun = true;

function initializeVariables(resetToDefaults) {
	/*	Loads the variables from the background page.  If this is the first
	 *	time this extension has loaded, or if resetToDefaults is true, the 
	 *	default settings will be used.
	 *
	 *	Dispatches MarkingMenuEvent.VARIABLES_INITIALIZED when finished.
	 */

	resetToDefaults = resetToDefaults || false;
	
	loadSetting('firstRun', finishInitializingVariables);

	function finishInitializingVariables () {
		resetToDefaults = firstRun || resetToDefaults;
		
		
		var settingsRemaining = Object.keys(defaultSettings).length;
	
		var callback = function () {
			settingsRemaining--;
			
			if (!settingsRemaining) {
				var event = document.createEvent('Event')
				event.initEvent(MarkingMenuEvent.VARIABLES_INITIALIZED);
				window.dispatchEvent(event);
			}
		}


		for (var key in defaultSettings) {
			if (resetToDefaults) {
				window[key] = defaultSettings[key];
				storeSetting(key);
				callback();
			} else {
				loadSetting(key, callback);
			}
		}
		
		firstRun = false;
		storeSetting('firstRun');
	}
}

function loadSetting(key, callback) {
	message = {
		'action':	'settings.get',
		'key':		key,
	}

	var setLocalVariable = function(response) {
		window[response.key] = response.value;
		
		if (callback)
			callback();
	}

	hostAPI.sendRequest(message, setLocalVariable);
}

function storeSetting(key, callback) {
	message = {
		'action':	'settings.set',
		'key':		key,
		'value':	window[key],
	}

	hostAPI.sendRequest(message, callback);
}
