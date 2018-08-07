const fetch = require('node-fetch');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const BASE_URL = 'https://www.transfermarkt.com';


function parseClubRow (row) {
	const mainlink = row.querySelector('.hauptlink a');
	const name = mainlink.innerHTML;
	const url = BASE_URL + mainlink.href;
	return { name, url };
}


function parseTable (res) {
	const { document } = (new JSDOM(res)).window;
	if (!document) return;
	const rows = document.querySelectorAll('#wettbewerbsstartseite #yw1 table.items tbody tr');
	return Array.from(rows).map(parseClubRow);
}


function getClubs () {
	console.log('Getting clubs\' details...');
	return fetch(BASE_URL + '/superliga/startseite/wettbewerb/SER1')
		.then(res => res.text())
		.then(parseTable);
}

module.exports = {
	getClubs
};
