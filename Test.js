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


function Test(name, testFunction) {
	checkTypes(arguments, ["string"], [Function]);
	
	this._name = name || (this.constructor && this.constructor.name) || "Test";
	this._errors = [];
	
	if (testFunction)
		this.test = testFunction;
}

Test.prototype.getName = function()
{
	return this._name;
};

Test.prototype.addError = function(error) {
	this._errors.push(error);
};

Test.prototype.getErrors = function() {
	return this._errors.slice(0);
};

Test.prototype.hasFailed = function() {
	return this._errors.length > 0;
};

Test.prototype.toString = function()
{
	return this.getName();
};

Test.prototype.test = function() {
	throw new Error("Must implement test().");
};

Test.prototype.run = function() {
	try {
		this.test();
	} catch (error) {
		this.addError(error);
	}
};

Test.prototype.assert = function(value) {
	if (!value)
		throw new Error("Assertion failed.");
};

Test.prototype.assertEquals = function(expected, actual) {
	if (expected !== actual)
		throw new Error(format("Assertion failed. Expected: %1, was: %2.", expected, actual));
};

Test.prototype.assertNotEquals = function(expected, actual) {
	if (expected === actual)
		throw new Error(format("Assertion failed. Not expected: %1.", actual));
};

Test.prototype.assertException = function(callback) {
	checkTypes(arguments, Function, [Function]);
	var error = null;
	try {
		callback.call(this);
	} catch (e) {
		error = e;
	}
	if (!error)
		throw new Error("Assertion failed. Exception expected.");
	return error;
};

Test.prototype.assertType = function(expectedType, value) {
	if (typeof expectedType == "string") {
		if (typeof value != expectedType)
			throw new Error(format("Assertion failed. Expected type: %1, was: %2.", expectedType, typeof value));
	} else if (expectedType instanceof Function) {
		if (!(value instanceof expectedType))
			throw new Error(format("Assertion failed. Expected type: %1, was: %2.", expectedType.name || expectedType, value));
	} else {
		throw new Error("Function or string expected.");
	}
};


exports.Test = Test;
