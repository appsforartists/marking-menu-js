/*		Chrome Marking Menu
 *  	by Brenton Simpson
 *  	bsimpson@appsforartists.com
 *		4/2/2010
 */

const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

const MIDDLE_MOUSE = '1';
const RIGHT_MOUSE = '2';

const MarkingMenuEvent = {
	'VARIABLES_INITIALIZED':	'com.appsforartists.markingMenu.variablesInitialized'
}

var settings = ['actions', 'actionImages', 'triggerButton'];
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
for (var i = 0; i < defaultSettings['actions'].length; i++) {
	defaultSettings['actionImages'].push('images/' + defaultSettings['actions'][i] + '.png');
}

var distanceToItems = 55;
var itemSize = 42;
var rimSize = 13;
var menuDiameter = 2 * rimSize + itemSize + 2 * distanceToItems;

function getFromLocalStorage(key, defaultValue) {
	message = {
		'action':			'getFromLocalStorage',
		'key':				key,
		'defaultValue':		defaultValue
	}
	
	var setLocalVariable = function(response) {
		this[response.key] = response.value;
		tryToDispatchVariablesInitialized();
	}
	
	chrome.extension.sendRequest(message, setLocalVariable);
}

function storeInLocalStorage(key, value, callback) {
	message = {
		'action':	'storeInLocalStorage',
		'key':		key,
		'value':	value,
	}
	
	callback = callback || function(){};
	
	chrome.extension.sendRequest(message, callback);
}

function resetDefaultSettings(event) {
	var settingsCount = settings.length;
	
	var callback = function () {
		var _settingsPending = settingsCount;
		
		return function() {
			_settingsPending--;
			
			try {
				if (!_settingsPending)
					initializeForm();
			} catch (error) {
				//initializeForm only exists in preferences.html, so it might be undefined here.
			}
		}
	}();
	
	for (var i = 0; i < settingsCount; i++) {
		storeInLocalStorage(settings[i], defaultSettings[settings[i]], callback);
	}
}

function initializeVariables() {
	for (var i = 0; i < settings.length; i++) {
		getFromLocalStorage(settings[i], defaultSettings[settings[i]])
	}	
}

function tryToDispatchVariablesInitialized(event) {
	var complete = true;
	
	for (var i = 0; i < settings.length; i++) {
		complete = complete && this.hasOwnProperty(settings[i]);
	}
	
	if (complete) {
		var event = document.createEvent('Event')
		event.initEvent(MarkingMenuEvent.VARIABLES_INITIALIZED);
		window.dispatchEvent(event);
	}
}