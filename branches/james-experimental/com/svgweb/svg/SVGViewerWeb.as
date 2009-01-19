package com.svgweb.svg
{
	import com.svgweb.svg.core.SVGNode;
	import com.svgweb.svg.core.SVGViewer;
	
	import flash.display.StageAlign;
	import flash.display.StageScaleMode;
	import flash.events.Event;
	import flash.events.MouseEvent;
	
    [SWF(frameRate="24", width="2048", height="1024")]
	public class SVGViewerWeb extends SVGViewer {
		public function SVGViewerWeb() {
			super();
			
			this.addEventListener(Event.ADDED_TO_STAGE, onAddedToStage);
		}
		
		protected function onAddedToStage(event:Event):void {
            
            this.removeEventListener(Event.ADDED_TO_STAGE, onAddedToStage);  
            
            this.stage.align = StageAlign.TOP_LEFT;
            this.stage.scaleMode = StageScaleMode.NO_SCALE; 
                 
            if ((this.svgRoot.xml == null) && this.root.loaderInfo.parameters.hasOwnProperty('svgURL')) {
                this.loadURL(this.root.loaderInfo.parameters.svgURL);
            }
        }
        
        override public function addActionListener(eventType:String, target:SVGNode):void {
            target.addEventListener(eventType, handleAction);
        } 
        
        override public function removeActionListener(eventType:String, target:SVGNode):void {
            target.removeEventListener(eventType, handleAction);
        }
        
        protected function handleAction(event:Event):void {
            var target:SVGNode = SVGNode(event.target);
            switch(event.type) {
            	case MouseEvent.CLICK:
                            	   
            }
        }
        
        override public function getWidth():Number {
            return this.stage.stageWidth;
        }
        
        override public function getHeight():Number {
            return this.stage.stageHeight;
        }
		
	}
}