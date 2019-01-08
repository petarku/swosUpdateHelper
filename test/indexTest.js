
const csvWriter = require('../src/csv-writer.js');
const index = require('../index.js');
const del = require('delete');
const fs = require('fs');


var assert = require('assert');



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


describe('Scrape for 2 teams ', async function () {
	it('should return 1 json with 2 files', async function()  {
		this.timeout(25000);
		 del.sync(['./data-test/*.json'])
		 del.sync(["./data-test/*.csv"])
		 
		const path = await index.getBestTeamInLeague(index.getLeagueByLeagueName('england')) ; 

		fs.statSync(path);
		const data = fs.readFileSync(path, 'utf8'); 
		 
		const result = JSON.parse(data);

		//console.log(result) ; 
		assert.equal(result[0].name,'Manchester City'); 
		assert.equal(result[1].name,'Liverpool FC'); 
	
	});
});

describe('Write csv from json ', function () {
	it('should return 1 json with 2 files',async function()  {
		//await deleteCSVFiles(); 
		del.sync(["./test-input/*.csv"]);

		await index.writeCSVTeamsFromJson ("test" , "./test-input/", "./test-input/" ); 
	
		path = "./test-input/test-liverpool-fc.csv"; 

		let csvData = fs.readFileSync(path, 'utf8'); 

		path = "./test-input/test-manchester-city.csv"; 

		csvData = fs.readFileSync(path, 'utf8');
	
	});
});

