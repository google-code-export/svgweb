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

package com.sgweb.svg.core
{
	import com.sgweb.svg.nodes.SVGSVGNode;

	public class SVGAnimation extends SVGNode
	{
		
		private var timeOffset:int = 0;
		
		public function SVGAnimation(svgRoot:SVGSVGNode, xml:XML=null, original:SVGNode=null)
		{
			super(svgRoot, xml, original);
		}
		
		public function render(time:int):void {
			
		}		
		
		//SMIL interface
		public function begin():void {
			
		}
		
		public function begintAt(offset:int):void {
			
		}
		
		public function end():void {
			
		}
		
		public function endAt(offset:int):void {
			
		}
		
		
	}
}