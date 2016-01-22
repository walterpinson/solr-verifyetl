var assert = require("assert");
var async = require("async");

var Verifier = function(args){
    assert.ok(args.solrClient, "Solr client proxy is required.");
    assert.ok(args.feedFailure, "FeedFailure object is required.");
        
    // Private
        
    // Public
    var solrClient = args.solrClient;
    var feedFailure = args.feedFailure;
    
    return {
        // Properties
        solrClient: solrClient,
        feedFailure: feedFailure,
                
        // Methods
        verifyDocuments: verifyDocuments
    };
    
    function verifyDocuments(documentIds, next){
        assert.ok(documentIds, "Array of document identifiers is required.");

        feedFailure.start();
        
        async.forEachLimit(documentIds, 100, function(documentId, callback) {
            
            solrClient.documentExists(documentId, function(error, id, exists){
              if(error){
                    console.log("ID: " + id + "\nError: " + error);
                    return;
                }
                
                feedFailure.processDocument(id, exists);
                callback();
                
            });           
        }, function(err){
            
            if(err) return next(err, null);
            feedFailure.stop();
            next(null, feedFailure);
            
        });
    }
};

module.exports = Verifier;