#!/usr/bin/env node

const superliga = require('./src/leagues');
const club = require('./src/club');
const fs = require('fs');
const leagues = require('./src/leagues.json');
const nationalTeams = require('./src/nationalTeams.json');
const csvWriter = require('./src/csv-writer.js');
const puppeteer = require('puppeteer');
const del = require('delete');

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

			csvWriter.writeLeague(league, res , 'data-csv/');
		});
}

async function takeLineUpScreenshots (league) {
	let browser = await puppeteer.launch({ headless: true });
	let page = await browser.newPage();
	await page.setViewport({ width: 1920, height: 1080 });
	const clubs = await superliga.getClubs(league.url)

	
	var arrayLength = clubs.length;
	
		for (var i = 0; i < arrayLength; i++) {
			
			console.log( `Saving line ups for club ${league.name}-${clubs[i].name}` ); 
	
			await page.goto(clubs[i].url);
			await page.waitFor(5000);
			
			const url = await findElement( page , ".footer > a");
			await page.goto(url);
			await page.waitFor(5000);
			const lineUpsPageUrls = await findMatchDataURLS(page, ".ergebnis-link") ; 
			const urlArray = lineUpsPageUrls.urlElements; 
			for (var j = 0; j < 3; j++) {
				await page.goto(urlArray[j]); 
				let pathString = 'data-png/' +  `${clubs[i].name}${j}.png` ;
				console.log(`Taking screnshot for ${pathString}`); 
				let result = await screenshotDOMElement( page , "#main > div:nth-child(18) > div", 1 , pathString);
			}
		

		}
	
    await browser.close();
}

async function findMatchDataURLS(page, selector) {
    const rect = await page.evaluate(selector => {

		
	  const elements = document.querySelectorAll(selector) ;
	  	
	   
	  if (!elements) {
		return null ; 
	  } 
	  let arrayOfURLS=[]; 
	  for (var j = 0; j < elements.length; j++) {
		arrayOfURLS.push(elements[j].href)
	
		}
     
      return { urlElements : arrayOfURLS };
	}, selector);
	
	if (!rect) {
		console.log('Dom element couldnt be found ') ; 
		return null ; 
	}
	
	//console.log(rect[0].href); 
   return rect ; 
    
	
  }

async function findElement(page, selector) {
    const rect = await page.evaluate(selector => {

	  const element = document.querySelector(selector) ;
	  if (!element) {
		return null ; 
	  } 
     
      return { href: element.href };
	}, selector);
	
	if (!rect) {
		console.log('Dom element couldnt be found ') ; 
		return null ; 
	}
	
   return rect.href ; 
    
	
  }

async function screenshotDOMElement(page, selector, padding = 0, pathString) {
    const rect = await page.evaluate(selector => {

	  const element = document.querySelector(selector) ;
	  if (!element) {
		return null ; 
	  } 
      const { x, y, width, height } = element.getBoundingClientRect();
      return { left: x, top: y, width, height, id: element.id };
	}, selector);
	
	if (!rect) {
		console.log('Dom element couldnt be found ') ; 
		return null ; 
	}
   // console.log('rect: ', rect);

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
			
			let result = await screenshotDOMElement( page , "img[src='https://tmssl.akamaized.net/images/spielfeld_klein.png']", 1 , pathString);
			if (!result) {
				console.log(`Formation picture not found for  ${nationalTeams[i].name}`) ; 
			}	else {
				console.log('Png created for ' + pathString) ; 
			}

		}
	
    await browser.close();
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
			
			let result = await screenshotDOMElement( page , "img[src='https://tmssl.akamaized.net/images/spielfeld_klein.png']", 1 , pathString);
			if (!result) {
				console.log(`Formation picture not found for  ${clubs[i].name}`) ; 
			}	else {
				console.log('Png created for ' + pathString) ; 
			}

		}
	
    await browser.close();
}


function getBestTeamInLeague (league) {
	superliga
		.getClubs(league.url)
		.then(clubs => {
			//const playersPromises = clubs.map(club.getPlayers);
			const playersPromises = [club.getPlayers(clubs[0])]; // get 1 club for tests
			return Promise.all(playersPromises);
		})
		.then(res => {
			const str = JSON.stringify(res, null, 2);
			fs.writeFileSync(`data-test/league-${league.name}.json`, str);
			console.log(`File data-test/league-${league.name}.json created!`);

			csvWriter.writeLeague(league, res , 'data-test/');
		});
}

function getNationalTeams (nationalTeam) {
	club.getNationalTeamPlayers(nationalTeam).then(res => {
		const str = JSON.stringify(res, null, 2);
		fs.writeFileSync(`data/nationalTeam-${nationalTeam.name}.json`, str);
		console.log(`File data/nationalTeam-${nationalTeam.name}.json created!`);
		csvWriter.writeTeam(null, res, nationalTeam , 'data-csv/');
	});
}

function getOneNationalTeam (nationalTeam) {
	club.getNationalTeamPlayers(nationalTeam).then(res => {
		const str = JSON.stringify(res, null, 2);
		fs.writeFileSync(`data-test/nationalTeam-${nationalTeam.name}.json`, str);
		console.log(`File data-test/nationalTeam-${nationalTeam.name}.json created!`);
		csvWriter.writeTeam(null, res, nationalTeam , 'data-test/');
	});
}

function getLeagueByLeagueName (leagueName) {
	for (var i in leagues) {
		if (leagues[i].name.indexOf(leagueName) !== -1) {
			return leagues[i];
		}
	}
}

function getNationalTeamByName (nationalTeamName) {
	for (var i in nationalTeams) {
		if (nationalTeams[i].name.indexOf(nationalTeamName) !== -1) {
			return nationalTeams[i];
		}
	}
}

function deleteAssets () {
	del(['data-csv/*.csv'], function(err, deleted) {
		if (err) throw err;
		console.log("Following files are deleted : ")
		console.log(deleted);
	  });
	  del(['data-png/*.png'], function(err, deleted) {
		if (err) throw err;
		console.log("Following files are deleted : ")
		console.log(deleted);
	  });

}
function showLeagueData(leagueName) { 
	 
const server = http.createServer((request, response) => {
	// You pass two more arguments for config and middleware
	// More details here: https://github.com/zeit/serve-handler#options
	return handler(request, response);
  })
   
  server.listen(3000, () => {
	console.log('Running at http://localhost:3000');
	//open("http://localhost:3000/index.html" + '&'  + leagueName);
  open(`http://localhost:3000?${leagueName}` );
  });

}
const handler = require('serve-handler');
const http = require('http');
var open = require("open");




function run () {
	const cmdline = require('node-cmdline-parser');
	
	const keys = {
		league: name => getLeague(getLeagueByLeagueName(name)),
		allNational: () => {
			const arrayLength = nationalTeams.length;
			for (var i = 0; i < arrayLength; i++) {
				getNationalTeams(nationalTeams[i]);
			}
		},
		national: name => getNationalTeams(getNationalTeamByName(name)),
		showLeague:name => showLeagueData(name), 
		leagueScreenshot: name => takeScreenshot(getLeagueByLeagueName(name)),
		nationalScreenshots: () => takeNationalScreenshot(),
		
		
		testLeague: name => getBestTeamInLeague(getLeagueByLeagueName(name)),
		testNationalTeam: () => getOneNationalTeam(nationalTeams[0]), 
		takeScreenshot:name => takeLineUpScreenshots(getLeagueByLeagueName(name)), 
		makeScreenshotTest: name => takeScreenshotTest(getLeagueByLeagueName(name)), 
		deleteAssets:() => deleteAssets(), 
		
	
		help () {
			console.log('you can use node . -league serbia --to scrap transfermarkt for league of serbia');
			console.log('you can use node . -national SERBIA --to get Serbian national team ');
			console.log('you can use node . -allNational --to scrap all national teams');
			console.log('you can use node . -showLeague serbia --to show league data in browser ');
			console.log('you can use node . -leagueScreenshot serbia to get formation screenshots for serbian league ');
			console.log('you can use node . -nationalScreenshots to get screenshot for all national teams ');

			console.log('you can use node . -testLeague to get 1  team from league');
			console.log('you can use node . -takeScreenshot {serbia} to get screenshot for provided league ');
			console.log('you can use node . -makeScreenshotTest to get screenshot for provided league ');
			
			
			
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
