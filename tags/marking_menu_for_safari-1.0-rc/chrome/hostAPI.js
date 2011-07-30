/*	Marking Menu JS
 *  by Brenton Simpson
 *  bsimpson@appsforartists.com
 *	7/24/2011
 */

var hostAPI = {
	'getURL':			function(path) {
		return chrome.extension.getURL(path);
	},
		
	'sendRequest':		function(message, callback) {
		callback = callback || function() {};
		
		chrome.extension.sendRequest(message, callback);
	}
}