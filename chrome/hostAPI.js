/*	Marking Menu JS
 *  by Brenton Simpson
 *  bsimpson@appsforartists.com
 *	7/24/2011
 */

var hostAPI = {
	'getURL':			function(path) {
		return chrome.extension.getURL(path);
	},
	
	'loadVariable':		function(key, callback) {
		message = {
			'action':	'getFromLocalStorage',
			'key':		key,
		}
	
		var setLocalVariable = function(response) {
			window[response.key] = response.value;
			
			if (callback)
				callback();
		}
	
		sendRequest(message, setLocalVariable);
	},
	
	'storeVariable':	function(key) {
		message = {
			'action':	'storeInLocalStorage',
			'key':		key,
			'value':	window[key],
		}
	
		sendRequest(message);
	},
	
	'sendRequest':		function(message, callback) {
		chrome.extension.sendRequest(message, callback);
	}
}