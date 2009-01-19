package com.svgweb.svg
{
	
	import mx.core.UIComponent;

	public class SVGViewerFlex extends UIComponent
	{
		var viewer:SVGViewerFlash;
		public function SVGViewerFlex()
		{
			super();
			viewer = new SVGViewerFlash();
			this.addChild(viewer);
		}
		
	}
}