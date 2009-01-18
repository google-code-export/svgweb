package com.svgweb.svg
{
	import flash.display.Sprite;

	public class SVGViewer extends Sprite
	{
		public function SVGViewer() {
			super();
		}
		
		public function getWidth():Number {
			return this.stage.stageWidth;
		}
		
		public function getHeight():Number {
			return this.stage.stageHeight;
		}
		
		
	}
}