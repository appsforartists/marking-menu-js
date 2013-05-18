alert("I don't think reset defaults works yet.  Try getting rid of localStorage and using hostAPI.");

var preferences;

function setValueInFormByStorage(inputName) {
	if (localStorage.hasOwnProperty(inputName) && preferences.hasOwnProperty(inputName)) {
		switch (preferences[inputName][0].type) {
			case 'radio':
				for (var i = 0; i < preferences[inputName].length; i++) {
					if (JSON.parse(localStorage[inputName]) == preferences[inputName][i].value) {
						preferences[inputName][i].checked = true;
					}
				}
				break;
		}
	}
}

function setValueInStorageByInput(inputName) {
	if (preferences.hasOwnProperty(inputName)) {
		var value;
		
		switch (preferences[inputName][0].type) {
			case 'radio':
				for (var i = 0; i < preferences[inputName].length; i++) {
					if (preferences[inputName][i].checked) {
						 localStorage[inputName] = JSON.stringify(preferences[inputName][i].value);
					}
				}
				break;
		}
		
		if (value != null)
			localStorage[inputName] = value;
	}
}

function createMenuItemInputs(event) {
	var menuItemsSection = document.getElementById('menu_item_inputs');
	var actionCount = actions.length;
	
	for (var i = 0; i < actionCount; i++) {
		var itemDiv = document.createElement('div');
		itemDiv.className = 'item_input';
		
		var actionInput = document.createElement('input');
		actionInput.className = 'action_input';
		actionInput.type = 'text';
		
		var imageInput = document.createElement('input');
		imageInput.className = 'image_input';
		imageInput.type = 'text';
		
		itemDiv.appendChild(actionInput);
		itemDiv.appendChild(imageInput);
		menuItemsSection.appendChild(itemDiv);
		
		itemDivX = Math.round(189 * Math.cos((i * 360 / actionCount - 90) * DEG_TO_RAD));
		itemDivY = Math.round(189 * Math.sin((i * 360 / actionCount - 90) * DEG_TO_RAD));
		
		var itemDivHeight = parseInt(getComputedStyle(itemDiv).height.split('px').shift());

		if (itemDivY == 0)
			itemDivY -= itemDivHeight / 2;
		else if (itemDivY > 0)
			itemDivY -= itemDivHeight;
		
		
		itemDiv.style.left	= itemDivX + 'px';
		itemDiv.style.top	= itemDivY + 'px';
	}
}

function updateStorageByMenuItemInputs(event) {
	var actionInputs = document.getElementsByClassName('action_input');
	var imageInputs = document.getElementsByClassName('image_input');
	
	for (var i = 0; i < actions.length; i++) {
		actions[i] = actionInputs[i].value;
		actionImages[i] = imageInputs[i].value;
	}

	storeInLocalStorage('actions', actions);
	storeInLocalStorage('actionImages', actionImages);
}

function updateMenuItemInputsByStorage(event) {
	var actionInputs = document.getElementsByClassName('action_input');
	var imageInputs = document.getElementsByClassName('image_input');
	
	for (var i = 0; i < actions.length; i++) {
		actionInputs[i].value = actions[i];
		imageInputs[i].value = actionImages[i];
	}
}

function addListenersToForm(event) {
	preferences = preferences || document.getElementById('preferences');
	for (var i = 0; i < preferences.length; i++) {
		preferences[i].addEventListener('click', onInputClick);
	}
}

function initializeForm(event) {
	if (!document.getElementsByClassName('action_input').length)
		createMenuItemInputs();
	
	updateMenuItemInputsByStorage();
	
	for (var inputName in localStorage) {
		setValueInFormByStorage(inputName);
	}
}
window.addEventListener(MarkingMenuEvent.VARIABLES_INITIALIZED, addListenersToForm);
window.addEventListener(MarkingMenuEvent.VARIABLES_INITIALIZED, initializeForm);
addEventListener('DOMContentLoaded', initializeVariables);

function onInputClick(event) {
	setValueInStorageByInput(event.target.name);
}