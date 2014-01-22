jPackage({

	name: "net.devnique.UI.Controls.Button",
	author: "Georg Hubinger (gh@devnique.net)",
	license: "GPL",
	requires: [
		"net.devnique.UI.Control"
	],
	init: function() {

		/* Fetch Main UI Namepsace */
		var UI = jPackage("net.devnique.UI").namespace;

		/* {{{ Button type's CSS rules */
		UI.CSS.addRule(".Button", {

			"text-align": "center",
			"vertical-align": "middle",
			"background": [
					"-moz-linear-gradient(top, #f3f3f3, buttonface)",
					"-webkit-linear-gradient(top, #f3f3f3, buttonface)",
					"-o-linear-gradient(top, #f3f3f3, buttonface)",
					"-ms-linear-gradient(top, #f3f3f3, buttonface)",
					"linear-gradient(top, #f3f3f3, buttonface)",
					
				],
			"border": "1px solid #aaa",
			"border-radius": "1px",
			// important for vertical align to work
			"display": "table",
			// Mobile Safari 
			"cursor": "pointer"

		});

		UI.CSS.addRule(".Button:after", {

			"content": "attr(data-ui-caption)",
			"display": "table-cell",
			"vertical-align": "inherit",
			"font-size": "75%"

		});

		UI.CSS.addRule(".Button:hover", {

			"border-color": "#888",

		});


		UI.CSS.addRule(".Button:active, .Button.active", {

			"background": [
					"-moz-linear-gradient(top, buttonface, #f3f3f3)",
					"-webkit-linear-gradient(top, buttonface, #f3f3f3)",
					"-o-linear-gradient(top, buttonface, #f3f3f3)",
					"-ms-linear-gradient(top, buttonface, #f3f3f3)",
					"linear-gradient(top, buttonface, #f3f3f3)",
				],
			"border-color": "#aaa"

		});

		/* Button type's CSS rules }}} */

		/* Button ctor */
		var Button = UI.Button = function() {};

		/* Register Button type Control */
		UI.Element.register("Button", Button, UI.Control);

		// Overload Element.init to prevent mousedown event
		Button.defineMember("init", function(params) {

			Button.superClass.init.call(this, params);
	
		});

		// We need to cancel the mousedown event on buttons, to preserve focus on other elements
		var preventFocus = function(e) {
			e.cancel();
		};

		UI.Event.registerHandler("mousedown", ".Button", preventFocus);

		var simulateClick = function(e) {

			if(e.which == 13 || e.which == 32) {

				if(e.type == "keydown") {
					this.addClass("active");
				} else {
					this.removeClass("active");
					this.$.click();
				}
			
			}

		};
	
		UI.Event.registerHandler("keydown keyup", ".Button", simulateClick);

	}

});
