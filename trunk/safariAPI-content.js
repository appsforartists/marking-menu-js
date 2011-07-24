var _pendingResponses = [];

var hostAPI = {
    'getURL':           function(path) {
        return safari.extension.baseURI + path;
    },
    
    
    /* These aren't a regular getter/setter pair because we have to implement the
     * same API in Chrome asynchronously.
     */
     
    'loadVariable':     function(key) {
        window[key] = safari.extension.settings[key];
    },
    
    'storeVariable':    function(key) {
        safari.extension.settings[key] = window[key];
    },
    
    
    'sendRequest':      function(message, callback) {
        var action = message.action;
        
        _pendingResponses.push({
            'action':   action,
            'callback': callback
        });
        
        safari.self.tab.dispatchMessage(action, message);
    }
}

function onMessage(event) {
    /*  If this message is a response to an earlier request, call the appropriate
     *  callback with the arguments sent back from the background page.
     */
    
    var action = message.name;
    
    if (action.substr(0, 9) == 'response:') {
        action = substr(9);
        
        for (var i = 0; i < _pendingResponses.length; i++) {
            if (_pendingResponses[i].action == action) {
                _pendingResponses[i].callback.apply(this, event.message);
                _pendingResponses = _pendingResponses.splice(i, 1);
                
                return;
            }
        }
    }
}

safari.self.addEventListener('message', onMessage);
