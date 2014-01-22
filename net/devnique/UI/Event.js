jPackage({

	name: "net.devnique.UI.Event",
	author: "Georg Hubinger (gh@devnique.net)",
	license: "GPL",
	requires: [
		"net.devnique.UI.Element"
	],
	init: function() {

		/* Fetch Main UI Namepsace */	
		var UI = jPackage("net.devnique.UI").namespace;
		var events = {}, body = null, handler = {};

		/* 'Cross browser' cancel Event */	
		var cancelEvent = function() {

			if(this.preventDefault) this.preventDefault();
			this.returnValue = false;

		};

		/**
		 * Universal capture method for DOM Events
		 * This captures all events, that occur on body (in capture mode if available) and handles them.
		 */
		var captureDOMEvent = function(e) {

			// Unregistered Events aren't handled
			if(!(e.type in events)) return;

			e.UIData = e.UIData || {};
			// Starting Element
			var DOMNode = e.target || e.srcElement;
			e.UIData.target = DOMNode;

			// 'Cross browser' cancel
			e.cancel = cancelEvent;

			// We iterate upwards the DOM Tree from target on ...
			while(DOMNode) {

				// (shortcut handlers lookup table)
				var handlers = events[e.type].__handlers, doubleCallProtection = [];
				// (some sort of currentTarget implimentation, since we don't use real event bubbling)
				e.UIData.currentTarget = DOMNode;

				// ... iterate over all css selectors that are registered with event.type
				for(var s in handlers) {

					// ... and if the element matches the selector 
					if(UI.CSS.matches(DOMNode, s)) {
	
						// ... dispatch the event to all handlers registered for the selector ONCE
						// (so if you register the same handler for different selctors and the element matches multiple of them
						// the handler will be called only one)
						for(var i = 0, len = handlers[s].length; i !== len; ++i) {
							var fn = handlers[s][i];
	
							if(!UI.Tools.inArray(doubleCallProtection, fn)) {

								doubleCallProtection.push(fn);
								fn.call(DOMNode, e, e.UIData);

							}

							// if the event is cancelled, don't do any further proccessing 
							if(!e.returnValue) return;
								
						}

					}
	

				}
				
				DOMNode = DOMNode.parentElement;
			}

		};

		/* UI.Event namespace */
		UI.Event = (function() {

			var UserEvent = function(name, params) {

				var ev = new CustomEvent(name);
				ev.UIData = params || {};
				return ev;
			
			};


			/**
			 * Create DOM Event
			 * @param {String} name event.type
			 * @param {Object} params additional params
			 */
			UserEvent.create = function(name, params) {

				if(name in events) return  new events[name].__ctor(name, params);
				throw new Error("Cannot create unregistered Event '" + name + "'"); 

			};

			/**
			 * @callback EventConstructor
			 * @param {String} name event.type
			 * @param {Object} params additional Event parameters
			 */			

			/** 
			 * Register Event type
			 * @param {String} name event.type
			 * @param {EventConstructor} ctor Constructor Method for Event of type 'name'. 
			 */ 
			UserEvent.register = function(name, ctor) {

				if(name in events) throw new Error("Cannot re-register Event '" + name + "'");
		
				ctor = ctor || UserEvent;
				events[name] = { __ctor: ctor, __handlers: {} };
	
				document.addEventListener(name, captureDOMEvent, true);
	
			},

			/**
			 * @callback EventHandler
			 * @param {Event} e slightly modified DOMEvent 
			 * @param {Object} UIData Additional Event Data
			 */

			/**
			 * css selector style handler registration
			 * @param {String} descriptor event.type(s). Can be provided as "Ev1 Ev2 ..."
			 * @param {String} selector valid css selector. Be sure to escape special chars if needed
			 * @param {EventHandler} handler
			 */
			UserEvent.registerHandler = function(descriptor, selector, handler) {

				var evs = descriptor.split(/\s+/);
				for(var i = 0, len = evs.length; i !== len; ++i) {
		
					var ev = evs[i];				

					// Don't register handler for unregistered event
					if(ev in events) {
						if(!(selector in events[ev].__handlers)) events[ev].__handlers[selector] = [];
						if(!UI.Tools.inArray(events[ev].__handlers[selector], handler)) events[ev].__handlers[selector].push(handler);
					}
				}
				
			};

			/**
			 * css selector style handler unregistration
			 * @param {String} ev event.type
			 * @param {String} selector valid css selector. Be sure to escape special chars if needed
			 * @param {EventHandler} handler
			 */
			UserEvent.unregisterHandler = function(ev, selector, handler) {

				if(!(ev in events) || !(selector in events[ev].__handlers) || !UI.Tools.inArray(events[ev].__handlers, handler)) return;
			
				delete(events[ev].__handlers[selector], UI.Tools.indexOf(events[ev].__handlers[selector], handler));	
								

			};

			return UserEvent;

		})();

		/* {{{ Extend UI.Element Class */
		var Element = UI.Element;
	
		/**
		 * Element based handler registration
		 * @param {String} ev event.type
		 * @param {EventHandler} handler
		 */
		Element.defineMember("registerHandler", function(ev, handler) {

			UI.Event.registerHandler(ev, "[data-ui-element-inst-id=" + this.get("ElementInstId").replace(/#/g, "\\#") + "]", handler);
			return this;

		});

		/**
		 * Element based handler unregistration
		 * @param {String} ev event.type
		 * @param {EventHandler} handler
		 */
		Element.defineMember("unregisterHandler", function(ev, handler) {

			UI.Event.unregisterHandler(ev, "[data-ui-element-inst-id=" + this.get("ElementInstId").replace(/#/g, "\\#") + "]", handler);
			return this;

		});

		/** 
		 * Dispatch Event to UI.Element 
		 * @param {Event} e
		 */
		Element.defineMember("dispatchEvent", function(e) {
		
			this.$.dispatchEvent(e);
			return this;

		});

		/* Extend UI.Element Class }}} */

		/* Registering standard DOM Events*/
		(function() {
			var props = Object.getOwnPropertyNames(document.createElement("div"));
			for(var i = 0, len = props.length; i !== len; ++i) {
				var p = props[i];
				// I hope this is somehow cross browser safe
				if(p.match(/^on/)) UI.Event.register(p.substr(2));
			}
		})();

	
	},	

});
