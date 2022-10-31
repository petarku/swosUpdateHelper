const fetch = require('node-fetch');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const BASE_FIFA_URL = 'https://www.fifaindex.com';



function parseFifaClubRow (row) {
	const mainlink = row.querySelector('.link-team');
	const name = mainlink.title;
	const url = BASE_FIFA_URL + mainlink.href;
	return { name, url };
}


function parseFifaTable (res) {
	const { document } = (new JSDOM(res)).window;
	if (!document) return;
	const rows = document.querySelectorAll('td[data-title="Name"]');
	return Array.from(rows).map(parseFifaClubRow);
}


function getFifaClubs(league) {
	console.log('Getting clubs\' details...');
	return fetch(BASE_FIFA_URL + league)
		.then(res => res.text())
		.then(parseFifaTable);
}


module.exports = {
	getFifaClubs
};
