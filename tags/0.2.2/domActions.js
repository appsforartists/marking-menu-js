/*		Chrome Marking Menu
 *  	by Brenton Simpson
 *  	bsimpson@appsforartists.com
 *		7/23/2011
 */


/*	The commented out parts used to work, then a Chrome update broke them.  I already
 *	completed work on 0.5.0 by the time it completed them, so I never grabbed the old source
 *	to this to diagnose and patch it.  (0.5.0 hasn't been release because Chrome also broke
 *	that, hardcore, with an update.)
 *
 *	It appears that onRequest stopped receiving messages from sister scripts at some point, so
 *	markingMenu can't send domActions a message (they both load as content scripts).  As a 
 *	quick hack to fix it, we're sending messages through both chrome.extension and the
 *	function executeDOMAction simultaneously.
 */

//chrome.extension.onRequest.addListener(
//	function(message, sender, sendResponse) {

function executeDOMAction(message) {
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
		
//		sendResponse();
	}
//)

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