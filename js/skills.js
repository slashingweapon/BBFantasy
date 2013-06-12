if (typeof(BBFDb) == 'undefined')
	BBFDb = {}

BBFDb.Skills = {
	Cleric: {
		Name: "Cleric",
		Description: "This skill represents a lifetime of devotion to the tenets of one or more gods. Clerics are champions of their deities, as well as the glue which binds a society together.",
		Score: "Half WIL +10 per cleric level. Cannot be attempted unskilled.",
		Uses: [
			{	
				Name: "Blessings",
				Description: "Turn water holy, sanctify marriage, allow a dead soul to rest in peace, etc."
			}, {
				Name: "Detect Aura",
				Description: "Detect general moral auras of people, places, or things."
			}, {
				Name: "Miracles",
				Description: "Each cleric level choose one of following spells bestowed upon you by your deity: aid, cleanse, dispel, heal, protection, or repel. May use them as their usage allows, requires holy symbol, cast spells using this skill and level, not spellcaster."
			}, {
				Name: "Smite",
				Description: 'Choose one specific weapon favored by your deity; you may use either your warrior score (determined in step 8 of character creation) or your cleric score (determined in step 4 of character creation) as the weapon score.'
			}
		]
	},
	Enchanter: {
		Name: "Enchanter",
		Description: "An enchanter is a special kind of user of magic, able to imbue items with magical abilities. They are the creators of potions, runes, and magic items in the kingdoms. Enchanters understand all spells in this book but cannot cast them. They can only imbue items with these abilities.",
		Score: "Half LOG +10 per enchanter level. Cannot be attempted unskilled.",
		Uses: [
			{
				Name: "Alchemy",
				Description: "Create magical potions providing a specified magical effect. It takes hours to days to create potions. Requires alchemist kit."
			}, {
				Name: "Enchantment",
				Description: "imbue magic items with spells or abilities. It takes days to weeks to create enchanted items."
			}
		]
	},
	Leader: {
		Name: "Leader",
		Description: "This skill represents experience and training on the battlefield - both personal and epic.",
		Score: "Half WIL +10 per leader level. Cannot be attempted unskilled.",
		Uses: [
			{
				Name: "Battle Commander",
				Description: "Before initiative is rolled make a skill check, if successful choose one below to be in effect until turn ends. Doesn’t count as an action."
			}
		]
	},
	Scholar: {
		Name: "Scholar",
		Description: "This skill represents knowledge and skill gleaned through a weighty education, steady access to books, legends, and lore."
	},
	Scout: {
		Name: "Scout",
		Description: "This skill represents training or experience as an outdoorsman, ranger, etc.",
		Score: "Half LOG +10 per scout level",
		Uses: [
			{
				Name: "Animal Handling",
				Description: "Befriend, calm, agitate, or train naturally occurring animals."
			}, {
				Name: "Navigation",
				Description: "Know which way is north, determine location on a known map, decipher maps, create maps, etc."
			}
		]
	},
	Spellcaster: {
		Name: "Spellcaster",
		Description: "This skill represents knowledge and use of magical powers.",
		Score: "Half LOG +10 per spellcaster level. Cannot be attempted unskilled.",
		Uses: [
			{
				Name: "High Wizardry",
				Description: "Get high.  Cast spells."
			}, {
				Name: "Low Wizardry",
				Description: "Do minor stuff nobody cares about."
			}
		]
	},
	Thief: {
		Name: "Thief",
		Description: "This skill represents the expertise a rogue or thief learns through use of talent and opportunity.",
		Score: "Half DEX +10 per thief level",
		Uses: [
			{
				Name: "Deception",
				Description: "Lie convincingly, forge documents, disguise, impersonate, etc."
			}
		]
	},
	Warrior: {
		Name: "Warrior",
		Description: "This skill represents training or experience as a mercenary, soldier, warrior, knight, etc.",
		Score: "Note this skill has two scores as follows; melee equals half STR, +10 per warrior level (includes unarmed combat). Ranged equals half DEX, +10 per warrior level (includes thrown weapons).",
		Uses: [
			{
				Name: "Marksman",
				Description: "Aimed projected weapons such as bows, crossbows, atlatls, slings, etc."
			}, {
				Name: "Melee weapons",
				Description: "swords, clubs, daggers, etc."
			}
		]
	}
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
