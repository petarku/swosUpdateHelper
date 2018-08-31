const fetch = require('node-fetch');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

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

	const flagImgs = row.querySelectorAll('td img.flaggenrahmen');
	const flags = Array.from(flagImgs).map(img => img.alt);

	const cells = row.children;
	const value = cells[cells.length - 1].childNodes[0].textContent;

	var valueStripped = convertStringValuetoNumber (value, 'Mill. €' , 'Th. €');

	var swosValue = getTheSwosValue(valueStripped);
	console.log(swosValue);

	return { number, name, position, flags, value , timeInPlay , swosValue };
}

function getTheSwosValue(valueStripped) {


const valueRange2 =  [
	{ minValue:0, maxValue:20000, swosValue:'25K' },
	{ minValue:20000, maxValue:30000, swosValue:'30K' },
	{ minValue:30000, maxValue:50000, swosValue:'40K' },
	{ minValue:50000, maxValue:85000, swosValue:'50K' },

	{ minValue:85000, maxValue:100000, swosValue:'65K' },
	{ minValue:100000, maxValue:145000, swosValue:'75K' },
	{ minValue:145000, maxValue:165000, swosValue:'85K' },

	{ minValue:165000, maxValue:190000, swosValue:'100K' },
	{ minValue:190000, maxValue:230000, swosValue:'110K' },
	{ minValue:230000, maxValue:280000, swosValue:'130K' },
	{ minValue:280000, maxValue:330000, swosValue:'150K' },
	{ minValue:330000, maxValue:400000, swosValue:'160K' },
	{ minValue:400000, maxValue:475000, swosValue:'180K' },
	{ minValue:475000, maxValue:550000, swosValue:'200K' },
	{ minValue:550000, maxValue:700000, swosValue:'250K' },
	{ minValue:700000, maxValue:850000, swosValue:'300K' },
	{ minValue:850000, maxValue:1000000, swosValue:'350K' },
	{ minValue:1000000, maxValue:1250000, swosValue:'450K' },
	{ minValue:1250000, maxValue:1500000, swosValue:'500K' },
	{ minValue:1500000, maxValue:1800000, swosValue:'550K' },
	{ minValue:1800000, maxValue:2000000, swosValue:'600K' },
	{ minValue:2000000, maxValue:2300000, swosValue:'650K' },
	{ minValue:2300000, maxValue:2550000, swosValue:'700K' },
	{ minValue:2550000, maxValue:2800000, swosValue:'750K' },
	{ minValue:2800000, maxValue:3000000, swosValue:'800K' },
	{ minValue:3000000, maxValue:3250000, swosValue:'850K' },
	{ minValue:3250000, maxValue:3500000, swosValue:'950K' },
	{ minValue:3500000, maxValue:4500000, swosValue:'1M' },
	{ minValue:4500000, maxValue:5500000, swosValue:'1.1M' },
	{ minValue:5500000, maxValue:6500000, swosValue:'1.3M' },
	{ minValue:6500000, maxValue:7500000, swosValue:'1.5M' },
	{ minValue:7500000, maxValue:8000000, swosValue:'1.6M' },
	{ minValue:8000000, maxValue:9000000, swosValue:'1.8M' },
	{ minValue:9000000, maxValue:10000000, swosValue:'1.9M' },
	{ minValue:10000000, maxValue:11500000, swosValue:'2M' },
	{ minValue:11500000, maxValue:13000000, swosValue:'2.25M' },
	{ minValue:13000000, maxValue:15000000, swosValue:'2.75M' },
	{ minValue:15000000, maxValue:18000000, swosValue:'3M' },
	{ minValue:18000000, maxValue:22000000, swosValue:'3.5M' },
	{ minValue:22000000, maxValue:26000000, swosValue:'4.5M' },
	{ minValue:26000000, maxValue:31000000, swosValue:'5M' },
	{ minValue:31000000, maxValue:41000000, swosValue:'6M' },
	{ minValue:41000000, maxValue:51000000, swosValue:'7M' },
	{ minValue:51000000, maxValue:61000000, swosValue:'8M' },
	{ minValue:61000000, maxValue:71000000, swosValue:'9M' },
	{ minValue:71000000, maxValue:91000000, swosValue:'10M' },
	{ minValue:91000000, maxValue:121000000, swosValue:'12M' },
	{ minValue:121000000, maxValue:900000000, swosValue:'15M' }
] ;

	for (var i = 0; i < valueRange2.length; i ++ ){
        if ( (valueStripped >= valueRange2[i].minValue) && (valueStripped < valueRange2[i].maxValue)) {
					return valueRange2[i].swosValue ;
				}
     }
 return 'no Set Price' ;
}

function convertStringValuetoNumber(original, substr, substr2) {
    var idx = original.indexOf(substr);
		

    if (idx != -1) {
				original = original.substr(0,idx);
				original = original.replace(',', '.');
        return parseFloat(original)*1000000;
    } else {
			var idx2 = original.indexOf(substr2);
			if (idx2 != -1) {
				original = original.substr(0,idx2);
				original = original.replace(',', '.');
        		return parseFloat(original)*1000 ;
   	 	}
       	 return original;
    }
}

async function parsePlayerStats (url) {
	const res1 = await fetch(url).then(res => res.text());
	const { document } = (new JSDOM(res1)).window;
	if (!document) return;

	let timeInPlay = document.querySelector('#yw1 .items td:last-child');
	if (!timeInPlay) return 0;
	timeInPlay = timeInPlay.textContent.replace('-', '0');

	return parseInt(timeInPlay, 10);
}



async function parseTable (res) {
	const { document } = (new JSDOM(res)).window;
	if (!document) return;
	const rows = document.querySelectorAll('#yw1 table.items>tbody>tr');
	const promises = Array.from(rows).map(parsePlayerRow);
	return Promise.all(promises);
}


function getPlayers (club) {
	console.log(`Getting players' details for ${club.name}...`);
	return fetch(club.url)
		.then(res => res.text())
		.then(parseTable)
		.then(res => {
			club.players = res.sort((a, b) =>  b.timeInPlay - a.timeInPlay);
			return club;
		});
}

module.exports = {
	getPlayers
};
