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


})(jQuery);
