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
		Skill: "Cleric",
		Ability: "WIL",
		UseUntrained: false
	},
	Enchanter: {
		Name: "Enchanter",
		Skill: "Enchanter",
		Ability: "LOG",
		UseUntrained: false
	},
	Leader: {
		Name: "Leader",
		Skill: "Leader",
		Ability: "WIL",
		UseUntrained: false
	},
	Scholar: {
		Name: "Scholar",
		Skill: "Scholar",
		Ability: "LOG",
		UseUntrained: false
	},
	Scout: {
		Name: "Scout",
		Skill: "Scout",
		Ability: "LOG",
		UseUntrained: true
	},
	Spellcaster: {
		Name: "Spellcaster",
		Skill: "Spellcaster",
		Ability: "LOG",
		UseUntrained: false
	},
	Thief: {
		Name: "Thief",
		Skill: "Thief",
		Ability: "DEX",
		UseUntrained: true
	},
	Melee: {
		Name: "Melee",
		Skill: "Warrior",
		Ability: "STR",
		UseUntrained: true
	},
	Ranged: {
		Name: "Ranged",
		Skill: "Warrior",
		Ability: "DEX",
		UseUntrained: true
	}
};
