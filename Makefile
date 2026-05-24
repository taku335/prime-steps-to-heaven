.PHONY: setup dev build preview clean

setup:
	npm install

dev:
	npm run dev -- --host 0.0.0.0

build:
	npm run build

preview:
	npm run preview -- --host 0.0.0.0

clean:
	rm -rf node_modules dist
