SHELL = /bin/sh
.DELETE_ON_ERROR:

CLEAN =
DISTCLEAN =

.PHONY: all
all:

regexes.yaml:
	curl -f --compressed -L -o $@ https://raw.githubusercontent.com/ua-parser/uap-core/master/regexes.yaml
DISTCLEAN += regexes.yaml

# https://www.commandlinefu.com/commands/view/12218/convert-yaml-to-json
regexes.json: regexes.yaml
	python3 -c 'import sys, yaml, json; json.dump(yaml.load(sys.stdin), sys.stdout)' < $< > $@
CLEAN += regexes.json

.PHONY: clean
clean:
	rm -rf $(CLEAN)

.PHONY: distclean
distclean: clean
	rm -rf $(DISTCLEAN)
