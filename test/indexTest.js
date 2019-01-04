
const csvWriter = require('../src/csv-writer.js');
const index = require('../index.js');
const del = require('delete');


var assert = require('assert');

function deleteTestAssets () {
	del(["../data-test/*.csv"], function(err, deleted) {
		if (err) throw err;
		console.log("Following files are deleted : ")
		console.log(deleted);
	  });
	  del(['../data-test/*.json'], function(err, deleted) {
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


describe('Calculate skills tests ', function () {
	it('should return all 0 when sum is 0', async function () {
		deleteTestAssets(); 
		//await index.getBestTeamInLeague(index.getLeagueByLeagueName('england')) ; 
		
	});
});

