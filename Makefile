build:
	npm run build

run:
	npm start

install:
	npm install

dev:
	npm run proxy &
	npm run dev

proxy:
	nodemon src/proxy/server.js

test:
	npm test

watch-test:
	npm run test:watch

deploy:
	cp -R ./dist/* ~/lens-ui/dist
	cp ./dist/index.html ~/bambi/web/src/main/webapp/WEB-INF/freemarker/app.ftl

# usage make component name=widget
component:
	mkdir -p src/components/$(name)
	touch src/components/$(name)/$(name).html
	touch src/components/$(name)/$(name).scss
	cp src/components/base.ts src/components/$(name)/$(name).ts
	echo "export * from './$(name)'" > src/components/$(name)/index.ts

.PHONY: dev test
