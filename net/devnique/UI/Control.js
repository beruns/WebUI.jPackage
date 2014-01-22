jPackage({

	name: "net.devnique.UI.Control",
	author: "Georg Hubinger (gh@devnique.net)",
	license: "GPL",
	requires: [
		"net.devnique.UI.Event"
	],
	init: function() {

		/* Fetch Main UI Namepsace */
		var UI = jPackage("net.devnique.UI").namespace;

		/* Control ctor */
		var Control = UI.Control = function() {}; this.namespace = Control

		// Register Control type
		UI.Element.register("Control", Control);

		// Main CSS Rule for all Controls 
		UI.CSS.addRule(".Control", {

			"border": "1px solid #efefef",
			"box-sizing": "border-box",
			"width": "100px",
			"height": "20px",
			"background-color": "white",

		});

	}

});
