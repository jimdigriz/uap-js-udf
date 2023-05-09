SHELL = /bin/sh
.DELETE_ON_ERROR:

CLEAN =
DISTCLEAN =

.PHONY: all
all: regexes.js

regexes.yaml:
	curl -f --compressed -L -o $@ https://raw.githubusercontent.com/ua-parser/uap-core/master/regexes.yaml
DISTCLEAN += regexes.yaml

# https://www.commandlinefu.com/commands/view/12218/convert-yaml-to-json
regexes.json: regexes.yaml
	python3 -c 'import sys, yaml, json; json.dump(yaml.safe_load(sys.stdin), sys.stdout)' < $< > $@
CLEAN += regexes.json

regexes.js: regexes.json
	printf "const regexes = %s;\n" "$$(cat $<)" > $@
CLEAN += regexes.js

.PHONY: clean
clean:
	rm -rf $(CLEAN)

.PHONY: distclean
distclean: clean
	rm -rf $(DISTCLEAN)

deploy: BUCKET ?= requester-pays.coremem.com
deploy: regexes.js
	gsutil cp -J regexes.js uaparser.js gs://$(BUCKET)/uap-js-udf/
	gsutil acl ch -r -g AllAuth:R gs://$(BUCKET)/uap-js-udf
