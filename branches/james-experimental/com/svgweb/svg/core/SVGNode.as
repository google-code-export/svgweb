package com.svgweb.svg.core {
	import com.svgweb.svg.nodes.*;
	import com.svgweb.svg.utils.SVGColors;
	import com.svgweb.svg.utils.SVGUnits;
	
	import flash.display.CapsStyle;
	import flash.display.DisplayObject;
	import flash.display.JointStyle;
	import flash.display.LineScaleMode;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.geom.Matrix;
	import flash.utils.getDefinitionByName;
	import flash.utils.getQualifiedClassName;

	public class SVGNode extends Sprite {
		
		public static const ATTRIBUTE_LIST:Array = ['stroke', 'stroke-width', 'stroke-dasharray', 
                                         'stroke-opacity', 'stroke-linecap', 'stroke-linejoin',
                                         'fill', 'fill-opacity', 'opacity', 'stop-color', 'stop-opacity',
                                         'font-family', 'font-size', 'letter-spacing', 'filter', 'visibility'];
                                         
        public static const ATTRIBUTES_NOT_INHERITED:Array = ['x', 'y', 'width', 'height', 'rotate', 'transform', 
                                        'gradientTransform', 'opacity', 'mask', 'clip-path', 'href', 'target'];
                                                 
                                         
		public namespace xlink = 'http://www.w3.org/1999/xlink';
        public namespace svg = 'http://www.w3.org/2000/svg';
		
		public var svgRoot:SVGSVGNode;
				
		//Used for gradients
		public var xMin:Number;
		public var xMax:Number;		
		public var yMin:Number;
        public var yMax:Number;
        
        protected var _firstX:Boolean;
        protected var _firstY:Boolean;
		
		
		protected var _xml:XML;		
		protected var _invalidDisplay:Boolean;
		protected var _id:String = null;
		protected var _graphicsCommands:Array;
		protected var _styles:Object;
		
		public var original:SVGNode;	
		protected var _isClone:Boolean = false;
		
		protected var _clones:Array = new Array();
		
		public function SVGNode(svgRoot:SVGSVGNode, xml:XML = null, original:SVGNode = null) {
			super();
			this.svgRoot = svgRoot;
			this.xml = xml;
			if (original) {
                this.original = original;
                _isClone = true;
            }
			
			this.addEventListener(Event.ADDED_TO_STAGE, onAddedToStage);
			this.addEventListener(Event.REMOVED_FROM_STAGE, onRemovedFromStage);
		}
		
		protected function parseNodes():void {
			
			var childNode:SVGNode;
			var nodeName:String;
			
			for each (var childXML:XML in this._xml.children()) {
				if (childXML.nodeKind() == 'element') {
					childNode = null;
					
					nodeName = childXML.localName().toString().toLowerCase();                
					switch(nodeName) {
		                case "a":
		                    childNode = new SVGANode(this.svgRoot, childXML);
		                    break;
		                case "animate":
		                    //childNode = new SVGAnimateNode(this.svgRoot, childXML);
		                    break;    
		                case "animatemotion":
		                    //childNode = new SVGAnimateMotionNode(this.svgRoot, childXML);
		                    break;    
		                case "animatecolor":
		                    //childNode = new SVGAnimateColorNode(this.svgRoot, childXML);
		                    break;    
		                case "animatetransform":
		                    //childNode = new SVGAnimateTransformNode(this.svgRoot, childXML);
		                    break;    
		                case "circle":
		                    childNode = new SVGCircleNode(this.svgRoot, childXML);
		                    break;        
		                case "clippath":
		                    childNode = new SVGClipPathNode(this.svgRoot, childXML);
		                    break;
		                case "desc":
		                    //Do Nothing
		                    break;
		                case "defs":
		                    childNode = new SVGDefsNode(this.svgRoot, childXML);
		                    break;
		                case "ellipse":
		                    childNode = new SVGEllipseNode(this.svgRoot, childXML);
		                    break;
		                case "filter":
		                    //childNode = new SVGFilterNode(this.svgRoot, childXML, isClone);
		                    break;
		                case "g":                        
		                    childNode = new SVGGroupNode(this.svgRoot, childXML);
		                    break;
		                case "glyph":                        
	                        childNode = new SVGGlyphNode(this.svgRoot, childXML);
	                        break;
		                case "image":                   
		                    childNode = new SVGImageNode(this.svgRoot, childXML);
		                    break;
		                case "line":
		                    childNode = new SVGLineNode(this.svgRoot, childXML);
		                    break;    
		                case "lineargradient": 
		                    childNode = new SVGLinearGradient(this.svgRoot, childXML);
		                    break;    
		                case "mask":
		                    childNode = new SVGMaskNode(this.svgRoot, childXML);
		                    break;                        
		                case "metadata":
		                    //Do Nothing
		                    break;
		                case "namedview":
		                    //Add Handling 
		                    break;                            
		                case "polygon":
		                    childNode = new SVGPolygonNode(this.svgRoot, childXML);
		                    break;
		                case "polyline":
		                    childNode = new SVGPolylineNode(this.svgRoot, childXML);
		                    break;
		                case "path":                        
		                    childNode = new SVGPathNode(this.svgRoot, childXML);
		                    break;
		                case "radialgradient": 
		                    //childNode = new SVGRadialGradient(this.svgRoot, childXML, isClone);
		                    break;    
		                case "rect":
		                    childNode = new SVGRectNode(this.svgRoot, childXML);
		                    break;
		                case "set":
		                    //childNode = new SVGSetNode(this.svgRoot, childXML, isClone);
		                    break;
		                case "stop":
		                    childNode = new SVGStopNode(this.svgRoot, childXML);            
		                    break;
		                case "svg":
		                    childNode = new SVGSVGNode(childXML);
		                    break;                        
		                case "symbol":
		                    childNode = new SVGSymbolNode(this.svgRoot, childXML);
		                    break;                        
		                case "text":    
		                    childNode = new SVGTextNode(this.svgRoot, childXML);
		                    break; 
		                case "title":    
		                    childNode = new SVGTitleNode(this.svgRoot, childXML);
		                    break; 
		                case "tspan":                        
		                    childNode = new SVGTspanNode(this.svgRoot, childXML);
		                    break; 
		                case "use":
		                    childNode = new SVGUseNode(this.svgRoot, childXML);
		                    break; 
		                case "null":
		                    break;
		                    
		                default:
		                    trace("Unknown Element: " + nodeName);
		                    break;    
		            }
		            
		            if (childNode) {
		               this.addChild(childNode);
		            }
                }
            }
		}
		
		/*
		 * Drawing functions
		 */	
		
		public function drawNode(event:Event = null):void {
            this.removeEventListener(Event.ENTER_FRAME, drawNode); 
            this._invalidDisplay = false;
            
            this._firstX = true;
            this._firstY = true;
            
            this.setAttributes();
            this.transformNode();
            this.generateGraphicsCommands();
            this.draw();
            this.maskNode();
            
            this.svgRoot.doneRendering();
        }
        
        protected function maskNode():void {
        	var attr:String;
        	var match:Array;
        	var node:SVGNode;
        	var matrix:Matrix;
        	
        	if (this.mask) { //Hide any old masks
        	   this.mask.visible = false;
        	}
        	
        	attr = this.getAttribute('mask');
        	        	
        	if (attr) {
        	   match = attr.match(/url\(\s*#(.*?)\s*\)/si);	        	   
        	   if (match.length == 2) {
        	       attr = match[1];
        	       node = this.svgRoot.getNode(attr);
        	       if (node) {
        	           this.mask = node;        	           
        	           node.visible = true;
        	           
        	           //Enable mask transparencies
        	           this.cacheAsBitmap = true; 
        	           node.cacheAsBitmap = true;
        	       }
        	   }
        	}
        	
        	attr = this.getAttribute('clip-path');
                        
            if (attr) {
               match = attr.match(/url\(\s*#(.*?)\s*\)/si);                
               if (match.length == 2) {
                   attr = match[1];
                   node = this.svgRoot.getNode(attr);
                   if (node) {
                       this.mask = node;                       
                       node.visible = true;
                                              
                       //DO NOT enable mask transparencies
                   }
               }
            }
        }
        
        /**
         * Force a redraw of a node
         **/
        public function invalidateDisplay():void {
            if (this._invalidDisplay == false) {    
                this._invalidDisplay = true;
                this.addEventListener(Event.ENTER_FRAME, drawNode);
                if ( !(this is SVGSVGNode)) {
                	this.svgRoot.startRendering();
                }                
            }            
        }
        
        public function invalidateChildren():void {
        	var child:DisplayObject;
        	for (var i:uint = 0; i < this.numChildren; i++) {
        		child = this.getChildAt(i);
        	   	if (child is SVGNode) {
        	   		SVGNode(child).invalidateDisplay();
        	   		SVGNode(child).invalidateChildren();
        	   	}
        	}
        }
        
        protected function setAttributes():void {        	
        	var attr:String;
        	
        	attr = this.getAttribute('x');
        	if (attr) {
        		this.x = SVGUnits.cleanNumber(SVGColors.trim(attr).split(' ')[0]);
        	}
        	
        	attr = this.getAttribute('y');
            if (attr) {
                this.y = SVGUnits.cleanNumber(SVGColors.trim(attr).split(' ')[0]);
            }
            
            attr = this.getAttribute('rotate');
            if (attr) {
                this.rotation = SVGUnits.cleanNumber(attr);
            }
            
            attr = this.getAttribute('opacity');
            if (attr) {
                this.alpha = SVGUnits.cleanNumber(attr);
            }
            
        }
        
        protected function transformNode():void {
        	var transform:String = this.getAttribute('transform');
            
            if (transform) {
            	var matrix:Matrix = this.transform.matrix.clone();            	
            	matrix.concat(this.parseTransform(transform));
            	this.transform.matrix = matrix;                
            }
        }
        
        public function parseTransform(trans:String):Matrix {
            if (trans != null) {
                
                var newMatrix:Matrix = new Matrix();               
                
                var transArray:Array = trans.match(/\S+\(.*?\)/sg);
                for each(var tran:String in transArray) {
                    var matrix:Matrix = new Matrix();
                    var tranArray:Array = tran.split('(',2);
                    if (tranArray.length == 2)
                    {
                        var command:String = String(tranArray[0]);
                        var args:String = String(tranArray[1]);
                        args = args.replace(')','');
                        args = args.replace(/\s/g, '');
                        var argsArray:Array = args.split(',');
                        
                        switch (command) {
                            case "matrix":
                                if (argsArray.length == 6) {
                                    matrix.a = argsArray[0];
                                    matrix.b = argsArray[1];
                                    matrix.c = argsArray[2];
                                    matrix.d = argsArray[3];
                                    matrix.tx = argsArray[4];
                                    matrix.ty = argsArray[5];
                                }
                                break;
                                
                            case "translate":                                                            
                                if (argsArray.length == 1) {
                                   matrix.translate(argsArray[0], 0);                                   
                                }
                                else if (argsArray.length == 2) {
                                	matrix.translate(SVGUnits.cleanNumber(argsArray[0]), SVGUnits.cleanNumber(argsArray[1]));                                    
                                }
                                break;
                                
                            case "scale":
                                if (argsArray.length == 1) {
                                	matrix.scale(SVGUnits.cleanNumber(argsArray[0]), SVGUnits.cleanNumber(argsArray[0]));
                                }
                                else if (argsArray.length == 2) {
                                    matrix.scale(SVGUnits.cleanNumber(argsArray[0]), SVGUnits.cleanNumber(argsArray[1]));
                                }
                                break;
                                
                            case "skewX":
                                matrix.a = argsArray[0];
                                break;
                                
                            case "skewY":
                                matrix.d = argsArray[0];
                                break;
                                
                            case "rotate":
                                matrix.rotate(Number(argsArray[0])* Math.PI / 180.0); 
                                break;
                                
                            default:
                                trace('Unknown Transformation: ' + command);
                        }
                    }
                    newMatrix.concat(matrix);
                } 
            }
            return null;
        }
        
        protected function generateGraphicsCommands():void {
        	this._graphicsCommands = new  Array(); 
        }
        
        protected function draw():void {
            this.graphics.clear();
            
            var firstX:Number = 0;
            var firstY:Number = 0;

            for each (var command:Array in this._graphicsCommands) {
                switch(command[0]) {
                    case "SF":
                        this.nodeBeginFill();
                        break;
                    case "EF":
                        this.nodeEndFill();
                        break;
                    case "M":
                        this.graphics.moveTo(command[1], command[2]);
                        firstX = command[1];
                        firstY = command[2];
                        break;
                    case "L":
                        this.graphics.lineTo(command[1], command[2]);
                        break;
                    case "C":
                        this.graphics.curveTo(command[1], command[2],command[3], command[4]);
                        break;
                    case "Z":
                        this.graphics.lineTo(firstX, firstY);
                        break;
                    case "LINE":
                        this.nodeBeginFill();
                        this.graphics.moveTo(command[1], command[2]);
                        this.graphics.lineTo(command[3], command[4]);
                        this.nodeEndFill();                
                        break;
                    case "RECT":
                        this.nodeBeginFill();
                        if (command.length == 5) {
                            this.graphics.drawRect(command[1], command[2],command[3], command[4]);
                        }
                        else {
                            this.graphics.drawRoundRect(command[1], command[2],command[3], command[4], command[5], command[6]);
                        }
                        this.nodeEndFill();                
                        break;        
                    case "CIRCLE":
                        this.nodeBeginFill();
                        this.graphics.drawCircle(command[1], command[2], command[3]);
                        this.nodeEndFill();
                        break;
                    case "ELLIPSE":
                        this.nodeBeginFill();                        
                        this.graphics.drawEllipse(command[1], command[2],command[3], command[4]);
                        this.nodeEndFill();
                        break;
                }
            }
        }
        
        /** 
         * Called at the start of drawing an SVG element.
         * Sets fill and stroke styles
         **/
        protected function nodeBeginFill():void {
        	//TO DO:  Review & Cleanup Code
        	
            //Fill
            var fill_alpha:Number;
            var fill_color:Number
            
            var fillNode:SVGNode;
            
            var fill:String = this.getAttribute('fill');
            
            var fillGradient:Array = fill.match(/^\s*url\(#(\S+)\)/si);
            var name:String;
            
            fill_alpha = SVGColors.cleanNumber(this.getAttribute('fill-opacity'));
            
            if ((fill == 'none') || (fill == '')) {
                fill_alpha = 0;
                fill_color = 0; 
            }           
           else if( fillGradient && fillGradient.length ) {
                fillNode = this.svgRoot.getNode(fillGradient[1]);    
                if (fillNode is SVGGradient) {
                    SVGGradient(fillNode).beginGradientFill(this);                    
                }   
            } 
            else {      
                fill_color = SVGColors.getColor((fill));
                this.graphics.beginFill(fill_color, fill_alpha);
            }
            
            
            
            //Stroke
            var line_color:Number;
            var line_alpha:Number;
            var line_width:Number;
            
            var stroke:String = this.getAttribute('stroke');
            var strokeGradient:Array = stroke.match(/^\s*url\(#(\S+)\)/si);            
            
            if ((stroke == 'none') || (stroke == '')) {
                line_alpha = 0;
                line_color = 0;
                line_width = 0;
            }           
            else {
                line_color = SVGColors.cleanNumber(SVGColors.getColor(stroke));
                line_alpha = SVGColors.cleanNumber(this.getAttribute('stroke-opacity'));
                line_width = SVGColors.cleanNumber(this.getAttribute('stroke-width'));
            }
            
            var capsStyle:String = this.getAttribute('stroke-linecap');
            if (capsStyle == 'round'){
                capsStyle = CapsStyle.ROUND;
            }
            if (capsStyle == 'square'){
                capsStyle = CapsStyle.SQUARE;
            }
            else {
                capsStyle = CapsStyle.NONE;
            }
            
            var jointStyle:String = this.getAttribute('stroke-linejoin');
            if (jointStyle == 'round'){
                jointStyle = JointStyle.ROUND;
            }
            else if (jointStyle == 'bevel'){
                jointStyle = JointStyle.BEVEL;
            }
            else {
                jointStyle = JointStyle.MITER;
            }
            
            var miterLimit:String = this.getAttribute('stroke-miterlimit');
            if (miterLimit == null) {
                miterLimit = '4';
            }
            
            this.graphics.lineStyle(line_width, line_color, line_alpha, false, LineScaleMode.NORMAL, capsStyle, jointStyle, SVGColors.cleanNumber(miterLimit));

            if( strokeGradient && strokeGradient.length ) {
                fillNode = this.svgRoot.getNode(strokeGradient[1]);    
                if (fillNode is SVGGradient) {
                    SVGGradient(fillNode).lineGradientStyle(this);
                }   
            } 
        }
        
        /** 
         * Called at the end of drawing an SVG element
         **/
        protected function nodeEndFill():void {
            this.graphics.endFill();
        }
        
        /**
         * Check value of x against _minX and _maxX, 
         * Update values when appropriate
         **/
        protected function setXMinMax(value:Number):void {        	
        	if (_firstX) {
                _firstX = false;
                this.xMax = value;
                this.xMin = value;
                return;
            }
            
            if (value < this.xMin) {
                this.xMin = value;
            }
            if (value > this.xMax) {
                this.xMax = value;
            }
        }
        
        /**
         * Check value of y against _minY and _maxY, 
         * Update values when appropriate
         **/
        protected function setYMinMax(value:Number):void {
        	if (_firstY) {
        		_firstY = false;
        		this.yMax = value;
        		this.yMin = value;
        		return;
        	}
        	
            if (value < this.yMin) {
                this.yMin = value;
            }
            if (value > this.yMax) {
                this.yMax = value;
            }
        }
        
        /*
         * Node registration triggered by stage add / remove
         */
         
        protected function onAddedToStage(event:Event):void {
        	this.registerID();
        	if (this.original) {
        		this.original.registerClone(this);
        	}
        }
        
        protected function onRemovedFromStage(event:Event):void {
        	this.unregisterID();
        	if (this.original) {
                this.original.unregisterClone(this);
            }
        }
		
		protected function registerID():void {
			if (this._isClone) {
				return;
			}
			
			var id:String = this._xml.@id;
            
            if (id == _id) {
            	return;
            }
            
            if (_id) {
            	this.svgRoot.unregisterNode(this);
            }
            
            if (id != "") {
                _id = id;                
                this.svgRoot.registerNode(this);                
            }
		}
		
		protected function unregisterID():void {
			if (this._id) {
				this.svgRoot.unregisterNode(this);
				_id = null;
			}
		}
				
		/*
		 * Attribute Handling
		 */
		 
		/**
         * @param attribute Attribute to retrieve from SVG XML
         * 
         * @param defaultValue Value to return if attribute is not found
         * 
         * @param inherit If attribute is not set in this node try to retrieve it from the parent node
         * 
         * @return Returns the value of defaultValue
         **/
        public function getAttribute(name:String, defaultValue:* = null, inherit:Boolean = true):* {        	
            var value:String = this._getAttribute(name, defaultValue);
            
            if (value == "inherit") {
            	value = null;
            }
            
            if (value == "currentColor") {
            	value = this.getAttribute('color', null, false);
            	if (!value || (value == "currentColor")) {
            		if (this.parent is SVGNode) {
            			value = SVGNode(this.parent).getAttribute('color');
            		}
            	}
            }
            
                
            if (value) {
            	return value;
            }
            
            if (inherit && (this.parent is SVGNode)) {
            	return SVGNode(this.parent).getAttribute(name, defaultValue);
            }
            
            return defaultValue;            
        }
        
        protected function _getAttribute(name:String, defaultValue:String = null):String {
        	var value:String;
        	
        	if (this.original && (this.parent is SVGNode)) {
                //Node is the top level of a clone
                //Check for an override value from the parent
                value = SVGNode(this.parent).getAttribute(name, null, false);
                if (value) {
                    return value;
                }
            }
            
            if (name == "href") {
            	//this._xml@href handled normally
            	value = this._xml.@xlink::href;            	            	
            	if (value && (value != "")) {
            		return value;
            	}
            }
            
            var xmlList:XMLList = this._xml.attribute(name);
            
            if (xmlList.length() > 0) {
                return xmlList[0].toString();
            }   
                     
            if (_styles.hasOwnProperty(name)) {
                return (_styles[name]);
            }
              
            if (ATTRIBUTES_NOT_INHERITED.indexOf(name) != -1) {            
                return defaultValue;        
            }
            
            return defaultValue;
        }
        
        public function setAttribute(name:String, value:String):void {
        	        	
        	if (this._styles.hasOwnProperty(name)) {
        	   this._styles[name] = value;
        	   updateStyle();
        	}
        	else {
        		this._xml.@[name] = value;
        	}
        	
        	//TO DO: Need to detect which values don't need a readraw such as x & y
        	//Ex: if (name == "x")  then this.x = value, don't call invalidateDisplay, still need to update clones
        	//
        	
        	this.invalidateDisplay();
        	this.updateClones();
        }
        
        public function deleteAttribute(name:String):void {
        	if (this._styles.hasOwnProperty(name)) {
               delete this._styles[name];
               updateStyle();
            }
            else {
                delete this._xml.@[name];
            }
            
            //TO DO: Need to detect which values don't need a readraw such as x & y
            //Ex: if (name == "x")  then this.x = value, don't call invalidateDisplay, still need to update clones
            //
            
            this.invalidateDisplay();
            this.updateClones();
        }
        
        /**
         * Update style attribute from _styles
         * <node style="...StyleString...">
         * 
         **/ 
        private function updateStyle():void {
            var newStyleString:String = '';
            
            for (var key:String in this._styles) {
                if (newStyleString.length > 0) {
                    newStyleString += ';';
                }
                newStyleString += key + ':' + this._styles[key];
            }
            
            this._xml.@style = newStyleString;
        }
        
        private function parseStyle():void {
        	//Get styling from XML attribute 'style'
        	_styles = new Object();
        	
            var xmlList:XMLList = this._xml.attribute('style');
            if (xmlList.length() > 0) {
                var styleString:String = xmlList[0].toString();
                var styles:Array = styleString.split(';');
                for each(var style:String in styles) {
                    var styleSet:Array = style.split(':');
                    if (styleSet.length == 2) {
                        this._styles[SVGColors.trim(styleSet[0])] = SVGColors.trim(styleSet[1]);
                    }
                }
            }
        }
        
        /*
         * Clone Handlers
         */        
		
		public function clone():SVGNode {
            var nodeClass:Class = getDefinitionByName(getQualifiedClassName(this)) as Class;
            var newXML:XML = this._xml.copy();
            
            var node:SVGNode = new nodeClass(this.svgRoot, newXML, this) as SVGNode;
            
            return node;
        }
        
        public function registerClone(clone:SVGNode):void {
        	if (this._clones.indexOf(clone) == -1) {
        	   this._clones.push(clone);
        	}
        }
        
        public function unregisterClone(clone:SVGNode):void {
        	var index:int = this._clones.indexOf(clone);
        	if (index > -1) {
        		this._clones = this._clones.splice(index, 1);
        	}
        }
        
        protected function updateClones():void {
        	for (var i:uint = 0; i < this._clones.length; i++) {
        	   SVGNode(this._clones[i]).xml = this._xml.copy();	
        	}
        }
        
        
        		
        /*
         * Misc Functions
         */
        
        /**
         * Remove all child nodes
         **/        
        protected function clearChildren():void {
            while(this.numChildren) {
                this.removeChildAt(0);
            }
        }
		
		/*
		 * Getter / Setters
		 */
		
		public function set xml(value:XML):void {
			_xml = value;
			
			this.clearChildren();
			this.graphics.clear();
			
			if (_xml) {	
				this.parseStyle();		
				if (!this.original) {	
                    this.parseNodes();
                }
                this.invalidateDisplay();
            }
            
            this.updateClones();
            
		}
		
		public function get xml():XML {
			return _xml;
		}
		
		public function get id():String {
			return _id;
		}
		
		public function get isClone():Boolean {
			return this._isClone;
		}
		
	}
}