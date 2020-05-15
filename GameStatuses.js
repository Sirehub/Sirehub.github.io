"use strict";
/* [E] */
function statusesActivate(){
	// Gets all elements in statuses object
	let statusElement = Object.keys(statuses);
	for(let i = 0; i < statusElement.length; i++){ // Loops through elements here
		// Gets all statuses from current element object in statuses
		let status = Object.keys(statuses[ statusElement[i] ]);
		for(let o = 0; o < status.length; o++){ // Loops through statuses here
			// Finally activates the function
			statuses[ statusElement[i] ][ status[o] ]();
		}
	}
}
function increasingStatusesDiminish(){
	// Stores increasing status' elemental keys
	let yourIncElements = Object.keys(thePlayer.increasingStatuses);
	for(let i = 0; i < yourIncElements.length; i++){
		// Stores element's status keys
		let yourIncStatuses = Object.keys(thePlayer.increasingStatuses[ yourIncElements[i] ]);
		
		// Then loops through status keys and decreases them
		for(let o = 0; o < yourIncStatuses.length; o++){
			let yourIncStatus = thePlayer.increasingStatuses[ yourIncElements[i] ][ yourIncStatuses[o] ];
			
			if(yourIncStatus > 0){
				thePlayer.increasingStatuses[ yourIncElements[i] ][ yourIncStatuses[o] ] -= Math.max(1, Math.floor(yourIncStatus / 10));
				if(thePlayer.increasingStatuses[ yourIncElements[i] ][ yourIncStatuses[o] ] <= 0){
					$("<p>").text("Your "+yourIncStatuses[o]+" status has ran out!").css("color", "white").appendTo("#battle-log");
				}
			}
		}
	}

	let enemyIncElements = Object.keys(currentEnemy.increasingStatuses); 
	// enemyIncElements = [fire, ice, lightning];
	for(let i = 0; i < enemyIncElements.length; i++){ // fire run
		let enemyIncStatuses = Object.keys(currentEnemy.increasingStatuses[ enemyIncElements[i] ]);
		// currentEnemy.increasingStatuses.fire
		// enemyIncStatuses = [flickering, burning];
		
		for(let o = 0; o < enemyIncStatuses.length; o++){ // flickering run
			let enemyIncStatus = currentEnemy.increasingStatuses[ enemyIncElements[i] ][ enemyIncStatuses[o] ];
			// currentEnemy.increasingStatuses.fire.flickering
			// enemyIncStatus = currentEnemy.increasingStatuses.fire.flickering
			
			if(enemyIncStatus > 0){
				currentEnemy.increasingStatuses[ enemyIncElements[i] ][ enemyIncStatuses[o] ] -= Math.max(1, Math.floor(enemyIncStatus / 10));;
				if(currentEnemy.increasingStatuses[ enemyIncElements[i] ][ enemyIncStatuses[o] ] <= 0){
					$("<p>").text("The opponent's "+enemyIncStatuses[o]+" status has ran out!").css("color", "white").appendTo("#battle-log");
				}
			}
		}
	}
}
function staticStatusesDiminish(){
	// Stores static status' elemental keys
	let yourStcElements = Object.keys(thePlayer.staticStatuses);
	for(let i = 0; i < yourStcElements.length; i++){
		// Stores element's status keys
		let yourStcStatuses = Object.keys(thePlayer.staticStatuses[ yourStcElements[i] ]);
		
		// Then loops through status keys and decreases them
		for(let o = 0; o < yourStcStatuses.length; o++){
			if(thePlayer.staticStatuses[ yourStcElements[i] ][ yourStcStatuses[o] ] > 0){
				thePlayer.staticStatuses[ yourStcElements[i] ][ yourStcStatuses[o] ]--;
				if(thePlayer.staticStatuses[ yourStcElements[i] ][ yourStcStatuses[o] ] <= 0){
					$("<p>").text("Your "+yourStcStatuses[o]+" status has ran out!").css("color", "white").appendTo("#battle-log");
				}
			}
		}
	}
	
	// Stores static status' elemental keys
	let enemyStcElements = Object.keys(currentEnemy.staticStatuses);
	for(let i = 0; i < enemyStcElements.length; i++){
		// Stores element's status keys
		let enemyStcStatuses = Object.keys(currentEnemy.staticStatuses[ enemyStcElements[i] ]);
		
		// Then loops through status keys and decreases them
		for(let o = 0; o < enemyStcStatuses.length; o++){
			let enemyIncStatus = currentEnemy.staticStatuses[ enemyStcElements[i] ][ enemyStcStatuses[o] ];
			
			if(enemyIncStatus > 0){
				currentEnemy.staticStatuses[ enemyStcElements[i] ][ enemyStcStatuses[o] ]--;
				if(currentEnemy.staticStatuses[ enemyStcElements[i] ][ enemyStcStatuses[o] ] <= 0){
					$("<p>").text("The opponent's "+enemyStcStatuses[o]+" status has ran out!").css("color", "white").appendTo("#battle-log");
				}
			}
		}
	}
}
// STATUSES OBJECT - ALL STATUSES MUST BE ADDED HERE /* [E] */
let statuses = {
	//** FIRE **//
	fire : {
		/* FLICKERING */
		flickering : function(){
			let playerFlickering = thePlayer.increasingStatuses.fire.flickering;
			let enemyFlickering = currentEnemy.increasingStatuses.fire.flickering;

			// Deals flickering * 2 damage to user
			if(playerFlickering > 0){
				thePlayer.stats.health.currentHealth -= (playerFlickering * 2);
				$("<p>").text("You flickered for "+playerFlickering*2+" damage.").css("color", "hsl(30, 75%, 75%)").appendTo("#battle-log");
			}
			if(enemyFlickering > 0){
				currentEnemy.stats.health.currentHealth -= (enemyFlickering * 2);
				$("<p>").text("The opponent flickered for "+enemyFlickering*2+" damage.").css("color", "hsl(30, 75%, 75%)").appendTo("#battle-log");
			}
		},
		/* BURNING */
		burning : function(){
			let playerBurning = thePlayer.increasingStatuses.fire.burning;
			let enemyBurning = currentEnemy.increasingStatuses.fire.burning;

			// Deals burning * 3 damage to user
			if(playerBurning > 0){
				thePlayer.stats.health.currentHealth -= (playerBurning * 3);
				$("<p>").text("You burned for "+playerBurning*3+" damage.").css("color", "hsl(30, 75%, 75%)").appendTo("#battle-log");
			}
			if(enemyBurning > 0){
				currentEnemy.stats.health.currentHealth -= (enemyBurning * 3);
				$("<p>").text("The opponent burned for "+enemyBurning*3+" damage.").css("color", "hsl(30, 75%, 75%)").appendTo("#battle-log");
			}
		}
	},
	//** ICE **//
	ice : {
		/* COLD */
		cold : function(){
			// Makes new property to keep track of cold debuff
			if(thePlayer.other.hasOwnProperty("hasCold") == false ){ thePlayer.other.hasCold = false }
			if(currentEnemy.other.hasOwnProperty("hasCold") == false ){ currentEnemy.other.hasCold = false }
			
			let playerCold = thePlayer.staticStatuses.ice.cold;  
			let enemyCold = currentEnemy.staticStatuses.ice.cold;

			// Applies small temporary defence reductions
			if(playerCold > 0 && thePlayer.other.hasCold == false){
				thePlayer.stats.mod.defence -= 10;
				thePlayer.other.hasCold = true;
			} else if(playerCold <= 0 && thePlayer.other.hasCold == true){
				thePlayer.stats.mod.defence += 10;
				thePlayer.other.hasCold = false;
			}
			if(enemyCold > 0 && currentEnemy.other.hasCold == false){
				currentEnemy.stats.mod.defence -= 10;
				currentEnemy.other.hasCold = true;
			} else if(enemyCold <= 0 && currentEnemy.other.hasCold == true){
				currentEnemy.stats.mod.defence += 10;
				currentEnemy.other.hasCold = false;
			}
		},
		/* FROSTED */
		frosted : function(){
			// Makes new property to keep track of frosted debuff
			if(thePlayer.other.hasOwnProperty("hasFrosted") == false ){ thePlayer.other.hasFrosted = false }
			if(currentEnemy.other.hasOwnProperty("hasFrosted") == false ){ currentEnemy.other.hasFrosted = false }
			
			let playerFrosted = thePlayer.staticStatuses.ice.frosted;  
			let enemyFrosted = currentEnemy.staticStatuses.ice.frosted;

			// Applies big temporary defence bonuses
			if(playerFrosted > 0 && thePlayer.other.hasFrosted == false){
				thePlayer.stats.mod.defence += 100;
				thePlayer.other.hasFrosted = true;
			} else if(playerFrosted <= 0 && thePlayer.other.hasFrosted == true){
				thePlayer.stats.mod.defence -= 100;
				thePlayer.other.hasFrosted = false;
			}
			if(enemyFrosted > 0 && currentEnemy.other.hasFrosted == false){
				currentEnemy.stats.mod.defence += 100;
				currentEnemy.other.hasFrosted = true;
			} else if(enemyFrosted <= 0 && currentEnemy.other.hasFrosted == true){
				currentEnemy.stats.mod.defence -= 100;
				currentEnemy.other.hasFrosted = false;
			}
		}
	},
	//** LIGHTNING **//
	lightning : {
		estimulated : function(){
			let playerEstim = thePlayer.staticStatuses.lightning.estimulated;  
			let enemyEstim = currentEnemy.staticStatuses.lightning.estimulated;
			let healthRegen = 20;
			let manaRegen = 15;

			// Applies small temporary defence reductions
			if(playerEstim > 0){
				thePlayer.stats.health.currentHealth += 20;
				thePlayer.stats.mana.currentMana += 15;
				$("<p>").text("You regenerated "+healthRegen+" health and "+manaRegen+" mana.").css("color", "hsl(60, 75%, 75%)").appendTo("#battle-log");
			}
			
			if(enemyEstim > 0){
				currentEnemy.stats.health.currentHealth += 20;
				currentEnemy.stats.mana.currentMana += 15;
				$("<p>").text("The opponent regenerated "+healthRegen+" health and "+manaRegen+" mana.").css("color", "hsl(60, 75%, 75%)").appendTo("#battle-log");
			}
		}
	}
}


