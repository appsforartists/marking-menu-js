/*	Marking Menu JS
 *  by Brenton Simpson
 *  bsimpson@appsforartists.com
 *	7/24/2011
 */

function handleMessageWithTabManager(message) {
	switch (message.action) {
		case 'com.appsforartists.newTab':
			safari.application.activeBrowserWindow.openTab('foreground', getCurrentTabIndex() + 1);
			break;
			
		case 'com.appsforartists.closeTab':
			safari.application.activeBrowserWindow.activeTab.close();
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

function getCurrentTabIndex() {
	with (safari.application.activeBrowserWindow)
		return tabs.indexOf(activeTab);
}

function goToTab(offset) {
	var tabs = safari.application.activeBrowserWindow.tabs;
	
	tabs[(offset + getCurrentTabIndex() + tabs.length) % tabs.length].activate();
}