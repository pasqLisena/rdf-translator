const request = require('request');
const noop = require('node-noop').noop;
const validUrl = require('valid-url');

export default function rdfTranslator(str, source, target, callback = noop) {
  let err = null;
  if (!str)
    err = Error('Nothing to convert: null or empty string');
  if (!source || !target)
    err = Error('No source or target format are specified');

  return new Promise((resolve, reject) => {
    if (err) {
      callback(err);
      return reject(err);
    }

    let suffix = validUrl.isUri(str) ? str : 'content';
    let url = `http://rdf-translator.appspot.com/convert/${source}/${target}/${suffix}`;

    request.post({
      url: url,
      form: {
        content: str
      }
    }, function(err, response, body) {
      if (!err && response.statusCode != 200)
        err = response.statusCode;

      callback(err, body);
      if (err) reject(err);
      else resolve(body);
    });
  });
}

module.exports = rdfTranslator;
