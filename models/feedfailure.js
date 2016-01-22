var assert = require("assert");

var FeedFailure = function(args){
    assert.ok(args.server, "Server URI is required.");
    assert.ok(args.coreName, "Core name is required.");
    assert.ok(args.documentIdentifierName, "Document identifier name is required");
    
    // Private
    var startTime = 0;
    
    // Public
    var server = args.server;
    var coreName = args.coreName;
    var documentIdentifierName = args.documentIdentifierName;
    var createdOn = args.createdOn || new Date();
    var elapsedTime = args.elapsedTime || 0;
    var totalProcessed = args.totalProcessed || 0;
    var missingDocumentIds = args.missingDocumentIds || [];
    
    var processDocument = function(documentId, exists){
        
        this.totalProcessed += 1;
        if(!exists) {
            missingDocumentIds.push(documentId);
        }
    };
    
    var start = function(){
        startTime = new Date().getTime();
    };
    
    var stop = function(){
        if(0 === elapsedTime || 0 === this.elapsedTime) {
            var now = new Date().getTime();
            this.elapsedTime = now - startTime;
        }
    };
    
    return {
        // Properties
        server: server,
        coreName: coreName,
        documentIdentifierName: documentIdentifierName,
        createdOn: createdOn,
        elapsedTime: elapsedTime,
        totalProcessed: totalProcessed,
        missingDocumentIds: missingDocumentIds,
        
       // Methods
       processDocument: processDocument,
       start: start,
       stop: stop
    };
};

module.exports = FeedFailure;