/**
 *	BBF Widget Library
 *	
 *	The intent here is to create UI widgets that are independent of the underlying 
 *	character model.  Most widgets are listeners that pick up changes from their 
 *	respective characters, and then update the UI elements.
 *
 *	requires:
 *		jquery-ui 1.9+
 *		dust.js
 */
(function($) {

// At docready time, read all of the text/html scripts that have IDs, and compile them
// for rendering by dust.js.
$(document).ready( function() {
	dust.helpers.iter = function(chunk, context, bodies, params) {
		var obj = (params && params['for']) ? params['for'] : context.current();
		var objType = typeof obj;
		
		if (objType === 'object') {
	        for (var k in obj)
    	        chunk = chunk.render(bodies.block, context.push({key: k, value: obj[k]}));
		} else if (bodies['scalar']) {
			if (objType === 'function')
				obj = 'function';
			chunk = chunk.render(bodies['scalar'], context.push(obj));
		}
			
        return chunk;
    };

	dust.helpers.scalar = function(chunk, context, bodies, params) {		
		var obj = (params && params['value']) ? params['value'] : context.current();
		var objType = typeof obj;
		
		if (objType === 'string' || objType === 'number' || objType === 'boolean') {
			chunk = chunk.render(bodies.block, context);
		} else if (bodies['else']) {
			chunk = chunk.render(bodies['else'], context);
		}
		
        return chunk;
    };

	$("script[type='text/html']").each( function() {
		if (this.id)
			dust.compileFn(this.childNodes[0].nodeValue, this.id);
	});
});
	
function getRelatedAttributes(elem) {
	var retval = {};
	
	if (elem instanceof jQuery)
		elem = elem.get(0);
	for(var idx in elem.attributes) {
		if (idx.match(/^bbf[A-Z]/))
			retval[idx] = elem.attributes[idx];
	}
	
	return retval;
}

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
			} else if ( je.attr('BBFBase') !== undefined ) {
				je.BaseWidget({ character: character });
			} else if ( je.attr('bbf-skill') !== undefined ) {
				je.Skills({ character: character });
			} else if ( je.attr('bbf-attribute') !== undefined ) {
				je.Attribute({ character: character });
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
		this.options.character.removeListener(this);
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

/**
 *	BBFAttribute | BBFSkillChecks | BBFSkills | BBFConditions | BBFNotes
 *		bbfValue='@Attribute'
 *		bbfValue='@Score'
 *		bbfRepeat='@Db.Skills'
 *		bbfIf='path' (readmode|writemode|something)
 *		bbfIfNot='path'
 *		bbfRepeat='path'
 *		bbfForm
 *		bbfInput
 *		<input bbfName='_path_' bbfValue='_path_' bbfInput/>
 */
BBF_BaseWidget = {
	options: {
		character: null,
		mode: 'read'
	},

	_create: function() {
		this._super();
		
		var widget = this;
		
		this.template = this.element.attr('bbf-template');
		
		var character = this.options.character;
		if ( typeof character === 'object' && typeof character.addListener === 'function' )
			this.options.character.addListener( function(chob) {
				widget._update(chob);
			});
		
		this.render();
	},
		
	_destroy: function() {
		this.options.character.removeListener(this);
		this._super();	
	},
	
	render: function() {
		this._update( this.options.character );
	},
	
	_update: function(character) {
		var context = {
			Character: character,
			Db: BBFDb,
			ReadMode: this.options.mode == 'read' ? true : false,
			WriteMode: this.options.mode != 'read' ? true : false,
			Obj: {a:'cool', b:'sweet', c:'lately'},
			Things: ['a', 'b', 'c'],
			Scalar: 'arrrr'
		};
		
		this._draw( context );
	},

	_draw: function(contexts) {
		var widget = this;
		if (! $.isArray(contexts))
			contexts = [contexts];

		widget.element.empty();		
		for (var idx in contexts) {
			var ctx = contexts[idx];
			dust.render(this.template, ctx, function(err, out) {
				if (err)
					alert(err);
				widget.element.append(out);
			});
		}
	},
		
	_formEvents: function(elem, event) {
		return false;
	}
	
};
$.widget('bbf.BaseWidget', BBF_BaseWidget);

BBF_AttributeWidget = {
	options: {
		'attributes': []
	},
	
	_create: function() {
		this._super();
		var widget = this;
		
		var indices = this.element.attr('bbf-attribute');
		if (typeof indices === 'string') {
			this.options.attributes = indices.split(/\s+/);
		}
		
		this.element.on('change', '.bbf-input', function(evt) {
			var elem = $(this);
			var nm = elem.attr('name');
			if (nm !== undefined)
				widget.options.character.setAttribute(nm, elem.val());
			return false;
		});
	},
	
	_update: function(character) {
		var clist = [];
		
		for (var idx in this.options.attributes) {
			var context = {
				Character: character.data,
				Db: BBFDb,
				ReadMode: this.options.mode == 'read' ? true : false,
				WriteMode: this.options.mode != 'read' ? true : false,
			};
			context.AttributeName = this.options.attributes[idx];
			context.AttributeValue = this.options.character.getAttribute(context.AttributeName);
			clist.push(context);
		}
		this._draw(clist);		
	}
};
$.widget('bbf.Attribute',  $.bbf.BaseWidget, BBF_AttributeWidget);

BBF_SkillsWidget = {
	options: {
		skills: []
	},

	_create: function() {
		this._super();
		var widget = this;
		
		var indices = this.element.attr('bbf-skill');
		if (typeof indices === 'string') {
			if (indices === '*')
				this.options.skills = objKeys(BBFDb.Skills);
			else
				this.options.skills = indices.split(/\s+/);
		}
		
 		this.element.on('change', '.bbf-input', function(evt) {
			var form = $(this).closest('form').serializeArray();
			var skilz = {};
			if (!form)
				form = {};
 			
			for (var idx in form) {
				var name = form[idx].name;
				var level = parseInt(form[idx].value);
				if (level > 0)
					skilz[name] = level;
 			}
							
			widget.options.character.data.Skills = skilz;
			widget.options.character.compute();
 		});
	},
		
	_update: function(character) {
		var cskills = this.options.character.getSkills();
		var context = {
			Character: character.data,
			Db: BBFDb,
			ReadMode: this.options.mode == 'read' ? true : false,
			WriteMode: this.options.mode != 'read' ? true : false,
			Skills: []
		};

		for (var idx in this.options.skills) {
			var skillName = this.options.skills[idx];
			var newSkill = $.extend({}, BBFDb.Skills[skillName]);
			newSkill.Score = parseInt(cskills[skillName]);
			context.Skills.push(newSkill);
		}		
		this._draw(context);
	}
};
$.widget('bbf.Skills', $.bbf.BaseWidget, BBF_SkillsWidget);

})(jQuery);
