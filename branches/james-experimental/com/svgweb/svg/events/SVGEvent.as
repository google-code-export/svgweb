package com.svgweb.svg.events
{
	import flash.events.Event;

	public class SVGEvent extends Event
	{
		public static const LOADED:String = "svg loaded";
		
		public function SVGEvent(type:String, bubbles:Boolean=false, cancelable:Boolean=false)
		{
			super(type, bubbles, cancelable);
		}
		
	}
}