/*		Chrome Marking Menu
 *  	by Brenton Simpson
 *  	bsimpson@appsforartists.com
 *		12/5/2009
 */

chrome.extension.onRequest.addListener(
	function(message, sender, sendResponse) {
		switch (message.action) {
			case 'pageUp':
				if (!message.framePath || message.framePath == document.location.href)
					scrollPage(-1);
				break;
				
			case 'pageDown':
				if (!message.framePath || message.framePath == document.location.href)
					scrollPage(1);
				break;
				
			case 'nextPage':
				history.forward();
				break;
				
			case 'previousPage':
				history.back();
				break;
		}
		
		sendResponse();
	}
)

function scrollPage(direction) {
	scrollBy(0, (direction % 2) * window.innerHeight);
}