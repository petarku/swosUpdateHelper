const fetch = require('node-fetch');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const BASE_URL = 'https://www.transfermarkt.com';



function parsePlayerRow (row) {
	if (!row || !row.querySelector) return console.error('cannot find player row...');
	const number = row.querySelector('.rn_nummer').innerHTML;
	const playerSubtable = row.querySelectorAll('.posrela table tbody tr');
	//const playerLink = playerSubtable[0].querySelector('.hauptlink a');
	const name = playerLink.innerHTML;
	//const url = BASE_URL + playerLink.href;

	const position = playerSubtable[1].querySelector('td').innerHTML;

	const flagImgs = row.querySelectorAll('td img.flaggenrahmen');
	const flags = Array.from(flagImgs).map(img => img.alt);

	const cells = row.children;
	const value = cells[cells.length - 1].childNodes[0].textContent;

	return { number, name, position, flags, value };
}



function parseTable (res) {
	const { document } = (new JSDOM(res)).window;
	if (!document) return;
	const rows = document.querySelectorAll('#yw1 table.items>tbody>tr');
	return Array.from(rows).map(parsePlayerRow);
}


function getPlayers (club) {
	console.log(`Getting players' details for ${club.name}...`);
	return fetch(club.url)
		.then(res => res.text())
		.then(parseTable)
		.then(res => {
			club.players = res;
			return club;
		});
}

module.exports = {
	getPlayers
};
