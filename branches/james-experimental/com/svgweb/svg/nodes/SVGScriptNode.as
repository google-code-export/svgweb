package com.svgweb.svg.nodes {
	import com.svgweb.svg.core.SVGNode;
	
	import flash.events.Event;

	public class SVGScriptNode extends SVGNode {
		public function SVGScriptNode(svgRoot:SVGSVGNode, xml:XML=null, original:SVGNode=null) {
			super(svgRoot, xml, original);
		}
		
		override public function drawNode(event:Event = null):void {          
            this.removeEventListener(Event.ENTER_FRAME, drawNode);      
            
            //Don't reset _invalidDisplay
            //This way drawNode is only called once
            //this._invalidDisplay = false;
            
            
            
            this.svgRoot.handleScript(this._xml.toXMLString());                        
                
            this.visible = false;  
                        
            this.svgRoot.doneRendering();
        }
		
	}
}