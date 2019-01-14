# Swos Update Helper

Season after Season great sensible soccer community is updating the names and skills for the beautiful game . It is not an easy job as it requires a lot of time but the guys are still doing it. There are some excellent tools to help like armando's skill generator that is limited on team by team updates in excel. 
My idea creating this code was to help automating some of the data gathering from the transfermarket that can speed up updating of the data for the leagues (things like player names, nations and time they played this season),  

This is basically transfermarket scraper that takes league url of transfermarket and scrapes the data and creates SWOES2 editor friendly csv files per team that can be imported and edited after.

when you are using this code at minimum you would need to edit skin color of the players , often player position need to updated. 
if you are not happy with proposed 16 based of the minutes they played you can view the scraped squad in browser and edit based on that. 

## Features : 

- It will pick players that played the most minutes on their positions based on the transfermarket data and put them in the csv file for import.  

- Conversion rate from transfermarket to swos values are done based on the rules that were set in 16/17 community update (ok i altered them a bit as the prices started to be to crazy ), but it can be easily updated as it is only one json file that need to be changed. 

- Goalkeeper price is capped on 4.5M 

- It scrapes the formation data from transfermarket and translates it into swos formation - 4-3-2-1 becomes 4-5-1. If it needs to be mapped to 4-3-3 always it is easy to do the change. 

- it can get the last formation screenshot for the team to help see the squad formation and player positions. 

- it can get several screenshot per team per league - this still needs some testing. 

- it can scrape the data for national teams - experimental phase for europe 


## Environment

download node - latest version for your environment from https://nodejs.org/en/download/ 

clone the code from this repository : https://github.com/petarku/swosUpdateHelper 


## Install
```sh
> npm install
```

## Get names and values for league you want
if you want to scrape premier league you would type 
```sh
> node . -england  
```
it will create json file will league data in data folder inside project and will create csv files per team that can be imported into SWOES2 editor. CSV files will be stored in data-csv folder 


## Show data per league
if you want to see all scraped data for the league , together with player faces and more then 16 players in the club you would type
```sh
> node . -showLeague england 
```
it will open the browser data with data for league - all teams and players from transfermarket for desired league

## get latest screenshot of the formation
```sh
> node . -leagueScreenshot england
```
it will create png files per team of the league into data-png
