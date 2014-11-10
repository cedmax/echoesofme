module.exports = function(req, res) {
	'use strict';

	var domain = 'http://www.shazam.com';
	var cheerio = require( 'cheerio' );
	var request = require( 'request' );

	function list(){
		request(domain + '/charts', function(err, response, body){
			var $ = cheerio.load(body);

			var result = {};

			$('select option').each(function(i, option){
				option = $(option);
				result[option.text()] = option.attr('value');
			});

			res.json(result);
		});
	}

	function parse(){
		request(domain + uri, function(err, response, body){
			var $ = cheerio.load(body);
			var songs = [];
			$('[itemtype="http://schema.org/MusicRecording"]').each(function(i, songItem){
				songs.push({
					artist: $(songItem).find('[itemprop="byArtist"]').text().replace('by ', '').trim(),
					title: $(songItem).find('h4').text()
				});
			});
			res.json(songs);
		});
	}

	var uri = req && req.body && req.body.uri;

	if (uri) {
		parse(uri);
	} else {
		list();
	}

};