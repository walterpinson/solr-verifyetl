/* jshint -W030 */

var should = require("should");
var SolrProxy = require("../lib/solrproxy");

describe("SolrProxy", function(){
    
    describe("defaults", function(){
        var solrProxy = {};
        var expectedEndpoint;
        
        before(function(){
            solrProxy = SolrProxy({
                baseUrl: "http://server.com",
                core: "Client_MyClient",
                identifierName: "myIdentifier"
            });
            
            expectedEndpoint = 'http://server.com' + '/solr/' + 'Client_MyClient';
        });
        
        it("solr endpoint is properly initialized when baseUrl includes 'http://'", function(){
            solrProxy.solrEndPoint.should.be.equal(expectedEndpoint);
        });
        it("current query is defined", function(){
            solrProxy.currentQuery.should.be.defined;
        });
    });
    
    describe("defaults - server name only", function(){
        var solrProxy = {};
        var expectedEndpoint;
        
        before(function(){
            solrProxy = SolrProxy({
                baseUrl: "server.com",
                core: "Client_MyClient",
                identifierName: "myIdentifier"
            });
            
            expectedEndpoint = 'http://server.com' + '/solr/' + 'Client_MyClient';
        });
        
        it("solr endpoint is properly initialized when baseUrl does not include 'http://'", function(){
            solrProxy.solrEndPoint.should.be.equal(expectedEndpoint);
        });
        it("current query is defined", function(){
            solrProxy.currentQuery.should.be.defined;
        });
    });   
     
    describe("determined that a particular document exists on solr", function(){
        var solrProxy = {};
        var expectedQuery;
        var exists = {};
                    
        before(function(){
            solrProxy = SolrProxy({
                baseUrl: "http://localhost:8983",
                core: "client2_candidateProfile",
                identifierName: "id"
            });
            
            var documentId = 222222;

 
            expectedQuery = 'http://localhost:8983/solr/client2_candidateProfile/select?q=id:' + documentId + '&fl=none&wt=json&indent=true&omitHeader=true';
            solrProxy.documentExists(documentId, function(error, exists){
                if(error){
                    console.log("The Proxy Error: ");
                    console.log(error);
                }
                else {
                    //console.log("Exists is: ", exists);
                }
            });
        });
        
        it("successfully set the current query", function(){
            solrProxy.currentQuery.should.be.equal(expectedQuery);
        });
        it("found document 222222", function(){
            exists.should.be.true;
        });
    });
     
    describe("determined that a particular document does not exist on solr", function(){
        var solrProxy = {};
        var expectedQuery;
        var exists = {};
                    
        before(function(){
            solrProxy = SolrProxy({
                baseUrl: "http://localhost:8983",
                core: "client2_candidateProfile",
                identifierName: "id"
            });
            
            var documentId = 222555;

 
            expectedQuery = 'http://localhost:8983/solr/client2_candidateProfile/select?q=id:' + documentId + '&fl=none&wt=json&indent=true&omitHeader=true';
            solrProxy.documentExists(documentId, function(error, exists){
                if(error){
                    console.log("The Proxy Error: ");
                    console.log(error);
                }
                else {
                    //console.log("Exists is: ", exists);
                }
            });
        });
        
        it("successfully set the current query", function(){
            solrProxy.currentQuery.should.be.equal(expectedQuery);
        });
        it("could not find document 222555", function(){
            exists.should.be.true;
        });
    });
});