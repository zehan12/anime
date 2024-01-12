import { scrapeAnimeData, scrapePopularAnimeData } from "./cheerio/scraper";

export interface Env {}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		try {
			const url = new URL(request.url);
			console.log(url);
			const trending = (await scrapePopularAnimeData());
			let data = { trending };
			const json = JSON.stringify({ results: data });
			if (json)
				return new Response(json, {
					headers: { 'Access-Control-Allow-Origin': '*' },
				});
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
