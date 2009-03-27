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

package com.sgweb.svg.nodes
{
    import com.sgweb.svg.core.SVGNode;

    /**
     * Title of SVG
     **/
    public class SVGTitleNode extends SVGNode
    {
        
        private var _title:String = "";
        
        public function SVGTitleNode(svgRoot:SVGSVGNode, xml:XML, original:SVGNode = null):void {
            super(svgRoot, xml, original);
        }
        
        override public function getText():String {
            return this._xml.text().toString();
        }
        
        override public function setText(newValue):String {
            if (newValue !== null) {
                this._xml.setChildren(newValue);
                this._title = newValue;
                return newValue;
            } else {
                this._xml.setChildren(null);
                this._title = "";
                return "";
            }
        }
        
        override public function hasText():Boolean {
            return true;
        }

        override protected function parse():void {
            this._title = '';
            
            if (this._xml.text().length() > 0) {
                this._title = this._xml.text().toString();
            }
        }
        
        override protected function setAttributes():void {
            super.setAttributes();
            this.svgRoot.title = this._title;
        }
    }
}
