import { useEffect, useState } from 'react';

const useFetch = (url, options) => {
	const [response, setResponse] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		const doFetch = async () => {
			try {
				const res = await fetch(url, options);
				const json = await res.json();

				if (!res.ok) {
					throw new Error(res.status);
				} else {
					setResponse(json);
				}
			} catch (err) {
				setError(err);
			}
		};

		doFetch();
	}, [url, options]);

	return { response, error };
};

export default useFetch;
