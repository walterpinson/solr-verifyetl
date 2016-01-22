# checkSolr
checkSolr is a [Solr](http://lucene.apache.org/solr/) [ETL](https://en.wikipedia.org/wiki/Extract,_transform,_load) verification utility.  Given an input file listing all of the document identifiers that should have been loaded, checkSolr verifies that these documents are present in the Solr [core](https://cwiki.apache.org/confluence/display/solr/Solr+Cores+and+solr.xml).

## Motivation
Solr ETL operations are currently built upon a technology called Aspire.  The current implementation of these ETL operations have an associated error rate.  Unfortunately there was no way, on a large scale, to verify that all of the documents that were supposed to have been loaded actually were.

It is this reason that checkSolr was developed.

## Usage

```bash
09:19 PM - hugo@SilverSurfer: checksolor

Usage: checksolr [options]

Options:

	-h, —help				output usage information
	-v, —version			output the version number
	-i, —input [file]		input file path
	-o, —output [file]	output file path
	-v, —verbose			use verbose output while processing
```

### Input
checkSolr requires an input file that adheres to a particular JSON schema.  The input file is used to tell checkSolr which core and on which server, the utility is to verify against.  It is also used to convey to checkSolr which document field is to be used as the document identifier.  Finally, the file includes an array of identifiers that should have been loaded into Solr.

```javascript
{
    "server": "http://solr.server.net",
    "core": "documentCore",
    "identifierName": "id",
	"identifiers": [
		222222,
		012345,
		567890,
		654321
	]
}
```

### Output
When an output file name is supplied to the command line, using the -o option, checkSolr output is written to the file.  Otherwise, checkSolr writes its output to the console.

#### File Output
The command, `checksolr -i input.json -o output.json`, produces a file with the following JSON formatted output.

```javascript
{
	"server": "http://solr.server.net",
	"coreName": "documentCore",
	"documentIdentifierName": "id",
	"createdOn": "2016-01-03T01:53:49.102Z",
	"elapsedTime": 45,
	"totalProcessed": 4,
	"missingDocumentIds": [
		012345,
		567890
	]
}
```

#### Console Output
The command, `checksolr -i input.json`, produces the output below.

```bash
09:19 PM - hugo@SilverSurfer: checksolr -i input.json
Solr Document Verification
====================================================================================
Started: Sat Jan 02 2016 21:19:38 GMT-0500 (EST)   Elapsed Time: 48ms
Server: http://solr.server.net   Core: documentCore
Identifier Name: id
====================================================================================

Total Processed Documents: 4
Missing Documents
-----------------
Identifier: 012345
Identifier: 567890
```

## Installation
checkSolr does not currently have an installation program, so installation requires a two-part manual process.

### Prerequisites
#### Install node.js (and npm)
checkSolr installation requires that node.js and the [node package manager (npm)](https://www.npmjs.com/), first, be installed.  Running the [node.js installer](https://nodejs.org/en/download/) installs both.  If you already have node.js and nom installed on your machine, you can skip this step.

Install node.js and npm.  You can achieve this by doing one of the following:

* Run the [node.js installer](https://nodejs.org/en/download/) for your platform
* Install node.js and npm via [brew (on Mac) or chocolatey (on Windows)](https://nodejs.org/en/download/package-manager/)


### Install checksolr
#### OSX
```bash
$ cd <root-directory> #can really be any directory
$ sudo npm install github:walterpinson/solr-verifyetl
```
#### Windows
This would be the same as the OSX installation with the exception that there is no sudo command.  
**NOTE:**  Be sure to run the command in a command-line window that has administrative privileges.

## Development
Please see the wiki associated with this repository for developer setup instructions.

