const fetch = require('node-fetch');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const dataProcessing = require('./data-processing.js');

const BASE_URL = 'https://www.transfermarkt.com';
//const BASE_URL = 'https://www.transfermarkt.co.uk';

const ORDER_URL = '/ajax/yw1/sort/marktwert.desc' ;


function convertStringValuetoNumber (original, strMillion, strThousands, currency) {
	original = original.replace(currency, '');
	const idx = original.indexOf(strMillion);

	if (idx != -1) {
		original = original.substr(0, idx).replace(',', '.');
		return parseFloat(original) * 1000000;
	}

	const idx2 = original.indexOf(strThousands);
	if (idx2 != -1) {
		original = original.substr(0, idx2).replace(',', '.');
		return parseFloat(original) * 1000;
	}

	return original;
}

async function parsePlayerRow (row) {
	if (!row || !row.querySelector) return console.error('cannot find player row...');
	const number = row.querySelector('.rn_nummer').innerHTML;
	const playerSubtable = row.querySelectorAll('.posrela table tbody tr');
	const playerLink = playerSubtable[0].querySelector('.hauptlink a');
	const name = playerLink.innerHTML;
	const url = BASE_URL + playerLink.href;
	const timeInPlay = await parsePlayerStats(url);
	const position = playerSubtable[1].querySelector('td').innerHTML;
	const zenTriertArray = row.querySelectorAll('.zentriert');
	const age = zenTriertArray[1].textContent.match(/\(([^)]+)\)/)[1];
	const imgUrl = playerSubtable[0]
		.querySelector('td:first-child img')
		.getAttribute('data-src')
		.replace('small', 'medium');

	const flagImgs = row.querySelectorAll('td img.flaggenrahmen');
	const flags = Array.from(flagImgs).map(img => img.alt);

	const cells = row.children;
	const value = cells[cells.length - 1].childNodes[0].textContent;

	//const valueStripped = convertStringValuetoNumber(value, 'Mill', 'Th.' , ' €');
	//const valueStripped = convertStringValuetoNumber(value, 'mil.', 'thousand', '€');
	const valueStripped = convertStringValuetoNumber(value, 'm', 'Th.', '€');
	//const swosData = getTheSwosValue(valueStripped);

	//const swosValue = swosData.swosValue ; 
	//const desiredSum = swosData.desiredSum ; 

	return { number, name, position, flags, value, timeInPlay, imgUrl, age , valueStripped};
}

async function parseNationalPlayerRow (row) {
	if (!row || !row.querySelector) return console.error('cannot find player row...');
	const number = row.querySelector('.rn_nummer').innerHTML;
	const name = row.querySelector('.spielprofil_tooltip').textContent;
	const position = row.querySelector('.inline-table tr:last-child > td').textContent;
	const value = row.querySelector('.rechts.hauptlink').textContent.trim();

	//const valueStripped = convertStringValuetoNumber(value, 'm', 'k', '£');
	//const valueStripped = convertStringValuetoNumber(value, 'mil.', 'thousand', '€');
    const valueStripped = convertStringValuetoNumber(value, 'm', 'Th.', '€');
	//const swosData = getTheSwosValue(valueStripped);

	//const swosValue = swosData.swosValue ; 
	//const desiredSum = swosData.desiredSum 
	const zenTriertArray = row.querySelectorAll('.zentriert');
	const age = zenTriertArray[1].textContent;
	const playerLink = row.querySelector('.spielprofil_tooltip').href;
	const url = BASE_URL + playerLink;

	const timeInPlay = await parseNationalPlayerStats(url);

	const playerSubtable = row.querySelectorAll('.inline-table  tbody tr');
	const imgUrl = playerSubtable[0]
		.querySelector('td:first-child img')
		.getAttribute('data-src')
		.replace('small', 'medium');

	
	return { number, name, position, value, imgUrl, age, timeInPlay , valueStripped};
}





async function parseNationalPlayerStats (url) {
	const res1 = await fetch(url).then(res => res.text());
	const { document } = new JSDOM(res1).window;
	if (!document) return;

	const table = document.querySelector('#yw1');
	if (!table) return 0;

	let timeInPlay = document.querySelector('#yw1 .items td:last-child');
	if (!timeInPlay) return 0;

	timeInPlay = timeInPlay.textContent.replace('.', '');
	//timeInPlay = timeInPlay.textContent.replace('-', '0');

	let time = parseInt(timeInPlay, 10);
	if (!time) return 0;

	return time;
}

async function parsePlayerStats (url) {
	const res1 = await fetch(url).then(res => res.text());
	const { document } = new JSDOM(res1).window;
	if (!document) return;

	const table = document.querySelectorAll('.box')[5];
	if (!table) return 0;

	

	/*const heading = table
		
		.querySelector('.subkategorie-header')
		.textContent.trim();
	
	if (heading !== 'Stats 19/20') {
		console.error("No this year stat for " + url); 
		return 0;
		
	}*/

	const subHeadersAll =  document.querySelectorAll(".subkategorie-header"); 
	
	let found = false ; 
	
	

	
	/*if (headerName !== 'STATS 20/21') {
		console.error("No this year stat for " + url); 
		return 0;
		
	}*/


	let timeInPlay = document.querySelector('#yw2 .items td:last-child');
	if (!timeInPlay) return 0; 

	timeInPlay = timeInPlay.textContent.replace('.', '');
	//timeInPlay = timeInPlay.textContent.replace('-', '0');

	let time = parseInt(timeInPlay, 10);
	if (!time) return 0;

	return time;
}

async function parseTable (res) {
	const { document } = new JSDOM(res).window;
	if (!document) return;
	const rows = document.querySelectorAll('#yw1 table.items>tbody>tr');
	const promises = Array.from(rows).map(parsePlayerRow);
	const coachName = document.querySelectorAll('.container-hauptinfo');
	let  coach ; 
	if (coachName.length > 1) {
		coach = coachName[1].textContent.trim();
	} else {
		coach = coachName[0].textContent.trim(); 
	}	
	let formation = 'unknown';

	try {
		const formationNode = document.querySelectorAll('.large-7.aufstellung-vereinsseite.columns.small-12.unterueberschrift.aufstellung-unterueberschrift');
		formation = formationNode[0].textContent.trim();
		formation = formation.substring(18);
	}
	catch (error) {
		formation = 'unknown';
	}

	return Promise.all(promises).then(players => ({ players, coach, formation }));
}

async function parseNationalTeamTable (res) {
	const { document } = new JSDOM(res).window;
	if (!document) return;
	const rows = document.querySelectorAll('#yw1 table.items>tbody>tr');
	const promises = Array.from(rows).map(parseNationalPlayerRow);
	const coachName = document.querySelectorAll('.container-hauptinfo');
	const coach = coachName[0].textContent.trim();

	let formation = 'unknown';

	try {
		const formationNode = document.querySelectorAll('.large-7.aufstellung-vereinsseite.columns.small-12.unterueberschrift.aufstellung-unterueberschrift');
		formation = formationNode[0].textContent.trim();
		formation = formation.substring(18);
	}
	catch (error) {
		formation = 'unknown';
	}

	return Promise.all(promises).then(players => ({ players, coach, formation }));
}



function getPlayers (club) {
	console.log(`Getting players' details for ${club.name}...`);
	return fetch(club.url)
		.then(res => res.text())
		.then(parseTable)
		.then(res => {
			club.url = club.url + ORDER_URL ;
			club.coach = res.coach;
			club.formation = res.formation;
			club.players = res.players; 
			
			//res.players.sort((a, b) => b.timeInPlay - a.timeInPlay);
			//club.players = dataProcessing.sortPlayersSwosStyle(res.players); 
			//res.players.sort((a, b) => b.valueStripped - a.valueStripped);
			//club.players = dataProcessing.sortPlayersSwosStyle2(res.players, res.formation); 
			return club;
		});
}

function getNationalTeamPlayers (nationalTeam) {
	console.log(`Getting players' details for ${nationalTeam.name}...`);

	return fetch(BASE_URL + nationalTeam.url)
		.then(res => res.text())
		.then(parseNationalTeamTable)
		.then(res => {
			nationalTeam.url = BASE_URL + nationalTeam.url;
			nationalTeam.coach = res.coach;
			nationalTeam.formation = res.formation;
			nationalTeam.players = res.players ; 
			//res.players.sort((a, b) => b.timeInPlay - a.timeInPlay);
			//nationalTeam.players = dataProcessing.sortPlayersSwosStyle(res.players); 
			return nationalTeam;
		});
}

module.exports = {
	getPlayers,
	getNationalTeamPlayers,
};
