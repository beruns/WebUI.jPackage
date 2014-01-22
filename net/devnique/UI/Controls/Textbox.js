jPackage({

	name: "net.devnique.UI.Controls.Textbox",
	author: "Georg Hubinger (gh@devnique.net)",
	license: "GPL",
	requires: [
		"net.devnique.UI.Control"
	],
	init: function() {

		/* Fetch Main UI Namepsace */
		var UI = jPackage("net.devnique.UI").namespace;

		/* Textbox ctor */
		var Textbox = UI.Textbox = function() {}; this.namespace = Textbox;
		
		// Register Textbox Control type
		UI.Element.register("Textbox", Textbox, UI.Control);		

		// Textbox is editable by default
		Textbox.defaults({
			contentEditable: true
		});

		
		// Accessor for readonly, manages the focus of non focusable Elements as well (as editable Textboxes have to be focusable)
		Textbox.defineAccessor("readonly", function() {

				return !(this.get("contentEditable")+"".toLowerCase() == 'true');

			}, function(value) {
	
				if(value == false) {
					if(this.focusable == Textbox.FOCUS_NONE) {
						this.set("tabIndex", -1);
					}
				} else {
					this.focusable = this.focusable;
				}

				return this.set("contentEditable", (value == false));
			}
		);

	}
	
});
