let countryCodeMap = new Map([
  ['Romania', 'ROM'],
  ['Serbia', 'SER'],
  ['Poland', 'POL'],

]);

const positionCodeMap = new Map( [
  ['Goalkeeper',  'GK'],
  ['Right-Back',  'RB'],
  ['Centre-Back', 'D'],
  ['Left-Back',   'LB'],
  ['Right Winger', 'RW'],
  ['Left Winger', 'LW'],
  ['Central Midfield', 'M'],
  ['Defensive Midfield', 'M'],
  ['Attacking Midfield', 'M'],
  ['Centre-Forward', 'A'],
  ['Second Striker', 'A'],
  
]);

function getCountryCode(countryName) {
  return countryCodeMap.get(countryName); 
  

}

function getPositionCode(positionName) {
  return positionCodeMap.get(positionName); 
  

}

module.exports = {
	getCountryCode, getPositionCode
};
