/* jshint -W030 */

var should = require("should");
var Io = require("../lib/io");

describe("Io", function(){
    
    describe("defaults - file out", function(){
        var io = {};
        
        before(function(){
            io = Io({
                inFile: "myInputFileName",
                outFile: "myOutputFileName"
            });
        });
        
        it("inputFileName is set to myInputFileName", function(){
            io.inputFileName.should.equal("myInputFileName");
        });
        it("outputFileName is set to myOutputFileName", function(){
            io.outputFileName.should.equal("myOutputFileName");
        });
    });
    
    describe("defaults - console out", function(){
        var io = {};
        
        before(function(){
            io = Io({
                inFile: "myInputFileName"
            });
        });
        
        it("inputFileName is set to myInputFileName", function(){
            io.inputFileName.should.equal("myInputFileName");
        });
        it("outputFileName is not defined so output is sent to console", function(){
            should.not.exist(io.outputFileName);
        });
    });    
    
    describe("successfully reads and parses input file", function(){
        var io = {};
        var documents;
        
        before(function(){
            io = Io({
                inFile: "./samples/input.json"
            });
            
            documents = io.getDocumentList();
        });
        
        it("the returned documents data structure is not null", function(){
            documents.should.be.defined;
        });
        it("the document identifier name is id", function(){
            documents.identifierName.should.equal("id");
        });
        it("there are 10 document identifiers in the array", function(){
            documents.identifiers.length.should.equal(10);
        });
        it("one of the 10 document identifiers is 119879", function(){
            documents.identifiers[9].should.equal(119879);
        });
    });    

    describe("successfully reports findings to output file", function(){
        var io = {};
        
        before(function(){
            io = Io({
                inFile: "myInputFileName",
                outFile: "./samples/test-output.json"
            });
            
            io.reportFindings({
                coreName: "Client_MyClient",
                documentIdentifierName: "myIdentifier",
                createdOn: "2015-03-25T12:00:00",
                elapsedTime: 1111222,
                totalProcessed: 10,
                missingDocumentIds: [
                    87783,
                    241203,
                    180015
                ]
            });
        });
        
        it("reportFindings() method receives a FeedFailure object parameter");
        it("the output file named samples/output.json exists");
        it("the core name is Client_MyClient");
        it("the execution date/time is 2015-03-25T12:00:00");
        it("it took 1111222ms to process the documents");
        it("a total of 10 documents were processed");
        it("there are 3 documents in the missingDocuments array");
        it("one of the missing documents has the id 241203");
    });
    
});