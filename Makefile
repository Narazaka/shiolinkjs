LIB = lib
SRC = src
LIB_SOURCES = $(SRC)/$(LIB)/shiolink.coffee
TARGETS = $(LIB)/shiolink.js

all: $(TARGETS)

clean :
	rm  $(TARGETS)

$(LIB)/shiolink.js: $(LIB_SOURCES)
	coffee -cmbj $@ $^

test:
	mocha test

doc: ../../gh-pages/doc/index.html
../../gh-pages/doc/index.html:  $(LIB_SOURCES)
	codo --name "ShiolinkJS" --title "ShiolinkJS Documentation" -o ../../gh-pages/doc src

.PHONY: test doc
