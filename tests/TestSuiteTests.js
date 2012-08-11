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
var Test = require("../Test.js").Test;
var TestSuite = require("../TestSuite.js").TestSuite;


function TestCountTest() {
	Test.call(this);
	this.callCount = 0;
}

extend(Test, TestCountTest);

TestCountTest.prototype.test = function()
{
	this.callCount++;
};


var testSuiteTests = new TestSuite("TestSuite",
	
	new Test("TestSuite constructor()", function() {
		var suite = new TestSuite();
		
		this.assertEquals(TestSuite.name, suite.getName());
	}),

	new Test("TestSuite constructor() name", function() {
		var suite = new TestSuite("suite");
		
		this.assertEquals("suite", suite.getName());
	}),
	
	new Test("TestSuite constructor() tests as varargs", function() {
		var test1 = new Test();
		var test2 = new Test();
		var suite = new TestSuite("suite", test1, test2);
		
		this.assertEquals(2, suite.getTests().length);
		this.assertEquals(test1, suite.getTests()[0]);
		this.assertEquals(test2, suite.getTests()[1]);
	}),
	
	new Test("TestSuite getTests()", function() {
		var suite = new TestSuite();
		
		this.assertType(Array, suite.getTests());
		this.assertEquals(0, suite.getTests().length);
	}),
	
	new Test("TestSuite addTest()", function() {
		var suite = new TestSuite();
		var test = new Test();
		suite.addTest(test);
		
		this.assertEquals(1, suite.getTests().length);
		this.assertEquals(test, suite.getTests()[0]);
	}),
	
	new Test("TestSuite addTest() twice", function() {
		var suite = new TestSuite();
		var test1 = new Test();
		var test2 = new Test();
		suite.addTest(test1);
		suite.addTest(test2);
		
		this.assertEquals(2, suite.getTests().length);
		this.assertEquals(test1, suite.getTests()[0]);
		this.assertEquals(test2, suite.getTests()[1]);
	}),
	
	new Test("TestSuite addTest() suite", function() {
		var suite1 = new TestSuite();
		var suite2 = new TestSuite();
		suite1.addTest(suite2);
		
		this.assertEquals(1, suite1.getTests().length);
		this.assertEquals(suite2, suite1.getTests()[0]);
	}),
	
	new Test("TestSuite test()", function() {
		var test1 = new TestCountTest();
		var test2 = new TestCountTest();
		var suite = new TestSuite("suite", test1, test2);
		suite.run();
		
		this.assertEquals(1, test1.callCount);
		this.assertEquals(1, test2.callCount);
	}),
	
	new Test("TestSuite test() nested", function() {
		var test1 = new TestCountTest();
		var test2 = new TestCountTest();
		var suite2 = new TestSuite("suite2", test2);
		var suite1 = new TestSuite("suite1", test1, suite2);
		suite1.run();
		
		this.assertEquals(1, test1.callCount);
		this.assertEquals(1, test2.callCount);
	}),
	
	new Test("TestSuite test() test errors", function() {
		var test1 = new TestCountTest();
		var test2 = new Test("fails", function() { null.xxx; });
		var test3 = new TestCountTest();
		var test4 = new Test("fails", function() { null.xxx; });
		var suite = new TestSuite("suite", test1, test2, test3, test4);
		suite.run();
		
		this.assertEquals(1, test1.callCount);
		this.assertType(TypeError, test2.getErrors()[0]);
		this.assertEquals(1, test3.callCount);
		this.assertType(TypeError, test4.getErrors()[0]);
		this.assertEquals(1, suite.getErrors().length);
	})
	
);


exports.testSuiteTests = testSuiteTests;
