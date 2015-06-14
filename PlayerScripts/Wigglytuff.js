/*******************************************************************************
 *
 ******************************************************************************/
var curNode = -1;
var myEdges = []; 
var name = "Wigglytuff";

onmessage = function ( ev ) {
	var i;
	if(curNode == -1) {
		//no node.  need one
		curNode = findLastNode( ev.data );
		i = findFirstEdgeOnNode(ev.data,curNode);
	} else {
		curNode = getLowestAvailableNode( ev.data );
		i = findBestEdgeOnNode(ev.data,curNode);
	}
	
	postMessage( { "EdgeIndex" : i } );	
};

/*******************************************************************************
 * Utility Functions
 ******************************************************************************/
 
findFirstNode = function( data ) {
	var N = -1;
	do {
		N = Math.floor(Math.random() * data.nodeList.length);
	} while( data.nodeOwnerList[N] != "" );
	return N;
}; 

findLastNode = function(data ){
	var N = data.nodeList.length;
	do {
		N--;
	} while( data.nodeOwnerList[N] != "" );
	return N;
};

findCenterNode = function( data ) {
	var besti=0;
	var bestdist=999999;
	for(var i = 0; i < data.nodeList.length; i++)
	{
		var node = data.nodeList[i];
		var dist = calcdist(node,[300,300]);
		if(bestdist>dist)
		{
			besti=i;
			bestdist=dist;
		}
	}
	if(data.nodeOwnerList[besti] == "")
	{
		return besti;
	}
	else
	{
		var N = -1;
		do {
			N = Math.floor(Math.random() * data.nodeList.length);
		} while( data.nodeOwnerList[N] != "" );
		return N;
	}
};

var counts = null;
var gridwidth=4;
var bestacross=-1;
var bestdown=-1;
var bestcountOccupied=999999;
var xbest=-1;
var ybest=-1;

buildcounts = function(data) {
	counts= [];
	for(var i = 0; i < gridwidth; i++)
	{
		counts.push([]);
		for(var j = 0; j < gridwidth; j++)
		{
			counts[i].push({nodelist:[],nodeindexlist:[],countOccupied:0});
		}
	}
	for(var i = 0; i < data.nodeList.length; i++)
	{
		var node = data.nodeList[i];
		var x = node[0];var y = node[1];
		var across = Math.floor(x/(600/gridwidth)); //eg. 1
		var down = Math.floor(y/(600/gridwidth)); //eg. 0
		counts[across][down].nodelist.push(data.nodeList[i]);
		counts[across][down].nodeindexlist.push(i);
	}
};

updatecounts = function(data) {
	for(var i = 0; i < counts.length; i++)
	{
		for(var j=0; j < counts[i].length; j++)
		{
			counts[i][j].countOccupied=0;
			for(var z = 0 ; z < counts[i][j].nodeindexlist.length; z++)
			{
				var nodeindex = counts[i][j].nodeindexlist[z];
				var owner = data.nodeOwnerList[nodeindex];
				if(owner != "")
				{
					counts[i][j].countOccupied++;
				}
			}
		}
	}
}

//bestacross,bestdown
setbestacrossbestdown = function()
{
	bestdown=-1;
	bestacross=-1;
	bestcountOccupied=999999;
	for(var i = 0; i < counts.length; i++)
	{
		for(var j=0; j < counts[i].length; j++)
		{
			var numberNodes = counts[i][j].nodeindexlist.length;
			var countOccupied = counts[i][j].countOccupied;
			if(numberNodes>0)
			{
				if(bestcountOccupied>countOccupied)
				{
					bestacross=i;
					bestdown=j;
					bestcountOccupied=countOccupied;
				}
			}
		}
	}
	//at end of all this we have a min occupied across/down
}

calcdist=function(nodexy,bestxy){
	return (nodexy[0]-bestxy[0])*(nodexy[0]-bestxy[0]) +  (nodexy[1]-bestxy[1])*(nodexy[1]-bestxy[1]);
};

getLowestAvailableNode = function( data ) {
	//find all available nodes that I can reach
	var nodes = [];
	for( var i = 0; i < data.edgeOwnerList.length; i++ ) {
		if( data.edgeOwnerList[i] == name ) {
			//check left node
			var l = data.edgeList[i][0];
			if( data.nodeOwnerList[l] == "" || data.nodeOwnerList[l] == name ) {
				nodes.push( l );
			}
			//check right node
			var r = data.edgeList[i][1];
			if( data.nodeOwnerList[r] == "" || data.nodeOwnerList[r] == name ) {
				nodes.push( r );
			}
		}
	}
	nodes.sort(function(a,b){return a - b});
	//////////////////////////////////////
	//////////////////////////////////////

	if(counts == null)
	{
		buildcounts( data );
	}

	updatecounts( data );

	setbestacrossbestdown( );

	//we now have bestacross,bestdown (i.e. least occupied region)

	var firstnodeinbest=counts[bestacross][bestdown].nodelist[0];
	xbest=firstnodeinbest[0];
	ybest=firstnodeinbest[1];


	var rankednodes = [];
	for( var i = 0; i < nodes.length; i++ ) {
		if( hasAvailableEdge( nodes[i], data )){
			var nodeindex = nodes[i];
			var dist = calcdist( data.nodeList[nodeindex],[xbest,ybest] );
			rankednodes.push( {nodeindex: nodes[i], distancebest: dist} );
		}
	}
	if(rankednodes.length>0)
	{
		//console.log("ranked");
		rankednodes.sort(function(a,b){return a.distancebest - b.distancebest});
		return rankednodes[0].nodeindex;

	}

	for( var i = 0; i < nodes.length; i++ ) {
		if( hasAvailableEdge( nodes[i], data )){
			return nodes[i];
		}
	}
	return -1;
};

hasAvailableEdge = function( n, data ) {
	var chk = findFirstEdgeOnNode( data, n );
	if( chk >= data.edgeList.length ) {
		return false;
	}
	return true;
};

findBestEdgeOnNode = function( data, N ) {
	var ret = -1;
	var candidateEdges = [];
	for(var i = 0; i < data.edgeList.length; i++)
	{
		if((data.edgeList[i][0] == N || data.edgeList[i][1] == N) && data.edgeOwnerList[i] == "") {
			var dist0 = calcdist(data.nodeList[data.edgeList[i][0]], [xbest,ybest]);
			var dist1 = calcdist(data.nodeList[data.edgeList[i][1]], [xbest,ybest]);
			var dist=0;
			if(dist0<dist1)
				dist=dist0;
			else
				dist=dist1;
			candidateEdges.push( {edge:i,dist:dist} );
		}
	}
	candidateEdges.sort(function(a,b){return a.dist - b.dist});
	if(candidateEdges.length>0)
	{
		return candidateEdges[0].edge;
	}
	
	return -1;
};

findFirstEdgeOnNode = function( data, N ) {
	var i = -1;
	do {
		i++;
		if( data.edgeList[i][0] > N ) {
			i = data.edgeList.length;
			break;
		}
		if((data.edgeList[i][0] == N || data.edgeList[i][1] == N) && data.edgeOwnerList[i] == "") {
			break;
		}
	} while( i < data.edgeList.length - 1);

	return i;
};
