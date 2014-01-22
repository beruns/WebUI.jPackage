jPackage({

	name: "net.devnique.UI.CSS",
	author: "Georg Hubinger (gh@devnique.net)",
	license: "GPL",
	requires: ["net.devnique.UI"],
	init: function () {

		/* Fetch Main UI Namepsace */
		var UI = jPackage("net.devnique.UI").namespace;

		// Create a Style node ...
		var css = document.createElement("style");
		css.type = "text/css";
		// ... in head
		document.head.appendChild(css);

		// Store the rules
		var rules = {};

		// Write out rule
		var processRule = function(selector) {
			
			if(!(selector in rules)) return;
			var rule = rules[selector]

			if(Object.keys(rule).length == 1) {
				return rule.__node.nodeValue = "";
			}

			with(rule.__node) {

				// Reset the node's value
				nodeValue = selector + " { ";

				for(var r in rule) {
						
					// keys of the rule object have to be strings, values can be Strings, Number or an array
					if(typeof rule[r] == 'string' || typeof rule[r] == 'number') nodeValue += r + ": " + rule[r] + "; ";

					// If value is an array, the rule is treated as a cross browser stle rule (like -webkit-gradient, -moz-gradient etc.
					if(rule[r] instanceof Array) {

						for(var i = 0, len = rule[r].length; i !== len; ++i) {
							nodeValue += r + ": " + rule[r][i] + "; ";							
						}

					}
				}

				nodeValue += "}\n";
			};
		};

		/**
		 * Custom implimentation for (moz|webkit|o|ms)MatchesSelector
		 * @this {HTMLElement}
		 * @param {String} selector valid css selector. be sure to escape special chars if needed
		 */ 
		var myMatches = function(selector) {

			var elements;

			if(this.parentNode) {

				elements =  this.parentNode.querySelectorAll(selector);

			} else {
		
				var p = document.createDocumentFragment();
				p.appendChild(this);
				elements = p.querySelectorAll(selector);
				p.removeChild(this);

			}

			var i = elements.length;

			while(i) {
				if(elements.item(--i) === this) return true;
			};

			return false;
		};

		/* UI.CSS Object */
		UI.CSS = {

			/**
			 * Add a CSS Rule. The rule will be stored in rules and placed inside our css node
			 * @param {String} selector css selector to match rule
			 * @param {Object} rule in json notation
			 */
			addRule: function(selector, rule) {

				// We don't have the selector yet
				if(!(selector in rules)) {
					// We create a textnode once, and then always update only this one
					rules[selector] = { __node: document.createTextNode() };
					css.appendChild(rules[selector].__node);
				}

				// We store the rule in css style dashed notation
				for(var r in rule) {
					var s = this.toDashed(r);
					rules[selector][s] = rule[r];
					
				}
				
				processRule(selector);

			},

			// convert dash-styled-string to camelCasedString
			toCamelCase: function(s) {
				return s.replace(/(-[a-zA-Z])/g, function(s) { return s.toUpperCase().replace("-", ""); });
			},

			// convert camelCasedString to dash-styled-string
			toDashed: function(s) {
				return s.replace(/([A-Z])/g, function(s) { return "-" + s.toLowerCase(); } );
			},

			matches: function(el, selector) {

				var fn = el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector || el.oMatchesSelector || myMatches
				return fn.call(el, selector);				

			},

		};

		
		var viewport = document.createElement("meta");
		viewport.name = "viewport";
		viewport.content = "width=device-width, user-scalable=no";
		document.head.appendChild(viewport);		
	
		UI.CSS.addRule("@viewport", {
			"width": "device-width",
			"user-zoom": "fixed"
		});
			

	}

});
