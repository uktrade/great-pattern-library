node: | node_modules

node_modules:
	npm install

static/images static/styles static/vendor static/scripts:
	gulp build

gulp: | node static/images static/styles static/vendor static/scripts

sass: node gulp
	./node_modules/.bin/node-sass --output-style=nested --include-path=./node_modules/bourbon-neat/core/ --output=./static/styles/ ./frontend/styles/
