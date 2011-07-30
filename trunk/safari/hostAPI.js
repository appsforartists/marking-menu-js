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
		if (_pendingResponses.length > 10) {
			console.log('_pendingResponses is out of control!');
			console.log(_pendingResponses);
			return;
		}
		
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
				// This presumes that the messages come back in the order they were sent; there's no other guarantee that only one message with this action will be pending.
				
				var currentResponse = _pendingResponses.splice(i, 1).pop();
				
				if (currentResponse.callback)
					currentResponse.callback.apply(this, event.message);
				
				return;
			}
		}
	}
}

safari.self.addEventListener('message', onMessage);
