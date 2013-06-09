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
			
			if (attr !== undefined) {
				je.AttributeWidget({ character: character, attribute: attr });
			} else if ( je.attr('race') !== undefined ) {
				je.RaceWidget({ character: character });
			} else if ( je.attr('skillCheck') !== undefined ) {
				je.SkillCheckWidget({ character: character });
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


})(jQuery);
