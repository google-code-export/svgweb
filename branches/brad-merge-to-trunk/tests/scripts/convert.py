#!/usr/bin/python

import glob
import os
import re
import sys

for filename in glob.glob("../htmlObjectHarness/*.html"):
    if filename == "../htmlObjectHarness/tiny-index.html":
        continue
    if filename == "../htmlObjectHarness/basic-index.html":
        continue
    if filename == "../htmlObjectHarness/full-index.html":
        continue

    infile = open (filename, "r")
    outfile = open (filename + ".new", "w")
    content = infile.read()

    content = re.sub("../../html/svgviewer.js", "../../src/svg.js", content)
    content = re.sub("<script", """<meta name="svg.render.forceflash" content="true" />\n    <script""", content)

    svgfilename = re.sub("\.html", ".svg", filename)
    svgfilename = re.sub("../htmlObjectHarness/full-", "", svgfilename)
    svgfilename = re.sub("../htmlObjectHarness/tiny-", "", svgfilename)
    svgfilename = re.sub("../htmlObjectHarness/basic-", "", svgfilename)

    newobject= """
    <!--[if IE]>
    <object id="testSVG" src="../svg/""" + svgfilename + """" classid="image/svg+xml" width="460" height="380">
    <![endif]-->
    <!--[if !IE]>-->
    <object data="../svg/""" + svgfilename + """" type="image/svg+xml" 
            id="testSVG" width="460" height="380">
    <!--<![endif]-->
    <p>SVG fallback content</p>
    </object>

    """

    content = re.sub("\n<object.*\n.*\n.*\n.*\n.*\n.*\n.*\n.*\n.*\n.*\n.*\n", newobject, content)

    outfile.write(content)
    outfile.close()
    infile.close()
    os.rename(filename +".new", filename)
