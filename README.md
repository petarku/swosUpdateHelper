# Swos Update Helper

Season after Season great sensible soccer community is updating the names and skills for the beautiful game . It is not an easy job as it requires a lot of time but the guys are still doing it. There are some excellent tools to help like armando's skill generator that is working in excel but updating teams one by one. 
My idea creating this code was to help automating some of the data gathering from the transfermarket. 

This is basically transfermarket scraper that takes league url and scrapes the data and creates SWOES2 editor friendly csv files per team that can be imported.  
Features : 

It will choose players that played the most minutes on their positions based on the transfermarket data.  
Conversion rate from transfermarket to swos values are done based on the rules that were set in 16/17 community update (ok i altered them a bit as the prices started to be to crazy ), but it can be easily updated as it is only one json file that need to be changed. 
Goalkeeper price is capped on 4.5M 
It scrapes the formation data from transfermarket and translates it into swos formation - 4-3-2-1 becomes 4-5-1. If it needs to be mapped to 4-3-3 always it is easy to do the change. 
it can get the last formation screenshot for the team to help see the squad. 
it can get several screenshot per team per league - this still needs some testing. 




## Environment

download node - latest version 
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
it will open the browser data with 
