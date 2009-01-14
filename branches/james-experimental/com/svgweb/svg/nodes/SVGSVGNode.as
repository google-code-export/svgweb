package com.svgweb.svg.nodes {
	import com.svgweb.svg.core.SVGNode;
	
	import flash.events.Event;
	
	public class SVGSVGNode extends SVGNode {
		
		private var _nodeLookup:Object = new Object();		
		private var _renderCount:int;
		
		protected var parentSVGRoot:SVGSVGNode = null;
		
		public function SVGSVGNode(xml:XML = null, original:SVGNode = null) {			
			super(this, xml, original);
		}
		
		override public function drawNode(event:Event = null):void {            
            this.removeEventListener(Event.ENTER_FRAME, drawNode);    
            this._invalidDisplay = false;
            
            this.setAttributes();
            this.transformNode();
            
            this.createMask();
            this.applyViewBox();            
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
			if (this._renderCount == 0) {
				if (parentSVGRoot) {
					//If we are a nested SVG we need to increment our parent SVG
					parentSVGRoot.startRendering();
				}
			}
			this._renderCount++;
		}
		
		public function doneRendering():void {
			this._renderCount--;
			if (this._renderCount == 0) {
				//Done Redering
				if (parentSVGRoot) {
					parentSVGRoot.doneRendering();
				}
				else {
					//Top level SVG
					//Do Done Rendering Event
					trace ("Done Rendering");
				}
			}
			
			if (this._renderCount < 0) {
				trace ("Render count is negative! " + this._renderCount);
			}
		}		
		
		/**
		 * We don't want to register the main node so override this function
		 **/
		override protected function registerID():void {
			if (this._xml) {
				super.registerID();
				if (!this.isClone) {
					if (this.parent is SVGNode) {
						parentSVGRoot = SVGNode(this.parent).svgRoot; 
		                parentSVGRoot.registerNode(this);		
					}
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
            
            var value:String = this._getAttribute(name, defaultValue);
            if (value) {
            	return value;
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
		
	}
}