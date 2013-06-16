/**
 *	Requires jquery.
 */

function die(d) {
	d = parseInt(d);
	var n = Math.floor( Math.random() * d ) ;
	if (d != 100)
		d += 1;
	return n;
}

function uid() {
	var m = new Date();
	return '' + m.valueOf() + '.' + Math.floor(Math.random()*1000000);
}

function objKeys(obj) {
	var retval = [];
	
	for (var idx in obj)
		retval.push(idx);
		
	return retval;
}

function BBF_Character(rawdata) {
	
	this.data = {
		Version: 0,
		Name: "",
		BaseSTR: 65,
		BaseDEX: 60,
		BaseLOG: 55,
		BaseWIL: 50,
		BaseDR: 0,
		STR: 65,
		DEX: 60,
		LOG: 55,
		WIL: 50,
		Skills: {},
		SkillChecks: {},
		PrimarySkill: 'Warrior',
		SecondarySkill: 'Thief',
		Race: $.extend(true, {}, BBFDb.Races.Human)
	};
	
	this.listeners = {};

	this.computeSkillChecks = function() {
		this.data.SkillChecks = {};
		for (var scIndex in BBFDb.SkillChecks) {
			var checkInfo = {
				IsPrimary: false,
				IsSecondary: false,
				PS: 0,
				SkillPoints: 0,
				AbilityScore: 0,
				Score: 0
			};
			$.extend(checkInfo, BBFDb.SkillChecks[scIndex]);
			
			checkInfo.SkillPoints = this.data.Skills[checkInfo.Skill];
			if (checkInfo.SkillPoints == undefined)
				checkInfo.SkillPoints = 0;
			
			// If the skill can't be used without training, and we have no points in it,
			// then we can stop here and continue with the next iteration.
			if ( checkInfo.SkillPoints == 0 && checkInfo.UseUntrained == false )
				continue;
				
			checkInfo.AbilityScore = this.data[checkInfo.Ability];
			if (this.data.PrimarySkill === checkInfo.Skill) {
				checkInfo.IsPrimary = true;
				checkInfo.PS = 20;
			} else if (this.data.SecondarySkill === checkInfo.Skill) {
				checkInfo.IsSecondary = true;
				checkInfo.PS = 10;
			}
			
			checkInfo.Score = Math.ceil(checkInfo.AbilityScore/2) + (checkInfo.SkillPoints*10) + checkInfo.PS ;
			this.data.SkillChecks[scIndex] = checkInfo;
		}
	};
	
	this.compute = function() {
		this.data.STR = this.data.BaseSTR;
		this.data.DEX = this.data.BaseDEX;
		this.data.LOG = this.data.BaseLOG;
		this.data.WIL = this.data.BaseWIL;

		this.data.BP = Math.ceil(this.data.STR / 2);
		this.data.INIT = 1;
		if (this.data.LOG >= 65) this.data.INIT += 1;
		if (this.data.DEX >= 65) this.data.INIT += 1;
		
		this.data.MOV = this.data.Race.Specs.Move;
		this.data.Languages = this.data.Race.Specs.Languages;

		// Find all the sources of various effect bonuses, and apply...
		for (var idx in this.data.Race.Bonuses) {
			var bonus = this.data.Race.Bonuses[idx];
			if (bonus && bonus.Modifiers)
				this.applyModifiers(bonus.Modifiers);
		}
		
		this.computeSkillChecks();
		
		for (var idx in this.listeners)
			this.listeners[idx].destination(this);		
	};
	
	this.getAttribute = function(name) {
		var type = typeof this.data[name];
		
		if ( type=='string' || type=='number' ) {
			return this.data[name];
		} else
			return null;
	};
	
	this.setAttribute = function(name, value) {
		var fieldType = typeof this.data[name];
		
		if (fieldType == 'string')
			this.data[name] = String(value);
		else if (fieldType == 'number')
			this.data[name] = Number(value);
	}
	
	this.getRace = function() {
		return this.data.Race;
	}
	
	this.setRace = function(r) {
		this.data.Race = $.extend(true, {}, r);
		this.compute();
	}
	
	this.getSkills = function() {
		return this.data.Skills;
	}
	
	this.getSkillChecks = function() {
		return $.extend(true, {}, this.data.SkillChecks);
	}
	
	this.removeListener = function(dest) {
		for( var idx in this.listeners ) {
			if ( this.listeners[idx].destination === dest )
				delete this.listeners[idx];
		}
	};
	
	this.addListener = function(dest, events) {
		this.removeListener(dest);
		
		this.listeners[ uid() ] = {
			destination: dest,
			events: events		
		};
	};
	
	this.applyModifiers = function(modString) {
		modString = String(modString);
		var tokenList = modString.split(" ");
		var patt = /([a-z]+)(\+|-|\=)([0-9]+)/ig;

		for(var idx in tokenList) {
			var token = tokenList[idx];
			var matchInfo = patt.exec(token);
			// ["STR+10", "STR", "+", "10"]
			var attr = matchInfo[1];
			var op = matchInfo[2];
			var amt = Number(matchInfo[3]);
			
			// You can modify a base directly.  Use STR=50 instead.
			if ( /^Base/.exec(attr) )
				continue;
			
			if (typeof this.data[attr] == "number") {
				if (op === '+')
					this.data[attr] += amt;
				else if (op === '-')
					this.data[attr] -= amt;
			}
		}
	};
	
	this.compute();
}

