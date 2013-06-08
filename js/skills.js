if (typeof(BBFDb) == 'undefined')
	BBFDb = {}

BBFDb.Skills = {
	Cleric: {},
	Enchanter: {},
	Leader: {},
	Scholar: {},
	Scout: {},
	Spellcaster: {},
	Thief: {},
	Warrior: {}
};

BBFDb.SkillChecks = {
	Cleric: {
		Name: "Cleric",
		SkillName: "Cleric",
		Base: "WIL",
		UseUntrained: false
	},
	Enchanter: {
		Name: "Enchanter",
		SkillName: "Enchanter",
		Base: "LOG",
		UseUntrained: false
	},
	Leader: {
		Name: "Leader",
		SkillName: "Leader",
		Base: "WIL",
		UseUntrained: false
	},
	Scholar: {
		Name: "Scholar",
		SkillName: "Scholar",
		Base: "LOG",
		UseUntrained: false
	},
	Scout: {
		Name: "Scout",
		SkillName: "Scout",
		Base: "LOG",
		UseUntrained: true
	},
	Spellcaster: {
		Name: "Spellcaster",
		SkillName: "Spellcaster",
		Base: "LOG",
		UseUntrained: false
	},
	Thief: {
		Name: "Thief",
		SkillName: "Thief",
		Base: "DEX",
		UseUntrained: true
	},
	Melee: {
		Name: "Melee",
		SkillName: "Warrior",
		Base: "STR",
		UseUntrained: true
	},
	Ranged: {
		Name: "Ranged",
		SkillName: "Warrior",
		Base: "DEX",
		UseUntrained: true
	}
};
