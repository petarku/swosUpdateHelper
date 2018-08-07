#!/usr/bin/env node

const superliga = require('./superliga');
const club = require('./club');
const fs = require('fs');

const FNAME = 'superliga.json';

superliga
	.getClubs()
	.then(res => {
		const playersPromises = res.map(club.getPlayers);
		return Promise.all(playersPromises);
	})
	.then(res => {
		const str = JSON.stringify(res, null, 2);
		fs.writeFileSync(FNAME, str);
		console.log(`File ${FNAME} created!`);
	});
