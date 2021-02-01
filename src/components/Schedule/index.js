import './styles.scss';
import * as Constants from './constants';
import useFetch from '../../hooks/useFetch';

const Schedule = (props) => {
	const team = props.team;
	const max = props.max;
	const { response, error } = useFetch(Constants.PROXY_URL + Constants.SCHEDULE_URL(team));

	const getGames = (data, max) => {
		const games = [];
		let counter = 0;

		data.forEach((item, i) => {
			const dateGame = new Date(item.etm);
			const dateNow = new Date();

			if (dateGame >= dateNow) {
				if (counter < max && item.stt.toLowerCase() !== 'final') {
					const isAway = item.h.tn.toLowerCase() !== team ? true : false;
					const isPostponed = item.stt.toLowerCase() === 'ppd' ? true : false;

					games.push({
						id: i,
						isToday: parseDate(dateNow) === parseDate(dateGame),
						isAway: isAway,
						isPostponed: isPostponed,
						date: parseDate(dateGame),
						time: item.stt,
						broadcasts: getBroadcasts(item.bd.b, ['natl', isAway ? 'away' : 'home']),
						team: isAway ? item.v : item.h,
						opponent: isAway ? item.h : item.v,
						location: [item.an, item.ac, item.as],
					});

					counter++;
				}
			}
		});

		// set header bg
		document.getElementsByClassName('schedule-header')[0].style.backgroundImage = `url('${Constants.LOGO_SVG(games[0].team.ta)}')`;

		return games;
	};

	const parseDate = (date) => {
		return `${date.getMonth() + 1}/${date.getDate()}`;
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
			<header className='schedule-header'>
				<h2>2020-21 Upcoming Games:</h2>
			</header>
			{error && <p className='schedule-error'>Error Loading...</p>}
			<ul className='schedule-games'>{response && getGames(response.gscd.g, max).map((item, i) => <Game key={i} item={item} />)}</ul>
			<footer></footer>
		</section>
	);
};

export default Schedule;

const Game = (props) => {
	const item = props.item;

	const onImgLoaded = (event) => {
		const id = parseInt(event.target.getAttribute('data-id'));

		if (id === 1) {
			const liElem = event.target.parentElement.parentElement.parentElement;
			liElem.classList.add('schedule-game-ready');
		}
	};

	return (
		<li className='schedule-game'>
			<div>
				<div>
					<p className={`schedule-game-date ${item.isToday ? 'schedule-game-date-today' : ''}`}>{item.date}</p>
					<p className='schedule-game-time'>{item.isPostponed ? 'postponed' : item.time}</p>
				</div>
				<div className='schedule-game-team'>
					<img width='70' height='70' src={Constants.LOGO_SVG(item.team.ta)} alt={`${item.team.tc} ${item.team.tn}`} data-id='0' onLoad={(event) => onImgLoaded(event)} />
					<p>{item.team.tc}</p>
				</div>
				<div className='schedule-game-designation'>
					<p>{item.isAway ? '@' : 'vs'}</p>
				</div>
				<div className='schedule-game-opponent'>
					<img width='70' height='70' src={Constants.LOGO_SVG(item.opponent.ta)} alt={`${item.opponent.tc} ${item.opponent.tn}`} data-id='1' onLoad={(event) => onImgLoaded(event)} />
					<p>{item.opponent.tc}</p>
				</div>
			</div>
			<hr></hr>
			<div>
				<div className='schedule-game-broadcasts'>
					{!item.isPostponed &&
						item.broadcasts.map((item, i) => (
							<p key={i}>
								<span>{item.type === 'radio' ? 'ra' : item.type}</span>
								{item.disp}
							</p>
						))}
				</div>
				<div className='schedule-game-location'>
					<p>{item.location[0]}</p>
					<p>{`${item.location[1]}, ${item.location[2]}`}</p>
					{!item.isPostponed && (
						<p className='schedule-game-cta'>
							<a href='https://watch.nba.com/streaming-subscriptions' target='_blank' rel='noreferrer'>
								Watch Live
							</a>
						</p>
					)}
				</div>
			</div>
		</li>
	);
};
