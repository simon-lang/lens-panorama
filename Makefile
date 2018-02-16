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

.PHONY: dev test
