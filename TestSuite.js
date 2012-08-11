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
var extend = require("./utils.js").extend;
var checkTypes = require("./utils.js").checkTypes;
var format = require("./utils.js").format;
var Test = require("./Test.js").Test;


function TestSuite(name) {
	checkTypes(arguments, ["string"]);
	Test.call(this, name || (this.constructor && this.constructor.name) || "TestSuite");
	
	this._tests = [];
	
	for (var i = 1; i < arguments.length; i++)
		this.addTest(arguments[i]);
}

extend(Test, TestSuite);

TestSuite.prototype.addTest = function(test) {
	checkTypes(arguments, Test);
	this._tests.push(test);
};

TestSuite.prototype.getTests = function() {
	return this._tests.slice(0);
};

TestSuite.prototype.test = function() {
	var failCount = 0;
	this._tests.forEach(function(test) {
		test.run();
		if (test.hasFailed())
			failCount++;
	});
	
	if (failCount)
		throw new Error(format("Test suite %1 completed with %2 errors.", this._name, failCount));
};


exports.TestSuite = TestSuite;
