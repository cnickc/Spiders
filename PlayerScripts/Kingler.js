/*******************************************************************************
 * Team Creative
 ******************************************************************************/
var curNode = -1;
var data;
var myEdges = [];
var name = "Kingler";

var curCycleNodeCount = 0;
var prevNodeSize = 0;

onmessage = function ( ev ) {

	data = ev.data;

	if(curNode == -1) {
		//no node.  need one
		curNode = findFirstNode( );
	} else {
		if( curCycleNodeCount < 5) {
			curNode = getLowestAvailableNode( );
		}else{
			curNode = findLongestEdge(curNode );
		}
	}

		var i = findFirstEdgeOnNode( curNode );
		postMessage( { "EdgeIndex" : i } );

	pwnedNodesCount();
	getAdjNodes(curNode);

};


/*******************************************************************************
 * Utility Functions
 ******************************************************************************/

function findFirstNode( ) {
	var N = data.nodeList.length;
	do {
		N = N-1;
	} while( data.nodeOwnerList[N] != "" );
	return N;
};

function getLowestAvailableNode( ) {
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
		if( hasAvailableEdge( nodes[i])){
			return nodes[i];
		}
	}
	return -1;
};

function getGreaterAvailableNode( ) {
	//find all available nodes that I can reach
	var nodes = [];
	for( var i = data.edgeOwnerList.length -1; i >= 0 ; i-- ) {
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
		if( hasAvailableEdge( nodes[i] )){
			return nodes[i];
		}
	}
	return -1;
};

/**
 *
 * @param n  NODE
 * @param data
 * @returns {boolean}
 */

function hasAvailableEdge( n ) {
	var chk = findFirstEdgeOnNode( n );
	if( chk >= data.edgeList.length ) {
		return false;
	}
	return true;
};

function pwnedNodesCount( ){
	var nodesCount = 0;
	for( var i = data.nodeOwnerList.length - 1; i >=0 ; i-- ) {
		if( data.nodeOwnerList[i] == "Kingler" ) {
			nodesCount++;
			if(nodesCount > prevNodeSize){
				break;
			}
		}
	}
	if( nodesCount > prevNodeSize){
		curCycleNodeCount++;
		prevNodeSize = nodesCount;
		// console.log(curCycleNodeCount);
	}
}

function getAdjNodes(n ){
	var adjNodeList = [];
	for( var i = data.edgeList.length - 1; i >=0 ; i-- ) {
		if( data.edgeList[i][0] == n && data.nodeOwnerList[data.edgeList[i][1]] == "") {
			adjNodeList.push(data.edgeList[i][1]);
			break;
		}else if( data.edgeList[i][1] == n && data.nodeOwnerList[data.edgeList[i][0]] == "") {
			adjNodeList.push(data.edgeList[i][0]);
			break;
		}
	}
	return adjNodeList;
}


/**
 *
 * @param data
 * @param N   NODE INDEX
 * @returns {number}
 */
findFirstEdgeOnNode = function(N ) {
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

findLastEdgeOnNode = function( N ) {
	var i = data.edgeList.length;
	do {
		i--;

		if( data.edgeList[i][0] < 0) {
			i = 0;
			break;
		}
		if((data.edgeList[i][0] == N || data.edgeList[i][1] == N) && data.edgeOwnerList[i] == "") {
			break;
		}
	} while( i > 0);

	return i;
};

function findLongestEdge(N) {
	var gimme = getGreaterAvailableNode();
	var nEdgeLen = 0;
		for(var j=data.length-1; j >=0; j--) {

			if (data.edgeList[j][0] == N || data.edgeList[j][i] == N) {
				var newNEdgeLen = Math.abs((data.edgeList[j][0][0] - data.edgeList[j][1][0]) +
					(data.edgeList[j][0][1] - data.edgeList[j][1][1]));
				if(newNEdgeLen >= nEdgeLen) {
					if(data.edgeList[j][0] == N && data.nodeOwnerList[data.edgeList[j][1]] == ""){	gimme = data.edgeList[j][1]; }
					else if(data.edgeList[j][1] == N && data.nodeOwnerList[data.edgeList[j][0]] == ""){	gimme = data.edgeList[j][0]; }
					nEdgeLen = newNEdgeLen;
				}
			}
		}
	return gimme;

}
