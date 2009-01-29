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

package com.sgweb.svg.utils
{
	import com.sgweb.svg.core.SVGAnimation;
	import com.sgweb.svg.nodes.SVGSVGNode;
	
	import flash.events.Event;
	import flash.utils.getTimer;
		
	public class AnimationManager
	{
		public var startTime:int;
		
		private var svgRoot:SVGSVGNode;
		private var animations:Array;
		
		public function AnimationManager(svgRoot:SVGSVGNode)
		{
			this.svgRoot = svgRoot;
			animations = new Array();
		}
		
		public function register(node:SVGAnimation):void {
			if (animations.indexOf(node) == -1) {
				animations.push(node);
			}
		}
		
		public function unregister(node:SVGAnimation):void {
            var index:int = animations.indexOf(node);
            if (index > -1) {
            	animations = animations.splice(index, 1);
            }
        }
        
        public function start():void {
        	startTime = getTimer();
        	this.svgRoot.addEventListener(Event.ENTER_FRAME, onEnterFrame);
        }
        
        public function stop():void {
            this.svgRoot.removeEventListener(Event.ENTER_FRAME, onEnterFrame);
        }
        
        private function onEnterFrame(event:Event):void {
        	var currentTime:int = getTimer();
        	
        	for (var i:uint = 0; i < animations.length; i++) {
        	   	SVGAnimation(animations[i]).render(currentTime);
        	}
        }        

	}
}