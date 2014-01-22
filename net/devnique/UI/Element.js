jPackage({

	name: "net.devnique.UI.Element",
	author: "Georg Hubinger (gh@devnique.net)",
	license: "GPL",
	requires: [
		"net.devnique.UI.CSS",
		"net.devnique.UI.Tools"
	],
	init: function() {


		/* Fetch Main UI Namepsace */
		var UI = jPackage("net.devnique.UI").namespace;

		/* Store different types of Elements */
		var types = {};
		/* Dummy div to be cloned for different types of Elements*/
		var div = document.createElement("div");
		/* store instances of UI.Elements */
		var inst = { __counter: 0};

		/**
		 * Element Ctor and function to retrieve UI.Element from DOMElement 
		 * @param {HTMLElement} el, optional parameter. If provided a lookup in inst will be done and the found UI.Element will be returned
		 */
		var Element = UI.Element = function(el) {

			if(arguments.length) {

				if(!(el instanceof HTMLElement)) return null;

				var id = el.getAttribute("data-ui-element-inst-id");
				if(id) return inst[id];

				return Element.create({
					type: "Element",
					$: el 
				});
				
			} 

		}; this.namespace = Element;


		/**
		 * Creates a 'class member' for given Type
		 * @usage internal
		 * @param {String} name Membername
		 * @param {*] member member itself, can be Object or function or whatever
		 * @param {Object} flags flags for Object.definePorperty
		 */
		var defineMember = function(name, member, flags) {

			flags = flags || {};
			if(member) flags.value = member;

			Object.defineProperty(this.prototype, name, flags);
		}

		/**
		 * Shortcut for defineMember(name, undefined, flags{ get: ..., set: ..., enumerable: true })
		 * @param {String} name accessor name
		 * @param {Function} getter accessor's getter
		 * @param {Function} setter accessor's setter
		 */
		var defineAccessor = function(name, getter, setter) {

			this.defineMember(name, undefined, { get: getter, set: setter, enumerable: true });

		};

		/**
		 * Define Constants in type namespace
		 * @param {String} name constant's name
		 * @params {*} value constant's value
		 */
		var defineConstant = function(name, value) {

			this[name] = value;

		};

		/**
		 * Create the DOM Template Element (div) for the type
		 * This template is cloned on init, so it can be used to preset default values to speed up runtime
		 * 'this' points to type's prototype
		 * @usage internal
		 */
		var domCreate = function(uiEl) {
			
			var className = null, p = uiEl;
			
			// Generate div's classname (consist of the type's name and all it's ancestors' names) 
			while(p.constructor && p.constructor.type) {

				className = p.constructor.type.replace(/\./g, "-") + (className?" " + className:"");
				p = Object.getPrototypeOf(p);

			}

			
			p = Object.getPrototypeOf(uiEl);
			if(p && p.__$) {
				// If parent has a template div already, use it to inherit parents defaults
				Object.defineProperty(uiEl, "__$", { value: p.__$.cloneNode(false) });
			} else {
				// Else create a template div for the type
				Object.defineProperty(uiEl, "__$", { value: div.cloneNode(false) });
			}

			uiEl.__$.className = className;

		};

		/**
		 * UI.Element style of retrieving attributes (f. e. via Element.get()) (See below)
		 * @param {HTMLElement} el DOM Element to perform action on (if applicable)
		 * @param {String} member MemberName, can be camelcased or dashed
		 */
		var domGetMember = function(el, member) {

			// First we'll see if member is a valid css property
			var css = UI.CSS.toCamelCase(member);
			if(css in el.style) {

				 return el.style[css];

			// Then, if it's a valid DOM attribuet
			} else if(css in el) {
			
				return el[css];			

			// Then a custom DOM attribute or undefined
			} else {
	
				var custom = UI.CSS.toCamelCase("ui-" + member);
				return el.dataset[custom];

			}
		};

		/**
		 * UI.Element style of storing attributes (f. e. via Element.set())
		 * If the camelcased member is a valid css property, it will be created with value
		 * If it's a valid DOM Attribute, it will be created with value
		 * Otherwise a dataset attribute prefixed with 'ui' will be created (data-ui-member);
		 * if value is null or undefined, style or attribute will be removed (f. e. via Element.unset())
		 * @param {HTMLElement} el DOM Element to perform action on (if applicable)
		 * @param {String} member MemberName, can be camelcased or dashed
		 * @param {*} value value for member
		 */
		var domSetMember = function(el, member, value) {

			// Only String | Number | Boolean | undefined | null
			if(value && typeof value == 'object') return;
			
			var css = UI.CSS.toCamelCase(member);

			// is member a valid css property?
			if(css in el.style) {

				// Set or unset
				if(value != null) return el.style[css] = value;
				return el.style.removeProperty(css);

			// a valid DOM Attribute
			} else if(css in el) {

				// Set or unset
				if(value != null) return el[css] = value;
				return el.removeAttribute(css);

			// a custom DOM Attriubte
			} else {
				
				// Create a custom attribute Name
				var custom = UI.CSS.toCamelCase("ui-" + member);
				// Set or unset
				if(value != null) return el.dataset[custom] = value;
				return delete(el.dataset[custom]);

			}

		};

		/**
		 * Sets default values to type's Dom Template Element
		 * @usage internal
		 * @param {Object<key, value>} defaults
		 * 'this' points to type
		 */
		var defaults = function(defaults) {

			for(var p in defaults) {
				domSetMember(this.prototype.__$, p, defaults[p]);
			}
	
		};

		/**
		 * Register a new Element type
		 * @usage internal
		 * @param {String} type name of the type
		 * @param {Function} ctor the type itself
		 * @param {String||Function} inherits inhertited type
		 */
		Element.register = function(type, ctor, inherits) {

			if(type in types) throw new Error("Can't re-register '" + type + "'");
			if(typeof inherits == 'string') {

				if(!(inherits in types)) throw new Error("Can't inherit unkown type '" + inherits + "'");
				inherits = types[inherits];

			} else if(typeof inherits == 'undefined' && ctor !== Element) {

				inherits = Element;

			} else if(inherits && typeof inherits == 'object') {
				var found = false;
				for(var t in types) {
					if(types[t] === inherits) found = true;
				}
				if(!found) throw new Error(type + ": Only registered Elements can be inherited");
			}


			if(inherits) {
				ctor.prototype = new inherits();
				ctor.prototype.constructor = ctor;
				
			}

			Object.defineProperty(ctor, "type", { value:  type });
			Object.defineProperty(ctor, "defineMember", { value: defineMember });
			Object.defineProperty(ctor, "defineAccessor", { value: defineAccessor });
			Object.defineProperty(ctor, "defineConstant", { value: defineConstant });
			Object.defineProperty(ctor, "defaults", { value: defaults });
			Object.defineProperty(ctor, "superClass", { value: Object.getPrototypeOf(ctor.prototype) });
			
			domCreate(ctor.prototype);
		
			types[type] = ctor;
			
		};

		/**
		 * Create new Element Object
		 * @usage public 
		 * @param {Object<key, value>} params init params
		 */
		Element.create = function(params) {

			if(!('type' in params)) throw "Cant create Element without type";
			var type = params.type;
			if(!(type in types)) throw "Cant't create Element of unknown type '" + type + "'";
			
			var id = params["ElementInstId"] = "##" + (++inst.__counter);
			var el = inst[id] = new (types[type])();
			if(el.init && typeof el.init == 'function') el.init(params);
			
			return el;	
			
		};

		// Here we register Element type, all other Elements, that are registered with undefined inherits param will inherit Element
		Element.register("Element", Element, null);

		/**
		 * Disable ability to take focus 
		 * @const
		 */
		Element.defineConstant("FOCUS_NONE", 0);
		/**
		 * Take focus on click
		 * @const
		 */
		Element.defineConstant("FOCUS_CLICK", 1);
		/**
		 * Take focus on tab and click
		 * @const
		 */
		Element.defineConstant("FOCUS_TAB", 2);
		

		// Defaults for all inheriting Elements
		Element.defaults({
			tabIndex: 0,
			focusAble: Element.FOCUS_TAB
		});
		
		/**
		 * This is the main method. It's invoked via UI.Element.create
		 * @usage internal | public
		 * @param {Object<k, v>} params initial parameters  
		 */
		Element.defineMember("init", function(params) {

			// Prevent double init
			if(this.$) return this;
			// prepare params
			params = (typeof params == 'object'?params:{});

			// if a DOM Element is provided, use it (can be useful for cloning Elements)
			if("$" in params) {

				this.$ = params.$;
				delete params.$;
	
			// otherwise clone our DOM Element Template
			} else {

				this.$ = this.__$.cloneNode(false);

			}

			// Set params
			for(var p in params) {
				this.set(p, params[p]);
			}

			return this;
		});

		/**
		 * Get DOM Element's property
		 * @usage public 
		 * @param {String} member DOM Element's property
		 */
		Element.defineMember("get", function(member) {

			var getter = this.__lookupGetter__(member);
			if(getter)  return getter.call(this);

			return this.__get(member);

		});

		/**
		 * Get DOM Element's property (Element Object's Interface to domGetMember)
		 * @usage internal
		 * @param {String} member DOM Element's property
		 */
		Element.defineMember("__get", function(member) {
		
			return domGetMember(this.$, member);

		});

		/**
		 * Set DOM Element's property
		 * @usage public 
		 * @param {String} member DOM Element's property
		 * @param {String | Number | Boolean} value
		 */
		Element.defineMember("set", function(member, value) {

			var setter = this.__lookupSetter__(member);

			if(setter)  {

				setter.call(this, value);
				return this;
			}

			return this.__set(member, value);

		});

		/**
		 * Set DOM Element's property (Element Object's Interface to domSetMember)
		 * @usage internal
		 * @param {String} member DOM Element's property
		 * @param {String | Number | Boolean} value
		 */
		Element.defineMember("__set", function(member, value) {

			domSetMember(this.$, member, value);
			return this;

		});

		/**
		 * Unset DOM Element's property
		 * @usage public 
		 * @param {String} member DOM Element's property
		 */
		Element.defineMember("unset", function(member) {

			domSetMember(this.$, member);
			return this;

		});

		/**
		 * 'Cross Browser' implimentation for Element.matches 
		 * @param {String} selector a vaild css selector. Be sure to escape special chars if needed
		 */
		Element.defineMember("matches", function(selector) {

			return UI.CSS.matches(this.$, selector);
			
		});

		/**
		 * Check if DOMElement has CSS Class
		 * @param {String} className
		 */ 
		Element.defineMember("hasClass", function(className) {

			var classes = this.$.className.split(/\s+/), i = classes.length;
			while(i) {
				if(classes[--i] == className) return true;
			}
			return false;
			
		});

		/**
		 * Add CSS Class to DOMElement
		 * @param {String} className
		 */ 
		Element.defineMember("addClass", function(className) {

			if(!this.hasClass(className)) this.$.className += " " + className;

		});

		/**
		 * Remove CSS Class from DOMElement
		 * @param {String} className
		 */ 
		Element.defineMember("removeClass", function(className) {
			
			var classes = this.$.className.split(/\s+/), i = classes.length;
			while(i) {
				if(classes[--i] == className) delete classes[i];;
			}
			return this.$.className = classes.join(" ");
		});

		/**
		 */ 
		Element.defineMember("queryChildren", function(selector) {

			var children = []
				, tmp = this.$.querySelectorAll(selector);

			for(var i = 0, len = tmp.length; i !== len; ++i) children.push(UI.Element(tmp.item(i)));
			return children;

		});

		/**
		 */
		Element.defineMember("append", function(el, before) {

			if(before) {
				this.$.insertBefore(el.$, before.$);
			} else {
				this.$.appendChild(el.$);
			}
			return this;

		});
			

		/**
		 * Get / Set parent UI.Element (if exists),
		 */
		Element.defineAccessor("parentElement", function() {

			return UI.Element(this.$.parentElement);

		}, function(p) {

			p.append(this);
			return this;		

		});

		/**
		 * Get / Set next UI.Element (if exists),
		 */
		Element.defineAccessor("nextElement", function() {

			return UI.Element(this.$.nextElementSibling);

		}, function(p) {

			if(p.parentElement) p.parentElement.append(this, p);
			return this;		

		});
		
		/**
		 * Get / Set previous UI.Element (if exists),
		 */
		Element.defineAccessor("prevElement", function() {

			return UI.Element(this.$.previousElementSibling);

		}, function(p) {

			if(p.parentElement) p.parentElement.append(this, p.nextElement);
			return this;		

		});

		/**
		 * Defines wheither and how an element is focusable (see FOCUS_ constants)
		 */
		Element.defineAccessor("focusable", function() {

				return parseInt(this.get("focusAble"));

			}, function(value) {

				return this.set("focusAble", value).set("tabIndex", (value == 0?undefined:(value == 1?-1:0)));

			}
		);

		


	}
});
