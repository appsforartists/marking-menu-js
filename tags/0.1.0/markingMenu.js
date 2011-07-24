/*		Chrome Marking Menu
 *  	by Brenton Simpson
 *  	bsimpson@appsforartists.com
 *		12/5/2009
 */

actions = ['pageDown', 'newTab', 'nextPage', 'nextTab', 'pageUp', 'previousTab', 'previousPage', 'closeTab'];

const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

var distanceToItems = 55;
var itemSize = 42;
var rimSize = 13;
var menuDiameter = 2 * rimSize + itemSize + 2 * distanceToItems;

var markingMenu, markingMenuBackground, markingMenuLabel, markingMenuItems, highlightImage;
function drawMenu() {
	if (markingMenu && markingMenu.parentNode)
		markingMenu.parentNode.removeChild(markingMenu);
	
	markingMenu = document.createElement('div');
	markingMenu.id = 'markingMenu';
	markingMenu.style.zIndex = '99999';
	markingMenu.style.position = 'absolute';
	markingMenu.style.width = markingMenu.style.height = menuDiameter;
	markingMenuItems = [];
	
	markingMenuBackground = document.createElement('img');
	markingMenuBackground.src = chrome.extension.getURL('background.png');
	markingMenuBackground.style.position = 'absolute';
	markingMenuBackground.style.left = markingMenuBackground.style.top = -menuDiameter / 2 + 'px';
	markingMenu.appendChild(markingMenuBackground);

	markingMenuLabel = document.createElement('div');
	markingMenuLabel.id = 'markingMenuLabel';
	markingMenuLabel.style.position = 'absolute';
	markingMenuLabel.style.width = String(2 * distanceToItems - itemSize) +  'px';
	markingMenuLabel.style.height = '3em';
	markingMenuLabel.style.lineHeight = '1.5em';
	markingMenuLabel.style.left = - parseInt(markingMenuLabel.style.width) / 2 + 'px';
	markingMenuLabel.style.top = '-1.5em';
	markingMenu.appendChild(markingMenuLabel);
	
	highlightImage = document.createElement('img');
	highlightImage.id = 'markingMenuHighlight';
	highlightImage.src = chrome.extension.getURL('highlight.png');
	highlightImage.style.position = 'absolute';
	highlightImage.style.left = highlightImage.style.top = '0px';
	
	var action, markingMenuItem, image;
	for (var i = 0; i < actions.length; i++){
		markingMenuItem = markingMenuItems[i] = document.createElement('div');
		action = actions[i];
		
		image  = document.createElement('img');
		image.class = 'markingMenuImage';
		image.title = image.alt = action;
		image.src = chrome.extension.getURL(action + '.png');
		
		markingMenuItem.id = 'markingMenuItem' + String(i);
		markingMenuItem.class = 'markingMenuItem';
		markingMenuItem.style.position = 'absolute';
		markingMenuItem.style.marginTop = markingMenuItem.style.marginLeft = String(-itemSize / 2) + 'px';
		
		markingMenuItem.style.left	= String(distanceToItems * Math.cos((i * 360 / actions.length - 90) * DEG_TO_RAD)) + 'px';
		markingMenuItem.style.top	= String(distanceToItems * Math.sin((i * 360 / actions.length - 90) * DEG_TO_RAD)) + 'px';
		
		image.style.width = image.style.height = markingMenuItem.style.width = markingMenuItem.style.height = itemSize + 'px';

		markingMenuItem.appendChild(image);
		markingMenu.appendChild(markingMenuItem);
	}
}

drawMenu();
addEventListener('mousedown', onMouseDown);

var clickLocation;

function onMouseDown(event){
	//onMiddleMouseDown
	if (event.button == '1') {
		
		clickLocation = [event.pageX, event.pageY];
		
		markingMenu.style.left = clickLocation[0] + 'px';
		markingMenu.style.top = clickLocation[1] + 'px';
		
		addEventListener('mousemove', showMenu);
		addEventListener('mousemove', onMouseMove);
		addEventListener('mouseup', onMouseUp);
	}
}

function showMenu(){
	document.body.appendChild(markingMenu);
	removeEventListener('mousemove', showMenu);
}

function onMouseMove(event){
	var index = getIndexByMouseEvent(event)
	
	if (index == null) {
		if (highlightImage && highlightImage.parentNode)
			highlightImage.parentNode.removeChild(highlightImage);
			markingMenuLabel.innerHTML = ''; 
	} else {
		if (highlightImage && markingMenuItems[index]) {
			markingMenuItems[index].appendChild(highlightImage);

			//convert camelCase to multiline string and display label
			var label = actions[index].replace( /(.)([A-Z])/g, function(match, first, last) { 
				return first + '<br />' + last.toLowerCase(); 
			}); 
			label = label[0].toUpperCase() + label.substr(1);
			markingMenuLabel.innerHTML = label; 
		}
	}
}

function onMouseUp(event){
	if (event.button == '1'){
		var index = getIndexByMouseEvent(event);
		
		if (index != null)
			chrome.extension.sendRequest({'action': actions[index]});
		
		if (markingMenu && markingMenu.parentNode)
			markingMenu.parentNode.removeChild(markingMenu);

		clickLocation = null;
		removeEventListener('mousemove', onMouseMove);
		removeEventListener('mousemove', showMenu);
		removeEventListener('mouseup', onMouseUp);
	}
}

function getIndexByMouseEvent(event){
	if (getDistance(event) >= 1/2 * distanceToItems)
		return getIndexForAngle(getAngle(event))
	else
		return null;
}

function getDistance(event){
	var delta = [(event.pageX - clickLocation[0]), (clickLocation[1] - event.pageY)]
	
	return Math.sqrt(delta[0] * delta[0] + delta[1] * delta[1]);
}

function getAngle(event){
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