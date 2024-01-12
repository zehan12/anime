/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { getRecentAnimeData, getSearchData } from './cheerio/scraper';
import { getTrending } from './graphql/api';
export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
	//
	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
	// MY_SERVICE: Fetcher;
	//
	// Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
	// MY_QUEUE: Queue;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		try {
			const url = new URL(request.url);
			console.log(url);
			const trending = (await getRecentAnimeData());
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
