/*		Chrome Marking Menu
 *  	by Brenton Simpson
 *  	bsimpson@appsforartists.com
 *		4/2/2010
 */

function handleMessageWithTabManager(message) {
	switch (message.action) {
		case 'com.appsforartists.newTab':
			chrome.tabs.getSelected(null, function(tab) {
				chrome.tabs.create({
					'url':		'chrome://newtab/',
					'index':	tab.index + 1
				});
			});
			break;
			
		case 'com.appsforartists.closeTab':
			chrome.tabs.getSelected(null, function(tab) {
				chrome.tabs.remove(tab.id);
			});
			break;
			
		case 'com.appsforartists.nextTab':
			goToTab(1)
			break;
			
		case 'com.appsforartists.previousTab':
			goToTab(-1)
			break;
			
		default:
			//prevent sending response to messages that aren't handled here.
			return false;
	}
	
	return true;
}

function goToTab(offset){
	chrome.tabs.getAllInWindow(null, function(tabs) {
		chrome.tabs.getSelected(null, function(tab) {
			chrome.tabs.update(tabs[(tab.index + offset + tabs.length) % tabs.length].id, {'selected': true});
		});
	});
}