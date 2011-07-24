/*		Chrome Marking Menu
 *  	by Brenton Simpson
 *  	bsimpson@appsforartists.com
 *		1/30/2010
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
	/*	If the clickTarget is in a scrollable element (i.e. a div with overflowY set to 'scroll'),
	 *	scroll that element by one page in the direction specified.  Otherwise, scroll the window.
	 */
	
	var scrollableContainer = findScrollableContainer();
	
	if (scrollableContainer && ((direction < 0 && scrollableContainer.scrollTop > 0) || (direction > 0 && scrollableContainer.scrollTop < scrollableContainer.scrollHeight - scrollableContainer.clientHeight)))
		scrollableContainer.scrollTop += (direction % 2) * scrollableContainer.clientHeight;
	else
		scrollBy(0, (direction % 2) * window.innerHeight);
}

function findScrollableContainer() {
	var target = clickTarget;
	var validOverflowValues = ['auto', 'scroll'];
	
	do {
		if (target == document.body)
			return null;
			
		if (target.scrollHeight != target.clientHeight && validOverflowValues.indexOf(getComputedStyle(target).overflowY) != -1)
			return target;
	} while (target = target.parentNode);
}