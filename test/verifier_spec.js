/* jshint -W030 */

var should = require("should");
var chai = require("chai");
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
var expect = chai.expect;
chai.use(sinonChai);
var assert = require("assert");

var Verifier = require("../lib/verifier");

describe("Verifier", function(){
    
    describe("defaults", function(){
        var verifier = {};
        
        before(function(){
            verifier = Verifier({
                solrClient: {},
                feedFailure: {}
            });
        });
        
        it("has a solr proxy client", function(){
            verifier.solrClient.should.be.defined;
        });
        it("has a feed failure object", function(){
            verifier.feedFailure.should.be.defined;
        });
    });
    
    describe("when presented with 3 document ids", function(){
        var verifier = {};
        var documentIds = [100, 200, 300];
        var mockSolrClient = {};
        var startSpy;
        var stopSpy;
        var ProcessDocumentsSpy;
        
        before(function(){
            var feedFailure = { 
                processDocuments: function(id, exists){},
                start: function(){},
                stop: function(){}
                };
            var solrClient = { documentExists: function(id, callback){} };
            mockSolrClient = sinon.mock(solrClient);
            startSpy = sinon.spy(feedFailure, "start");
            stopSpy = sinon.spy(feedFailure, "stop");
            ProcessDocumentsSpy = sinon.spy(feedFailure, "processDocuments");
            
            // Set expectations on the mocked solrClient
            mockSolrClient.expects("documentExists").withArgs(documentIds[0], sinon.match.any).once();
            mockSolrClient.expects("documentExists").withArgs(documentIds[1], sinon.match.any).once();
            mockSolrClient.expects("documentExists").withArgs(documentIds[2], sinon.match.any).once();
            
            
            verifier = Verifier({
                solrClient: solrClient,
                feedFailure: feedFailure
            }); 
            
            verifier.verifyDocuments(documentIds, function(err, results){
                console.log("Look, ma. No hands!");
            });
        });
        
        it("all 3 documents are processed", function(){
            mockSolrClient.verify();
        });
        it("timer is initiated to capture elapsed time", function(){
            assert(startSpy.calledOnce);
        });
        it("timer is stopped to calculate elapsed time");
    });
});