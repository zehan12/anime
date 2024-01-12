// @ts-nocheck
import { DLScrapper, getAuthKey, scrapeAnimeData, scrapeEpisodeData, scrapePopularAnimeData, scrapeRecentAnimeData, scrapeSearchData } from './cheerio/scraper';
import { fetchAnimeData, fetchSearchData, fetchTrendingData, fetchUpcommingData } from './graphql/fetcher';

export interface Env {}

let CACHE:any = {};
let HOME_CACHE:any = {};
let ANIME_CACHE:any = {};
let SEARCH_CACHE:any = {};
let REC_CACHE:any = {};
let RECENT_CACHE:any = {};
let GP_CACHE:any = {};
let AT_CACHE:any = {};

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = request.url;
		try {
			if (url.includes('/search/')) {
				let query, page;
				try {
					if (url.includes('?page=')) {
						query = url.split('/search/')[1].split('?')[0];
						page = url.split('/search/')[1].split('?page=')[1];
					} else {
						query = url.split('/search/')[1];
						page = 1;
					}
				} catch (err) {
					query = url.split('/search/')[1];
					page = 1;
				}

				if (SEARCH_CACHE[query + page.toString()] != null) {
					const t1 = Math.floor(Date.now() / 1000);
					const t2 = SEARCH_CACHE[`time_${query + page.toString()}`];
					if (t1 - t2 < 60 * 60) {
						const json = JSON.stringify({
							results: SEARCH_CACHE[query + page.toString()],
						});
						return new Response(json, {
							headers: { 'Access-Control-Allow-Origin': '*' },
						});
					}
				}
				const data = await scrapeSearchData(query, page);
				SEARCH_CACHE[query + page.toString()] = data;
				SEARCH_CACHE[`time_${query + page.toString()}`] = Math.floor(Date.now() / 1000);
				const json = JSON.stringify({ results: data });

				return new Response(json, {
					headers: { 'Access-Control-Allow-Origin': '*' },
				});
			} else if (url.includes('/home')) {
				if (HOME_CACHE['data'] != null) {
					const t1 = Math.floor(Date.now() / 1000);
					const t2 = HOME_CACHE['time'];
					if (t1 - t2 < 60 * 60) {
						const json = JSON.stringify({
							results: HOME_CACHE['data'],
						});
						return new Response(json, {
							headers: { 'Access-Control-Allow-Origin': '*' },
						});
					}
				}
				let fetchTrending = [];
				let scrapePopular = [];
				try {
					fetchTrending = (await fetchTrendingData())['results'];
				} catch (err) {
					fetchTrending = [];
					console.log(err);
				}
				try {
					scrapePopular = await scrapePopularAnimeData();
				} catch (err) {
					scrapePopular = [];
				}
				const data = { fetchTrending, scrapePopular };
				HOME_CACHE['data'] = data;
				HOME_CACHE['time'] = Math.floor(Date.now() / 1000);
				const json = JSON.stringify({ results: data });

				return new Response(json, {
					headers: { 'Access-Control-Allow-Origin': '*' },
				});
			} else if (url.includes('/anime/')) {
				let anime = url.split('/anime/')[1];

				if (ANIME_CACHE[anime] != null) {
					const t1 = Math.floor(Date.now() / 1000);
					const t2 = ANIME_CACHE[`time_${anime}`];
					if (t1 - t2 < 60 * 60) {
						const json = JSON.stringify({
							results: ANIME_CACHE[anime],
						});
						return new Response(json, {
							headers: { 'Access-Control-Allow-Origin': '*' },
						});
					}
				}
				let data;
				try {
					data = await scrapeAnimeData(anime);
					if (data.name == '') {
						throw new Error('Not found');
					}
					data.source = 'scrape';
				} catch (err) {
					try {
						// try to get by search on gogo
						const search = await scrapeSearchData(anime);
						anime = search[0].id;
						data = await scrapeAnimeData(anime);
						data.source = 'scrape';
					} catch (err) {
						// try to get by search on fetch
						const search = await fetchSearchData(anime);
						anime = search['results'][0].id;
						data = await fetchAnimeData(anime);
						data.source = 'fetch';
					}
				}

				if (data == {}) {
					throw new Error('Not found');
				}
				ANIME_CACHE[anime] = data;
				ANIME_CACHE[`time_${anime}`] = Math.floor(Date.now() / 1000);
				const json = JSON.stringify({ results: data });

				return new Response(json, {
					headers: { 'Access-Control-Allow-Origin': '*' },
				});
			} else if (url.includes('/episode/')) {
				const id = url.split('/episode/')[1];
				const data = await scrapeEpisodeData(id);
				const json = JSON.stringify({ results: data });

				return new Response(json, {
					headers: { 'Access-Control-Allow-Origin': '*' },
				});
			} else if (url.includes('/download/')) {
				const query = url.split('/download/')[1];
				const timeValue = CACHE['timeValue'];
				const cookieValue = CACHE['cookieValue'];

				let cookie = '';

				if (timeValue != null && cookieValue != null) {
					const currentTimeInSeconds = Math.floor(Date.now() / 1000);
					const timeDiff = currentTimeInSeconds - timeValue;

					if (timeDiff > 10 * 60) {
						cookie = await getAuthKey();
						CACHE.cookieValue = cookie;
					} else {
						cookie = cookieValue;
					}
				} else {
					const currentTimeInSeconds = Math.floor(Date.now() / 1000);
					CACHE.timeValue = currentTimeInSeconds;
					cookie = await getAuthKey();
					CACHE.cookieValue = cookie;
				}

				const data = await DLScrapper(query, cookie);

				const json = JSON.stringify({ results: data });
				return new Response(json, {
					headers: { 'Access-Control-Allow-Origin': '*' },
				});
			} else if (url.includes('/recent/')) {
				const page = url.split('/recent/')[1];

				if (RECENT_CACHE[page] != null) {
					const t1 = Math.floor(Date.now() / 1000);
					const t2 = RECENT_CACHE[`time_${page}`];
					if (t1 - t2 < 5 * 60) {
						const json = JSON.stringify({
							results: RECENT_CACHE[page],
						});
						return new Response(json, {
							headers: { 'Access-Control-Allow-Origin': '*' },
						});
					}
				}

				const data = await scrapeRecentAnimeData(page);
				const json = JSON.stringify({ results: data });

				RECENT_CACHE[page] = data;
				RECENT_CACHE[`time_${page}`] = Math.floor(Date.now() / 1000);

				return new Response(json, {
					headers: { 'Access-Control-Allow-Origin': '*' },
				});
			} else if (url.includes('/recommendations/')) {
				let anime = url.split('/recommendations/')[1];

				if (REC_CACHE[anime] != null) {
					const t1 = Math.floor(Date.now() / 1000);
					const t2 = REC_CACHE[`time_${anime}`];
					if (t1 - t2 < 60 * 60) {
						const json = JSON.stringify({
							results: REC_CACHE[anime],
						});
						return new Response(json, {
							headers: { 'Access-Control-Allow-Origin': '*' },
						});
					}
				}

				const search = await fetchSearchData(anime);
				anime = search['results'][0].id;
				let data = await fetchAnimeData(anime);
				data = data['recommendations'];
				REC_CACHE[anime] = data;
				const json = JSON.stringify({ results: data });

				return new Response(json, {
					headers: { 'Access-Control-Allow-Origin': '*' },
				});
			} else if (url.includes('/gogoPopular/')) {
				let page = url.split('/gogoPopular/')[1];

				if (GP_CACHE[page] != null) {
					const t1 = Math.floor(Date.now() / 1000);
					const t2 = GP_CACHE[`time_${page}`];
					if (t1 - t2 < 10 * 60) {
						const json = JSON.stringify({
							results: GP_CACHE[page],
						});
						return new Response(json, {
							headers: { 'Access-Control-Allow-Origin': '*' },
						});
					}
				}

				let data = await scrapePopularAnimeData(page, 20);
				GP_CACHE[page] = data;

				const json = JSON.stringify({ results: data });

				return new Response(json, {
					headers: { 'Access-Control-Allow-Origin': '*' },
				});
			} else if (url.includes('/upcoming/')) {
				let page = url.split('/upcoming/')[1];

				if (AT_CACHE[page] != null) {
					const t1 = Math.floor(Date.now() / 1000);
					const t2 = AT_CACHE[`time_${page}`];
					if (t1 - t2 < 60 * 60) {
						const json = JSON.stringify({
							results: AT_CACHE[page],
						});
						return new Response(json, {
							headers: { 'Access-Control-Allow-Origin': '*' },
						});
					}
				}

				let data = await fetchUpcommingData(page);
				data = data['results'];
				AT_CACHE[page] = data;

				const json = JSON.stringify({ results: data });

				return new Response(json, {
					headers: { 'Access-Control-Allow-Origin': '*' },
				});
			}
			const text = `Api Is Up... Support
Routes :
				
/home
/search/{query}
/anime/{id}
/episode/{id}
/download/{id}
/recent/{page}
/recommendations/{id}
/gogoPopular/{page}
/upcoming/{page}
				`;
			return new Response(text, {
				headers: { 'content-type': 'text/plain' },
			});
		} catch (error: any) {
			return new Response(error.toString(), { status: 500 });
		}
	},
};
