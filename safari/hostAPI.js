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
		// Create a unique signature so we'll know which message the background page is responding to later.
		var signature = [new Date().valueOf(), Math.random()].join(';');
		
		for (var key in message) {
			signature += ';' + key + '=' + message[key];
		}
		
		console.log('sending ' + signature);

		message['signature'] = signature;
		
		_pendingResponses.push({
			'signature':	signature,
			'callback': 	callback
		});
		
				
		safari.self.tab.dispatchMessage(message.action, message);
	}
}

function onMessage(event) {
	var action = event.name;
	
	/*	If this message is a response to an earlier request, call the appropriate
	 *	callback with the arguments sent back from the background page.
	 */

	console.log('received ' + action);
		
	if (action.substr(0, MessageAPI.RESPONSE_PREFIX.length) == MessageAPI.RESPONSE_PREFIX) {
		var signature = action.substr(MessageAPI.RESPONSE_PREFIX.length);
		
		for (var i = 0; i < _pendingResponses.length; i++) {
			if (_pendingResponses[i].signature == signature) {
				// signature is a Safari-specific implementation detail - don't pollute the response with it.
				delete event.message.signature;
				
				var currentResponse = _pendingResponses.splice(i, 1).pop();
				
				if (currentResponse.callback)
					currentResponse.callback.apply(this, event.message);
				
				return;
			}
		}
	}
}

safari.self.addEventListener('message', onMessage);
