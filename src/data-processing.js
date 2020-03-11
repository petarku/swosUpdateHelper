const swosRangeRB = require('./swos-rangeRBLB.json');
const swosRangeLB = swosRangeRB ;
const swosRangeRW = require('./swos-rangeRWLW.json');
const swosRangeLW = swosRangeRW ; 
const swosRangeA = require('./swos-rangeA.json');
const swosRangeD = require('./swos-rangeD.json');
const swosRangeM = require('./swos-rangeM.json');
const swosRangeGK = require('./swos-rangeGK.json');
var _ = require("underscore");

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

function sortPlayersSwosStyle2(players, formation) {
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
	let firstGK = goalkeepers.slice(0,1) ; 
	firstGK.index = 1 ; 
	let secondGK  = goalkeepers.slice(1, 2);
	secondGK.index = 12 ; 

	

	let rightBacks = players.filter(p => p.position === 'Right-Back'); 
	let firstRB = rightBacks.slice(0,1) ; 
	firstRB.index = 2 ; 
	

	let defenders = players.filter(p => p.position === 'Centre-Back'); 
	let firstD = defenders.slice(0,1) 
	firstD.index = 3 ; 

	let leftBacks = players.filter(p => p.position === 'Left-Back'); 
	let firstLB = leftBacks.slice(0,1) ; 
	firstLB.index = 5 ; 

	let rightWings = players.filter(p => p.position === 'Right Winger'); 
	let firstRW = rightWings.slice(0,1) ; 
	firstRW.index = 6 ; 

	let midfielders = players.filter(p => p.position === 'Central Midfield'); 
	let firstM = midfielders.slice(0,1) 
	firstM.index = 8 ; 

	let leftWings = players.filter(p => p.position === 'Left Winger'); 
	let firstLW = leftWings.slice(0,1) ; 
	firstLW.index = 9 ; 

	let attackers = players.filter(p => p.position === 'Centre-Forward'); 
	let firstA = attackers.slice(0,1) ; 
	firstA.index = 11 ; 

	let noOfM = 1 ; 
	let noOfD = 1 ; 
	let noOfA = 1 ; 

	let position4 ; 
	if (d-number === 3 ) {
		position4 = midfielders.slice(noOfM,noOfM+1); 
		noOfM++ ; 
		
	} else {
		position4 = defenders.slice(noOfD,noOfD+1); 
		noofD++ 
	
	}
	position4.index = 4; 
   let position7 ; 
   if (m-number === 3) {
	   if (d-number === 5) {
		   position7 = defenders.slice(noOfD,noOfD+1); 
		   noofD++
	   } else {
			position7 = attackers.slice(noOfA,noOfA+1) ;
			noOfA++; 
	   }
   } else  {
	   position7= midfielders.slice(noOfM,noOfM+1) ;
	   noOfM++; 
   }
   position7.index = 7 ; 

   let position10 ; 
   if (a-number === 1) {
	position10 = midfielders.slice(noOfM,noOfM+1)
	noOfM++; 
   } else {
	position10 = attackers.slice(noOfA,noOfA+1)
	noOfA++ ; 
   } 
   position10.index = 10 ; 

   let position13 = defenders.slice(noOfD,noOfD+1) ; 
   noofD++; 
   position13.index = 13; 

   let position14 = midfielders.slice(noOfM,noOfM+1); 
   noOfM++; 
   position14.index = 14; 

   let position16 = attackers.slice(noOfA, noOfA+1) ; 
   noOfA++
   position16.index = 16; 

   let position15; 
   if (d-position === 5) {
	   position15 = defenders.slice(noOfD,noOfD+1) ; 
   } else if (m-position === 5) {
	   position15 = midfielders.slice(noOfM,noOfM+1) ; 
   } else if (a-position !==1) {
	   position15= attackers.slice(noOfA,noOfA+1)
   }
   position15.index = 15; 


}

/*
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

}
*/
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
} else if (positionCodeMap[position] === 'M') {
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
	
	ageRelatedIncrement(player) ; 
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
    calculateSkills , 
    checkForOverpoveredTeams , 
    getTheSwosValue
	
};