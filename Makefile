node: | node_modules

node_modules:
	npm install

sass: node
	./node_modules/.bin/node-sass --output-style=nested --include-path=./node_modules/bourbon-neat/core/ --output=./static/styles/ ./frontend/styles/
