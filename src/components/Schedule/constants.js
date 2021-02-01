export const LOGO_SVG = (team) => `https://i.cdn.turner.com/nba/nba/assets/logos/teams/primary/web/${team.toUpperCase()}.svg`;
export const LOGO_GIF = (team) => `https://www.nba.com/.element/img/1.0/teamsites/logos/teamlogos_80x64/${team.toLowerCase()}.gif`;

export const PROXY_URL = window.location.hostname === 'localhost' ? 'https://cors-anywhere.herokuapp.com/' : '';
export const SCHEDULE_URL = (team) => `http://data.nba.com/data/v2015/json/mobile_teams/nba/2020/teams/${team.replace(' ', '_')}_schedule_02.json`;
