import './styles.scss';
import Schedule from '../components/Schedule';

const App = () => {
	const query = new URLSearchParams(window.location.search);
	const team = query.get('team') && query.get('team') !== '' ? query.get('team') : 'trail blazers';
	const max = query.get('max') && query.get('max') !== '' ? query.get('max') : 4;

	return (
		<main className='App'>
			<Schedule team={team} max={max} />
		</main>
	);
};

export default App;
