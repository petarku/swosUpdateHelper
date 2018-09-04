const fetch = require('node-fetch');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const swosRange = require('./swos-range.json');

const BASE_URL = 'https://www.transfermarkt.com';



async function parsePlayerRow (row) {
	if (!row || !row.querySelector) return console.error('cannot find player row...');
	const number = row.querySelector('.rn_nummer').innerHTML;
	const playerSubtable = row.querySelectorAll('.posrela table tbody tr');
	const playerLink = playerSubtable[0].querySelector('.hauptlink a');
	const name = playerLink.innerHTML;
	const url = BASE_URL + playerLink.href;
	const timeInPlay = await parsePlayerStats(url);
	const position = playerSubtable[1].querySelector('td').innerHTML;
	const imgUrl = playerSubtable[0].querySelector('td:first-child img')
		.getAttribute('data-src')
		.replace('small', 'medium');

	const flagImgs = row.querySelectorAll('td img.flaggenrahmen');
	const flags = Array.from(flagImgs).map(img => img.alt);

	const cells = row.children;
	const value = cells[cells.length - 1].childNodes[0].textContent;

	const valueStripped = convertStringValuetoNumber(value, 'Mill. €', 'Th. €');
	const swosValue = getTheSwosValue(valueStripped);

	return { number, name, position, flags, value, timeInPlay, swosValue, imgUrl };
}

function getTheSwosValue (valueStripped) {
	for (let i = 0; i < swosRange.length; i++) {
		if (valueStripped >= swosRange[i].minValue && valueStripped < swosRange[i].maxValue) {
			return swosRange[i].swosValue;
		}
	}
	return 'no Set Price';
}

function convertStringValuetoNumber (original, substr, substr2) {
	const idx = original.indexOf(substr);

	if (idx != -1) {
		original = original.substr(0, idx).replace(',', '.');
		return parseFloat(original) * 1000000;
	}

	const idx2 = original.indexOf(substr2);
	if (idx2 != -1) {
		original = original.substr(0, idx2).replace(',', '.');
		return parseFloat(original) * 1000;
	}

	return original;
}


async function parsePlayerStats (url) {
	const res1 = await fetch(url).then(res => res.text());
	const { document } = (new JSDOM(res1)).window;
	if (!document) return;

	const table = document.querySelector('#yw1');
	if (!table) return 0;

	const heading = table.closest('.box').querySelector('.table-header').textContent.trim();
	if (heading.indexOf('Performance') === -1) return 0;


	let timeInPlay = document.querySelector('#yw1 .items td:last-child');
	if (!timeInPlay) return 0;
	timeInPlay = timeInPlay.textContent.replace('.', '');

	return parseInt(timeInPlay, 10);	
}



async function parseTable (res) {
	const { document } = (new JSDOM(res)).window;
	if (!document) return;
	const rows = document.querySelectorAll('#yw1 table.items>tbody>tr');
	const promises = Array.from(rows).map(parsePlayerRow);
	const coachName = document.querySelectorAll('.container-hauptinfo');
	const coach = coachName[0].textContent.trim() ;


	return Promise.all(promises).then(players => ({ players, coach }));
}


function getPlayers (club) {
	console.log(`Getting players' details for ${club.name}...`);
	return fetch(club.url)
		.then(res => res.text())
		.then(parseTable)
		.then(res => {
			club.coach = res.coach;
			club.players = res.players.sort((a, b) => b.timeInPlay - a.timeInPlay);
			return club;
		});
}

module.exports = {
	getPlayers
};
