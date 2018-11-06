.PHONY:build
build:
	npm install
	NODE_ENV=production npm run build
start:
	npm install
	NODE_ENV=production npm run build
	npm start
publish:
	npm install
	npm run pm2
re-publish:
	pm2 delete emiya-template-vue-ssr
	git pull
	npm install
	npm run pm2
