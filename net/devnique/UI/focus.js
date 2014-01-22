jPackage({

	name: "net.devnique.UI.focus",
	author: "Georg Hubinger (gh@devnique.net)",
	license: "GPL",
	requires: [
		"net.devnique.UI.Element"
	],
	init: function() {

		
		var UI = jPackage("net.devnique.UI").namespace;
		
		UI.Element.defineConstant("FOCUS_ORDER_DEFAULT", 1);

		UI.Element.defaults({
			focusOrder: UI.Element.FOCUS_ORDER_DEFAULT
		});

		
		UI.Element.defineAccessor("focusorder", function() {

				return parseInt(this.get("focusOrder"));

		}, function(order) {

			order = order || UI.Element.FOCUS_ORDER_DEFAULT;
			this.set("focusOrder", order);

		});
		
		UI.Element.defineMember("nextInFocus", function() {

			var order = this.focusorder;
			var focusable = UI.Element(document.body).queryChildren(".Element[data-ui-focus-able = '2']", true);
			var nextByOrder = null, nextByPosition = null;
			
			for(var i = 0, len = focusable.length; i !== len; ++i) {
				
			}
				
	
		});

		UI.focusOrder = {

			current: function() {
				return UI.Element(document.activeElement);
			},

			next: function() {
				this.current().nextInFocus();
			},
	
			prev: function() {
				
			}

		};
		

	}

});
