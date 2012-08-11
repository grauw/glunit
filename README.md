gltest
======

No-nonsense object oriented JavaScript unit testing.

This library provides you with simple and unbloated yet powerful test classes.
They can easily be extended with domain-specific test functionality.

Usage
-----

Here is a simple example of a test suite:

    var suite = new TestSuite("My tests",
        
        new Test("foo() returns bar", function() {
            this.assertEquals("bar", foo());
        });
        
        new Test("bar() does not return foo", function() {
            this.assertNotEquals("foo", bar());
        });
        
    });

Available assertions are:

  * assert(booleanishValue)
  * assertEquals(expected, actual)
  * assertNotEquals(notExpected, actual)
  * assertException(callback)
  * assertType(typeStringOrConstructor, object)

The amount of assertions is intentionally kept small. If you need additional
assertions for convenience and brevity, or have other common code between tests,
you can easily subclass Test with your own extension methods:

    function MyTest() {
        Test.apply(this, arguments);
    }
    
    extend(Test, MyTest);
    
    MyTest.prototype.prepare = function() {
        this.testObject = new MyObject("foo", true);
    };
    
    MyTest.prototype.assertIsHTMLElement = function(element) {
	this.assertType(Element, element);
        this.assertEquals("http://www.w3.org/1999/xhtml", element.namespaceURI);
    };

Now all tests instantiated as MyTest will have a prepare() method they can
invoke to do common set-up, and an assertIsHTMLElement() method to check if an
XML node is an HTML element.

It can also be useful to implement a shared test function; for example, this is
how a Test subclass is used to test an URI resolving library:

    new URITest('http://a/b/c/d;p?q', 'g?y'    , 'http://a/b/c/g?y'),
    new URITest('http://a/b/c/d;p?q', '..'     , 'http://a/b/'),
    new URITest('http://a/b/c/d;p?q', '../../g', 'http://a/g')

This URITest class looks like this:

    function MyTest(base, relative, expected) {
        Test.call(this, "Resolving " + relative + " against " + base);
        this._base = base;
        this._relative = relative;
        this._expected = expected;
    }
    
    extend(Test, MyTest);
    
    MyTest.prototype.test = function() {
	var resolved = URI.resolve(this._base, this._relative);
        this.assertEquals(this._expected, resolved);
    };

This way you can represent your repetitive tests in a compact and readable way.

Developer information
---------------------

If you would like to do some hacking on gltest, clone the source code into your
development environment using [Mercurial][1]:

    hg clone https://bitbucket.org/grauw/gltest

To contribute, [contact me][2] with a link to a repository with your changes and
a description. Please adhere to the existing code style, and make small commits
with good commit messages. If you like, send in your changes for review early,
so we can discuss them and agree on their direction.

[1]: http://mercurial.selenic.com/
[2]: http://www.grauw.nl/about.php

Authors
-------

  * Laurens Holst, <http://www.grauw.nl/>

Source code
-----------

<https://bitbucket.org/grauw/gltest>

License
-------

Copyright 2012 Laurens Holst

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  <http://www.apache.org/licenses/LICENSE-2.0>

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
