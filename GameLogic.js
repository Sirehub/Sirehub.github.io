"use strict";
function UpdateStats() {
	let yourCombatStat = Object.keys(thePlayer.stats.combat);
	let enemyCombatStat = Object.keys(currentEnemy.stats.combat);
	
	// Updates your stats
	$("#your--stats-container").empty();
	for(let i = 0; i < yourCombatStat.length; i++){
		// Capitalized First Letter Of The Stat
		let yourStatCapitalized = properCase(yourCombatStat[i]);
		// Makes new paragraph as "Stat: Number" and appends it to xxx--stats
		$("<p>").text(yourStatCapitalized+": "+thePlayer.stats.combat[yourCombatStat[i]]).appendTo("#your--stats-container");
	}
	
	
	// Updates enemy stats
	$("#enemy--stats-container").empty();
	for(let i = 0; i < enemyCombatStat.length; i++){
		// Capitalized First Letter Of The Stat
		let enemyStatCapitalized = properCase(enemyCombatStat[i]);
		// Makes new paragraph as "Stat: Number" and appends it to xxx--stats
		$("<p>").text(enemyStatCapitalized+": "+currentEnemy.stats.combat[enemyCombatStat[i]]).appendTo("#enemy--stats-container");
	}
}
function UpdateStatuses(){
	let statusType = ["increasingStatuses", "staticStatuses"];
	let color;
	
	$("#your--status-container").empty();
	$("#enemy--status-container").empty();
	
	for(let u = 0; u < statusType.length; u++){ // Loops through status types
		let yourElements = Object.keys(thePlayer[ statusType[u] ]);
		// Player Statuses
		for(let o = 0; o < yourElements.length; o++){ // Loops through elements
			// Get all debuffs of current element
			let yourElementalStatuses = Object.keys(thePlayer[ statusType[u] ][ yourElements[o] ]);  
			// Switch for color
			switch(yourElements[o]){
				case "fire":
					color = "hsl(0, 75%, 75%)";
					break;
				case "ice":
					color = "hsl(240, 75%, 75%)";
					break;
				case "lightning":
					color = "hsl(60, 75%, 75%)";
					break;
				default:
					color = "hsl(0, 0%, 100%)";
			}
			for(let i = 0; i < yourElementalStatuses.length; i++){ // Loops through statuses
				// Checks if current debuff is > 0, then append to status container
				if(thePlayer[ statusType[u] ][ yourElements[o] ][ yourElementalStatuses[i] ] > 0){
					//console.log(statusType[u]); console.log(yourElements[o]); console.log(yourElementalStatuses[i]);
					$("<p>").text(properCase(yourElementalStatuses[i])+": "+thePlayer[ statusType[u] ][ yourElements[o] ][ yourElementalStatuses[i] ]).css("color", color).appendTo("#your--status-container");
				}
			}
		}
		
		let enemyElements = Object.keys(currentEnemy[ statusType[u] ]);
		// Enemy Statuses  	
		for(let o = 0; o < enemyElements.length; o++){  
			// Get all debuffs of current element
			let enemyElementalStatuses = Object.keys(currentEnemy[ statusType[u] ][ enemyElements[o] ]);
			// Switch for color
			switch(enemyElements[o]){
				case "fire":
					color = "hsl(0, 75%, 75%)";
					break;
				case "ice":
					color = "hsl(240, 75%, 75%)";
					break;
				case "lightning":
					color = "hsl(60, 75%, 75%)";
					break;
				default:
					color = "hsl(0, 0%, 100%)";
			}
			for(let i = 0; i < enemyElementalStatuses.length; i++){
				// Checks if current debuff is > 0, then append to status container
				if(currentEnemy[ statusType[u] ][ enemyElements[o] ][ enemyElementalStatuses[i] ] > 0){
					$("<p>").text(properCase(enemyElementalStatuses[i])+": "+currentEnemy[ statusType[u] ][ enemyElements[o] ][ enemyElementalStatuses[i] ]).css("color", color).appendTo("#enemy--status-container");
				}
			}
		}
	}
}

function SetHPAndMP(){
	if(thePlayer.stats.health.currentHealth > thePlayer.stats.health.maxHealth){
		thePlayer.stats.health.currentHealth = thePlayer.stats.health.maxHealth;
	}
	$("#your--health").text(thePlayer.stats.health.currentHealth);
	$("#your--health-max").text(thePlayer.stats.health.maxHealth);
	$("#your--mana").text(thePlayer.stats.mana.currentMana);
	$("#your--mana-max").text(thePlayer.stats.mana.maxMana);
	
	if(currentEnemy.stats.health.currentHealth > currentEnemy.stats.health.maxHealth){
		currentEnemy.stats.health.currentHealth = currentEnemy.stats.health.maxHealth;
	}
	$("#enemy--health").text(currentEnemy.stats.health.currentHealth);
	$("#enemy--health-max").text(currentEnemy.stats.health.maxHealth);
	$("#enemy--mana").text(currentEnemy.stats.health.currentMana);
	$("#enemy--mana-max").text(currentEnemy.stats.health.maxMana);
}

function yourManaRegen() {
	let manaRegen = getRndInteger(1, 11) + Math.ceil(thePlayer.stats.mana.maxMana * (0.02 * (thePlayer.stats.mana.currentMana / thePlayer.stats.mana.maxMana)));
	if(thePlayer.stats.mana.currentMana + manaRegen > thePlayer.stats.mana.maxMana){
		thePlayer.stats.mana.currentMana = thePlayer.stats.mana.maxMana;
	} else {
		thePlayer.stats.mana.currentMana += manaRegen;
	}
	
	console.log("Mana Regen: "+manaRegen);
	SetHPAndMP();
}

function CDdiminish(){
	// Cooldown diminishing & disables if cooldown is on
	for(let i = 0; i < allYourSkills.length; i++){
		if(thePlayer.skills[allYourSkills[i]].currentCooldown > 0){
			$("#"+thePlayer.skills[allYourSkills[i]].id).addClass("disabled").attr('title', "Cooldown: "+thePlayer.skills[allYourSkills[i]].currentCooldown);
			thePlayer.skills[allYourSkills[i]].currentCooldown--;
		} else{
			$("#"+thePlayer.skills[allYourSkills[i]].id).removeClass("disabled").attr('title', "");
		}
	}
}

// /// // BOOLEANS // /// //
function hasStatuses(character){
	for(let i = 0; i < statusTypes.length; i++){
		for(let o = 0; o < statusElements.length; o++){
			let statuses = Object.keys( character[ statusTypes[i] ][ statusElements[o] ] );
			for(let u = 0; u < statuses.length; u++){
				if( character[ statusTypes[i] ][ statusElements[o] ][ statuses[u] ] > 0 ){
					return true;
				} else {
					return false;
				}
			}
		}
	}
}
function hasSummons(character){
	let summonedStuff = Object.keys(character["summons"]);
	for(let i = 0; i < summonedStuff.length; i++){
		if( character.summons[ summonedStuff[i] ] > 0 ){
			return true;
		} else {
			return false;
		}
	}
}
// Makes skill buttons [E]
{
	let yourSkill = Object.keys(thePlayer.skills);
	for(let i = 0; i < yourSkill.length; i++){
		$("<button>")
			.text(thePlayer.skills[yourSkill[i]].name)
			.attr("id", thePlayer.skills[yourSkill[i]].id)
			.addClass("your--skills")
			.addClass("all--skills")
			.addClass("action")
			.css("margin", "5px")
			.css("color", thePlayer.skills[yourSkill[i]].color)
			.appendTo("#your--skill-list");
	}
	
}
// Your status and statistic buttons
$("#your--status-button").on("click", function(){
	$("#your--stats").fadeOut();
	$("#your--status").fadeToggle();
});
$("#your--stats-button").on("click", function(){
	$("#your--status").fadeOut();
	$("#your--stats").fadeToggle();
});
// Enemy's status and statistic buttons
$("#enemy--status-button").on("click", function(){
	$("#enemy--stats").fadeOut();
	$("#enemy--status").fadeToggle();
});
$("#enemy--stats-button").on("click", function(){
	$("#enemy--status").fadeOut();
	$("#enemy--stats").fadeToggle();
});
// Fancy button animation on click
$(document).on("click", "button:not(.disabled)", function(){
	if($(this).hasClass("btnAnimated") == false){
		$(this).addClass("btnAnimated");
		setTimeout(() => { $(this).removeClass("btnAnimated"); }, 500);
	}
});
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

// Explanation: Poor man's js' "Wait()" function.  
// Usage: await delay(ms); in a async function(){}
const delay = ms => new Promise(res => setTimeout(res, ms));

// Explanation: Gets random integer between min and max number, inclusive.  
function getRndInteger(min, max) {
	return Math.floor(Math.random() * (max - min + 1) ) + min;
};

// Explanation: Turns string to proper case.  
function properCase(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

function separateCamelCase(string) {
	return string.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase(); });
	// insert a space before all caps
	// upercase the first character
}
