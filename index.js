#!/usr/bin/env node

const superliga = require('./src/leagues');
const club = require('./src/club');
const fs = require('fs');
const leagues = require('./src/leagues.json');
const nationalTeams = require('./src/nationalTeams.json');
const csvWriter = require('./src/csv-writer.js');

function getLeague (league) {
	superliga
		.getClubs(league.url)
		.then(clubs => {
			const playersPromises = clubs.map(club.getPlayers);
			 
			return Promise.all(playersPromises);
		})
		.then(res => {
			const str = JSON.stringify(res, null, 2);
			fs.writeFileSync(`data/league-${league.name}.json`, str);
			console.log(`File data/league-${league.name}.json created!`);

			csvWriter.writeLeague(league, res);
		});
}

async function takeScreenshotTest (league) {
	let browser = await puppeteer.launch({ headless: true });
	let page = await browser.newPage();
	await page.setViewport({ width: 1920, height: 1080 });
	const clubs = await superliga.getClubs(league.url)


	var arrayLength = clubs.length;
	
		for (var i = 0; i < 1; i++) {
			
			let pathString = 'data-csv/' +  `${league.name}-${clubs[i].name}.png` ; 
			await page.goto(clubs[i].url);
			await page.waitFor(5000);
			
			await screenshotDOMElement( page , "img[src='https://tmssl.akamaized.net/images/spielfeld_klein.png']", 1 , pathString);

		}
	
    await browser.close();
}

async function screenshotDOMElement(page, selector, padding = 0, pathString) {
    const rect = await page.evaluate(selector => {

	  const element = document.querySelector(selector) ;
      const { x, y, width, height } = element.getBoundingClientRect();
      return { left: x, top: y, width, height, id: element.id };
    }, selector);
    console.log('rect: ', rect);

    return await page.screenshot({
      path: pathString,
      clip: {
        x: rect.left - padding,
        y: rect.top - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
      },
    });
  }


async function takeScreenshot (league) {
	let browser = await puppeteer.launch({ headless: true });
	let page = await browser.newPage();
	await page.setViewport({ width: 1920, height: 1080 });
	const clubs = await superliga.getClubs(league.url)


	var arrayLength = clubs.length;
		for (var i = 0; i < arrayLength; i++) {
			 
			let pathString = 'data-csv/' +  `${league.name}-${clubs[i].name}.png` ; 
			await page.goto(clubs[i].url);
			await page.waitFor(5000);
			
			await screenshotDOMElement( page , "img[src='https://tmssl.akamaized.net/images/spielfeld_klein.png']", 1 , pathString);

		}
	
    await browser.close();
}


function getBestTeamInLeague (league) {
	superliga
		.getClubs(league.url)
		.then(clubs => {
			//const playersPromises = clubs.map(club.getPlayers);
			 const playersPromises = [ club.getPlayers(clubs[0]) ];		// get 1 club for tests
			return Promise.all(playersPromises);
		})
		.then(res => {
			const str = JSON.stringify(res, null, 2);
			fs.writeFileSync(`data/league-${league.name}.json`, str);
			console.log(`File data/league-${league.name}.json created!`);

			csvWriter.writeLeague(league, res);
		});
}

function getNationalTeams (nationalTeam) {
	club.getNationalTeamPlayers(nationalTeam).then(res => {
		const str = JSON.stringify(res, null, 2);
		fs.writeFileSync(`data/nationalTeam-${nationalTeam.name}.json`, str);
		console.log(`File data/nationalTeam-${nationalTeam.name}.json created!`);
		csvWriter.writeTeam(null, res, nationalTeam) ; 
	});
}

function getLeagueByLeagueName(leagueName) { 
	for (var i in leagues) {
		if (leagues[i].name.indexOf(leagueName) !== -1) {
			//console.log(leagues[i]);
		 	return leagues[i] ;  
		}
	  }
	
}

const puppeteer = require('puppeteer');

var rmdir = require('rmdir');



const cmdline = require('node-cmdline-parser');

switch (true) {
	case cmdline.keyexists('testNational'):
		getNationalTeams(nationalTeams[0]) ;
	   break;
	case cmdline.keyexists('testLeague'):
		getBestTeamInLeague(leagues[5]);
	   break;
	case cmdline.keyexists('leagueName'):
		const leagueName = cmdline.get('leagueName')
		//getLeague(getLeagueByLeagueName(leagueName))
		takeScreenshotTest(getLeagueByLeagueName(leagueName)); 
	   break;
	case cmdline.keyexists('allNational'):
		var arrayLength = nationalTeams.length;

		for (var i = 0; i < arrayLength; i++) {
			getNationalTeams(nationalTeams[i]) ;
		}
		break; 
	case cmdline.keyexists('clearCSV'):
		var path = 'data-csv';

		rmdir(path , function (err, dirs, files) {
		console.log(dirs);
		console.log(files);
		console.log('all files are removed');
		});
		 break ; 
	case cmdline.keyexists('help'):
		console.log('you can use node . -testNational to get 1 national team') ; 
		console.log('you can use node . -testLeague to get 1  team from league') ; 
		console.log('you can use node . -leagueName serbia to get teams from league of serbia') ; 
		console.log('you can use node . -allNational to get all national teams') ; 
		break; 
	default:
		console.log('no command parameter is not found ') ; 
		console.log('run node . -help to get list of all parameters you can use  ') ;    
	  
  }
