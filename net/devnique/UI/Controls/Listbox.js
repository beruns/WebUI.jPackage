jPackage({

	name: "net.devnique.UI.Controls.Listbox",
	author: "Georg Hubinger (gh@devnique.net)",
	license: "GPL",
	requires: [
		"net.devnique.UI.Control"
	], 
	init: function() {

		var UI = jPackage("net.devnique.UI").namespace;
		var Listbox = UI.Listbox = function() {};

		UI.Element.register("Listbox", Listbox, UI.Control);

	}

});

jPackage({

	name: "net.devnique.UI.Controls.Listbox.Item",
	author: "Georg Hubinger (gh@devnique.net)",
	license: "GPL",
	requires: [
		"net.devnique.UI.Controls.Listbox"
	],	
	init: function() {

		var UI = jPackage("net.devnique.UI").namespace;
		var Item = UI.Listbox.Item = function() {};

		UI.Element.register("Listbox.Item", Item, UI.Control);

	}

});

jPackage({

	name: "net.devnique.UI.Controls.Listbox.Field",
	author: "Georg Hubinger (gh@devnique.net)",
	license: "GPL",
	requires: [
		"net.devnique.UI.Controls.Listbox",
		"net.devnique.UI.Controls.Textbox",
	],
	init: function() {

		var UI = jPackage("net.devnique.UI").namespace;
		var Field = UI.Listbox.Field = function() {};

		UI.Element.register("Listbox.Field", Field, UI.Textbox);

	}

});
