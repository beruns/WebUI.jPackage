jPackage({

	name: "net.devnique.UI",
	author: "Georg Hubinger (gh@devnique.net)",
	license: "GPL",
	init: function() {
	
		var UI = this.namespace = {};
	
		var callbacks = [];
	
		UI.onReady = function(callback) {
			callbacks.push(callback);
		};

		document.addEventListener("DOMContentLoaded", function() {

			for(var i = 0, len = callbacks.length; i !== len; ++i) {
				
				callbacks[i]();	

			}

		});
		
	}

});
