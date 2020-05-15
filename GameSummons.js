"use strict";
function yourSummonsActivate(){
	let yourDamageOutput = [];
	let yourHealOutput = [];
	// Player Summons
	let summonedObject = Object.keys(thePlayer.summons);
	for(let i = 0; i < summonedObject.length; i++){ // Loops through every summon, put code inside loop
		let summoned = thePlayer.skills[ summonedObject[i] ];
		let summonCount = thePlayer.summons[ summonedObject[i] ]; // AKA summonLevel too
		
		// Checks if summon count is greater than 0 then -
		// Destroys summoned objects if below certain hp/mp threshold
		if(thePlayer.summons[ summonedObject[i] ] > 0 && summoned.sDeativateOnHP >= thePlayer.stats.health.currentHealth / thePlayer.stats.health.maxHealth){
			thePlayer.summons[ summonedObject[i] ] = 0;
			$("<p>").html("<strong> Your "+summoned.name+" went kaput! Health was too low to operate it!</strong>").css("color", "white").appendTo("#battle-log");
		}
		if(thePlayer.summons[ summonedObject[i] ] > 0 && summoned.sDeativateOnMP >= thePlayer.stats.mana.currentMana / thePlayer.stats.mana.maxMana){
			thePlayer.summons[ summonedObject[i] ] = 0;
			$("<p>").html("<strong> Your "+summoned.name+" went kaput! Mana was too low to operate it!</strong>").css("color", "white").appendTo("#battle-log");
		}
		
		// Tests if summon count is greater than 0 before launching summons' action
		if(thePlayer.summons[ summonedObject[i] ] > 0){ 
			let dmgTarget = summoned.sDamageTarget;
			let hlTarget = summoned.sHealTarget;
			
			// Applies special effect if it's set to apply on it's own
			if(summoned.sSpecial != undefined && summoned.sActivateSpecialOn == "own"){
				for(let o = 0; o < summonCount; o++){
					summoned.sSpecial();
				}
			}
			
			// SUMMON DAMAGE HANDLING //
			if(summoned.sDamageMin != undefined){
				// If damage charge doesn't exist or heal charge has not been met
				if(summoned.sDamageCharge == undefined || summoned.sDamageCharge <= summoned.sCurrentDamageCharge){
					// Damage message
					if(summoned.sDamageMessage != undefined){
						$("<p>").html("<strong>"+summoned.sDamageMessage+"</strong>").css("color", summoned.color).appendTo("#battle-log");
					}
					// Rolls damage for each hit
					for(let i = 0; i < summoned.sHits; i++){
						yourDamageOutput.push(getRndInteger(summoned.sDamageMin, summoned.sDamageMax) * summonCount);
					}
					// Applies damage reduction to each hit then apply hit to enemy
					for(let i = 0; i < yourDamageOutput.length; i++){
						yourDamageOutput[i] = Math.max(0, Math.ceil((yourDamageOutput[i] - (yourDamageOutput[i] * (dmgTarget.stats.combat.defence / 1000))) - (dmgTarget.stats.combat.defence / 10)));
						dmgTarget.stats.health.currentHealth -= yourDamageOutput[i];
						
						// Logs in Battle Log each hit's damage and element.
						if(dmgTarget == thePlayer){
							$("<p>").text("- Damaged you for "+yourDamageOutput[i]+" '"+summoned.element+"' damage").css("color", summoned.color).appendTo("#battle-log");
						} else if (dmgTarget == currentEnemy) {
							$("<p>").text("- Damaged the opponent for  "+yourDamageOutput[i]+" '"+summoned.element+"' damage").css("color", summoned.color).appendTo("#battle-log");
						} else {
							$("<p>").text("How did you even get this placeholder message?").css("color", "white").appendTo("#battle-log");
						}
					}
					// Applies special effect if it's set to apply on damage
					if(summoned.sSpecial != undefined && summoned.sActivateSpecialOn == "damage"){
						for(let o = 0; o < summonCount; o++){
							summoned.sSpecial();
						}
					}
					// Resets heal charge
					if(summoned.sDamageCharge != undefined){
						summoned.sCurrentDamageCharge = 0;
					}
				} else {
					summoned.sCurrentDamageCharge++;
					$("<p>").html("<strong>"+summoned.sDamageChargeMessage+"</strong>").css("color", summoned.color).appendTo("#battle-log");
					$("<p>").text("- "+summoned.name+"'s heal is charging... ("+summoned.sCurrentDamageCharge+"/"+summoned.sDamageCharge+")").css("color", summoned.color).appendTo("#battle-log");
				}
			}
			// SUMMON HEAL HANDLING //
			if(summoned.sHealMin != undefined){
				// If heal charge doesn't exist or heal charge has not been met
				if(summoned.sHealCharge == undefined || summoned.sHealCharge <= summoned.sCurrentHealCharge){
					// Heal message
					if(summoned.sHealMessage != undefined){
						$("<p>").html("<strong>"+summoned.sHealMessage+"</strong>").css("color", summoned.color).appendTo("#battle-log");
					}
					// Rolls heal for each hit
					for(let i = 0; i < summoned.sHits; i++){
						yourHealOutput.push(getRndInteger(summoned.sHealMin, summoned.sHealMax) * summonCount);
					}
					// Applies heal reduction to each hit then apply hit to enemy
					for(let i = 0; i < yourHealOutput.length; i++){
						hlTarget.stats.health.currentHealth += yourHealOutput[i];
						
						// Logs in Battle Log each hit's damage and element.
						if(hlTarget == thePlayer){
							$("<p>").text("- Healed you for "+yourHealOutput[i]+" '"+summoned.element+"' health").css("color", summoned.color).appendTo("#battle-log");
						} else if (hlTarget == currentEnemy) {
							$("<p>").text("- Healed the opponent for "+yourHealOutput[i]+" '"+summoned.element+"' health").css("color", summoned.color).appendTo("#battle-log");
						} else {
							$("<p>").text("How did you even get this placeholder message?").css("color", "white").appendTo("#battle-log");
						}
					}
					// Applies special effect if it's set to apply on heal
					if(summoned.sSpecial != undefined && summoned.sActivateSpecialOn == "heal"){
						for(let o = 0; o < summonCount; o++){
							summoned.sSpecial();
						}
					}
					// Resets heal charge
					if(summoned.sHealCharge != undefined){
						summoned.sCurrentHealCharge = 0;
					}
				} else {
					summoned.sCurrentHealCharge++;
					$("<p>").html("<strong>"+summoned.sHealChargeMessage+"</strong>").css("color", summoned.color).appendTo("#battle-log");
					$("<p>").text("- "+summoned.name+"'s heal is charging... ("+summoned.sCurrentHealCharge+"/"+summoned.sHealCharge+")").css("color", summoned.color).appendTo("#battle-log");
				}
			}
			console.log(thePlayer.skills[ summonedObject[i] ].name);
		}
	}
}
