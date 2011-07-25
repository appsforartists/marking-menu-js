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
	
	
	/* These aren't a regular getter/setter pair because we have to implement the
	* same API in Chrome asynchronously.
	*/
		
	'loadVariable':		function(key, callback) {
		switch (key) {
			// Don't need to initialize default settings, since Safari saves them in a plist
			case 'firstRun':
				window.firstRun = false;
				break;

			case 'actions':
				var i = 0;
				var actions = [];
				
				do {
					try {
						var nextAction = safari.extension.settings['action' + i];
					} catch (error) {
						//When you run out of actions, you get an error
						break;
					}
					
					actions.push(nextAction);
				} while (i++);
				
				window.actions = actions;
				//Use defaultSettings' imageForAction to keep actions and actionImages in sync.
				window.actionImages = actions.map(imageForAction);
				break;
				
			case 'actionImages':
				if (!window.actionImages)
					console.log("Use loadVariable('actions'); to populate actionImages on Safari");
				
				break;

			default:
				window[key] = safari.extension.settings[key];
				break;
		}
		
		if (callback)
			callback();
	},
	
	'storeVariable':	function(key) {
		switch (key) {
			case 'actions':
				var actions = window[actions];
				
				for (var i = 0; i < actions.length; i++)
					safari.extension.settings['action' + i] = actions[i];

				break;
		
			case 'actionImages':
				break;
				
			default:
				safari.extension.settings[key] = window[key];
				break;
		}
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
	
	var action = message.name;
	
	if (action.substr(0, 9) == 'response:') {
		action = substr(9);
		
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
