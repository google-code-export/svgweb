# To use the examples, copy the html, swf, and svg files to your web server directory.

com/sgweb/svg/build/svgviewer.swf: com/svgweb/svg/TestingViewer.as com/svgweb/svg/nodes/*.as com/svgweb/svg/core/*.as com/svgweb/svg/utils/*.as
	(cd com/svgweb/svg;mxmlc -output build/svgviewer.swf -use-network=false -compiler.source-path ../../../ -- TestingViewer.as)
	cp com/svgweb/svg/build/svgviewer.swf ../james-branch/testing/SvgViewer.swf	

clean:
	rm -f com/sgweb/svg/build/*


