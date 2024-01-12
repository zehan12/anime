import config from '../config/config';
import { graphqlApiMediaDetailQuery, graphqlApiSearchQuery, graphqlApiTrendingQuery, graphqlApiUpcomingQuery } from './query';

async function getTrending() {
	const url = config.GRAPHQL_URL;
	const query = graphqlApiTrendingQuery();
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

async function getUpcomming(page: number) {
	const url = config.GRAPHQL_URL;
	const query = graphqlApiUpcomingQuery(page);
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

async function getSearch(query: {}) {
	const url = 'https://graphql.anilist.co';
	query = graphqlApiSearchQuery(query, 1, 1);
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

async function getAnime(id: number) {
	const url = config.GRAPHQL_URL;
	console.log(id);
	const query = graphqlApiMediaDetailQuery(id);
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

export { getTrending, getUpcomming, getSearch, getAnime };
