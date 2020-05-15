"use strict";
// Hover skill descriptions
$(document).on("mouseover click", ".all--skills", function(){
	let hoveredSkill = $(this).attr("id");
	let skillText = "";

	let character;
	let dmgTarget;
	let hlTarget;
	/* 
		Encode in UTF-8
		
		🔪  - damage - knife 
		❤️  - heal - heart
		🍄  - mana - mushroom
		⌛ - cooldown - hour glass
		☯️ - special desc - ying yang
		🔋 - charge - battery
		🎆 - summon deactivate - fire works
		🔩 - summon special desc - nut and bolt
		🔧 - summon count/level - wrench
		⏰ - pass time - alarm clock
	*/
	
	// Sees if it's your skill or enemy's
	if($(this).hasClass("your--skills")){
		character = thePlayer;
	} else if($(this).hasClass("enemy--skills")){
		character = currentEnemy;
	}
	// Skill Description
	skillText += "<em>"+character.skills[hoveredSkill].description+"</em>";
	
	// Special Description
	if(character.skills[hoveredSkill].specialDesc != undefined){
		skillText += "<br> ☯️ "+character.skills[hoveredSkill].specialDesc;
	}
	
	if(character.skills[hoveredSkill].summon == undefined){
		skillText += "<br> | ";
	}
	
	// Adds smart damage min-max text /w target
	if(character.skills[hoveredSkill].damageTarget == thePlayer){
		dmgTarget = "<span style='color: hsl(120, 75%, 75%)'><strong>yourself</strong></span>";
	} else if (character.skills[hoveredSkill].damageTarget == currentEnemy){
		dmgTarget = "<span style='color: hsl(300, 75%, 75%)'><strong>the opponent</strong></span>";
	} else {
		dmgTarget = "How did you even get this placeholder message?";
	}
	if(character.skills[hoveredSkill].damageMin != undefined){
		skillText += "🔪  Deals "+character.skills[hoveredSkill].damageMin+"-"+character.skills[hoveredSkill].damageMax+" damage to "+dmgTarget+" | ";
	}
	if(character.skills[hoveredSkill].damageCharge != undefined){
		skillText += "🔋 Damage Charge "+character.skills[hoveredSkill].currentDamageCharge+"/"+character.skills[hoveredSkill].damageCharge+" | ";
	}
	
	// Adds smart heal min-max text /w target
	if(character.skills[hoveredSkill].healTarget == thePlayer){
		hlTarget = "<span style='color: hsl(120, 75%, 75%)'><strong>yourself</strong></span>";
	} else if (character.skills[hoveredSkill].healTarget == currentEnemy){
		hlTarget = "<span style='color: hsl(300, 75%, 75%)'><strong>the opponent</strong></span>";
	} else {
		hlTarget = "How did you even get this placeholder message?";
	}
	if(character.skills[hoveredSkill].healMin != undefined){
		skillText += "❤️  Heals "+character.skills[hoveredSkill].healMin+"-"+character.skills[hoveredSkill].healMax+" health to "+hlTarget+" | ";
	}
	if(character.skills[hoveredSkill].healCharge != undefined){
		skillText += "🔋 Heal Charge "+character.skills[hoveredSkill].currentHealCharge+"/"+character.skills[hoveredSkill].healCharge+" | ";
	}
	
	if(character.skills[hoveredSkill].summon == undefined){
		// Adds mana usage to text
		if(character.skills[hoveredSkill].manaUsage != undefined){
			skillText += "🍄  Uses "+character.skills[hoveredSkill].manaUsage+" mana | ";
		}	else if (character.skills[hoveredSkill].id != "passTime"){
			skillText += "🍄  Uses 0 mana | ";
		}
	
		// Adds cooldown to text
		if(character.skills[hoveredSkill].cooldownAfterUse != undefined){
			skillText += "⌛ "+character.skills[hoveredSkill].cooldownAfterUse+" Turn cooldown | ";
		}	else if (character.skills[hoveredSkill].id != "passTime"){
			skillText += "⌛ No cooldown | ";
		}
	}
	
	// Summons //
	if(character.skills[hoveredSkill].summon != undefined){
		// Summon Special Description
		if(character.skills[hoveredSkill].sSpecialDesc != undefined){
			skillText += "<br> 🔩 "+character.skills[hoveredSkill].sSpecialDesc;
		}
		
		skillText += "<br> | ";
		
		// Adds summon's damage min-max text /w target
		if(character.skills[hoveredSkill].sDamageTarget == thePlayer){
			dmgTarget = "<span style='color: hsl(120, 75%, 75%)'><strong>yourself</strong></span>";
		} else if (character.skills[hoveredSkill].sDamageTarget == currentEnemy){
			dmgTarget = "<span style='color: hsl(300, 75%, 75%)'><strong>the opponent</strong></span>";
		} else {
			dmgTarget = "How did you even get this placeholder message?";
		}
		if(character.skills[hoveredSkill].sDamageMin != undefined){
			skillText += "🔪  Deals "+character.skills[hoveredSkill].sDamageMin+"-"+character.skills[hoveredSkill].sDamageMax+" damage to "+dmgTarget+" | ";
		}
		if(character.skills[hoveredSkill].sDamageCharge != undefined){
			skillText += "🔋 Damage Charge "+character.skills[hoveredSkill].sCurrentDamageCharge+"/"+character.skills[hoveredSkill].sDamageCharge+" | ";
		}
		
		// Adds summon's heal min-max text /w target
		if(character.skills[hoveredSkill].sHealTarget == thePlayer){
			hlTarget = "<span style='color: hsl(120, 75%, 75%)'><strong>yourself</strong></span>";
		} else if (character.skills[hoveredSkill].sHealTarget == currentEnemy){
			hlTarget = "<span style='color: hsl(300, 75%, 75%)'><strong>the opponent</strong></span>";
		} else {
			hlTarget = "How did you even get this placeholder message?";
		}
		if(character.skills[hoveredSkill].sHealMin != undefined){
			skillText += "❤️  Heals "+character.skills[hoveredSkill].sHealMin+"-"+character.skills[hoveredSkill].sHealMax+" health to "+hlTarget+" | ";
		}
		if(character.skills[hoveredSkill].sHealCharge != undefined){
			skillText += "🔋 Heal Charge "+character.skills[hoveredSkill].sCurrentHealCharge+"/"+character.skills[hoveredSkill].sHealCharge+" | ";
		}
		
		// Deactivates summon on x HP/MP
		if(character.skills[hoveredSkill].sDeativateOnHP != 0){
			skillText += "🎆 Deactivates in "+character.stats.health.maxHealth*character.skills[hoveredSkill].sDeativateOnHP+" HP";
			if(character.skills[hoveredSkill].sDeativateOnMP != 0){
				skillText += "/"+character.stats.mana.maxMana*character.skills[hoveredSkill].sDeativateOnMP+" MP | "
			} else {
				skillText+= " | "
			}
		} else if(character.skills[hoveredSkill].sDeativateOnMP != 0){
			skillText += "🎆 Deactivates in "+character.stats.health.maxHealth*character.skills[hoveredSkill].sDeativateOnMP+" MP";
			if(character.skills[hoveredSkill].sDeativateOnHP != 0){
				skillText += "/"+character.stats.mana.maxMana*character.skills[hoveredSkill].sDeativateOnHP+" HP | "
			} else {
				skillText+= " | "
			}
		}
		
		// Current Level/Count and Max Level/Count
		if(character.skills[hoveredSkill].sMaxCount != undefined){
			if(character.skills[hoveredSkill].sTurretType == "upgradable"){
				skillText += "🔧 Unit Level: "+character.skills[hoveredSkill].sCurrentCount()+"/"+character.skills[hoveredSkill].sMaxCount+" | ";
			} else if(character.skills[hoveredSkill].sTurretType == "singular"){
				skillText += "🔧 Unit Count: "+character.skills[hoveredSkill].sCurrentCount()+"/"+character.skills[hoveredSkill].sMaxCount+" | ";
			} else {
				skillText += "How did you even get this placeholder message?";
			}
		}
		
		// Adds mana usage to text
		if(character.skills[hoveredSkill].manaUsage != undefined){
			skillText += "🍄  Uses "+character.skills[hoveredSkill].manaUsage+" mana | ";
		}	else if (character.skills[hoveredSkill].id != "passTime"){
			skillText += "🍄  Uses 0 mana | ";
		}
	
		// Adds cooldown to text
		if(character.skills[hoveredSkill].cooldownAfterUse != undefined){
			skillText += "⌛ "+character.skills[hoveredSkill].cooldownAfterUse+" Turn cooldown | ";
		}	else if (character.skills[hoveredSkill].id != "passTime"){
			skillText += "⌛ No cooldown | ";
		}
	} // Summons End //
	
	if (character.skills[hoveredSkill].id == "passTime"){
		skillText += "⏰ You do nothing this round. | ";
	}
	$("#skill-description").html(skillText);
	$("#skill-description").css("color", thePlayer.skills[hoveredSkill].color);
});
