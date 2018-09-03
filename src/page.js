function getLeagueList () {
	return fetch('src/leagues.json').then(res => res.json());
}


function getLeagueData (league) {
	return new Promise(resolve => {			// wrap in a promise to catch the missing file and return  empty
		fetch(`data/league-${league.name}.json`)
			.then(res => res.json())
			.then(resolve)
			.catch(() => resolve());
	})
}


function getPlayerHtml (player) {
	console.log(player);
	return `<tr class="player-row">
		<td><img src="${player.imgUrl}"></td>
		<td>${player.name}</td>
	</tr>`;
}

function getClubHtml (club) {
	const players = club.players.map(getPlayerHtml).join('');
	return `<h1><a href="${club.url}" target="_blank">${club.name}</a></h1>
		<table class="club">${players}</table>`;
}

function getListHtml (list) {
	return list.map(getClubHtml).join('');
}

function writeTable (lists) {
	const main = document.querySelector('main');
	main.innerHTML = lists.map(getListHtml).join('');
}


getLeagueList()
	.then(list => Promise.all(list.map(getLeagueData)))
	.then(list => list.filter(i => !!i))  // filter out empty lists
	.then(writeTable);


