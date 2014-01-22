jPackage({

	name: "net.devnique.UI.Events.beforeBlur",
	author: "Georg Hubinger (gh@devnique.net)",
	license: "GPL",
	requires: [
		"net.devnique.UI.Event",
		"net.devnique.UI.Control"
	],

	init: function() {

		var UI = jPackage("net.devnique.UI").namespace, currentElement = null;

		UI.Event.register("beforeblur", function(name, params) {

			var ev = new UI.Event(name, params);
			ev.UIData.currentElement = currentElement;
			return ev;
				
		});


		UI.Event.registerHandler("mousedown", ":root", function(e) {

			if(!UI.Element(e.UIData.target)) return e.cancel();

			if(currentElement && e.UIData.target !== currentElement) {
		
	
				var ev = UI.Event.create("beforeblur", { toTarget: e.UIData.target} );
				ev.UIData.currentElement.dispatchEvent(ev);

				if(!ev.returnValue) return e.cancel(); 

			}

			currentElement = e.UIData.target;
		});

	}

});
