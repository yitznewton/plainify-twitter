.PHONY: pack google-chrome firefox character-library

google-chrome:
	$(MAKE) character-library
	node -e 'process.stdout.write(JSON.stringify(require("./not_for_distro/manifest-google-chrome").manifest) + "\n");' > manifest.json
	$(MAKE) pack

firefox:
	$(MAKE) character-library
	node -e 'process.stdout.write(JSON.stringify(require("./not_for_distro/manifest-firefox").manifest) + "\n");' > manifest.json
	$(MAKE) pack

character-library:
	node ./not_for_distro/build-character-data.js > character-map.json

pack:
	zip -x \*.git\* -x \*.idea\* -x \*not_for_distro\* -r ./plainify.zip .
