#!/usr/bin/env node

const superliga = require('./superliga');
const player = require('./player');

superliga
	.getClubs()
	.then(res => {
		console.log(res);
	});
