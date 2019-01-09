const fetch = require('node-fetch');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const swosRange = require('./swos-range.json');

async function parseFifaPlayerRow (row) {
	if (!row || !row.querySelector) return console.error('cannot find player row...');
	const name = row.querySelector('td[data-title="Name"]').textContent;
	//console.log(name) ; 
	const nationality = row.querySelector('td[data-title="Nationality"] > .link-nation').title;
	//console.log(nationality) ;  
	const overall = parseInt(row.querySelector('td[data-title="OVR / POT"] > span').textContent);
	//console.log(overall) ; 
	const preferedPositionsList = row.querySelectorAll('td[data-title="Preferred Positions"] > a > span');
	let positionList = new Array() 
	for (const rowPositions of preferedPositionsList) {
		positionList.push(rowPositions.textContent) ; 
	}
	//console.log(positionList) ; 
	return {name, nationality , overall , positionList} ; 

}

async function parseFifaTable (res) {
	const { document } = new JSDOM(res).window;
	let playersList = new Array()
	if (!document) return;
	const table = document.querySelector('.table-players');
	if(!table) {
		console.log("table doesnt exist") ; 
	} else {
		const rows = table.querySelectorAll('tbody tr'); 
		
		for (const row of rows) {
			let players = await parseFifaPlayerRow(row) ; 
			playersList.push(players);  
		}
	}
	//const promises = Array.from(rows).map(parsePlayerRow);
	//const coachName = document.querySelectorAll('.container-hauptinfo');
	//const coach = coachName[0].textContent.trim();
	//console.log(playersList) ; 

	return playersList;
	
}

async function getFifaPlayers (club) {
	console.log(`Getting players' details for ${club.name}...`); 

	return fetch(club.url) 
		.then(res => res.text())
		.then(parseFifaTable)
		.then(res => {
			/*club.url = club.url + ORDER_URL ;
			club.coach = res.coach;
			club.formation = res.formation;*/
			//club.players = res.players.sort((a, b) => b.timeInPlay - a.timeInPlay);
			res.sort((a, b) => b.overall - a.overall);
			club.players = res; 
			//console.log("club players " , club.players) ; 
			return club;
		});
}


module.exports = {
	getFifaPlayers
};