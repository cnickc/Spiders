/*******************************************************************************
 *
 ******************************************************************************/
var firstGo = true;
var myEdges = []; 
var name = "Wartortle";

onmessage = function ( ev ) {
	var i = 0;
	if(firstGo == true) {
		//no node.  need one
		//var curNode = findBestNode(ev.data.nodeList, ev.data);
		var curNode = findFirstNode( ev.data );
		i = findFirstEdgeOnNode( ev.data, curNode );
		firstGo = false;
	} else {
		var nodeList = findPossibleNodes(ev.data);
		var targetNode = findBestNode(nodeList, ev.data);
		i = findEdgeForTarget(targetNode, ev.data);
	}	

	myEdges.push(i);
	postMessage( { "EdgeIndex" : i } );	
};

/*******************************************************************************
 * Utility Functions
 ******************************************************************************/
 
listContains = function (list, item) {
	return list.indexOf(item) > -1;
}

findEdgeForTarget = function (target, data) {
	var expandableNodes = findExpandableNodes(data);

	for (var j = 0; j < data.edgeList.length; j++) {
		if (data.edgeOwnerList[j] == "") {
			if (listContains(expandableNodes, data.edgeList[j][1])) {
				if (data.edgeList[j][0] == target) {
					return j;
				}

			}

			if (listContains(expandableNodes, data.edgeList[j][0])) {
				if (data.edgeList[j][1] == target) {
					return j;
				}
			}
		}
	}
	
}

findExpandableNodes = function( data ) {
	var nodes = [];
	for (var i=0; i<myEdges.length; i++) {
		var edge = data.edgeList[myEdges[i]];
		var leftNode = edge[0];
		var rightNode = edge[1];

		if (data.nodeOwnerList[leftNode] == "" || data.nodeOwnerList[leftNode] == name) {
			if (!listContains(nodes, leftNode)){
				nodes.push(leftNode);
			}
		}
		if (data.nodeOwnerList[rightNode] == "" || data.nodeOwnerList[rightNode] == name) {
			if (!listContains(nodes, rightNode)){
				nodes.push(rightNode);
			}
		}
	}
	return nodes;
}

findBestNode = function(nodes, data) {
	var maxEdges = 0;
	var maxInd = 0;

	for( var i = 0; i < nodes.length; i++ ) {
		if (data.nodeOwnerList[nodes[i]] == ""|| data.nodeOwnerList[nodes[i]] == name ){
			var num = getNumEdgesOnNode(nodes[i], data);
			if (num > maxEdges){
				maxInd = nodes[i];
				maxEdges = num;
			}
		}
	}
	return maxInd;
}

findAllAdjacentNodes = function (i, data) {
	var attachedNodes = [];
	for (var j=0; j<data.edgeList.length; j++) {
		var edge = data.edgeOwnerList[j];
		var l = data.edgeList[j][0];
		var r = data.edgeList[j][1];
		if ((data.nodeOwnerList[l] == "" || data.nodeOwnerList[r] == name) && l === i){
			if (edge == "" && !listContains(attachedNodes, r)){
				attachedNodes.push(r);
			}
		} 
		if ((data.nodeOwnerList[r] == ""  || data.nodeOwnerList[r] == name) && r === i){
			if (edge == "" && !listContains(attachedNodes, l)){
				attachedNodes.push(l);
			}
		}
	}

	return attachedNodes;
} 

concatNodes = function (a, b) {
	for (var i=0; i<b.length; i++) {
		var bi = b[i];
		if (listContains(a, bi)) 
			continue;
		a.push(bi);
	}
	return a;
}

findPossibleNodes = function (data) {
	var possNodes = [];
	for( var i = 0; i < data.edgeOwnerList.length; i++ ) {
		if ( data.edgeOwnerList[i] == name ) {
			var leftNode = data.edgeList[i][0];
			var rightNode = data.edgeList[i][1];
			possNodes = concatNodes(possNodes, findAllAdjacentNodes(leftNode, data));
			possNodes = concatNodes(possNodes, findAllAdjacentNodes(rightNode, data));
		}
	}

	return possNodes;
}

findFirstNode = function( data ) {
	var N = -1;
	do {
		N = Math.floor(Math.random() * data.nodeList.length);
	} while( data.nodeOwnerList[N] != "" );
	return N;
}; 

getNumEdgesOnNode = function ( i, data ) {
	var numEdges = 0;
	for (var j=0; j<data.edgeList.length; j++) {
		if (data.edgeList[j][0] === i || data.edgeList[j][1] === i){
			if (data.edgeOwnerList[j]== ""){
				numEdges++;
			}
		}
	}

	return numEdges;
}

getNodeWithMostAvailableEdges = function ( data ) {
	var maxEdges = 0;
	var maxInd = 0;

	for( var i = 0; i < data.edgeOwnerList.length; i++ ) {
		if( data.edgeOwnerList[i] == name ) {
			var leftNode = data.edgeList[i][0];
			var rightNode = data.edgeList[i][1];

			if (data.nodeOwnerList[leftNode] == ""|| data.nodeOwnerList[leftNode] == name ){
				var num = getNumEdgesOnNode(leftNode, data);
				if (num > maxEdges){
					maxInd = leftNode;
					maxEdges = num;
				}
			}

			if (data.nodeOwnerList[rightNode] == ""|| data.nodeOwnerList[rightNode] == name ){
				var num = getNumEdgesOnNode(rightNode, data);
				if (num > maxEdges){
					maxInd = rightNode;
					maxEdges = num;
				}
			}
		}
	}
	return maxInd;
}

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
