/**
 *	BBF Widget Library
 *	
 *	The intent here is to create UI widgets that are independent of the underlying 
 *	character model.  Most widgets are listeners that pick up changes from their 
 *	respective characters, and then update the UI elements.
 *
 *	requires:
 *		jquery-ui 1.9+
 */
(function($) {

$.bbf = new function() {

	this.factory = function(character) {
		$(".BBFWidget").each( function() {
			var je = $(this);
			var attr = je.attr('attribute');
			var bbftype = je.attr('BBFType');
			
			if (attr !== undefined) {
				je.AttributeWidget({ character: character, attribute: attr });
			} else if ( je.attr('race') !== undefined ) {
				je.RaceWidget({ character: character });
			} else if ( je.attr('skillCheck') !== undefined ) {
				je.SkillCheckWidget({ character: character });
			} else if (bbftype === 'CoolAttribute') {
				je.CoolAttribute({ character:character });
			}
		});
	}
};

BBF_Attribute_Widget = {
	options: {
		character: null,
		attribute: 'STR'
	},
	
	_create: function() {
		this._super();
		
		var je = this.element;
		var charObj = this.options.character;
		var widget = this;
		var callback = function(obj) {
			widget.BBF_Update(obj);
		};
		
		if ( typeof charObj == 'object' && charObj.addListener ) {
			charObj.addListener(callback, [this.options.attribute]);
			this.BBF_Update(charObj);
		}
	},
	
	_destroy: function() {
		character.removeListener(this);
		this._super();	
	},

	BBF_Update: function(charObj) {
		if (!charObj)
			return;
			
		this.element.find('.BBFLabel').html(this.options.attribute);
		this.element.find('.BBFValue').html(charObj.getAttribute(this.options.attribute));
	}
};
$.widget("bbf.AttributeWidget", BBF_Attribute_Widget);

BBF_Race_Widget = {
	options: {
		character: null,
	},
	
	_create: function() {
		this._super();
		
		var je = this.element;
		var charObj = this.options.character;
		var widget = this;
		var callback = function(obj) {
			widget.BBF_Update(obj);
		};
		
		if ( typeof charObj == 'object' && charObj.addListener ) {
			charObj.addListener(callback, ['race']);
			this.BBF_Update(charObj);
		}
	},
	
	_destroy: function() {
		character.removeListener(this);
		this._super();	
	},

	BBF_Update: function(charObj) {
		var raceInfo = false
		if (charObj)
			raceInfo = charObj.getRace();
			
		if (raceInfo) {
			this.element.find('.BBFName').html(raceInfo.Name);
			this.element.find('.BBFDescription').html(raceInfo.Description);
		}
	}
};
$.widget("bbf.RaceWidget", BBF_Race_Widget);

BBF_SkillCheck_Widget = {
	options: {
		character: null,
	},
	
	_create: function() {
		this._super();

		var je = this.element;
		var widget = this;
		var charObj = this.options.character;
		var callback = function(obj) {
			widget.BBF_Update(obj);
		};

		this.skills = this.element.attr('skillCheck');
		this.template = this.element.attr('template');
		if (this.template !== undefined) {
			// templates are typically hidden through some means or other
			// make a copy, throw away the ID
			this.template = $(this.template).first().clone();
			this.template.removeClass('hidden').show(); 
			this.template.removeAttr('id');
		}
		
		if ( typeof charObj == 'object' && charObj.addListener ) {
			charObj.addListener(callback, ['skillChecks']);
			this.BBF_Update(charObj);
		}
	},
	
	_destroy: function() {
		character.removeListener(this);
		this._super();	
	},

	BBF_Update: function(charObj) {
		var oneCheck;
		var checks = false;
		if (charObj)
			checks = charObj.getSkillChecks();
		
		if (this.template == false) {
			// If there is no template, just fill our element using the data.
			oneCheck = checks[this.skills];
			if (oneCheck !== undefined)
				this.fill(this.element, oneCheck);
		} else {
			// for templates, clear our element and re-fill with a copy of the template
			this.element.empty();
			if (this.skills == '*') {
				for( var idx in checks ) {
					var tmp = this.template.clone();
					this.element.append( this.fill(tmp, checks[idx]) );
				}
			} else {
				oneCheck = checks[this.skills];
				if (oneCheck !== undefined) {
					var tmp = this.template.clone();
					this.element.append( this.fill(tmp, oneCheck) );
				}
			}
			
		}
	},
	
	fill: function(elem, data) {
		elem.find(".BBFLabel").html(data.Name);
		elem.find(".BBFValue").html(data.Score);
		return elem;
	}
};
$.widget("bbf.SkillCheckWidget", BBF_SkillCheck_Widget);

BBF_CoolAttribute_Widget = {
	options: {
		character: null,
		indexes: [],
		lookup: null,
		mode: 'read'
	},
	
	_create: function() {
		this._super();

		var je = this.element;
		var widget = this;
		var charObj = this.options.character;
		var callback = function(obj) {
			widget.BBF_Update(obj);
		};
		
		this.template = this.element.attr('BBFTemplate');
		if (this.template !== undefined)
			this.template = $(this.template).first().children().clone();
		else
			this.template = je.children().detach().clone();
		
		var indices = this.element.attr('BBFIndex');
		if (typeof indices === 'string') {
			this.options.indexes = indices.split(/\s+/);
		}
		
		var lookup = this.element.attr('BBFLookup');
		if (typeof lookup === 'string') {
			this.options.lookup = BBFDb[lookup];
		}
		
		if ( typeof charObj == 'object' && charObj.addListener ) {
			charObj.addListener(callback, ['attributes']);
			this.BBF_Update(charObj);
		}
	},
	
	_destroy: function() {
		character.removeListener(this);
		this._super();	
	},

	BBF_Update: function(charObj) {
		for (var idx in this.options.indexes) {
			var Index = this.options.indexes[idx];
			var Value = charObj.getAttribute(Index);
			var context = {
				Attribute: Index,
				Key: Index,
				Value: this.options.lookup ? this.options.lookup[Value] : value,
				Template: this.template.clone()
			};
			var tree = this.template.clone();
			this.fill(tree, context);
			this.element.empty().append( tree );
		}
	},

	/**	The massive fill function.
		We have to keep a context stack, a current value (as part of the context), 
		and do a deep traversal of a subtree.
	*/
	fill: function(tree, data) {
		var widget = this;
		
		tree.each( function(idx) {
			var elem = $(this);
			
			var field = elem.attr('BBFField');
			if (field !== undefined && data.Value[field] !== undefined)
				elem.html( data.Value[field] );
			
			var bbfIndex = elem.attr('BBFIndex');
			if (bbfIndex !== undefined)
				elem.append(data.Key);
			
			var bbfValue = elem.attr('BBFValue');
			if (bbfValue !== undefined)
				elem.append(data.Value);
			
			var select = elem.attr('BBFDbSelect');
			if (select !== undefined) {
				var source = BBFDb[select];
				if (typeof source === 'object') {
					var options = [];
					for (var idx in source) {
						var text = source[idx];
						if (typeof text === 'object' && text.Name !== undefined)
							text = text.Name;
						else
							text = idx;
						
						var oneOption = $("<option/>").val(idx).html(text);
						if (idx === widget.options.character.getAttribute(data.Key))
							oneOption.attr('selected', 1);
						options.push(oneOption);
					}
					elem.append( options );
				}
			}

			if (elem.is('form')) {
				var edat = $.extend({}, data);
				elem.on('submit', edat, function(evt) {
					return widget._formEvents($(this), evt);
				});
				elem.on('change', '.BBFInput', edat, function(evt) {
					return widget._formEvents($(this), evt);
				});
			}
			
			var repeat = elem.attr('BBFRepeat');
			if (repeat !== undefined) {
				var newTemplate = elem.children().detach();
				var newValues = data.Value[repeat];
				if (typeof newValues === 'object') {
					for (var idx in newValues) {
						var newContext = $.extend({}, data, {
							Key: idx,
							Value: newValues[idx],
							Template: newTemplate.clone()
						});
						var newTree = newTemplate.clone();
						widget.fill(newTree, newContext);
						elem.append( newTree );
					}
				}
			} else if (elem.children().size()>0) {
				widget.fill(elem.children(), data);
			}
			
		});
	},
	
	_formEvents: function(elem, event) {
		if (event.data.Attribute !== undefined) {
			if (elem.is('.BBFInput')) {
				this.options.character.setAttribute(event.data.Attribute, elem.val());
				this.options.character.compute();
			}
		}
	}
};
$.widget("bbf.CoolAttribute", BBF_CoolAttribute_Widget);

})(jQuery);
