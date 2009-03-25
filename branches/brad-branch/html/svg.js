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
must usesvgweb.addOnLoad() instead of window.onload or 
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

* On Internet Explorer, DOM text nodes created through document.createTextNode
with the second argument given as 'true':

document.createTextNode('some text', true)

will have a .style property on them as an artifact of how we support
various things internally. Changing this will have no affect. Technically
DOM text nodes should not have a .style property.

* On Internet Explorer, the cssText property on an SVG node's style object
should not be set or retrieved; it will have unreliable results. For example,
calling myCircle.style.cssText will not correctly return the SVG CSS of that
node.

* The Firefox 3 native implementation of SVG doesn't correctly mirror
inline style="" attributes into element.style.* values. For example,
if I have the following SVG element:

<path id="myPath" style="display: block; fill: red; opacity: 0.5" />

and then I access it's style properties:

var myPath = document.getElementById('myPath');
console.log(myPath.style.fill); // does not print 'red' on Firefox!

Note that this is a bug in the browser itself and not from us. The native
SVG renderer on Safari does not have this issue. We correctly parse and expose
our style properties for the above case for the Flash renderer.

* By default the SVG root element has an overflow of hidden. If you make the
overflow visible, when using the Flash renderer elements will not overflow
outside of the containing Flash movie.
  
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
    lookups; see the _getNamespaces() methods in this file for how this
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
  this.libraryPath = this._getLibraryPath();
  
  // prepare IE by inserting special markup into the page to have the HTC
  // be available
  if (document.namespaces) { // IE
    this._prepareBehavior();
  }
  
  // wait for our page's DOM content to be available
  this._initDomContentLoaded();
}

extend(SVGWeb, {
  // path to find library resources
  libraryPath: './',
  // RenderConfig object of which renderer (native or Flash) to use
  config: null,
  pageLoaded: false,
  handlers: [],
  
  _listeners: [],
  
  /** Associative array of all random IDs we have ever autogenerated to prevent
      collisions. */
  _randomIDs: {},
  
  /** A data structure that we used to keep track of removed nodes, necessary
      so we can clean things up and prevent memory leaks on IE on page unload.
      Unfortunately we have to keep track of this at the global 'svgweb'
      level rather than on individual handlers because a removed node
      might have never been associated with a real DOM or a real handler. */
  _removedNodes: [],
  
  /** Adds an event listener to know when both the page, the internal SVG
      machinery, and any SVG SCRIPTS or OBJECTS are finished loading.
      Window.onload is not safe, since it can get fired before we are
      truly done, so this method should be used instead.
      
      @param listener Function that will get called when page and all
      embedded SVG is loaded and rendered. */
  addOnLoad: function(listener) {
    this._listeners.push(listener);
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
  _initDomContentLoaded: function() {
    // onDOMContentLoaded code adapted from Dean Edwards/Matthias Miller/
    // John Resig/others
  
    var self = this;
    // FIXME: Test to make sure this works on Safari 2
    if (document.addEventListener) {
      // DOMContentLoaded supported on Opera 9/Mozilla/Safari 3
      document.addEventListener('DOMContentLoaded', function() {
        self._onDOMContentLoaded();
      }, false);
    } else { // Internet Explorer
      // id is set to be __ie__svg__onload rather than __ie_onload so
      // we don't have name collisions with other scripts using this
      // code as well
      document.write('<script id=__ie__svg__onload defer '
                      + 'src=javascript:void(0)><\/script>');
      var script = document.getElementById('__ie__svg__onload');
      script.onreadystatechange = function() {
        if (this.readyState == 'complete') { 
          self._onDOMContentLoaded(); // call the onload handler
        }
      }
    }
  },
  
  /** Gets any data-path value that might exist on the SCRIPT tag
      that pulls in our svg.js library to configure where to find
      library resources like SWF files, HTC files, etc. */
  _getLibraryPath: function() {
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
  
  /** Fires when the DOM content of the page is ready to be worked with. */
  _onDOMContentLoaded: function() {
    //console.log('onDOMContentLoaded');
    
    // quit if this function has already been called
    if (arguments.callee.done) {
      return;
    }
    
    // flag this function so we don't do the same thing twice
    arguments.callee.done = true;
    
    // cleanup onDOMContentLoaded handler to prevent memory leaks on IE
    var listener = document.getElementById('__ie__svg__onload');
    if (listener) {
      listener.parentNode.removeChild(listener);
      listener.onreadystatechange = null;
      listener = null;
    }
    
    // determine what renderers (native or Flash) to use for which browsers
    this.config = new RenderConfig();
    
    // sign up for the onunload event on IE to clean up references that
    // can cause memory leaks
    if (isIE) {
      this._watchUnload();
    }
    
    // extract any SVG SCRIPTs or OBJECTs
    this._svgScripts = this._getSVGScripts();
    this._svgObjects = this._getSVGObjects();
    
    this.totalSVG = this._svgScripts.length + this._svgObjects.length;
    
    // no SVG - we're done
    if (this.totalSVG == 0) {
      if (isIE) {
        // TODO: dynamic SVG
        // we need to embed some hidden SVG for IE to 'prime the pump' to
        // have the HTC behavior be available
        //this._embedHiddenSVG();
        // fire the onload when the hidden SVG is done
      } else {
        this._fireOnLoad();
      }
    }
    
    // see if we can even support SVG in any way
    if (!this.config.supported) {
      // no ability to use SVG in any way
      this._displayNotSupported(this.config.reason);
      this._fireOnLoad();
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
    this._handleHTMLTitleBug();
  
    // now process each of the SVG SCRIPTs and SVG OBJECTs
    this.totalLoaded = 0;
    var self = this;
    for (var i = 0; i < this._svgScripts.length; i++) {
      this._processSVGScript(this._svgScripts[i]);
    }
    
    for (var i = 0; i < this._svgObjects.length; i++) {
      this._processSVGObject(this._svgObjects[i]);
    }
    
    // wait until all of them have done their work, then fire onload
  },
  
  /** Gets any SVG SCRIPT blocks on the page. */
  _getSVGScripts: function() {
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
  _getSVGObjects: function() {
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
  _displayNotSupported: function(reason) {
    // write the reason into the OBJECT tags if nothing is already present
    for (var i = 0; i < this._svgObjects.length; i++) {
      var obj = this._svgObjects[i];
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
    for (var i = 0; i < this._svgScripts.length; i++) {
      var script = this._svgScripts[i];
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
  _fireOnLoad: function() {
    this.pageLoaded = true;
    
    // TODO: handle dynamic SVG
    // start watching to see if dynamic SVG has been created; see the method
    // itself for details why
    //this._watchDynamicSVG();
    
    // we do a slight timeout so that if exceptions get thrown inside the
    // developers onload methods they will correctly show up and get reported
    // to the developer; otherwise since the fireOnLoad method is called 
    // from Flash and an exception gets called it can get 'squelched'
    var self = this;
    window.setTimeout(function() {
      for (var i = 0; i < self._listeners.length; i++) {
        self._listeners[i]();
      }
    }, 1);
    
    // TODO: remember to fire on all of the SVG handlers as well, not just the
    // persisted developers window onload
  },
  
  /** Prepares the svg.htc behavior for IE. */
  _prepareBehavior: function() {
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
  _embedHiddenSVG: function() {
    // TODO: Handle dynamic SVG
  },
  
  /** Extracts SVG from the script, cleans it up, adds missing IDs to
      all elements, and then creates the correct Flash or Native handler to do 
      the hard work. 
      
      @param script DOM node of the SVG SCRIPT element. */
  _processSVGScript: function(script) {
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
    var xml = this._addIDs(svg);
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

      self._handleDone(id, type);
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
  _generateID: function(prefix, postfix) {
    // generate an ID for this element
    if (!postfix) {
      postfix = '';
    }
    
    if (!prefix) {
      prefix = '';
    }
    
    var newID = null;
    while (!newID || this._randomIDs['_' + newID]) {
      newID = prefix + Math.round(Math.random() * 100000 + 1) + postfix;
    }
    
    this._randomIDs['_' + newID] = newID;
    
    return newID;
  },
  
  /** Walks the SVG DOM, adding automatic generated IDs to those
      elements which don't have them. We need IDs on all elements
      in order to be able to 'shadow' values between them and
      the SVG DOM inside the Flash viewer; we don't do this for the
      Native handler.
      
      @returns Parsed DOM XML Document of the SVG with all elements having 
      an ID. */
  _addIDs: function(svg) {
    // parse the SVG
    var xmlDoc = parseXML(svg);
    var root = xmlDoc.documentElement;
    
    // now walk the parsed DOM
    var current = root;
    while (current) {
      if (this.getHandlerType() == 'flash' && current.nodeType == 1 
          && !current.getAttribute('id')) {
        current.setAttribute('id', this._generateID('__svg__random__', null));
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
  _processSVGObject: function(obj) {
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
  _handleDone: function(id, type) {
    this.totalLoaded++;
    
    if (this.totalLoaded == this.totalSVG) {
      // we are finished
      this._fireOnLoad();
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
  _watchDynamicSVG: function() {
    // TODO
  },
  
  /** Safari 3 has a strange bug where if you have no HTML TITLE element,
      it will interpret the first SVG TITLE as the HTML TITLE and change
      the browser's title at the top of the title bar; this only happens
      with the native handler, but for consistency we insert an empty
      HTML TITLE into the page if none is present for all handlers
      which solves the issue. */
  _handleHTMLTitleBug: function() {
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
  _fireFlashError: function(logString) {
  },
  
  /** Add an .id attribute for non-SVG and non-HTML nodes for the Native
      Handler, which don't have them by default in order to have parity with the
      Flash viewer. We have this here instead of on the Native Handlers
      themselves because the method is called by our patched 
      document.getElementByTagNameNS and we don't want to do any closure
      magic there to prevent memory leaks. */
  _exportID: function(node) {
    node.__defineGetter__('id', function() {
      return node.getAttribute('id');
    });
    node.__defineSetter__('id', function(newValue) {
      return node.setAttribute('id', newValue);
    });
  },
  
  /** Sign up for the onunload event on IE to clean up references that
      can cause memory leaks. */
  _watchUnload: function() {
    window.attachEvent('onunload', function(evt) {
      // detach this anonymous listener
      window.detachEvent('onunload', arguments.callee);
      
      // do all the onunload work now
      svgweb._fireUnload();
    });
  },
  
  /** Called when window unload event fires; putting this in a separate
      function helps us with unit testing. */
  _fireUnload: function() {
    if (!isIE) { // helps with unit testing
      return;
    }
    
    // delete the HTC container and all HTC nodes
    var container = document.getElementById('__htc_container');
    if (container) {
      for (var i = 0; i < container.childNodes.length; i++) {
        var child = container.childNodes[i];
        child._fakeNode._htcNode = null;
        child._fakeNode = null;
        child._handler = null;
      }
      container.parentNode.removeChild(container);
      container = null;
    }

    // clean up svg:svg root tags
    for (var i = 0; i < svgweb.handlers.length; i++) {
      var root = svgweb.handlers[i].document.documentElement._htcNode;
      
      // remove anything we added to the HTC's style object
      root.style.item = null;
      root.style.setProperty = null;
      root.style.getPropertyValue = null;
      
      // clean up our hidden HTML DOM and our Flash object
      var flashObj = root._getFlashObj();
      flashObj.sendToFlash = null;
      flashObj.parentNode.removeChild(flashObj);
      var html = root._doc.getElementsByTagName('html')[0];
      html.parentNode.removeChild(html);
      root._doc = null;
        
      // delete object references
      root._fakeNode._htcNode = null;
      root._fakeNode = null;
      root._realParentNode = null;
      root._realPreviousSibling = null;
      root._realNextSibling = null;
      root._handler = null;
      
      root = null;
    }

    // for all the handlers, remove their reference to the Flash object
    for (var i = 0; i < svgweb.handlers.length; i++) {
      var handler = svgweb.handlers[i];
      handler.flash = null;
    }
    svgweb.handlers = null;

    // clean up any nodes that were removed in the past
    for (var i = 0; i < svgweb._removedNodes.length; i++) {
      var node = svgweb._removedNodes[i];
      if (node._fakeNode) {
        node._fakeNode._htcNode = null;
      }
      node._fakeNode = null;
      node._handler = null;
    }
    svgweb._removedNodes = null;
    
    // cleanup document patching
    document.getElementById = null;
    document._getElementById = null;
    document.getElementsByTagNameNS = null;
    document._getElementsByTagNameNS = null;
    document.createElementNS = null;
    document._createElementNS = null;
    document.createTextNode = null;
    document._createTextNode = null;
    document._importNodeFunc = null;
  }
});


/** Sees if there is a META tag to force Flash rendering for all browsers.
    Also determines if the browser supports native SVG or Flash and the
    correct Flash version. Determines the best renderer to use. */
function RenderConfig() {
  // see if there is a META tag for 'svg.render.forceflash'
  if (!this._forceFlash()) {
    // if not, see if this browser natively supports SVG
    if (this._hasNativeSVG()) {
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
  _forceFlash: function() {
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
  _hasNativeSVG: function() {
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

	this._detectVersion();
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
	
	_detectVersion: function(){
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
				versionStr = this._JSFlashInfo(testVersion);		
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
	_JSFlashInfo: function(testVersion){
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
  this._finishedCallback = args.finishedCallback;
  
  // setup our custom document.getElementById, document.getElementsByTagNameNS, 
  // etc. methods
  this._patchDocumentObject();
  
  if (this.type == 'script') {
    this.id = args.svgID;
    this._xml = args.xml;
    this._svgString = args.svgString;
    this._scriptNode = args.scriptNode;
       
    this._handleScript();
  } else if (this.type == 'object') {
    this.id = args.objID;
    this._objNode = args.objNode;
    
    this._handleObject();
  }
}

extend(FlashHandler, {
  /** The Flash object's ID; set by _SVGSVGElement. */
  flashID: null, 
  /** The Flash object; set by _SVGSVGElement. */
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
    // note that 'this.flash' is set by the _SVGSVGElement._setupFlash()
    // after we create a Flash object there
    return this.flash.sendToFlash(msg);
  },
  
  onMessage: function(msg) {
    //console.log('onMessage, msg='+this.debugMsg(msg));
    if (msg.type == 'event') {
      this._onEvent(msg);
      return;
    } else if (msg.type == 'log') {
      this._onLog(msg);
      return;
    } else if (msg.type == 'script') {
      // TODO: Bring onScript over from Rick's fork
      this._onObjectScript(msg);
      return;
    } else if (msg.type == 'error') {
      this._onFlashError(msg);
    }
  },
  
  /** Called by _SVGSVGElement when we are loaded and rendered. 
  
      @param id The ID of the SVG element.
      @param type The type of element that is finished loading,
      either 'script' or 'object'. */
  fireOnLoad: function(id, type) {
    this._finishedCallback(id, type);
  },
  
  /** Patches the document object to also use the Flash backend. */
  _patchDocumentObject: function() {
    if (document._getElementById) {
      // already defined before
      return;
    }
    
    // We don't capture the original document functions as a closure, 
    // as Firefox doesn't like this and will fail to run the original. 
    // Instead, we capture the original versions on the document object
    // itself but with a _ prefix.
    
    document._getElementById = document.getElementById;
    document.getElementById = this._getElementById;
    
    document._getElementsByTagNameNS = document.getElementsByTagNameNS;
    document.getElementsByTagNameNS = this._getElementsByTagNameNS;
    
    document._createElementNS = document.createElementNS;
    document.createElementNS = this._createElementNS;
      
    document._createTextNode = document.createTextNode;
    document.createTextNode = this._createTextNode;
    
    document._importNodeFunc = this._importNodeFunc;
  },
  
  /** Our implementation of getElementById, which we patch into the 
      document object. We do it here to prevent a closure and therefore
      a memory leak on IE. Note that this function runs in the global
      scope, so 'this' will not refer to our object instance but rather
      the window object. */
  _getElementById: function(id) {
    var result = document._getElementById(id);
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
  _getElementsByTagNameNS: function(ns, localName) {
    var results = createNodeList();
    
    // NOTE: can't use Array.concat to combine our arrays below because 
    // document._getElementsByTagNameNS results aren't a real Array, they
    // are DOM NodeLists
    
    if (document._getElementsByTagNameNS) {
      var matches = document._getElementsByTagNameNS(ns, localName);
      
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
  _createElementNS: function(ns, qname) {
    if (ns == null || ns == 'http://www.w3.org/1999/xhtml') {
      if (isIE) {
        return document.createElement(qname);
      } else {
        return document._createElementNS(ns, qname);
      }
    }
    
    // someone might be using this library on an XHTML page;
    // only use our overridden createElementNS if they are using
    // a namespace we have never seen before
    if (!isIE) {
      var namespaceFound = false;
      for (var i = 0; i < svgweb.handlers.length; i++) {
        if (svgweb.handlers[i].document._namespaces['_' + ns]) {
          namespaceFound = true;
          break;
        }
      }
      
      if (!namespaceFound) {
        return document._createElementNS(ns, qname);
      }
    }
    
    var prefix;
    for (var i = 0; i < svgweb.handlers.length; i++) {
      prefix = svgweb.handlers[i].document._namespaces['_' + ns];
      if (prefix) {
        break;
      }
    }
    
    if (prefix == 'xmlns' || !prefix) { // default SVG namespace
      prefix = null;
    }

    var node = new _Element(qname, prefix, ns);
    return node._getProxyNode(); 
  },
  
  /** Our implementation of createTextNode, which we patch into the 
      document object. We do it here to prevent a closure and therefore
      a memory leak on IE. Note that this function runs in the global
      scope, so 'this' will not refer to our object instance but rather
      the window object. 
      
      We patch createTextNode to have a second boolean argument that controls 
      whether the resulting text node will be appended within our SVG tree. 
      We need this so we can return one of our magic _Nodes instead of a native
      DOM node for later appending and tracking. 
      
      @param data Text String.
      @param forSVG Optional boolean on whether node will be attached to
      SVG sub-tree. Defaults to false. */
  _createTextNode: function(data, forSVG) {
    if (!forSVG) {
      return document._createTextNode(data);
    } else {
      // just create a real DOM text node in our internal representation for
      // our nodeXML value; we will import this anyway into whatever parent
      // we append this to, which will convert it into a real XML type at
      // that time
      var nodeXML = document._createTextNode(data);
      var textNode = new _Node('#text', _Node.TEXT_NODE, null, null, nodeXML);
      textNode._nodeValue = data;
      
      return textNode._getProxyNode();
    }
  },
  
  /** IE doesn't support the importNode function. We define it on the
      document object as _importNodeFunc. Unfortunately we need it there
      since it is a recursive function and needs to call itself, and we
      don't want to do this on an object instance to avoid memory leaks
      from closures on IE. Note that this function runs in the global scope
      so 'this' will point to the Window object. */
  _importNodeFunc: function(doc, node, allChildren) {
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
                document._importNodeFunc(doc, node.childNodes[i], allChildren));
          }
        }
        
        return newNode;
        break;
      case 3: // TEXT NODE
        return doc.createTextNode(node.nodeValue);
        break;
    }
  },
  
  _handleScript: function() {
    // create proxy objects representing the Document and SVG root
    this.document = new _Document(this._xml, this);
    this.document.documentElement = 
            new _SVGSVGElement(this._xml.documentElement, this._svgString,
                               this._scriptNode, this);
  },
  
  _handleObject: function() {
    // TODO:
  },
  
  _onLog: function(msg) {
    console.log('FLASH: ' + msg.logString);
  },
  
  _onEvent: function(msg) {
    if (msg.eventType.substr(0, 5) == 'mouse') {
      this._onMouseEvent(msg);
      return;
    } else if (msg.eventType == 'onRenderingFinished') {
      this.document.documentElement._onRenderingFinished(msg);
      return;
    } else if (msg.eventType == 'onFlashLoaded') {
      this.document.documentElement._onFlashLoaded(msg);
      return;
    } else if (msg.eventType == 'onHTCLoaded') {
      this.document.documentElement._onHTCLoaded(msg);
    }
  },
  
  /** Calls if the Flash encounters an error. */
  _onFlashError: function(msg) {
    this._onLog(msg);
    svgweb._fireFlashError('FLASH: ' + msg.logString);
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
  this._finishedCallback = args.finishedCallback;
  
  this._xml = args.xml;
  
  if (this.type == 'object') {
    // these are just handled by the browser; just add an onload handler
    // to know when they are done and save any old one that might be present
    this.id = args.objID;
    this._watchObjectLoad();
  } else if (this.type == 'script') {
    this.id = args.svgID;
    this._namespaces = this._getNamespaces();
    this._patchDocumentObject();
    this._processSVGScript(this._xml, args.svgString, args.scriptNode);
    this._finishedCallback(this.id, 'script');
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
  _watchObjectLoad: function() {
    // TODO
  },
  
  /** Inserts the SVG back into the HTML page with the correct namespace. */
  _processSVGScript: function(xml, svgString, scriptNode) {
   var importedSVG = document.importNode(xml.documentElement, true);
   scriptNode.parentNode.replaceChild(importedSVG, scriptNode);
   this._svgRoot = importedSVG;
  },
  
  _patchDocumentObject: function() {
    if (document._getElementById) {
      // already defined before
      return;
    }
    
    // we have to patch getElementById because getting a node by ID
    // if it is namespaced to something that is not XHTML or SVG does
    // not work natively; we build up a lookup table in _processSVGScript
    // that we can work with later
    
    // getElementById
    document._getElementById = document.getElementById;
    document.getElementById = function(id) {
      var result = document._getElementById(id);
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
          svgweb._exportID(node);
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
    document._getElementsByTagNameNS = document.getElementsByTagNameNS;
    document.getElementsByTagNameNS = function(ns, localName) {
      var result = document._getElementsByTagNameNS(ns, localName);
      
      // firefox doesn't like if (result)
      if (result != null && result.length != 0) {
        if (ns != null && ns != 'http://www.w3.org/1999/xhtml' && ns != svgns) {
          // add an .id attribute for non-SVG and non-HTML nodes, which
          // don't have them by default in order to have parity with the
          // Flash viewer
          for (var i = 0; i < result.length; i++) {
            var node = result[i];
            svgweb._exportID(node);
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
        var prefix = handler._namespaces['_' + ns];
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
        
        xpathResults = xpath(document, handler._svgRoot, expr, 
                             handler._namespaces);
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
              svgweb._exportID(node);
            }
            
            result.push(node);
          }
          
          return result;
        }
      }
      
      return createNodeList();
    }
    
    // createElementNS
    
    // Surprisingly, Firefox doesn't work when setting 
    // svgElement.style.property! For example, if you set 
    // myCircle.style.fill = 'red', nothing happens. You have to do
    // myCircle.style.setProperty('fill', 'red', null). This issue is 
    // independent of the fact that we are running in a text/html situation,
    // and happens in self-contained SVG files as well. To fix this, we have
    // to override createElementNS and patch in the ability to use the
    // svgElement.style.* syntax
    if (isFF) {
      document._createElementNS = document.createElementNS;
      document.createElementNS = this._createElementNS;
    }
  },
  
  /** Extracts any namespaces we might have, creating a prefix/namespaceURI
      lookup table.
      
      NOTE: We only support namespace declarations on the root SVG node
      for now.
      
      @returns An object that associates prefix to namespaceURI, and vice
      versa. */
  _getNamespaces: function() {
    var results = [];
    
    var attrs = this._xml.documentElement.attributes;
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
  },
  
  /** A patched version of createElementNS necessary for Firefox. See the
      documentation inside of patchDocumentObject for the reasons why. 
      Note that this function runs in the global scope, so 'this' will not 
      refer to our object instance but rather the window object. */
  _createElementNS: function(ns, qname) {
    var elem = document._createElementNS(ns, qname);
    
    if (ns != svgns) {
      return elem;
    }
    
    // patch the style object to support style.fill = 'red' type accessing
    var customStyle = {};
    var origStyle = elem.style;
    
    // define getters and setters for SVG CSS property names
    for (var i = 0; i < _Style._allStyles.length; i++) {
      var styleName = _Style._allStyles[i];
      
      // convert camel casing (i.e. strokeWidth becomes stroke-width)
      var stylePropName = styleName.replace(/([A-Z])/g, '-$1').toLowerCase();
      
      // Do a trick so that we can have a separate closure for each
      // iteration of the loop and therefore each separate style name; 
      // closures are function-level, so doing an anonymous inline function 
      // will force the closure into just being what we pass into it. If we 
      // don't do this then the closure will actually always simply be the final 
      // index position when the for loop finishes.
      
      (function(origStyle, styleName, stylePropName) {
        customStyle.__defineSetter__(styleName, function(styleValue) {
          return origStyle.setProperty(stylePropName, styleValue, null);
        });
        customStyle.__defineGetter__(styleName, function() {
          return origStyle.getPropertyValue(stylePropName);
        });
      })(origStyle, styleName, stylePropName); // pass closure values
    }
      
    // define other methods and properties from CSSStyleDeclaration interface
    customStyle.setProperty = function(styleName, styleValue, priority) {
      return origStyle.setProperty(styleName, styleValue, priority);
    }
    customStyle.getPropertyValue = function(styleName) {
      return origStyle.getPropertyValue(styleName);
    }
    customStyle.removeProperty = function(styleName) {
      return origStyle.removeProperty(styleName);
    }
    customStyle.item = function(index) {
      return origStyle.item(index);
    }
    customStyle.__defineGetter__('cssText', function() {
      return origStyle.cssText;
    });
    customStyle.__defineGetter__('length', function() {
      return origStyle.length;
    });
    
    // now override the browser's native style property on our new element
    elem.__defineGetter__('style', function() {
      return customStyle; 
    });
    
    return elem;
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

function _DOMException(code) {
  this.code = code;
  
  // superclass constructor
  Error(this.toString());
}

// subclass built-in browser Error object
_DOMException.prototype = new Error;

mixin(_DOMException, {
  INDEX_SIZE_ERR: 1, DOMSTRING_SIZE_ERR: 2, HIERARCHY_REQUEST_ERR: 3,
  WRONG_DOCUMENT_ERR: 4, INVALID_CHARACTER_ERR: 5, NO_DATA_ALLOWED_ERR: 6,
  NO_MODIFICATION_ALLOWED_ERR: 7, NOT_FOUND_ERR: 8, NOT_SUPPORTED_ERR: 9,
  INUSE_ATTRIBUTE_ERR: 10, INVALID_STATE_ERR: 11, SYNTAX_ERR: 12,
  INVALID_MODIFICATION_ERR: 13, NAMESPACE_ERR: 14, INVALID_ACCESS_ERR: 15
});

extend(_DOMException, {
  toString: function() {  
    // rather than having a giant switch statement here which will bloat the
    // code size, just dynamically get the property name for the given error 
    // code and turn it into a string
    for (var i in _DOMException) {
      if (i.indexOf('ERR') != -1 && _DOMException[i] === this.code) {
        return String(i);
      }
    }
    
    return 'Unknown error: ' + this.code;
  }
});


function _SVGException(code) {
  this.code = code;
  
  // superclass constructor
  Error(this.toString());
}

// subclass built-in browser Error object
_SVGException.prototype = new Error;

mixin(_SVGException, {
  SVG_WRONG_TYPE_ERR: 0, SVG_INVALID_VALUE_ERR: 1, SVG_MATRIX_NOT_INVERTABLE: 2
});

extend(_SVGException, {
  toString: function() {  
    switch(this.code) {
      case 0: return 'SVG_WRONG_TYPE_ERR';
      case 1: return 'SVG_INVALID_VALUE_ERR';
      case 2: return 'SVG_MATRIX_NOT_INVERTABLE';
      default: return 'Unknown error: ' + this.code;
    }
  }
});


function _DOMImplementation() {}

extend(_DOMImplementation, {
  hasFeature: function(feature /* String */, version /* String */) /* Boolean */ {
    // TODO
  }
  
  // Note: createDocumentType and createDocument left out
});


// Note: Only element and text section nodes are supported for now.
// We don't parse and retain comments, processing instructions, etc. CDATA
// nodes are turned into text nodes.
function _Node(nodeName, nodeType, prefix, namespaceURI, nodeXML, handler, 
               passThrough) {
  if (nodeName == undefined && nodeType == undefined) {
    // prototype subclassing
    return;
  }
  
  this.nodeName = nodeName;
  this._nodeXML = nodeXML;
  this._handler = handler;
  
  // handle nodes that were created with createElementNS but are not yet
  // attached to the document yet
  this._attached = true;
  if (!this._nodeXML && !this._handler) {
    this._attached = false;
    
    // build up an empty XML node for this element
    var xml = '<?xml version="1.0"?>\n';
    if (namespaceURI == svgns && !prefix) {
      xml += '<' + nodeName + ' xmlns="' + svgns + '"/>';
    } else {
      xml += '<' + nodeName + ' xmlns:' + prefix + '="' + namespaceURI + '"/>';
    }
  
    this._nodeXML = parseXML(xml).documentElement;
  }
  
  if (nodeType == _Node.ELEMENT_NODE) {
    if (nodeName.indexOf(':') != -1) {
      this.localName = nodeName.match(/^[^:]*:(.*)$/)[1];
    } else {
      this.localName = nodeName;
    }
  }
  
  if (nodeType) {
    this.nodeType = nodeType;
  } else {
    this.nodeType = _Node.ELEMENT_NODE;
  }
  
  if (nodeType == _Node.ELEMENT_NODE || nodeType == _Node.DOCUMENT_NODE) {
    this.prefix = prefix;
    this.namespaceURI = namespaceURI;
    this._nodeValue = null;
  } else if (nodeType == _Node.TEXT_NODE) {
    this._nodeValue = this._nodeXML.nodeValue;
    
    // browsers return null instead of undefined
    this.prefix = null;
    this.namespaceURI = null;
    if (this._nodeValue === undefined) {
      this._nodeValue = null;
    }
  }
  
  this.ownerDocument = document;
  
  if (passThrough === undefined) {
    passThrough = false;
  }
  this._passThrough = passThrough;
  
  this._childNodes = this._createChildNodes();
  
  // We keep an cachedChildNodes array around until we are truly
  // attached that we can depend on to serve out our childNodes; we can't
  // use this._childNodes since that ends up calling our getter/setter
  // magic, which depends on having a real Flash handler assigned to
  // us to do the hard work. Once we are attached we clear this data
  // structure out; if we become unattached we recreate it.
  this._cachedChildNodes = [];
  this._cachedParentNode = null;
  
  // We track text nodes with an internal node ID.
  if (nodeType == _Node.TEXT_NODE) {
    this._textNodeID = svgweb._generateID('__svg__random__', '__text');
    if (!isIE) { // IE can't add expandos to XML objects
      this._nodeXML._textNodeID = this._textNodeID;
    }
  }
  
  // prepare the getter and setter magic for non-IE browsers
  if (!isIE) {
    this._defineNodeAccessors();
  } else if (isIE && this.nodeType != _Node.DOCUMENT_NODE 
             && this.nodeName != 'svg') {
    // if we are IE, we must use a behavior in order to get onpropertychange
    // and override core DOM methods. We don't do it for the root SVG
    // element since that is already a proper Behavior as it embeds our
    // Flash control inside of _SVGSVGElement
    this._createHTC();
  }
}

mixin(_Node, {
  ELEMENT_NODE: 1,
  TEXT_NODE: 3,
  DOCUMENT_NODE: 9
  
  // Note: many other node types left out here
});

extend(_Node, {
  insertBefore: function(newChild /* _Node */, refChild /* _Node */) {
    // TODO: Throw an exception if either child is a text node, either native
    // or a text _Node
    
    // if the children are DOM nodes, turn them into _Node or _Element
    // references
    newChild = this._getFakeNode(newChild);
    refChild = this._getFakeNode(refChild);
    
    // get an ID for both children
    var newChildID = this._determineID(newChild);
    var refChildID = this._determineID(refChild);
    
    // the new child might not have an ID; generate one if not
    if (newChildID == null && newChild.nodeType == _Node.ELEMENT_NODE) {
      newChild._setId(svgweb._generateID('__svg__random__', null));
      newChildID = newChild._getId();
    }
    
    // add an ID entry for newChild into nodeById
    if (newChildID && this._attached) {
      this._handler.document._nodeById['_' + newChildID] = newChild;
    }
    
    // get an index position for where refChild is
    var findResults = this._findChild(refChild);
    if (findResults === null) {
      // TODO: Throw the correct DOM error instead
      throw new Error('Invalid child passed to insertBefore');
    }
    var position = findResults.position;
    
    // import newChild into ourselves, insert it into our XML, and process
    // the newChild and all its descendants
    var importedNode = this._importNode(newChild, false);
    this._nodeXML.insertBefore(importedNode, refChild._nodeXML);
    this._processAppendedChildren(newChild, this._attached, this._passThrough);
    
    // add to our cached list of child nodes
    if (!this._attached) {
      var cachedChildNodes = [];
      for (var i = 0; i < position; i++) {
        cachedChildNodes.push(this._cachedChildNodes[i]);
      }
      cachedChildNodes.push(newChild);
      for (var i = position + 1; i <= this._cachedChildNodes.length; i++) {
        cachedChildNodes.push(this._cachedChildNodes[i - 1]);
      }
      this._cachedChildNodes = cachedChildNodes;
    }
    
    if (!isIE) {
      // _childNodes is an object literal instead of an array
      // to support getter/setter magic for Safari
      this._defineChildNodeAccessor(this._childNodes.length);
      this._childNodes.length++;
    }
    
    // set our new correct cached next and previous siblings, which we keep
    // around to hand out in case we become unattached
    if (!this._attached) {
      this._setupCachedSiblings();
    }
    
    // inform Flash about the change
    if (this._attached && this._passThrough) {
      var parentID = this._nodeXML.getAttribute('id');
      this._handler.sendToFlash({ type: 'invoke', 
                                  method: 'insertBefore',
                                  newChildId: newChildID,
                                  refChildId: refChildID,
                                  parentId: parentID,
                                  position: position});
    }
    
    return newChild._getProxyNode();
  },
  
  replaceChild: function(newChild /* _Node */, oldChild /* _Node */) {
    //console.log('replaceChild, newChild='+newChild.id+', oldChild='+oldChild.id);
    // the children could be DOM nodes; turn them into something we can
    // work with, such as _Nodes or _Elements
    newChild = this._getFakeNode(newChild);
    oldChild = this._getFakeNode(oldChild);
 
    // get an ID if one is available
    var oldChildID = this._determineID(oldChild);
    var newChildID = this._determineID(newChild);
    
    // the new child might not have an ID; generate one if not
    if (newChildID == null && newChild.nodeType == _Node.ELEMENT_NODE) {
      newChild._setId(svgweb._generateID('__svg__random__', null));
      newChildID = newChild._getId();
    }
    
    // in our XML, find the index position of where oldChild used to be
    var findResults = this._findChild(oldChild);
    if (findResults === null) {
      // TODO: Throw the correct DOM error instead
      throw new Error('Invalid child passed to removeChild');
    }
    var position = findResults.position;
    
    // remove oldChild
    this.removeChild(oldChild);
    
    // add to our cached list of child nodes
    if (!this._attached) {
      var cachedChildNodes = [];
      for (var i = 0; i < position; i++) {
        cachedChildNodes.push(this._cachedChildNodes[i]);
      }
      cachedChildNodes.push(newChild);
      for (var i = position + 1; i <= this._cachedChildNodes.length; i++) {
        cachedChildNodes.push(this._cachedChildNodes[i - 1]);
      }
      this._cachedChildNodes = cachedChildNodes;
    }
    
    if (!isIE) {
      // _childNodes is an object literal instead of an array
      // to support getter/setter magic for Safari
      this._defineChildNodeAccessor(this._childNodes.length);
      this._childNodes.length++;
    }
    
    // import newChild into ourselves, telling importNode not to do an
    // appendChild
    var importedNode = this._importNode(newChild, false);

    // bring the imported child into our XML where the oldChild used to be
    if (position >= this._nodeXML.childNodes.length) {
      // old node was at the end -- just do an appendChild
      this._nodeXML.appendChild(importedNode);
    } else {
      // old node is somewhere in the middle or beginning; jump one ahead
      // from the old position and do an insertBefore
      var placeBefore = this._nodeXML.childNodes[position];
      this._nodeXML.insertBefore(importedNode, placeBefore);
    }
    
    // now process the newChild's node
    this._processAppendedChildren(newChild, this._attached, this._passThrough);
    
    // recursively set the removed node to be unattached and to not
    // pass through changes to Flash anymore
    oldChild._setUnattached(null);
    
    // set our new correct cached next and previous siblings, which we keep
    // around to hand out in case we become unattached
    if (!this._attached) {
      this._setupCachedSiblings();
    }
    
    // tell Flash about the removal of oldChild
    if (this._attached) {
      var parentId = this._getId();
      if (oldChild.nodeType == _Node.ELEMENT_NODE) {
        this._handler.sendToFlash({ type: 'invoke', 
                                    method: 'addChildAt',
                                    elementId: newChild._getId(),
                                    parentId: parentId,
                                    position: position });
      } else if (oldChild.nodeType == _Node.TEXT_NODE) {
         this._handler.sendToFlash({ type: 'invoke', 
                                     method: 'setText',
                                     parentId: parentId,
                                     text: newChild._nodeValue });
      }
    }
    
    // track this removed node so we can clean it up on page unload
    svgweb._removedNodes.push(oldChild._getProxyNode());
    
    return oldChild._getProxyNode();
  },
  
  removeChild: function(child /* _Node or DOM Node */) {
    //console.log('removeChild, child='+child.nodeName+', this='+this.nodeName);
    // the child could be a DOM node; turn it into something we can
    // work with, such as a _Node or _Element
    child = this._getFakeNode(child);

    // remove child from our list of XML
    var findResults = this._findChild(child);
    if (findResults === null) {
      // TODO: Throw the correct DOM error instead
      throw new Error('Invalid child passed to removeChild');
    }

    var position = findResults.position;
    this._nodeXML.removeChild(findResults.node);

    // remove from our nodeById lookup table
    var childID = this._determineID(child);
    if (childID && this._attached) {
      this._handler.document._nodeById['_' + childID] = undefined;
    }

    // remove from our list of cachedChildNodes
    if (!this._attached) {
      for (var i = 0; i < this._cachedChildNodes.length; i++) {
        var node = this._cachedChildNodes[i];
        var nodeID;
        if (node.nodeType == _Node.ELEMENT_NODE) {
          nodeID = node.getAttribute('id');
        } else if (node.nodeType == _Node.TEXT_NODE && !isIE
                   && node._textNodeID) {
          nodeID = node._textNodeID;
        }

        // does this node in the cachedChildNodes array match the
        // child passed in?
        if (childID && nodeID && childID == nodeID) {
          this._cachedChildNodes.splice(i, 1);
          break;
        } else if (isIE && child.nodeType == _Node.TEXT_NODE
                   && node.nodeType == _Node.TEXT_NODE) {
          if (child._nodeValue == node._nodeValue) {
            this._cachedChildNodes.splice(i, 1);
            break;
          }
        }
      }
    }
    
    // remove the getter/setter for this childNode for non-IE browsers
    if (!isIE) {
      // just remove the last getter/setter, since they all resolve
      // to a dynamic function anyway
      delete this._childNodes[this._childNodes.length - 1];
      this._childNodes.length--;
    } else {
      // for IE, remove from _childNodes data structure
      this._childNodes.splice(position);
    }
    
    // inform Flash about the change
    if (this._attached && child._passThrough) {
      if (child.nodeType == _Node.TEXT_NODE) {
        // use the parent node for the ID, since we will clear it's text
        childID = this._nodeXML.getAttribute('id');
      }
      
      // TODO: BUG: We also need to delete the text node associated with this
      this._handler.sendToFlash({ type: 'invoke', 
                                  method: 'removeChild',
                                  elementId: childID,
                                  nodeType: child.nodeType });
    }
    
    // recursively set the removed node to be unattached and to not
    // pass through changes to Flash anymore
    child._setUnattached(null);
    
    // set our cached next and previous siblings to null now that we are
    // unattached
    child._cachedPreviousSibling = null;
    child._cachedNextSibling = null;
    
    // set our new correct cached next and previous siblings, which we keep
    // around to hand out in case we become unattached
    if (!this._attached) {
      this._setupCachedSiblings();
    }
    
    // track this removed node so we can clean it up on page unload
    svgweb._removedNodes.push(child._getProxyNode());
    
    return child._getProxyNode();  
  },
  
  /** Appends the given child. The child can either be _Node, an
      actual DOM Node, or a Text DOM node created through 
      document.createTextNode. We return either a _Node or an HTC reference
      depending on the browser. */
  appendChild: function(child /* _Node or DOM Node */) {
    //console.log('appendChild, child='+child.nodeName+', this='+this.nodeName);  
    // the child could be a DOM node; turn it into something we can
    // work with, such as a _Node or _Element
    child = this._getFakeNode(child);
    
    // add the child's XML to our own
    this._importNode(child);
    
    // manually add our child to our internal list of nodes
    if (!this._attached) {
      this._cachedChildNodes.push(child);
    }
    if (this._attached && isIE) {
      this._childNodes.push(child._htcNode);
    }
    
    if (!isIE) {
      // _childNodes is an object literal instead of an array
      // to support getter/setter magic for Safari
      this._defineChildNodeAccessor(this._childNodes.length);
      this._childNodes.length++;
    }
    
    // process the children (add IDs, add a handler, etc.)
    this._processAppendedChildren(child, this._attached, this._passThrough);
    
    // set our new correct cached next and previous siblings, which we keep
    // around to hand out in case we become unattached
    if (!this._attached) {
      this._setupCachedSiblings();
    }

    return child._getProxyNode();
  },
  
  hasChildNodes: function() /* Boolean */ {
    return (this._getChildNodes().length > 0);
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
    if (this.nodeType == _Node.ELEMENT_NODE) {
      for (var i in this._attributes) {
        // if this is an XMLNS declaration, don't consider it a valid
        // attribute for hasAttributes
        if (/^_xmlns/i.test(i)) {
          continue;
        }
        
        // if there is an ID attribute, but it's one of our randomly generated
        // ones, then don't consider this a valid attribute for hasAttributes
        if (i == '_id' && /^__svg__random__/.test(this._attributes[i])) {
          continue;
        }
        
        // our attributes start with an underscore
        if (/^_.*/.test(i) && this._attributes.hasOwnProperty(i)) {
          return true;
        }
      }
      
      return false;
    } else {
      return false;
    }
  },
  
  // Note: technically the following attributes should be read-only, 
  // raising _DOMExceptions if set, but for simplicity we make them 
  // simple JS properties instead. If set nothing will happen.
  nodeName: null,
  nodeType: null,
  ownerDocument: null, /* Document or _Document depending on context. */
  namespaceURI: null,
  localName: null,
  prefix: null, /* Note: in the DOM 2 spec this is settable but not for us */
  
  // getter/setter attribute methods
  
  // nodeValue defined as getter/setter
  // textContent and data defined as getters/setters for TEXT_NODES
  // childNodes defined as getter/setter
  
  _getParentNode: function() {
    if (this.nodeType == _Node.DOCUMENT_NODE) {
      return null;
    }
    
    // are we the root SVG object?
    if (this.nodeName == 'svg') {
      if (this._htcNode) { // IE
        // we stored the realParentNode in the _SVGSVGElement constructor
        // when we created the SVG root
        return this._htcNode._realParentNode;
      } else { // other browsers
        return this._handler.flash;
      }
    }
    
    var parentXML = this._nodeXML.parentNode;
    // unattached nodes might have an XML document as their parentNode
    if (parentXML == null || parentXML.nodeType == _Node.DOCUMENT_NODE) {
      return null;
    }
    
    if (this._attached) {
      return this._handler.document._getNode(parentXML);
    } else {
      return this._cachedParentNode._getProxyNode();
    }
  },
  
  _getFirstChild: function() {
    if (this.nodeType == _Node.TEXT_NODE) {
      return null;
    }
    
    var childXML = this._nodeXML.firstChild;
    if (childXML == null) {
      return null;
    }
    
    if (!this._attached && this._cachedChildNodes[0]) {
      return this._cachedChildNodes[0]._getProxyNode();
    } else {
      // no node cached
      return this._handler.document._getNode(childXML);
    }
  },
  
  _getLastChild: function() {
    if (this.nodeType == _Node.TEXT_NODE) {
      return null;
    }
    
    var childXML = this._nodeXML.lastChild;
    if (childXML == null) {
      return null;
    }
    
    if (!this._attached 
        && this._cachedChildNodes.length > 0 
        && this._cachedChildNodes[this._cachedChildNodes.length - 1]) {
      var child = this._cachedChildNodes[this._cachedChildNodes.length - 1];
      return child._getProxyNode();
    } else {
      // no node cached
      return this._handler.document._getNode(childXML);
    }
  },
  
  _getPreviousSibling: function() {
    if (this.nodeType == _Node.DOCUMENT_NODE) {
      return null;
    }
    
    if (this.nodeType == _Node.TEXT_NODE) {
      return null;
    }
    
    // are we the root SVG object?
    if (this.nodeName == 'svg') {
      if (this._htcNode) { // IE
        // we stored the realPreviousSibling in the _SVGSVGElement constructor
        // when we created the SVG root, otherwise this._htcNode.previousSibling
        // will recursively call ourselves infinitely!
        return this._htcNode._realPreviousSibling;
      } else { // other browsers
        return this._handler.flash.previousSibling;
      }
    }
    
    var siblingXML = this._nodeXML.previousSibling;
    // unattached nodes will sometimes have an XML Processing Instruction
    // as their previous node (type=7)
    if (siblingXML == null || siblingXML.nodeType == 7) {
      return null;
    }
    
    if (this._attached) {
      return this._handler.document._getNode(siblingXML);
    } else {
      return this._cachedPreviousSibling;
    }
  },
  
  _getNextSibling: function() {
    if (this.nodeType == _Node.DOCUMENT_NODE) {
      return null;
    }
    
    if (this.nodeType == _Node.TEXT_NODE) {
      return null;
    }
    
    // are we the root SVG object?
    if (this.nodeName == 'svg') {
      if (this._htcNode) { // IE
        // we stored the realNextSibling in the _SVGSVGElement constructor
        // when we created the SVG root, otherwise this._htcNode.nextSibling
        // will recursively call ourselves infinitely!
        return this._htcNode._realNextSibling;
      } else { // other browsers
        return this._handler.flash.nextSibling;
      }
    }
    
    var siblingXML = this._nodeXML.nextSibling;
    if (siblingXML == null) {
      return null;
    }
    
    if (this._attached) {
      return this._handler.document._getNode(siblingXML);
    } else {
      return this._cachedNextSibling;
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
  _passThrough: false,
  
  /** The attached flag indicates whether this node is attached to a live
      DOM yet. For example, if you call createElementNS, you can set
      values on this node before actually appending it using appendChild
      to a node that is connected to the actual visible DOM, ready to
      be rendered. */
  _attached: true,
  
  /** A flag we put on our _Nodes and _Elements to indicate they are fake;
      useful if someone wants to 'break' the abstraction and see if a node
      is a real DOM node or not (which won't have this flag). */
  _fake: true,
  
  /** Do the getter/setter magic for our attributes for non-IE browsers. */
  _defineNodeAccessors: function() {
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
      return self._getPreviousSibling(); 
    });
    this.__defineGetter__('nextSibling', function() { 
      return self._getNextSibling(); 
    });
    
    // childNodes array
    this.__defineGetter__('childNodes', function() {
      return self._childNodes;
    });
    var children = this._nodeXML.childNodes;
    this._childNodes.length = children.length; 
    for (var i = 0; i < children.length; i++) {
      // do the defineGetter in a different method so the closure gets
      // formed correctly (closures can be tricky in loops if you are not
      // careful)
      this._defineChildNodeAccessor(i);
    }
    
    // read/write properties
    if (this.nodeType == _Node.TEXT_NODE) {
      this.__defineGetter__('data', function() { 
        return self._nodeValue; 
      });
      this.__defineSetter__('data', function(newValue) {
        return self._setNodeValue(newValue);
      });
      
      this.__defineGetter__('textContent', function() { 
        return self._nodeValue; 
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
      return self._nodeValue; 
    });
    this.__defineSetter__('nodeValue', function(newValue) {
      return self._setNodeValue(newValue);
    });
  },
  
  /** Creates a getter/setter for a childNode at the given index position.
      We define each one in a separate function so that we don't pull
      the wrong things into our closure. See _defineNodeAccessors() for
      details. */
  _defineChildNodeAccessor: function(i) {
    var self = this;
    
    this._childNodes.__defineGetter__(i, function() {
      if (!self._attached && self._cachedChildNodes[i]) {
        return self._cachedChildNodes[i];
      } else if (self._attached) { // we are attached to a real, live DOM
        var childXML = self._nodeXML.childNodes[i];
        return self._handler.document._getNode(childXML);
      }
    });
  },
  
  /** For IE we have to do some tricks that are a bit different than
      the other browsers; we can't know when a particular
      indexed member is called, such as childNodes[1], so instead we
      return the entire _childNodes array; what is nice is that IE applies
      the indexed lookup _after_ we've returned things, so this works. This
      requires us to instantiate all the children, however, when childNodes
      is called. This method is called by the HTC file. 
      
      @returns An array of either the HTC proxies for our nodes if IE,
      or an array of _Element and _Nodes for other browsers. */
  _getChildNodes: function() {
    if (!isIE) {
      return this._childNodes;
    }
    
    // NOTE: for IE we return a real full Array, while for other browsers
    // our _childNodes array is an object literal in order to do
    // our __defineGetter__ magic in _defineNodeAccessors. It turns out
    // that on IE a full array can be returned from the getter, and _then_
    // the index can get applied (i.e. our array is returned, and then 
    // [2] might get applied to that array).
    var results = createNodeList();
    
    if (!this._attached) {
      // we aren't attached to the DOM yet, and therefore have no
      // Flash handler we can depend on. We had to build up an
      // cachedChildNodes array earlier whenever appendChild
      // was called that we can depend on until we are attached to a
      // real, live DOM.
      for (var i = 0; i < this._cachedChildNodes.length; i++) {
        results.push(this._cachedChildNodes[i]._htcNode);
      }
      
      return results;
    } else if (this._nodeXML.childNodes.length == this._childNodes.length) {
      // we've already processed our childNodes before
      return this._childNodes;
    } else {
      for (var i = 0; i < this._nodeXML.childNodes.length; i++) {
        var childXML = this._nodeXML.childNodes[i];
        results.push(this._handler.document._getNode(childXML));
      }
      
      this._childNodes = results;
      return results;
    }
  },
  
  // if we are IE, we must use a behavior in order to get onpropertychange
  // and override core DOM methods
  _createHTC: function() {
    // we store our HTC nodes into a hidden container located in the
    // HEAD of the document; either get it now or create one on demand
    if (!this._htcContainer) {
      this._htcContainer = document.getElementById('__htc_container');
      if (!this._htcContainer) {
        // strangely, onpropertychange does _not_ fire for HTC elements
        // that are in the HEAD of the document, which is where we used
        // to put the htc_container. Instead, we have to put it into the BODY
        // of the document and position it offscreen.
        var body = document.getElementsByTagName('body')[0];
        var c = document.createElement('div');
        c.id = '__htc_container';
        // NOTE: style.display = 'none' does not work
        c.style.position = 'absolute';
        c.style.top = '-5000px';
        c.style.left = '-5000px';
        body.appendChild(c);
        this._htcContainer = c;
      }
    }
    
    // now store our HTC UI node into this container; we will intercept
    // all calls through the HTC, and implement all the real behavior
    // inside ourselves (inside _Element)
    // Note: we do svg: even if we are dealing with a non-SVG node on IE,
    // such as sodipodi:namedview; this is necessary so that our svg.htc
    // file gets invoked for all these nodes, which is bound to the 
    // svg: namespace
    var nodeName = this.nodeName;
    if (nodeName == '#text') {
      nodeName = '__text'; // text nodes
    }
    var htcNode = document.createElement('svg:' + this.nodeName);
    htcNode._fakeNode = this;
    htcNode._handler = this._handler;
    this._htcContainer.appendChild(htcNode);
    this._htcNode = htcNode;
  },
  
  _setNodeValue: function(newValue) {
    if (this.nodeType != _Node.TEXT_NODE) {
      // FIXME: Is this correct? Can other kinds of nodes other than
      // text nodes have a nodeValue?
      return newValue;
    }
    
    this._nodeValue = newValue;
    this._nodeXML.nodeValue = newValue;
    
    if (this._passThrough) {
      // get the ID of our parent
      var parentID = this._nodeXML.parentNode.getAttribute('id');
      if (!parentID 
          || this._nodeXML.parentNode.nodeType != _Node.ELEMENT_NODE) {
        return newValue;
      }
      
      this._handler.sendToFlash({ type: 'invoke', 
                                  method: 'setText',
                                  parentId: parentID,
                                  text: newValue});
    }

    return newValue;
  },
  
  /** For functions like appendChild, insertBefore, removeChild, etc.
      outside callers can pass in DOM nodes, etc. This function turns
      this into something we can work with, such as a _Node or _Element. */
  _getFakeNode: function(child) {
    // Was HTC node was passed in for IE? If so, get its _Node
    if (isIE && child._fakeNode) {
      child = child._fakeNode;
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
      
      @param child _Node to work with.
      @param attached Boolean on whether we are attached or not yet.
      @param passThrough Boolean on whether to pass values through
      to Flash or not. */
  _processAppendedChildren: function(child, attached, passThrough) {
    //console.log('processAppendedChildren, this.nodeName='+this.nodeName+', child.nodeName='+child.nodeName+', attached='+attached+', passThrough='+passThrough);
    var childXML = child._nodeXML;
    
    // generate a random ID if none is present
    var id;
    if (childXML.nodeType == _Node.ELEMENT_NODE) {
      id = childXML.getAttribute('id');
      if (!id) {
        id = svgweb._generateID('__svg__random__', null);
        child._setId(id);
      }
    }
    
    child._handler = this._handler;
    
    if (attached && childXML.nodeType == _Node.ELEMENT_NODE) {
      // store a reference to our node so we can return it in the future
      this._handler.document._nodeById['_' + id] = child;

      // tell Flash about our new element
      
      // FIXME: I'm sure we can do this much more efficiently then calling
      // Flash over and over; instead, send over a giant String XML
      // representation of the children and parse it on the other side in one
      // shot
      
      // create the element
      this._handler.sendToFlash({ type: 'invoke', 
                                  method: 'createElementNS',
                                  elementType: child.nodeName, 
                                  elementId: id,
                                  prefix: child.prefix,
                                  namespaceURI: child.namespaceURI });
                                  
      // send over each of our styles for SVG nodes to Flash
      if (child.namespaceURI == svgns) {
        for (var i = 0; i < child.style.length; i++) {
          var styleName = child.style.item(i);
          var styleValue = child.style.getPropertyValue(styleName);
          var stylePropName = child.style._fromCamelCase(styleName);
          
          this._handler.sendToFlash({ type: 'invoke', 
                                      method: 'setAttribute',
                                      elementId: id,
                                      applyToStyle: true,
                                      attrName: stylePropName, 
                                      attrValue: styleValue });
        }
      }
                                  
      // send over each of our attributes
      for (var i in child._attributes) {
        if (!child._attributes.hasOwnProperty(i)) {
          continue;
        }
        
        var attrName = i.replace(/^_/, '');
        // ignore ID and XML namespace declarations
        if (attrName == 'id' || /^xmlns:?/.test(attrName)) {
          continue;
        }
        
        var attrValue = child._attributes[i];
        
        // get a namespace if a prefix is present
        var ns = null;
        if (attrName.indexOf(':') != -1) {
          // get the namespace prefix
          var prefix = attrName.split(':')[0];
          
          // transform the attribute name into a local name 
          // (i.e. xlink:href becomes just href)
          attrName = attrName.split(':')[1];
          
          // get the actual namespace URI
          if (this._handler.document._namespaces['_' + prefix]) {
            ns = this._handler.document._namespaces['_' + prefix];
          } else {
            console.debug('Note: no namespace declared for ' + prefix
                          + ' attribute ' + attrName + '; ignoring');
            continue;
          }
        }
        
        this._handler.sendToFlash({ type: 'invoke', 
                                    method: 'setAttribute',
                                    elementId: id,
                                    attrNamespace: ns,
                                    attrName: attrName, 
                                    attrValue: attrValue });
      }
           
      // now append the element      
      this._handler.sendToFlash({ type: 'invoke', 
                                  method: 'appendChild',
                                  elementId: this._getId(),
                                  childId: id });
    } else if (attached && childXML.nodeType == _Node.TEXT_NODE) {
      // store a reference to our node so we can return it in the future
      this._handler.document._nodeById['_' + textNodeID] = child;
      
      var parentID = childXML.parentNode.getAttribute('id');
      
      // tell Flash about our new text node
      this._handler.sendToFlash({ type: 'invoke', 
                                  method: 'setText',
                                  parentId: parentID,
                                  text: childXML.nodeValue });
    }
    
    // recursively process each child
    var children = child._getChildNodes();
    for (var i = 0; i < children.length; i++) {
      var fakeNode = children[i];
      if (isIE) {
        fakeNode = fakeNode._fakeNode;
      }
      child._processAppendedChildren(fakeNode, attached, passThrough);
    }
    
    child._attached = attached;
    child._passThrough = passThrough;
    child._cachedParentNode = this;
    
    // keep a pointer to any text nodes we made while unattached
    // so we can return the same instance later
    if (attached && !isIE) { // no XML expandos on IE, so can't do this there
      for (var i = 0; i < child._cachedChildNodes.length; i++) {
        var currentNode = child._cachedChildNodes[i];
        if (currentNode.nodeType == _Node.TEXT_NODE) {
          var textNodeID = currentNode._nodeXML._textNodeID;
          this._handler.document._nodeById['_' + textNodeID] = currentNode;
        }
      }
    }
    
    // clear out the cachedChildNodes structure if we are now truly attached
    if (attached) {
      child._cachedChildNodes = createNodeList();
    }
  },
  
  /** Imports the given child and all it's children's XML into our XML. 
  
      @param child _Node to import.
      @param doAppend Optional. Boolean on whether to actually append
      the child once it is imported. Useful for functions such as
      replaceChild that want to do this manually. Defaults to true if not
      specified.
      
      @returns The imported node. */
  _importNode: function(child, doAppend) {
    //console.log('importNode, child='+child.nodeName+', doAppend='+doAppend);
    if (typeof doAppend == 'undefined') {
      doAppend = true;
    }
    
    // try to import the node into our _Document's XML object
    var doc;
    if (this._attached) {
      doc = this._handler.document._xml;
    } else {
      doc = this._nodeXML.ownerDocument;
    }
    
    // IE does not support document.importNode, even on XML documents, 
    // so we have to define it ourselves.
    // Adapted from ALA article:
    // http://www.alistapart.com/articles/crossbrowserscripting
    var importedNode;
    if (typeof doc.importNode == 'undefined') {
      // import the node for IE
      importedNode = document._importNodeFunc(doc, child._nodeXML, true);
    } else { // non-IE browsers
      importedNode = doc.importNode(child._nodeXML, true);
    }

    // complete the import into ourselves
    if (doAppend) {
      this._nodeXML.appendChild(importedNode);
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
    this._nodeXML = newXML;
    var children = this._getChildNodes();
    for (var i = 0; i < this._nodeXML.childNodes.length; i++) {
      var currentChild = children[i];
      if (isIE && currentChild._fakeNode) { // IE
        currentChild = currentChild._fakeNode;
      } 
      
      currentChild._nodeXML = this._nodeXML.childNodes[i];
      currentChild._importChildXML(this._nodeXML.childNodes[i]);
    }
    
    // copy over our internal _textNodeID to the new XML node for text nodes
    if (!isIE && this.nodeType == _Node.TEXT_NODE) {
      this._nodeXML._textNodeID = this._textNodeID;
    }
  },
  
  /** Tries to find the given child in our list of child nodes.
      
      @param child A _Node or _Element to search for in our list of
      childNodes. 
      
      @returns An object literal with two values:
         position The index position of where the child is located.
         node The node itself
         
      If the child is not found then null is returned instead. */
  _findChild: function(child) {
    //console.log('findChild, child='+child.nodeName);
    var results = {};
    
    // get an ID for the child if one is available
    var id;
    if (child.nodeType == _Node.ELEMENT_NODE) {
      id = child._nodeXML.getAttribute('id');
    } else if (child.nodeType == _Node.TEXT_NODE && !isIE) {
      id = child._textNodeID;
    }

    // FIXME: If there are multiple text nodes with the same content, and
    // someone wants to actually find the middle one versus the first one,
    // this will fail on IE because we find the matching node based on 
    // text content versus a text node ID. This is because on IE XML
    // nodes can't have expando properties, so we can't store our generated
    // text node ID on the XML node itself to find it again later.
    for (var i = 0; i < this._nodeXML.childNodes.length; i++) {
      var node = this._nodeXML.childNodes[i];
      var nodeID;
      if (node.nodeType == _Node.ELEMENT_NODE) {
        nodeID = node.getAttribute('id');
      } else if (node.nodeType == _Node.TEXT_NODE && !isIE
                 && node._textNodeID) {
        nodeID = node._textNodeID;
      }

      if (id && nodeID && id === nodeID) {
        results.position = i;
        results.node = node;
        return results;
      } else if (isIE && child.nodeType == _Node.TEXT_NODE
                 && node.nodeType == _Node.TEXT_NODE) {
        if (child._nodeValue == node.nodeValue) {
          results.position = i;
          results.node = node;
          return results;
        }
      }
    }
    
    return null;
  },
  
  /** Takes a _Node or _Element and returns an ID if available. Used by
      the various DOM manipulation methods, such as insertBefore, 
      removeChild, etc. Returns null if no ID is available. 
      
      @param child _Node or _Element reference. */
  _determineID: function(child) {
    var id = null;
    if (child.nodeType == _Node.ELEMENT_NODE) {
      id = child._nodeXML.getAttribute('id');
    } else if (child.nodeType == _Node.TEXT_NODE) {
      id = child._textNodeID;
    }
    
    if (id === undefined) {
      id = null;
    }
    
    return id;
  },
  
  /** After a node is unattached, such as through a removeChild, this method
      recursively sets _attached and _passThrough to false on this node
      and all of its children. 
      
      @param parentNode _Node or _Element. The parent of this child, used so
      that we can cache the parent and return it if someone calls
      parentNode on this child while unattached. */
  _setUnattached: function(parentNode) {
    // we cache the parent node and sibling information so it is available 
    // when unattached
    this._cachedParentNode = parentNode;
    this._cachedPreviousSibling = this._getPreviousSibling();
    this._cachedNextSibling = this._getNextSibling();
    
    // set each child to be unattached, and also capture a reference to it
    // for later so that we can work with it while unattached. This will also
    // force all children to be created if they were never fetched before
    // so we can have a real reference to them.
    var children = this._getChildNodes();
    var cachedChildNodes = createNodeList();
    for (var i = 0; i < children.length; i++) {
      var child = children[i];
      if (isIE) {
        child = child._fakeNode;
      }
      child._setUnattached(this);
      cachedChildNodes.push(child);
    }
    this._cachedChildNodes = cachedChildNodes;
    this._childNodes.length = cachedChildNodes.length;
    this._attached = false;
    this._passThrough = false;
    this._handler = null;
  },
  
  /** When we return results to external callers, such as appendChild,
      we can return one of our fake _Node or _Elements. However, for IE,
      we have to return the HTC 'proxy' through which callers manipulate
      things. The HTC is what allows us to override core DOM methods and
      know when property and style changes have happened, for example. */
  _getProxyNode: function() {
    if (!isIE) {
      return this;
    } else {
      // for IE, the developer will manipulate things through the UI/HTC
      // proxy facade so that we can know about property changes, etc.
      return this._htcNode;
    }
  },
  
  /** Goes through all of our children, setting each of their
      cachedNextSibling and cachedPreviousSibling to their neighbor's values.
      This is used after we have changed the ordering of our children, such
      as with insertBefore(). These cached data structures are used to
      return our values if we are unattached from the DOM. */
  _setupCachedSiblings: function() {
    for (var i = 0; i < this._cachedChildNodes.length; i++) {
      var currentChild = this._cachedChildNodes[i];
    
      if (i == 0) {
        currentChild._cachedPreviousSibling = null;
      } else {
        currentChild._cachedPreviousSibling = 
                    this._cachedChildNodes[i - 1]._getProxyNode();
      }
    
      if (i == (this._cachedChildNodes.length - 1)) {
        currentChild._cachedNextSibling = null;
      } else {
        currentChild._cachedNextSibling = 
                    this._cachedChildNodes[i + 1]._getProxyNode();
      }
    }
  },
  
  /** Creates our childNodes data structure in a different way for different
      browsers. We have this in a separate method so that we avoid forming
      a closure of elements that could lead to a memory leak in IE. */
  _createChildNodes: function() {
    var childNodes;
    
    if (!isIE) {
      // NOTE: we make _childNodes an object literal instead of an Array; if
      // it is an array we can't do __defineGetter__ on each index position on
      // Safari
      childNodes = {};
      
      // add the item() method from NodeList to our childNodes instance
      childNodes.item = function(index) {
        if (index >= this.length) {
          return null; // DOM Level 2 spec says return null
        } else {
          return this[index];
        }
      }
    } else { // IE
      childNodes = createNodeList();
    }
    
    return childNodes;
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
function _Element(nodeName, prefix, namespaceURI, nodeXML, handler, 
                  passThrough) {
  if (nodeName == undefined && namespaceURI == undefined 
      && nodeXML == undefined && handler == undefined) {
    // prototype subclassing
    return;
  }
  
  // superclass constructor
  _Node.apply(this, [nodeName, _Node.ELEMENT_NODE, prefix, namespaceURI, nodeXML,
                     handler, passThrough]);
                     
  // setup our attributes
  this._attributes = {};
  this._attributes['_id'] = ''; // default id is empty string on FF and Safari
  this._importAttributes(this, this._nodeXML);
  
  // define our accessors if we are not IE; IE does this by using the HTC
  // file rather than doing it here
  if (!isIE) {
    this._defineAccessors();
  }
  
  // track .style changes
  if (this.namespaceURI == svgns) {
    // for IE, don't setup the style object for the SVG root; we do this a bit
    // later for the SVG root since we initialize the HTC object differently,
    // which the _Style object depends on during initialization
    if (!isIE || this.nodeName != 'svg') {
      this.style = new _Style(this);
    }
  }
  
  // pay attention to style changes now in the HTC for everything but the
  // SVG root, which starts paying attention to style changes after the SVG
  // root has done its works putting the Flash into the page
  if (isIE && this.nodeName != 'svg' && this.namespaceURI == svgns) {
    this.style._ignoreStyleChanges = false;
  }
}

// subclasses _Node
_Element.prototype = new _Node;

extend(_Element, {
  getAttribute: function(attrName) /* String */ {
    var value;
    
    if (this._passThrough) {
      var elementId = this._nodeXML.getAttribute('id');
      var msg = this._handler.sendToFlash(
                       { type: 'invoke', method: 'getAttribute',
                         elementId: elementId, attrName: attrName});
      if (msg) {
        value = msg.attrValue;
      }
    } else {
      value = this._nodeXML.getAttribute(attrName);
      
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
    this.setAttributeNS(null, attrName, attrValue);
  },
  
  removeAttribute: function(name) /* void */ {
    /* throws _DOMException */
  },

  getAttributeNS: function(ns, localName) /* String */ {
  },

  setAttributeNS: function(ns, qName, attrValue /* String */) /* void */ {
    var elementId = this._nodeXML.getAttribute('id');
    
    // parse out local name of attribute
    var localName = qName;
    if (qName.indexOf(':') != -1) {
      localName = qName.split(':')[1];
    }

    // if id then change node lookup table (only if we are attached to
    // the DOM however)
    if (this._attached && qName == 'id') {
      var doc = this._handler.document;

      // old lookup
      doc._nodeById['_' + elementId] = undefined;
      // new lookup
      doc._nodeById['_' + attrValue] = this;
    }
    
    /* Safari has a wild bug; If you have an element inside of a clipPath with
       a style string:
    
       <clipPath id="clipPath11119">
          <rect width="36.416" height="36.416" ry="0" x="247" y="-157"
                style="opacity:1;fill:#6b6b6b;"
                id="rect11121" />
        </clipPath>
        
        Then calling setAttribute('style', '') on our nodeXML causes the
        browser to crash! The workaround is to temporarily remove nodes
        that have a clipPath parent, set their style, then
        reattach them (!) */
    if (isSafari
        && localName == 'style'
        && this._nodeXML.parentNode != null 
        && this._nodeXML.parentNode.nodeName == 'clipPath') {
      // save our XML position information for later re-inserting
      var addBeforeXML = this._nodeXML.nextSibling;
      var origParent = this._nodeXML.parentNode;
      // remove the node and set style; doing this prevents crash when 
      // setting style string      
      this._nodeXML.parentNode.removeChild(this._nodeXML);
      this._nodeXML.setAttribute('style', attrValue);
      // re-attach ourselves before our old sibling
      if (addBeforeXML) {
        origParent.insertBefore(this._nodeXML, addBeforeXML);
      } else { // node was at end originally
        origParent.appendChild(this._nodeXML);
      }
    } else { // we are an attrname other than style, or on a non-Safari browser
      // update our XML; we store the full qname (i.e. xlink:href)
      this._nodeXML.setAttribute(qName, attrValue);
    }

    // update our internal set of attributes
    this._attributes['_' + qName] = attrValue;

    // send to Flash
    if (this._passThrough) {
      this._handler.sendToFlash(
                       { type: 'invoke', 
                         method: 'setAttribute',
                         elementId: elementId,
                         attrNamespace: ns,
                         attrName: localName, 
                         attrValue: attrValue });
    }
  },
  
  removeAttributeNS: function(ns, localName) /* void */ {
      /* throws _DOMException */
  },
  
  getElementsByTagNameNS: function(ns, localName) /* _NodeList */ {},

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
  style: null, /** Note: technically should be read only; _Style instance */
  
  _setClassName: function(className) {
  },
  
  // Note: we return a normal String instead of an SVGAnimatedString
  // as dictated by the SVG 1.1 standard
  _getClassName: function() {},
  
  // Note: getPresentationAttribute not supported
  
  // SVGTransformable; takes an _SVGTransform
  _setTransform: function(transform) {
  },
  
  // Note: we return a JS Array of _SVGTransforms instead of an 
  // SVGAnimatedTransformList as dictated by the SVG 1.1 standard
  _getTransform: function() /* readonly; returns Array */ {},
  
  // SVGFitToViewBox
  // Note: only supported for root SVG element for now
  _getViewBox: function() { /* readonly; SVGRect */
    // Note: We return an _SVGRect instead of an SVGAnimatedRect as dictated
    // by the SVG 1.1 standard
  },
  
  // SVGElement
  _getId: function() {
    // note: all attribute names are prefixed with _ to prevent attribute names
    // starting numbers from being interpreted as array indexes
    return this._attributes['_id'];
  },
  
  _setId: function(id) {
    return this.setAttribute('id', id);
  },
  
  ownerSVGElement: null, /* Note: technically readonly */
  
  // not supported: xmlbase, viewportElement
  
  // SVGSVGElement and SVGUseElement readonly
  
  _getX: function() { /* SVGAnimatedLength */
    var value = this._trimMeasurement(this.getAttribute('x'));
    return new _SVGAnimatedLength(new _SVGLength(new Number(value)));
  },
  
  _getY: function() { /* SVGAnimatedLength */
    var value = this._trimMeasurement(this.getAttribute('y'));
    return new _SVGAnimatedLength(new _SVGLength(new Number(value)));
  },
  
  _getWidth: function() { /* SVGAnimatedLength */
    var value = this._trimMeasurement(this.getAttribute('width'));
    return new _SVGAnimatedLength(new _SVGLength(new Number(value)));
  },
  
  _getHeight: function() { /* SVGAnimatedLength */
    var value = this._trimMeasurement(this.getAttribute('height'));
    return new _SVGAnimatedLength(new _SVGLength(new Number(value)));
  },
  
  /** Extracts the unit value and trims off the measurement type. For example, 
      if you pass in 14px, this method will return 14. Null will return null. */
  _trimMeasurement: function(value) {
    if (value != null) {
      value = value.replace(/[a-z]/gi, '');
    }
    return value;
  },
  
  // many attributes and methods from these two interfaces not here
  
  // defacto non-standard attributes
  
  _getInnerHTML: function() {
    // TODO
    return 'foo';
  },
  
  _setInnerHTML: function(newValue) {
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
  _allEvents: [
    'onfocusin', 'onfocusout', 'onactivate', 'onclick', 'onmousedown',
    'onmouseup', 'onmouseover', 'onmousemove', 'onmouseout', 'onload',
    'onunload', 'onabort', 'onerror', 'onresize', 'onscroll', 'onzoom',
    'onbegin', 'onend', 'onrepeat'
  ],
  
  _handleEvent: function(evt) {
    // called from the IE HTC when an event is fired, as well as from
    // one of our getter/setters for non-IE browsers
  },
  
  _prepareEvents: function() {
    // for non-IE browsers, make the getter/setter magic using the
    // _allEvents array
  },
  
  // SVGTests, SVGLangSpace, SVGExternalResourcesRequired
  // not supported
  
  // contains any attribute set with setAttribute; object literal of
  // name/value pairs
  _attributes: null,
  
  // copies the attributes from the XML DOM node into target
  _importAttributes: function(target, nodeXML) {
    for (var i = 0; i < nodeXML.attributes.length; i++) {
      var attr = nodeXML.attributes[i];
      this._attributes['_' + attr.nodeName] = attr.nodeValue;
    }
  },
  
  /** Does all the getter/setter magic for attributes, so that external
      callers can do something like myElement.innerHTML = 'foobar' or
      myElement.id = 'test' and our getters and setters will intercept
      these to do the correct behavior with the Flash viewer.*/
  _defineAccessors: function() {
    var props;
    
    // innerHTML
    var self = this;
    this.__defineGetter__('innerHTML', function() {
      return self._getInnerHTML();
    });
    this.__defineSetter__('innerHTML', function(newValue) {
      return self._setInnerHTML(newValue);
    });
    
    // SVGSVGElement and SVGUseElement readyonly props
    if (this.nodeName == 'svg' || this.nodeName == 'use') {
      this.__defineGetter__('x', function() { return self._getX(); });
      this.__defineGetter__('y', function() { return self._getY(); });
      this.__defineGetter__('width', function() { return self._getWidth(); });
      this.__defineGetter__('height', function() { return self._getHeight(); });
    }
    
    // read/write props
    var props = ['id'];
    
    // make getters for each property
    for (var i = 0; i < props.length; i++) {
      this._defineAccessor(props[i], true);  
    }
  },
  
  /** @param prop String property name, such as 'x'.
      @param readWrite Boolean on whether the property is both read and write;
      if false then read only. */
  _defineAccessor: function(prop, readWrite) {
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


/** Not an official DOM interface; used so that we can track changes to
    the CSS style property of an Element
    @param element The _Element that this Style is attached to. */
function _Style(element) {
  this._element = element;
  this._setup();
}

// we use this array to build up getters and setters to watch any changes for
// any of these styles. Note: Technically we shouldn't have all of these for
// every element, since some SVG elements won't have specific kinds of
// style properties, like the DESC element having a font-size.
// TODO: Gauge the performance impact of making this dynamic
_Style._allStyles = [
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

extend(_Style, {
  /** Flag that indicates that the HTC should ignore any property changes
      due to style changes. Used when we are internally making style changes. */
  _ignoreStyleChanges: true,
  
  /** Called when a style change has occurred; called from the Internet
      Explorer HTC. */
  _styleChange: function(styleName, styleValue) {
    return this._setStyleAttribute(styleName, styleValue);
  },
  
  /** Initializes our magic getters and setters for non-IE browsers. For IE
      we set our initial style values on the HTC. */
  _setup: function() {
    // Handle an edge-condition: the SVG spec requires us to support
    // style="" strings that might have uppercase style names, measurements,
    // etc. Normalize these here before continuing.
    this._normalizeStyle();
    
    // now handle browser-specific initialization
    if (!isIE) {
      // setup getter/setter magic for non-IE browsers
      for (var i = 0; i < _Style._allStyles.length; i++) {
        var styleName = _Style._allStyles[i];
        this._defineAccessor(styleName);
      }
      
      // CSSStyleDeclaration properties
      this.__defineGetter__('length', hitch(this, this._getLength));
    } else { // Internet Explorer setup
      var htcStyle = this._element._htcNode.style;
      
      // NOTE: as we manipulate the HTC's style object below, onpropertychange
      // events will fire each time. We want to ignore this. However, we
      // can't use our this._ignoreStyleChange property here because we
      // are run as part of our _Style constructor, and we won't exist yet
      // when viewed from the HTC's propertyChange() method! Just check there
      // for the lack of a _Style instance.
      
      // parse style string
      var parsedStyle = this._fromStyleString();
      
      // loop through each one, setting it on our HTC's style object
      for (var i = 0; i < parsedStyle.length; i++) {
        var styleName = this._toCamelCase(parsedStyle[i].styleName);
        var styleValue = parsedStyle[i].styleValue;
        htcStyle[styleName] = styleValue;
      }
      
      // set initial values for style.length
      htcStyle.length = 0;
      
      // expose .length property on our custom _Style object to aid it 
      // being used internally
      this.length = 0;
      
      // set CSSStyleDeclaration methods to our implementation
      htcStyle.item = hitch(this, this.item);
      htcStyle.setProperty = hitch(this, this.setProperty);
      htcStyle.getPropertyValue = hitch(this, this.getPropertyValue);
    }
  },
  
  /** Defines the getter and setter for a single style, such as 'display'. */
  _defineAccessor: function(styleName) {
    var self = this;
    
    this.__defineGetter__(styleName, function() {
      return self._getStyleAttribute(styleName);
    });
    
    this.__defineSetter__(styleName, function(styleValue) {
      return self._setStyleAttribute(styleName, styleValue);
    });
  },
  
  _setStyleAttribute: function(styleName, styleValue) {
    //console.log('setStyleAttribute, styleName='+styleName+', styleValue='+styleValue);
    // Note: .style values and XML attributes have separate values. The XML
    // attributes always have precedence over any style values.
    
    // convert camel casing (i.e. strokeWidth becomes stroke-width)
    var stylePropName = this._fromCamelCase(styleName);
    
    // change our XML style string value
    
    // parse style string first
    var parsedStyle = this._fromStyleString();
    
    // is our style name there?
    var foundStyle = false;
    for (var i = 0; i < parsedStyle.length; i++) {
      if (parsedStyle[i].styleName === stylePropName) {
        parsedStyle[i].styleValue = styleValue;
        foundStyle = true;
        break;
      }
    }
    
    // if we didn't find it above add it
    if (!foundStyle) {
      parsedStyle.push({ styleName: stylePropName, styleValue: styleValue });
    }
    
    // now turn the style back into a string and set it on our XML and
    // internal list of attribute values
    var styleString = this._toStyleString(parsedStyle);
    this._element._nodeXML.setAttribute('style', styleString);
    this._element._attributes['_style'] = styleString;
    
    // for IE, update our HTC style object; we can't do magic getters for 
    // those so have to update and cache the values
    if (isIE) {
      var htcStyle = this._element._htcNode.style;
      
      // never seen before; bump our style length
      if (!foundStyle) {
        htcStyle.length++;
        this.length++;
      }
      
      // update style value on HTC node so that when the value is fetched
      // it is correct; ignoreStyleChanges during this or we will get into
      // an infinite loop
      this._ignoreStyleChanges = true;
      htcStyle[styleName] = styleValue;
      this._ignoreStyleChanges = false;
    }
    
    // tell Flash about the change
    if (this._element._attached && this._element._passThrough) {
      this._element._handler.sendToFlash({ 
                                  type: 'invoke', 
                                  method: 'setAttribute',
                                  elementId: this._element._getId(),
                                  applyToStyle: true,
                                  attrName: stylePropName, 
                                  attrValue: styleValue });
    }
  },
  
  _getStyleAttribute: function(styleName) {
    //console.log('getStyleAttribute, styleName='+styleName);
    // convert camel casing (i.e. strokeWidth becomes stroke-width)
    var stylePropName = this._fromCamelCase(styleName);
    
    if (this._element._attached && this._element._passThrough) {
      var returnMsg = this._element._handler.sendToFlash({ 
                                              type: 'invoke', 
                                              method: 'getAttribute',
                                              elementId: this._element._getId(),
                                              getFromStyle: true,
                                              attrName: stylePropName });
      if (!returnMsg) {
         return null;
      }

      return returnMsg.attrValue;
    } else {
      // not attached yet; have to parse it from our local value
      var parsedStyle = this._fromStyleString();

      for (var i = 0; i < parsedStyle.length; i++) {
        if (parsedStyle[i].styleName === stylePropName) {
          return parsedStyle[i].styleValue;
        }
      }
      
      return null;
    }
  },
  
  /** Parses our style string into an array, where each array entry is an
      object literal with the 'styleName' and 'styleValue', such as:
      
      results[0].styleName
      results[0].styleValue
      etc. 
      
      If there are no results an empty array is returned. */
  _fromStyleString: function() {
    var styleValue = this._element._nodeXML.getAttribute('style');
    
    if (styleValue == null || styleValue == undefined) {
      return [];
    }
    
    var baseStyles;
    if (styleValue.indexOf(';') == -1) {
      // only one style value given, with no trailing semicolon
      baseStyles = [ styleValue ];
    } else {
      baseStyles = styleValue.split(/\s*;\s*/);
      // last style is empty due to split()
      if (!baseStyles[baseStyles.length - 1]) {
        baseStyles = baseStyles.slice(0, baseStyles.length - 1);
      }
    }
    
    var results = [];
    for (var i = 0; i < baseStyles.length; i++) {
      var style = baseStyles[i];
      var styleSet = style.split(':');
      if (styleSet.length == 2) {
        var attrName = styleSet[0];
        var attrValue = styleSet[1];
        
        // trim leading whitespace
        attrName = attrName.replace(/^\s+/, '');
        attrValue = attrValue.replace(/^\s+/, '');
        
        var entry = { styleName: attrName, styleValue: attrValue };
        results.push(entry);
      }
    }
    
    return results;
  },
  
  /** Turns a parsed style into a string.
  
      @param parsedStyle An array where each entry is an object literal
      with two values, 'styleName' and 'styleValue'. Uses same data structure
      returned from fromStyleString() method above. */
  _toStyleString: function(parsedStyle) {
    var results = '';
    for (var i = 0; i < parsedStyle.length; i++) {
      results += parsedStyle[i].styleName + ': ';
      results += parsedStyle[i].styleValue + ';';
      if (i != (parsedStyle.length - 1)) {
        results += ' ';
      }
    }
    
    return results;
  },
  
  /** Transforms a camel case style name, such as strokeWidth, into it's
      dash equivalent, such as stroke-width. */
  _fromCamelCase: function(styleName) {
    return styleName.replace(/([A-Z])/g, '-$1').toLowerCase();
  },
  
  /** Transforms a dash style name, such as stroke-width, into it's 
      camel case equivalent, such as strokeWidth. */
  _toCamelCase: function(stylePropName) {
    if (stylePropName.indexOf('-') == -1) {
      return stylePropName;
    }
    
    var results = '';
    var sections = stylePropName.split('-');
    results += sections[0];
    for (var i = 1; i < sections.length; i++) {
      results += sections[i].charAt(0).toUpperCase() + sections[i].substring(1);
    }
    
    return results;
  },
  
  // CSSStyleDeclaration interface methods and properties
  
  // TODO: removeProperty not supported yet
  
  setProperty: function(stylePropName, styleValue, priority) {
    // TODO: priority not supported for now; not sure if it even makes
    // sense in this context
    
    // convert from dash style to camel casing (i.e. stroke-width becomes
    // strokeWidth
    var styleName = this._toCamelCase(stylePropName);
    
    this._setStyleAttribute(styleName, styleValue);
    return styleValue;
  },
  
  getPropertyValue: function(stylePropName) {
    // convert from dash style to camel casing (i.e. stroke-width becomes
    // strokeWidth
    var styleName = this._toCamelCase(stylePropName);
    
    return this._getStyleAttribute(styleName);
  },
  
  item: function(index) {
    // parse style string
    var parsedStyle = this._fromStyleString();
    
    // TODO: Throw exception if index is greater than length of style rules
    
    return parsedStyle[index].styleName;
  },
  
  // NOTE: We don't support cssText for now. The reason why is that
  // IE has a style.cssText property already on our HTC nodes. This
  // property incorrectly includes some of our custom internal code,
  // such as 'length' as well as both versions of certain camel cased
  // properties (like stroke-width and strokeWidth). There is no way 
  // currently known to work around this. The property is not that important
  // anyway so it won't currently be supported.
  
  _getLength: function() {
    // parse style string
    var parsedStyle = this._fromStyleString();
    return parsedStyle.length;
  },
  
  /** Handles an edge-condition: the SVG spec requires us to support
      style="" strings that might have uppercase style names, measurements,
      etc. We normalize these to lower-case in this method. */
  _normalizeStyle: function() {
    // style="" attribute?
    // NOTE: IE doesn't support nodeXML.hasAttribute()
    if (!this._element._nodeXML.getAttribute('style')) {
      return;
    }
    
    // no uppercase letters?
    if (!/[A-Z]/.test(this._element._nodeXML.getAttribute('style'))) {
      return;
    }
    
    // parse style into it's components
    var parsedStyle = this._fromStyleString();
    for (var i = 0; i < parsedStyle.length; i++) {
      parsedStyle[i].styleName = parsedStyle[i].styleName.toLowerCase();
      
      // don't lowercase url() values
      if (parsedStyle[i].styleValue.indexOf('url(') == -1) {
        parsedStyle[i].styleValue = parsedStyle[i].styleValue.toLowerCase();
      }
    }
    
    // turn back into a string
    var results = '';
    for (var i = 0; i < parsedStyle.length; i++) {
      results += parsedStyle[i].styleName + ': ' 
                 + parsedStyle[i].styleValue + '; ';
    }
    
    // remove trailing space
    if (results.charAt(results.length - 1) == ' ') {
      results = results.substring(0, results.length - 1);
    }
    
    // have the element tell Flash about the change if we are attached
    this._element.setAttribute('style', results);
  }
});


/** SVG Root element.

    @param nodeXML A parsed XML node object that is the SVG root node.
    @param svgString The full SVG as a string.
    @param scriptNode The script node that contains this SVG. 
    @param handler The FlashHandler that we are a part of. */
function _SVGSVGElement(nodeXML, svgString, scriptNode, handler) {
  // superclass constructor
  _Element.apply(this, ['svg', null, svgns, nodeXML, handler, true]);
  
  this._nodeXML = nodeXML;
  this._svgString = svgString;
  this._scriptNode = scriptNode;
  
  if (isIE) {
    // for IE, replace the SCRIPT tag with our SVG root element; this is so
    // that we can kick off the HTC running so that it can insert our Flash
    // as a shadow DOM
    var svgDOM = document.createElement('svg:svg');
    svgDOM._fakeNode = this;
    svgDOM._handler = handler;
    
    // store the real parentNode and sibling info so we can return it; calling
    // svgDOM.parentNode, for example, would cause us to recursively call our
    // magic parentNode getter instead, so we store this
    svgDOM._realParentNode = scriptNode.parentNode;
    svgDOM._realPreviousSibling = scriptNode.previousSibling;
    svgDOM._realNextSibling = scriptNode.nextSibling;
    
    this._htcNode = svgDOM;
    
    // track .style changes
    this.style = new _Style(this);
    
    // now kick off replacing the SCRIPT node with a Flash object
    scriptNode.parentNode.replaceChild(svgDOM, scriptNode);
    
    // now wait for the HTC file to load for the SVG root element
  } else { // non-IE browsers; immediately insert the Flash
    this._setupFlash(document);
  }
  
  // store in our lookup table for getElementById and 
  // getElementsByTagNameNS
  var elementId = this._nodeXML.getAttribute('id');
  this._handler.document._nodeById['_' + elementId] = this;
}  

// subclasses _Element
_SVGSVGElement.prototype = new _Element;

extend(_SVGSVGElement, {
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
  _onHTCLoaded: function(msg) {
    //console.log('onHTCLoaded, msg=' + this._handler.debugMsg(msg));
    var elemDoc = msg.elemDoc;
    var htcNode = msg.htcNode;
    
    // TODO: We are not handling dynamically created nodes yet
    
    if (htcNode.nodeName.toUpperCase() == 'SVG') {
      this._htcNode = htcNode;
      
      // now insert our Flash
      this._setupFlash(elemDoc, htcNode);
      
      // pay attention to style changes now in the HTC
      this.style._ignoreStyleChanges = false;
    }
  },
  
  /** Called when the Flash SWF file has been loaded. Note that this doesn't
      include the SVG being rendered -- at this point we haven't even
      sent the SVG to the Flash file for rendering yet. */
  _onFlashLoaded: function(msg) {
    // the Flash object is done loading
    //console.log('_onFlashLoaded');
    
    // store a reference to the Flash object so we can send it messages
    if (isIE) {
      this._handler.flash = this._htcNode._getFlashObj();
      this._htcNode._makeFlashCallable(this._handler.flash);
    } else {
      this._handler.flash = document.getElementById(this._handler.flashID);
    }
    
    // send the SVG over to Flash now
    this._handler.sendToFlash({type: 'load', sourceType: 'string',
                               svgString: this._svgString});
  },
  
  /** The Flash is finished rendering. */
  _onRenderingFinished: function(msg) {
    //console.log('onRenderingFinished');
    var elementId = this._nodeXML.getAttribute('id');
    this._handler.fireOnLoad(elementId, 'script');
  },
  
  _setupFlash: function(doc, htcNode) {
    // get the size and background color information
    var size = this._determineSize();  
    var background = this._determineBackground();
    var style = this._determineStyle();
    
    // get a Flash object and insert it into our document
    var flash = this._createFlash(size, background, style, doc);
    if (isIE) {
      // have the HTC node insert the actual Flash so that it gets
      // hidden in the HTC's shadow DOM
      htcNode._insertFlash(flash, style);
    } else {
      this._insertFlash(flash);
    }
    
    // wait for the Flash file to finish loading
  },
  
  /** Inserts the Flash object into the page for all non-IE browsers.
  
      @param flash Flash HTML string.
      
      @returns The Flash DOM object. */
  _insertFlash: function(flash) {
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
    this._scriptNode.parentNode.replaceChild(flashObj, this._scriptNode);
    
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
  
  /** Determines a width and height for the parsed SVG XML. Returns an
      object literal with two values, width and height. */
  _determineSize: function() {
    var width = '100%', height = '100%';
    
    // explicit width and height set
    if (this._nodeXML.getAttribute('width')) {
      width = this._nodeXML.getAttribute('width');
    }
    
    if (this._nodeXML.getAttribute('height')) {
      height = this._nodeXML.getAttribute('height');
    }
    
    // both explicit width and height set; we are done
    if (this._nodeXML.getAttribute('width') && this._nodeXML.getAttribute('height')) {
      return {width: width, height: height};
    }
    
    // viewBox
    if (this._nodeXML.getAttribute('viewBox')) {
      var viewBox = this._nodeXML.getAttribute('viewBox').split(/\s+|,/);
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
  _determineBackground: function() {
    var transparent = false;
    var color = null;
    
    // NOTE: CSS 2.1 spec says background does not get inherited, and we don't
    // support external CSS style rules for now; we also only support
    // 'background-color' property and not 'background' CSS property for
    // setting the background color.
    var style = this._nodeXML.getAttribute('style');
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
  _determineStyle: function() {
    var style = this._nodeXML.getAttribute('style');
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
  _createFlash: function(size, background, style, doc) {
    var elementId = this._nodeXML.getAttribute('id');
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
    
    this._handler.flashID = elementId + '_flash';

    var flash =
          '<object\n '
            + 'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"\n '
            + 'codebase="'
            + protocol
            + '://fpdownload.macromedia.com/pub/shockwave/cabs/flash/'
            + 'swflash.cab#version=9,0,0,0"\n '
            + 'width="' + size.width + '"\n '
            + 'height="' + size.height + '"\n '
            + 'id="' + this._handler.flashID + '"\n '
            + 'name="' + this._handler.flashID + '"\n '
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
              + 'id="' + this._handler.flashID + '" '
              + 'name="' + this._handler.flashID + '" '
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
function _Document(xml, handler) {
  // superclass constructor
  _Node.apply(this, ['#document', _Node.DOCUMENT_NODE, null, null, 
                     xml, handler], svgns);
  
  this._xml = xml;
  this._handler = handler;
  this._nodeById = {};
  this._namespaces = this._getNamespaces();
  this.implementation = new _DOMImplementation();
}

// subclasses _Node
_Document.prototype = new _Node;

extend(_Document, {
  /** Stores a lookup from a node's ID to it's _Element or _Node 
      representation. An object literal. */
  _nodeById: null,
  
  /*
    Note: technically these 2 properties should be read-only and throw 
    a _DOMException when set. For simplicity we make them simple JS
    properties; if set, nothing will happen. Also note that we don't
    support the 'doctype' property.
  */
  implementation: null,
  documentElement: null,
  
  createElementNS: function(ns, qName) /* _Element */ {
    // TODO; this is for object tags
  },
  
  createTextNode: function(text /* DOM Text Node */) /* _Node */ {
    // TODO; this is for object tags
  },
  
  getElementById: function(id) /* _Element */ {
    // XML parser does not have getElementById, due to id mapping in XML
    // issues; use XPath instead
    var results = xpath(this._xml, null, '//*[@id="' + id + '"]');
    var nodeXML, node;
    
    if (results.length) {
      nodeXML = results[0];
    } else {
      return null;
    }
    
    // create or get an _Element for this XML DOM node for node
    return this._getNode(nodeXML);
  },
  
  /** NOTE: on IE we don't support calls like the following:
      getElementsByTagNameNS(*, 'someTag');
      
      We do support:
      getElementsByTagNameNS('*', '*');
      getElementsByTagNameNS('someNameSpace', '*');
      getElementsByTagNameNS(null, 'someTag');
  */
  getElementsByTagNameNS: function(ns, localName) /* _NodeList of _Elements */ {
    var results = createNodeList();
    var matches;
    // DOM Level 2 spec details:
    // if ns is null or '', return elements that have no namespace
    // if ns is '*', match all namespaces
    // if localName is '*', match all tags in the given namespace
    if (ns == '') {
      ns = null;
    }

    // get DOM nodes with the given tag name
    if (this._xml.getElementsByTagNameNS) { // non-IE browsers
      results = this._xml.getElementsByTagNameNS(ns, localName);
    } else { // IE
      if (ns == null) {
        // we can't just use getElementsByTagName() here, because IE
        // will incorrectly return tags that are in the default namespace
        results = xpath(this._xml, null, '//' + localName);
      } else {
        // figure out correct query string for IE
        var query;
        if (ns == '*' && localName == '*') {
          query = '*';
        } else if (ns == '*') { // not supported
          return createNodeList(); // empty []
        } else {
          var prefix = this._namespaces['_' + ns];
          if (prefix == undefined) {
            return createNodeList(); // empty []
          }
          
          if (prefix == undefined) {
            results = createNodeList();
          } else if (prefix == 'xmlns') {
            query = localName;
          } else {
            query = prefix + ':' + localName;
          }
        }
        
        matches = this._xml.getElementsByTagName(query);
        for (var i = 0; i < matches.length; i++) {
          results.push(matches[i]);
        }
      }
    }
    
    // now create or fetch _Elements representing these DOM nodes
    var nodes = createNodeList();
    for (var i = 0; i < results.length; i++) {
      var elem = this._getNode(results[i]);
      nodes.push(elem);
    }
    
    return nodes;
  },
  
  /** Fetches an _Element or _Node or creates a new one on demand.
      
      @param nodeXML XML or HTML DOM node for the element to use when 
      constructing the _Element or _Node.
      
      @returns If IE, returns the HTC proxy for the node (i.e. node._htcNode) so
      that external callers can manipulate it and have getter/setter
      magic happen; if other browsers, returns the _Node or _Element
      itself. */
  _getNode: function(nodeXML) {
    var node;
    
    if (nodeXML.nodeType == _Node.ELEMENT_NODE) {
      // if we've created an _Element for this node before, we
      // stored a reference to it by ID so we could get it later
      node = this._nodeById['_' + nodeXML.getAttribute('id')];
    
      if (!node) {
        // never seen before -- we'll have to create a new _Element now
        node = new _Element(nodeXML.nodeName, nodeXML.prefix, 
                            nodeXML.namespaceURI, nodeXML, this._handler, true);

        // store a reference to ourselves. 
        // unfortunately IE doesn't support 'expandos' on XML parser objects, 
        // so we can't just say nodeXML._fakeNode = node, so we have to use a 
        // lookup table
        var elementId = node._nodeXML.getAttribute('id');
        this._nodeById['_' + elementId] = node;
      }
    } else if (nodeXML.nodeType == _Node.TEXT_NODE) {
      // for all browsers but IE, we have an internal ID for text nodes that
      // we use to refetch and return them if they have been created before;
      // this is because we can set variables on XML text nodes whereas
      // on IE we can't, so we can't track text nodes on IE unfortunately
      node = this._nodeById['_' + nodeXML._textNodeID];
      if (!node) {
        // we always create these on demand since they have no ID to use
        // for caching; unfortunately we can't cache an internal ID
        // on XML text nodes for IE, so we have to just always produce them
        // on demand
        node = new _Node(nodeXML.nodeName, _Node.TEXT_NODE, null, null, nodeXML,
                         this._handler, false);
        node._passThrough = true;
        
        if (!isIE) {
          this._nodeById['_' + node._nodeXML._textNodeID] = node;
        }
      }
    } else {
      throw new Error('Unknown node type given to _getNode: ' 
                      + nodeXML.nodeType);
    }
    
    return node._getProxyNode();
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
  _getNamespaces: function() {
    var results = [];
    
    var attrs = this._xml.documentElement.attributes;
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

function _SVGMatrix(a /** All Numbers */, b, c, d, e, f) {
  this.a = a; this.b = b; this.c = c; this.d = d; this.e = e; this.f = f;
}

extend(_SVGMatrix, {
// all functions return _SVGMatrix

  multiply: function(secondMatrix /* _SVGMatrix */ ) {},
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
function _SVGLength(/* Number */ value) {
  this.value = value;
}


// Note: We only support _SVGAnimatedLength because that is what Firefox
// and Safari return, and we want to have parity. Only baseVal works for now
function _SVGAnimatedLength(/* _SVGLength */ value) {
  this.baseVal = value;
  this.animVal = undefined; // not supported for now
}


function _SVGTransform(type, matrix, angle) {
  this.type = type;
  this.matrix = matrix;
  this.angle = angle;
}

mixin(_SVGTransform, {
  SVG_TRANSFORM_UNKNOWN: 0, SVG_TRANSFORM_MATRIX: 1, SVG_TRANSFORM_TRANSLATE: 2,
  SVG_TRANSFORM_SCALE: 3, SVG_TRANSFORM_ROTATE: 4, SVG_TRANSFORM_SKEWX: 5,
  SVG_TRANSFORM_SKEWY: 6
});

extend(_SVGTransform, {
  // Note: the following 3 should technically be readonly
  type: null, /* one of the constants above */
  matrix: null, /* _SVGMatrix */
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