#!/usr/bin/env node

const superliga = require('./src/leagues');
const club = require('./src/club');
const fs = require('fs');
const leagues = require('./src/leagues.json');
const nationalTeams = require('./src/nationalTeams.json');
const csvWriter = require('./src/csv-writer.js');
const dataProcessing = require('./src/data-processing.js');
const del = require('delete');
const handler = require('serve-handler');
const http = require('http');
var open = require("open");


global.sortByCost = false;

async function getLeague (league) {
	
	let clubsArray = await superliga.getClubs(league.url) ; 
	 
	
	let clubPlayersArray = new Array() ; 
	for (const clubItem of clubsArray) {
		let clubPlayers = await club.getPlayers(clubItem); 
		
		clubPlayersArray.push(clubPlayers); 
	}
	const str = JSON.stringify(clubPlayersArray, null, 2);
	fs.writeFileSync(`data/league-${league.name}.json`, str);
	console.log(`File data/league-${league.name}.json created!`);

	writeCSVTeams(league.name) ; 
			
}

async function testLeagueScraping () {

	let league = getLeagueByLeagueName('serbia'); 
	let clubsArray = await superliga.getClubs(league.url) ; 
	 
	
	let clubPlayersArray = new Array() ; 
	
	
	for (var i = 0; i < 2; i++) {

	
		let clubPlayers = await club.getPlayers(clubsArray[i]); 
		
		clubPlayersArray.push(clubPlayers); 
	}
	const str = JSON.stringify(clubPlayersArray, null, 2);
	fs.writeFileSync(`data-test/league-test.json`, str);
	console.log(`File data/league-test.json created!`);

	csvWriter.writeLeague(league, clubPlayersArray , 'data-test/');
}

async function writeCSVTeamsFromJson(leagueName , inputDir, outputDir) { 

	let inputPath = inputDir + `league-${leagueName}.json`; 

	const data = await fs.readFileSync(inputPath, 'utf8'); 
		 
	const result = await JSON.parse(data);
	let league = new Array() ; 
	league.name = leagueName ; 
	
	if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir);
	}

	csvWriter.writeLeague(league , result , outputDir )
}

async function writeCSVTeams(leagueName ) { 
	writeCSVTeamsFromJson(leagueName, "./data/" , `./data-csv/${leagueName}/`)
	
}

async function testConversion () {

	
	writeCSVTeamsFromJson("serbia","./data-test/","./data-test/");
}



function showLeagueData(leagueName) { 
	 
	const server = http.createServer((request, response) => {

		return handler(request, response, {
			//cleanUrls: false
		});
	})
	
	server.listen(3000, () => {
		console.log('Running at http://localhost:3000');
	
	open(`http://localhost:3000?${leagueName}` );
	});

}


async function getAllNationalTeams (indexRange) {
	 
	let range = indexRange.split('-')
	
	let nationalTeamsArray = nationalTeams; 
	nationalTeamsArray = nationalTeamsArray.slice(range[0],range[1]) ; 
	
	let nationalPlayersArray = new Array() ; 
	for (const nationalItem of nationalTeamsArray) {
		let nationalPlayers = await club.getNationalTeamPlayers(nationalItem); 
		
		nationalPlayersArray.push(nationalPlayers); 
	}
	const str = JSON.stringify(nationalPlayersArray, null, 2);
	fs.writeFileSync(`data/league-nationalTeams-${indexRange}.json`, str);
	console.log(`File data/league-nationalTeams-${indexRange}.json created!`);

	
	
	for (var i = 0; i < nationalTeamsArray.length; i++) {
	
		csvWriter.writeTeam(null, nationalPlayersArray[i], nationalTeamsArray[i] , 'data-csv/');
	}
			
}

async function getNationalTeam (nationalTeamItem) {
	let nationalPlayersArray = new Array() ; 
	let nationalPlayers = await club.getNationalTeamPlayers(nationalTeamItem); 
	nationalPlayersArray.push(nationalPlayers);  
	const str = JSON.stringify(nationalPlayersArray, null, 2);
	fs.writeFileSync(`data/league-nationalTeams-${nationalTeamItem.name}.json`, str);
	console.log(`File data/league-nationalTeams-${nationalTeamItem.name}.json created!`);
	
	
	
		csvWriter.writeTeam(null, nationalPlayersArray[0], nationalTeamItem , 'data-csv/');
	
}


async function getBestTeamInLeague (league) {
	
	let clubsArray = await superliga.getClubs(league.url) ; 
	let clubsArrayTest = clubsArray.slice(0,2); 
	
	let clubPlayersArray = new Array() ; 
	for (const clubItem of clubsArrayTest) {
		let clubPlayers = await club.getPlayers(clubItem); 
		
		clubPlayersArray.push(clubPlayers); 
	}
	const str = JSON.stringify(clubPlayersArray, null, 2);
	fs.writeFileSync(`data-test/league-${league.name}.json`, str);
	console.log(`File data-test/league-${league.name}.json created!`);

	csvWriter.writeLeague(league, clubPlayersArray , 'data-test/');
	return ('./'+ `data-test/league-${league.name}.json`) ; 
}



function getLeagueByLeagueName (leagueName) {
	for (var i in leagues) {
		if (leagues[i].name.indexOf(leagueName) !== -1) {
			return leagues[i];
		}
	}
}



function getNationalTeamItemByName (nationalTeamName) {
	nationalTeamName = nationalTeamName.charAt(0).toUpperCase() + nationalTeamName.toLowerCase().substring(1);
	console.log(nationalTeamName);
	for (var i in nationalTeams) {
		if (nationalTeams[i].name.indexOf(nationalTeamName) !== -1) {
			return nationalTeams[i];
		}
	}
}




function showNationalData(leagueName) { 

	 
	const server = http.createServer((request, response) => {
		// You pass two more arguments for config and middleware
		// More details here: https://github.com/zeit/serve-handler#options
		return handler(request, response, {
			cleanUrls: false
		});
	})
	
	server.listen(3000, () => {
		console.log('Running at http://localhost:3000');
		open("http://localhost:3000/index2.html?" + 'nationalTeams-' + leagueName);
	     // open(`http://localhost:3000?${leagueName}` );
	});

}



module.exports = {
	getBestTeamInLeague , getLeagueByLeagueName , writeCSVTeamsFromJson 
} ; 


async function  test() { 

	


 
	
}



function run () {
	const cmdline = require('node-cmdline-parser');
	
	const keys = {
		//league 
		league: name => getLeague(getLeagueByLeagueName(name)),
		writeLeague2Csv:name => writeCSVTeams(name), 
		testLeague: name => getBestTeamInLeague(getLeagueByLeagueName(name)),
		showLeague:name => showLeagueData(name), 


		// national 
		allNational: rangeIndex => getAllNationalTeams(rangeIndex),
		national: name => getNationalTeam(getNationalTeamItemByName(name)),
		showNational:name => showNationalData(name), 
		testNationalTeam: () => getOneNationalTeam(nationalTeams[0]),  

		testScrapping:() => testLeagueScraping(), 
		testCsv:() => testConversion(), 
		test:() => test(), 
		
	
		help () {
			console.log('-------- USAGE to get LEAGUE DATA -------');
			console.log('you can use node . -league serbia --to scrap transfermarkt for league of serbia and create csv files');
			console.log('you can use node . -writeLeague2Csv serbia to recreate csv from scrapped json file');
			console.log('you can use node . -testLeague serbia to get 2  teams from serbian league');
			console.log('you can use node . -testCsv to get create 2 CSV files from test league');

			console.log('---------------------------------------------------------');

			console.log('you can use node . -national SERBIA --to get Serbian national team ');
			console.log('you can use node . -allNational indexRange -- for example "0-20" ');
			
			console.log('you can use node . -showNational "0-20" data in browser ');

			console.log('you can use node . -testScrapping to get 2 teams from Serbian league ');
			console.log('you can use node . -showLeague serbia --to show league data in browser ');
			
			
		},
		default () {
			console.log('no command parameter is not found ');
			console.log('run node . -help to get list of all parameters you can use  ');
		},
	};

	for (const [key, fn] of Object.entries(keys)) {
		if (cmdline.keyexists(key)) return fn(cmdline.get(key));
	}
	return keys.default();
}

run();
