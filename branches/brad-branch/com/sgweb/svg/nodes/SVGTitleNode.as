/*
Copyright (c) 2008 James Hight
Copyright (c) 2008 Richard R. Masters, for his changes.

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/

package com.sgweb.svg.nodes
{
    /**
     * Title of SVG
     **/
    public class SVGTitleNode extends SVGNode
    {
        
        private var _title:String = "";
        
        public function SVGTitleNode(svgRoot:SVGRoot, xml:XML)
        {
            super(svgRoot, xml);
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
            if (this._xml.text())) {
                this._title = this._xml.text().toString();
            }
        }
        
        override protected function setAttributes():void {
            super.setAttributes();
            this.svgRoot.title = this._title;
        }
        
    }
}
