
const csvWriter = require('../src/csv-writer.js');
const index = require('../index.js');
const del = require('delete');
const fs = require('fs');


var assert = require('assert');

function deleteTestAssets () {
	del(["./data-test/*.csv"] ,{force: true}, function(err, deleted) {
		if (err) throw err;
		console.log("Following files are deleted : ")
		console.log(deleted);
	  });
	  del(['./data-test/*.json'], function(err, deleted) {
		if (err) throw err;
		console.log("Following files are deleted : ")
		console.log(deleted);
	  });

}

function deleteCSVFiles () {
	del(["./test-input/*.csv"] ,{force: true}, function(err, deleted) {
		if (err) throw err;
		console.log("Following files are deleted : ")
		console.log(deleted);
	  });
	

}

describe('Calculate skills tests ', function () {
	it('should return all 7 when sum is 49', function () {
		let desiredSUM = 49;
		const res = csvWriter.calculateSkills(desiredSUM, 'Attacking Midfield');
		assert.deepEqual(res,[7,7,7,7,7,7,7]) ; 
		
	});
	it('should return all 0 when sum is 0', function () {
		let desiredSUM = 0;
		const res = csvWriter.calculateSkills(desiredSUM, 'Attacking Midfield');
		assert.deepEqual(res,[0,0,0,0,0,0,0]) ; 
		
	});
});


/*describe('Scrape for 2 teams ', async function () {
	it('should return 1 json with 2 files', async function()  {
		this.timeout(25000);
		deleteTestAssets(); 
		const path = await index.getBestTeamInLeague(index.getLeagueByLeagueName('england')) ; 
		//const path = "./data-test/league-england.json"; 
		

		const stat = fs.statSync(path);
		const data = fs.readFileSync(path, 'utf8'); 
		 
		const result = JSON.parse(data);

		//console.log(result) ; 
		assert.equal(result[0].name,'Manchester City'); 
	
	});
});*/

describe('Read json file ', function () {
	it('should return 1 json with 2 files',async function()  {
		deleteCSVFiles(); 
		
		 
		const path = "./test-input/league-test.json"; 
		

		const stat = fs.statSync(path);
		const data = fs.readFileSync(path, 'utf8'); 
		 
		const result = JSON.parse(data);

		//console.log(result) ; 
		let league = new Array() ; 
		league.name = 'england' ; 
		//assert.equal(result[0].name,'Manchester City'); 
		//  assert.equal(result[0].players[0].name,'Ederson'); 

		csvWriter.writeLeague(league , result , './test-input/' )
	
	});
});

