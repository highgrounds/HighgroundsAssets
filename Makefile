DEFAULT: dist/highgrounds.json
PHONY: clean

dist/highgrounds.json: xml/1stEdition.xml dist
	node tools/tojson.js $< > $@

dist:
	mkdir dist

clean:
	rm dist/*
