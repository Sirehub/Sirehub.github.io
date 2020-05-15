"use strict";
/* 
[E]
Skills:
	id                 : "id",
	name               : "Name",
	element            : "Element",
	description        : "Description.",
	color              : "hsl(0, 75%, 75%)",

	hits               : 1,
	manaUsage          : 30,
	cooldownAfterUse   : 1,
	currentCooldown    : 0,
	
	get damageTarget() { return keyword; }, // Accepts one of: thePlayer, currentEnemy
	baseDamageMin      : 10,
	baseDamageMax      : 20,
	get damageMin()    { return Math.floor(this.baseDamageMin * (thePlayer.stats.combat.pyromancy / 100)); },
	get damageMax()    { return Math.floor(this.baseDamageMax * (thePlayer.stats.combat.pyromancy / 100)); },
	damageCharge       : 2,
	currentDamageCharge: 0,

	get healTarget()   { return keyword; }, // Accepts one of: thePlayer, currentEnemy
	baseHealMin        : 1,
	baseHealMax        : 2,
	get healMin()      { return Math.floor(this.baseHealMin * (thePlayer.stats.combat.pyromancy / 100)); },
	get healMax()      { return Math.floor(this.baseHealMax * (thePlayer.stats.combat.pyromancy / 100)); },
	healCharge       : 2,
	currentHealCharge: 0,

	activateSpecialOn  : "keyWord",  // Accepts 1 of: "damage", "heal", "own"
	specialDesc : "Applies 2 stacks of Flickering on the opponent, maximum of 10 stacks - Flickering does 2 damage per stack every round.",
	appliedStacks      : 2,
	maxStacks          : 10,
	special            : function() {
		if(this.TARGET.STATUS_TYPE.ELEMENT.STATUS < this.maxStacks){ 
			this.TARGET.STATUS_TYPE.ELEMENT.STATUS += Math.min(this.appliedStacks, this.maxStacks - this.TARGET.STATUS_TYPE.ELEMENT.STATUS);
		} 
	},
	propsCreate         : function(){
		if(this.TARGET.STATUS_TYPE.ELEMENT.hasOwnProperty("STATUS") == false){
			this.TARGET.STATUS_TYPE.ELEMENT.STATUS = 0;
		}
	}
 */

let thePlayer = {
	stats : {
		health : {
			currentHealth : 900,
			maxHealth     : 1000
		},
		mana : {
			currentMana   : 1000,
			maxMana       : 1000,
			usedMana      : true
		},
		combat : {
			get pyromancy()    { return thePlayer.stats.base.pyromancy + thePlayer.stats.mod.pyromancy; },
			get cryomancy()    { return thePlayer.stats.base.cryomancy + thePlayer.stats.mod.cryomancy; },
			get electromancy() { return thePlayer.stats.base.electromancy + thePlayer.stats.mod.electromancy; },
			get defence()      { return thePlayer.stats.base.defence + thePlayer.stats.mod.defence; }
		},
		base : {
			pyromancy     : 100,
			cryomancy     : 100,
			electromancy  : 100,
			defence       : 0
		},
		mod : {
			pyromancy     : 0,
			cryomancy     : 0,
			electromancy  : 0,
			defence       : 0
		}
	},
	skills : {
		flareBolt : {
			id                 : "flareBolt",
			name               : "Flare Bolt",
			element            : "fire",
			description        : "Launches a flare at the opponent. Deals low damage, but flickers your opponent shortly.",
			color              : "hsl(0, 75%, 75%)",

			hits               : 1,
			
			get damageTarget() { return currentEnemy; },
			damageMessage      : "💬 You fire a small and bright flare!",
			baseDamageMin      : 10,
			baseDamageMax      : 20,
			get damageMin()    { return Math.floor(this.baseDamageMin * (thePlayer.stats.combat.pyromancy / 100)); },
			get damageMax()    { return Math.floor(this.baseDamageMax * (thePlayer.stats.combat.pyromancy / 100)); },
			
			statusName         : "flickering",
			statusType         : "increasingStatuses",
			activateSpecialOn  : "own",
			get statusTarget() { return currentEnemy; },
			get specialDesc()  { return "Applies "+this.appliedStacks+" stacks of Flickering on the opponent, max of "+this.maxStacks+" stacks. - Flickering does 2 damage per stack every round."; },
			appliedStacks      : 4,
			maxStacks          : 20,
			special            : function() {
				if(this.statusTarget[this.statusType][this.element][this.statusName] < this.maxStacks){ 
					this.statusTarget[this.statusType][this.element][this.statusName] += Math.min(this.appliedStacks, this.maxStacks - this.statusTarget[this.statusType][this.element][this.statusName]);
				} 
			},
			propsCreate        : function() {
				if(this.statusTarget[this.statusType][this.element].hasOwnProperty(this.statusName) == false){
					this.statusTarget[this.statusType][this.element][this.statusName] = 0;
				}
			}
		},
		fireBall : {
			id                 : "fireBall",
			name               : "Fire Ball",
			element            : "fire",
			description        : "Hauls a big ball of fire at the opponent dealing moderate damage. It burns a lot but takes time to cast.",
			color              : "hsl(0, 75%, 75%)",

			hits               : 1,
			manaUsage          : 50,
			
			get damageTarget() { return currentEnemy; },
			damageMessage      : "💬 Your spell has fully charged and you haul a massive fire ball!",
			baseDamageMin      : 60,
			baseDamageMax      : 80,
			get damageMin()    { return Math.floor(this.baseDamageMin * (thePlayer.stats.combat.pyromancy / 100)); },
			get damageMax()    { return Math.floor(this.baseDamageMax * (thePlayer.stats.combat.pyromancy / 100)); },
			damageChargeMessage: "💬 You circle your hands, pooling fire in the middle...",
			damageCharge       : 3,
			currentDamageCharge: 0,

			statusName         : "burning",
			statusType         : "increasingStatuses",
			activateSpecialOn  : "damage",
			get statusTarget() { return currentEnemy; },
			get specialDesc()  { return "Applies "+this.appliedStacks+" stacks of Burning on the opponent. - Burning does 3 damage per stack every round."; },
			appliedStacks      : 6,
			maxStacks          : 60,
			special            : function() {
				if(this.statusTarget[this.statusType][this.element][this.statusName] < this.maxStacks){ 
					this.statusTarget[this.statusType][this.element][this.statusName] += Math.min(this.appliedStacks, this.maxStacks - this.statusTarget[this.statusType][this.element][this.statusName]);
				} 
			},
			propsCreate         : function() {
				if(this.statusTarget[this.statusType][this.element].hasOwnProperty(this.statusName) == false){
					this.statusTarget[this.statusType][this.element][this.statusName] = 0;
				}
			}
		},
		flameTurret : {
			id                 : "flameTurret",
			name               : "Flame Turret",
			element            : "fire",
			description        : "Summons a turret that sprays a deadly torrent of flame.",
			color              : "hsl(0, 75%, 75%)",
			
			manaUsage          : 100,
			
			summon             : function() { if(thePlayer.summons.flameTurret < this.sMaxCount){thePlayer.summons.flameTurret++;} },
			sMessage           : "💬 You toss out a tool box, which quickly opens and unpacks into a fire-spraying turret!",
			sTurretType        : "upgradable",
			sIncrementMessage  : "💬 You upgraded your fire-spray turret by powering it with your own skills!",
			sDeativateOnHP     : 0.80,
			sDeativateOnMP     : 0,
			sHits              : 1,
			sMaxMessage        : "💬 You tried to upgrade your flame turret, but it is already max upgraded!",
			sMaxCount          : 3,
			sCurrentCount      : function(){ if(thePlayer.summons[this.id] != undefined){return thePlayer.summons[this.id];} else {return 0;} },
			
			get sDamageTarget(){ return currentEnemy; },
			sDamageMessage     : "💬 The flame turret sprays a torrent of fire!",
			sBaseMinDamage     : 5,
			sBaseMaxDamage     : 10,
			get sDamageMin()   { return Math.floor(this.sBaseMinDamage * (thePlayer.stats.combat.pyromancy / 100)); },
			get sDamageMax()   { return Math.floor(this.sBaseMaxDamage * (thePlayer.stats.combat.pyromancy / 100)); },
			sDamageChargeMessage: "💬 The flame turret charges for a firey shot...",
			sDamageCharge       : 2,
			sCurrentDamageCharge: 0,
			
			get sHealTarget()  { return thePlayer; },
			sHealMessage       : "💬 The flame turret dispenses some life!",
			sBaseHealMin       : 3,
			sBaseHealMax       : 5,
			get sHealMin()     { return Math.floor(this.sBaseHealMin * (thePlayer.stats.combat.pyromancy / 100)); },
			get sHealMax()     { return Math.floor(this.sBaseHealMax * (thePlayer.stats.combat.pyromancy / 100)); },
			sHealChargeMessage : "💬 The flame turret's core glows...",
			sHealCharge        : 3,
			sCurrentHealCharge : 0,
			
			sActivateSpecialOn : "own",
			get sSpecialDesc() { return "Applies "+this.sAppliedStacks+" stacks, per level, of Flickering on the opponent, max of "+this.sMaxStacks+" stacks. - Flickering does 2 damage per stack every round."; },
			sAppliedStacks     : 2,
			sMaxStacks         : 5,
			sSpecial           : function() {
				if(this.sDamageTarget.increasingStatuses.fire.flickering < this.sMaxStacks){ 
					this.sDamageTarget.increasingStatuses.fire.flickering += Math.min(this.sAppliedStacks, this.sMaxStacks - this.sDamageTarget.increasingStatuses.fire.flickering);
				} 
			},
			
			propsCreate         : function() {
				if(thePlayer.summons.hasOwnProperty("flameTurret") == false){
					thePlayer.summons.flameTurret = 0;
				}
				if(this.sDamageTarget.increasingStatuses.fire.hasOwnProperty("flickering") == false){
					this.sDamageTarget.increasingStatuses.fire.flickering = 0;
				}
			}
		},
		iceArrow : {
			id                 : "iceArrow",
			name               : "Ice Arrow",
			element            : "ice",
			description        : "Conjures an ice arrow to pierce the opponent. Deals moderate damage and chills your opponent.",
			color              : "hsl(240, 75%, 75%)",

			hits               : 1,
			manaUsage          : 20,
			cooldownAfterUse   : 1,
			currentCooldown    : 0,
			
			get damageTarget() { return currentEnemy; },
			damageMessage      : "💬 You throw an icy sharp arrow!",
			baseDamageMin      : 40,
			baseDamageMax      : 60,
			get damageMin()    { return Math.floor(this.baseDamageMin * (thePlayer.stats.combat.cryomancy / 100)); },
			get damageMax()    { return Math.floor(this.baseDamageMax * (thePlayer.stats.combat.cryomancy / 100)); },
			
			statusName         : "cold",
			statusType         : "staticStatuses",
			activateSpecialOn  : "damage",
			get statusTarget() { return currentEnemy; },
			get specialDesc()  { return "Applies "+this.appliedStacks+" stacks of Cold on the opponent. - Cold reduces 10 defence for it's duration."; },
			appliedStacks      : 2,
			maxStacks          : 2,
			special            : function() { 
				if(this.statusTarget[this.statusType][this.element][this.statusName] < this.maxStacks){ 
					this.statusTarget[this.statusType][this.element][this.statusName] += Math.min(this.appliedStacks, this.maxStacks - this.statusTarget[this.statusType][this.element][this.statusName]);
				} 
				statuses.ice.cold();
			},
			propsCreate        : function() {
				if(this.statusTarget[this.statusType][this.element].hasOwnProperty("this.statusName") == false){
					this.statusTarget[this.statusType][this.element][this.statusName] = 0;
				}
			}
		},
		frostArmor : {
			id                 : "frostArmor",
			name               : "Frost Armor",
			element            : "ice",
			description        : "Encases the caster with a frosty armor that melts off quickly, greatly increases defence for a short amount of time and restores some health.",
			color              : "hsl(240, 75%, 75%)",
			
			hits               : 1,
			manaUsage          : 50,
			cooldownAfterUse   : 2,
			currentCooldown    : 0,

			get healTarget()   { return thePlayer; },
			healMessage        : "💬 You incase yourself in an armor made of frost! The frosted armor sooths you and suits you!",
			baseHealMin        : 40,
			baseHealMax        : 60,
			get healMin()      { return Math.floor(this.baseHealMin * (thePlayer.stats.combat.cryomancy / 100)); },
			get healMax()      { return Math.floor(this.baseHealMax * (thePlayer.stats.combat.cryomancy / 100)); },

			statusName         : "frosted",
			statusType         : "staticStatuses",
			activateSpecialOn  : "heal",
			get statusTarget() { return thePlayer; },
			get specialDesc()  { return "Applies "+this.appliedStacks+" stacks of Frosted on the yourself. - Frosted gives 100 defence for it's duration."; },
			appliedStacks      : 2,
			maxStacks          : 2,
			special            : function() {
				if(this.statusTarget[this.statusType][this.element][this.statusName] < this.maxStacks){ 
					this.statusTarget[this.statusType][this.element][this.statusName] += Math.min(this.appliedStacks, this.maxStacks - this.statusTarget[this.statusType][this.element][this.statusName]);
				}
				statuses.ice.frosted();
			},
			propsCreate         : function(){
				if(this.statusTarget[this.statusType][this.element].hasOwnProperty(this.statusName) == false){
					this.statusTarget[this.statusType][this.element][this.statusName] = 0;
				}
			}
		},
		lightningShock : {
			id                 : "lightningShock",
			name               : "Lightning Shock",
			element            : "lightning",
			description        : "Shocks your opponent with 3 bolts of lightning. Deals an unpredictable ammount damage.",
			color              : "hsl(60, 75%, 75%)",
			
			hits               : 3,
			
			get damageTarget() { return currentEnemy; },
			damageMessage      : "💬 You cast a lightning spell, causing several small bolts of lightning to come out!",
			baseDamageMin      : 1,
			baseDamageMax      : 35,
			get damageMin()    { return Math.floor(this.baseDamageMin * (thePlayer.stats.combat.electromancy / 100)); },
			get damageMax()    { return Math.floor(this.baseDamageMax * (thePlayer.stats.combat.electromancy / 100)); },
			
			manaUsage          : 11,
			special            : function() { },
			propsCreate        : function() {}
		},
		estimTherapy : {
			id                 : "estimTherapy",
			name               : "Estim Therapy",
			element            : "lightning",
			description        : "Uses electric stimulation to rejuvenate some health and mana, but at the initial cost of a bit of health and mana.",
			color              : "hsl(60, 75%, 75%)",

			hits               : 2,
			manaUsage          : 75,
			cooldownAfterUse   : 10,
			currentCooldown    : 0,
			
			get damageTarget() { return thePlayer; },
			damageMessage      : "💬 You touch yourself and release a cringing shock from your hands!",
			baseDamageMin      : 1,
			baseDamageMax      : 100,
			get damageMin()    { return Math.floor(this.baseDamageMin * (thePlayer.stats.combat.electromancy / 100)); },
			get damageMax()    { return Math.floor(this.baseDamageMax * (thePlayer.stats.combat.electromancy / 100)); },

			statusName         : "estimulated",
			statusType         : "staticStatuses",
			activateSpecialOn  : "damage",
			get statusTarget() { return thePlayer; },
			get specialDesc()  { return "Applies "+this.appliedStacks+" stacks of Estimulated on the yourself. - Estimulated restores 20 health and 15 mana every round."; },
			appliedStacks      : 10,
			maxStacks          : 10,
			special            : function() {
				if(this.statusTarget[this.statusType][this.element][this.statusName] < this.maxStacks){ 
					this.statusTarget[this.statusType][this.element][this.statusName] += Math.min(this.appliedStacks, this.maxStacks - this.statusTarget[this.statusType][this.element][this.statusName]);
				}
			},
			propsCreate        : function() {
				if(this.statusTarget[this.statusType][this.element].hasOwnProperty("this.statusName") == false){
					this.statusTarget[this.statusType][this.element][this.statusName] = 0;
				}
			}
		},
		testSkill : {
			id                 : "testSkill",
			name               : "Test Skill",
			element            : "physical",
			description        : "Skill testing.",
			color              : "hsl(270, 75%, 75%)",

			hits               : 1,
			manaUsage          : 30,
			cooldownAfterUse   : 1,
			currentCooldown    : 0,
			
			get damageTarget() { return thePlayer; },
			damageMessage      : "💬 This is damage message!",
			baseDamageMin      : 100,
			baseDamageMax      : 200,
			get damageMin()    { return Math.floor(this.baseDamageMin * (thePlayer.stats.combat.pyromancy / 100)); },
			get damageMax()    { return Math.floor(this.baseDamageMax * (thePlayer.stats.combat.pyromancy / 100)); },
			damageChargeMessage: "💬 This is charging damage message...",
			damageCharge       : 2,
			currentDamageCharge: 0,
			
			get healTarget()   { return currentEnemy; },
			healMessage        : "💬 This is heal message!",
			baseHealMin        : 10,
			baseHealMax        : 20,
			get healMin()      { return Math.floor(this.baseHealMin * (thePlayer.stats.combat.pyromancy / 100)); },
			get healMax()      { return Math.floor(this.baseHealMax * (thePlayer.stats.combat.pyromancy / 100)); },
			healChargeMessage  : "💬 This is charging heal message...",
			healCharge         : 2,
			currentHealCharge  : 0
		},
		passTime : {
			id                 : "passTime",
			name               : "Pass Time",
			element            : "physical",
			description        : "Passes the time.",
			color              : "hsl(0, 0%, 75%)",

			activateSpecialOn  : "own",
			special            : function() {
				$("<p>").text("💬 You twiddle your thumbs, waiting patiently...").css("color", this.color).appendTo("#battle-log");
			}
		}
	},
	increasingStatuses : {
		fire : {},
		ice : {},
		lightning : {}
	},
	staticStatuses : {
		fire : {},
		ice : {},
		lightning : {}
	},
	summons : {},
	other : {}
}
let thePuppet = {
	name: "The Puppet",
	stats : {
		health : {
			currentHealth : 1000,
			maxHealth     : 1000
		},
		mana : {
			currentMana   : 1000,
			maxMana       : 1000
		},
		combat : {
			get pyromancy()    { return thePuppet.stats.base.pyromancy + thePuppet.stats.mod.pyromancy; }, 
			get cryomancy()    { return thePuppet.stats.base.cryomancy + thePuppet.stats.mod.cryomancy; }, 
			get electromancy() { return thePuppet.stats.base.electromancy + thePuppet.stats.mod.electromancy; }, 
			get agility()      { return thePuppet.stats.base.agility + thePuppet.stats.mod.agility; },
			get mysticality()  { return thePuppet.stats.base.mysticality + thePuppet.stats.mod.mysticality; }, 
			get defence()      { return thePuppet.stats.base.defence + thePuppet.stats.mod.defence; }
		},
		base : {
			pyromancy     : 100,
			cryomancy     : 100,
			electromancy  : 100,
			agility       : 100,
			mysticality   : 100,
			defence       : 10
		},
		mod : {
			pyromancy     : 0,
			cryomancy     : 0,
			electromancy  : 0,
			agility       : 0,
			mysticality   : 0,
			defence       : 0
		}
	},
	skills : {
		
	},
	increasingStatuses : {
		fire : {},
		ice : {},
		lightning : {}
	},
	staticStatuses : {
		fire : {},
		ice : {},
		lightning : {}
	},
	summons : {},
	other : {}
}
let theBandit = {
	name: "Le Bandito",
	stats : {
		health : {
			currentHealth : 22222,
			maxHealth     : 22222
		},
		mana : {
			currentMana   : 1000,
			maxMana       : 1000
		},
		combat : {
			get pyromancy()    { return theBandit.stats.base.pyromancy + theBandit.stats.mod.pyromancy; }, 
			get cryomancy()    { return theBandit.stats.base.cryomancy + theBandit.stats.mod.cryomancy; }, 
			get electromancy() { return theBandit.stats.base.electromancy + theBandit.stats.mod.electromancy; }, 
			get agility()      { return theBandit.stats.base.agility + theBandit.stats.mod.agility; },
			get mysticality()  { return theBandit.stats.base.mysticality + theBandit.stats.mod.mysticality; }, 
			get defence()      { return theBandit.stats.base.defence + theBandit.stats.mod.defence; }
		},
		base : {
			pyromancy     : 100,
			cryomancy     : 100,
			electromancy  : 100,
			agility       : 100,
			mysticality   : 100,
			defence       : 10
		},
		mod : {
			pyromancy     : 0,
			cryomancy     : 0,
			electromancy  : 0,
			agility       : 0,
			mysticality   : 0,
			defence       : 0
		}
	},
	skills : {
		
	},
	increasingStatuses : {
		fire : {},
		ice : {},
		lightning : {}
	},
	staticStatuses : {
		fire : {},
		ice : {},
		lightning : {}
	},
	summons : {},
	other : {}
}


