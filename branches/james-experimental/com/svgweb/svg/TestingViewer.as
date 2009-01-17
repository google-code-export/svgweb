package com.svgweb.svg
{
	import com.svgweb.svg.nodes.SVGSVGNode;
	
	import flash.display.StageDisplayState;
	import flash.events.Event;
	import flash.events.IOErrorEvent;
	import flash.events.MouseEvent;
	import flash.net.URLLoader;
	import flash.net.URLRequest;

    [SWF(frameRate="24", width="2048", height="1024")]
	public class TestingViewer extends SVGViewer
	{
		public var svg:SVGSVGNode;
		private var loader:URLLoader;
		private var url:String = null;
		
		public function TestingViewer() {
			super();
			svg = new SVGSVGNode();
			this.addChild(svg);
			this.addEventListener(Event.ADDED_TO_STAGE, onAddedToStage);
			this.addEventListener(MouseEvent.CLICK, onMouseClick);			
		}
		
		public function onMouseClick(event:MouseEvent):void {
			try {
				if (stage.displayState == StageDisplayState.NORMAL) {
	                this.stage.displayState = StageDisplayState.FULL_SCREEN;
				} else { 
	                this.stage.displayState = StageDisplayState.NORMAL;
				}
			}
			catch (error:Error) {
				trace("Could not initiate full screen. Make sure it is enabled in the HTML Flash parameters.");
				trace(error.message);
			}
			
		}
		
		public function onAddedToStage(event:Event):void {
			this.removeEventListener(Event.ADDED_TO_STAGE, onAddedToStage);		
				 
            if ((this.svg.xml == null) && this.root.loaderInfo.parameters.hasOwnProperty('svgURL')) {
                loadURL(this.root.loaderInfo.parameters.svgURL);
            }
		}
		
		public function loadURL(url:String):void {
			this.url = url;
			loader = new URLLoader();
			loader.load(new URLRequest(url));
            loader.addEventListener(Event.COMPLETE, onComplete);
            loader.addEventListener(IOErrorEvent.IO_ERROR, onIOError);
		}
		
		public function onComplete(event:Event):void {
			svg.xml = new XML(loader.data);
			loader = null;
		}
		
		public function onIOError(event:IOErrorEvent):void {
            trace("IOError: " + event.text);
            loader = null;
        }
		
		
		
	}
}