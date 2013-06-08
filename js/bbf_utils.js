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

function BBF_Character(rawdata) {
	
	this.data = {
		Version: 0,
		BaseSTR: 65,
		BaseDEX: 60,
		BaseLOG: 55,
		BaseWIL: 50,
		STR: 65,
		DEX: 60,
		LOG: 55,
		WIL: 50,
		PrimarySkill: 'Warrior',
		SecondarySkill: 'Thief',
		Race: {	Name: "", Description: "", Specs: {}, Bonuses: [] }
	};
	
	this.listeners = {};

	this.compute = function() {
		this.data.STR = this.data.BaseSTR;
		this.data.DEX = this.data.BaseDEX;
		this.data.LOG = this.data.BaseLOG;
		this.data.WIL = this.data.BaseWIL;
		
		this.data.BP = Math.ceil(this.data.STR / 2);
		this.data.INIT = 1;
		if (this.data.LOG >= 65) this.data.INIT += 1;
		if (this.data.DEX >= 65) this.data.INIT += 1;
		
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
		this.data.Race = r;
		this.compute();
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
	
	this.compute();
}

BBF_Character.prototype.setRace = function(race) {

}

