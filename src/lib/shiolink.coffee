### (C) 2014 Narazaka : Licensed under The MIT License - http://narazaka.net/license/MIT?2014 ###

if require?
	ShioriJK = require 'shiorijk'

# SHIOLINK protocol interface.
# This parses SHIOLINK protocol and passes data to basic "SHIORI engine" and response to out.
class ShiolinkJS
	# @param engine [Engine] engine
	# @note Engine must implements load(), request(), unload()
	constructor : (@engine) ->
		@request_parser = new ShioriJK.Shiori.Request.Parser()
		@state = 'shiolink'
	# @property [Engine] engine
	engine: null
	# @property [ShioriJK.Shiori.Request.Parser] parser
	request_parser: null
	# @nodoc
	shiolink_state:
		L : 'load'
		R : 'request'
		U : 'unload'
	# @nodoc
	shiolink_load : (directory) ->
		if @engine.load?
			@engine.load directory
		return
	# @nodoc
	shiolink_request : (id) ->
		@state = 'request'
		"*S:#{id}\r\n"
	# @nodoc
	shiolink_unload : ->
		if @engine.unload?
			@engine.unload()
	# append SHIOLINK protocol chunk
	# @param chunk [String] SHIOLINK protocol chunk
	# @return [String] add_lines()'s result
	add_chunk : (chunk) ->
		lines = chunk.split /\r\n/
		if chunk.match /\r\n$/
			lines.pop()
		@add_lines lines
	# append SHIOLINK protocol chunk lines
	# @param lines [Array<String>] SHIOLINK protocol chunk lines separated by \r\n
	# @return [String] add_line()'s result
	add_lines : (lines) ->
		results = []
		for line in lines
			result = null
			if result = @add_line line
				results.push result
		results.join ''
	# append SHIOLINK protocol chunk line
	# @param line [String] SHIOLINK protocol chunk line
	# @return [String] if request transaction is completed, response transaction string, and if not, none.
	add_line : (line) ->
		switch @state
			when 'shiolink'
				if result = line.match /^\*(L|S|U):(.*)$/
					switch result[1]
						when 'L' then @shiolink_load result[2]
						when 'S' then @shiolink_request result[2]
						when 'U' then @shiolink_unload result[2]
			when 'request'
				parser_result = @request_parser.parse_line line
				if parser_result.state == 'end'
					@state = 'shiolink'
					response = @engine.request parser_result.result
					"#{response}"

# Engine class
# @abstract implement engines as this abstract
class Engine
	# SHIORI(SHIOLINK) load
	# @param dllpath [String] SHIORI DLL's path
	load: (dllpath) ->
	# SHIORI(SHIOLINK) request
	# @param request [ShioriJK.Message.Request] SHIORI Request Message (can treat as string)
	# @return [StringLike] response SHIORI Response (must be able to treat as string)
	request: (request) ->
	# SHIORI(SHIOLINK) unload
	unload: ->

if module? and module.exports?
	module.exports = ShiolinkJS
