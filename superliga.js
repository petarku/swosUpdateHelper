const fetch = require('node-fetch');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const BASE_URL = 'https://www.transfermarkt.com';

const SERBIAN_LEAGUE = '/superliga/startseite/wettbewerb/SER1';

const SPANISH_LEAGUE = '/primera-division/startseite/wettbewerb/ES1';


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
	return fetch(BASE_URL + SPANISH_LEAGUE)
		.then(res => res.text())
		.then(parseTable);
}

module.exports = {
	getClubs
};
