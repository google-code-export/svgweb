/*
Copyright (c) 2009 Google Inc.

Portions Copyright (c) 2008 Rick Masters
Portions Copyright (c) 2008 The Dojo Foundation

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/

// TODO: Move a majority of the comment below into the SVG Web documentation
// and out of here.

// TODO: Document the architecture of the JavaScript portion of the library
// separately and point to it from here.

/**
The SVG Web library makes it possible to use SVG across all of the major 
browsers, including Internet Explorer. Where native SVG support is not 
available, such as on Internet Explorer, a full-featured Flash object is 
used to render and manipulate the SVG behind the scenes. Where native browser
SVG support is available (every other recent browser but Internet Explorer) 
the SVG is rendered natively by the browser. 

In general, the library is meant to bring seamless SVG support to Internet 
Explorer using Flash as close to the SVG 1.1 Full standard as possible, using 
native browser SVG upport in other browsers. The Flash renderer can be used on 
other browsers than Internet Explorer, though we default to only using Flash
on IE.

It is currently a non-goal of this library to support SVG 1.2. 

Another goal of the library is to make direct embedding of SVG into normal 
non-XHTML HTML much easier, as was well as supporting using the OBJECT tag to 
easily bring in SVG files. Using SVG in backgrounds and with the IMAGE tag is 
not currently supported.

Browser and Flash Support
-------------------------

The SVG Web library supports using either the Flash or Native SVG renderer 
for different browsers, including Internet Explorer 6+, Firefox 2+, Safari 3+, 
Opera, iPhone Version 2.1+ Webkit, and Chrome. Android does not currently 
support either Flash or SVG so is not supported. The iPhone before version
2.1 does not natively support either Flash or SVG and therefore is not
supported.

Flash 9+ is required for the Flash renderer; this has close to 97% installed
base so if safe to depend on.

The Adobe SVG Viewer (ASV) is not supported; it is a non-goal of this project to
have support for the ASV viewer.

Embedding SVG
-------------

First, you must bring in the svg.js file into your HTML page:

<script src="svg.js"></script>

SVG markup can be embedded into your HTML in two ways, either using a SCRIPT 
tag or an OBJECT tag. 

For the SCRIPT tag, set the 'type' attribute to "image/svg+xml" and simply
place the tag in your HTML page where you want the SVG to appear:

<h1>Here is an example SVG image:</h1>

<script type="image/svg+xml">
  <svg xmlns="http://www.w3.org/2000/svg" 
       width="200" height="200" 
       version="1.1" baseProfile="full">
       <rect x="0" y="0" width="60" height="60" style="stroke: green;"/>
       <rect x="25" y="25" 
                 id="myRect" 
                 rx="0.6" ry="0.6" 
                 width="150" height="150" 
                 fill="green" 
                 stroke="yellow" stroke-width="8"/>
  </svg>
</script>

Normal full-XML SVG can be used inside of the SCRIPT block. Adding an XML 
declaration and the SVG and XLink namespaces are all optional and will be 
added if not present (note: this differs from the SVG 1.1 spec and is added 
for ease of authoring). You can also include all of them. Note that you should 
not include the XML character encoding on the XML declaration tag, such as 
'UTF-8' or 'ISO-8859-1', as this makes no sense since the overall document 
has its own encoding). Here's some example SVG with everything specified if 
you enjoy lots of typing:

<script type="image/svg+xml">
  <?xml version="1.0"?>
  <svg
     xmlns="http://www.w3.org/2000/svg"
     xmlns:xlink="http://www.w3.org/1999/xlink"
     version="1.1" baseProfile="full"
     width="466"
     height="265"
     id="svg11242">
  </svg>
</script>

For simplicity of authoring this can also just be written as:

<script type="image/svg+xml">
  <svg width="466" height="265" id="svg11242"></svg>
</script>

The SCRIPT SVG block is supported in both XHTML as well as normal HTML pages 
across all browsers, including Internet Explorer. If you are using XHTML
you will probably want to wrap your embedded SVG with CDATA sections; these
CDATA sections will also work directly in Internet Explorer without needing
any further tricks:

<script type="image/svg+xml"><![CDATA[
  <svg width="466" height="265" id="svg11242"></svg>
]]></script>

The second way to embed SVG is with the the OBJECT tag, including on 
Internet Explorer; you must specify both a 'data' attribute pointing to your
SVG file as well as set the 'type' to "image/svg+xml":

<object data="scimitar.svg" type="image/svg+xml" 
        id="testSVG" width="1250" height="750">
</object>

The URL given in the 'data' element must be on the same domain as the web
page and follows the same domain rule (i.e. same protocol, port, etc.); 
cross-domain object insertion is not supported for security reasons.

Extra Files
-----------

You must make sure that the library files svg.htc, svg.swf, and svg.js are 
located by default in the same directory as your HTML page. They must also be 
on the same domain as your HTML page and can not be on a separate domain, such 
as having your html on mydomain.example.com and those three files on 
static.example.com. 

You can override where on your domain you keep svg.htc, svg.swf, and svg.js
by using the optional data-path attribute to point to a different relative
or absolute directory path. If you like to validate your HTML
note that this custom attribute is HTML 5 valid, as all attributes that are 
prefixed with data- are):

<script src="../svg.js" data-path=".."></script>

It does not matter whether you have a trailing slash or not, such as .. versus
../

Flash SVG Renderer Versus Native SVG Rendering
----------------------------------------------

By default, the Flash renderer will be used on Internet Explorer 6+; versions
of Firefox before Firefox 3; versions of Safari before Safari 3; and
versions of Opera before Opera 9. The native SVG renderer will be used
on Firefox 3+; Safari 3+; Chrome; and iPhone version 2.1+ Webkit.

Overriding Which Renderer is Used
----------------------------------

You don't need to generally know the information in this section since we
choose intelligent defaults. In general, we will attempt to use native SVG
abilities if they are present. To override this and force the Flash renderer
to be used you can drop the following META tag into your page:

<meta name="svg.render.forceflash" content="true" />

SVG Scripting Support
---------------------

SVG has a SCRIPT tag, which allows you to embed JavaScript inside of your
SVG. SVG files brought in with the OBJECT tag can have SVG SCRIPT blocks that 
will execute as normal. However, if you directly embed SVG into your page
using the SVG SCRIPT process but have nested SVG script tags, you should 
make sure that you namespace all of your SVG, such as having <svg:script>.

For browsers with native SVG support, the SVG content inside of a SCRIPT tag 
shows up fully in the browser's DOM, with the SCRIPT tag thrown away after the
page has finished loading, so you can manipulate it with normal JavaScript:

<script type="image/svg+xml">
 <svg width="200" height="200">
     <rect x="25" y="25" 
               id="myRect" 
               rx="0.6" ry="0.6" 
               width="150" height="150" 
               fill="green" 
               stroke="yellow" stroke-width="8"/>
 </svg>
</script>

<script>
  window.onload = function() {
    var rect = document.getElementById('myRect');
    rect.setAttribute('fill', 'red');
    rect.style.strokeWidth = 20;
  }
</script>

Manipulating an SVG OBJECT tag with browsers with native support is as 
normal following the standard; just call getSVGDocument() on the OBJECT
to get a document object and execute your standard DOM functions afterwards.

For the Flash renderer, scripting support is as follows.

If the Flash renderer is used on Internet Explorer, Firefox, and Safari, 
the SVG Web library does some magic to have the SVG inside of a SCRIPT 
block show up in the full DOM, fully manipulatable by JavaScript; the example
code above this where 'myRect' is retrieved from the page and then
manipulated would work the same, with document.getElementById('myRect')
working as expected.

If you have a SCRIPT block _inside_ of your SVG that it will
work correctly on _all browsers_ with the Flash renderer as well:

<object data="blocks_game.svg" type="image/svg+xml" 
        width="1250" height="750">
</object>

(inside of blocks_game.svg):

<?xml version="1.0"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" 
         "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">

<svg xmlns="http://www.w3.org/2000/svg"
     xmlns:xlink="http://www.w3.org/1999/xlink"
     onload="init();">

  <script><![CDATA[
    function init() {
      var board = document.getElementById("board"); 
    }
  ]]></script>

  <g id="board" stroke-width="0.02"/>

</svg>

On all browsers, including Internet Explorer, an SVG OBJECT tag can be 
manipulated by external JavaScript as normal by using the getSVGDocument()
method:

<object data="scimitar.svg" type="image/svg+xml" 
        id="testSVG" width="1250" height="750">
</object>

<script>
  window.onload = function() {
    var doc = document.getElementById('testSVG').getSVGDocument();
    var rect = doc.getElementsByTagNameNS(svgns, 'rect')[0];
  }
</script>

When doing DOM scripting on SVG elements, you should use the namespace aware
DOM methods, including on Internet Explorer which is patched to support
the standard:

var el = document.createElementNS(svgns, 'circle');
el.setAttribute('cx', 200);
el.setAttribute('cy', 200);
el.setAttribute('r', 5);
el.setAttribute('fill', '#223FA3');
el.setAttribute('stroke-width', '1px');
el.setAttribute('stroke', 'black');

var root = document.getElementsByTagNameNS(svgns, 'svg')[0];
root.appendChild(el);

Note that SVG attributes like 'stroke-width' aren't in the SVG namespace,
so you can use setAttribute() instead of setAttributeNS(); using setAttributeNS
is a common SVG mistake. You only need to do this for XLink attributes:

el.setAttributeNS(xlinkns, 'href');

If you like being pedantic and typing more you can use null for a namespace when
working with SVG attributes:

el.setAttributeNS(null, 'fill', 'black');

Just using the following is also valid, and results in smaller code:

el.setAttribute('fill', 'black');

(Note: officially, the SVG 1.1 standard recommends setAttributeNS with a
namespace of null, but setAttribute does the job and all the extra typing
is silly. The DOM standard is already verbose enough as it is.)

For convenience, the svg.js file exports the global properties window.svgns
and window.xlinkns with the correct namespaces to ease development (note:
 this is not part of the SVG 1.1 standard):
 
var circle = document.createElementNS(svgns, 'circle');

For events, you can use addEventListener/removeEventListener on SVG elements, 
including on Internet Explorer (instead of using IE's proprietary 
attachEvent):

circle.addEventListener('click', function(evt) {
  // do something
}, false);

On Internet Explorer, the event object is passed into your listener, just
like the standard says, so you should use this instead of window.event.

Controlling event bubbling with the final addEventListener argument is not
supported; it is always automatically false. Also, event bubbling outside
of the SVG root element does not occur (i.e. you can't add an event listener
for mouse move events onto your HTML BODY tag and see them within the SVG. Just
add it to the SVG root element itself if you want to intercept all these).

Knowing When Your SVG Is Loaded
-------------------------------

If you want to know when your SVG and the entire page is done loading, you 
must use svgweb.addOnLoad() instead of window.onload or 
window.addEventListener('onload, ...). Example:

svgweb.addOnLoad(function() {
  // all SVG loaded and rendered
}

If you dynamically create SVG root elements _after_ the page has already 
finished loading, you must add an SVGLoad listener to the SVG root 
element before you can add further children (note: this is a divergence from the 
SVG 1.1 standard, and is needed due to the asynchronous magic going on 
under the covers to bootstrap different parts of the library):

var root = document.createElementNS(svgns, 'svg');
root.setAttribute('width', 200);
root.setAttribute('height', 200);
root.addEventListener('SVGLoad', function(evt) {
  console.log('SVG onload called');
  // now you can do things with the SVG root element, like add more children
});

'load' and 'SVGLoad' are synonomous and are both supported.

Compression
-----------

svgz (compressed SVG files) are not supported. However, it is recommended
that you turn on GZip compression on your webserver for both SVG files
and the svg.htc, svg.swf, and svg.js library files to have significant size 
savings equal to an svgz file as well as to pull down the SVG Web
library files faster.

Width and Height
----------------

For the Flash renderer, you should set the width and height of your SVG, 
either on the root SVG element inside of an SVG SCRIPT block or on an SVG 
OBJECT tag. The following different ways are supported to set this width and 
height for the Flash renderer:

* Directly setting the width and height attributes on the SVG root tag or the
SVG OBJECT:

<script type="image/svg+xml">
  <svg width="30" height="30"></svg>
</script>

or

<object data="example.svg" type="image/svg+xml" width="30" height="30"></object>

* A viewBox attribute on the SVG root element:

<script type="image/svg+xml">
  <svg viewBox="0 0 300 300"></svg>
</script>

* Leaving the width and height off the SVG OBJECT tag but having it set inside
of the SVG file itself either with a width and height attribute

* If no width and height is specified, then we default to 100% for both.

Percentage values for the width and height for the SVG are supported, including
the 'auto' keyword. We do not currently handle a width and height of 0
(FIXME: I believe according to the spec a width and height of 0 should have
the SVG have a visibility of 'none').

CSS Support
-----------

This section only concerns the Flash renderer. Native SVG support works as
normal.

For the Flash renderer, SVG STYLE elements inside inside of an SVG block are
supported:

<svg xmlns="http://www.w3.org/2000/svg"
     xmlns:xlink="http://www.w3.org/1999/xlink" 
     width="600px" height="388px">
	<style type="text/css">
		text {
			font-size: 9pt;
			font-family: sans-serif;
		}
		
		.percentage,
		.date,
		.title {
			font-weight: bold;
		}
	</style>
</svg>

External style rules outside of the SVG _are not_ currently supported, such as 
the following style rule embedded into an HTML page which will not work:

<html>
  <head>
    <style>
      @namespace svg url("http://www.w3.org/2000/svg");
      
      svg\:rect,
  		svg|rect {
  		  fill: green;
  		}
  	</style>
  </head>
</html>

Note the svg\:rect trick to have Internet Explorer see namespaced SVG CSS
rules. Currently you should directly set these on the SVG root element or 
SVG OBJECT tag which is supported:

<object data="scimitar.svg" type="image/svg+xml" 
        id="testSVG" width="1250" height="750"
        style="display: inline; float: right; border: 1px solid black;">
</object>

These properties are copied directly to the Flash rendering object. Changing
any style properties like display, float, etc. through JavaScript
after page load on the SVG root element or an SVG OBJECT does not 
currently cause any dynamic behavior.

Note, however, that on Internet Explorer externally changing style values
on SVG elements other than the root _will_ cause dynamic changes:

var rect = document.getElementById('myRect');
rect.style.strokeWidth = '5px'; // works!
rect.setAttribute('stroke-width', '5px'); // also works!

If you use SVG inside of an SVG file using an SVG OBJECT tag you can also
dynamically change CSS values on all browsers.

Root Background Color
---------------------

If no background color for your SVG is specified with a CSS background-color
attribute, the default is transparent. If you specify a color, that will
be used for your background:

<script type="image/svg+xml">
 <svg width="200" height="200" style="background-color: red;">
 </svg>
</script>

Setting the background using the 'background' CSS property is not currently
supported, only with the 'background-color' property.

Fallback Content When SVG Not Possible
--------------------------------------

If neither native SVG nor Flash can be used, you can put fallback content
inside of your OBJECT tag to be displayed:

<object data="scimitar.svg" type="image/svg+xml" 
        id="testSVG" width="1250" height="750"
        style="display: inline; float: right">
  <img src="scimitar.png"></img>
</object>

This will display the PNG file if SVG can't be used.

You can achieve the same thing with SVG SCRIPT blocks by using a NOSCRIPT
element directly following the SVG SCRIPT block. This NOSCRIPT element will
get displayed if there is no JavaScript; it will also get executed if no
SVG support is possible (note: executing the NOSCRIPT block if SVG support
is not possible is a creative reuse of the NOSCRIPT block and is not part
of the HTML 4.1 standard):

<script type="image/svg+xml">
 <svg width="200" height="200">
 </svg>
</script>
<noscript>
  <img src="scimitar.png"></img>
</noscript>

This will display the given PNG file if JavaScript is turned off or if
SVG support can't be bootstrapped. As a suggestion, if you want to generate
nice PNG image files for your SVG for older browsers as fallback content, 
you can use the excellent free and open source utility/library Batik to render 
your SVG directly into image files (http://xmlgraphics.apache.org/batik/). Just
plug Batik into your workflow (ant, makefiles, etc.) to automatically generate
static images.

If there is not a NOSCRIPT element or fallback content inside of an SVG OBJECT
tag then a message indicating no support is directly written into the block
for the user to see by default.

You can detect from your JavaScript after the page has finished loading 
whether SVG is possible either natively or with Flash using the following:

<script>
  svgweb.addOnLoad(function() {
    if (document.implementation.hasFeature(
          'http://www.w3.org/TR/SVG11/feature#BasicStructure', '1.1') == false) {
      alert('SVG not supported!');
    }
  }
</script>

This will return true on all browsers that natively support SVG; we also patch
things so that true will be returned if we can use Flash to do all the SVG
hard work.

Text Nodes
----------

When you create a text node that you know you will append to something within
your SVG, you need to add an extra parameter to document.createTextNode:

var textNode = document.createTextNode('hello world', true);
var metadata = document.getElementsByTagNameNS(svgns, 'metadata');
metadata.appendChild(textNode);

The final argument should be 'true' to indicate that you will use this
text node in your SVG. This is needed for some internal machinery to work
correctly. If you don't give the final argument or set it to false then
you will get a normal text node that you can use with HTML content.

Whitespace Handling
-------------------

In an XML document there can be whitespace, such as spaces and newlines, between
tags. Example:

<mytag>text</mytag>    <anothertag>foobar</anothertag>

Internet Explorer handles whitespace different than other browsers. In order
to normalize things, when dealing with embedded SVG content we remove all
the whitespace that is between tags. This will allow you to create 
JavaScript DOM code that works consistently between browsers. No empty
whitespace text nodes will be in the SVG portion of the DOM.

Remember, though, that the rest of your HTML document will be using the
whitespace behavior of the browser itself. For example, if you have a BODY
tag with some nested SVG and are calling BODY.childNodes, whitespace elements 
will show up in the DOM on all browsers except for Internet Explorer.

Known Issues
------------
Most of the known issues are pretty minor and tend to affect edge conditions
you won't run into often, but they are documented here for reference:

* If you use the Flash viewer on browsers such as Firefox and Safari, rather
than Internet Explorer, and embed some SVG into a SCRIPT tag, the Flash will 
show up directly in the DOM as an EMBED tag with the 'class' set to 'embedssvg'. 
You can get the SVG root element by calling 'documentElement' on the EMBED tag
(this is non-standard and is not part of the SVG 1.1 spec).

For example, if your page had an SVG SCRIPT block right under the BODY tag, 
this would get transformed into an EMBED tag with the Flash viewer:

BODY
   EMBED (class='embedssvg')
       svg root
       
Using script you could get the svg root node as follows:

var embed = document.body.childNodes[0];
if (embed.className && embed.className.indexOf('embedssvg') != -1) {
  var svg = embed.documentElement;
  // now have root SVG element and can manipulate it as normal
}

Internet Explorer does not have this limitation, with the SVG root element
showing up directly in the DOM.

* Scoping getElementsByTagNameNS on elements other than the document element is
not supported. For example, you can not currently do
document.body.getElementsByTagNameNS(svgns, 'rect') or
myDiv.getElementsByTagNameNS(svgns, 'ellipse').

* If you have no HTML TITLE element on the page when using the native
renderer, Safari 3 will incorrectly pick up the first SVG TITLE element 
instead and set the page title at the top of the browser. To correct this, 
if you have no HTML TITLE, we automatically place an empty HTML TITLE into 
the HEAD of the page, which fixes the issue.

* DOM Mutation Events will not fire for SVG nodes when the Flash viewer
is used (i.e. if you create an SVG circle and then attach it to the document, 
a DOM Mutation event will not fire).

* There is an edge condition around text node equality. If you have
a text node as a child, such as in an SVG DESC element, and then grab it:

var textNode1 = myDesc.firstChild;

then grab it in a different way, such as by a sibling:

var textNode2 = someSibling.nextSibling; // should be same as textNode1

Technically different objects are returned under some conditions. 

== will sometimes work:

if (textNode1 == textNode2) // correctly resolves to true

However, the identity === may not work under some conditions:

if (textNode1 === textNode2) // incorrectly resolves to false

This is a rare issue, and would only occur if you have SVG that has
XML mixed content in it (which SVG does not have in general).

* You should declare all of the namespaces you want to use on one of your 
SVG root elements before calling createElementNS; unknown namespaces will
not work afterwards. For example, if you have the following SVG:

<svg id="mySVG" width="500" height="500"><metadata/></svg>

You could not do the following:

var dc = document.createElementNS('http://purl.org/dc/elements/1.1/', 
                                  'dc:creator');
var metadata = document.getElementsByTagNameNS(svgns, 'metadata')[0];
metadata.appendChild(dc);

This is because the DC (Dublic Core) namespace is not declared. To make
this work, you should have the namespace on your SVG root markup:

<svg id="mySVG" width="500" height="500"
     xmlns:dc="http://purl.org/dc/elements/1.1/">
   <metadata/>
</svg>

Note that this limitation is done on purpose to support existing XHTML
documents that want to use createElementNS for their own purposes.

* On Internet Explorer we don't support wildcarding a given tag name
across known namespaces and a given tag:

getElementsByTagNameNS(*, 'someTag');

We _do_ support wildcard calls of the following type:

getElementsByTagNameNS('*', '*');
getElementsByTagNameNS('someNameSpace', '*');
getElementsByTagNameNS(null, 'someTag');

* insertBefore only accepts DOM element nodes for now, not DOM text nodes

* Only DOM element, text, and document type nodes are supported across the
system; this means you can't dynamically work and insert processing
instructions, comments, attributes, etc.

* The isSupported() method on SVG DOM Nodes is not natively supported by Firefox,
so therefore doesn't work when the Native Handler is being used:

svgPath.isSupported('Core', '2.0')

It works on Safari and when the Flash Handler is being used on all browsers.
  
What SVG Features Are and Are Not Supported
-------------------------------------------

TODO: Fill this in

Supported:

Not Currently Supported:
* SMIL
* Percentage values for the width and height of an SVG root element

*/

(function(){ // hide everything externally to avoid name collisions
 
// expose namespaces globally to ease developer authoring
window.svgns = 'http://www.w3.org/2000/svg';
window.xlinkns = 'http://www.w3.org/1999/xlink'; 
 
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

// end browser detection


// be able to have debug output when there is no Firebug
if (typeof console == 'undefined' || !console.log) {
  var queue = [];
  console = {};
  console.log = function(msg) {
    var body = null;
    // IE can sometimes throw an exception if document.body is accessed
    // before the document is fully loaded
    try { body = document.getElementsByTagName('body')[0]; } catch (exp) {}

    if (!body) {
      queue.push(msg);
      return;
    }
      
    var p;
    while (queue.length) {
      var oldMsg = queue.shift();
      p = document.createElement('p');
      p.appendChild(document.createTextNode(oldMsg));
      body.appendChild(p);
    }
    
    // display new message now
    p = document.createElement('p');
    p.appendChild(document.createTextNode(msg));
    body.appendChild(p);
  };
}
// end debug output methods

/*
  Quick way to define prototypes that take up less space and result in
  smaller file size; much less verbose than standard 
  foobar.prototype.someFunc = function() lists.

  @param f Function object/constructor to add to.
  @param addMe Object literal that contains the properties/methods to
    add to f's prototype.
*/
function extend(f, addMe) {
  for (var i in addMe) {
    f.prototype[i] = addMe[i];
  }
}

/**
  Mixes an object literal of properties into some instance. Good for things 
  that mimic 'static' properties.
  
  @param f Function object/contructor to add to
  @param addMe Object literal that contains the properties/methods to add to f.
*/
function mixin(f, addMe) {
  for (var i in addMe) {
    f[i] = addMe[i];
  } 
}

/** Utility function to do XPath cross browser.

    @param doc Either HTML or XML document to work with.
    @param context DOM node context to restrict the xpath executing 
    against; can be null, which defaults to doc.documentElement.
    @param expr String XPath expression to execute.
    @param namespaces Optional; an array that contains prefix to namespace
    lookups; see the getNamespaces_() methods in this file for how this
    data structure is setup.
    
    @returns Array with results, empty array if there are none. */
function xpath(doc, context, expr, namespaces) {
  if (!context) {
    context = doc.documentElement;
  }
  if (typeof XPathEvaluator != 'undefined') { // non-IE browsers
    var evaluator = new XPathEvaluator();
    var resolver = doc.createNSResolver(context);
    var result = evaluator.evaluate(expr, context, resolver, 0, null);
    var found = createNodeList(), current;
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

/** Parses the given XML string and returns the document object.

    @param xml XML String to parse.
    
    @returns XML DOM document node.
*/
function parseXML(xml) {
  var xmlDoc;
  
  if (typeof DOMParser != 'undefined') { // non-IE browsers
    // parse the SVG using an XML parser
    var parser = new DOMParser();
    try { 
      xmlDoc = parser.parseFromString(xml, 'application/xml');
    } catch (e) {
      throw e;
    }
    
    var root = xmlDoc.documentElement;
    if (root.nodeName == 'parsererror') {
      throw 'There is a bug in your SVG: '
             + (new XMLSerializer().serializeToString(root));
    }
  } else { // IE
    // only use the following two MSXML parsers:
    // http://blogs.msdn.com/xmlteam/archive/2006/10/23/using-the-right-version-of-msxml-in-internet-explorer.aspx
    var versions = [ 'Msxml2.DOMDocument.6.0', 'Msxml2.DOMDocument.3.0' ];
    
    var xmlDoc;
    for (var i = 0; i < versions.length; i++) {
      try {
        xmlDoc = new ActiveXObject(versions[i]);
        if (xmlDoc) {
          break;
        }
      } catch (e) {}
    }
    
    if (!xmlDoc) {
      throw 'Unable to instantiate XML parser';
    }
    
    try {
      xmlDoc.async = 'false';
      xmlDoc.loadXML(xml);
    } catch (e) {
      console.log(e.message);
      throw 'Unable to parse SVG: ' + e.message;
    }
  }
  
  return xmlDoc;
}

/*
  Useful for closures and event handlers. Instead of having to do
  this:
  
  var self = this;
  window.onload = function(){
      self.init();
  }
  
  you can do this:
  
  window.onload = hitch(this, 'init');
  
  @param context The instance to bind this method to.
  @param method A string method name or function object to run on context.
*/
function hitch(context, method) {
  if (typeof method == 'string') {
    method = context[method];
  }
  
  return function() {
    var args = undefined;
    if (arguments.length) {
      args = arguments;
    }
    
    // even though 'args' might be undefined in some cases and it should
    // be correct to pass in an undefined value to a function, IE
    // doesn't like it if there is no value and throws an error
    if (args) {
      return method.apply(context, args);
    } else {
      return method.apply(context);
    }
  }
}


/** 
  Our singleton object that acts as the primary entry point for the library. 
  Gets exposed globally as 'svgweb'.
*/
function SVGWeb() {
  // grab any configuration that might exist on where our library resources
  // are
  this.libraryPath = this.getLibraryPath_();
  
  // prepare IE by inserting special markup into the page to have the HTC
  // be available
  if (document.namespaces) { // IE
    this.prepareBehavior_();
  }
  
  // wait for our page's DOM content to be available
  this.initDOMContentLoaded_();
}

extend(SVGWeb, {
  // path to find library resources
  libraryPath: './',
  // RenderConfig object of which renderer (native or Flash) to use
  config: null,
  pageLoaded: false,
  handlers: [],
  
  listeners_: [],
  
  /** Associative array of all random IDs we have ever autogenerated to prevent
      collisions. */
  randomIDs_: {},
  
  /** A data structure that we used to keep track of removed nodes, necessary
      so we can clean things up and prevent memory leaks on IE on page unload.
      Unfortunately we have to keep track of this at the global 'svgweb'
      level rather than on individual handlers because a removed node
      might have never been associated with a real DOM or a real handler. */
  removedNodes_: [],
  
  /** Adds an event listener to know when both the page, the internal SVG
      machinery, and any SVG SCRIPTS or OBJECTS are finished loading.
      Window.onload is not safe, since it can get fired before we are
      truly done, so this method should be used instead.
      
      @param listener Function that will get called when page and all
      embedded SVG is loaded and rendered. */
  addOnLoad: function(listener) {
    this.listeners_.push(listener);
  },
  
  /** Returns a string for the given handler for this platform, 'flash' if
      flash is being used or 'native' if the native capabilities are being
      used. */
  getHandlerType: function() {
    if (this.renderer == FlashHandler) {
      return 'flash';
    } else if (this.renderer == NativeHandler) {
      return 'native';
    }
  },
  
  /** Sets up an onContentLoaded listener */
  initDOMContentLoaded_: function() {
    // onDOMContentLoaded code adapted from Dean Edwards/Matthias Miller/
    // John Resig/others
  
    var self = this;
    // FIXME: Test to make sure this works on Safari 2
    if (document.addEventListener) {
      // DOMContentLoaded supported on Opera 9/Mozilla/Safari 3
      document.addEventListener('DOMContentLoaded', function() {
        self.onDOMContentLoaded_();
      }, false);
    } else { // Internet Explorer
      // id is set to be __ie__svg__onload rather than __ie_onload so
      // we don't have name collisions with other scripts using this
      // code as well
      document.write('<script id=__ie__svg__onload defer '
                      + 'src=javascript:void(0)><\/script>');
      var script = document.getElementById('__ie__svg__onload');
      // do this externally to prevent a memory leak rather than
      // with a closure binding to the instance to a 'self' variable
      script.onreadystatechange = hitch(this, this.onDOMContentLoaded_);
    }
  },
  
  /** Fires when the DOM content of the page is ready to be worked with. */
  onDOMContentLoaded_: function() {
    if (document.readyState != 'complete') {
      return;
    }
    
    //console.log('onDOMContentLoaded');
    
    // quit if this function has already been called
    if (arguments.callee.done) {
      return;
    }
    
    // flag this function so we don't do the same thing twice
    arguments.callee.done = true;
    
    // determine what renderers (native or Flash) to use for which browsers
    this.config = new RenderConfig();
    
    // sign up for the onunload event on IE to clean up references that
    // can cause memory leaks
    if (isIE) {
      this.watchUnload_();
    }
    
    // extract any SVG SCRIPTs or OBJECTs
    this.svgScripts_ = this.getSVGScripts_();
    this.svgObjects_ = this.getSVGObjects_();
    
    this.totalSVG = this.svgScripts_.length + this.svgObjects_.length;
    
    // no SVG - we're done
    if (this.totalSVG == 0) {
      if (isIE) {
        // TODO: dynamic SVG
        // we need to embed some hidden SVG for IE to 'prime the pump' to
        // have the HTC behavior be available
        //this.embedHiddenSVG_();
        // fire the onload when the hidden SVG is done
      } else {
        this.fireOnLoad_();
      }
    }
    
    // see if we can even support SVG in any way
    if (!this.config.supported) {
      // no ability to use SVG in any way
      this.displayNotSupported_(this.config.reason);
      this.fireOnLoad_();
      return;
    }
    
    // setup which renderer we will use
    this.renderer;
    if (this.config.use == 'flash') {
      this.renderer = FlashHandler;
    } else if (this.config.use == 'native') {
      this.renderer = NativeHandler;
    }
    
    // handle a peculiarity for Safari (see method for details)
    this.handleHTMLTitleBug_();
  
    // now process each of the SVG SCRIPTs and SVG OBJECTs
    this.totalLoaded = 0;
    var self = this;
    for (var i = 0; i < this.svgScripts_.length; i++) {
      this.processSVGScript_(this.svgScripts_[i]);
    }
    
    for (var i = 0; i < this.svgObjects_.length; i++) {
      this.processSVGObject_(this.svgObjects_[i]);
    }
    
    // wait until all of them have done their work, then fire onload
  },
  
  /** Gets any data-path value that might exist on the SCRIPT tag
      that pulls in our svg.js library to configure where to find
      library resources like SWF files, HTC files, etc. */
  getLibraryPath_: function() {
    // determine the path to our HTC and Flash files
    var libraryPath = './';
    var scripts = document.getElementsByTagName('script');
    for (var i = 0; i < scripts.length; i++) {
      if (scripts[i].src.indexOf('svg.js') != -1 
          && scripts[i].getAttribute('data-path')) {
        libraryPath = scripts[i].getAttribute('data-path');
        break;
      }
    }
    
    if (libraryPath.charAt(libraryPath.length - 1) != '/') {
      libraryPath += '/';
    }
    
    return libraryPath;
  },
  
  /** Gets any SVG SCRIPT blocks on the page. */
  getSVGScripts_: function() {
    var scripts = document.getElementsByTagName('script');
    var results = [];
    for (var i = 0; i < scripts.length; i++) {
      if (scripts[i].type == 'image/svg+xml') {
        results.push(scripts[i]);
      }
    }
    
    return results;
  },

  /** Gets any SVG OBJECTs on the page. */
  getSVGObjects_: function() {
    var objs = document.getElementsByTagName('object');
    var results = [];
    for (var i = 0; i < objs.length; i++) {
      if (objs[i].type == 'image/svg+xml') {
        results.push(objs[i]);
      }
    }
    
    return results;
  },
  
  /** Displays not supported messages. 
  
      @param reason String containing why this browser is not supported. */
  displayNotSupported_: function(reason) {
    // write the reason into the OBJECT tags if nothing is already present
    for (var i = 0; i < this.svgObjects_.length; i++) {
      var obj = this.svgObjects_[i];
      // ignore whitespace children
      if (!obj.childNodes.length || 
          (obj.childNodes.length == 1 && obj.childNodes[0].nodeType == 3
            && /^[ ]*$/m.test(obj.childNodes[0].nodeValue))) {
        var span = document.createElement('span');
        span.className = 'svg-noscript';
        span.appendChild(document.createTextNode(reason));
        obj.parentNode.replaceChild(span, obj);
      }
    }
    
    // surface any adjacent NOSCRIPTs that might be adjacent to our SVG
    // SCRIPTs; if none present, write out our reason
    for (var i = 0; i < this.svgScripts_.length; i++) {
      var script = this.svgScripts_[i];
      var output = document.createElement('span');
      output.className = 'svg-noscript';
      
      var sibling = script.nextSibling;
      // jump past everything until we hit our first Element
      while (sibling && sibling.nodeType != 1) {
        sibling = sibling.nextSibling;
      }
      
      if (sibling && sibling.nodeName.toLowerCase() == 'noscript') {
        var noscript = sibling;
        output.innerHTML = noscript.innerHTML;
      } else {
        output.appendChild(document.createTextNode(reason));
      }
      
      script.parentNode.insertBefore(output, script);
    }
  },
  
  /** Fires any addOnLoad() listeners that were registered by a developer. */
  fireOnLoad_: function() {
    this.pageLoaded = true;
    
    // TODO: handle dynamic SVG
    // start watching to see if dynamic SVG has been created; see the method
    // itself for details why
    //this.watchDynamicSVG_();
    
    // we do a slight timeout so that if exceptions get thrown inside the
    // developers onload methods they will correctly show up and get reported
    // to the developer; otherwise since the fireOnLoad method is called 
    // from Flash and an exception gets called it can get 'squelched'
    var self = this;
    window.setTimeout(function() {
      for (var i = 0; i < self.listeners_.length; i++) {
        self.listeners_[i]();
      }
    }, 1);
    
    // TODO: remember to fire on all of the SVG handlers as well, not just the
    // persisted developers window onload
  },
  
  /** Prepares the svg.htc behavior for IE. */
  prepareBehavior_: function() {
    // Adapted from Mark Finkle's SVG using VML project

    // add the SVG namespace to the page in a way IE can use
    var ns = null;
    for (var i = 0; i < document.namespaces.length; i++) {
      if (document.namespaces.item(i).name == 'svg') {
        ns = document.namespaces.item(i);
        break;
      }
    }
    
    if (ns === null) {
      ns = document.namespaces.add('svg', svgns);
    }
    
    // attach SVG behavior to the page
    ns.doImport(this.libraryPath + 'svg.htc');
  },
  
  /** Embeds some hidden SVG into the page for IE to prepare the Microsoft
      Behavior HTC. */
  embedHiddenSVG_: function() {
    // TODO: Handle dynamic SVG
  },
  
  /** Extracts SVG from the script, cleans it up, adds missing IDs to
      all elements, and then creates the correct Flash or Native handler to do 
      the hard work. 
      
      @param script DOM node of the SVG SCRIPT element. */
  processSVGScript_: function(script) {
    var svg = script.innerHTML;
    
    // remove any leading whitespace from beginning and end of SVG doc
    svg = svg.replace(/^\s*/, '');
    svg = svg.replace(/\s*$/, '');
    
    // add any missing things (XML declaration, SVG namespace, etc.)
    if (/\<\?xml/m.test(svg) == false) { // XML declaration
      svg = '<?xml version="1.0"?>\n' + svg;
    }
    // add SVG namespace declaration; don't however if there is a custom 
    // prefix for SVG namespace
    if (/\<[^\:]+\:svg/m.test(svg) == false) {
      if (/xmlns\=['"]http:\/\/www\.w3\.org\/2000\/svg['"]/.test(svg) == false) {
        svg = svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
      }
    }
    // add xlink namespace if it is not present
    if (/xmlns:[^=]+=['"]http:\/\/www\.w3\.org\/1999\/xlink['"]/.test(svg) == false) {
      svg = svg.replace('<svg', '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }
    
    // remove whitespace between tags to normalize the DOM between IE
    // and other browsers
    svg = svg.replace(/\>\s+\</gm, '><');
    
    // add missing IDs to all elements and get the root SVG elements ID
    var xml = this.addIDs_(svg);
    if (typeof XMLSerializer != 'undefined') { // non-IE browsers
      svg = (new XMLSerializer()).serializeToString(xml);
    } else { // IE
      svg = xml.xml;
    }
    
    var rootID = xml.documentElement.getAttribute('id');
    
    // create the correct handler
    var self = this;
    var finishedCallback = function(id, type){
      // prevent IE memory leaks
      script = null;
      xml = null;

      self.handleDone_(id, type);
    }
    
    var handler = new this.renderer({type: 'script', 
                                      svgID: rootID,
                                      xml: xml, 
                                      svgString: svg,
                                      scriptNode: script,
                                      finishedCallback: finishedCallback});
    // NOTE: FIXME: If someone chooses a rootID that starts with a number
    // this will break
    this.handlers[rootID] = handler;
    this.handlers.push(handler);                          
  },
  
  /** Generates a random SVG ID. It is recommended that you use the prefix
      and postfix; we keep a lookup table of all random IDs we have ever
      generated to prevent collisions, and using these increases the chance
      that there is not a previous ID that we didn't autogenerate that might
      collide.
      @param prefix An optional string to add to the beginning of the ID.
      @param postfix An optional string to add to the end of the ID. */
  generateID_: function(prefix, postfix) {
    // generate an ID for this element
    if (!postfix) {
      postfix = '';
    }
    
    if (!prefix) {
      prefix = '';
    }
    
    var newID = null;
    while (!newID || this.randomIDs_['_' + newID]) {
      newID = prefix + Math.round(Math.random() * 100000 + 1) + postfix;
    }
    
    this.randomIDs_['_' + newID] = newID;
    
    return newID;
  },
  
  /** Walks the SVG DOM, adding automatic generated IDs to those
      elements which don't have them. We need IDs on all elements
      in order to be able to 'shadow' values between them and
      the SVG DOM inside the Flash viewer; we don't do this for the
      Native handler.
      
      @returns Parsed DOM XML Document of the SVG with all elements having 
      an ID. */
  addIDs_: function(svg) {
    // parse the SVG
    var xmlDoc = parseXML(svg);
    var root = xmlDoc.documentElement;
    
    // now walk the parsed DOM
    var current = root;
    while (current) {
      if (this.getHandlerType() == 'flash' && current.nodeType == 1 
          && !current.getAttribute('id')) {
        current.setAttribute('id', this.generateID_('__svg__random__', null));
      }
      
      var next = current.firstChild;
      if (next) {
        current = next;
        continue;
      }
      
      while (current) {
        if (current != root) {
          next = current.nextSibling;
          if (next) {
            current = next;
            break;
          }
        }
        if (current == root) {
          current = null;
        } else {
          current = current.parentNode;
          if (current.nodeType != 1
              || current.nodeName.toUpperCase() == 'SVG') {
            current = null;
          }
        }
      }
    }
    
    return xmlDoc;
  },
  
  /** Extracts or autogenerates an ID for the object and then creates the
      correct Flash or Native handler to do the hard work. */
  processSVGObject_: function(obj) {
    // TODO: Implement
    
    // extract an ID from the OBJECT tag
    
    // if there is none, generate a random ID
    
    // place it back into the OBJECT tag
    
    // create the correct handler; null out 'obj' to prevent IE memory
    // leaks on the finishedCallback
  },
  
  /** Called when an SVG SCRIPT or OBJECT is done loading. If we are finished
      loading every SVG item then we fire window onload and also indicate to
      each handler that the page is finished loading so that handlers can
      take further action, such as executing any SVG scripts that might be
      inside of an SVG file loaded in an SVG OBJECT. 
      
      @param ID of either the SVG root element inside of an SVG SCRIPT or 
      the SVG OBJECT that has finished loading.
      @param type Either 'script' for an SVG SCRIPT or 'object' for an
      SVG OBJECT.
      */
  handleDone_: function(id, type) {
    this.totalLoaded++;
    
    if (this.totalLoaded == this.totalSVG) {
      // we are finished
      this.fireOnLoad_();
    }
  },
  
  /** Handles SVG that is created dynamically after page load, both for 
      native support and Flash support. The reason we need to know whether
      a node has been dynamically created if native support is used is because
      we slightly modify the SVG standard to require an onload listener
      if you create an SVG root:
      
      root = document.createElementNS(svgns, 'svg');
		  root.addEventListener('SVGLoad', function(evt) {
		    // do something
		  }, false);
		  
		  This is needed because on browsers where the Flash renderer is being
		  used creating a new root is fundamentally an asynchronous process, so
		  we need a callback. */
  watchDynamicSVG_: function() {
    // TODO
  },
  
  /** Safari 3 has a strange bug where if you have no HTML TITLE element,
      it will interpret the first SVG TITLE as the HTML TITLE and change
      the browser's title at the top of the title bar; this only happens
      with the native handler, but for consistency we insert an empty
      HTML TITLE into the page if none is present for all handlers
      which solves the issue. */
  handleHTMLTitleBug_: function() {
    var head = document.getElementsByTagName('head')[0];
    var title = head.getElementsByTagName('title');
    if (title.length == 0) {
      title = document.createElement('title');
      head.appendChild(title);
    }
  },
  
  /** This method is a hook useful for unit testing; unit testing can
      override it to be informed if an error occurs inside the Flash
      so that we can stop the unit test and report the error. */
  fireFlashError_: function(logString) {
  },
  
  /** Add an .id attribute for non-SVG and non-HTML nodes for the Native
      Handler, which don't have them by default in order to have parity with the
      Flash viewer. We have this here instead of on the Native Handlers
      themselves because the method is called by our patched 
      document.getElementByTagNameNS and we don't want to do any closure
      magic there to prevent memory leaks. */
  exportID_: function(node) {
    node.__defineGetter__('id', function() {
      return node.getAttribute('id');
    });
    node.__defineSetter__('id', function(newValue) {
      return node.setAttribute('id', newValue);
    });
  },
  
  /** Sign up for the onunload event on IE to clean up references that
      can cause memory leaks. */
  watchUnload_: function() {
    window.attachEvent('onunload', function(evt) {
      // detach this anonymous listener
      window.detachEvent('onunload', arguments.callee);
      
      // ADDED BY ME!
      return;
      
      // delete the HTC container and all HTC nodes
      var container = document.getElementById('_htc__container');
      if (container) {
        // COMMENTED BY ME! Test to see if this helps
        /*
        for (var i = 0; i < container.childNodes.length; i++) {
          var child = container.childNodes[i];
          child.fakeNode_ = null;
          child.handler_ = null;
        }*/
        container.parentNode.removeChild(container);
        container = null;
      }

      // clean up svg:svg root tags
      for (var i = 0; i < svgweb.handlers.length; i++) {
        var root = svgweb.handlers[i].document.documentElement.htc_;
        // clean up our hidden HTML DOM and our Flash object
        var flashObj = root.getFlashObj_();
        flashObj.sendToFlash = null;
        flashObj.parentNode.removeChild(flashObj);
        var html = root.doc_.getElementsByTagName('html')[0];
        html.parentNode.removeChild(html);
        root.doc_ = null;
        
        // remove the root from the DOM
        root.realParentNode_.removeChild(root);
          
        // delete object references
        root.fakeNode_ = null;
        root.realParentNode_ = null;
        root.realPreviousSibling_ = null;
        root.realNextSibling_ = null;
        root.handler_ = null;
      }
      roots = null;

      // for all the handlers, remove their reference to the Flash object
      for (var i = 0; i < svgweb.handlers.length; i++) {
        var handler = svgweb.handlers[i];
        handler.flash = null;
      }
      svgweb.handlers = null;

      // clean up any nodes that were removed in the past
      for (var i = 0; i < svgweb.removedNodes_.length; i++) {
        var node = svgweb.removedNodes_[i];
        node.fakeNode_ = null;
        node.handler_ = null;
      }
      svgweb.removedNodes_ = null;
      
      // cleanup document patching
      document.getElementById = null;
      document.getElementById_ = null;
      document.getElementsByTagNameNS = null;
      document.getElementsByTagNameNS_ = null;
      document.createElementNS = null;
      document.createElementNS_ = null;
      document.createTextNode = null;
      document.createTextNode_ = null;
      document.importNodeFunc_ = null;
      
      window.svgweb = null;
    });
  }
});


/** Sees if there is a META tag to force Flash rendering for all browsers.
    Also determines if the browser supports native SVG or Flash and the
    correct Flash version. Determines the best renderer to use. */
function RenderConfig() {
  // see if there is a META tag for 'svg.render.forceflash'
  if (!this.forceFlash_()) {
    // if not, see if this browser natively supports SVG
    if (this.hasNativeSVG_()) {
      this.supported = true;
      this.use = 'native';
      return;
    }
  } else {
    console.log('Forcing Flash SVG viewer for this browser');
  }
  
  // if not, see if this browser has Flash and the correct Flash version (9+)
  var info = new FlashInfo();
  if (info.capable) {
    if (info.isVersionOrAbove(9, 0, 0)) {
      this.supported = true;
      this.use = 'flash';
    } else { // has Flash but wrong version
      this.supported = false;
      this.reason = 'Flash 9+ required';
    }
  } else { // no Flash present
    this.supported = false;
    this.reason = 'Flash 9+ or a different browser required';
  }
}

extend(RenderConfig, {
  /** Boolean on whether the given browser is supported. */
  supported: false,
  
  /* String on why the given browser is not supported. */
  reason: null,
  
  /** String on which renderer to use: flash or native. */
  use: null,
  
  /** Determines if there is the META tag 'svg.render.forceflash' set to
      true. */
  forceFlash_: function() {
    var meta = document.getElementsByTagName('meta');
    for (var i = 0; i < meta.length; i++) {
      if (meta[i].name == 'svg.render.forceflash' &&
          meta[i].content.toLowerCase() == 'true') {
        return true;
      }
    }
    
    return false;
  },
  
  /** Determines whether this browser supports native SVG. */
  hasNativeSVG_: function() {
    if (document.implementation && document.implementation.hasFeature) {
      return document.implementation.hasFeature(
            'http://www.w3.org/TR/SVG11/feature#BasicStructure', '1.1');
    } else {
      return false;
    }
  }
});


// adapted from Dojo Flash dojox.flash.Info
function FlashInfo(){
	// summary: A class that helps us determine whether Flash is available.
	// description:
	//	A class that helps us determine whether Flash is available,
	//	it's major and minor versions, and what Flash version features should
	//	be used for Flash/JavaScript communication. Parts of this code
	//	are adapted from the automatic Flash plugin detection code autogenerated 
	//	by the Macromedia Flash 8 authoring environment.

	this.detectVersion_();
}

FlashInfo.prototype = {
	// version: String
	//		The full version string, such as "8r22".
	version: -1,
	
	// versionMajor, versionMinor, versionRevision: String
	//		The major, minor, and revisions of the plugin. For example, if the
	//		plugin is 8r22, then the major version is 8, the minor version is 0,
	//		and the revision is 22. 
	versionMajor: -1,
	versionMinor: -1,
	versionRevision: -1,
	
	// capable: Boolean
	//		Whether this platform has Flash already installed.
	capable: false,
	
	isVersionOrAbove: function(
							/* int */ reqMajorVer, 
							/* int */ reqMinorVer, 
							/* int */ reqVer){ /* Boolean */
		// summary: 
		//	Asserts that this environment has the given major, minor, and revision
		//	numbers for the Flash player.
		// description:
		//	Asserts that this environment has the given major, minor, and revision
		//	numbers for the Flash player. 
		//	
		//	Example- To test for Flash Player 7r14:
		//	
		//	info.isVersionOrAbove(7, 0, 14)
		// returns:
		//	Returns true if the player is equal
		//	or above the given version, false otherwise.
		
		// make the revision a decimal (i.e. transform revision 14 into
		// 0.14
		reqVer = parseFloat("." + reqVer);
		
		if (this.versionMajor >= reqMajorVer && this.versionMinor >= reqMinorVer
			 && this.versionRevision >= reqVer) {
			return true;
		} else {
			return false;
		}
	},
	
	detectVersion_: function(){
		var versionStr;
		
		// loop backwards through the versions until we find the newest version	
		for (var testVersion = 25; testVersion > 0; testVersion--) {
			if (isIE) {
				var axo;
				try {
					if (testVersion > 6) {
						axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash." 
																		+ testVersion);
					} else {
						axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
					}
					if (typeof axo == "object") {
						if (testVersion == 6) {
							axo.AllowScriptAccess = "always";
						}
						versionStr = axo.GetVariable("$version");
					}
				} catch(e) {
					continue;
				}
			} else {
				versionStr = this.JSFlashInfo_(testVersion);		
			}
				
			if (versionStr == -1 ) {
				this.capable = false; 
				return;
			} else if (versionStr != 0) {
				var versionArray;
				if (isIE) {
					var tempArray = versionStr.split(" ");
					var tempString = tempArray[1];
					versionArray = tempString.split(",");
				} else {
					versionArray = versionStr.split(".");
				}
					
				this.versionMajor = versionArray[0];
				this.versionMinor = versionArray[1];
				this.versionRevision = versionArray[2];
				
				// 7.0r24 == 7.24
				var versionString = this.versionMajor + "." + this.versionRevision;
				this.version = parseFloat(versionString);
				
				this.capable = true;
				
				break;
			}
		}
	},
	 
	// JavaScript helper required to detect Flash Player PlugIn version 
	// information.
	JSFlashInfo_: function(testVersion){
		// NS/Opera version >= 3 check for Flash plugin in plugin array
		if (navigator.plugins != null && navigator.plugins.length > 0) {
			if (navigator.plugins["Shockwave Flash 2.0"] || 
				 navigator.plugins["Shockwave Flash"]) {
				var swVer2 = navigator.plugins["Shockwave Flash 2.0"] ? " 2.0" : "";
				var flashDescription = navigator.plugins["Shockwave Flash" + swVer2].description;
				var descArray = flashDescription.split(" ");
				var tempArrayMajor = descArray[2].split(".");
				var versionMajor = tempArrayMajor[0];
				var versionMinor = tempArrayMajor[1];
				var tempArrayMinor = (descArray[3] || descArray[4]).split("r");
				var versionRevision = tempArrayMinor[1] > 0 ? tempArrayMinor[1] : 0;
				var version = versionMajor + "." + versionMinor + "." + versionRevision;
											
				return version;
			}
		}
		
		return -1;
	}
};


/** Creates a FlashHandler that will embed the given SVG into the page using
    Flash. Pass in an object literal with the correct arguments. 
    
    If dealing with an SVG SCRIPT tag these arguments are:
    
    type - The string 'script'.
    svgID - A unique ID for the SVG root tag.
    xml - XML Document object for parsed SVG.
    svgString - The SVG content as a String.
    scriptNode - The DOM element for the SVG SCRIPT block.
    finishedCallback - Called when we are done loading and rendering the
    SVG inside of the Flash player; called with two arguments, the svgID
    that was just rendered and type set to 'script'.
    
    If dealing with an SVG OBJECT tag these arguments are:
    
    type - The string 'object'.
    objID - A unique ID for the SVG OBJECT tag.
    objNode - DOM OBJECT pointing to an SVG URL to handle.
    finishedCallback - Called when we are done loading and rendering the
    SVG inside of the Flash player; called with two arguments, the svgID
    that was just rendered and type set to 'object'. 
  */
function FlashHandler(args) {
  this.type = args.type;
  this.finishedCallback_ = args.finishedCallback;
  
  // setup our custom document.getElementById, document.getElementsByTagNameNS, 
  // etc. methods
  this.patchDocumentObject_();
  
  if (this.type == 'script') {
    this.id = args.svgID;
    this.xml_ = args.xml;
    this.svgString_ = args.svgString;
    this.scriptNode_ = args.scriptNode;
       
    this.handleScript_();
  } else if (this.type == 'object') {
    this.id = args.objID;
    this.objNode_ = args.objNode;
    
    this.handleObject_();
  }
}

extend(FlashHandler, {
  /** The Flash object's ID; set by SVGSVGElement_. */
  flashID: null, 
  /** The Flash object; set by SVGSVGElement_. */
  flash: null,
  
  /** Fired when the page and all SVG elements are done and loaded. */
  fireOnLoad: function() {
  },
  
  /**
    Stringifies the msg object sent back from the Flash SVG renderer or 
    from the HTC file to help with debugging.
  */
  debugMsg: function(msg) {
    // TODO: Create a way to disable this if we are not debugging for
    // performance reasons
    
    if (msg === undefined) {
      return 'undefined';
    } else if (msg === null) {
      return 'null';
    }
    
    var result = [];
    for (var i in msg) {
      result.push(i + ': ' + msg[i]);
    }
    result = result.join(', ');
    
    return '{' + result + '}';
  },
  
  /** Sends a message to the Flash object rendering this SVG. */
  sendToFlash: function(msg) {
    // note that 'this.flash' is set by the SVGSVGElement_.setupFlash_()
    // after we create a Flash object there
    return this.flash.sendToFlash(msg);
  },
  
  /** Called by the VBScript in our HTC. It's difficult and error prone to
      call onMessage, since that takes an object literal. We can simulate
      that with a VBScript Scripting.Dictionary but that has its own issues. */
  onHTCMessage: function(type, eventType, uniqueId, elemDoc, element) {
    var msg = { type: type, eventType: eventType, uniqueId: uniqueId,
                elemDoc: elemDoc, element: element };
    this.onMessage(msg);
                     
    // clean up the members of the message to prevent IE memory leaks
    msg.elemDoc = msg.element = msg = elemDoc = element = null;
  },
  
  onMessage: function(msg) {
    console.log('onMessage, msg='+this.debugMsg(msg));
    if (msg.type == 'event') {
      this.onEvent_(msg);
      return;
    } else if (msg.type == 'log') {
      this.onLog_(msg);
      return;
    } else if (msg.type == 'script') {
      // TODO: Bring onScript over from Rick's fork
      this.onObjectScript_(msg);
      return;
    } else if (msg.type == 'error') {
      this.onFlashError_(msg);
    }
  },
  
  /** Called by SVGSVGElement_ when we are loaded and rendered. 
  
      @param id The ID of the SVG element.
      @param type The type of element that is finished loading,
      either 'script' or 'object'. */
  fireOnLoad: function(id, type) {
    this.finishedCallback_(id, type);
  },
  
  /** Patches the document object to also use the Flash backend. */
  patchDocumentObject_: function() {
    if (document.getElementById_) {
      // already defined before
      return;
    }
    
    // We don't capture the original document functions as a closure, 
    // as Firefox doesn't like this and will fail to run the original. 
    // Instead, we capture the original versions on the document object
    // itself but with a _ prefix.
    
    document.getElementById_ = document.getElementById;
    document.getElementById = this.getElementById_;
    
    document.getElementsByTagNameNS_ = document.getElementsByTagNameNS;
    document.getElementsByTagNameNS = this.getElementsByTagNameNS_;
    
    document.createElementNS_ = document.createElementNS;
    document.createElementNS = this.createElementNS_;
      
    document.createTextNode_ = document.createTextNode;
    document.createTextNode = this.createTextNode_;
    
    document.importNodeFunc_ = this.importNodeFunc_;
  },
  
  /** Our implementation of getElementById, which we patch into the 
      document object. We do it here to prevent a closure and therefore
      a memory leak on IE. Note that this function runs in the global
      scope, so 'this' will not refer to our object instance but rather
      the window object. */
  getElementById_: function(id) {
    var result = document.getElementById_(id);
    if (result != null) { // Firefox doesn't like 'if (result)'
      return result;
    }
    
    for (var i = 0; i < svgweb.handlers.length; i++) {
      result = svgweb.handlers[i].document.getElementById(id);
      if (result) {
        return result;
      }
    }
    
    return null;
  },
  
  /** Our implementation of getElementsByTagNameNS, which we patch into the 
      document object. We do it here to prevent a closure and therefore
      a memory leak on IE. Note that this function runs in the global
      scope, so 'this' will not refer to our object instance but rather
      the window object. */
  getElementsByTagNameNS_: function(ns, localName) {
    var results = createNodeList();
    
    // NOTE: can't use Array.concat to combine our arrays below because 
    // document.getElementsByTagNameNS_ results aren't a real Array
    
    if (document.getElementsByTagNameNS_) {
      var matches = document.getElementsByTagNameNS_(ns, localName);
      
      for (var j = 0; j < matches.length; j++) {
        results.push(matches[j]);
      }
    }
    
    for (var i = 0; i < svgweb.handlers.length; i++) {
      var doc = svgweb.handlers[i].document;
      var matches = doc.getElementsByTagNameNS(ns, localName);
      for (var j = 0; j < matches.length; j++) {
        results.push(matches[j]);
      }
    }

    return results;
  },
  
  /** Our implementation of createElementNS, which we patch into the 
      document object. We do it here to prevent a closure and therefore
      a memory leak on IE. Note that this function runs in the global
      scope, so 'this' will not refer to our object instance but rather
      the window object. */
  createElementNS_: function(ns, qname) {
    if (ns == null || ns == 'http://www.w3.org/1999/xhtml') {
      if (isIE) {
        return document.createElement(qname);
      } else {
        return document.createElementNS_(ns, qname);
      }
    }
    
    // someone might be using this library on an XHTML page;
    // only use our overridden createElementNS if they are using
    // a namespace we have never seen before
    if (!isIE) {
      var namespaceFound = false;
      for (var i = 0; i < svgweb.handlers.length; i++) {
        if (svgweb.handlers[i].document.namespaces_['_' + ns]) {
          namespaceFound = true;
          break;
        }
      }
      
      if (!namespaceFound) {
        return document.createElementNS_(ns, qname);
      }
    }
    
    var prefix;
    for (var i = 0; i < svgweb.handlers.length; i++) {
      prefix = svgweb.handlers[i].document.namespaces_['_' + ns];
      if (prefix) {
        break;
      }
    }
    
    if (prefix == 'xmlns' || !prefix) { // default SVG namespace
      prefix = null;
    }

    var node = new Element_(qname, prefix, ns);
    return node.getProxyNode_(); 
  },
  
  /** Our implementation of createTextNode, which we patch into the 
      document object. We do it here to prevent a closure and therefore
      a memory leak on IE. Note that this function runs in the global
      scope, so 'this' will not refer to our object instance but rather
      the window object. 
      
      We patch createTextNode to have a second boolean argument that controls 
      whether the resulting text node will be appended within our SVG tree. 
      We need this so we can return one of our magic Node_s instead of a native
      DOM node for later appending and tracking. 
      
      @param data Text String.
      @param forSVG Optional boolean on whether node will be attached to
      SVG sub-tree. Defaults to false. */
  createTextNode_: function(data, forSVG) {
    if (!forSVG) {
      return document.createTextNode_(data);
    } else {
      // just create a real DOM text node in our internal representation for
      // our nodeXML value; we will import this anyway into whatever parent
      // we append this to, which will convert it into a real XML type at
      // that time
      var nodeXML = document.createTextNode_(data);
      var textNode = new Node_('#text', Node_.TEXT_NODE, null, null, nodeXML);
      textNode.nodeValue_ = data;
      
      return textNode.getProxyNode_();
    }
  },
  
  /** IE doesn't support the importNode function. We define it on the
      document object as importNodeFunc_. Unfortunately we need it there
      since it is a recursive function and needs to call itself, and we
      don't want to do this on an object instance to avoid memory leaks
      from closures on IE. Note that this function runs in the global scope
      so 'this' will point to the Window object. */
  importNodeFunc_: function(doc, node, allChildren) {
    switch (node.nodeType) {
      case 1: // ELEMENT NODE
        var newNode = doc.createElement(node.nodeName);
        
        // does the node have any attributes to add?
        if (node.attributes && node.attributes.length > 0) {
          for (var i = 0; i < node.attributes.length; i++) {
            var attrName = node.attributes[i].nodeName;
            var attrValue = node.getAttribute(attrName);
            newNode.setAttribute(attrName, attrValue);
          }
        }
        
        // are we going after children too, and does the node have any?
        if (allChildren && node.childNodes && node.childNodes.length > 0) {
          for (var i = 0; i < node.childNodes.length; i++) {
            newNode.appendChild(
                document.importNodeFunc_(doc, node.childNodes[i], allChildren));
          }
        }
        
        return newNode;
        break;
      case 3: // TEXT NODE
        return doc.createTextNode(node.nodeValue);
        break;
    }
  },
  
  handleScript_: function() {
    // create proxy objects representing the Document and SVG root
    this.document = new Document_(this.xml_, this);
    this.document.documentElement = 
            new SVGSVGElement_(this.xml_.documentElement, this.svgString_,
                               this.scriptNode_, this);
  },
  
  handleObject_: function() {
    // TODO:
  },
  
  onLog_: function(msg) {
    console.log('FLASH: ' + msg.logString);
  },
  
  onEvent_: function(msg) {
    if (msg.eventType.substr(0, 5) == 'mouse') {
      this.onMouseEvent_(msg);
      return;
    } else if (msg.eventType == 'onRenderingFinished') {
      this.document.documentElement.onRenderingFinished_(msg);
      return;
    } else if (msg.eventType == 'onFlashLoaded') {
      this.document.documentElement.onFlashLoaded_(msg);
      return;
    } else if (msg.eventType == 'onHTCLoaded') {
      this.document.documentElement.onHTCLoaded_(msg);
    }
  },
  
  /** Calls if the Flash encounters an error. */
  onFlashError_: function(msg) {
    this.onLog_(msg);
    svgweb.fireFlashError_('FLASH: ' + msg.logString);
    throw 'FLASH: ' + msg.logString;
  }
});  


/** Creates a NativeHandler that will embed the given SVG into the page using
    native SVG support. Pass in an object literal with the correct arguments. 
    
    If dealing with an SVG SCRIPT tag these arguments are:
    
    type - The string 'script'.
    svgID - A unique ID for the SVG root tag.
    xml - XML Document object for parsed SVG.
    svgString - The SVG content as a String.
    scriptNode - The DOM element for the SVG SCRIPT block.
    finishedCallback - Called when we are done loading and rendering the
    SVG; called with two arguments, the svgID that was just rendered and 
    type set to 'script'.
    
    If dealing with an SVG OBJECT tag these arguments are:
    
    type - The string 'object'.
    objID - A unique ID for the SVG OBJECT tag.
    objNode - DOM OBJECT pointing to an SVG URL to handle.
    finishedCallback - Called when we are done loading and rendering the
    SVG; called with two arguments, the svgID that was just rendered and 
    type set to 'object'.
  */
function NativeHandler(args) {
  this.type = args.type;
  this.finishedCallback_ = args.finishedCallback;
  
  this.xml_ = args.xml;
  
  if (this.type == 'object') {
    // these are just handled by the browser; just add an onload handler
    // to know when they are done and save any old one that might be present
    this.id = args.objID;
    this.watchObjectLoad_();
  } else if (this.type == 'script') {
    this.id = args.svgID;
    this.namespaces_ = this.getNamespaces_();
    this.patchDocumentObject_();
    this.processSVGScript_(this.xml_, args.svgString, args.scriptNode);
    this.finishedCallback_(this.id, 'script');
  }
}

extend(NativeHandler, {
  /** Fired when the page and all SVG elements are done and loaded. */
  fireOnLoad: function() {
    // fire any developer onload listeners that might have been on an SVG
    // OBJECT
  },
  
  /** Capture any old developer onload listeners that might be on this object,
      and then add our own. */
  watchObjectLoad_: function() {
    // TODO
  },
  
  /** Inserts the SVG back into the HTML page with the correct namespace. */
  processSVGScript_: function(xml, svgString, scriptNode) {
   var importedSVG = document.importNode(xml.documentElement, true);
   scriptNode.parentNode.replaceChild(importedSVG, scriptNode);
   this.svgRoot_ = importedSVG;
  },
  
  patchDocumentObject_: function() {
    if (document.getElementById_) {
      // already defined before
      return;
    }
    
    // we have to patch getElementById because getting a node by ID
    // if it is namespaced to something that is not XHTML or SVG does
    // not work natively; we build up a lookup table in processSVGScript_
    // that we can work with later
    
    // getElementById
    document.getElementById_ = document.getElementById;
    document.getElementById = function(id) {
      var result = document.getElementById_(id);
      if (result != null) { // Firefox doesn't like 'if (result)'
        // This is to solve an edge bug on Safari 3;
        // if you do a replaceChild on a non-SVG, non-HTML node,
        // the element is still returned by getElementById!
        // The element has a null parentNode.
        // TODO: FIXME: Track down whether this is caused by a memory
        // leak of some kind
        if (result.parentNode == null) {
          return null;
        } else {
          return result;
        }
      }
      
      // The id attribute for namespaced, non-SVG and non-HTML nodes
      // does not get picked up by getElementById, such as 
      // <sodipodi:namedview id="someID"/>, so we have to use an XPath 
      // expression
      result = xpath(document, null, '//*[@id="' + id + '"]');
      if (result.length) {
        var node = result[0];
        
        // add an .id attribute for non-SVG and non-HTML nodes, which
        // don't have them by default in order to have parity with the
        // Flash viewer; note Firefox doesn't like if (node.namespaceURI)
        // rather than (node.namespaceURI != null)
        if (node.namespaceURI != null && node.namespaceURI != svgns
            && node.namespaceURI != 'http://www.w3.org/1999/xhtml') {
          svgweb.exportID_(node);
        }
        
        return node;
      } else {
        return null;
      }
    }
    
    // we also have to patch getElementsByTagNameNS because it does 
    // not seem to work consistently with namepaced content in an HTML
    // context, I believe due to casing issues (i.e. if the local name
    // were RDF rather than rdf it won't work)
    
    // getElementsByTagNameNS
    document.getElementsByTagNameNS_ = document.getElementsByTagNameNS;
    document.getElementsByTagNameNS = function(ns, localName) {
      var result = document.getElementsByTagNameNS_(ns, localName);
      
      // firefox doesn't like if (result)
      if (result != null && result.length != 0) {
        if (ns != null && ns != 'http://www.w3.org/1999/xhtml' && ns != svgns) {
          // add an .id attribute for non-SVG and non-HTML nodes, which
          // don't have them by default in order to have parity with the
          // Flash viewer
          for (var i = 0; i < result.length; i++) {
            var node = result[i];
            svgweb.exportID_(node);
          }
          
          return result;
        }
        
        return result;
      }
      
      if (result == null || result.length == 0) {
        result = createNodeList();
      }
      
      var xpathResults;
      for (var i = 0; i < svgweb.handlers.length; i++) {
        var handler = svgweb.handlers[i];
        var prefix = handler.namespaces_['_' + ns];
        if (!prefix) {
          continue;
        }
        
        var expr;
        if (prefix == 'xmlns') { // default SVG namespace
          expr = "//*[namespace-uri()='" + svgns + "' and name()='" 
                 + localName + "']";
        } else if (prefix) {
          expr = '//' + prefix + ':' + localName;
        } else {
          expr = '//' + localName;
        }
        
        xpathResults = xpath(document, handler.svgRoot_, expr, 
                             handler.namespaces_);
        if (xpathResults != null && xpathResults != undefined
            && xpathResults.length > 0) {
          for (var j = 0; j < xpathResults.length; j++) {
            var node = xpathResults[j];
            
            // add an .id attribute for non-SVG and non-HTML nodes, which
            // don't have them by default in order to have parity with the
            // Flash viewer; note Firefox doesn't like if (node.namespaceURI)
            // rather than (node.namespaceURI != null)
            if (node.namespaceURI != null && node.namespaceURI != svgns
                && node.namespaceURI != 'http://www.w3.org/1999/xhtml') {
              svgweb.exportID_(node);
            }
            
            result.push(node);
          }
          
          return result;
        }
      }
      
      return createNodeList();
    }
  },
  
  /** Extracts any namespaces we might have, creating a prefix/namespaceURI
      lookup table.
      
      NOTE: We only support namespace declarations on the root SVG node
      for now.
      
      @returns An object that associates prefix to namespaceURI, and vice
      versa. */
  getNamespaces_: function() {
    var results = [];
    
    var attrs = this.xml_.documentElement.attributes;
    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];
      if (/^xmlns:?(.*)$/.test(attr.nodeName)) {
        var m = attr.nodeName.match(/^xmlns:?(.*)$/);
        var prefix = (m[1] ? m[1] : 'xmlns');
        var namespaceURI = attr.nodeValue;
        
        results['_' + prefix] = namespaceURI;
        results['_' + namespaceURI] = prefix;
        results.push(namespaceURI);
      }
    }
    
    return results;
  }
});

/*
  The SVG 1.1 spec requires DOM Level 2 Core and Events support.
  
  DOM Level 2 Core spec: http://www.w3.org/TR/DOM-Level-2-Core/
  DOM Level 2 Events spec: 
  http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-Registration-interfaces
  
  The following DOM 2 Core interfaces are not supported:
  NamedNodeMap, Attr, Text, Comment, CDATASection, 
  DocumentType, Notation, Entity, EntityReference,
  ProcessingInstruction, DocumentFragment

  We underscore our DOM interface names below so that they don't collide 
  with the browser's implementations of these (for example, Firefox exposes 
  the DOMException, Node, etc. interfaces as well)
*/

function DOMException_(code) {
  this.code = code;
  
  // superclass constructor
  Error(this.toString());
}

// subclass built-in browser Error object
DOMException_.prototype = new Error;

mixin(DOMException_, {
  INDEX_SIZE_ERR: 1, DOMSTRING_SIZE_ERR: 2, HIERARCHY_REQUEST_ERR: 3,
  WRONG_DOCUMENT_ERR: 4, INVALID_CHARACTER_ERR: 5, NO_DATA_ALLOWED_ERR: 6,
  NO_MODIFICATION_ALLOWED_ERR: 7, NOT_FOUND_ERR: 8, NOT_SUPPORTED_ERR: 9,
  INUSE_ATTRIBUTE_ERR: 10, INVALID_STATE_ERR: 11, SYNTAX_ERR: 12,
  INVALID_MODIFICATION_ERR: 13, NAMESPACE_ERR: 14, INVALID_ACCESS_ERR: 15
});

extend(DOMException_, {
  toString: function() {  
    // rather than having a giant switch statement here which will bloat the
    // code size, just dynamically get the property name for the given error 
    // code and turn it into a string
    for (var i in DOMException_) {
      if (i.indexOf('ERR') != -1 && DOMException_[i] === this.code) {
        return String(i);
      }
    }
    
    return 'Unknown error: ' + this.code;
  }
});


function SVGException_(code) {
  this.code = code;
  
  // superclass constructor
  Error(this.toString());
}

// subclass built-in browser Error object
SVGException_.prototype = new Error;

mixin(SVGException_, {
  SVG_WRONG_TYPE_ERR: 0, SVG_INVALID_VALUE_ERR: 1, SVG_MATRIX_NOT_INVERTABLE: 2
});

extend(SVGException_, {
  toString: function() {  
    switch(this.code) {
      case 0: return 'SVG_WRONG_TYPE_ERR';
      case 1: return 'SVG_INVALID_VALUE_ERR';
      case 2: return 'SVG_MATRIX_NOT_INVERTABLE';
      default: return 'Unknown error: ' + this.code;
    }
  }
});


function DOMImplementation_() {}

extend(DOMImplementation_, {
  hasFeature: function(feature /* String */, version /* String */) /* Boolean */ {
    // TODO
  }
  
  // Note: createDocumentType and createDocument left out
});


// Note: Only element and text section nodes are supported for now.
// We don't parse and retain comments, processing instructions, etc. CDATA
// nodes are turned into text nodes.
function Node_(nodeName, nodeType, prefix, namespaceURI, nodeXML, handler, 
               passThrough) {
  if (nodeName == undefined && nodeType == undefined) {
    // prototype subclassing
    return;
  }
  
  this.nodeName = nodeName;
  this.nodeXML_ = nodeXML;
  this.handler_ = handler;
  
  // handle nodes that were created with createElementNS but are not yet
  // attached to the document yet
  this.attached_ = true;
  if (!this.nodeXML_ && !this.handler_) {
    this.attached_ = false;
    
    // build up an empty XML node for this element
    var xml = '<?xml version="1.0"?>\n';
    if (namespaceURI == svgns && !prefix) {
      xml += '<' + nodeName + ' xmlns="' + svgns + '"/>';
    } else {
      xml += '<' + nodeName + ' xmlns:' + prefix + '="' + namespaceURI + '"/>';
    }
  
    this.nodeXML_ = parseXML(xml).documentElement;
  }
  
  if (nodeType == Node_.ELEMENT_NODE) {
    if (nodeName.indexOf(':') != -1) {
      this.localName = nodeName.match(/^[^:]*:(.*)$/)[1];
    } else {
      this.localName = nodeName;
    }
  }
  
  if (nodeType) {
    this.nodeType = nodeType;
  } else {
    this.nodeType = Node_.ELEMENT_NODE;
  }
  
  if (nodeType == Node_.ELEMENT_NODE || nodeType == Node_.DOCUMENT_NODE) {
    this.prefix = prefix;
    this.namespaceURI = namespaceURI;
    this.nodeValue_ = null;
  } else if (nodeType == Node_.TEXT_NODE) {
    this.nodeValue_ = this.nodeXML_.nodeValue;
    
    // browsers return null instead of undefined
    this.prefix = null;
    this.namespaceURI = null;
    if (this.nodeValue_ === undefined) {
      this.nodeValue_ = null;
    }
  }
  
  this.ownerDocument = document;
  
  if (passThrough === undefined) {
    passThrough = false;
  }
  this.passThrough_ = passThrough;
  
  if (!isIE) {
    // NOTE: we make childNodes_ an object literal instead of an Array; if
    // it is an array we can't do __defineGetter__ on each index position on
    // Safari
    this.childNodes_ = {};
  } else { // IE
    this.childNodes_ = [];
  }
  
  // We keep an cachedChildNodes array around until we are truly
  // attached that we can depend on to serve out our childNodes; we can't
  // use this.childNodes_ since that ends up calling our getter/setter
  // magic, which depends on having a real Flash handler assigned to
  // us to do the hard work.
  this.cachedChildNodes_ = [];
  this.cachedParentNode_ = null;
  
  // We track text nodes with an internal node ID.
  if (nodeType == Node_.TEXT_NODE) {
    this.textNodeID_ = svgweb.generateID_('__svg__random__', '__text');
    if (!isIE) { // IE can't add expandos to XML objects
      this.nodeXML_.textNodeID_ = this.textNodeID_;
    }
  }
  
  // prepare the getter and setter magic for non-IE browsers
  if (!isIE) {
    this.defineNodeAccessors_();
  } else if (isIE && this.nodeType != Node_.DOCUMENT_NODE 
             && this.nodeName != 'svg') {
    // if we are IE, we must use a behavior in order to get onpropertychange
    // and override core DOM methods. We don't do it for the root SVG
    // element since that is already a proper Behavior as it embeds our
    // Flash control inside of SVGSVGElement_
    this.createHTC_();
  }
}

mixin(Node_, {
  ELEMENT_NODE: 1,
  TEXT_NODE: 3,
  DOCUMENT_NODE: 9
  
  // Note: many other node types left out here
});

extend(Node_, {
  insertBefore: function(newChild /* Node_ */, refChild /* Node_ */) {   
    // TODO: Throw an exception if either child is a text node, either native
    // or a text Node_
    
    // if the children are DOM nodes, turn them into Node_ or Element_
    // references
    newChild = this.getFakeNode_(newChild);
    refChild = this.getFakeNode_(refChild);

    // get an ID for both children
    var newChildID = this.determineID_(newChild);
    var refChildID = this.determineID_(refChild);
    
    // add an ID entry for newChild into nodeById
    if (newChildID && this.attached_) {
      this.handler_.document.nodeById_['_' + newChildId] = newChild;
    }
    
    // get an index position for where refChild is
    var findResults = this.findChild_(refChild);
    if (findResults === null) {
      // TODO: Throw the correct DOM error instead
      throw new Error('Invalid child passed to insertBefore');
    }
    var position = findResults.position;
    
    // import newChild into ourselves, insert it into our XML, and process
    // the newChild and all its descendants
    var importedNode = this.importNode_(newChild, false);
    this.nodeXML_.insertBefore(importedNode, refChild.nodeXML_);
    this.processAppendedChildren_(newChild, this.attached_, this.passThrough_);
    
    // add to our cached list of child nodes
    if (position >= (this.cachedChildNodes_.length - 1)) {
      this.cachedChildNodes_.push(newChild);
    } else { // oldChild was somwhere at beginning or middle
      this.cachedChildNodes_ = 
                this.cachedChildNodes_.splice(position + 1, 0, newChild);
    }
    
    if (!isIE) {
      // childNodes_ is an object literal instead of an array
      // to support getter/setter magic for Safari
      this.defineChildNodeAccessor_(this.childNodes_.length);
      this.childNodes_.length++;
    }
    
    // set our new correct cached next and previous siblings, which we keep
    // around to hand out in case we become unattached
    oldChild.cachedPreviousSibling_ = oldChild.getPreviousSibling_();
    oldChild.cachedNextSibling_ = oldChild.getNextSibling_();
    newChild.cachedPreviousSibling_ = newChild.getPreviousSibling_();
    newChild.cachedNextSibling_ = newChild.getNextSibling_();
    
    // inform Flash about the change
    if (this.attached_ && this.passThrough_) {
      this.handler_.sendToFlash({ type: 'invoke', 
                                  method: 'insertBefore',
                                  newChildId: newChildId,
                                  refChildId: refChildId,
                                  position: position});
    }
    
    return newChild.getProxyNode_();
  },
  
  replaceChild: function(newChild /* Node_ */, oldChild /* Node_ */) {
    // the children could be DOM nodes; turn them into something we can
    // work with, such as Node_s or Element_s
    newChild = this.getFakeNode_(newChild);
    oldChild = this.getFakeNode_(oldChild);
    
    // get an ID for the oldChild if one is available
    var oldChildID = this.determineID_(oldChild);
    
    // in our XML, find the index position of where oldChild used to be
    var findResults = this.findChild_(oldChild);
    if (findResults === null) {
      // TODO: Throw the correct DOM error instead
      throw new Error('Invalid child passed to removeChild');
    }
    var position = findResults.position;
    
    // remove oldChild
    this.removeChild(origOldChild);
    
    // add to our cached list of child nodes
    if (position >= (this.cachedChildNodes_.length - 1)) {
      this.cachedChildNodes_.push(newChild);
    } else { // oldChild was somwhere at beginning or middle
      this.cachedChildNodes_ = 
                this.cachedChildNodes_.splice(position + 1, 0, newChild);
    }
    
    if (!isIE) {
      // childNodes_ is an object literal instead of an array
      // to support getter/setter magic for Safari
      this.defineChildNodeAccessor_(this.childNodes_.length);
      this.childNodes_.length++;
    }
    
    // import newChild into ourselves, telling importNode not to do an
    // appendChild
    var importedNode = this.importNode_(newChild, false);

    // bring the imported child into our XML where the oldChild used to be
    if (position >= (this.nodeXML_.childNodes.length - 1)) {
      // old node was at the end -- just do an appendChild
      this.nodeXML_.appendChild(importedNode);
    } else {
      // old node is somewhere in the middle or beginning; jump one ahead
      // from the old position and do an insertBefore
      var placeBefore = this.nodeXML_.childNodes[position + 1];
      this.nodeXML_.insertBefore(importedNode, placeBefore);
    }
    
    // now process the newChild's node
    this.processAppendedChildren_(newChild, this.attached_, this.passThrough_);
    
    // recursively set the removed node to be unattached and to not
    // pass through changes to Flash anymore
    oldChild.setUnattached_(null);
    
    // set our new correct cached next and previous siblings, which we keep
    // around to hand out in case we become unattached
    oldChild.cachedPreviousSibling_ = null;
    oldChild.cachedNextSibling_ = null;
    newChild.cachedPreviousSibling_ = newChild.getPreviousSibling_();
    newChild.cachedNextSibling_ = newChild.getNextSibling_();
    
    // TODO: BUG: Shouldn't we tell Flash about the removal of oldChild?
    
    // track this removed node so we can clean it up on page unload
    svgweb.removedNodes_.push(oldChild.getProxyNode_());
    
    return oldChild.getProxyNode_();
  },
  
  removeChild: function(child /* Node_ or DOM Node */) {
    // the child could be a DOM node; turn it into something we can
    // work with, such as a Node_ or Element_
    child = this.getFakeNode_(child);

    // remove child from our list of XML
    var findResults = this.findChild_(child);
    if (findResults === null) {
      // TODO: Throw the correct DOM error instead
      throw new Error('Invalid child passed to removeChild');
    }

    var position = findResults.position;
    this.nodeXML_.removeChild(findResults.node);

    // remove from our nodeById lookup table
    var childID = this.determineID_(child);
    if (childID && this.attached_) {
      this.handler_.document.nodeById_['_' + childID] = undefined;
    }

    // if IE, remove HTC node
    if (isIE) {
      child.htc_._proxyNode = null; // prevent memory leak
      document.getElementById('_htc__container').removeChild(child.htc_);
    }

    // remove from our list of cachedChildNodes
    for (var i = 0; i < this.cachedChildNodes_.length; i++) {
      var node = this.cachedChildNodes_[i];
      var nodeID;
      if (node.nodeType == Node_.ELEMENT_NODE) {
        nodeID = node.getAttribute('id');
      } else if (node.nodeType == Node_.TEXT_NODE && !isIE
                 && node.textNodeID_) {
        nodeID = node.textNodeID_;
      }

      // does this node in the cachedChildNodes array match the
      // child passed in?
      if (childID && nodeID && childID == nodeID) {
        this.cachedChildNodes_.splice(i, 1);
        break;
      } else if (isIE && child.nodeType == Node_.TEXT_NODE
                 && node.nodeType == Node_.TEXT_NODE) {
        if (child.nodeValue_ == node.nodeValue_) {
          this.cachedChildNodes_.splice(i, 1);
          break;
        }
      }
    }

    // remove the getter/setter for this childNode for non-IE browsers
    if (!isIE) {
      // just remove the last getter/setter, since they all resolve
      // to a dynamic function anyway
      delete this.childNodes_[this.childNodes_.length - 1];
      this.childNodes_.length--;
    } else {
      // for IE, remove from childNodes_ data structure
      this.childNodes_.splice(position);
    }
   
    // inform Flash about the change
    if (this.attached_ && child.passThrough_) {
      if (child.nodeType == Node_.TEXT_NODE) {
        // use the parent node for the ID, since we will clear it's text
        childID = this.nodeXML_.getAttribute('id');
      }
      
      // TODO: BUG: We also need to delete the text node associated with this
      this.handler_.sendToFlash({ type: 'invoke', 
                                  method: 'removeChild',
                                  elementId: childID,
                                  nodeType: child.nodeType});
    }

    // recursively set the removed node to be unattached and to not
    // pass through changes to Flash anymore
    child.setUnattached_(null);

    // set our cached next and previous siblings to null now that we are
    // unattached
    child.cachedPreviousSibling_ = null;
    child.cachedNextSibling_ = null;
    
    // track this removed node so we can clean it up on page unload
    svgweb.removedNodes_.push(child.getProxyNode_());

    return child.getProxyNode_();  
  },
  
  /** Appends the given child. The child can either be Node_, an
      actual DOM Node, or a Text DOM node created through 
      document.createTextNode. We return either a Node_ or an HTC reference
      depending on the browser. */
  appendChild: function(child /* Node_ or DOM Node */) {
    //console.log('appendChild, child='+child.nodeName+', this='+this.nodeName);  
    // the child could be a DOM node; turn it into something we can
    // work with, such as a Node_ or Element_
    child = this.getFakeNode_(child);

    // add the child's XML to our own
    this.importNode_(child);

    // manually add our child to our internal list of nodes
    this.cachedChildNodes_.push(child);
    if (this.attached_ && isIE) {
      this.childNodes_.push(child.htc_);
    }

    if (!isIE) {
      // childNodes_ is an object literal instead of an array
      // to support getter/setter magic for Safari
      this.defineChildNodeAccessor_(this.childNodes_.length);
      this.childNodes_.length++;
    }

    // process the children (add IDs, add a handler, etc.)
    this.processAppendedChildren_(child, this.attached_, this.passThrough_);

    // set our new correct cached next and previous siblings, which we keep
    // around to hand out in case we become unattached
    child.cachedPreviousSibling_ = child.getPreviousSibling_();
    child.cachedNextSibling_ = child.getNextSibling_();

    return child.getProxyNode_();
  },
  
  hasChildNodes: function() /* Boolean */ {
    if (this.attached_) {
      return (this.childNodes_.length > 0);
    } else {
      return (this.cachedChildNodes_.length > 0);
    }
  },
  
  // Note: cloneNode and normalize not supported
  
  isSupported: function(feature /* String */, version /* String */) {
    if (version == '2.0') {
      if (feature == 'Core') {
        // FIXME: There are a number of things we don't yet support in Core,
        // but we support the bulk of it
        return true;
      } else if (feature == 'Events' || feature == 'UIEvents'
                 || feature == 'MouseEvents') {
        // FIXME: We plan on supporting most of these interfaces, but not
        // all of them
        return true;
      }
    } else {
      return false;
    }
  },
  
  hasAttributes: function() /* Boolean */ {
    if (this.nodeType == Node_.ELEMENT_NODE) {
      for (var i in this.attributes_) {
        if (/^_.*/.test(i) && this.attributes_.hasOwnProperty(i)) {
          return true;
        }
      }
      
      return false;
    } else {
      return false;
    }
  },
  
  // Note: technically the following attributes should be read-only, 
  // raising DOMException_s if set, but for simplicity we make them 
  // simple JS properties instead. If set nothing will happen.
  nodeName: null,
  nodeType: null,
  ownerDocument: null, /* Document or Document_ depending on context. */
  namespaceURI: null,
  localName: null,
  prefix: null, /* Note: in the DOM 2 spec this is settable but not for us */
  
  // getter/setter attribute methods
  
  // nodeValue defined as getter/setter
  // textContent and data defined as getters/setters for TEXT_NODES
  // childNodes defined as getter/setter
  
  _getParentNode: function() {
    if (this.nodeType == Node_.DOCUMENT_NODE) {
      return null;
    }
    
    // are we the root SVG object?
    if (this.nodeName == 'svg') {
      if (this.htc_) { // IE
        // we stored the realParentNode in the SVGSVGElement_ constructor
        // when we created the SVG root
        return this.htc_.realParentNode_;
      } else { // other browsers
        return this.handler_.flash;
      }
    }
    
    var parentXML = this.nodeXML_.parentNode;
    // unattached nodes might have an XML document as their parentNode
    if (parentXML == null || parentXML.nodeType == Node_.DOCUMENT_NODE) {
      return null;
    }
    
    if (this.attached_) {
      return this.handler_.document.getNode_(parentXML);
    } else {
      return this.cachedParentNode_.getProxyNode_();
    }
  },
  
  _getFirstChild: function() {
    if (this.nodeType == Node_.TEXT_NODE) {
      return null;
    }
    
    var childXML = this.nodeXML_.firstChild;
    if (childXML == null) {
      return null;
    }
    
    if (this.cachedChildNodes_[0]) {
      return this.cachedChildNodes_[0].getProxyNode_();
    } else {
      // no node cached
      return this.handler_.document.getNode_(childXML);
    }
  },
  
  _getLastChild: function() {
    if (this.nodeType == Node_.TEXT_NODE) {
      return null;
    }
    
    var childXML = this.nodeXML_.lastChild;
    if (childXML == null) {
      return null;
    }
    
    if (this.cachedChildNodes_.length > 0 
        && this.cachedChildNodes_[this.cachedChildNodes_.length - 1]) {
      var child = this.cachedChildNodes_[this.cachedChildNodes_.length - 1];
      return child.getProxyNode_();
    } else {
      // no node cached
      return this.handler_.document.getNode_(childXML);
    }
  },
  
  getPreviousSibling_: function() {
    if (this.nodeType == Node_.DOCUMENT_NODE) {
      return null;
    }
    
    if (this.nodeType == Node_.TEXT_NODE) {
      return null;
    }
    
    // are we the root SVG object?
    if (this.nodeName == 'svg') {
      if (this.htc_) { // IE
        // we stored the realPreviousSibling in the SVGSVGElement_ constructor
        // when we created the SVG root, otherwise this.htc_.previousSibling
        // will recursively call ourselves infinitely!
        return this.htc_.realPreviousSibling_;
      } else { // other browsers
        return this.handler_.flash.previousSibling;
      }
    }
    
    var siblingXML = this.nodeXML_.previousSibling;
    // unattached nodes will sometimes have an XML Processing Instruction
    // as their previous node (type=7)
    if (siblingXML == null || siblingXML.nodeType == 7) {
      return null;
    }
    
    if (this.attached_) {
      return this.handler_.document.getNode_(siblingXML);
    } else {
      return this.cachedPreviousSibling_;
    }
  },
  
  getNextSibling_: function() {
    if (this.nodeType == Node_.DOCUMENT_NODE) {
      return null;
    }
    
    if (this.nodeType == Node_.TEXT_NODE) {
      return null;
    }
    
    // are we the root SVG object?
    if (this.nodeName == 'svg') {
      if (this.htc_) { // IE
        // we stored the realNextSibling in the SVGSVGElement_ constructor
        // when we created the SVG root, otherwise this.htc_.nextSibling
        // will recursively call ourselves infinitely!
        return this.htc_.realNextSibling_;
      } else { // other browsers
        return this.handler_.flash.nextSibling;
      }
    }
    
    var siblingXML = this.nodeXML_.nextSibling;
    if (siblingXML == null) {
      return null;
    }
    
    if (this.attached_) {
      return this.handler_.document.getNode_(siblingXML);
    } else {
      return this.cachedNextSibling_;
    }
  },
  
  // Note: 'attributes' property not supported since we don't support
  // Attribute DOM Node types
  
  // TODO: It would be nice to support the ElementTraversal spec here as well
  // since it cuts down on code size:
  // http://www.w3.org/TR/ElementTraversal/
  
  /** The passthrough flag controls whether we 'pass through' any changes
      to this object to the underlying Flash viewer. For example, if a
      Node has been created but is not yet attached to the document, any 
      changes to its attributes should not pass through to the Flash viewer,
      and this flag would therefore be false. After the Node is attached
      through appendChild(), passThrough would become true and everything
      would get passed through to Flash for rendering. */
  passThrough_: false,
  
  /** The attached flag indicates whether this node is attached to a live
      DOM yet. For example, if you call createElementNS, you can set
      values on this node before actually appending it using appendChild
      to a node that is connected to the actual visible DOM, ready to
      be rendered. */
  attached_: true,
  
  /** A flag we put on our Node_s and Element_s to indicate they are fake;
      useful if someone wants to 'break' the abstraction and see if a node
      is a real DOM node or not (which won't have this flag). */
  _fake: true,
  
  /** Do the getter/setter magic for our attributes for non-IE browsers. */
  defineNodeAccessors_: function() {
    var self = this;
    
    // readonly properties
    this.__defineGetter__('parentNode', function() { 
      return self._getParentNode(); 
    });
    this.__defineGetter__('firstChild', function() { 
      return self._getFirstChild(); 
    });
    this.__defineGetter__('lastChild', function() { 
      return self._getLastChild(); 
    });
    this.__defineGetter__('previousSibling', function() { 
      return self.getPreviousSibling_(); 
    });
    this.__defineGetter__('nextSibling', function() { 
      return self.getNextSibling_(); 
    });
    
    // childNodes array
    this.__defineGetter__('childNodes', function() {
      return self.childNodes_;
    });
    var children = this.nodeXML_.childNodes;
    this.childNodes_.length = children.length; 
    for (var i = 0; i < children.length; i++) {
      // do the defineGetter in a different method so the closure gets
      // formed correctly (closures can be tricky in loops if you are not
      // careful)
      this.defineChildNodeAccessor_(i);
    }
    
    // read/write properties
    if (this.nodeType == Node_.TEXT_NODE) {
      this.__defineGetter__('data', function() { 
        return self.nodeValue_; 
      });
      this.__defineSetter__('data', function(newValue) {
        return self._setNodeValue(newValue);
      });
      
      this.__defineGetter__('textContent', function() { 
        return self.nodeValue_; 
      });
      this.__defineSetter__('textContent', function(newValue) {
        return self._setNodeValue(newValue);
      });
    } else { // ELEMENT and DOCUMENT nodes
      // Firefox and Safari return '' for textContent for non-text nodes;
      // mimic this behavior
      this.__defineGetter__('textContent', function() {
        return '';
      });
    }
    
    this.__defineGetter__('nodeValue', function() { 
      return self.nodeValue_; 
    });
    this.__defineSetter__('nodeValue', function(newValue) {
      return self._setNodeValue(newValue);
    });
  },
  
  /** Creates a getter/setter for a childNode at the given index position.
      We define each one in a separate function so that we don't pull
      the wrong things into our closure. See defineNodeAccessors_() for
      details. */
  defineChildNodeAccessor_: function(i) {
    var self = this;
    
    this.childNodes_.__defineGetter__(i, function() {
      if (self.cachedChildNodes_[i]) {
        return self.cachedChildNodes_[i];
      } else if (self.attached_) { // we are attached to a real, live DOM
        var childXML = self.nodeXML_.childNodes[i];
        return self.handler_.document.getNode_(childXML);
      }
    });
  },
  
  /** For IE we have to do some tricks that are a bit different than
      the other browsers; we can't know when a particular
      indexed member is called, such as childNodes[1], so instead we
      return the entire childNodes_ array; what is nice is that IE applies
      the indexed lookup _after_ we've returned things, so this works. This
      requires us to instantiate all the children, however, when childNodes
      is called. This method is called by the HTC file. 
      
      @returns An array of either the HTC proxies for our nodes if IE,
      or an array of Element_ and Node_s for other browsers. */
  getChildNodes_: function() {
    if (!isIE) {
      return this.childNodes_;
    }
    
    // NOTE: for IE we return a real Array, while for other browsers
    // our childNodes_ array is an object literal in order to do
    // our __defineGetter__ magic in defineNodeAccessors_.
    var results = [];
    
    if (!this.attached_) {
      // we aren't attached to the DOM yet, and therefore have no
      // Flash handler we can depend on. We had to build up an
      // cachedChildNodes array earlier whenever appendChild
      // was called that we can depend on until we are attached to a
      // real, live DOM.
      var results = [];
      for (var i = 0; i < this.cachedChildNodes_.length; i++) {
        results.push(this.cachedChildNodes_[i].htc_);
      }
      return results;
    } else if (this.nodeXML_.childNodes.length == this.childNodes_.length) {
      // we've already processed our childNodes before
      return this.childNodes_;
    } else {
      for (var i = 0; i < this.nodeXML_.childNodes.length; i++) {
        var childXML = this.nodeXML_.childNodes[i];
        results.push(this.handler_.document.getNode_(childXML));
      }
      
      this.childNodes_ = results;
      return results;
    }
  },
  
  // if we are IE, we must use a behavior in order to get onpropertychange
  // and override core DOM methods
  createHTC_: function() {
    // we store our HTC nodes into a hidden container located in the
    // HEAD of the document; either get it now or create one on demand
    if (!this.htc_container_) {
      this.htc_container_ = document.getElementById('_htc__container');
      if (!this.htc_container_) {
        var head = document.getElementsByTagName('head')[0];
        this.htc_container_ = document.createElement('div');
        this.htc_container_.id = '_htc__container';
        head.appendChild(this.htc_container_);
      }
    }
    
    // now store our HTC UI node into this container; we will intercept
    // all calls through the HTC, and implement all the real behavior
    // inside ourselves (inside Element_)
    // Note: we do svg: even if we are dealing with a non-SVG node on IE,
    // such as sodipodi:namedview; this is necessary so that our svg.htc
    // file gets invoked for all these nodes, which is bound to the 
    // svg: namespace
    var nodeName = this.nodeName;
    if (nodeName == '#text') {
      nodeName = '__text'; // text nodes
    }
    var htc = document.createElement('svg:' + this.nodeName);
    htc.fakeNode_ = this;
    htc.handler_ = this.handler_;
    this.htc_container_.appendChild(htc);
    this.htc_ = htc;
  },
  
  _setNodeValue: function(newValue) {
    if (this.nodeType != Node_.TEXT_NODE) {
      // FIXME: Is this correct? Can other kinds of nodes other than
      // text nodes have a nodeValue?
      return newValue;
    }
    
    this.nodeValue_ = newValue;
    
    if (this.passThrough_) {
      // get the ID of our parent
      var parentID = this.nodeXML_.parentNode.getAttribute('id');
      if (!parentID 
          || this.nodeXML_.parentNode.nodeType != Node_.ELEMENT_NODE) {
        return newValue;
      }
      
      this.handler_.sendToFlash({ type: 'invoke', 
                                  method: 'setText',
                                  parentId: parentID,
                                  text: newValue});
    }

    return newValue;
  },
  
  /** For functions like appendChild, insertBefore, removeChild, etc.
      outside callers can pass in DOM nodes, etc. This function turns
      this into something we can work with, such as a Node_ or Element_. */
  getFakeNode_: function(child) {
    // Was HTC node was passed in for IE? If so, get its Node_
    if (isIE && child.fakeNode_) {
      child = child.fakeNode_;
    }
    
    return child;
  },
  
  /** We do a bunch of work in this method in order to append a child to
      ourselves, including: Walking over the child and all of it's children, 
      generating an ID if one is not present; caching the element for future 
      lookup;  setting it's handler; setting that it is both attached and
      can pass through it's values; informing Flash about the newly
      created element; and updating our list of namespaces if there is a node
      with a new namespace in the appended children. This method gets called 
      recursively for the child and all of it's children.
      
      @param child Node_ to work with.
      @param attached Boolean on whether we are attached or not yet.
      @param passThrough Boolean on whether to pass values through
      to Flash or not. */
  processAppendedChildren_: function(child, attached, passThrough) {
    //console.log('processAppendedChildren, this.nodeName='+this.nodeName+', child.nodeName='+child.nodeName+', attached='+attached+', passThrough='+passThrough);
    var childXML = child.nodeXML_;
    
    // generate a random ID if none is present
    var id;
    if (childXML.nodeType == Node_.ELEMENT_NODE) {
      id = childXML.getAttribute('id');
      if (!id) {
        id = svgweb.generateID_('__svg__random__', null);
        child.setId_(id);
      }
    }
    
    child.handler_ = this.handler_;
    
    if (attached && childXML.nodeType == Node_.ELEMENT_NODE) {
      // store a reference to our node so we can return it in the future
      this.handler_.document.nodeById_['_' + id] = child;

      // tell Flash about our new element
      
      // FIXME: I'm sure we can do this much more efficiently then calling
      // Flash over and over; instead, send over a giant String XML
      // representation of the children and parse it on the other side in one
      // shot
      
      // create the element
      this.handler_.sendToFlash({ type: 'invoke', 
                                  method: 'createElementNS',
                                  elementType: child.nodeName, 
                                  elementId: id,
                                  prefix: child.prefix,
                                  namespaceURI: child.namespaceURI });
                                  
      // send over each of our attributes
      for (var i in child.attributes_) {
        if (!child.attributes_.hasOwnProperty(i)) {
          continue;
        }
        
        var attrName = i.replace(/^_/, '');
        // ignore ID and XML namespace declarations
        if (attrName == 'id' || /^xmlns:?/.test(attrName)) {
          continue;
        }
        
        var attrValue = child.attributes_[i];
      
        this.handler_.sendToFlash({ type: 'invoke', 
                                    method: 'setAttribute',
                                    elementId: id, 
                                    attrName: attrName, 
                                    attrValue: attrValue });
      }
           
      // now append the element      
      this.handler_.sendToFlash({ type: 'invoke', 
                                  method: 'appendChild',
                                  elementId: this.getId_(),
                                  childId: id });
    } else if (attached && childXML.nodeType == Node_.TEXT_NODE) {
      // store a reference to our node so we can return it in the future
      this.handler_.document.nodeById_['_' + textNodeID] = child;
      
      var parentID = childXML.parentNode.getAttribute('id');
      
      // tell Flash about our new text node
      this.handler_.sendToFlash({ type: 'invoke', 
                                  method: 'setText',
                                  parentId: parentID,
                                  text: childXML.nodeValue });
    }
    
    // recursively process each child
    for (var i = 0; i < child.cachedChildNodes_.length; i++) {
      var fakeNode = child.cachedChildNodes_[i];
      child.processAppendedChildren_(fakeNode, attached, passThrough);
    }
    
    child.attached_ = attached;
    child.passThrough_ = passThrough;
    child.cachedParentNode_ = this;
    
    // keep a pointer to any text nodes we made while unattached
    // so we can return the same instance later
    if (attached && !isIE) { // no XML expandos on IE, so can't do this there
      for (var i = 0; i < child.cachedChildNodes_.length; i++) {
        var currentNode = child.cachedChildNodes_[i];
        var textNodeID = currentNode.nodeXML_.textNodeID_;
        this.handler_.document.nodeById_['_' + textNodeID] = currentNode;
      }
    }
  },
  
  /** Imports the given child and all it's children's XML into our XML. 
  
      @param child Node_ to import.
      @param doAppend Optional. Boolean on whether to actually append
      the child once it is imported. Useful for functions such as
      replaceChild that want to do this manually. Defaults to true if not
      specified.
      
      @returns The imported node. */
  importNode_: function(child, doAppend) {
    if (typeof doAppend == 'undefined') {
      doAppend = true;
    }
    
    var doc = this.nodeXML_.ownerDocument;
    
    // IE does not support document.importNode, even on XML documents, 
    // so we have to define it ourselves.
    // Adapted from ALA article:
    // http://www.alistapart.com/articles/crossbrowserscripting
    var importedNode;
    if (typeof doc.importNode == 'undefined') {
      // import the node for IE
      importedNode = document.importNodeFunc_(doc, child.nodeXML_, true);
    } else { // non-IE browsers
      importedNode = doc.importNode(child.nodeXML_, true);
    }

    // complete the import into ourselves
    if (doAppend) {
      this.nodeXML_.appendChild(importedNode);
    }

    // replace all of the children's XML with our copy of it now that it 
    // is imported
    child._importChildXML(importedNode);

    return importedNode;
  },
  
  /** Recursively replaces the XML inside of our children with the given
      new XML. Called after we are importing a node into ourselves
      with appendChild. */
  _importChildXML: function(newXML) {
    this.nodeXML_ = newXML;
    var children = this.getChildNodes_();
    for (var i = 0; i < this.nodeXML_.childNodes.length; i++) {
      var currentChild = children[i];
      if (isIE && currentChild.fakeNode_) { // IE
        currentChild = currentChild.fakeNode_;
      } 
      
      currentChild.nodeXML_ = this.nodeXML_.childNodes[i];
      currentChild._importChildXML(this.nodeXML_.childNodes[i]);
    }
    
    // copy over our internal textNodeID_ to the new XML node for text nodes
    if (!isIE && this.nodeType == Node_.TEXT_NODE) {
      this.nodeXML_.textNodeID_ = this.textNodeID_;
    }
  },
  
  /** Tries to find the given child in our list of child nodes.
      
      @param child A Node_ or Element_ to search for in our list of
      childNodes. 
      
      @returns An object literal with two values:
         position The index position of where the child is located.
         node The node itself
         
      If the child is not found then null is returned instead. */
  findChild_: function(child) {
    var results = {};
    
    // get an ID for the child if one is available
    var id;
    if (child.nodeType == Node_.ELEMENT_NODE) {
      id = child.nodeXML_.getAttribute('id');
    } else if (child.nodeType == Node_.TEXT_NODE && !isIE) {
      id = child.textNodeID_;
    }

    // FIXME: If there are multiple text nodes with the same content, and
    // someone wants to actually find the middle one versus the first one,
    // this will fail on IE because we find the matching node based on 
    // text content versus a text node ID. This is because on IE XML
    // nodes can't have expando properties, so we can't store our generated
    // text node ID on the XML node itself to find it again later.
    for (var i = 0; i < this.nodeXML_.childNodes.length; i++) {
      var node = this.nodeXML_.childNodes[i];
      var nodeID;
      if (node.nodeType == Node_.ELEMENT_NODE) {
        nodeID = node.getAttribute('id');
      } else if (node.nodeType == Node_.TEXT_NODE && !isIE
                 && node.textNodeID_) {
        nodeID = node.textNodeID_;
      }

      if (id && nodeID && id === nodeID) {
        results.position = i;
        results.node = node;
        return results;
      } else if (isIE && child.nodeType == Node_.TEXT_NODE
                 && node.nodeType == Node_.TEXT_NODE) {
        if (child.nodeValue_ == node.nodeValue) {
          results.position = i;
          results.node = node;
          return results;
        }
      }
    }
    
    return null;
  },
  
  /** Takes a Node_ or Element_ and returns an ID if available. Used by
      the various DOM manipulation methods, such as insertBefore, 
      removeChild, etc. Returns null if no ID is available. 
      
      @param child Node_ or Element_ reference. */
  determineID_: function(child) {
    var id = null;
    if (child.nodeType == Node_.ELEMENT_NODE) {
      id = child.nodeXML_.getAttribute('id');
    } else if (child.nodeType == Node_.TEXT_NODE) {
      id = child.textNodeID_;
    }
    
    if (id === undefined) {
      id = null;
    }
    
    return id;
  },
  
  /** After a node is unattached, such as through a removeChild, this method
      recursively sets attached_ and passThrough_ to false on this node
      and all of its children. 
      
      @param parentNode Node_ or Element_. The parent of this child, used so
      that we can cache the parent and return it if someone calls
      parentNode on this child while unattached. */
  setUnattached_: function(parentNode) {  
    // we cache the parent node and sibling information so it is available 
    // when unattached
    this.cachedParentNode_ = parentNode;
    this.cachedPreviousSibling_ = this.getPreviousSibling_();
    this.cachedNextSibling_ = this.getNextSibling_();
    
    // set each child to be unattached, and also capture a reference to it
    // for later so that we can work with it while unattached. This will also
    // force all children to be created if they were never fetched before
    // so we can have a real reference to them.
    var children = this.getChildNodes_();
    this.cachedChildNodes_ = [];
    for (var i = 0; i < children.length; i++) {
      var child = children[i];
      if (isIE) {
        child = child.fakeNode_;
      }
      child.setUnattached_(this);
      this.cachedChildNodes_.push(child);
    }
    this.attached_ = false;
    this.passThrough_ = false;
    this.handler_ = null;
  },
  
  /** When we return results to external callers, such as appendChild,
      we can return one of our fake Node_ or Element_s. However, for IE,
      we have to return the HTC 'proxy' through which callers manipulate
      things. The HTC is what allows us to override core DOM methods and
      know when property and style changes have happened, for example. */
  getProxyNode_: function() {
    if (!isIE) {
      return this;
    } else {
      // for IE, the developer will manipulate things through the UI/HTC
      // proxy facade so that we can know about property changes, etc.
      return this.htc_;
    }
  }
});


/** Our DOM Element for each SVG node.

    @param nodeName The node name, such as 'rect' or 'sodipodi:namedview'.
    @param prefix The namespace prefix, such as 'svg' or 'sodipodi'.
    @param namespaceURI The namespace URI. If undefined, defaults to null.
    @param nodeXML The parsed XML DOM node for this element.
    @param handler The FlashHandler rendering this node. 
    @param passThrough Optional boolean on whether any changes to this
    element 'pass through' and cause changes in the Flash renderer. */                 
function Element_(nodeName, prefix, namespaceURI, nodeXML, handler, 
                  passThrough) {
  if (nodeName == undefined && namespaceURI == undefined 
      && nodeXML == undefined && handler == undefined) {
    // prototype subclassing
    return;
  }
  
  // superclass constructor
  Node_.apply(this, [nodeName, Node_.ELEMENT_NODE, prefix, namespaceURI, nodeXML,
                     handler, passThrough]);
                     
  // setup our attributes
  this.attributes_ = {};
  this.attributes_['_id'] = ''; // default id is empty string on FF and Safari
  this.importAttributes_(this, this.nodeXML_);
  
  // track .style changes
  if (this.namespaceURI == svgns) {
    this.style = new Style_();
  }
  
  // define our accessors if we are not IE; IE does this by using the HTC
  // file rather than doing it here
  if (!isIE) {
    this.defineAccessors_();
  }
}

// subclasses Node_
Element_.prototype = new Node_;

extend(Element_, {
  getAttribute: function(attrName) /* String */ {
    var value;
    
    if (this.passThrough_) {
      var elementId = this.nodeXML_.getAttribute('id');
      var msg = this.handler_.sendToFlash(
                       { type: 'invoke', method: 'getAttribute',
                         elementId: elementId, attrName: attrName});
      if (msg) {
        value = msg.attrValue;
      }
    } else {
      value = this.nodeXML_.getAttribute(attrName);
      
      // id property is special; we return empty string instead of null
      // to mimic native behavior on Firefox and Safari
      if (attrName == 'id' && !value) {
        return '';
      }
    }
    
    if (value == undefined || value == null || /^[ ]*$/.test(value)) {
      return null;
    }
    
    return value;
  },
  
  setAttribute: function(attrName, attrValue /* String */) /* void */ {
    //console.log('setAttribute, attrName='+attrName+', attrValue='+attrValue);
    var elementId = this.nodeXML_.getAttribute('id');
    
    // if id then change node lookup table (only if we are attached to
    // the DOM however)
    if (this.attached_ && attrName == 'id') {
      var doc = this.handler_.document;
      
      // old lookup
      doc.nodeById_['_' + elementId] = undefined;
      // new lookup
      doc.nodeById_['_' + attrValue] = this;
    }
    
    // update our XML
    this.nodeXML_.setAttribute(attrName, attrValue);
    
    // update our internal set of attributes
    this.attributes_['_' + attrName] = attrValue;
    
    // send to Flash
    if (this.passThrough_) {
      this.handler_.sendToFlash(
                       { type: 'invoke', method: 'setAttribute',
                         elementId: elementId, attrName: attrName, 
                         attrValue: attrValue });
    }
  },
  
  removeAttribute: function(name) /* void */ {
    /* throws DOMException_ */
  },

  getAttributeNS: function(ns, localName) /* String */ {
  },

  setAttributeNS: function(ns, qName, value /* String */)
    /* void */ {
      /* throws DOMException_ */
  },
  
  removeAttributeNS: function(ns, localName) /* void */ {
      /* throws DOMException_ */
  },
  
  getElementsByTagNameNS: function(ns, localName) /* Node_List */ {},

  hasAttributeNS: function(ns, localName) /* Boolean */ {}, 

  /*
    Note: DOM Level 2 getAttributeNode, setAttributeNode, removeAttributeNode,
    getElementsByTagName, getAttributeNodeNS, setAttributeNodeNS not supported
  */
  
  /*
    DOM Level 2 EventTarget interface methods.
  
    Note: dispatchEvent not supported. Technically as well this interface
    should not appear on SVG elements that don't have any event dispatching,
    such as the SVG DESC element, but in our implementation they still appear.
    We also don't support the useCapture feature for addEventListener and
    removeEventListener.
  */
  
  addEventListener: function(type, listener /* Function */, useCapture) {
    // Note: capturing not supported
  },
  
  removeEventListener: function(type, listener /* Function */, useCapture) {
    // Note: capturing not supported
  },  
  
  // SVGStylable interface
  style: null, /** Note: technically should be read only; Style_ instance */
  
  setClassName_: function(className) {
  },
  
  // Note: we return a normal String instead of an SVGAnimatedString
  // as dictated by the SVG 1.1 standard
  getClassName_: function() {},
  
  // Note: getPresentationAttribute not supported
  
  // SVGTransformable; takes an SVGTransform_
  setTransform_: function(transform) {
  },
  
  // Note: we return a JS Array of SVGTransform_s instead of an 
  // SVGAnimatedTransformList as dictated by the SVG 1.1 standard
  getTransform_: function() /* readonly; returns Array */ {},
  
  // SVGFitToViewBox
  // Note: only supported for root SVG element for now
  getViewBox_: function() { /* readonly; SVGRect */
    // Note: We return an _SVGRect instead of an SVGAnimatedRect as dictated
    // by the SVG 1.1 standard
  },
  
  // SVGElement
  getId_: function() {
    // note: all attribute names are prefixed with _ to prevent attribute names
    // starting numbers from being interpreted as array indexes
    return this.attributes_['_id'];
  },
  
  setId_: function(id) {
    return this.setAttribute('id', id);
  },
  
  ownerSVGElement: null, /* Note: technically readonly */
  
  // not supported: xmlbase, viewportElement
  
  // SVGSVGElement and SVGUseElement readonly
  
  getX_: function() { /* SVGAnimatedLength */
    var value = this.getAttribute('x');  
    return new SVGAnimatedLength_(new SVGLength_(new Number(value)));
  },
  
  getY_: function() { /* SVGAnimatedLength */
    var value = this.getAttribute('y');
    return new SVGAnimatedLength_(new SVGLength_(new Number(value)));
  },
  
  getWidth_: function() { /* SVGAnimatedLength */
    var value = this.getAttribute('width');
    return new SVGAnimatedLength_(new SVGLength_(new Number(value)));
  },
  
  getHeight_: function() { /* SVGAnimatedLength */
    var value = this.getAttribute('height');
    return new SVGAnimatedLength_(new SVGLength_(new Number(value)));
  },
  
  // many attributes and methods from these two interfaces not here
  
  // defacto non-standard attributes
  
  getInnerHTML_: function() {
    // TODO
    return 'foo';
  },
  
  setInnerHTML_: function(newValue) {
    // TODO
    return newValue;
  },
  
  // SVG 1.1 inline event attributes:
  // http://www.w3.org/TR/SVG/script.html#EventAttributes
  // Note: Technically not all elements have all these events; also
  // technically the SVG spec requires us to support the DOM Mutation
  // Events, which we do not.
  // We use this array to build up our getters and setters .
  // TODO: Gauge the performance impact of making this dynamic
  allEvents_: [
    'onfocusin', 'onfocusout', 'onactivate', 'onclick', 'onmousedown',
    'onmouseup', 'onmouseover', 'onmousemove', 'onmouseout', 'onload',
    'onunload', 'onabort', 'onerror', 'onresize', 'onscroll', 'onzoom',
    'onbegin', 'onend', 'onrepeat'
  ],
  
  handleEvent_: function(evt) {
    // called from the IE HTC when an event is fired, as well as from
    // one of our getter/setters for non-IE browsers
  },
  
  prepareEvents_: function() {
    // for non-IE browsers, make the getter/setter magic using the
    // allEvents_ array
  },
  
  // SVGTests, SVGLangSpace, SVGExternalResourcesRequired
  // not supported
  
  // contains any attribute set with setAttribute; object literal of
  // name/value pairs
  attributes_: null,
  
  // copies the attributes from the XML DOM node into target
  importAttributes_: function(target, nodeXML) {
    for (var i = 0; i < nodeXML.attributes.length; i++) {
      var attr = nodeXML.attributes[i];
      this.attributes_['_' + attr.nodeName] = attr.nodeValue;
    }
  },
  
  /** Does all the getter/setter magic for attributes, so that external
      callers can do something like myElement.innerHTML = 'foobar' or
      myElement.id = 'test' and our getters and setters will intercept
      these to do the correct behavior with the Flash viewer.*/
  defineAccessors_: function() {
    var props;
    
    // innerHTML
    var self = this;
    this.__defineGetter__('innerHTML', function() {
      return self.getInnerHTML_();
    });
    this.__defineSetter__('innerHTML', function(newValue) {
      return self.setInnerHTML_(newValue);
    });
    
    // SVGSVGElement and SVGUseElement readyonly props
    if (this.nodeName == 'svg' || this.nodeName == 'use') {
      this.__defineGetter__('x', function() { return self.getX_(); });
      this.__defineGetter__('y', function() { return self.getY_(); });
      this.__defineGetter__('width', function() { return self.getWidth_(); });
      this.__defineGetter__('height', function() { return self.getHeight_(); });
    }
    
    // read/write props
    var props = ['id'];
    
    // make getters for each property
    for (var i = 0; i < props.length; i++) {
      this.defineAccessor_(props[i], true);  
    }
  },
  
  /** @param prop String property name, such as 'x'.
      @param readWrite Boolean on whether the property is both read and write;
      if false then read only. */
  defineAccessor_: function(prop, readWrite) {
    var self = this;
    
    var getMethod = function() {
      return self.getAttribute(prop);
    };
  
    this.__defineGetter__(prop, getMethod);
    
    if (readWrite) {
      var setMethod = function(newValue) {
        return self.setAttribute(prop, newValue);
      };
      
      this.__defineSetter__(prop, setMethod);
    }
  }
});


// not an official DOM interface; used so that we can track changes to
// the CSS style property of an Element
function Style_() {
  this.setup_();
}

// we use this array to build up getters and setters to watch any changes for
// any of these styles. Note: Technically we shouldn't have all of these for
// every element, since some SVG elements won't have specific kinds of
// style properties, like the DESC element having a font-size.
// TODO: Gauge the performance impact of making this dynamic
Style_.allStyles_ = [
  'font', 'fontFamily', 'fontSize', 'fontSizeAdjust', 'fontStretch', 'fontStyle',
  'fontVariant', 'fontWeight', 'direction', 'letterSpacing', 'textDecoration',
  'unicodeBidi', 'wordSpacing', 'clip', 'color', 'cursor', 'display', 'overflow',
  'visibility', 'clipPath', 'clipRule', 'mask', 'opacity', 'enableBackground',
  'filter', 'floodColor', 'floodOpacity', 'lightingColor', 'stopColor',
  'stopOpacity', 'pointerEvents', 'colorInterpolation',
  'colorInterpolationFilters', 'colorProfile', 'colorRendering', 'fill',
  'fillOpacity', 'fillRule', 'imageRendering', 'marker', 'markerEnd',
  'markerMid', 'markerStart', 'shapeRendering', 'stroke', 'strokeDasharray',
  'strokeDashoffset', 'strokeLinecap', 'strokeLinejoin', 'strokeMiterlimit',
  'strokeOpacity', 'strokeWidth', 'textRendering', 'alignmentBaseline', 
  'baselineShift', 'dominantBaseline', 'glyphOrientationHorizontal',
  'glyphOrientationVertical', 'kerning', 'textAnchor',
  'writingMode'
];

extend(Style_, {
  // called when a style change has occurred; called from the Internet
  // Explorer HTC as well as any getter/setter functions for other
  // browsers
  styleChange: function(prop, oldVal, newVal) {
  },
  
  setup_: function() {
    // does the magic for non-IE browsers to create getters and setters
    // for style properties
  }
});


/** SVG Root element.

    @param nodeXML A parsed XML node object that is the SVG root node.
    @param svgString The full SVG as a string.
    @param scriptNode The script node that contains this SVG. 
    @param handler The FlashHandler that we are a part of. */
function SVGSVGElement_(nodeXML, svgString, scriptNode, handler) {
  // superclass constructor
  Element_.apply(this, ['svg', null, svgns, nodeXML, handler, true]);
  
  this.nodeXML_ = nodeXML;
  this.svgString_ = svgString;
  this.scriptNode_ = scriptNode;
  
  if (isIE) {
    // for IE, replace the SCRIPT tag with our SVG root element; this is so
    // that we can kick off the HTC running so that it can insert our Flash
    // as a shadow DOM
    var svgDOM = document.createElement('svg:svg');
    svgDOM.setFakeNode_(this);
    svgDOM.setHandler_(this.handler_);
    
    // store the real parentNode and sibling info so we can return it; calling
    // svgDOM.parentNode, for example, would cause us to recursively call our
    // magic parentNode getter instead, so we store this
    svgDOM.realParentNode_ = scriptNode.parentNode;
    svgDOM.realPreviousSibling_ = scriptNode.previousSibling;
    svgDOM.realNextSibling_ = scriptNode.nextSibling;
    
    scriptNode.parentNode.replaceChild(svgDOM, scriptNode);
    this.htc_ = svgDOM;
    
    // now wait for the HTC file to load for the SVG root element
  } else { // non-IE browsers; immediately insert the Flash
    this.setupFlash_(document);
  }
  
  // store in our lookup table for getElementById and 
  // getElementsByTagNameNS
  var elementId = this.nodeXML_.getAttribute('id');
  this.handler_.document.nodeById_['_' + elementId] = this;
}  

// subclasses Element_
SVGSVGElement_.prototype = new Element_;

extend(SVGSVGElement_, {
  // SVGLocatable
  
  nearestViewportElement: null, /* readonly SVGElement */
  farthestViewportElement: null, /* readonly SVGElement */
  
  getBBox: function() /* SVGRect */ {},
  getCTM: function() /* SVGMatrix */ {},
  getScreenCTM: function() /* SVGMatrix */ {},
  getTransformToElement: function(element /* SVGElement */) /* SVGMatrix */ {
    /* throws SVGException */
  },
  
  // end of SVGLocatable
  
  /** Called when the Microsoft Behavior HTC file is loaded; called for
      each HTC node element (which will correspond with each SVG element
      in the document). The message object is a literal with two values:
      
      htcNode A reference to the HTC node itself.
      elemDoc The element.document of the HTC file. */
  onHTCLoaded_: function(msg) {
    console.log('onHTCLoaded, msg=' + this.handler_.debugMsg(msg));
    var elemDoc = msg.elemDoc;
    var element = msg.element;
    
    // TODO: We are not handling dynamically created nodes yet
    if (element.nodeName.toUpperCase() == 'SVG') {
      this.htcNode_ = element;
      
      // now insert our Flash
      this.setupFlash_(elemDoc, element);
    }
  },
  
  /** Called when the Flash SWF file has been loaded. Note that this doesn't
      include the SVG being rendered -- at this point we haven't even
      sent the SVG to the Flash file for rendering yet. */
  onFlashLoaded_: function(msg) {
    // the Flash object is done loading
    //console.log('onFlashLoaded_');
    
    // store a reference to the Flash object so we can send it messages
    if (isIE) {
      this.handler_.flash = this.htcNode_.getFlashObj_();
      this.htcNode_._makeFlashCallable(this.handler_.flash);
    } else {
      this.handler_.flash = document.getElementById(this.handler_.flashID);
    }
    
    // send the SVG over to Flash now
    this.handler_.sendToFlash({type: 'load', sourceType: 'string',
                               svgString: this.svgString_});
  },
  
  /** The Flash is finished rendering. */
  onRenderingFinished_: function(msg) {
    console.log('onRenderingFinished');
    
    var elementId = this.nodeXML_.getAttribute('id');
    this.handler_.fireOnLoad(elementId, 'script');
  },
  
  setupFlash_: function(doc, element) {
    console.log('setupFlash');
    // get the size and background color information
    var size = this.determineSize_();  
    var background = this.determineBackground_();
    var style = this.determineStyle_();
    
    // get a Flash object and insert it into our document
    var flash = this.createFlash_(size, background, style, doc);
    if (isIE) {
      // have the HTC node insert the actual Flash so that it gets
      // hidden in the HTC's shadow DOM
      this.insertFlashIE_(flash, style, element);
      
      // set references to null to prevent IE memory leaks
      element = null;
      doc = null;
    } else {
      this.insertFlash_(flash);
    }
    
    // wait for the Flash file to finish loading
  },
  
  /** Inserts the Flash object into the page for all non-IE browsers.
  
      @param flash Flash HTML string.
      
      @returns The Flash DOM object. */
  insertFlash_: function(flash) {
    // do a trick to turn the Flash HTML string into an actual DOM object
    // unfortunately this doesn't work on IE; on IE the Flash is immediately
    // loaded when we do div.innerHTML even though we aren't attached
    // to the document!
    var div = document.createElement('div');
    div.innerHTML = flash;
    var flashObj = div.childNodes[0];
    div.removeChild(flashObj);
    
    // at this point we have the OBJECT tag; ExternalInterface communication
    // won't work on Firefox unless we get the EMBED tag itself
    for (var i = 0; i < flashObj.childNodes.length; i++) {
      var check = flashObj.childNodes[i];
      if (check.nodeName.toUpperCase() == 'EMBED') {
        flashObj = check;
        break;
      }
    }
    // now insert the EMBED tag into the document
    this.scriptNode_.parentNode.replaceChild(flashObj, this.scriptNode_);
    
    // for non-IE browsers, expose the root SVG element as 'documentElement'
    // on the EMBED tag, and set the EMBED tag's class name to be
    // 'embedssvg' to help script writers;
    // Safari will have a superflous space before 'embedssvg' if there are no
    // class names already there, so avoid that.
    if (flashObj.className == null 
        || /^\s*$/.test(String(flashObj.className))) {
      flashObj.className = 'embedssvg';
    } else {
      flashObj.className += flashObj.className + ' embedssvg';
    }
    flashObj.documentElement = this;
  
    return flashObj;
  },
  
  /** Inserts our Flash for Internet Explorer.
  
      We do some magic to have the Flash object show up in our SVG 
      root element 'hidden' from the external DOM.

      @param flash Flash object as HTML string.
      @param style A style string that we can apply to the HTC's element itself
      to have the correct style on the SVG root tag, since that is what is 
      visible to the outside DOM. Applying it to the Flash object is not 
      enough.
      @param element A reference to the HTC node that we got from the
      onHTCMessage method that was called by the HTC file itself when done
      loading. */
  insertFlashIE_: function(flash, style, element) {
    console.log('insertFlashIE');
    // apply our style to ourselves first; we do this here rather than
    // in the VBScript since it is a pain to do such regular expressions in VB
    var rules = style.split(';');
    console.log('element.style='+element.style);
    for (var i = 0; i < rules.length; i++) {
      var rule = rules[i].split(':');
      if (!rules[i] || rules[i].indexOf(':') == -1) {
        continue;
      }
      var propName = rule[0].replace(/^\s*|\s*$/, '');
      var propValue = rule[1].replace(/^\s*|\s*$/, '');
      element.style[propName] = propValue;
    }
    
    element.insertFlash_(flash);
    element = null;
  },
  
  /** Determines a width and height for the parsed SVG XML. Returns an
      object literal with two values, width and height. */
  determineSize_: function() {
    var width = '100%', height = '100%';
    
    // explicit width and height set
    if (this.nodeXML_.getAttribute('width')) {
      width = this.nodeXML_.getAttribute('width');
    }
    
    if (this.nodeXML_.getAttribute('height')) {
      height = this.nodeXML_.getAttribute('height');
    }
    
    // both explicit width and height set; we are done
    if (this.nodeXML_.getAttribute('width') && this.nodeXML_.getAttribute('height')) {
      return {width: width, height: height};
    }
    
    // viewBox
    if (this.nodeXML_.getAttribute('viewBox')) {
      var viewBox = this.nodeXML_.getAttribute('viewBox').split(/\s+|,/);
      var boxX = viewBox[0];
      var boxY = viewBox[1];
      var boxWidth = viewBox[2];
      var boxHeight = viewBox[3];
      width = boxWidth - boxX;
      height = boxHeight - boxY;
    }
    
    return {width: width, height: height};      
  },
  
  /** Determines the background coloring. Returns an object literal with
      two values, 'color' with a color or null and 'transparent' with a 
      boolean. */
  determineBackground_: function() {
    var transparent = false;
    var color = null;
    
    // NOTE: CSS 2.1 spec says background does not get inherited, and we don't
    // support external CSS style rules for now; we also only support
    // 'background-color' property and not 'background' CSS property for
    // setting the background color.
    var style = this.nodeXML_.getAttribute('style');
    if (style && style.indexOf('background-color') != -1) {
      var m = style.match(/background\-color:\s*([^;]*)/);
      if (m) {
        color = m[1];
      }
    }

    if (color === null) {
      // no background color specified
      transparent = true;
    }
    
    return {color: color, transparent: transparent};
  },
  
  /** Determines what the style should be on the SVG root element, copying
      over any styles the user has placed inline and defaulting certain
      styles. We will bring these over to the Flash object.
      
      @returns Style string ready to copy over to Flash object. */
  determineStyle_: function() {
    var style = this.nodeXML_.getAttribute('style');
    if (!style) {
      style = '';
    }
    
    // SVG spec says default display value for SVG root element is 
    // inline
    if (style.indexOf('display:') == -1) {
      style += 'display: inline;';
    }
    
    // SVG spec says SVG by default should have overflow: none
    if (style.indexOf('overflow:') == -1) {
      style += 'overflow: hidden;';
    }
    
    return style;
  },
  
  /** Creates a Flash object that embeds the Flash SVG Viewer.

      @param size Object literal with width and height.
      @param background Object literal with background color and 
      transparent boolean.
      @param style Style string to copy onto Flash object.
      @param doc Either 'document' or element.document if being called
      from the Microsoft Behavior HTC. 
      
      @returns Flash object as HTML string. */ 
  createFlash_: function(size, background, style, doc) {
    var elementId = this.nodeXML_.getAttribute('id');
    var flashVars = 
          'uniqueId=' + encodeURIComponent(elementId)
        + '&sourceType=string'
        + '&scaleMode=showAll_svg' // FIXME: is this the right scaleMode?
        + '&debug=true'
        + '&svgId=' + encodeURIComponent(elementId);
    var src = svgweb.libraryPath + 'svg.swf';
    var protocol = window.location.protocol;
    if (protocol.charAt(protocol.length - 1) == ':') {
      protocol = protocol.substring(0, protocol.length - 1);
    }
    
    this.handler_.flashID = elementId + '_flash';

    var flash =
          '<object\n '
            + 'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"\n '
            + 'codebase="'
            + protocol
            + '://fpdownload.macromedia.com/pub/shockwave/cabs/flash/'
            + 'swflash.cab#version=9,0,0,0"\n '
            + 'width="' + size.width + '"\n '
            + 'height="' + size.height + '"\n '
            + 'id="' + this.handler_.flashID + '"\n '
            + 'name="' + this.handler_.flashID + '"\n '
            + 'style="' + style + '"\n '
            + '>\n '
            + '<param name="allowScriptAccess" value="always"></param>\n '
            + '<param name="movie" value="' + src + '"></param>\n '
            + '<param name="quality" value="high"></param>\n '
            + '<param name="FlashVars" value="' + flashVars + '"></param>\n '
            + (background.color ? '<param name="bgcolor" value="' + background.color + '"></param>\n ' : '')
            + (background.transparent ? '<param name="wmode" value="transparent"></param>\n ' : '')
            + '<embed '
              + 'src="' + src + '" '
              + 'quality="high" '
              + (background.color ? 'bgcolor="' + background.color + '" \n' : '')
              + (background.transparent ? 'wmode="transparent" \n' : '')
              + 'width="' + size.width + '" '
              + 'height="' + size.height + '" '
              + 'id="' + this.handler_.flashID + '" '
              + 'name="' + this.handler_.flashID + '" '
              + 'swLiveConnect="true" '
              + 'allowScriptAccess="always" '
              + 'type="application/x-shockwave-flash" '
              + 'FlashVars="' + flashVars + '" '
              + 'pluginspage="'
              + protocol
              +'://www.macromedia.com/go/getflashplayer" '
              + 'style="' + style + '">\n '
              + '></embed>'
          + '</object>';
    
    return flash;
  }
});


/** Represent a Document object for manipulating the SVG document.

    @param xml Parsed XML for the SVG.
    @param handler The FlashHandler this document is a part of. */
function Document_(xml, handler) {
  // superclass constructor
  Node_.apply(this, ['#document', Node_.DOCUMENT_NODE, null, null, xml, 
                     handler], svgns);
  
  this.xml_ = xml;
  this.handler_ = handler;
  this.nodeById_ = {};
  this.namespaces_ = this.getNamespaces_();
  this.implementation = new DOMImplementation_();
}

// subclasses Node_
Document_.prototype = new Node_;

extend(Document_, {
  /** Stores a lookup from a node's ID to it's Element_ or Node_ 
      representation. An object literal. */
  nodeById_: null,
  
  /*
    Note: technically these 2 properties should be read-only and throw 
    a DOMException_ when set. For simplicity we make them simple JS
    properties; if set, nothing will happen. Also note that we don't
    support the 'doctype' property.
  */
  implementation: null,
  documentElement: null,
  
  createElementNS: function(ns, qName) /* Element_ */ {
    // TODO; this is for object tags
  },
  
  createTextNode: function(text /* DOM Text Node */) /* Node_ */ {
    // TODO; this is for object tags
  },
  
  getElementById: function(id) /* Element_ */ {
    // XML parser does not have getElementById, due to id mapping in XML
    // issues; use XPath instead
    var results = xpath(this.xml_, null, '//*[@id="' + id + '"]');
    var nodeXML, node;
    
    if (results.length) {
      nodeXML = results[0];
    } else {
      return null;
    }
    
    // create or get an Element_ for this XML DOM node for node
    return this.getNode_(nodeXML);
  },
  
  /** NOTE: on IE we don't support calls like the following:
      getElementsByTagNameNS(*, 'someTag');
      
      We do support:
      getElementsByTagNameNS('*', '*');
      getElementsByTagNameNS('someNameSpace', '*');
      getElementsByTagNameNS(null, 'someTag');
  */
  getElementsByTagNameNS: function(ns, localName) /* Node_List of Element_s */ {
    var results = [];
    var matches;
    // DOM Level 2 spec details:
    // if ns is null or '', return elements that have no namespace
    // if ns is '*', match all namespaces
    // if localName is '*', match all tags in the given namespace
    if (ns == '') {
      ns = null;
    }
    
    // get DOM nodes with the given tag name
    if (this.xml_.getElementsByTagNameNS) { // non-IE browsers
      results = this.xml_.getElementsByTagNameNS(ns, localName);
    } else { // IE
      if (ns == null) {
        // we can't just use getElementsByTagName() here, because IE
        // will incorrectly return tags that are in the default namespace
        results = xpath(this.xml_, null, '//' + localName);
      } else {
        // figure out correct query string for IE
        var query;
        if (ns == '*' && localName == '*') {
          query = '*';
        } else if (ns == '*') { // not supported
          return createNodeList(); // empty []
        } else {
          var prefix = this.namespaces_['_' + ns]; 
          if (prefix == undefined) {
            return createNodeList(); // empty []
          }
        
          if (prefix == undefined) {
            results = [];
          } else if (prefix == 'xmlns') {
            query = localName;
          } else {
            query = prefix + ':' + localName;
          }
        }
        
        matches = this.xml_.getElementsByTagName(query);
        for (var i = 0; i < matches.length; i++) {
          results.push(matches[i]);
        }
      }
    }
    
    // now create or fetch Element_s representing these DOM nodes
    var nodes = createNodeList();
    for (var i = 0; i < results.length; i++) {
      var elem = this.getNode_(results[i]);
      nodes.push(elem);
    }
    
    return nodes;
  },
  
  /** Fetches an Element_ or Node_ or creates a new one on demand.
      
      @param nodeXML XML or HTML DOM node for the element to use when 
      constructing the Element_ or Node_.
      
      @returns If IE, returns the HTC proxy for the node (i.e. node.htc_) so
      that external callers can manipulate it and have getter/setter
      magic happen; if other browsers, returns the Node_ or Element_
      itself. */
  getNode_: function(nodeXML) {
    var node;
    
    if (nodeXML.nodeType == Node_.ELEMENT_NODE) {
      // if we've created an Element_ for this node before, we
      // stored a reference to it by ID so we could get it later
      node = this.nodeById_['_' + nodeXML.getAttribute('id')];
    
      if (!node) {
        // never seen before -- we'll have to create a new Element_ now
        node = new Element_(nodeXML.nodeName, nodeXML.prefix, 
                            nodeXML.namespaceURI, nodeXML, this.handler_, false);
        node.passThrough_ = true;
      
        // store a reference to ourselves. 
        // unfortunately IE doesn't support 'expandos' on XML parser objects, 
        // so we can't just say nodeXML.fakeNode_ = node, so we have to use a 
        // lookup table
        var elementId = node.nodeXML_.getAttribute('id');
        this.nodeById_['_' + elementId] = node;
      }
    } else if (nodeXML.nodeType == Node_.TEXT_NODE) {
      // for all browsers but IE, we have an internal ID for text nodes that
      // we use to refetch and return them if they have been created before;
      // this is because we can set variables on XML text nodes whereas
      // on IE we can't, so we can't track text nodes on IE unfortunately
      node = this.nodeById_['_' + nodeXML.textNodeID_];
      if (!node) {
        // we always create these on demand since they have no ID to use
        // for caching; unfortunately we can't cache an internal ID
        // on XML text nodes for IE, so we have to just always produce them
        // on demand
        node = new Node_(nodeXML.nodeName, Node_.TEXT_NODE, null, null, nodeXML,
                         this.handler_, false);
        node.passThrough_ = true;
        
        if (!isIE) {
          this.nodeById_['_' + node.nodeXML_.textNodeID_] = node;
        }
      }
    } else {
      throw new Error('Unknown node type given to getNode_: ' 
                      + nodeXML.nodeType);
    }
    
    return node.getProxyNode_();
  },
  
  // Note: createDocumentFragment, createComment, createCDATASection,
  // createProcessingInstruction, createAttribute, createEntityReference,
  // importNode, createElement, getElementsByTagName,
  // createAttributeNS not supported
  
  /** Extracts any namespaces we might have, creating a prefix/namespaceURI
      lookup table.
      
      NOTE: We only support namespace declarations on the root SVG node
      for now.
      
      @returns An object that associates prefix to namespaceURI, and vice
      versa. */
  getNamespaces_: function() {
    var results = [];
    
    var attrs = this.xml_.documentElement.attributes;
    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];
      if (/^xmlns:?(.*)$/.test(attr.nodeName)) {
        var m = attr.nodeName.match(/^xmlns:?(.*)$/);
        var prefix = (m[1] ? m[1] : 'xmlns');
        var namespaceURI = attr.nodeValue;
        
        results['_' + prefix] = namespaceURI;
        results['_' + namespaceURI] = prefix;
        results.push(namespaceURI);
      }
    }
    
    return results;
  }
});


// We don't create a NodeList class due to the complexity of subclassing
// the Array object cross browser. Instead, we simply patch in the item()
// method to a normal Array object
function createNodeList() {
  var results = [];
  results.item = function(i) {
    if (i >= this.length) {
      return null; // DOM Level 2 spec says return null
    } else {
      return this[i];
    }
  }
  return results;
}


// We don't have an actual DOM CharacterData type for now. We just return
// a String object with the 'data' property patched in, since that is what
// is most commonly accessed
function createCharacterData(data) {
  var results = (data != undefined) ? new String(data) : new String();
  results.data = results.toString();
  return results;
}

// End DOM Level 2 Core/Events support

// SVG DOM interfaces

// Note: where the spec returns an SVGNumber or SVGString we just return
// the JavaScript base type instead. Note that in general also instead of
// returning the many SVG List types, such as SVGPointList, we just
// return standard JavaScript Arrays. For SVGAngle we also
// just return a JS Number for now.

function SVGMatrix_(a /** All Numbers */, b, c, d, e, f) {
  this.a = a; this.b = b; this.c = c; this.d = d; this.e = e; this.f = f;
}

extend(SVGMatrix_, {
// all functions return SVGMatrix_

  multiply: function(secondMatrix /* SVGMatrix_ */ ) {},
  inverse: function() {},
  translate: function(x /* Number */, y /* Number */) {},
  scale: function(scaleFactor /* Number */) {},
  scaleNonUniform: function(scaleFactorX /* Number */, scaleFactorY /* Number */) {},
  rotate: function(angle /* Number */) {},
  rotateFromVector: function(x, y) {},
  flipX: function() {},
  flipY: function() {},
  skewX: function(angle) {},
  skewY: function(angle) {}
});


// Note: Most of the functions on SVGLength not supported for now
function SVGLength_(/* Number */ value) {
  this.value = value;
}


// Note: We only support SVGAnimatedLength_ because that is what Firefox
// and Safari return, and we want to have parity. Only baseVal works for now
function SVGAnimatedLength_(/* SVGLength_ */ value) {
  this.baseVal = value;
  this.animVal = undefined; // not supported for now
}


function SVGTransform_(type, matrix, angle) {
  this.type = type;
  this.matrix = matrix;
  this.angle = angle;
}

mixin(SVGTransform_, {
  SVG_TRANSFORM_UNKNOWN: 0, SVG_TRANSFORM_MATRIX: 1, SVG_TRANSFORM_TRANSLATE: 2,
  SVG_TRANSFORM_SCALE: 3, SVG_TRANSFORM_ROTATE: 4, SVG_TRANSFORM_SKEWX: 5,
  SVG_TRANSFORM_SKEWY: 6
});

extend(SVGTransform_, {
  // Note: the following 3 should technically be readonly
  type: null, /* one of the constants above */
  matrix: null, /* SVGMatrix_ */
  angle: null, /* float */
  
  setMatrix: function(matrix /* SVGMatrix */) {},
  setTranslate: function(tx /* float */, ty /* float */) {},
  setScale: function(sx /* float */, sy /* float */) {},
  setRotate: function(angle /* float */, cx /* float */, cy /* float */) {},
  setSkewX: function(angle /* float */) {},
  setSkewY: function(angle /* float */) {}  
});


// the following just return object literals or other basic
// JS types for simplicity instead of having full classes

// SVGRect
function createSVGRect(x /* float */, y /* float */, width /* float */, 
                     height /* float */) {
  return {x: parseFloat(x), y: parseFloat(y), 
          width: parseFloat(width), height: parseFloat(height)};
}


// SVGPoint
function createSVGPoint(x /* Number */, y /* Number */) { 
  return {x: Number(x), y: Number(y)};
  
  // matrixTransform method not supported
}

// end SVG DOM interfaces

/* 
  Other DOM interfaces specified by SVG 1.1:
  
  * SVG 1.1 spec requires DOM 2 Views support, which we do not implement:
    http://www.w3.org/TR/DOM-Level-2-Views/

  * SVG 1.1 spec has the DOM traversal and range APIs as optional; these are
    not supported

  * Technically we need to support certain DOM Level 2 CSS interfaces:
    http://www.w3.org/TR/DOM-Level-2-Style/css.html
    We support some (anything that should be on an SVG Element), 
    but the following interfaces are not supported:
    CSSStyleSheet, CSSRuleList, CSSRule, CSSStyleRule, CSSMediaRule,
    CSSFontFaceRule, CSSPageRule, CSSImportRule, CSSCharsetRule,
    CSSUnknownRule, CSSStyleDeclaration, CSSValue, CSSPrimitiveValue,
    CSSValueList, RGBColor, Rect, Counter, ViewCSS (getComputedStyle),
    DocumentCSS, DOMImplementationCSS, none of the CSS 2 Extended Interfaces
    
  * There are many SVG DOM interfaces we don't support
*/

window.svgweb = new SVGWeb(); // kicks things off

// hide internal implementation details inside of a closure
})();