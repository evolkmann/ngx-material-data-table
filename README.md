# NgxMaterialDataTable

This class enables you to create functional tables quickly based on
[`@angular/material/table`](https://material.angular.io/components/table)
without the need to write a lot of boilerplate code.
It includes the following features:

- Observable based data source
- Extendable config based on page, pageSize and optional orderBy
- Live persistance of table config in a query param
- Restoring of table config based on query param
- Clean component, just pass all options in the constructor
- Optional select column that works across pages

## Run a demo

1. `npm i`
2. `npm start`
3. Open [http://localhost:4200](http://localhost:4200)

## Semantic Versioning & Releases

Make sure you follow the commit message guidelines from
[conventionalcommits.org](https://www.conventionalcommits.org).

### Publishing new releases

1. `npm run build` to verify it works
2. `npm run release` (first try it with `-- --dry-run`)
3. `git push --follow-tags origin master`
4. `npm run build` to release the new version
5. `cd dist/ngx-material-data-table && npm publish`
