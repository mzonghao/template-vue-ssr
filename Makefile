.PHONY:build
build:
	npm install
	NODE_ENV=production npm run build
publish:
	npm install
	NODE_ENV=production npm run build
	npm start
