// TODO: replace these with JSUnit's assert functions

function assertEquals(comment, expected, actual) {
  // halt if a Flash error has occurred asynchronously
  if (_flashError) {
    throw new Error('Halting due to Flash error');
  }
  
  if (printAsserts) {
    console.log("assertEquals('" + comment + "', " + expected + ", "
                + actual + ")");
  }
  
  if (expected != actual) {    
    var msg = 'assertEquals Failed: ' + comment 
              + '\n(expected: ' + expected
              + ', actual: ' + actual + ')';
    console.log(msg);
    throw new Error(msg);
  }
}

/** Tests the 'actual' value to see if it matches any of the values
    provided by the expectedArray. Only one is needed for the assertion
    to pass. */
function assertEqualsAny(comment, expectedArray, actual) {
  // halt if a Flash error has occurred asynchronously
  if (_flashError) {
    throw new Error('Halting due to Flash error');
  }
  
  var expected = expectedArray.join(' or ');
  
  if (printAsserts) {
    console.log("assertEquals('" + comment + "', " + expected + ", "
                + actual + ")");
  }
  
  var matches = false;
  for (var i = 0; i < expectedArray.length; i++) {
    if (expectedArray[i] == actual) {
      matches = true;
      break;
    }
  }
  
  if (!matches) {
    var msg = 'assertEquals Failed: ' + comment 
              + '\n(expected: ' + expected
              + ', actual: ' + actual + ')';
    console.log(msg);
    throw new Error(msg);
  }
}

function assertExists(comment, actual) {
  // halt if a Flash error has occurred asynchronously
  if (_flashError) {
    throw new Error('Halting due to Flash error');
  }
  
  if (printAsserts) {
    console.log("assertExists('" + comment + "', " + actual + ")");
  }
  
  if (actual === null || actual === undefined) {
    var msg = 'assertExists failed: ' + comment 
              + '\n(actual: ' + actual + ')';
    console.log(msg);
    throw new Error(msg);
  }
}

function assertNotExists(comment, actual) {
  // halt if a Flash error has occurred asynchronously
  if (_flashError) {
    throw new Error('Halting due to Flash error');
  }
  
  if (printAsserts) {
    console.log("assertNotExists('" + comment + "', " + actual + ")");
  }
  
  if (!actual === null && !actual === undefined) {
    var msg = 'assertNotExists failed: ' + comment 
              + '\n(actual: ' + actual + ')';
    console.log(msg);
    throw new Error(msg);
  }
}

function assertNull(comment, actual) {
  // halt if a Flash error has occurred asynchronously
  if (_flashError) {
    throw new Error('Halting due to Flash error');
  }
  
  if (printAsserts) {
    console.log("assertNull('" + comment + "', " + actual + ")");
  }
  
  if (actual !== null) {
    var msg = 'assertNull failed: ' + comment 
              + '\n(actual: ' + actual + ')';
    console.log(msg);
    throw new Error(msg);
  }
}

function assertUndefined(comment, actual) {
  // halt if a Flash error has occurred asynchronously
  if (_flashError) {
    throw new Error('Halting due to Flash error');
  }
  
  if (printAsserts) {
    console.log("assertUndefined('" + comment + "', " + actual + ")");
  }
  
  if (actual !== undefined) {
    var msg = 'assertNull failed: ' + comment 
              + '\n(actual: ' + actual + ')';
    console.log(msg);
    throw new Error(msg);
  }
}

/** Finds an element with the given ID. Needed so that we can get elements by
    ID for non-SVG/non-HTML and do testing on them. Only needed for testing
    the native handler when dealing with SVGs loaded inside OBJECTs.
    
    @id ID to find.
    @doc Document to execute XPath against. */

function getElementById_xml(id, doc) {
  var results = xpath(doc, null, '//*[@id="' + id + '"]');
  if (results.length) {
    return results[0];
  } else {
    return null;
  }
}

/** Utility function to do XPath cross browser.

    @param doc Either HTML or XML document to work with.
    @param context DOM node context to restrict the xpath executing 
    against; can be null, which defaults to doc.documentElement.
    @param expr String XPath expression to execute.
    @param namespaces Optional; an array that contains prefix to namespace
    lookups.
    
    @returns Array with results, empty array if there are none. */
function xpath(doc, context, expr, namespaces) {
  if (!context) {
    context = doc.documentElement;
  }
  
  if (typeof XPathEvaluator != 'undefined') { // non-IE browsers
    var evaluator = new XPathEvaluator();
    var resolver = doc.createNSResolver(context);
    var result = evaluator.evaluate(expr, context, resolver, 0, null);
    var found = [], current;
    while (current = result.iterateNext()) {
      found.push(current);
    }
    
    return found;
  } else { // IE
    doc.setProperty('SelectionLanguage', 'XPath');
    
    if (namespaces) {
      var allNamespaces = '';
      for (var i = 0; i < namespaces.length; i++) {
        var namespaceURI = namespaces[i];
        var prefix = namespaces['_' + namespaceURI];
        if (prefix == 'xmlns') {
          continue;
        }
        allNamespaces += 'xmlns:' + prefix + '="' + namespaceURI + '" ';
      }
      doc.setProperty("SelectionNamespaces",  allNamespaces);
    }
    
    var found = context.selectNodes(expr);
    if (found == null || typeof found == 'undefined') {
      found = createNodeList();
    }
    
    // found is not an Array; it is a NodeList -- turn it into an Array
    var results = createNodeList();
    for (var i = 0; i < found.length; i++) {
      results.push(found[i]);
    }
    
    return results;
  }
}

function assertFailed(msg) {
  console.log('assertFailed: ' + msg);
  throw new Error(msg);
}

function assertTrue(comment, expression) {
  // halt if a Flash error has occurred asynchronously
  if (_flashError) {
    throw new Error('Halting due to Flash error');
  }
  
  if (printAsserts) {
    console.log("assertTrue('" + comment + "', " + expression + ")");
  }
  
  if (expression === false) {    
    var msg = 'assertTrue Failed: ' + comment 
              + '\n(expression value: ' + expression + ')';
    console.log(msg);
    throw new Error(msg);
  }
}

function assertFalse(comment, expression) {
  // halt if a Flash error has occurred asynchronously
  if (_flashError) {
    throw new Error('Halting due to Flash error');
  }
  
  if (printAsserts) {
    console.log("assertFalse('" + comment + "', " + expression + ")");
  }
  
  if (expression === true) {    
    var msg = 'assertFalse Failed: ' + comment 
              + '\n(expression value: ' + expression + ')';
    console.log(msg);
    throw new Error(msg);
  }
}

// browser detection adapted from Dojo
var isOpera = false, isSafari = false, isMoz = false, isIE = false, 
    isAIR = false, isKhtml = false, isFF = false;

function _detectBrowsers() {
  var n = navigator,
      dua = n.userAgent,
      dav = n.appVersion,
      tv = parseFloat(dav);

  if (dua.indexOf('Opera') >= 0) { isOpera = tv; }
  // safari detection derived from:
  //    http://developer.apple.com/internet/safari/faq.html#anchor2
  //    http://developer.apple.com/internet/safari/uamatrix.html
  var index = Math.max(dav.indexOf('WebKit'), dav.indexOf('Safari'), 0);
  if (index) {
    // try to grab the explicit Safari version first. If we don't get
    // one, look for 419.3+ as the indication that we're on something
    // "Safari 3-ish". Lastly, default to "Safari 2" handling.
    isSafari = parseFloat(dav.split('Version/')[1]) ||
      (parseFloat(dav.substr(index + 7)) > 419.3) ? 3 : 2;
  }
  if (dua.indexOf('AdobeAIR') >= 0) { isAIR = 1; }
  if (dav.indexOf('Konqueror') >= 0 || isSafari) { isKhtml =  tv; }
  if (dua.indexOf('Gecko') >= 0 && !isKhtml) { isMoz = tv; }
  if (isMoz) {
    isFF = parseFloat(dua.split('Firefox/')[1]) || undefined;
  }
  if (document.all && !isOpera) {
    isIE = parseFloat(dav.split('MSIE ')[1]) || undefined;
  }
}

_detectBrowsers();