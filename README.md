# MobileCoinView
This is the source code of a website which presents information about the [MobileCoin network](https://mobilecoin.com/) based on the data from the [`mc-crawler`](https://github.com/trudi-group/mc-crawler).

This data can be accessed through a API-endpoint provided by the Weizenbaum Institut.
If you want to access the oldest available data the url would be like this: [https://api.crawler.mc.trudi.group/v1/2021-08-23T20:00:00.007Z](https://api.crawler.mc.trudi.group/v1/2021-08-23T20:00:00.007Z)

This web page depends on a slightly improved version of the crawler which isn't deployed yet. You can find the extended source code on [GitHub](https://github.com/felixvonberlin/mc-crawler) too. 



If you want to host the page, you need to modify the starting date from which the updated crawler will be used, and eventually the endpoints URL if you don't want to use the given endpoint.
You can find this date in the file `index.js` in line `30` and the endpoint URL in line `17`.
