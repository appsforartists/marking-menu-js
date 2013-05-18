/*	Marking Menu JS
 *  by Brenton Simpson
 *  bsimpson@appsforartists.com
 *	7/24/2011
 */

/* Intra-page actions are handled by domActions.js in chrome.tabs, so we send 
 * action messages back to the tab they came from to be handled.
 */
chrome.extension.onMessage.addListener(
	function(message, sender, sendResponse) {
		if (message.action && sender.tab) {
			switch (message.action) {
				case 'settings.get':
					var value;

					if (localStorage.hasOwnProperty(message.key))
						value = JSON.parse(localStorage[message.key]);
					
					sendResponse({
						'key':		message.key,
						'value':	value
					});
					break;

				case 'settings.set':
					localStorage[message.key] = JSON.stringify(message.value);
					sendResponse();
					break;
					
				default:
					//send back a boolean if we've handled the event
					sendResponse(handleMessageWithTabManager(message));
					break;
			}
		}
	}
);