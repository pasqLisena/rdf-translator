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


test.cb('return an error on missing string', t => {
  t.plan(2);
  rdfTranslator('', 'xml', 'n3')
    .catch(err => {
      t.truthy(err);
      t.is(err.message, 'Nothing to convert: null or empty string');
      t.end();
    });

});

test.cb('return an error on missing source format', t => {
  t.plan(2);
  rdfTranslator(input, null, 'anything')
    .catch(err => {
      t.truthy(err);
      t.is(err.message, 'No source or target format are specified');
      t.end();
    });
});

test.cb('return an error on missing target format', t => {
  t.plan(2);
  rdfTranslator(input, 'xml', null)
    .catch(err => {
      t.truthy(err);
      t.is(err.message, 'No source or target format are specified');
      t.end();
    });
});

test.cb('convert xml to n3', t => {
  t.plan(2);
  rdfTranslator(input, 'xml', 'n3', function(err, data) {
    t.falsy(err);
    t.is(flattenTtl(data), flattenTtl(output));
    t.end();
  });
});

test.cb('convert from uri', t => {
  t.plan(2);

  let uri = 'https://raw.githubusercontent.com/DOREMUS-ANR/doremus-ontology/master/doremus.ttl';
  rdfTranslator(uri, 'n3', 'json-ld', function(err, data) {
    t.falsy(err);
    t.truthy(JSON.parse(data)['@context']);
    t.end();
  });

});


test.cb('using promises', t => {
  t.plan(1);

  let uri = 'https://raw.githubusercontent.com/DOREMUS-ANR/doremus-ontology/master/doremus.ttl';
  rdfTranslator(uri, 'n3', 'json-ld')
    .then(data => {
      t.truthy(JSON.parse(data)['@context']);
      t.end();
    });
});


function flattenTtl(ttl) {
  return ttl.replace(/[\n\r\s]/g, '');
}
