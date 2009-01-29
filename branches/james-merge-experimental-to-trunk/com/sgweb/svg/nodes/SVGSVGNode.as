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

package com.sgweb.svg.nodes {
    import com.sgweb.svg.core.SVGNode;
    import com.sgweb.svg.core.SVGViewer;
    import com.sgweb.svg.events.SVGEvent;
    import com.sgweb.svg.utils.AnimationManager;
    
    import flash.events.Event;
    import flash.geom.Matrix;
    
    public class SVGSVGNode extends SVGNode {
        
        private var _nodeLookup:Object = new Object();      
        private var _renderCount:int;
        
        protected var parentSVGRoot:SVGSVGNode = null;
        
        public var animationManager:AnimationManager;
        
        public function SVGSVGNode(svgRoot:SVGSVGNode = null, xml:XML = null, original:SVGNode = null) {
            if (svgRoot) {
                this.parentSVGRoot = svgRoot;
                animationManager = svgRoot.animationManager;
            }           
            else {
            	animationManager = new AnimationManager(this);
            }
            
            super(this, xml, original);
        }
        
        override public function drawNode(event:Event = null):void {            
            this.removeEventListener(Event.ENTER_FRAME, drawNode);    
            this._invalidDisplay = false;
            
            
            this.clearMask();
            this.transform.matrix = new Matrix();
            
            this.setAttributes();
            this.transformNode();
            
            this.applyViewBox();
            this.createMask();     
            
            //this.attachEventListeners();                   
        }
                
        public function registerNode(node:SVGNode):void {
            _nodeLookup[node.id] = node;
        }   
        
        public function unregisterNode(node:SVGNode):void {
            delete _nodeLookup[node.id];            
        }   
        
        public function getNode(name:String):SVGNode {
            if (_nodeLookup.hasOwnProperty(name)) {
                return _nodeLookup[name];
            }
            return null;
        }
        
        public function startRendering():void {         
            if (parentSVGRoot) {
                //If we are a nested SVG we need to increment our parent SVG
                parentSVGRoot.startRendering();
            }
            else {
                this._renderCount++;
            }
        }
        
        public function doneRendering():void {          
            if (parentSVGRoot) {
                parentSVGRoot.doneRendering();
            }
            else {
                this._renderCount--;
                
                if (this._renderCount == 0) {
                    var svgEvent:SVGEvent = new SVGEvent(SVGEvent.LOADED);
                    this.dispatchEvent(svgEvent);
                }
            
                if (this._renderCount < 0) {
                    trace ("Render count is negative! " + this._renderCount);
                }
            }
        }       
        
        /**
         * We don't want to register the main node so override this function
         **/
        override protected function registerID():void {
            if (this._xml) {
                super.registerID();
                if (parentSVGRoot) {
                    parentSVGRoot.registerNode(this);
                }
            }           
        }
        
        /**
         * We don't want to register the main node so override this function
         **/
        override protected function unregisterID():void {
            super.unregisterID();
            
            if (parentSVGRoot) {
                parentSVGRoot.unregisterNode(this);        
                parentSVGRoot = null;
            }
        }
        
        override public function getAttribute(name:String, defaultValue:* = null, inherit:Boolean = true):* {
            
            var value:String = this._getAttribute(name);
            if (value) {
                return value;
            }
            
            if (ATTRIBUTES_NOT_INHERITED.indexOf(name) != -1) {
                return defaultValue;
            }
            
            if (inherit && (this.parent is SVGNode)) {
                return SVGNode(this.parent).getAttribute(name, defaultValue, inherit);
            }
            
            if ((name == 'opacity') 
                || (name == 'fill-opacity')
                || (name == 'stroke-opacity')
                || (name == 'stroke-width')) {
                return '1';
            }
            
            if (name == 'fill') {
                return 'black';
            }
            
            if (name == 'stroke') {
                return 'none';
            }
            
            return defaultValue;
        }
        
        override public function set xml(value:XML):void {          
            if (_xml) {
                if (value.@id) {
                    this._id = value.@id;
                }          
                
                _renderCount = 0;   
            }
            
            super.xml = value;
        }
        
        public function handleScript(script:String):void {
            if (this.parentSVGRoot) {
                this.parentSVGRoot.handleScript(script);
            }
            else if (this.parent is SVGViewer) {
                SVGViewer(this.parent).handleScript(script);
            }           
        }
        
        public function addActionListener(eventType:String, target:SVGNode):void {
            if (this.parentSVGRoot) {
                this.parentSVGRoot.addActionListener(eventType, target);
            }
            else if (this.parent is SVGViewer) {
                SVGViewer(this.parent).addActionListener(eventType, target);
            } 
        }
        
        public function removeActionListener(eventType:String, target:SVGNode):void {
            if (this.parentSVGRoot) {
                this.parentSVGRoot.removeActionListener(eventType, target);
            }
            else if (this.parent is SVGViewer) {
                SVGViewer(this.parent).removeActionListener(eventType, target);
            } 
        }
        
    }
}
