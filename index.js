#!/usr/bin/env node

const superliga = require('./src/leagues');
const fifaLeagues = require('./src/leaguesFifa');
const helper = require('./src/puppetteer-helper.js');
const club = require('./src/club');
const clubFifa = require('./src/clubFifa');
const fs = require('fs');
const leagues = require('./src/leagues.json');
const fifaLeaguesList = require('./src/leaguesFifa.json');
const nationalTeams = require('./src/nationalTeams.json');
const csvWriter = require('./src/csv-writer.js');
const dataProcessing = require('./src/data-processing.js');
const puppeteer = require('puppeteer');
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

async function takeScreenshot (league) {
	let browser = await puppeteer.launch({ headless: true });
	let page = await browser.newPage();
	await page.setViewport({ width: 1920, height: 1080 });
	const clubs = await superliga.getClubs(league.url)


	var arrayLength = clubs.length;
		for (var i = 0; i < arrayLength; i++) {
			 
			let pathString = 'data-png/' +  `${clubs[i].name}.png` ; 
			await page.goto(clubs[i].url);
			await page.waitFor(5000);
			
			let result = await helper.screenshotDOMElement( page , "img[src='https://tmssl.akamaized.net/images/spielfeld_klein.png']", 1 , pathString);
			if (!result) {
				console.log(`Formation picture not found for  ${clubs[i].name}`) ; 
			}	else {
				console.log('Png created for ' + pathString) ; 
			}

		}
	
    await browser.close();
}



async function getFifaLeague (league) {
	console.log(league) ; 
	let clubsArray = await fifaLeagues.getFifaClubs(league.url) ; 
	//let clubsArraySliced = clubsArray.slice(0,1); 
	//console.log(clubsArray) ; 
	console.log(clubsArray); 
	
	let clubPlayersArray = new Array() ; 
	for (const clubItem of clubsArray) {
		let clubPlayers = await clubFifa.getFifaPlayers(clubItem); 
		console.log(clubPlayers) ; 
		clubPlayersArray.push(clubPlayers); 
	}
	const str = JSON.stringify(clubPlayersArray, null, 2);
	fs.writeFileSync(`data/league-fifa.json`, str);
	//console.log(`File data/league-${league.name}.json created!`);

	//csvWriter.writeLeague(league, clubPlayersArray , 'data-csv/');
			
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

function delay(time) {
	return new Promise(function(resolve) { 
		setTimeout(resolve, time)
	});
 }
 
async function takeLineUpScreenshots (league) {
	let browser = await puppeteer.launch({ headless: true });
	let page = await browser.newPage();
	await page.setViewport({ width: 1920, height: 1080 });
	const clubs = await superliga.getClubs(league.url)

	
	var arrayLength = clubs.length;
	
		for (var i = 0; i < 2; i++) {
			
			console.log( `Saving line ups for club ${league.name}-${clubs[i].name}` ); 
	
			await page.goto(clubs[i].url);
		
			
			const url = await helper.findElement( page , ".c2action-footer > a");
			await page.goto(url);
			const lineUpsPageUrls = await helper.findMatchDataURLS(page, ".ergebnis-link") ; 
			//console.log(lineUpsPageUrls) ; 
			const urlArray = lineUpsPageUrls.urlElements; 
			for (var j = 0; j < 3; j++) {
				//await page.goto(urlArray[j]); 
				const pageLoadOptions = {
					timeout: 10000,
					waitUntil: ['domcontentloaded', 'networkidle0']
				};
				

				await page.goto(urlArray[j], pageLoadOptions) ; 
				
				console.log(urlArray[j]) ; 
				let pathString = 'data-png/' +  `${clubs[i].name}${j}.png` ;
				console.log(`Taking screnshot for ${pathString}`);
				await page.waitForSelector (".aufstellung-box") ; 
				const bodyHeight = await page.evaluate(() => document.body.scrollHeight);;

				let result = await helper.screenshotDOMElement( page , ".aufstellung-box", 1 , pathString);
			}
		

		}
	
    await browser.close();
}


  async function takeNationalScreenshot () {
	let browser = await puppeteer.launch({ headless: true });
	let page = await browser.newPage();
	await page.setViewport({ width: 1920, height: 1080 });
	
	const BASE_URL = 'https://www.transfermarkt.co.uk';
	


	var arrayLength = nationalTeams.length;
		for (var i = 0; i < arrayLength; i++) {
			 
			let pathString = 'data-png/' +  `${nationalTeams[i].name}.png` ; 
			await page.goto(BASE_URL + nationalTeams[i].url);
			await page.waitFor(5000);
			
			let result = await helper.screenshotDOMElement( page , "img[src='https://tmssl.akamaized.net/images/spielfeld_klein.png']", 1 , pathString);
			if (!result) {
				console.log(`Formation picture not found for  ${nationalTeams[i].name}`) ; 
			}	else {
				console.log('Png created for ' + pathString) ; 
			}

		}
	
    await browser.close();
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

function getFifaLeagueByLeagueName (leagueName) {
	for (var i in fifaLeaguesList) {
		if (fifaLeaguesList[i].name.indexOf(leagueName) !== -1) {
			return fifaLeaguesList[i];
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
	getBestTeamInLeague , getLeagueByLeagueName , writeCSVTeamsFromJson , getFifaLeague
} ; 



async function screenshotLineups () {
	const puppeteer = require('puppeteer');
	// const function below allows files read 
	const fs = require("fs").promises;

	(async () => {

		const browser = await puppeteer.launch({
			headless: true
		});
		// launches chrome in headless mode
		const page = await browser.newPage();
		//const userAgent = await browser.userAgent()
		//await page.setUserAgent(userAgent)

		// code below reads cookies
		const cookiesString = await fs.readFile('sitecookie.json');
		const cookies = JSON.parse(cookiesString);
		await page.setCookie(...cookies);
		let league = getLeagueByLeagueName('serbia');

		const clubs = await superliga.getClubs(league.url);


		//clubs.length

		for (var i = 0; i < clubs.length; i++) {

			console.log(`Saving line ups for club ${league.name}-${clubs[i].name}`);

			await page.goto(clubs[i].url);


			const url = await helper.findElement(page, ".c2action-footer > a");
			await page.goto(url);




			const lineUpsPageUrls = await helper.findMatchDataURLS(page, ".ergebnis-link");
			//console.log(lineUpsPageUrls) ; 
			const urlArray = lineUpsPageUrls.urlElements;
			for (var j = 0; j < 2; j++) {
				//await page.goto(urlArray[j]); 
				const pageLoadOptions = {
					timeout: 10000,
					waitUntil: ['domcontentloaded', 'networkidle0']
				};


				await page.goto(urlArray[j], pageLoadOptions);
				await page.setViewport({ width: 1920, height: 1080 });

				console.log(urlArray[j]);
				let pathString = 'data-png/' + `${league.name}` + `${clubs[i].name}${j}.png`;
				console.log(`Taking screnshot for ${pathString}`);



				await page.screenshot({                      // Screenshot the website using defined options

					path: pathString,                   // Save the screenshot in current directory

					fullPage: true                              // take a fullpage screenshot

				});

			}
			

		}
		browser.close();

	})();

}
 

 
      

async function  test() { 

	const puppeteer = require('puppeteer');
// const function below allows files read 
const fs = require("fs").promises;

(async () => {

    const browser = await puppeteer.launch({
        headless: true
    }); 
    // launches chrome in headless mode
    const page = await browser.newPage();
	//const userAgent = await browser.userAgent()
    //await page.setUserAgent(userAgent)

    // code below reads cookies
    const cookiesString = await fs.readFile('sitecookie.json');
    const cookies = JSON.parse(cookiesString);
    await page.setCookie(...cookies);
    let league = getLeagueByLeagueName('serbia'); 

	const clubs = await superliga.getClubs(league.url) ;

	
		//clubs.length
	
		for (var i = 0; i < 2; i++) {
			
			console.log( `Saving line ups for club ${league.name}-${clubs[i].name}` ); 
	
			await page.goto(clubs[i].url);
			
			
			const url = await helper.findElement( page , ".c2action-footer > a");
			await page.goto(url);
			
			

			
			const lineUpsPageUrls = await helper.findMatchDataURLS(page, ".ergebnis-link") ; 
			//console.log(lineUpsPageUrls) ; 
			const urlArray = lineUpsPageUrls.urlElements; 
			for (var j = 0; j < 2; j++) {
				//await page.goto(urlArray[j]); 
				const pageLoadOptions = {
					timeout: 10000,
					waitUntil: ['domcontentloaded', 'networkidle0']
				};
				

				await page.goto(urlArray[j], pageLoadOptions) ; 
				await page.setViewport({ width: 1920, height: 1080 });
				
				console.log(urlArray[j]) ; 
				let pathString = 'data-png/' + `${league.name}`+ `${clubs[i].name}${j}.png` ;
				console.log(`Taking screnshot for ${pathString}`);

				
			
				await page.screenshot({                      // Screenshot the website using defined options
 
					path: pathString,                   // Save the screenshot in current directory
				 
					fullPage: true                              // take a fullpage screenshot
				 
				  });

				  //let result = await helper.screenshotDOMElement( page , "/html/body/div[4]/div[14]/div", 1 , pathString);
		

		}
		

	}
	browser.close() ; 

})();
 
	
}



function run () {
	const cmdline = require('node-cmdline-parser');
	
	const keys = {
		//league 
		league: name => getLeague(getLeagueByLeagueName(name)),
		showLeague:name => showLeagueData(name), 
		leagueScreenshot: name => takeScreenshot(getLeagueByLeagueName(name)),
		screenshot:() => screenshotLineups(), 

		// national 
		allNational: rangeIndex => getAllNationalTeams(rangeIndex),
	
		national: name => getNationalTeam(getNationalTeamItemByName(name)),
		fifaLeague: name => getFifaLeague(getFifaLeagueByLeagueName(name)) , 
		
		showNational:name => showNationalData(name), 
		
		nationalScreenshots: () => takeNationalScreenshot(),
		writeLeague2Csv:name => writeCSVTeams(name), 
		
		
		testLeague: name => getBestTeamInLeague(getLeagueByLeagueName(name)),
		testNationalTeam: () => getOneNationalTeam(nationalTeams[0]), 
		takeScreenshot:name => takeLineUpScreenshots(getLeagueByLeagueName(name)), 
		makeScreenshotTest: name => takeScreenshot(getLeagueByLeagueName(name)), 
		testScrapping:() => testLeagueScraping(), 
		testCsv:() => testConversion(), 
		test:() => test(), 
		
	
		help () {
			console.log('-------- USAGE to get LEAGUE DATA -------');
			console.log('you can use node . -league serbia --to scrap transfermarkt for league of serbia and create csv files');
			console.log('you can use node . -showLeague serbia --to show league data in browser ');
			console.log('you can use node . -writeLeague2Csv serbia to recreate csv from scrapped json file');

			console.log('-------- Testing  LEAGUE Scrapping and CSV creation -------');
			console.log('you can use node . -testLeague to get 2  teams from league');
			console.log('you can use node . -testCsv to get create 2 CSV files from test league');

			console.log('---------------------------------------------------------');

			console.log('you can use node . -national SERBIA --to get Serbian national team ');
			console.log('you can use node . -allNational indexRange -- for example "0-20" ');
			
			console.log('you can use node . -showNational "0-20" data in browser ');
			console.log('you can use node . -leagueScreenshot serbia to get formation screenshots for serbian league ');
			console.log('you can use node . -nationalScreenshots to get screenshot for all national teams ');

			
			console.log('you can use node . -takeScreenshot {serbia} to get screenshot for provided league ');
			console.log('you can use node . -makeScreenshotTest to get screenshot for provided league ');
			console.log('you can use node . -testScrapping to get 2 teams from Serbian league ');
			
			
			
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
