/*******************************************************************************
 *
 ******************************************************************************/
var curNode = -1;
var myEdges = []; 
var name = "Kingler";

onmessage = function ( ev ) {
	
	if(curNode == -1) {
		//no node.  need one
		curNode = findFirstNode( ev.data );
	} else {
		curNode = getLowestAvailableNode( ev.data );
	}
	
	var i = findFirstEdgeOnNode( ev.data, curNode );
	setTimeout( function() {
		postMessage( { "EdgeIndex" : i } );	
	}, 1);
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
