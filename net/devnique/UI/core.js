
jPackage ( {

	name: "net.devnique.UI.core",
	author: "Georg Hubinger (gh@devnique.net)",
	license: "GPL",
	requires: [
		"net.devnique.UI",
		"net.devnique.UI.CSS",
		"net.devnique.UI.Element",
		"net.devnique.UI.Event",
		/*"net.devnique.UI.focusOrder",*/
		"net.devnique.UI.Controls.core"
	],

	init: function() {
		this.namespace = jPackage("net.devnique.UI").namespace;
	}
});


		
