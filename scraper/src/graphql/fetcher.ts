import config from '../config/config';
import { graphqlMediaDetailQuery, graphqlSearchQuery, graphqlTrendingQuery, graphqlUpcomingQuery } from './query';

async function fetchTrendingData() {
	const url = config.GRAPHQL_URL;
	const query = graphqlTrendingQuery();
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		body: JSON.stringify({
			query: query,
		}),
	};
	const res = await fetch(url, options);
	let data: any = await res.json();
	data = {
		results: data['data']['Page']['media'],
	};
	console.log(config, 'config value');
	return data;
}

async function fetchUpcommingData(page: number) {
	const url = config.GRAPHQL_URL;
	const query = graphqlUpcomingQuery(page);
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		body: JSON.stringify({
			query: query,
		}),
	};
	const res = await fetch(url, options);
	let data: any = await res.json();
	data = {
		results: data['data']['Page']['airingSchedules'],
	};
	return data;
}

async function fetchSearchData(query: {}) {
	const url = config.GRAPHQL_URL;
	query = graphqlSearchQuery(query, 1, 1);
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		body: JSON.stringify({
			query: query,
		}),
	};
	const res = await fetch(url, options);
	let data: any = await res.json();
	data = {
		results: data['data']['Page']['media'],
	};
	return data;
}

async function fetchAnimeData(id: number) {
	const url = config.GRAPHQL_URL;
	console.log(id);
	const query = graphqlMediaDetailQuery(id);
	console.log(query);
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		body: JSON.stringify({
			query: query,
		}),
	};
	const res = await fetch(url, options);
	let data: any = await res.json();
	let results = data['data']['Media'];
	results['recommendations'] = results['recommendations']['edges'];

	for (let i = 0; i < results['recommendations'].length; i++) {
		const rec = results['recommendations'][i];
		results['recommendations'][i] = rec['node']['mediaRecommendation'];
	}
	return results;
}

export { fetchTrendingData, fetchUpcommingData, fetchSearchData, fetchAnimeData };
