import config from "../config/config";
import { graphqlApiTrendingQuery } from "./query";

async function getTrending() {
    const url = config.GRAPHQL_URL;
    const query = graphqlApiTrendingQuery();
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            query: query,
        }),
    };
    const res = await fetch(url, options);
    let data:any = await res.json();
    data = {
        results: data["data"]["Page"]["media"],
    };
	console.log(config,"config value");
    return data;
}

const envValue = () => {
	return config;
}

export {
	getTrending,
	envValue
}
