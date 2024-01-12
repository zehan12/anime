export function graphqlApiTrendingQuery(page = 1, perPage = 10, type = "ANIME") {
    return `query ($page: Int = ${page}, $id: Int, $type: MediaType = ${type}, $isAdult: Boolean = false, $size: Int = ${perPage}, $sort: [MediaSort] = [TRENDING_DESC, POPULARITY_DESC]) { Page(page: $page, perPage: $size) { pageInfo { total perPage currentPage lastPage hasNextPage } media(id: $id, type: $type, isAdult: $isAdult, sort: $sort) { id status(version: 2) title { userPreferred romaji english native } genres description format bannerImage coverImage{ extraLarge large medium color } episodes meanScore season seasonYear averageScore } } }`;
}