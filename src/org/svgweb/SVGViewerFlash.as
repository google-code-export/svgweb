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

package org.svgweb {
	
    import flash.display.Bitmap;
    import flash.display.BitmapData;
    import flash.display.Loader;
    import flash.display.LoaderInfo;
    import flash.events.Event;
    import flash.events.IOErrorEvent;
    import flash.events.ProgressEvent;
    import flash.events.SecurityErrorEvent;
    import flash.net.URLLoader;
    import flash.net.URLRequest;
    import flash.utils.ByteArray;
    
    import org.svgweb.core.SVGViewer;
    import org.svgweb.events.SVGEvent;
    import org.svgweb.utils.Base64;
    import org.svgweb.utils.PNGEncoder;

    public class SVGViewerFlash extends SVGViewer {
    		
    	private var _width:Number = 0;
    	private var _height:Number = 0;
    	
    	private var loading:Boolean = false;
    	
        public function SVGViewerFlash() {
            super();           
            
            // Work around cacheAsBitmap bug, set size back to _width & _height 
            // after SVG has loaded to force Flash to update display
            this.width = 123.456; //Dummy value
            this.height = 123.456; //Dummy value
        }
        
        override public function set width(value:Number):void {
        	_width = value;
        	if (!loading) {
        	   super.width = value;
        	}
        }
        
        override public function get width():Number {
        	return _width; 
        }
        
        override public function set height(value:Number):void {
        	_height = value;
        	if (!loading) {
        	   super.height = value;
        	}
        }
        
        override public function get height():Number {
        	return _height;
        }
        
        override public function getWidth():Number {
        	return _height;
        }

        override public function getHeight():Number {
        	return _height;
        }

        override public function set xml(value:XML):void {
            super.xml = value;
            svgRoot.addEventListener(SVGEvent.SVGLoad, onSVGLoad);            
        }
        
        private function onSVGLoad(event:SVGEvent):void {
        	this.dispatchEvent(event.clone());
        	
        	// Work around cacheAsBitmap bug, set scaling back to _width & _height 
            // after SVG has loaded to force Flash to update display
        	this.width = _width;
        	this.height = _height;
        }
        
        public function set source(value:*):void {                        
            var xml:XML = null;
            if (value is XML) {
                xml = XML(value);
            }
            else if (value is Bitmap) {
            	xml = this.bitmapDataToXml(Bitmap(value).bitmapData);
            }
            else if (value is BitmapData) {
                xml = this.bitmapDataToXml(BitmapData(value));
            }
            else if (value is String) { //Try to load URL
                var string:String = String(value);
                if (string.indexOf('<svg') == -1) {             
                    xml = null;  
                    var urlLoader:URLLoader = new URLLoader();
                    if ((string.length > 4) 
                        && (string.substr(string.length - 4).toLowerCase() == '.svg')) { //Load SVG from URL
	                    urlLoader.addEventListener(Event.COMPLETE, onSVGLoaderComplete);	                
	                    urlLoader.addEventListener(IOErrorEvent.IO_ERROR, eventRelay);
	                    urlLoader.addEventListener(SecurityErrorEvent.SECURITY_ERROR, eventRelay);
	                    urlLoader.addEventListener(ProgressEvent.PROGRESS, eventRelay);                    
	                    urlLoader.load(new URLRequest(string));
                    }
                    else { //Load image from URL
                    	var loader:Loader = new Loader();
                    	loader.contentLoaderInfo.addEventListener(Event.COMPLETE, onImageLoaderComplete);
                    	loader.contentLoaderInfo.addEventListener(IOErrorEvent.IO_ERROR, eventRelay);
                    	loader.load(new URLRequest(string));
                    }
                }
                else {
                	try {
                        xml = new XML(string);
                    }
                    catch (error:Error) {
                    	this.dispatchEvent(new IOErrorEvent(IOErrorEvent.IO_ERROR, false, false, 'Could not load SVG XML'));
                    }
                }
            }
            
            if (xml != null) {
                this.xml = xml;
            }
        }   
        
        public function get source():XML {
            if (svgRoot == null) {
                return null;
            }
            return this.xml;
        }                
        
        private function onSVGLoaderComplete(event:Event):void {
            var urlLoader:URLLoader = URLLoader(event.target);
            try {
                this.xml = new XML(urlLoader.data);
                this.dispatchEvent(event.clone());
            }
            catch (error:Error) {
            	this.dispatchEvent(new IOErrorEvent(IOErrorEvent.IO_ERROR, false, false, 'Could not load SVG XML'));
            }
        }
        
        private function onImageLoaderComplete(event:Event):void {
        	var loaderInfo:LoaderInfo = LoaderInfo(event.target);
        	try {
                this.xml = bitmapDataToXml(Bitmap(loaderInfo.content).bitmapData);
                this.dispatchEvent(event.clone());
            }
            catch (error:Error) {
            	this.dispatchEvent(new IOErrorEvent(IOErrorEvent.IO_ERROR, false, false, 'Could not load binary image: ' + loaderInfo.loaderURL));
            }
        }
        
        private function eventRelay(event:Event):void {
            this.dispatchEvent(event.clone());
        }
        
        private function bitmapDataToXml(bitmapData:BitmapData):XML {                
            var pngByteArray:ByteArray = PNGEncoder.encode(bitmapData);            
            
            var xmlString:String = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>'
                                    + '<svg width="' + bitmapData.width + '" height="' + bitmapData.height + '" viewBox="0 0 ' + 
                                    + bitmapData.width + ' ' + bitmapData.height 
                                    + '" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">'
                                    + '<g id="image"><image xlink:href="data:image/;base64,'
                                    + Base64.encode(pngByteArray)
                                    + '" /></g></svg>';     
                                    
            return new XML(xmlString);
        }
        
        override public function customizeContextMenu():void {
        	
        }
    }
}
