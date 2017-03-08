# OSM Edit Report

Reports editing activity of the Mapbox Data Team on [OpenStreetMap](http://www.openstreetmap.org/).


#Setup

- To setup `osm-edit-report` make sure you have `node` and `npm` installed.
- clone the repository and run `npm install`.
- run `npm start` to run the application in dev mode.(Note: this will automatically open a browser for you)


#Deploying
- To deploy changes make sure you first commit.
- run `npm deploy` to deploy on `hey-pages`
- run `npm run deploy-mb` to deploy it on `mb-pages` (aka mapbox.com).

#API and architecture

This project makes use of [react](https://facebook.github.io/react/), [redux](http://redux.js.org/docs/basics/UsageWithReact.html) and [ramda](http://ramdajs.com) . It hits the [osm-comments-api/stats](https://github.com/mapbox/osm-comments-api/blob/master/API.md) end point for the data.


Few things to note.
- The codebase doesn't hit the api for `user` filtering. It does it on the front-end.
- The codebase also doesn't hit the api for `tags` filtering and does the filtering itself.
- It relies on http code `304` for caching identical requests.

