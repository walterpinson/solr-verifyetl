var assert = require("assert");
var filesystem = require('fs');

var Io = function(args){
    assert.ok(args.inFile, "Absolute path to input file is required.");
    
    // Private
    
    // Public
    var inputFileName = args.inFile;
    var outputFileName;
    if(args.outFile) {
        outputFileName = args.outFile;        
    }
    
    var getDocumentList = function(){
		var rawData = filesystem.readFileSync(inputFileName, 'utf-8');
        var documentList = JSON.parse(rawData);
        
        assert.ok(documentList.server, "Input file must include identifier name.");	
        assert.ok(documentList.core, "Input file must include identifier name.");	
        assert.ok(documentList.identifierName, "Input file must include identifier name.");	
        assert.ok(documentList.identifiers, "Input file must include identifier array.");	        
        	
		return documentList; 
    };
    
    var reportFindings = function(feedFailure){
        if(outputFileName){
            reportToFile(feedFailure);
        }
        else {
            reportToConsole(feedFailure);
        }
    };
    
    return {
        // Properties
        inputFileName: inputFileName,
        outputFileName: outputFileName,
                
        // Methods
        getDocumentList: getDocumentList,
        reportFindings: reportFindings
    };
    
    function reportToConsole(findings){
        console.log("Solr Document Verification");
        console.log("====================================================================================");
        console.log("Started: " + findings.createdOn + "   Elapsed Time: " + findings.elapsedTime + "ms");
        console.log("Server: " + findings.server + "   Core: " + findings.coreName);
        console.log("Identifier Name: " + findings.documentIdentifierName);
        console.log("====================================================================================");
        console.log("");
        console.log("Total Processed Documents: " + findings.totalProcessed);
        console.log("Missing Documents");
        console.log("-----------------");
        
        findings.missingDocumentIds.forEach(function(id){
            console.log("Identifier: " + id);            
        });
    }
    
    function reportToFile(findings){
		filesystem.writeFileSync(outputFileName, JSON.stringify(findings, null, '\t'), 'utf-8');
    }
};

module.exports = Io;