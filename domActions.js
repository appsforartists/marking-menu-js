/*		Chrome Marking Menu
 *  	by Brenton Simpson
 *  	bsimpson@appsforartists.com
 *		12/5/2009
 */

chrome.extension.onRequest.addListener(
	function(message, sender, sendResponse) {
		switch (message.action) {
			case 'pageUp':
				scrollPage(-1);
				break;
				
			case 'pageDown':
				scrollPage(1);
				break;
				
			case 'nextPage':
				history.forward();
				break;
				
			case 'previousPage':
				history.back();
				break;
			
			default:
				console.log(message.action + ' caught in contentActions');
		}
		
		sendResponse();
	}
)

function scrollPage(direction) {
	scrollBy(0, (direction % 2) * window.innerHeight);
}