function UIObserver ( renderer, cmap) {
	this.renderer = renderer;
	this.colormap = cmap;
	var linewidthOpen = 1;
	var linewidthOwned = 7;
	var dotradiusOpen = 3;
	var dotradiusOwned = 7;
	
		
	this.EndOfTurnNotification = function( webData, playerData ) {
		var c = this.colormap.none || "#777777";
		this.renderer.Clear();
		this.renderer.DrawEdges(webData.nodeList, webData.edgeList, c, linewidthOpen, 0.9);
		this.renderer.DrawVertices(webData.nodeList, c, dotradiusOpen, 0.9);
		for( var i = 0; i < webData.edgeOwnerList.length; i++ ) {
			if(webData.edgeOwnerList[i] == "") {
				continue;
			}
			this.renderer.DrawEdge(webData.nodeList, webData.edgeList[i], this.colormap[webData.edgeOwnerList[i]], linewidthOwned, 0.3);
		}
		for( var i = 0; i < webData.nodeOwnerList.length; i++ ) {
			if(webData.nodeOwnerList[i] == "") {
				continue;
			}
			this.renderer.DrawVertex(webData.nodeList[i], this.colormap[webData.nodeOwnerList[i]], dotradiusOwned, 0.5);
		}
	};
	
	this.EndOfGameNotification = function( webData, playerData ) {
		;
	};
};