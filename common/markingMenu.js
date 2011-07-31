/*	Marking Menu JS
 *  by Brenton Simpson
 *  bsimpson@appsforartists.com
 *	7/24/2011
 */

// Extensions CSS support is hit-or-miss, so we set the important styles in JavaScript.
function zeroMargins(element) {	
	element.style.left = element.style.right = element.style.top = element.style.left = '0px';
	element.style.marginLeft = element.style.marginRight = element.style.marginTop = element.style.marginBottom = '0px';
}

var hovering = false;
var clickLocation;
var clickTarget;

//load variables from localStorage.  function in defaultSettings.js
initializeVariables();

var markingMenu, markingMenuBackground, markingMenuLabel, markingMenuItems, highlightImage;
function drawMenu() {
	if (markingMenu && markingMenu.parentNode)
		markingMenu.parentNode.removeChild(markingMenu);
	
	markingMenu = document.createElement('div');
	zeroMargins(markingMenu);
	markingMenu.id = 'markingMenu';
	markingMenu.style.zIndex = '99999';
	markingMenu.style.position = 'absolute';
	markingMenu.style.width = markingMenu.style.height = menuDiameter;
	markingMenuItems = [];
	
	markingMenuBackground = document.createElement('img');
	zeroMargins(markingMenuBackground);
	markingMenuBackground.src = hostAPI.getURL('common/images/background.png');
	markingMenuBackground.style.position = 'absolute';
	markingMenuBackground.style.left = markingMenuBackground.style.top = -menuDiameter / 2 + 'px';
	markingMenu.appendChild(markingMenuBackground);

	markingMenuLabel = document.createElement('div');
	zeroMargins(markingMenuLabel);
	markingMenuLabel.id = 'markingMenuLabel';
	markingMenuLabel.style.position = 'absolute';
	markingMenuLabel.style.width = String(2 * distanceToItems - itemSize) +  'px';
	markingMenuLabel.style.height = '3em';
	markingMenuLabel.style.lineHeight = '1.5em';
	markingMenuLabel.style.left = - parseInt(markingMenuLabel.style.width) / 2 + 'px';
	markingMenuLabel.style.top = '-1.5em';
	markingMenuLabel.style.fontFamily = "'Myriad Pro', 'Lucida Grande', 'Trebuchet MS', sans-serif";
	markingMenuLabel.style.fontSize = '12px';
	markingMenuLabel.style.fontWeight = '100';
	markingMenuLabel.style.textAlign = 'center';
	markingMenuLabel.style.color = '#5188BC';
	markingMenu.appendChild(markingMenuLabel);
	
	highlightImage = document.createElement('img');
	zeroMargins(highlightImage);
	highlightImage.id = 'markingMenuHighlight';
	highlightImage.src = hostAPI.getURL('common/images/highlight.png');
	highlightImage.style.position = 'absolute';
	highlightImage.style.left = highlightImage.style.top = '0px';
	
	var action, markingMenuItem, image;
	for (var i = 0; i < actions.length; i++) {
		markingMenuItem = markingMenuItems[i] = document.createElement('div');
		action = actions[i];
		actionImage = actionImages[i];
		
		zeroMargins(markingMenuItem)
		
		image  = document.createElement('img');
		zeroMargins(image);
		image.className = 'markingMenuImage';
		image.title = image.alt = action;
		
		if (actionImage.indexOf('//' == -1))
		 	actionImage = hostAPI.getURL(actionImage);
		image.src = actionImage;
		
		markingMenuItem.id = 'markingMenuItem' + String(i);
		markingMenuItem.className = 'markingMenuItem';
		markingMenuItem.style.position = 'absolute';
		markingMenuItem.style.marginTop = markingMenuItem.style.marginLeft = String(-itemSize / 2) + 'px';
		
		markingMenuItem.style.left	= String(distanceToItems * Math.cos((i * 360 / actions.length - 90) * DEG_TO_RAD)) + 'px';
		markingMenuItem.style.top	= String(distanceToItems * Math.sin((i * 360 / actions.length - 90) * DEG_TO_RAD)) + 'px';
		
		image.style.width = image.style.height = markingMenuItem.style.width = markingMenuItem.style.height = itemSize + 'px';

		markingMenuItem.appendChild(image);
		markingMenu.appendChild(markingMenuItem);
	}
}

window.addEventListener(MarkingMenuEvent.VARIABLES_INITIALIZED, drawMenu);
window.addEventListener(MarkingMenuEvent.VARIABLES_INITIALIZED, blockDefaultMouseEvents);
addEventListener('mousedown', onMouseDown);

function blockDefaultMouseEvents() {	
	if (triggerButton == RIGHT_MOUSE)
		addEventListener('contextmenu', blockContextMenu);
}

//Detects all <a> links in initial page load and AJAX insertions
//and locks out the menu when you hover over one.
addEventListener('DOMContentLoaded', detectHoverInTarget);
addEventListener('DOMNodeInserted', detectHoverInTarget);

function detectHoverInTarget(event) {
	detectHoverInElement(event.target);
}

function detectHoverInElement(element) {
	if (element.getElementsByTagName) {		
		var a = element.getElementsByTagName('a');
	
		for (var i = 0; i < a.length; i++) {
			a[i].addEventListener('mouseover', setHovering);
			a[i].addEventListener('mouseout', releaseHovering);
		}
	}
}

function setHovering(event) {
	hovering = true;
}

function releaseHovering(event) {
	hovering = false;
}

function blockContextMenu(event) {
	if (!hovering)
		event.preventDefault();
}
	
function showMenu() {	
	document.body.appendChild(markingMenu);

	addEventListener('mousemove', onMouseMove);
	addEventListener('mouseup', onMouseUp);
}

function onMouseDown(event) {
	if (event.button == triggerButton) {
		clickTarget = event.target;
		clickLocation = [event.pageX, event.pageY];
		markingMenu.style.left = clickLocation[0] + 'px';
		markingMenu.style.top = clickLocation[1] + 'px';

		if (hovering) {
			if (triggerButton == MIDDLE_MOUSE)
				addEventListener('mousemove', onHoverClickMouseMove);
		} else {
			event.preventDefault();
			event.stopPropagation();
			showMenu();
		}
	}
}

function onHoverClickMouseMove(event) {
	if (getDistance(event) >= 1/2 * distanceToItems) {
		if (event.button == triggerButton)
			showMenu();
		
		removeEventListener('mousemove', onHoverClickMouseMove);
	}
}

function onMouseMove(event) {
	var index = getIndexByMouseEvent(event)
	
	if (index == null) {
		markingMenuLabel.innerHTML = ''; 
		
		if (highlightImage && highlightImage.parentNode)
			highlightImage.parentNode.removeChild(highlightImage);
	} else {
		if (highlightImage && markingMenuItems[index]) {
			markingMenuItems[index].appendChild(highlightImage);

			//convert camelCase to multiline string and display label
			var label = actions[index].split('.').pop().replace( /(.)([A-Z])/g, function(match, first, last) { 
				return first + '<br />' + last.toLowerCase(); 
			}); 
			label = label[0].toUpperCase() + label.substr(1);
			markingMenuLabel.innerHTML = label; 
		}
	}
}

function onMouseUp(event) {
	if (event.button == triggerButton) {
		var index = getIndexByMouseEvent(event);
		
		if (index != null) {
			var action = actions[index];
			
			var onMessageResponse = function(handledByBackgroundPage) {
				if (!handledByBackgroundPage) {
					// send the event to window, so other content scripts (like domActions) can react
					var customEvent = document.createEvent('Event');
					customEvent.initEvent(action, true);
					window.dispatchEvent(customEvent);
				}
			}
			hostAPI.sendRequest({'action': action}, onMessageResponse);
		}
		
		if (markingMenu && markingMenu.parentNode)
			markingMenu.parentNode.removeChild(markingMenu);

		markingMenuLabel.innerHTML = ''; 
		
		if (highlightImage && highlightImage.parentNode)
			highlightImage.parentNode.removeChild(highlightImage);

		//clickTarget and clickLocation are left in memory in case a domAction needs them

		removeEventListener('mousemove', onMouseMove);
		removeEventListener('mousemove', onHoverClickMouseMove);
		removeEventListener('mouseup', onMouseUp);
	}
}

function getIndexByMouseEvent(event) {
	if (getDistance(event) >= 1/2 * distanceToItems)
		return getIndexForAngle(getAngle(event))
	else
		return null;
}

function getDistance(event) {
	var delta = [(event.pageX - clickLocation[0]), (clickLocation[1] - event.pageY)]
	
	return Math.sqrt(delta[0] * delta[0] + delta[1] * delta[1]);
}

function getAngle(event) {
	//HTML's Y axis is inverted, so X' - X, but Y - Y'
	var delta = [(event.pageX - clickLocation[0]), (clickLocation[1] - event.pageY)]
	var angle = Math.atan(delta[0] / delta[1]) * RAD_TO_DEG;
	
	if (delta[1] < 0) 
		angle += 180;
		
	return (360 + angle) % 360;
}

function getIndexForAngle(angle) {
	var increment = 360 / actions.length;
	return Math.round(angle / increment) % actions.length;
}