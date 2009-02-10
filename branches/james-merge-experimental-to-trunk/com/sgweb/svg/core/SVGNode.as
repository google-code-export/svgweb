/*
 Copyright (c) 2009 by contributors:

 * James Hight (http://labs.zavoo.com/)
 * Richard R. Masters

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

package com.sgweb.svg.core
{
	import com.sgweb.svg.nodes.*;
	import com.sgweb.svg.utils.SVGColors;
	import com.sgweb.svg.utils.SVGUnits;
	
	import flash.display.BitmapData;
	import flash.display.CapsStyle;
	import flash.display.DisplayObject;
	import flash.display.JointStyle;
	import flash.display.LineScaleMode;
	import flash.display.Shape;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.geom.Matrix;
	import flash.utils.getDefinitionByName;
	import flash.utils.getQualifiedClassName;

    /** Base node extended by all other SVG Nodes **/
   public class SVGNode extends Sprite {
        
        public static const ATTRIBUTE_LIST:Array = ['stroke', 'stroke-width', 'stroke-dasharray', 
                                         'stroke-opacity', 'stroke-linecap', 'stroke-linejoin',
                                         'fill', 'fill-opacity', 'opacity', 'stop-color', 'stop-opacity',
                                         'font-family', 'font-size', 'letter-spacing', 'filter', 'visibility'];
                                         
        public static const ATTRIBUTES_NOT_INHERITED:Array = ['id', 'x', 'y', 'width', 'height', 'rotate', 'transform', 
                                        'gradientTransform', 'opacity', 'mask', 'clip-path', 'href', 'target', 'viewBox'];                                         
                                                 
                                         
        public namespace xlink = 'http://www.w3.org/1999/xlink';
        public namespace svg = 'http://www.w3.org/2000/svg';
        
        public var svgRoot:SVGSVGNode;
                
        //Used for gradients
        public var xMin:Number;
        public var xMax:Number;     
        public var yMin:Number;
        public var yMax:Number;
        
        public var viewX:Number;
        public var viewY:Number;
        public var viewWidth:Number = 0;
        public var viewHeight:Number = 0;
        
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
                            childNode = new SVGMetadataNode(this.svgRoot, childXML);
                            break;
                        case "namedview":
                            //Add Handling 
                            break;    
                        case "pattern":
                            childNode = new SVGPatternNode(this.svgRoot, childXML);
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
                            childNode = new SVGRadialGradient(this.svgRoot, childXML);
                            break;    
                        case "rect":
                            childNode = new SVGRectNode(this.svgRoot, childXML);
                            break;
                        case "script":
                            childNode = new SVGScriptNode(this.svgRoot, childXML);
                            break;
                        case "set":
                            //childNode = new SVGSetNode(this.svgRoot, childXML, isClone);
                            break;
                        case "stop":
                            childNode = new SVGStopNode(this.svgRoot, childXML);            
                            break;
                        case "svg":
                            childNode = new SVGSVGNode(this.svgRoot, childXML);
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
        	if (this.hasEventListener(Event.ENTER_FRAME)) {
                this.removeEventListener(Event.ENTER_FRAME, drawNode);
            } 
            this._invalidDisplay = false;
            
            this._firstX = true;
            this._firstY = true;
            
            this.clearMask();
            
            this.transform.matrix = new Matrix();
            
            this.setAttributes();
            this.transformNode();
            this.generateGraphicsCommands();
            this.draw();
            
            this.applyViewBox();
            this.maskNode();
            
            this.attachEventListeners();
            
            this.svgRoot.doneRendering();
        }
        
        protected function attachEventListeners():void {
            var action:String;
            
            action = this.getAttribute("onclick", null, false);
            if (action) 
                this.svgRoot.addActionListener(MouseEvent.CLICK, this);
                
            action = this.getAttribute("onmousedown", null, false);
            if (action) 
                this.svgRoot.addActionListener(MouseEvent.MOUSE_DOWN, this);
                
            action = this.getAttribute("onmouseup", null, false);
            if (action) 
                this.svgRoot.addActionListener(MouseEvent.MOUSE_UP, this);
                
            action = this.getAttribute("onmousemove", null, false);
            if (action) 
                this.svgRoot.addActionListener(MouseEvent.MOUSE_MOVE, this);
                
            action = this.getAttribute("onmouseover", null, false);
            if (action) 
                this.svgRoot.addActionListener(MouseEvent.MOUSE_OVER, this);
                
            action = this.getAttribute("onmouseout", null, false);
            if (action) 
                this.svgRoot.addActionListener(MouseEvent.MOUSE_OUT, this);
            
        }
        
        protected function maskNode():void {
            var attr:String;
            var match:Array;
            var node:SVGNode;
            var matrix:Matrix;
            var isMask:Boolean = true;
                        
            attr = this.getAttribute('mask');
            if (!attr) {
                attr = this.getAttribute('clip-path');
            }
                        
            if (attr) {
               match = attr.match(/url\(\s*#(.*?)\s*\)/si);                
               if (match.length == 2) {
                   attr = match[1];
                   node = this.svgRoot.getNode(attr);
                   if (node) {
                       this.mask = node;                       
                       node.visible = true;
                       
                       this.cacheAsBitmap = true; 
                       node.cacheAsBitmap = true;                       
                   }
               }
            }           
        }
        
        //Used by SVGSVGNode and SVGImageNode
        protected function createMask():void {
            if (!this.mask) {
                var shape:Shape;
                var w:Number = 0;
                var h:Number = 0;
                
                if ((this.viewWidth > 0) &&(this.viewHeight > 0)) {
                    shape = new Shape();
                    shape.graphics.beginFill(0x000000);
                    shape.graphics.drawRect(this.viewX, this.viewY, this.viewWidth, this.viewHeight);
                    shape.graphics.endFill();
                    this.addChild(shape);
                    this.mask = shape;
                } 
                else {                  
                    var maskWidth:String = this.getAttribute('width');
                    if (maskWidth && !maskWidth.match(/%/)){
                        w = SVGUnits.cleanNumber(maskWidth);
                    }
                    
                    var maskHeight:String = this.getAttribute('height');
                    if (maskHeight && !maskHeight.match(/%/)){
                        h = SVGUnits.cleanNumber(maskHeight);
                    }
                }
                
                if ((w > 0) 
                    && (h > 0)) {
                    shape = new Shape();
                    shape.graphics.beginFill(0x000000);
                    shape.graphics.drawRect(0, 0, w, h);
                    shape.graphics.endFill();
                    this.addChild(shape);
                    this.mask = shape;
                }
                
            }
        }
        
        protected function clearMask():void {
            if (this.mask) {
                if ((this.mask is Shape) && this.contains(this.mask)) {
                    this.removeChild(this.mask);                    
                }
                this.mask = null;
            }
        }
                
        protected function applyViewBox():void {
            
            var viewBox:String = this.getAttribute('viewBox');          
            if (viewBox) {
                var points:Array = viewBox.split(/\s+/);
                viewX = SVGUnits.cleanNumber(points[0]);
                viewY = SVGUnits.cleanNumber(points[1]);
                viewWidth = SVGUnits.cleanNumber(points[2]);
                viewHeight = SVGUnits.cleanNumber(points[3]);
           
                var canvasWidth:Number = this.getWidth(); //2048.0;
                var canvasHeight:Number = this.getHeight(); //1024.0;                
                
                if ((canvasWidth > 0)
                    && (canvasHeight > 0)) {                    
                    
                    var cropWidth:Number;
                    var cropHeight:Number;
                              
                    var newMatrix:Matrix = this.transform.matrix.clone();
                        
                    var oldAspectRes:Number = viewWidth / viewHeight;
                    var newAspectRes:Number = canvasWidth /  canvasHeight;
                    
                    var preserveAspectRatio:String = this.getAttribute('preserveAspectRatio', 'xMidYMid meet', false);;               
                    var alignMode:String = preserveAspectRatio.substr(0,8);
                    
                    var meetOrSlice:String = 'meet';
                    if (preserveAspectRatio.indexOf('slice') != -1) {
                        meetOrSlice = 'slice';
                    }
                    
                    /**
                     * Handle Scaling
                     **/
                    if (alignMode == 'none') {
                        // stretch to fit viewport width and height
    
                        cropWidth = canvasWidth;
                        cropHeight = canvasHeight;
                    }
                    else {
                        if (meetOrSlice == 'meet') {
                            // shrink to fit inside viewport
    
                            if (newAspectRes > oldAspectRes) {
                                cropWidth = canvasHeight * oldAspectRes;
                                cropHeight = canvasHeight;
                            }
                            else {
                                cropWidth = canvasWidth;
                                cropHeight = canvasWidth / oldAspectRes;
                            }
        
                        }
                        else {
                            // meetOrSlice == 'slice'
                            // Expand to cover viewport.
    
                            if (newAspectRes > oldAspectRes) {
                                cropWidth = canvasWidth;
                                cropHeight = canvasWidth / oldAspectRes;
                            }
                            else {
                                cropWidth = canvasHeight * oldAspectRes;
                                cropHeight = canvasHeight;
                            }
        
                        }
                    }
                    var scaleX:Number = cropWidth / viewWidth;
                    var scaleY:Number = cropHeight / viewHeight;
                    newMatrix.translate(-viewX, -viewY);
                    newMatrix.scale(scaleX, scaleY);
    
    
                    /**
                     * Handle Alignment
                     **/
                    var borderX:Number;
                    var borderY:Number;
                    var translateX:Number;
                    var translateY:Number;
                    if (alignMode != 'none') {
                        translateX=0;
                        translateY=0;
                        var xAlignMode:String = alignMode.substr(0,4);
                        switch (xAlignMode) {
                            case 'xMin':
                                break;
                            case 'xMax':
                                translateX = canvasWidth - cropWidth;
                                break;
                            case 'xMid':
                            default:
                                borderX = canvasWidth - cropWidth;
                                translateX = borderX / 2.0;
                                break;
                        }
                        var yAlignMode:String = alignMode.substr(4,4);
                        switch (yAlignMode) {
                            case 'YMin':
                                break;
                            case 'YMax':
                                translateY = canvasHeight - cropHeight;
                                break;
                            case 'YMid':
                            default:
                                borderY = canvasHeight - cropHeight;
                                translateY = borderY / 2.0;
                                break;
                        }
                        newMatrix.translate(translateX, translateY);
                    }   
                    
                    this.transform.matrix = newMatrix;                      
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
                this.x += SVGUnits.cleanNumber(SVGColors.trim(attr).split(' ')[0]);
            }
            
            attr = this.getAttribute('y');
            if (attr) {
                this.y += SVGUnits.cleanNumber(SVGColors.trim(attr).split(' ')[0]);
            }
            
            attr = this.getAttribute('rotate');
            if (attr) {
                this.rotation += SVGUnits.cleanNumber(attr);
            }
            
            attr = this.getAttribute('opacity');
            if (attr) {
                this.alpha = SVGUnits.cleanNumber(attr);
            }
            
        }
        
        protected function transformNode():void {
            var transform:String = this.getAttribute('transform');
            
            if (transform) {
                this.transform.matrix = this.parseTransform(transform, this.transform.matrix.clone());              
            }  
        }
        
        public function parseTransform(trans:String, baseMatrix:Matrix = null):Matrix {
            if (!baseMatrix) {
                baseMatrix = new Matrix();
            }
            
            if (trans != null) {
                var transArray:Array = trans.match(/\S+\(.*?\)/sg);
                transArray.reverse();
                for each(var tran:String in transArray) {
                    var tranArray:Array = tran.split('(',2);
                    if (tranArray.length == 2)
                    {
                        var command:String = String(tranArray[0]);
                        var args:String = String(tranArray[1]);
                        args = args.replace(')','');
                        args = args.replace(/ /g, '');
                        var argsArray:Array = args.split(/[, ]/);

                        var nodeMatrix:Matrix = new Matrix();
                        switch (command) {
                            case "matrix":
                                if (argsArray.length == 6) {
                                    nodeMatrix.a = argsArray[0];
                                    nodeMatrix.b = argsArray[1];
                                    nodeMatrix.c = argsArray[2];
                                    nodeMatrix.d = argsArray[3];
                                    nodeMatrix.tx = argsArray[4];
                                    nodeMatrix.ty = argsArray[5];
                                }
                                break;

                            case "translate":
                                if (argsArray.length == 1) {
                                    nodeMatrix.tx = argsArray[0]; 
                                }
                                else if (argsArray.length == 2) {
                                    nodeMatrix.tx = argsArray[0]; 
                                    nodeMatrix.ty = argsArray[1]; 
                                }
                                break;

                            case "scale":
                                if (argsArray.length == 1) {
                                    nodeMatrix.a = argsArray[0];
                                    nodeMatrix.d = argsArray[0];
                                }
                                else if (argsArray.length == 2) {
                                    nodeMatrix.a = argsArray[0];
                                    nodeMatrix.d = argsArray[1];
                                }
                                break;
                                
                            case "skewX":
                                nodeMatrix.c = Math.tan(argsArray[0] * Math.PI / 180.0);
                                break;
                                
                            case "skewY":
                                nodeMatrix.b = Math.tan(argsArray[0] * Math.PI / 180.0);
                                break;
                                
                            case "rotate":
                                nodeMatrix.rotate(Number(argsArray[0])* Math.PI / 180.0); 
                                break;
                                
                            default:
                                //this.dbg('Unknown Transformation: ' + command);
                        }
                        baseMatrix.concat(nodeMatrix);
                    }
                }
            }
            
            return baseMatrix;
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
            
            var fillUrl:Array = fill.match(/^\s*url\(#(\S+)\)/si);
            var name:String;
            
            fill_alpha = SVGColors.cleanNumber(this.getAttribute('fill-opacity'));
            
            if ((fill == 'none') || (fill == '')) {
                fill_alpha = 0;
                fill_color = 0; 
            }           
           else if( fillUrl && fillUrl.length ) {
                fillNode = this.svgRoot.getNode(fillUrl[1]);    
                if (fillNode is SVGGradient) {
                    SVGGradient(fillNode).beginGradientFill(this);                    
                }   
                else if (fillNode is SVGPatternNode) {
                	SVGPatternNode(fillNode).beginPatternFill(this);
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
            else if (capsStyle == 'square'){
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
            
            var id:String = this.getAttribute('id');
            
            if (id == _id) {
                return;
            }
            
            if (_id) {
                this.svgRoot.unregisterNode(this);
            }
            
            if (id && id != "") {
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
            var value:String = this._getAttribute(name);
            
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
            
            if (ATTRIBUTES_NOT_INHERITED.indexOf(name) != -1) {            
                return defaultValue;        
            }
            
            if (inherit && (this.parent is SVGNode)) {
                return SVGNode(this.parent).getAttribute(name, defaultValue);
            }
            
            return defaultValue;            
        }
        
        protected function _getAttribute(name:String):String {
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
            
            return null;
        }
        
        public function setAttribute(name:String, value:String):void {
                        
            if (this._styles.hasOwnProperty(name)) {
               this._styles[name] = value;
               updateStyle();
            }
            else {
                this._xml.@[name] = value;
            }
            
            switch(name) {
            	case 'x':      	   
            	   this.x = SVGUnits.cleanNumber(value);
            	   break;        	   
            	case 'y':
            	    this.x = SVGUnits.cleanNumber(value);
                    break;
            	case 'rotate':
            	   this.rotation = SVGUnits.cleanNumber(value);
                   break;
                    	   
                case 'transform':
                case 'viewBox':
                    this.transform.matrix = new Matrix();
                    this.setAttributes();
                    this.transformNode();
                    this.applyViewBox();
                    
                default:  
                    this.invalidateDisplay();          	
            }
                        
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
            
             switch(name) {
                case 'x':                      
                case 'y':
                case 'rotate': 
                case 'transform':
                case 'viewBox':
                    this.transform.matrix = new Matrix();
                    this.setAttributes();
                    this.transformNode();
                    this.applyViewBox();
                    
                default:  
                    this.invalidateDisplay();           
            }
            
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
        
        
        public function getWidth():Number {
            var widthStr:String = this.getAttribute('width');
            var tmp:Number;
            
            if (widthStr) {
                var num:Number = SVGUnits.cleanNumber(widthStr);                
                if (widthStr.match(/%/)) {            
                    if (this.parent is SVGNode) {
                        tmp = SVGNode(this.parent).getWidth();
                        if (tmp > 0) {
                            return tmp * num / 100;
                        }
                    }
                    else if (this.parent is SVGViewer) {
                        tmp = SVGViewer(this.parent).getWidth();
                        if (tmp > 0) {
                            return tmp * num / 100;
                        }
                    }
                }
                else {
                    return num;
                }
            }
            
            if (this.viewWidth > 0) {
                return this.viewWidth;
            }
            
            return 0;
            
        }


        public function getHeight():Number {
            var heightStr:String = this.getAttribute('height');
            var tmp:Number;
            
            if (heightStr) {
                var num:Number = SVGUnits.cleanNumber(heightStr);                
                if (heightStr.match(/%/)) {            
                    if (this.parent is SVGNode) {
                        tmp = SVGNode(this.parent).getHeight();
                        if (tmp > 0) {
                            return tmp * num / 100;
                        }
                    }
                    else if (this.parent is SVGViewer) {
                        tmp = SVGViewer(this.parent).getHeight();
                        if (tmp > 0) {
                            return tmp * num / 100;
                        }
                    }
                }
                else {
                    return num;
                }
            }
            
            if (this.viewHeight > 0) {
                return this.viewHeight;
            }
                        
            return 0;
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
                this.parseNodes();
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