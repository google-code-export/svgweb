/*
TODO: Figure out the licensing and copyright verbiage up here.
*/

(function(){ // hide everything externally to avoid name collisions
  
  var SVGNS = 'http://www.w3.org/2000/svg';
  
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
  if (typeof console == 'undefined' || !console.debug || !console.log) {
    var queue = [];
    console = {};
    console.debug = console.log = function(msg) {
      var body = null;
      // IE can sometimes throw an exception if document.body is accessed
      // before the document is fully loaded
      try {
        body = document.body;
      } catch (exp) {
        body = null;
      }

      if (!body) {
        queue.push(msg);
        return;
      }
        
      var p;
      while (queue.length) {
        var oldMsg = queue.shift();
        p = document.createElement('p');
        p.appendChild(document.createTextNode(oldMsg));
        document.getElementsByTagName('body')[0].appendChild(p);
      }
      
      // display new message now
      p = document.createElement('p');
      p.className = 'debug-message';
      p.appendChild(document.createTextNode(msg));
      document.getElementsByTagName('body')[0].appendChild(p);
    };
  }
  // end debug output methods


  // process embedded SVG for non-IE browsers that natively support SVG
  // TODO: Test this code on Opera  
  function NativeSVG() {
    console.log('NativeSVG constructor');
    // data structure representing SVG we can work with for _processSVG()
    this._SVG = {
      // SVG 1.1 + id + class + opacity + offset + style + some of 
      // Mark Ruby's original list
      prefix: 'svg',
      root: 'svg:svg',
      ns: SVGNS,
      elements: ['a', 'altGlyph', 'altGlyphDef', 'altGlyphItem', 'animate', 
          'animateColor', 'animateMotion', 'animateTransform', 'circle', 
          'clipPath', 'color-profile', 'cursor', 'definition-src', 'defs', 
          'desc', 'ellipse', 'feBlend', 'feColorMatrix', 'feComponentTransfer', 
          'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 
          'feDisplacementMap', 'feDistantLight', 'feFlood', 'feFuncA', 
          'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 
          'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight', 
          'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence', 
          'filter', 'font', 'font-face', 'font-face-format', 'font-face-name', 
          'font-face-src', 'font-face-uri', 'foreignObject', 'g', 'glyph', 
          'glyphRef', 'hkern', 'image', 'line', 'linearGradient', 'marker', 
          'mask', 'metadata', 'missing-glyph', 'mpath', 'path', 'pattern', 
          'polygon', 'polyline', 'radialGradient', 'rect', 'script', 'set', 
          'stop', 'style', 'switch', 'symbol', 'text', 'textPath', 'title', 
          'tref', 'tspan', 'use', 'view', 'vkern'],
      attributes: ['accent-height', 'accumulate', 'additive', 
          'alignment-baseline', 'alphabetic', 'amplitude', 'animate', 
          'arabic-form', 'ascent', 'attributeName', 'attributeType', 
          'azimuth', 'baseFrequency', 'baseline-shift', 'baseProfile', 
          'bbox', 'begin', 'bias', 'by', 'calcMode', 'cap-height', 'class', 
          'clip', 'clip-path', 'clip-rule', 'clipPathUnits', 'color', 
          'color-interpolation', 'color-interpolation-filters', 
          'color-profile', 'color-rendering', 'content', 'contentScriptType', 
          'contentStyleType', 'cursor', 'cx', 'cy', 'd', 'descent', 
          'diffuseConstant', 'direction', 'display', 'divisor', 
          'dominant-baseline', 'dur', 'dx', 'dy', 'edgeMode', 'elevation', 
          'enable-background', 'end', 'exponent', 'externalResourcesRequired', 
          'feColorMatrix', 'feComposite', 'feGaussianBlur', 'feMorphology', 
          'feTile', 'fill', 'fill-opacity', 'fill-rule', 'filter', 'filterRes', 
          'filterUnits', 'flood-color', 'flood-opacity', 'font-family', 
          'font-size', 'font-size-adjust', 'font-stretch', 'font-style', 
          'font-variant', 'font-weight', 'format', 'from', 'fx', 'fy', 'g1', 
          'g2', 'glyph-name', 'glyph-orientation-horizontal', 
          'glyph-orientation-vertical', 'glyphRef', 'gradientTransform', 
          'gradientUnits', 'hanging', 'height', 'horiz-adv-x', 
          'horiz-origin-x', 'horiz-origin-y', 'id', 'ideographic', 
          'image-rendering', 'in', 'in2', 'intercept', 'k', 'k1', 'k2', 'k3', 
          'k4', 'kernelMatrix', 'kernelUnitLength', 'kerning', 'keyPoints', 
          'keySplines', 'keyTimes', 'lang', 'lengthAdjust', 'letter-spacing', 
          'lighting-color', 'limitingConeAngle', 'local', 'marker-end', 
          'marker-mid', 'marker-start', 'markerHeight', 'markerUnits', 
          'markerWidth', 'mask', 'maskContentUnits', 'maskUnits', 
          'mathematical', 'max', 'media', 'method', 'min', 'mode', 
          'name', 'numOctaves', 'offset', 'onabort', 'onactivate', 'onbegin', 
          'onclick', 'onend', 'onerror', 'onfocusin', 'onfocusout', 'onload', 
          'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 
          'onmouseup', 'onrepeat', 'onresize', 'onscroll', 'onunload', 
          'onzoom', 'opacity', 'opacity', 'operator', 'order', 'orient', 
          'orientation', 'origin', 'overflow', 'overline-position', 
          'overline-thickness', 'panose-1', 'path', 'pathLength', 
          'patternContentUnits', 'patternTransform', 'patternUnits', 
          'pointer-events', 'points', 'pointsAtX', 'pointsAtY', 'pointsAtZ', 
          'preserveAlpha', 'preserveAspectRatio', 'primitiveUnits', 'r', 
          'radius', 'refX', 'refY', 'rendering-intent', 'repeatCount', 
          'repeatDur', 'requiredExtensions', 'requiredFeatures', 'restart', 
          'result', 'rotate', 'rx', 'ry', 'scale', 'seed', 'shape-rendering', 
          'slope', 'spacing', 'specularConstant', 'specularExponent', 
          'spreadMethod', 'startOffset', 'stdDeviation', 'stemh', 'stemv', 
          'stitchTiles', 'stop-color', 'stop-opacity', 'strikethrough-position', 
          'strikethrough-thickness', 'stroke', 'stroke-dasharray', 
          'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 
          'stroke-miterlimit', 'stroke-opacity', 'stroke-width', 'style', 
          'surfaceScale', 'systemLanguage', 'tableValues', 'target', 'targetX', 
          'targetY', 'text-anchor', 'text-decoration', 'text-rendering', 
          'textLength', 'title', 'to', 'transform', 'type', 'u1', 'u2', 
          'underline-position', 'underline-thickness', 'unicode', 
          'unicode-bidi', 'unicode-range', 'units-per-em', 'v-alphabetic', 
          'v-hanging', 'v-ideographic', 'v-mathematical', 'values', 
          'version', 'vert-adv-y', 'vert-origin-x', 'vert-origin-y', 
          'viewBox', 'viewTarget', 'visibility', 'width', 'widths', 
          'word-spacing', 'writing-mode', 'x', 'x-height', 'x1', 'x2', 
          'xChannelSelector', 'y', 'y1', 'y2', 'yChannelSelector', 'z', 
          'zoomAndPan']
    };
  
    // we want to intercept any window.onload or body.onload handlers that
    // were set by developers to ensure they are called _after_ the SVG
    // is finished loading
    this._origOnLoad = null;
    var self = this;
    // DOMContentLoaded supported on Opera 9/Mozilla/Safari 3
    document.addEventListener('DOMContentLoaded', function() {
      self._domContentLoaded();
    }, false);
  }

  NativeSVG.prototype._domContentLoaded = function() { 
    // adapted from Dean Edwards/Matthias Miller/John Resig/others
    // onDOMContentLoaded work
    // quit if this function has already been called
    console.log('domContentLoaded');
    if (arguments.callee.done) {
      return;
    }

    // flag this function so we don't do the same thing twice
    arguments.callee.done = true;
    
    // listen for dynamically created SVG roots
    this._handleDynamicSVG();
    
    // do we even have any SVG? if not then we are done.
    // At this point the SVG tags aren't 'recognized' as being in the
    // SVG namespace, so we have to use getElementsByTagName and
    // not getElementsByTagNameNS
    var svg = document.getElementsByTagName('svg:svg');
    if (!svg.length) {
      return;
    }
    
    // save a reference to the original window.onload or body.onload
    if (window.onload) {
      this._origOnLoad = window.onload;
      window.onload = null;
    } else {
      var body = document.body;
      var f = body.getAttribute('onload');
      if (f !== null && f !== undefined) {
        this._origOnLoad = function() { eval(f); };
        body.onload = null;
      }
    }

    this._processSVG();
  }

  // Functions to embed SVG into normal text/html rather than
  // XHTML, originally created by Sam Ruby and further adapted for 
  // Safari as well as modified to have the embedded SVG work in a 
  // way that operates in Internet Explorer
  NativeSVG.prototype._processSVG = function() {
    console.log('processSVG');
    // copy modules into their appropriate namespaces
    var modules = [this._SVG];
    var i, j;
    var handle = [];
    
    for (i = 0; i < modules.length; i++) {
      var module = modules[i];
      var roots = document.getElementsByTagName(module.root);
      for (j = 0; j < roots.length; j++) {
        handle.push(roots[j]);
      }
      for (j = 0; j < handle.length; j++) {
        var source = handle[j];
        var proto = source.__proto__
        if (document.createElementNS) {
          // detect if this is an HTML element; if so, move on
          if (typeof HTMLUnknownElement != 'undefined') { // FF
            if (proto != HTMLUnknownElement.prototype) {
              continue;
            }
          } else if (typeof proto) { // Safari
            // as far as I can tell, all HTML elements subclass HTMLElementPrototype
            // (such as H1, which is HTMLHeadingElementPrototype); SVG tags
            // just have the top-level class.
            // TODO: Test this more to ensure its always true.
            if (proto && String(proto).indexOf('HTMLElementPrototype') == -1) {
              continue;
            }
          }
      
          var dest = document.createElementNS(module.ns, module.root);
          
          this._deepcopy(module, source, dest, {});
          source.parentNode.insertBefore(dest, source);
          source.parentNode.removeChild(source);
        }
      } 
    } // end iterating through modules
    
    // fire that we are done loading
    if (this._origOnLoad) { // window.onload and body.onload
      this._origOnLoad();
    }
    
    // any event listeners registered with addEventListener will get
    // called automatically, but not on Safari
    if (isSafari) {
      var rootNodes = document.getElementsByTagNameNS(SVGNS, 'svg');
      for (i = 0; i < rootNodes.length; i++) {
        // doesn't work unfortunately
        //var evt = document.createEvent('SVGEvents');
        //evt.initEvent('SVGLoad', false, false);
        //rootNodes[i].dispatchEvent(evt);
        if (rootNodes[i].getAttribute('onload')) {
          eval(rootNodes[i].getAttribute('onload'));
        }
      }
    }
  }

  // clone a DOM subtree
  NativeSVG.prototype._deepcopy = function(module, source, dest, nsmap) {
    var i, j;
 
    // copy attributes
    for (i = 0; i < source.attributes.length; i++) {
      var oldattr = source.attributes[i];
      var colon = oldattr.name.indexOf(':');
      if (colon == -1) {
        for (j = 0; j < module.attributes.length; j++) {
          if (module.attributes[j].toLowerCase() != oldattr.name) {
            continue;
          }
          dest.setAttribute(module.attributes[j], oldattr.value);
          break;
        }
      } else { // namespace prefixed attribute
        var prefix = oldattr.name.slice(0, colon);
        var name = oldattr.name.slice(colon + 1);
        if (prefix == 'xmlns') {
          // TODO: FIXME: Nested namespace declarations in child nodes
          // will improperly be exposed to parent nodes
          nsmap[name] = oldattr.value;
        } else {
          for (ns in nsmap) {
            if (ns == prefix) {
              dest.setAttributeNS(nsmap[prefix], name, oldattr.value);
            }
          }
        }
      }
    } // end for()

    // copy children
    var newchild;
    for (i = 0; i < source.childNodes.length; i++) {
      var oldchild = source.childNodes[i];
      if (oldchild.nodeType == 1) { // element
        for (j = 0; j < module.elements.length; j++) {
          var oldName = oldchild.nodeName.toUpperCase();
          if (oldName.indexOf(module.prefix.toUpperCase()) == -1) {
            continue;
          }
          oldName = oldName.replace(module.prefix.toUpperCase() + ':', '');
          if (module.elements[j].toUpperCase() != oldName) {
            continue;
          }
          newchild = document.createElementNS(module.ns, 
                                              module.elements[j]);
          this._deepcopy(module, oldchild, newchild, nsmap);
          dest.appendChild(newchild);
          break;
        }
      } else if (oldchild.nodeType == 3) { // text
        // trim empty text nodes so that the DOMs on FF/Safari and
        // Internet Explorer are more similar
        if (/^\s*$/.test(oldchild.nodeValue)) {
          continue;
        }
        newchild = document.createTextNode(oldchild.nodeValue);
        dest.appendChild(newchild);
      }
    }
  } // end function deepcopy
  
  NativeSVG.prototype._handleDynamicSVG = function() {
    var body = document.getElementsByTagName('body')[0];
    body.addEventListener('DOMNodeInserted', function(evt) {
      var node = evt.relatedNode;
      if (!node._onloadFired
            && node.nodeType == 1 
            && node.namespaceURI == 'http://www.w3.org/2000/svg'
            && node.nodeName == 'svg') {
        evt = document.createEvent('SVGEvents');
        evt.initEvent('SVGLoad', false, false);
        node.dispatchEvent(evt);
        return;
      }
      
      var rootNodes = node.getElementsByTagNameNS(SVGNS, 'svg');
      for (var i = 0; i < rootNodes.length; i++) {
        if (rootNodes[i]._onloadFired) {
          continue;
        }
        
        evt = document.createEvent('SVGEvents');
        evt.initEvent('SVGLoad', false, false);
        rootNodes[i]._onloadFired = true;
        rootNodes[i].dispatchEvent(evt);
      }
    }, false);
  }


  // handle IE by using a Flash renderer
  function FlashSVG() {
    console.log('FlashSVG constructor');
    this._svgLoaded = 0;
    this._pageLoadFinished = false;
    this._origOnLoad = function(){};
    
    // determine the path to our HTC and Flash files
    this._libraryPath = './';
    var scripts = document.getElementsByTagName('script');
    for (var i = 0; i < scripts.length; i++) {
      if (scripts[i].src.indexOf('svg.js') != -1 
          && scripts[i].getAttribute('data-path')) {
        this._libraryPath = scripts[i].getAttribute('data-path');
        break;
      }
    }
    if (this._libraryPath.charAt(this._libraryPath.length - 1) != '/') {
      this._libraryPath += '/';
    }
    // in some cases due to caching behavior the HTC file will load 
    // before we can set the libraryPath on it; expose this on the window 
    // object so the HTC file can access it
    window.__svg__libraryPath = this._libraryPath;

    this._patchIE();
    this._exportFlashMethods();
    this._prepareBehavior();
    this._initDomContentLoaded();
  }
  
  FlashSVG.prototype._onMessage = function(flashMsg) {
    console.log('onMessage, flashMsg='+flashMsg);
    if (flashMsg.type == 'event') {
      this._onEvent(flashMsg);
      return;
    }
    if (flashMsg.type == 'log') {
      this._onLog(flashMsg);
      return;
    }
    // TODO: Bring onScript over from Rick's fork
    if (flashMsg.type == 'script') {
      this._onScript(flashMsg);
      return;
    }
  }
  
  FlashSVG.prototype._onLog = function(flashMsg) {
    console.log('FLASH: ' + flashMsg.logString);
  }
  
  FlashSVG.prototype._onEvent = function(flashMsg) {
      if (flashMsg.eventType == 'onRenderingFinished') {
          this._onRenderingFinished(flashMsg);
          return;
      }
      if (flashMsg.eventType == 'onFlashLoaded') {
          this._onFlashLoaded(flashMsg);
          return;
      }
      if (flashMsg.eventType.substr(0,5) == 'mouse') {
          this._onMouseEvent(flashMsg);
          return;
      }
  }

  FlashSVG.prototype._onFlashLoaded = function(flashMsg) {
    // the Flash object is done loading
    console.log('_onFlashLoaded');
    
    var svgID = flashMsg.uniqueId;
    console.log('svgID='+svgID);
    
    // on IE getting the SVG element by ID sometimes doesn't work based on 
    // caching wierdness (IE has lots of cache bugs). A setTimeout of 1 ms 
    // fixes the issue.
    
    // To reproduce bug: Reload the page to prime the cache. Then, use the
    // enter key on the URL field to reload the page again rather than clicking
    // the reload button. The bug only appears on bouncing.html, which uses
    // a dynamically created SVG root element.
    var self = this;
    window.setTimeout(function() {   
      var svg = document.getElementById(svgID);
      console.log('svg='+svg);
      if (svgID != '__svg__hiddenSVG') {
        svg.processSVG();
      } else {
        // we insert an SVG element into the page in
        // _embedHiddenSVG() if there was no 
        // embedded SVG in the page; this is to force the HTC
        // to be cached and loaded
        var container = document.getElementById('__svg__hiddenSVG_container');
        container.parentNode.removeChild(container);
        self._pageLoadFinished = true;
        self._origOnLoad();
      }
    }, 1);
  }
  
  FlashSVG.prototype._onMouseEvent = function(flashMsg) {
      var element = this.getElementById(flashMsg.elementId);
      // xxx need to compute proper coordinates
      var myEvent = { target: element, 
                      clientX: flashMsg.screenX,
                      clientY: flashMsg.screenY,
                      screenX: flashMsg.screenX,
                      screenY: flashMsg.screenY,
                      preventDefault: function() { this.returnValue=false; }
                    };

      var handlers;
      // TODO: Eliminate having the Flash send over a parentId
      var listeners = element.getListeners(flashMsg.eventType);

      for (var i in listeners) {
        var l = listeners[i];
        l(myEvent);
      }
  }

  /** The Flash is finished rendering. */
  FlashSVG.prototype._onRenderingFinished = function(flashMsg) {
    // the Flash object has finished rendering our embedded SVG
    console.log('_onRenderingFinished');
    
    var svgID = flashMsg.uniqueId;
    console.log('svgID='+svgID);
    
    if (!this._pageLoadFinished) { // are we still loading the page itself?
      this._svgLoaded++; // bump the number of SVG objects that are loaded
      if (this._svgLoaded == document.getElementsByTagName('svg').length) {
        // we were embedded SVG -- we are now 'attached' and can be 
        // manipulated
        if (!this._pageLoadFinished) {
          var svgElems = document.getElementsByTagName('svg');
          for (var i = 0; i < svgElems.length; i++) {
            svgElems[i].setAttached(true, true);
          }
        }
        
        this._pageLoadFinished = true;
        
        // TODO: Integrate Rick's SVG resizing code
        // resize to the <svg> width
        /*console.log("svg w,h=" + flashMsg.width + "," + flashMsg.height);
        if (this.sizeToSVG) {
            if (   (this.flashObj.width != flashMsg.width)
                || (this.flashObj.height != flashMsg.height) ) {
                this.flashObj.parentNode.style.visibility='hidden';
                this.flashObj.width = flashMsg.width;
                this.flashObj.height = flashMsg.height;
                this.width = flashMsg.width;
                this.height = flashMsg.height;
                setTimeout('svgviewer.svgHandlers["' + this.uniqueId + '"].flashObj.parentNode.setStyleAttribute("visibility","visible");', 10);
            }
        }*/
        
        // fire any original window onload listeners that might have been
        // registered
        this._origOnLoad();
        
        // fire any onload listeners that might be on this SVG element itself
        this._fireSVGLoad(svgID);
      }
    } else { // page already loaded; this must be dynamically created SVG
      this._fireSVGLoad(svgID);
    }
    
    // TODO: Integrate executing any script tags from Ricks fork
    /*
    this.svgScript = this.svgScript + flashMsg.onLoad;

    if (isIE) {
        window.execScript(this.svgScript);
    }
    else {
        setTimeout('eval(window.svgviewer.svgHandlers["' + this.uniqueId + '"].svgScript);', 100);
    }*/
  }
  
  FlashSVG.prototype._receiveFromFlash = function(flashMsg) {
    console.log('receiveFromFlash, flashMsg='+flashMsg);
    this._onMessage(flashMsg);
  }

  FlashSVG.prototype._patchIE = function() {
    console.log('patchIE');
    // patch IE to have more standards compliant DOM methods, as well
    // so that we can pass through certain methods into the Flash
    // renderer
    document.createElementNS = function(ns, tagName) {   
      // FIXME: Should I raise an exception if the namespace is not known?
      if (ns == SVGNS) {
        tagName = 'svg:' + tagName;
      }
      
      var node = document.createElement(tagName);
      if (tagName == 'svg:svg') {
        node.libraryPath = this._libraryPath;
      }
      
      return node;
    };
  
    document.getElementsByTagNameNS = function(ns, tagName) {
      // FIXME: Should I raise an exception if the namespace is not known?
      return document.getElementsByTagName(tagName);
    };
  }

  FlashSVG.prototype._exportFlashMethods = function() {
    // expose methods that Flash's ExternalInterface can call; these
    // must be global
    var self = this;
    window.receiveFromFlash = function(flashMsg) {
      self._receiveFromFlash(flashMsg);
    }
  }

  FlashSVG.prototype._prepareBehavior = function() {
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
      ns = document.namespaces.add('svg', SVGNS);
    }
    
    // attach SVG behavior to the page
    ns.doImport(this._libraryPath + 'svg.htc');
  }

  FlashSVG.prototype._initDomContentLoaded = function() {
    console.log('initDomContentLoaded');
    // onDOMContentLoaded code adapted from Dean Edwards/Matthias Miller/
    // John Resig/others
  
    // id is set to be __ie__svg__onload rather than __ie_onload so
    // we don't have name collisions with other scripts using this
    // code as well
    document.write('<script id=__ie__svg__onload defer '
                    + 'src=javascript:void(0)><\/script>');
    var script = document.getElementById('__ie__svg__onload');
    var self = this;
    script.onreadystatechange = function() {
      // changed from 'complete' -- we want to be called _before_ any
      // window.onload is called
      if (this.readyState == 'loaded') { 
        self._domContentLoaded(); // call the onload handler
      }
    };
  }

  FlashSVG.prototype._domContentLoaded = function() {
    console.log('FlashSVG._domContentLoaded');
    // quit if this function has already been called
    if (arguments.callee.done) {
      return;
    }
    
    // flag this function so we don't do the same thing twice
    arguments.callee.done = true;
    
    this._origOnLoad = function() {};
    // save a reference to the original window.onload 
    if (window.onload) {
      this._origOnLoad = window.onload;
      window.onload = null;
    } else if (document.body) { // inline onload handler on BODY tag?
      var body = document.body;
      var f = body.getAttribute('onload');  
      if (f !== null && f !== undefined) {
        this._origOnLoad = function() { eval(f); };
        body.onload = null;
      }
    }
    
    // no embedded SVG?
    var svg = document.getElementsByTagName('svg');
    console.log('svg='+svg);
    if (svg.length === 0) {
      // insert an SVG element into the page to force the 
      // HTC behavior to load
      this._embedHiddenSVG();
    } else {
      for (var i = 0; i < svg.length; i++) {
        svg[i].libraryPath = this._libraryPath;
      }
    }
  }
  
  FlashSVG.prototype._embedHiddenSVG = function() {
    console.log('embedHiddenSVG');
    // container to hide the SVG offscreen
    var div = document.createElement('div');
    div.setAttribute('id', '__svg__hiddenSVG_container');
    div.style.position = 'absolute';
    div.style.top = '-1000px';
    div.style.left = '-1000px';
    
    var svg = document.createElement('svg:svg');
    svg.setAttribute('width', 1);
    svg.setAttribute('height', 1);
    svg.setAttribute('id', '__svg__hiddenSVG');
    svg.libraryPath = this._libraryPath;
    div.appendChild(svg);
    
    var body = document.getElementsByTagName('body')[0];
    body.appendChild(div);
  }
  
  FlashSVG.prototype._fireSVGLoad = function(svgID) {  
    var svg = document.getElementById(svgID);
    // have we already called onload for this element before?
    if (svg._onloadFired) {
      return;
    }
    
    var listeners = svg.getListeners('SVGLoad');
    svg._onloadFired = true;
    for (var i = 0; i < listeners.length; i++) {
      var onload = listeners[i];
      
      if (typeof onload == 'string') {
        eval(onload);
      } else {
        onload();
      }
    }
  }

  var viewer = null;
  if (!isIE) { // Firefox 3/Safari 3/Opera 9
    viewer = new NativeSVG();
  } else { // Internet Explorer
    viewer = new FlashSVG();
  }

// hide internal implementation details inside of a closure
})();