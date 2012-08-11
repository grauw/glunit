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
var Reporter = require("./Reporter.js").Reporter;


function NodeJSReporter(suite) {
	Reporter.call(this, suite);
}

extend(Reporter, NodeJSReporter);

NodeJSReporter.prototype.log = function(message) {
	console.log(message);
};

NodeJSReporter.prototype.logError = function(message) {
	if (process.stderr.isTTY)
		console.error("\033[41m" + message + "\033[0m");
	else
		console.error(message);
};


exports.NodeJSReporter = NodeJSReporter;
