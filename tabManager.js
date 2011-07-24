/*		Chrome Marking Menu
 *  	by Brenton Simpson
 *  	bsimpson@appsforartists.com
 *		7/23/2011
 */

chrome.extension.onRequest.addListener(
	function(message, sender, sendResponse) {
		switch (message.action) {
			case 'newTab':
				chrome.tabs.getSelected(null, function(tab) {
					chrome.tabs.create({
						'url':		'chrome://newtab/',
						'index':	tab.index + 1
					});
				});
				break;
				
			case 'closeTab':
				chrome.tabs.getSelected(null, function(tab) {
					chrome.tabs.remove(tab.id);
				});
				break;
				
			case 'nextTab':
				goToTab(1)
				break;
				
			case 'previousTab':
				goToTab(-1)
				break;
				
			default:
				//prevent sending response to messages that aren't handled here.
				return;
		}
		
		sendResponse();
	}
)

function goToTab(offset){
	chrome.tabs.getAllInWindow(null, function(tabs) {
		chrome.tabs.getSelected(null, function(tab) {
			chrome.tabs.update(tabs[(tab.index + offset + tabs.length) % tabs.length].id, {'selected': true});
		});
	});
}