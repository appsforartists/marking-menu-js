/*	Marking Menu JS
 *  by Brenton Simpson
 *  bsimpson@appsforartists.com
 *	7/24/2011
 */

var _pendingResponses = [];

var hostAPI = {
	'getURL':			function(path) {
		return safari.extension.baseURI + path;
	},
	
	'sendRequest':		function(message, callback) {
		var action = message.action;
		
		_pendingResponses.push({
			'action':	action,
			'callback': callback
		});
				
		safari.self.tab.dispatchMessage(action, message);
	}
}

function onMessage(event) {
	/*	If this message is a response to an earlier request, call the appropriate
	 *	callback with the arguments sent back from the background page.
	 */
		
	var action = event.name;
	
	if (action.substr(0, MessageAPI.RESPONSE_PREFIX.length) == MessageAPI.RESPONSE_PREFIX) {
		action = action.substr(MessageAPI.RESPONSE_PREFIX.length);
		
		for (var i = 0; i < _pendingResponses.length; i++) {
			if (_pendingResponses[i].action == action) {
				_pendingResponses[i].callback.apply(this, event.message);
				_pendingResponses = _pendingResponses.splice(i, 1);
				
				return;
			}
		}
	}
}

safari.self.addEventListener('message', onMessage);
