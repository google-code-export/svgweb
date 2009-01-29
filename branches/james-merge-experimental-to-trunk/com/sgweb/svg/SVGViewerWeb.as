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

package com.sgweb.svg
{
	import com.sgweb.svg.core.SVGNode;
	import com.sgweb.svg.core.SVGViewer;
	
	import flash.display.StageAlign;
	import flash.display.StageScaleMode;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.external.ExternalInterface;
	
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
        
        private function handleAction(event:Event):void {        	
            var target:SVGNode = SVGNode(event.target);
            if (!target.id) 
            	return;
                        
            switch(event.type) {
            	case MouseEvent.CLICK:
            	case MouseEvent.MOUSE_DOWN:
            	case MouseEvent.MOUSE_MOVE:
            	case MouseEvent.MOUSE_OUT:
            	case MouseEvent.MOUSE_OVER:
            	case MouseEvent.MOUSE_UP:
                    js_sendMouseEvent(MouseEvent(event));
                    break;  
                    
                default:
                    trace("handleAction: Event not found");                 	   
            }
        }
        
        private static function js_sendMouseEvent(event:MouseEvent):void {
            try {
            	var parentID:String = "";
            	if (SVGNode(event.target).parent is SVGNode) {
            		parentID = SVGNode(SVGNode(event.target).parent).id; 
            	} 
                ExternalInterface.call("receiveFromFlash",
                                         { type: 'event',
                                           uniqueId: SVGNode(event.target).id,
                                           parentId: parentID,
                                           elementId: SVGNode(event.target).id,
                                           eventType: event.type.toLowerCase(),
                                           clientX: event.localX,
                                           clientY: event.localY,
                                           screenX: event.stageX,
                                           screenY: event.stageY
                                         } ); 
            }
            catch(error:SecurityError) {
            	
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