/* jshint -W030 */

var should = require("should");
var FeedFailure = require("../models/feedfailure");

describe("FeedFailure", function(){
    
    describe("defaults", function(){
        var feedFailure = {};
        
        before(function(){
            feedFailure = new FeedFailure({
                server: "http://myserver.com",
                coreName: "Client_SomeClientName",
                documentIdentifierName: "candProfileId"
            }); 
        });
        
        it("solr server name is http://myserver.com", function(){
            feedFailure.server.should.equal("http://myserver.com");
        });
        it("solr core name is Client_SomeClientName", function(){
            feedFailure.coreName.should.equal("Client_SomeClientName");
        });
        it("document identifier name is candProfileId", function(){
            feedFailure.documentIdentifierName.should.equal("candProfileId");
        });
        it("has a created date", function(){
            feedFailure.createdOn.should.be.defined;
        });
        it("has a time elapsed value of zero", function(){
            feedFailure.elapsedTime.should.equal(0);
        });
        it("has processed zero documents.", function(){
            feedFailure.totalProcessed.should.equal(0);
        });
        it("has a missing document IDs array", function(){
            feedFailure.missingDocumentIds.should.be.defined;
        });
        it("has found zero missing documents", function(){
            feedFailure.missingDocumentIds.length.should.equal(0);
        });
    });
    
    describe("adding failed document IDs", function(){
        var feedFailure = {};
        
        before(function(){
            feedFailure = new FeedFailure({
                server: "http://mysver.com",
                coreName: "Client_SomeClientName",
                documentIdentifierName: "candProfileId"
            });
            
            feedFailure.processDocument(255, false); 
            feedFailure.processDocument(33, false); 
        });
        
        it("has found 2 missing documents", function(){
            feedFailure.missingDocumentIds.length.should.equal(2);
        });
        it("has calculated total processed documents as 2", function(){
            feedFailure.totalProcessed.should.equal(2);
        });
    });
    
    describe("calculating the time elapsed", function(){
        var feedFailure = {};
        
        before(function(){
            feedFailure = new FeedFailure({
                server: "http://mysver.com",
                coreName: "Client_SomeClientName",
                documentIdentifierName: "candProfileId"
            });
            
            feedFailure.start();
            setTimeout(function(){
                feedFailure.stop();           
                }, 1000);
        });
      
        it("has time elapsed greater than 0", function(){
            // This operation was executing immediately prior to the stop having executed.
            // Therefore, it was necessary to make this instruction wait for the same timeout
            // period.
            setTimeout(function(){feedFailure.elapsedTime.should.be.above(0);}, 1000);
        });
    });    
});