# Publishing new releases

> This doc is intended for the core maintainers of the library.

1. `npm run build && npm test` to verify it works
2. `npm run release` (first try it with `-- --dry-run`)
3. `git push --follow-tags origin master`
4. `npm run build` to release the new version
5. `cd dist/ngx-material-data-table && npm publish`
