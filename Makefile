run:
	npm start

install:
	npm install

dev:
	npm run proxy &
	npm run dev

proxy:
	nodemon src/proxy/server.js

.PHONY: dev
