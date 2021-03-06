"use strict";

let CE = [thePuppet, theBandit]
  , CEK = 0
  , currentEnemy = CE[CEK]
  , round = 1;
let characters = [thePlayer, currentEnemy];
let statusTypes = ["increasingStatuses", "staticStatuses"];
let statusElements = ["fire", "ice", "lightning"];
let allYourSkills = Object.keys(thePlayer.skills);

// Battle Handling
$(document).on("click", ".action:not(.disabled)", function(){
	HandleBattle(this);
});
function HandleBattle(context){
	// Makes divider with round count in Battle Log
	$("<p>").html("<span class='battle-log--divider-span'>Round "+round+"</span>").addClass("battle-log--divider").appendTo("#battle-log");
	
	// Activates some statuses and deceases them
	if(hasStatuses(thePlayer) || hasStatuses(currentEnemy)){
		$("<p>").html("<span class='battle-log--action-span'> STATUSES </span>").addClass("battle-log--organizer").appendTo("#battle-log");
	}
	staticStatusesDiminish();
	statusesActivate();	
	increasingStatusesDiminish();
	$("<p>").html("<span class='battle-log--action-span'> ACTIONS </span>").addClass("battle-log--organizer").appendTo("#battle-log");
	// Player's Action
	PlayerAction(context);
	// Summons
	if(hasSummons(thePlayer) || hasSummons(currentEnemy)){
		$("<p>").html("<span class='battle-log--action-span'> SUMMONS </span>").addClass("battle-log--organizer").appendTo("#battle-log");
	}
	yourSummonsActivate();
	// Update Stats & Statuses
	UpdateStats();
	UpdateStatuses();
	// Mana Regen
	if(thePlayer.stats.mana.usedMana == false){
		yourManaRegen();
	}
	
	// Reseting temporary variables
	thePlayer.stats.mana.usedMana = false;
	
	$("#battle-log").scrollTop($("#battle-log")[0].scrollHeight);
	round++;
}

/*-----------------------------------*/// ///*-----------------------------------*/
// Player's Turn
function PlayerAction(arg){	
	let selectedSkill = thePlayer.skills[$(arg).attr("id")];
	let	dmgTarget = selectedSkill.damageTarget;
	let	hlTarget = selectedSkill.healTarget;
	
	// Creates properties
	if(selectedSkill.propsCreate != undefined){
		selectedSkill.propsCreate();
	}
	
	// Applies special effect if it's set to apply on it's own
	if(selectedSkill.special != undefined && selectedSkill.activateSpecialOn == "own"){
		selectedSkill.special();
	}
	// Summons, if it can
	if(selectedSkill.summon != undefined){
		// Display initial summoning message
		if(thePlayer.summons[selectedSkill.id] <= 0){
			$("<p>").html("<strong>"+selectedSkill.sMessage+"</strong>").css("color", selectedSkill.color).appendTo("#battle-log");
		// Display upgrade summon message
		} else if(selectedSkill.sCurrentCount() < selectedSkill.sMaxCount){
			$("<p>").html("<strong>"+selectedSkill.sIncrementMessage+"</strong>").css("color", selectedSkill.color).appendTo("#battle-log");
		// Display max summoned message
		} else {
			$("<p>").html("<strong>"+selectedSkill.sMaxMessage+"</strong>").css("color", selectedSkill.color).appendTo("#battle-log");
		}
		// Activates summon ability
		selectedSkill.summon();
	}
	
	// All hits stored here
	let yourDamageOutput = [];
	let yourHealOutput = [];
	
	if(selectedSkill.manaUsage == undefined || thePlayer.stats.mana.currentMana >= selectedSkill.manaUsage){
		//* DAMAGE HANDLING *//
		if(selectedSkill.damageMin != undefined){
			// Sees if damage skill doesn't have delay or delay is met
			if(selectedSkill.damageCharge == undefined || selectedSkill.damageCharge <= selectedSkill.currentDamageCharge){
				// Damage message
				if(selectedSkill.damageMessage != undefined){
					$("<p>").html("<strong>"+selectedSkill.damageMessage+"</strong>").css("color", selectedSkill.color).appendTo("#battle-log");
				}
				// Rolls damage for each hit
				for(let i = 0; i < selectedSkill.hits; i++){
					yourDamageOutput.push(getRndInteger(selectedSkill.damageMin, selectedSkill.damageMax));
				}
				// Applies damage reduction to each hit then apply hit to enemy
				for(let i = 0; i < yourDamageOutput.length; i++){
					yourDamageOutput[i] = Math.max(0, Math.ceil((yourDamageOutput[i] - (yourDamageOutput[i] * (dmgTarget.stats.combat.defence / 1000))) - (dmgTarget.stats.combat.defence / 10)));
					dmgTarget.stats.health.currentHealth -= yourDamageOutput[i];
					
					// Logs in Battle Log each hit's damage and element.
					if(dmgTarget == thePlayer){
						$("<p>").text("- Damaged yourself for "+yourDamageOutput[i]+" '"+selectedSkill.element+"' damage").css("color", selectedSkill.color).appendTo("#battle-log");
					} else if (dmgTarget == currentEnemy) {
						$("<p>").text("- Damaged opponent for  "+yourDamageOutput[i]+" '"+selectedSkill.element+"' damage").css("color", selectedSkill.color).appendTo("#battle-log");
					} else {
						$("<p>").text("How did you even get this placeholder message?").css("color", "white").appendTo("#battle-log");
					}
				}
				// Applies special effect if it's set to apply on damage
				if(selectedSkill.special != undefined && selectedSkill.activateSpecialOn == "damage"){
					selectedSkill.special();
				}
				if(selectedSkill.damageCharge != undefined){
					selectedSkill.currentDamageCharge = 0;
				}
			} else {
				selectedSkill.currentDamageCharge++;
				$("<p>").html("<strong>"+selectedSkill.damageChargeMessage+"</strong>").css("color", selectedSkill.color).appendTo("#battle-log");
				$("<p>").text("- "+selectedSkill.name+"'s damage is charging... ("+selectedSkill.currentDamageCharge+"/"+selectedSkill.damageCharge+")").css("color", selectedSkill.color).appendTo("#battle-log");
			}
		}
		//* HEAL HANDLING *//
		if(selectedSkill.healMin != undefined){
			// Sees if heal skill doesn't have delay or delay is met
			if(selectedSkill.healCharge == undefined || selectedSkill.healCharge <= selectedSkill.currentHealCharge){
				// Heal message
				if(selectedSkill.healMessage != undefined){
					$("<p>").html("<strong>"+selectedSkill.healMessage+"</strong>").css("color", selectedSkill.color).appendTo("#battle-log");
				}
				// Rolls heal for each hit
				for(let i = 0; i < selectedSkill.hits; i++){
					yourHealOutput.push(getRndInteger(selectedSkill.healMin, selectedSkill.healMax));
				}
				// Applies heal reduction to each hit then apply hit to enemy
				for(let i = 0; i < yourHealOutput.length; i++){
					hlTarget.stats.health.currentHealth += yourHealOutput[i];
					
					// Logs in Battle Log each hit's damage and element.
					if(hlTarget == thePlayer){
						$("<p>").text("- Healed yourself for "+yourHealOutput[i]+" '"+selectedSkill.element+"' health").css("color", selectedSkill.color).appendTo("#battle-log");
					} else if (hlTarget == currentEnemy) {
						$("<p>").text("- Healed opponent for "+yourHealOutput[i]+" '"+selectedSkill.element+"' health").css("color", selectedSkill.color).appendTo("#battle-log");
					} else {
						$("<p>").text("How did you even get this placeholder message?").css("color", "white").appendTo("#battle-log");
					}
				}
				// Applies special effect if it's set to apply on heal
				if(selectedSkill.special != undefined && selectedSkill.activateSpecialOn == "heal"){
					selectedSkill.special();
				}
				if(selectedSkill.healCharge != undefined){
					selectedSkill.currentHealCharge = 0;
				}
			} else {
				selectedSkill.currentHealCharge++;
				$("<p>").html("<strong>"+selectedSkill.healChargeMessage+"</strong>").css("color", selectedSkill.color).appendTo("#battle-log");
				$("<p>").text("- "+selectedSkill.name+"'s heal is charging... ("+selectedSkill.currentHealCharge+"/"+selectedSkill.healCharge+")").css("color", selectedSkill.color).appendTo("#battle-log");
			}
		}
		// Deducts mana
		if(selectedSkill.manaUsage != undefined){
			thePlayer.stats.mana.currentMana -= selectedSkill.manaUsage;
			thePlayer.stats.mana.usedMana = true;
		}
		
		// Gives cooldown to skill
		selectedSkill.currentCooldown += selectedSkill.cooldownAfterUse;
		// Dimishing cooldowns
		CDdiminish();
		
	} else {
		$("<p>").text("Not enough mana: You tried to use "+selectedSkill.name+", but only sparkles comes out...").css("color", "grey").appendTo("#battle-log");
	}
	
	// Sets HP & MP
	SetHPAndMP();
}

