const swosRangeRB = require('./swos-rangeRBLB.json');
const swosRangeLB = swosRangeRB ;
const swosRangeRW = require('./swos-rangeRWLW.json');
const swosRangeLW = swosRangeRW ; 
const swosRangeA = require('./swos-rangeA.json');
const swosRangeD = require('./swos-rangeD.json');
const swosRangeM = require('./swos-rangeM.json');
const swosRangeGK = require('./swos-rangeGK.json');
var _ = require("underscore");
const constants = require('./constants.js');


function sortPlayersSwosStyle3(players, formation) {


	let clubFormation = constants.formationCodeMap[formation];
	if (!clubFormation) {
	
		clubFormation = "4-4-2";
	}


	let stringArray = clubFormation.split("-"); 


	let dNumber = parseInt(stringArray[0], 10);
	let mNumber = parseInt(stringArray[1], 10);
	let aNumber = parseInt(stringArray[2], 10);

	let goalkeepers = players.filter(p => p.position === 'Goalkeeper'); 
	let rightBacks = players.filter(p => p.position === 'Right-Back'); 
	let defenders = players.filter(p => p.position === 'Centre-Back'); 
	let leftBacks = players.filter(p => p.position === 'Left-Back'); 
	let firstM ; 
	let firstA; 
	let firstLW; 
	let firstRW; 

	let attackers; 
	let rightWings ; 
	let leftWings ; 
	let midfielders ; 
	

	if (aNumber == 3) {

		 attackers = players.filter(p => ((p.position === 'Centre-Forward') || (p.position === 'Second Striker'))); 

		 rightWings = players.filter(p => ((p.position === 'Right Winger') ));
		 leftWings = players.filter(p => ((p.position === 'Left Winger') ));

		let attackingMidfielders = players.filter(p => ((p.position === 'Attacking Midfield'))); 
		
		let secondaryAttackers ; 
		if (rightWings.length > 0) {
			secondaryAttackers = rightWings.slice(0,1); 
		}
		if (leftWings.length > 0) {
			secondaryAttackers = secondaryAttackers.concat(leftWings.slice(0,1)); 
		}

		if(attackingMidfielders.length > 0) {
			secondaryAttackers = secondaryAttackers.concat(attackingMidfielders.slice(0,1)); 
		}
		
		for (const secondary of secondaryAttackers) {
			secondary.position = "Centre-Forward" ; 
		}

		firstA = attackers[0] ;


		let attackersFirst = attackers.slice(0,1)
		let attackersRest = attackers.slice(1).concat(secondaryAttackers); 
		attackersRest.sort((a, b) => b.valueStripped - a.valueStripped);
		attackers = attackersFirst.concat(attackersRest); 

		if (rightWings.length > 1) {
			rightWings = rightWings.slice(1,2); 
		} else { 
			rightWings = players.filter(p =>  p.position === 'Right Midfield'); 
		}
		if (leftWings.length > 1) {
			leftWings = leftWings.slice(1,2); 
		} else {

			leftWings = players.filter(p => p.position === 'Left Midfield'); 
		}
		midfielders = players.filter(p => ((p.position === 'Central Midfield') || (p.position === 'Defensive Midfield') )); 

		

	} else {
		midfielders = players.filter(p => ((p.position === 'Central Midfield') || (p.position === 'Defensive Midfield') ||
		(p.position === 'Attacking Midfield') || (p.position === 'Right Midfield') || (p.position === 'Left Midfield'))); 

		attackers = players.filter(p => ((p.position === 'Centre-Forward') || (p.position === 'Second Striker'))); 
		leftWings = players.filter(p => p.position === 'Left Winger'); 
		rightWings = players.filter(p => p.position === 'Right Winger'); 

		firstA = attackers[0] ;
	}

	firstM = midfielders[0]; 
	firstM.index = 8 ; 
	
	firstA.index = 11 ;

	let midfieldersCounter = 1
	let attackersCounter = 1;  
		
	if(rightWings.length == 0 ) {
			
		firstRW = midfielders[midfieldersCounter++]; 
		
		//midfielders = midfielders.slice(midfieldersCounter); 

	} else {
		firstRW = rightWings[0] ; 
		
	}
	firstRW.index = 6 
	firstRW.position = 'Right Winger' ; 

	if (!Array.isArray(leftWings) || !leftWings.length) {
		
		firstLW = midfielders[midfieldersCounter++];
		
		if (!firstLW) {
			firstLW = attackers[attackersCounter++] ;
			//attackers = attackers.slice(attackersCounter);  
			// console.log(leftWings);
		}
	} else {
		firstLW = leftWings[0] ; 
	
	
	}

	firstLW.position = 'Left Winger'; 
	firstLW.index = 9 ;

	 
	/*for (const player of players) {
		console.log(player.index); 
	}*/


	// 1 GK
	// 2 RB
	// 3 D
	// 5 LB
	// 6 RW
	// 8 M 
	// 9 LW
	// 11 A
	// ------------------------------
	// 12 GK 
	
	
	let firstGK = goalkeepers[0] 
	firstGK.index =1 ; 
	
	let secondGK; 

	if (goalkeepers.length < 2 ) {
		console.log("Warning this team has only 1 goalkeeper") ; 
		console.log("Same goalkeeper will be assigned for reserve") ; 
		secondGK = goalkeepers[0]; 
	} else {
	  secondGK  = goalkeepers[1];
	}
	secondGK.index = 12 ; 



	
	let firstRB = rightBacks[0];
	
	

	
	let firstD = defenders[0];
	firstD.index = 3 ; 

	
	let firstLB = leftBacks[0]; 
	firstLB.index = 5 ; 

	if (!firstRB){ 
		firstRB = leftBacks[1] ; 
		firstRB.index = 2 ;
	}
	 

	let noOfD = 1 ; 
	
	//let noOfDF = 0 ; 

	let position4 ; 
	if (dNumber == 3 ) {
		position4 = midfielders[midfieldersCounter++]; 
		
		
	} else {
		position4 = defenders[noOfD];
		noOfD++ 
	
	}
	
	position4.index = 4; 

	//let first5 = firstGK.concat(firstRB.concat(firstD.concat(position4.concat(firstLB))));

   let position7 ; 
   if (mNumber == 3) {
	   if (dNumber == 5) {
		   position7 = defenders[noOfD];
		   noOfD++
	   } else {
			position7 = attackers[attackersCounter++];
			
	   }
   } else  {
	   position7= midfielders[midfieldersCounter++]; 
	 
   }
   //console.log(position7);
   position7.index = 7 ; 

   //let middle4 = firstRW.concat(position7.concat(firstM.concat(firstLW)));

   let position10 ; 
   if (aNumber == 1) {
	position10 = midfielders[midfieldersCounter++]; 
	
   } else {
	position10 = attackers[attackersCounter++];
	
   } 
   position10.index = 10 ; 

   //let last2 = position10.concat(firstA);

   let position13 = defenders[noOfD];
   noOfD++; 
   if (!position13) {
	console.log("position 13 is empty") ; 
		if (rightBacks.length > 1 ) {
			position13=rightBacks[1]; 
			position13.index = 13 ; 
		} else {
			if (leftBacks.length > 1) {
				position13 = leftBacks[1];
				position13.index = 13; 
			}
					
		}
	} else {
		position13.index = 13; 
	}


   let position14 = midfielders[midfieldersCounter++];  
   
   if (!position14) {
	console.log("position 14 is empty") ; 
	} else {
   position14.index = 14; 
	}
  
   let position16 = attackers[attackersCounter++];
  
   if (!position16) {
	position16 = midfielders[midfieldersCounter++];  
	if (!position16) {
		position16 = defenders[noOfD]; 
		noOfD++; 
	}
	} 
	position16.index = 16;
   let position15; 
   if (dNumber == 5) {
	   position15 = defenders[noOfD]; 
   } else if (mNumber == 5) {
	   position15 = midfielders[midfieldersCounter++];  
   } else if (aNumber !=1) {
	   position15= attackers[attackersCounter++];
   }

   if (!position15){
		position15 = midfielders[midfieldersCounter++];
		if (!position15 ) {
			position15 = attackers[attackersCounter++];
		}
		
   }
   
  
   position15.index = 15 ; 
   

   
  // let orderedTeam = firstGK.concat(firstRB.concat(firstD.concat(position4.concat(firstLB.concat(firstRW.concat(position7.concat(firstM.concat(firstLW.concat(position10.concat(firstA.concat(secondGK.concat(position13.concat(position14.concat(position15.concat(position16))))))))))))))); 

  const orderedTeam = [firstGK, firstRB, firstD, position4,firstLB,firstRW,position7,firstM,firstLW,position10,firstA,secondGK,position13,position14,position15,position16];
   if (orderedTeam.length< 16) {
	   console.log("this team has less then 16 players") ; 
	   
	   
   }
   //console.log(orderedTeam) ; 
   return orderedTeam ; 
}




function randomizeSkills (desiredSUM , res , RANGE) {
	//swos skills  P,V,H,T,C,S,F  
	
	const rand = (min, max) => {
		return Math.floor(Math.random() * (max - min + 1) + min);
	};


	const remainder = () => desiredSUM - res.reduce((p, c) => c += p, 0);

	res.forEach((n, i) => {
		if (res[i]) return;
		const rem = remainder();
		const idx = i + 1;
		const remainingNumbers = res.length - i;

		let to = RANGE.to;
		let from = rem - (remainingNumbers - 1) * RANGE.to;
		if (from < RANGE.from) from = RANGE.from;
		if (rem < to) to = rem;

		res[i] = rand(from, to);
	});

	return res; 

} 

function calculateSkills (desiredSUM , position) {

    let P = 0; 
    let V = 0 ; 
    let H = 0  ; 
    let T = 0; 
    let C = 0; 
    let S = 0 ; 
    let F = 0 ; 

    //let res = [P,V,H,T,C,S,F];

    let res; 
    let minRange = 0 ; 
    let maxRange = 7 ; 

    if (desiredSUM <= 14) {
        minRange = 0 ; 
        maxRange = 3 ; 
    }

    if (desiredSUM < 25 && desiredSUM > 14) {
        minRange = 1 ; 
        maxRange = 5 ; 
    }

    if (desiredSUM < 34 && desiredSUM >= 25) {
        minRange = 2 ; 
        maxRange = 6 ; 
    }

if (desiredSUM > 33) {
    minRange = 3 ; 
} 


const RANGE = { from: minRange, to: maxRange };

let sortedSkillsArray = [0,0,0,0,0,0,0] ; 
sortedSkillsArray = randomizeSkills(desiredSUM , sortedSkillsArray , RANGE)
sortedSkillsArray.sort(function(a, b){return b-a});


if (position === 'Attacking Midfield') {
    P = sortedSkillsArray[0] ; 
    C = sortedSkillsArray[1] ; 

    let secundaryCharArray = sortedSkillsArray.slice(2,5); 
     
    secundaryCharArray = _.shuffle(secundaryCharArray); 

    V = secundaryCharArray[0] ; 
     
    F = secundaryCharArray[1] ;  
	T = secundaryCharArray[2] ; 
	S = sortedSkillsArray[5] ;
    H = sortedSkillsArray[6] ; 
} else if (position === 'Defensive Midfield') {
    T = sortedSkillsArray[0] ; 
    H = sortedSkillsArray[1] ; 
	
    let secundaryCharArray = sortedSkillsArray.slice(3,5); 
     
    secundaryCharArray = _.shuffle(secundaryCharArray); 

	P = secundaryCharArray[2] ; ; 
    V = secundaryCharArray[0] ; 
   
    C = secundaryCharArray[1] ;  

	S = sortedSkillsArray[5] ;
    F = sortedSkillsArray[6] ; 
} 
else if (constants.positionCodeMap[position] === 'M') {
    P = sortedSkillsArray[0] ; 
    T = sortedSkillsArray[1] ; 
    
    let secundaryCharArray = sortedSkillsArray.slice(2,6); 
    
    secundaryCharArray = _.shuffle(secundaryCharArray); 

    V = secundaryCharArray[0] ; 
    S = secundaryCharArray[1] ; 
    C = secundaryCharArray[2] ; 
    H = secundaryCharArray[3] ; 
    F = sortedSkillsArray[6] ; 
} else if (constants.positionCodeMap[position] === 'A') {
    F = sortedSkillsArray[0] ; 
    H = sortedSkillsArray[1] ; 
    
    let secundaryCharArray = sortedSkillsArray.slice(2,4); 
    
    secundaryCharArray = _.shuffle(secundaryCharArray); 

    V = secundaryCharArray[0] ; 
    S = secundaryCharArray[1] ; 
    C = sortedSkillsArray[4] ; 
    P = sortedSkillsArray[5] ; 
    T = sortedSkillsArray[6] ; 
}else if (constants.positionCodeMap[position] === 'D') {
    T = sortedSkillsArray[0] ; 
    H = sortedSkillsArray[1] ; 
    let secundaryCharArray = sortedSkillsArray.slice(2,4); 
    
    secundaryCharArray = _.shuffle(secundaryCharArray); 

    P = secundaryCharArray[0] ; 
    S = secundaryCharArray[1] ; 
    
    C = sortedSkillsArray[4] ; 
    V = sortedSkillsArray[5] ; 
    F = sortedSkillsArray[6] ; 
} else if ( (constants.positionCodeMap[position] === 'LB') || ((constants.positionCodeMap[position] === 'RB')) ){
    T = sortedSkillsArray[0] ; 
    S = sortedSkillsArray[1] ; 
    let secundaryCharArray = sortedSkillsArray.slice(2,5); 
    
    secundaryCharArray = _.shuffle(secundaryCharArray); 

    P = secundaryCharArray[0] ; 
    C = secundaryCharArray[1] ; 
    
    V = secundaryCharArray[2] ; 
    H = sortedSkillsArray[5] ; 
    F = sortedSkillsArray[6] ; 
} else if ( (constants.positionCodeMap[position] === 'LW') || ((constants.positionCodeMap[position] === 'RW')) ){
    S = sortedSkillsArray[0] ; 
    C = sortedSkillsArray[1] ; 
    let secundaryCharArray = sortedSkillsArray.slice(2,6); 
    
    secundaryCharArray = _.shuffle(secundaryCharArray); 

    F = secundaryCharArray[0] ; 
    V = secundaryCharArray[1] ; 
    
    T = secundaryCharArray[2] ; 
    P = secundaryCharArray[3] ; 
    H = sortedSkillsArray[6] ; 
}

res = [P,V,H,T,C,S,F] ; 
    


    return res; 

}

function ageRelatedIncrement(player) {
	const age =  parseInt(player.age) ; 

	
	if ((age) < 31 ){ 
		player.valueStripped = player.valueStripped * 1 ; 
	} else if ((age) < 32) {
		player.valueStripped = player.valueStripped * 1.25 ; 
	} else if ((age) < 35) {
		player.valueStripped = player.valueStripped * 1.5 ; 
	} else if ((age) < 38) {
		player.valueStripped = player.valueStripped * 2 ; 
	} else if ((age) < 40) {
		player.valueStripped = player.valueStripped * 2.5 ; 
	} else {
		player.valueStripped = player.valueStripped * 3 ; 
	}
	
}

function getTheSwosValue(player) {
	const positionPrefix = constants.positionCodeMap[player.position] ; 
	
	//ageRelatedIncrement(player) ; 
	switch (positionPrefix) {
		case 'GK':
		return getValueFromFile(swosRangeGK, player.valueStripped)
		case 'RB': 
		return getValueFromFile(swosRangeRB , player.valueStripped)
		case 'D': 
		return getValueFromFile(swosRangeD, player.valueStripped)
		case 'LB': 
		return getValueFromFile(swosRangeLB , player.valueStripped)
		case 'M': 
		return getValueFromFile(swosRangeM, player.valueStripped)
		case 'RW': 
		return getValueFromFile(swosRangeRW, player.valueStripped)
		case 'LW': 
		return getValueFromFile(swosRangeLW, player.valueStripped)
		case 'A': 
		return getValueFromFile(swosRangeA, player.valueStripped)
		
		default:
			var swosResult = {};
			swosResult.swosValue = '25K';
			swosResult.desiredSum = 0 ; 
			return swosResult ; 
		  
	}
	
}

function getValueFromFile (fileName , valueStripped) {
	
	
	var swosResult = {};

	
		for (let i = 0; i < fileName.length; i++) {
			if (valueStripped >= fileName[i].minValue && valueStripped < fileName[i].maxValue) {
				
				swosResult.swosValue = fileName[i].swosValue;
				swosResult.desiredSum = fileName[i].desiredSum ; 
				return swosResult;
			}
		}
	
	
			swosResult.swosValue = '25K';
			swosResult.desiredSum = 0 ; 
			return swosResult ; 
}

function checkForOverpoveredTeams(teamStats , clubName) {
    // 	555 max points per team , 82 max speed , max 7 players with 5 stars 
        if (teamStats.teamSum > 555) {
            console.log(`Stats for ${clubName} : team sum is bigger then 555 , it is ${teamStats.teamSum}`) ; 
        }
        if (teamStats.teamSpeed > 82) {
            console.log(`Stats for ${clubName} : team speed is bigger then 82 , it is ${teamStats.teamSpeed}`) ; 
        } 
        if (teamStats.fiveStarPlayersNo > 7) {
            console.log(`Stats for ${clubName} : five star players No is bigger than 7 , it is ${teamStats.fiveStarPlayersNo}`) ; 
        }
    }



module.exports = {
	sortPlayersSwosStyle3, 
    calculateSkills , 
    checkForOverpoveredTeams , 
    getTheSwosValue
	
};