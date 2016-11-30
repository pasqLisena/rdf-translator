import test from 'ava';
import rdfTranslator from './index';

var input = `
    <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
             xmlns:foaf="http://xmlns.com/foaf/0.1/">
     <foaf:Person rdf:about="http://dbpedia.org/page/Spider-Man">
       <foaf:name>Peter Parker</foaf:name>
       <foaf:mbox rdf:resource="mailto:peter.parker@dailybugle.com"/>
     </foaf:Person>
    </rdf:RDF>
  `;
var output = `
    @prefix foaf: <http://xmlns.com/foaf/0.1/> .
    @prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
    @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
    @prefix xml: <http://www.w3.org/XML/1998/namespace> .
    @prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

    <http://dbpedia.org/page/Spider-Man> a foaf:Person ;
        foaf:mbox <mailto:peter.parker@dailybugle.com> ;
        foaf:name "Peter Parker" .
    `;


test('throw error on missing string', t => {
  const error = t.throws(() => {
    rdfTranslator('', 'xml', 'n3');
  }, Error);

  t.is(error.message, 'Nothing to convert: null or empty string');
});

test('throws error on missing source format', t => {
  const error = t.throws(() => {
    rdfTranslator(input);
  }, Error);

  t.is(error.message, 'No source or target format are specified');
});

test('throws error on missing target format', t => {
  const error = t.throws(() => {
    rdfTranslator(input, 'xml');
  }, Error);

  t.is(error.message, 'No source or target format are specified');
});

test.cb('convert xml to n3', t => {
  t.plan(2);

  rdfTranslator(input, 'xml', 'n3', function(err, data) {
    t.falsy(err);
    t.is(flattenTtl(data), flattenTtl(output));
    t.end();
  });
});


function flattenTtl(ttl) {
  return ttl.replace(/[\n\r\s]/g, '');
}
