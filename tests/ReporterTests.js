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
var extend = require("../utils.js").extend;
var Reporter = require("../Reporter.js").Reporter;
var Test = require("../Test.js").Test;
var TestSuite = require("../TestSuite.js").TestSuite;


function TestReporter(suite) {
	Reporter.call(this, suite);
	this.logs = [];
}

extend(Reporter, TestReporter);

TestReporter.prototype.log = function(message) {
	this.logs.push(message);
};

TestReporter.prototype.logError = function(message) {
	this.logs.push("[ERROR] " + message);
};


var reporterTests = new TestSuite("Reporter",
	
	new Test("Reporter constructor()", function() {
		var suite = new TestSuite();
		new Reporter(suite);
	}),
	
	new Test("Reporter report()", function() {
		var suite = new TestSuite("testSuite");
		var reporter = new TestReporter(suite);
		reporter.report();
		
		this.assertEquals(3, reporter.logs.length);
		this.assertEquals('Test results for suite "testSuite"', reporter.logs[0]);
		this.assertEquals('==================================', reporter.logs[1]);
		this.assertEquals('Test suite "testSuite" completed successfully.', reporter.logs[2]);
	}),
	
	new Test("Reporter report() with tests", function() {
		var test = new Test("test");
		var suite = new TestSuite("testSuite", test, test);
		var reporter = new TestReporter(suite);
		reporter.report();
		
		this.assertEquals(3, reporter.logs.length);
		this.assertEquals('Test suite "testSuite" completed successfully.', reporter.logs[2]);
	}),
	
	new Test("Reporter report() failing tests", function() {
		var test = new Test("test");
		var errorTest = new Test("test");
		errorTest.addError("Error: test error.");
		var suite = new TestSuite("testSuite", errorTest, test);
		suite.addError("Suite failed.");
		var reporter = new TestReporter(suite);
		reporter.report();
		
		this.assertEquals(5, reporter.logs.length);
		this.assertEquals('[ERROR] * Test "test" failed.', reporter.logs[2]);
		this.assertEquals('[ERROR] Error: test error.', reporter.logs[3]);
		this.assertEquals('[ERROR] Test suite "testSuite" completed with errors.', reporter.logs[4]);
	}),
	
	new Test("Reporter report() nested suites", function() {
		var test = new Test("test");
		var suite2 = new TestSuite("suite2", test, test);
		var suite1 = new TestSuite("suite1", suite2, test);
		var reporter = new TestReporter(suite1);
		reporter.report();
		
		this.assertEquals(4, reporter.logs.length);
		this.assertEquals('Test suite "suite2" completed successfully.', reporter.logs[2]);
		this.assertEquals('Test suite "suite1" completed successfully.', reporter.logs[3]);
	}),
	
	new Test("Reporter report() nested suites with errors", function() {
		var test = new Test("test");
		var errorTest = new Test("test");
		errorTest.addError("Error: test error.");
		var suite2 = new TestSuite("suite2", test, errorTest);
		var suite1 = new TestSuite("suite1", suite2, errorTest);
		suite2.addError("Suite failed.");
		suite1.addError("Suite failed.");
		var reporter = new TestReporter(suite1);
		reporter.report();
		
		this.assertEquals(8, reporter.logs.length);
		this.assertEquals('[ERROR] * Test "test" failed.', reporter.logs[2]);
		this.assertEquals('[ERROR] Error: test error.', reporter.logs[3]);
		this.assertEquals('[ERROR] Test suite "suite2" completed with errors.', reporter.logs[4]);
		this.assertEquals('[ERROR] * Test "test" failed.', reporter.logs[5]);
		this.assertEquals('[ERROR] Error: test error.', reporter.logs[6]);
		this.assertEquals('[ERROR] Test suite "suite1" completed with errors.', reporter.logs[7]);
	})
	
);


exports.reporterTests = reporterTests;
