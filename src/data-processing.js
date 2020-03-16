const swosRangeRB = require('./swos-rangeRBLB.json');
const swosRangeLB = swosRangeRB ;
const swosRangeRW = require('./swos-rangeRWLW.json');
const swosRangeLW = swosRangeRW ; 
const swosRangeA = require('./swos-rangeA.json');
const swosRangeD = require('./swos-rangeD.json');
const swosRangeM = require('./swos-rangeM.json');
const swosRangeGK = require('./swos-rangeGK.json');
var _ = require("underscore");

const formationCodeMap = {
	'4-2-3-1': '4-5-1',
	'3-5-2 flat': '3-5-2',
	'4-3-3 off.': '4-3-3',
	'4-3-3 Attacking': '4-3-3',
	'5-3-2': '5-3-2',
	'4-1-3-2': '4-4-2',
	'4-3-2-1': '4-5-1',
	'4-3-1-2': '4-4-2',
	'4-4-2 double 6': '4-4-2',
	'3-4-2-1': '3-4-3',
	'4-1-4-1': '5-4-1',
	'4-4-1-1': '4-4-2',
	'3-5-2': '3-5-2',
	'3-4-1-2': '3-4-3',
	'4-4-2': '4-4-2',
	'3-4-3': '3-4-3',
	'5-4-1': '5-4-1',
	'5-4-1 Diamond': '5-4-1',
	'4-5-1 flat': '4-5-1', 
	'3-5-2 Attacking':'3-5-2', 
	'4-4-2 Diamond': '4-4-2' , 
	'3-4-3 Diamond': '3-4-3' ,
	'4-3-3 Defending' : '4-5-1' 


};

const positionCodeMap = {
	'Goalkeeper': 'GK',
	'Right-Back': 'RB',
	'Centre-Back': 'D',
	'Left-Back': 'LB',
	'Right Winger': 'RW',
	'Left Winger': 'LW',
	'Central Midfield': 'M',
	'Left Midfield': 'M',
	'Right Midfield': 'M',
	'Defensive Midfield': 'M',
	'Attacking Midfield': 'M',
	'Centre-Forward': 'A',
	'Second Striker': 'A',
};

function sortPlayersSwosStyle3(players, formation) {


	let clubFormation = formationCodeMap[formation];
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

		 attackers = players.filter(p => ((p.position === 'Attacking Midfield') || (p.position === 'Left Winger') || (p.position === 'Right Winger') 
					||(p.position === 'Centre-Forward') || (p.position === 'Second Striker'))); 

		rightWings = players.filter(p =>  p.position === 'Right Midfield'); 
		
		leftWings = players.filter(p => p.position === 'Left Midfield'); 

		midfielders = players.filter(p => ((p.position === 'Central Midfield') || (p.position === 'Defensive Midfield') )); 

		

	} else {
		midfielders = players.filter(p => ((p.position === 'Central Midfield') || (p.position === 'Defensive Midfield') ||
		(p.position === 'Attacking Midfield') || (p.position === 'Right Midfield') || (p.position === 'Left Midfield'))); 

		attackers = players.filter(p => ((p.position === 'Centre-Forward') || (p.position === 'Second Striker'))); 
		leftWings = players.filter(p => p.position === 'Left Winger'); 
		rightWings = players.filter(p => p.position === 'Right Winger'); 


	}

	firstM = midfielders[0]; 
	firstM.index = 8 ; 
	firstA = attackers[0] ;
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
	

	let secondGK  = goalkeepers[1];
	secondGK.index = 12 ; 



	
	let firstRB = rightBacks[0];
	firstRB.index = 2 ; 
	

	
	let firstD = defenders[0];
	firstD.index = 3 ; 

	
	let firstLB = leftBacks[0]; 
	firstLB.index = 5 ; 

	
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
	position15 = midfielders[midfieldersCounter++];  
	
	} else {
   	position16.index = 16; 
	}
  
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


function sortPlayersSwosStyle2(players, formation) {


	let clubFormation = formationCodeMap[formation];
	if (!clubFormation) {
	
		clubFormation = "4-4-2";
	}

	if (clubFormation === "3-4-3") {
		clubFormation = "4-5-1" ; 
	}

	let stringArray = clubFormation.split("-"); 


	let dNumber = parseInt(stringArray[0], 10);
	let mNumber = parseInt(stringArray[1], 10);
	let aNumber = parseInt(stringArray[2], 10);

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
	let goalkeepers = players.filter(p => p.position === 'Goalkeeper'); 
	
	let firstGK = goalkeepers[0] 
	firstGK.index =1 ; 
	

	let secondGK  = goalkeepers[1];
	secondGK.index = 12 ; 



	let rightBacks = players.filter(p => p.position === 'Right-Back'); 
	let firstRB = rightBacks[0];
	firstRB.index = 2 ; 
	

	let defenders = players.filter(p => p.position === 'Centre-Back'); 
	let firstD = defenders[0];
	firstD.index = 3 ; 

	let leftBacks = players.filter(p => p.position === 'Left-Back'); 
	let firstLB = leftBacks[0]; 
	firstLB.index = 5 ; 

	let rightWings = players.filter(p => p.position === 'Right Winger'); 
	let firstRW = rightWings[0] ; 
	firstRW.index = 6 ; 

	//let defMidfielders = players.filter(p => p.position === 'Defensive Midfield'); 
	

	let midfielders = players.filter(p => ((p.position === 'Central Midfield') || (p.position === 'Defensive Midfield') ||
		(p.position === 'Attacking Midfield') || (p.position === 'Right Midfield') || (p.position === 'Left Midfield'))); 
	let firstM = midfielders[0]; 
	firstM.index = 8 ; 

	let leftWings = players.filter(p => p.position === 'Left Winger'); 
	let firstLW = leftWings[0] ; 
	if (!firstLW) {
		firstLW = rightWings[1] ;

	}
	firstLW.index = 9 ; 

	let attackers = players.filter(p => ((p.position === 'Centre-Forward') || (p.position === 'Second Striker'))); 
	let firstA = attackers[0] ;
	firstA.index = 11 ; 

	let noOfM = 1 ; 
	let noOfD = 1 ; 
	let noOfA = 1 ; 
	//let noOfDF = 0 ; 

	let position4 ; 
	if (dNumber == 3 ) {
		position4 = midfielders[noOfM]; 
		noOfM++ ; 
		
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
			position7 = attackers[noOfA];
			noOfA++; 
	   }
   } else  {
	   position7= midfielders[noOfM]; 
	   noOfM++; 
   }
   //console.log(position7);
   position7.index = 7 ; 

   //let middle4 = firstRW.concat(position7.concat(firstM.concat(firstLW)));

   let position10 ; 
   if (aNumber == 1) {
	position10 = midfielders[noOfM]; 
	noOfM++; 
   } else {
	position10 = attackers[noOfA];
	noOfA++ ; 
   } 
   position10.index = 10 ; 

   //let last2 = position10.concat(firstA);

   let position13 = defenders[noOfD];
   noOfD++; 
   if (!position13) {
	console.log("position 13 is empty") ; 
		} else {
		position13.index = 13; 
		}

   let position14 = midfielders[noOfM];  
   noOfM++; 
   if (!position14) {
	console.log("position 14 is empty") ; 
	} else {
   position14.index = 14; 
	}
  
   let position16 = attackers[noOfA];
   noOfA++
   if (!position16) {
	position15 = midfielders[noOfM];  
	noOfM++; 
	} else {
   	position16.index = 16; 
	}
  
   let position15; 
   if (dNumber == 5) {
	   position15 = defenders[noOfD]; 
   } else if (mNumber == 5) {
	   position15 = midfielders[noOfM];  
   } else if (aNumber !=1) {
	   position15= attackers[noOfA];
   }

   if (!position15){
		position15 = midfielders[noOfM];
		
   }
   if (!position15) {
	position15 = rightWings[1]; 
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




function sortPlayersSwosStyle(players) {


	let goalkeepers = players.filter(p => p.position === 'Goalkeeper');
	let gkIndex = 1;
	goalkeepers.forEach(gk => {                             // number goalkeepers: 1, 12,
		gk.index = gkIndex;
		gkIndex += 11;
	});
	let firstgoalkeeper = goalkeepers.slice(0, 1);
	let secondGoalkeeper = goalkeepers.slice(1, 2);
	let otherGoalkeepers = goalkeepers.slice(2,goalkeepers.length); 

	var positionPriority = [
		'Goalkeeper',
		'Right-Back',
		'Centre-Back',
		'Left-Back',
		'Right Winger',
		'Central Midfield',
		'Left Midfield',
		'Right Midfield',
		'Defensive Midfield',
		'Attacking Midfield',
		'Left Winger',
		'Second Striker',
		'Centre-Forward',
	]

	let firstTeam = players
		.filter(p => p.position !== 'Goalkeeper')   
		.slice(0, 10) ;                                       // pick first 10 for first team                              // add the 2 goalkeepers

	let reserveTeam = players
		.filter(p => p.position !== 'Goalkeeper')         // filter out GK
		.slice(10, 14);                                     // take 4 reserves                               // add the 2 goalkeepers



	firstTeam = firstTeam.sort(function (a, b) {
		return positionPriority.indexOf(a.position) - positionPriority.indexOf(b.position)
	});   // sort positions by predefine list 

	let idx = 2;
	firstTeam.forEach(player => {                             // give the numbers starting from 2
		if (player.index) return;							// don't number if GK is first
		player.index = idx;
		idx += 1;

	});

	reserveTeam = reserveTeam.sort(function (a, b) {
		return positionPriority.indexOf(a.position) - positionPriority.indexOf(b.position)
	});

	idx = 13;
	reserveTeam.forEach(player => {                             // number other players
		if (player.index) return;							// don't number if GK is first
		player.index = idx;
		idx += 1;

	});

	let restOfPlayers = players       
		.slice(15, players.length)
		.filter(p => p.position !== 'Goalkeeper') 
		

	let orderedTeam = firstgoalkeeper.concat(firstTeam.concat(secondGoalkeeper.concat(reserveTeam.concat(restOfPlayers.concat(otherGoalkeepers)))));

	//console.log(orderedTeam); 
	return orderedTeam;

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

let randomRes = [0,0,0,0,0,0,0] ; 
randomRes = randomizeSkills(desiredSUM , randomRes , RANGE)
randomRes.sort(function(a, b){return b-a});


if (position === 'Attacking Midfield') {
    P = randomRes[0] ; 
    C = randomRes[1] ; 

    let secundaryCharArray = randomRes.slice(2,6); 
     
    secundaryCharArray = _.shuffle(secundaryCharArray); 

    V = secundaryCharArray[0] ; 
    S = secundaryCharArray[1] ; 
    F = secundaryCharArray[2] ;  
    T = secundaryCharArray[3] ; 
    H = randomRes[6] ; 
} else if (position === 'Defensive Midfield') {
    T = randomRes[0] ; 
    H = randomRes[1] ; 
	
    let secundaryCharArray = randomRes.slice(3,6); 
     
    secundaryCharArray = _.shuffle(secundaryCharArray); 

	P = secundaryCharArray[3] ; ; 
    V = secundaryCharArray[0] ; 
    S = secundaryCharArray[1] ; 
    C = secundaryCharArray[2] ;  

    F = randomRes[6] ; 
} 
else if (positionCodeMap[position] === 'M') {
    P = randomRes[0] ; 
    T = randomRes[1] ; 
    
    let secundaryCharArray = randomRes.slice(2,6); 
    
    secundaryCharArray = _.shuffle(secundaryCharArray); 

    V = secundaryCharArray[0] ; 
    S = secundaryCharArray[1] ; 
    C = secundaryCharArray[2] ; 
    H = secundaryCharArray[3] ; 
    F = randomRes[6] ; 
} else if (positionCodeMap[position] === 'A') {
    F = randomRes[0] ; 
    H = randomRes[1] ; 
    
    let secundaryCharArray = randomRes.slice(2,4); 
    
    secundaryCharArray = _.shuffle(secundaryCharArray); 

    V = secundaryCharArray[0] ; 
    S = secundaryCharArray[1] ; 
    C = randomRes[4] ; 
    P = randomRes[5] ; 
    T = randomRes[6] ; 
}else if (positionCodeMap[position] === 'D') {
    T = randomRes[0] ; 
    H = randomRes[1] ; 
    let secundaryCharArray = randomRes.slice(2,4); 
    
    secundaryCharArray = _.shuffle(secundaryCharArray); 

    P = secundaryCharArray[0] ; 
    S = secundaryCharArray[1] ; 
    
    C = randomRes[4] ; 
    V = randomRes[5] ; 
    F = randomRes[6] ; 
} else if ( (positionCodeMap[position] === 'LB') || ((positionCodeMap[position] === 'RB')) ){
    T = randomRes[0] ; 
    S = randomRes[1] ; 
    let secundaryCharArray = randomRes.slice(2,5); 
    
    secundaryCharArray = _.shuffle(secundaryCharArray); 

    P = secundaryCharArray[0] ; 
    C = secundaryCharArray[1] ; 
    
    V = secundaryCharArray[2] ; 
    H = randomRes[5] ; 
    F = randomRes[6] ; 
} else if ( (positionCodeMap[position] === 'LW') || ((positionCodeMap[position] === 'RW')) ){
    S = randomRes[0] ; 
    C = randomRes[1] ; 
    let secundaryCharArray = randomRes.slice(2,6); 
    
    secundaryCharArray = _.shuffle(secundaryCharArray); 

    F = secundaryCharArray[0] ; 
    V = secundaryCharArray[1] ; 
    
    T = secundaryCharArray[2] ; 
    P = secundaryCharArray[3] ; 
    H = randomRes[6] ; 
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
	const positionPrefix = positionCodeMap[player.position] ; 
	
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
	sortPlayersSwosStyle , 
	sortPlayersSwosStyle2, 
	sortPlayersSwosStyle3, 
    calculateSkills , 
    checkForOverpoveredTeams , 
    getTheSwosValue
	
};