export function graphqlApiTrendingQuery(page = 1, perPage = 10, type = 'ANIME') {
    return `query ($page: Int = ${page}, $id: Int, $type: MediaType = ${type}, $isAdult: Boolean = false, $size: Int = ${perPage}, $sort: [MediaSort] = [TRENDING_DESC, POPULARITY_DESC]) { Page(page: $page, perPage: $size) { pageInfo { total perPage currentPage lastPage hasNextPage } media(id: $id, type: $type, isAdult: $isAdult, sort: $sort) { id status(version: 2) title { userPreferred romaji english native } genres description format bannerImage coverImage{ extraLarge large medium color } episodes meanScore season seasonYear averageScore } } }`;
}

export function graphqlApiUpcomingQuery(page: number) {
    const perPage = 20;
    const notYetAired = true;
    return `query { Page(page: ${page}, perPage: ${perPage}) { pageInfo { total perPage currentPage lastPage hasNextPage } airingSchedules( notYetAired: ${notYetAired}) { airingAt episode media { id description idMal title { romaji english userPreferred native } countryOfOrigin description popularity bannerImage coverImage { extraLarge large medium color } genres averageScore seasonYear format } } } }`;
}

export function graphqlApiSearchQuery(query: {}, page: number, perPage = 10, type = 'ANIME') {
    return `query ($page: Int = ${page}, $id: Int, $type: MediaType = ${type}, $search: String = "${query}", $isAdult: Boolean = false, $size: Int = ${perPage}) { Page(page: $page, perPage: $size) { pageInfo { total perPage currentPage lastPage hasNextPage } media(id: $id, type: $type, search: $search, isAdult: $isAdult) { id status(version: 2) title { userPreferred romaji english native } bannerImage popularity coverImage{ extraLarge large medium color } episodes format season description seasonYear averageScore genres  } } }`;
}

export function graphqlApiMediaDetailQuery(id: number) {
    return `query ($id: Int = ${id}) { Media(id: $id) { id title { english native romaji userPreferred } coverImage { extraLarge large color } bannerImage season seasonYear description type format status(version: 2) episodes genres averageScore popularity meanScore recommendations { edges { node { id mediaRecommendation { id meanScore title { romaji english native userPreferred } status episodes coverImage { extraLarge large medium color } bannerImage format } } } } } }`;
}
