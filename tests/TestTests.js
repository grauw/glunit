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
var format = require("../utils.js").format;
var Test = require("../Test.js").Test;
var TestSuite = require("../TestSuite.js").TestSuite;


function AssertionTest() {
	Test.apply(this, arguments);
}

extend(Test, AssertionTest);

AssertionTest.prototype.assertAssertionException = function(callback) {
	var error = this.assertException(callback);
	if (error.message.indexOf("Assertion failed.") != 0)
		throw new Error(format("Assertion failed. Not an assertion error. Was: %1.", error));
	return error;
};


var testTests = new TestSuite("Test",
	
	new Test("Test constructor()", function() {
		var test = new Test();
		
		this.assertEquals(Test.name, test.getName());
	}),
	
	new Test("Test constructor() name", function() {
		var test = new Test("test");
		
		this.assertEquals("test", test.getName());
	}),
	
	new Test("Test constructor() test function", function() {
		var testFunction = function() {};
		var test = new Test("test", testFunction);
		
		this.assertEquals(testFunction, test.test);
	}),
	
	new Test("Test constructor() name from constructor", function() {
		function TestTest() { Test.apply(this, arguments); }
		extend(Test, TestTest);
		var test = new TestTest();
		
		this.assertEquals(TestTest.name, test.getName());
	}),
	
	new Test("Test constructor() no name from constructor", function() {
		var TestTest = extend(Test, function() { Test.apply(this, arguments); });
		var test = new TestTest();
		
		this.assertEquals("Test", test.getName());
	}),
	
	new Test("Test getErrors()", function() {
		var test = new Test();
		
		this.assertType(Array, test.getErrors());
		this.assertEquals(0, test.getErrors().length);
	}),
	
	new Test("Test addError()", function() {
		var error = new Error();
		var test = new Test();
		test.addError(error);
		
		this.assertEquals(1, test.getErrors().length);
		this.assertEquals(error, test.getErrors()[0]);
	}),
	
	new Test("Test hasFailed()", function() {
		var test = new Test();
		
		this.assertEquals(false, test.hasFailed());
	}),
	
	new Test("Test hasFailed() with error", function() {
		var test = new Test();
		test.addError(new Error());
		
		this.assertEquals(true, test.hasFailed());
	}),
	
	new Test("Test test()", function() {
		var test = new Test();
		this.assertException(function() {
			test.test();
		}, Error);
	}),
	
	new Test("Test test() with function from constructor", function() {
		var callCount = 0;
		var test = new Test("test", function() {
			callCount++;
		});
		test.test();
		
		this.assertEquals(1, callCount);
	}),
	
	new Test("Test test() failing test", function() {
		var callCount = 0;
		var test = new Test("test", function() {
			callCount++;
			null.xxx;
		});
		this.assertException(function() {
			test.test();
		}, TypeError);
		
		this.assertEquals(1, callCount);
	}),
	
	new Test("Test run()", function() {
		var callCount = 0;
		var test = new Test("test", function() {
			callCount++;
		});
		test.run();
		
		this.assertEquals(1, callCount);
		this.assertEquals(false, test.hasFailed());
	}),
	
	new Test("Test run() failing test", function() {
		var callCount = 0;
		var test = new Test("test", function() {
			callCount++;
			null.xxx;
		});
		test.run();
		
		this.assertEquals(1, callCount);
		this.assertEquals(1, test.getErrors().length);
		this.assertType(TypeError, test.getErrors()[0]);
	}),
	
	new Test("Test run() twice", function() {
		var callCount = 0;
		var test = new Test("test", function() {
			callCount++;
			null.xxx;
		});
		test.run();
		test.run();
		
		// XXX: probably this is not what we want to happen
		this.assertEquals(2, callCount);
		this.assertEquals(2, test.getErrors().length);
	}),
	
	new AssertionTest("Test assert()", function() {
		var test = new Test();
		test.assert(true);
	}),
	
	new AssertionTest("Test assert() failing", function() {
		var test = new Test();
		this.assertException(function() {
			test.assert(false);
		});
	}),
	
	new AssertionTest("Test assert() 1 succeeds", function() {
		var test = new Test();
		test.assert(1);
	}),
	
	new AssertionTest("Test assert() object succeeds", function() {
		var test = new Test();
		test.assert(test);
	}),
	
	new AssertionTest("Test assert() null failing", function() {
		var test = new Test();
		this.assertAssertionException(function() {
			test.assert(null);
		});
	}),
	
	new AssertionTest("Test assert() \"\" failing", function() {
		var test = new Test();
		this.assertException(function() {
			test.assert("");
		});
	}),
	
	new AssertionTest("Test assertEquals()", function() {
		var test = new Test();
		test.assertEquals("foo", "foo");
	}),
	
	new AssertionTest("Test assertEquals() failing", function() {
		var test = new Test();
		this.assertAssertionException(function() {
			test.assertEquals("foo", "bar");
		});
	}),
	
	new AssertionTest("Test assertEquals() strict equality", function() {
		var test = new Test();
		this.assertException(function() {
			test.assertEquals(null, undefined);
		});
	}),
	
	new AssertionTest("Test assertEquals() objects", function() {
		var test = new Test();
		test.assertEquals(test, test);
		this.assertAssertionException(function() {
			test.assertEquals(test, new Test());
		});
	}),
	
	new AssertionTest("Test assertNotEquals()", function() {
		var test = new Test();
		test.assertNotEquals("foo", "bar");
	}),
	
	new AssertionTest("Test assertNotEquals() failing", function() {
		var test = new Test();
		this.assertAssertionException(function() {
			test.assertNotEquals("foo", "foo");
		});
	}),
	
	new AssertionTest("Test assertNotEquals() strict nonequality", function() {
		var test = new Test();
		test.assertNotEquals("foo", { toString: function() { return "foo"; } });
	}),
	
	new AssertionTest("Test assertNotEquals() objects", function() {
		var test = new Test();
		test.assertNotEquals(test, new Test());
		this.assertAssertionException(function() {
			test.assertNotEquals(test, test);
		});
	}),
	
	new AssertionTest("Test assertException()", function() {
		var test = new Test();
		var error = test.assertException(function() {
			null.xxx;
		});
		this.assertType(TypeError, error);
	}),
	
	new AssertionTest("Test assertException() failing", function() {
		var test = new Test();
		this.assertAssertionException(function() {
			test.assertException(function() {});
		});
	}),
	
	new AssertionTest("Test assertException() returns error", function() {
		var test = new Test();
		var error = test.assertException(function() {
			null.xxx;
		});
		this.assertType(TypeError, error);
	}),
	
	new AssertionTest("Test assertType() typeof", function() {
		var test = new Test();
		test.assertType("string", "bar");
	}),
	
	new AssertionTest("Test assertType() typeof failing", function() {
		var test = new Test();
		this.assertAssertionException(function() {
			test.assertType("boolean", 1);
		});
	}),
	
	new AssertionTest("Test assertType() instanceof", function() {
		var test = new Test();
		test.assertType(Function, function() {});
	}),
	
	new AssertionTest("Test assertType() instanceof subtype", function() {
		var test = new Test();
		var TestSubclass = extend(Test, function() { Test.call(this); });
		test.assertType(Test, new TestSubclass());
	}),
	
	new AssertionTest("Test assertType() instanceof failing", function() {
		var test = new Test();
		this.assertAssertionException(function() {
			test.assertType(Function, {});
		});
	}),
	
	new AssertionTest("Test assertType() instanceof failing null", function() {
		var test = new Test();
		this.assertAssertionException(function() {
			test.assertType(Function, null);
		});
	})
	
);


exports.testTests = testTests;
