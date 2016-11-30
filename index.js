const request = require('request');
const noop = require('node-noop').noop;

export default function rdfTranslator(str, source, target, callback = noop) {
  if (!str)
    throw Error('Nothing to convert: null or empty string');
  if (!source || !target)
    throw Error('No source or target format are specified');

  let url = `http://rdf-translator.appspot.com/convert/${source}/${target}/content`;

  request.post({
    url: url,
    form: {
      content: str
    }
  }, function(err, response, body) {
    if (!err && response.statusCode != 200)
      err = response.statusCode;

    callback(err, body);
  });
}

module.exports = rdfTranslator;
