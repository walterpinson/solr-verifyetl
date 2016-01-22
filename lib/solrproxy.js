var assert = require("assert");
var http = require('http');


var SolrProxy = function(args){

    assert.ok(args.baseUrl, "Solr server base URI is required");
    assert.ok(args.core, "Core name is required");
    assert.ok(args.identifierName, "The field that identifies the document is required");
    
    // Properties and Fields
    /////////////////////////////////////////////////
    
    // Private
    var baseUrl = args.baseUrl;
    var core = args.core;
    var identifierName = args.identifierName;
    var startQuery = '/select?q=' + identifierName + ':';
    var endQuery = '&fl=none&wt=json&indent=true&omitHeader=true';
    var encoding = 'utf-8';
       
    // Public
    var solrEndPoint = buildSolrEndPoint();
    var currentQuery = {};
    
    // Interface
    return {
        // Properties
        solrEndPoint: solrEndPoint,
        currentQuery: currentQuery,
                
        // Methods
        documentExists: documentExists
    };
    
    // Object methods
    /////////////////////////////////////////////////
    
    // Public
    function documentExists(id, callback){
        assert.ok(id, "A document id is required");
        
        // Initialize the current query string
        this.currentQuery = solrEndPoint + startQuery + id + endQuery;
        
        // Set up and issue http request
        var request = http.get(this.currentQuery, function(response){
            response.setEncoding(encoding);
            var buffer ='';
            var exists = false;
            
            response.on('data', function(data) {
                buffer += data;
            });
            
            response.on('end', function(){
                var solr = JSON.parse(buffer);
                if(solr.response.numFound > 0){
                    exists = true;
                }
                callback(null, id, exists);
            });
        });
        
        request.on('error', function(e){
            var error = {};
            error.message = e;
            callback(error, id, null);
        });
        
        request.end();
    }
    
    // Private
    function buildSolrEndPoint() {
        
        var endpoint;
        if(baseUrl.indexOf("http://") == -1){
            endpoint = "http://" + baseUrl;
        }
        else{
            endpoint = baseUrl;
        }
        
        return endpoint + '/solr/' + core;
    }
};

module.exports = SolrProxy;