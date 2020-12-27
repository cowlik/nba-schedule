import './styles.scss';
import Schedule from '../components/Schedule';

const App = () => {
	const query = new URLSearchParams(window.location.search);
	const team = query.get('team') && query.get('team') !== '' ? query.get('team') : 'trail blazers';

	return (
		<main className='App'>
			<section>
				<img src='https://www.nba.com/blazers/sites/blazers/files/pod_fc_122220.jpg' alt='Podcast'></img>
				<h2>PODCAST » 2020-21 Season Preview Edition Of The Unnamed Trail Blazers Podcast</h2>
				<p>Welcome to the 2020-21 regular season! With the Trail Blazers starting their campaign by hosting the Utah Jazz Wednesday night at the Moda Center, Brooke Olzendam, the Swiss Army Knife of the Trail Blazers broadcast crew, and I, Casey Holdahl of Trailblazers.com, got together digitally to record the second edition of the Unnamed Trail Blazers Podcast, which will not go another edition without an official title...</p>
			</section>
			<aside>
				<Schedule team={team} />
			</aside>
		</main>
	);
};

export default App;
