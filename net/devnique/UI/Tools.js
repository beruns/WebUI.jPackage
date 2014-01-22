jPackage({

	name: "net.devnique.UI.Tools",
	author: "Georg Hubinger (gh@devnique.net)",
	license: "GPL",
	requires: [
		"net.devnique.UI"
	],
	init: function() {

		var UI = jPackage("net.devnique.UI").namespace;

		this.namespace = UI.Tools = {

			/**     
			 * Quick implimentation of Array.indexOf
			 * @param arr {Array} array to search 
			 * @param {*} needle value to search for
			 */
			indexOf: function(arr, needle) {
				var i = arr.length;
				while(i) {
					if(arr[--i] === needle) return i;
				}
				return -1;
			},

			/**     
			 * Some sort of Array.contains implimentation 
			 * @param arr {Array} array to search 
			 * @param {*} needle value to search for
			 */
			inArray: function(arr, needle) {

				return (this.indexOf(arr, needle) >= 0);

			}
	
		};
	}

});
