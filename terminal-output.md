> be-nc-news@1.0.0 test
> jest /Users/knowexcuses/be-nc-news/be-nc-news/**tests**/app.test.js

console.log
{
'GET /api': {
description: 'serves up a json representation of all the available endpoints of the api'
},
'GET /api/topics': {
description: 'serves an array of all topics',
queries: [],
exampleResponse: { topics: [Array] }
},
'GET /api/articles': {
description: 'serves an array of all articles',
queries: [ 'author', 'topic', 'sort_by', 'order' ],
exampleResponse: { articles: [Array] }
}
}

      at __tests__/app.test.js:39:14
