#!/usr/bin/env node

var Io = require("./lib/io");
var SolrClient = require("./lib/solrproxy");
var Verifier = require("./lib/verifier");
var FeedFailure = require("./models/feedfailure");
var program = require("commander");

handleCommandLine({
    program: program
    });
    
if(program.rawArgs.length > 2) {
    // 1. Process input
    // We are not going to perform input validation at this point.
    // Maybe at some point in the future.
    var io = new Io({
        inFile: program.input,
        outFile: program.output
    });
    
    var documents = io.getDocumentList();
    
    // 2. Initialize proxy
    var solrClient = new SolrClient({
        baseUrl: documents.server,
        core: documents.core,
        identifierName: documents.identifierName
    });
    
    // 3. Intialize feedfailure
    // do I want to do this here on within the verifier?
    var feedFailure = new FeedFailure({
        server: documents.server,
        coreName: documents.core,
        documentIdentifierName: documents.identifierName
    });
    
    // 4. Initiate verification and capture the failures
    var verifier = new Verifier({
        solrClient: solrClient,
        feedFailure: feedFailure
    });
    
    verifier.verifyDocuments(documents.identifiers, function(err, results){
        // Check for errors, first.
        if(err){
            console.log("Error: " + err);
            return;
        }
        
        // 5. Report the findings
        io.reportFindings(results);
    });
}
else {
    handleArgumentIssues();
}

function handleCommandLine(args) {
  
program
	.version('0.0.1')
	.option('-i, --input [file]', 'Input file path')
	.option('-o, --output [file]', 'Output file path')
  	.option('-v, --verbose', 'Use verbose output while processing')
	.parse(process.argv);

// DEBUG: This is debug code that should be eliminated upon completion.
//console.log("program arguments: ", program.rawArgs.length);
//console.log("program arguments: ", program.rawArgs);
// END-DEBUG /////////////////////////////////////////////////////////////
}

function handleArgumentIssues() {
    program.help();
}