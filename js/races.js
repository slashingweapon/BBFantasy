if (typeof(BBFDb) == 'undefined')
	BBFDb = {}
	
BBFDb.Races = {
	Elf: {
		Name: "Elf",
		Description: "Elves are tall, magical, pointed-eared beings at home in forests.",
		Specs: {
			SkillPoints: 1,
			Move: 9,
			Descriptors: 2,
			Languages: ["Elven", "Tradespeak"]
		},
		Bonuses: [
			{	Modifiers: "LOG+10" },
			{	Name: "Darkvision",
				Description: "See 12 spaces in darkness, allows normal sight in low-light, as long as a single star is present in the sky." 
			},
			{	Name: "Natural Spellcaster",
				Description: "Can wear any armor and cast spells without penalty, regardless of STR."
			},
			{	Name: "Elf Resilience",
				Description: "+10 resist charm spells"
			}
		]
	},
	Halfling: {
		Name: "Halfling",
		Description: "Halflings are small, wiry people who dwell in the hills and valleys of the realm.",
		Specs: {
			SkillPoints: 1,
			Move: 7,
			Descriptors: 2,
			Languages: ['Halfling', 'Tradespeak'],
		},
		Bonuses: [
			{	Modifiers: "DEX+10" },
			{	Name: "Luck",
				Description: "Each encounter, re-roll one check."
			},
			{	Name: "Footpad",
				Description: "+10 on any hide or sneak check."
			}
		]
	},
	Human: {
		Name: "Human",
		Description: "Humans are a sturdy, passionate race who dwell in the plains and valleys of the realm.",
		Specs: {
			SkillPoints: 1,
			Move: 8,
			Descriptors: 3,
			Languages: ['Anglish', 'Tradespeak'],
		},
		Bonuses: [
			{	Modifiers: "WIL+10" },
			{	Name: "Human Versatility",
				Description: "One additional descriptor"
			},
			{	Name: "Human Resilience",
				Modifiers: "RES+10"
			}
		]
	}
}
