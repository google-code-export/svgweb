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

package org.svgweb
{

    import flash.events.Event;
    import flash.events.IOErrorEvent;
    import flash.events.ProgressEvent;
    import flash.events.SecurityErrorEvent;
    
    import mx.core.UIComponent;
    import mx.events.ResizeEvent;
    
    import org.svgweb.events.SVGEvent;

    [Event(name="svgLoaded", type="org.svgweb.events.SVGEvent")]
    [Event(name="progress", type="flash.events.ProgressEvent")]
    [Event(name="complete", type="flash.events.Event")]
    [Event(name="ioError", type="flash.events.IOErrorEvent")]
    [Event(name="securityError", type="flash.events.SecurityErrorEvent")]    

    public class SVGViewerFlex extends UIComponent {
    	
        public var svgViewerFlash:SVGViewerFlash;
        
        public function SVGViewerFlex() {
            super();
            svgViewerFlash = new SVGViewerFlash();
            this.addChild(svgViewerFlash);
            
            this.addEventListener(ResizeEvent.RESIZE, onResize);
            svgViewerFlash.addEventListener(SVGEvent.SVGLoad, eventRelay);
            svgViewerFlash.addEventListener(ProgressEvent.PROGRESS, eventRelay);
            svgViewerFlash.addEventListener(Event.COMPLETE, eventRelay);
            svgViewerFlash.addEventListener(IOErrorEvent.IO_ERROR, eventRelay);
            svgViewerFlash.addEventListener(SecurityErrorEvent.SECURITY_ERROR, eventRelay);
        }        
        
        private function onResize(event:Event):void {
            svgViewerFlash.width = this.width;
            svgViewerFlash.height = this.height;
        }
        
        private function eventRelay(event:Event):void {
        	this.dispatchEvent(event.clone());
        }
        
        public function set source(value:*):void { 
        	svgViewerFlash.source = value;
        }
        
        public function get source():* {
        	return svgViewerFlash.source;
        } 
        
    }        
}
