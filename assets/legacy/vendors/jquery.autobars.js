/* global Handlebars */
/* global jQuery */
/*
 * this file is a basic helper utility for people
 * using handlebars.js. it allowes you to store several
 * handlebars templates seperated with
 *
 *       <!--#?templateid-->
 *
 *
 *       <!--#?end-->
 *
 * Created by Peter de Croos (Cultofmetatron)
 * blog.peterdecroos.com
 */

(function ($) {
  'use strict'
  let methods

  methods = {
    initialize () {},
    parseName (url) {
      let splitName, splitUrl, name

      splitUrl = url.split('/')
			// get everything past the last slash
      name = splitUrl[ splitUrl.length - 1 ]
			// strip querystring
      name = name.split('?')[ 0 ]
      splitName = name.split('.')
      if (splitName.length > 1) {
				// strip extension
        splitName = splitName.slice(0, -1)
      }
      return splitName.join('.')
    },
    parsePartials (data) {
      let endToken, separatorToken, END_TOKEN_SIZE,
        templates
			// first we seperate the strings with a regular expression
      separatorToken = /<!--#\?[a-zA-Z]+-->/ // matches the headers
      endToken = /<!--#\?end-->/
      END_TOKEN_SIZE = 12
      templates = {}
			// now we get the names of the partials
			//  first remove all white space characters that are in groups > 2
      data = data.split('\n').join('').split(/\s{2,}/).join('')
			// now that we have a whitespace stripped version,
			//  we loop through chunking them.
			// get the first token and extract the key
      while (data.match(separatorToken)) {
        const token = data.match(separatorToken)[ 0 ] // gets the first token
        const name = token.match(/[a-zA-Z]+/)[ 0 ] // the name we get token
        data = data.slice(token.length)
				// feed in characters till you get to the end tag.
        const endIndex = data.search(endToken)
        const source = data.slice(0, endIndex)
				// increment to the next size;
        data = data.slice(endIndex + END_TOKEN_SIZE)
        templates[ name ] = Handlebars.compile(source)
      }
			// register partials for use within Handlebars templates
			// for usage, see https://github.com/wycats/handlebars.js/#partials
      for (const key in templates) {
        if (Object.prototype.hasOwnProperty.call(templates, key)) {
          methods.registerPartial(key, templates[ key ])
        }
      }
    },
    registerPartial (key, partial) {
      if (typeof Handlebars.registerPartial === 'function') {
        Handlebars.registerPartial(key, partial)
      } else {
        $.handlebarTemplates.partials[ key ] = partial
      }
    },
    mainTemplates (context) {
      const pipe = [] // promise objects
      context.find('[type="text/x-handlebars-template"]')
				.each((index, element) => {
  const loadUrl = $(element).attr('src')
					// var name = loadUrl.match(/([^\/]+)(?=\.\w+$)/)[0];
  const name = methods.parseName(loadUrl)
					// here we gather all our promises
  pipe.push(
						$.ajax({
  url: loadUrl,
  dataType: 'text'
}).done((data) => {
  $.handlebarTemplates[ name ] = Handlebars.compile(data)
})
					)
})
      return pipe
    },
    partials (context) {
			// we take the nodes and pull out partials
      const pipe = [] // promise objects
      context.find('[type="text/x-handlebars-partial"]')
				.each((index, element) => {
					// handlebarTemplates = Handlebars.compile($(element).html());
  const loadUrl = $(element).attr('src')
					// gather the promises
  pipe.push(
						$.ajax({
  url: loadUrl,
  dataType: 'text'
}).done((data) => {
							// each pageload is performed asynchronously and so the data exists only in this
							// context. here we scrub the input and use it;
  methods.parsePartials(data)
})
					)
})
      return pipe
    }
  }
  $.fn.autoBars = function (options, callback) {
    const args = Array.prototype.slice.call(arguments, 0)
    if (args.length === 1 && typeof (args[ 0 ]) === 'function') {
			// checks if there's only one argument and sets the
			// callback to be the first
      callback = options
      options = {}
    }
		// so we don't overwrite it
    $.handlebarTemplates = $.handlebarTemplates || {}
    $.handlebarTemplates.partials = $.handlebarTemplates.partials || {}
    $.extend({
      loadHandlebars: false
    }, options)

		// gather all the promises from the multiple async calls
    const partialPromises = methods.partials(this)
    const templatesPromises = methods.mainTemplates(this)
    const promises = partialPromises.concat(templatesPromises)

		// we delay execution of the callback until all
		//  the promises are fulfilled!!
    if (typeof (callback) === 'function') {
      $.when.apply(this, promises).done(callback)
    }
		// return the original jquery object
    return this
  }
})(jQuery)
