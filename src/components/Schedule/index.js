import './styles.scss';
import useFetch from '../../hooks/useFetch';

const Schedule = (props) => {
	const team = props.team;
	const proxyUrl = window.location.hostname === 'localhost' ? 'https://cors-anywhere.herokuapp.com/' : '';
	const scheduleUrl = `http://data.nba.com/data/v2015/json/mobile_teams/nba/2020/teams/${team.replace(' ', '_')}_schedule_02.json`;
	const { response, error } = useFetch(proxyUrl + scheduleUrl);

	const getGames = (data, limit) => {
		const games = [];
		let counter = 0;

		data.forEach((item, i) => {
			if (counter < limit && item.stt !== 'Final') {
				const isAway = item.h.tn.toLowerCase() !== team ? true : false;
				const date = new Date(item.etm);

				games.push({
					id: i,
					isToday: parseDate(new Date()) === parseDate(date),
					isAway: isAway,
					date: parseDate(date),
					time: parseTime(date),
					broadcasts: getBroadcasts(item.bd.b, ['natl', isAway ? 'away' : 'home']),
					team: isAway ? item.v : item.h,
					opponent: isAway ? item.h : item.v,
					location: [item.an, item.ac, item.as],
				});

				counter++;
			}
		});

		return games;
	};

	const parseDate = (date) => {
		return `${date.getMonth() + 1}/${date.getDate()}`;
	};

	const parseTime = (date) => {
		let h = date.getHours() - 3;
		let m = date.getMinutes();

		h = h > 12 ? h % 12 : h;
		m = m < 10 ? `0${m}` : m;

		return `${h}:${m} PM PT`;
	};

	const getBroadcasts = (broadcasts, scopes) => {
		const b = [];

		scopes.forEach((scope) => {
			broadcasts.forEach((item, i) => {
				if (item.scope === scope) {
					b.push(item);
				}
			});
		});

		return b;
	};

	return (
		<section className='schedule'>
			<header>
				<h2>2020-21 Upcoming Games:</h2>
			</header>
			{error && <p className='schedule-error'>Error Loading...</p>}
			<ul className='schedule-games'>{response && getGames(response.gscd.g, 3).map((item, i) => <Game key={i} item={item} />)}</ul>
			<footer></footer>
		</section>
	);
};

export default Schedule;

const Game = (props) => {
	const logoUrl = 'https://www.nba.com/.element/img/1.0/teamsites/logos/teamlogos_80x64/';
	const item = props.item;
	const liStyle = { transitionDelay: item.id / 5 + 's' };

	const onImgLoaded = (event) => {
		const id = parseInt(event.target.getAttribute('data-id'));

		if (id === 1) {
			const liElem = event.target.parentElement.parentElement.parentElement;
			liElem.classList.add('schedule-game-ready');
		}
	};

	return (
		<li className='schedule-game' style={liStyle}>
			<div>
				<div>
					<p className={`schedule-game-date ${item.isToday ? 'schedule-game-date-today' : ''}`}>{item.date}</p>
					<p className='schedule-game-time'>{item.time}</p>
				</div>
				<div className='schedule-game-team'>
					<img width='80' height='64' src={`${logoUrl + item.team.ta.toLowerCase()}.gif`} alt={`${item.team.tc} ${item.team.tn}`} data-id='0' onLoad={(event) => onImgLoaded(event)} />
					<p>{item.team.tc}</p>
				</div>
				<div className='schedule-game-designation'>
					<p>{item.isAway ? '@' : 'vs'}</p>
				</div>
				<div className='schedule-game-opponent'>
					<img width='80' height='64' src={`${logoUrl + item.opponent.ta.toLowerCase()}.gif`} alt={`${item.opponent.tc} ${item.opponent.tn}`} data-id='1' onLoad={(event) => onImgLoaded(event)} />
					<p>{item.opponent.tc}</p>
				</div>
			</div>
			<hr></hr>
			<div>
				<div className='schedule-game-broadcasts'>
					{item.broadcasts.map((item, i) => (
						<p key={i}>
							<span>{item.type === 'radio' ? 'ra' : item.type}</span>
							{item.disp}
						</p>
					))}
				</div>
				<div className='schedule-game-location'>
					<p>{item.location[0]}</p>
					<p>{`${item.location[1]}, ${item.location[2]}`}</p>
					<p className='schedule-game-cta'>
						<a href='https://watch.nba.com/streaming-subscriptions' target='_blank' rel='noreferrer'>
							Watch Live
						</a>
					</p>
				</div>
			</div>
		</li>
	);
};
