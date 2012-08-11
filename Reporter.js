/*
 * Copyright 2012 Laurens Holst
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var checkTypes = require("./utils.js").checkTypes;
var format = require("./utils.js").format;
var Test = require("./Test.js").Test;
var TestSuite = require("./TestSuite.js").TestSuite;


function Reporter(suite) {
	checkTypes(arguments, TestSuite);
	
	this._suite = suite;
}

Reporter.prototype.log = function() {
	throw new Error("Must implement log().");
};

Reporter.prototype.logError = function() {
	throw new Error("Must implement logError().");
};

Reporter.prototype.report = function() {
	var heading = format('Test results for suite "%1"', this._suite.getName());
	this.log(heading);
	this.log("================================================================================".substr(0, heading.length));
	
	this._report(this._suite);
};

Reporter.prototype._report = function(test) {
	if (test instanceof TestSuite)
		this.reportSuite(test);
	else if (test instanceof Test)
		this.reportTest(test);
	else
		throw new Error("Test argument expected.");
};

Reporter.prototype.reportTest = function(test) {
	test.getErrors().forEach(function(error) {
		this.logError(format('* Test "%1" failed.', test.getName()));
		
		if (typeof error.stack == "string")
			this.logError(error.stack.indexOf(error) != -1 ? error.stack : error + "\n" + error.stack);
		else
			this.logError(error);
	}.bind(this));
};

Reporter.prototype.reportSuite = function(suite) {
	var reporter = this;
	suite.getTests().forEach(function(test) {
		reporter._report(test);
	});
	
	if (suite.hasFailed())
		this.logError(format('Test suite "%1" completed with errors.', suite.getName()));
	else
		this.log(format('Test suite "%1" completed successfully.', suite.getName()));
};


exports.Reporter = Reporter;
