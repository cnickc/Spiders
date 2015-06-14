/*******************************************************************************
 *
 ******************************************************************************/
var curNode = -1;
var myEdges = []; 
var name = "Snorlax";
var maxRecursion = 1;

var enemyNodes = [];
var enemyConnectedNodes = [];
var myConnectingNodes = [];

onmessage = function ( ev ) {
    var edgeIndex = 0;
    var currentBestNode;
    var fromNode;

	if(curNode == -1) {
		//no node.  need one
		curNode = findFirstNode( ev.data );

        findEnemyNodes(ev.data);
        findEnemyConnectedNodes(ev.data);
        edgeIndex = findFirstEdgeOnNode( ev.data, curNode );

	} else {
        findMyConnectedNodes(ev.data);

        var currentScore = -1;

        for(var j = 0; j < myConnectingNodes.length; j++) {

            var connectedNodes = findConnectingNodes(myConnectingNodes[j], ev.data);

            for(var g = 0; g < connectedNodes.length; g++){

                var nodeScore = findNodeScores(connectedNodes[g], ev.data, 0);

                if(nodeScore > currentScore){
                    fromNode = myConnectingNodes[j];
                    currentBestNode = connectedNodes[g];
                    currentScore = nodeScore;
                }
            }
        }

        edgeIndex = findEdgeForConnectingNodes(fromNode, currentBestNode, ev.data);
	}

	postMessage( { "EdgeIndex" : edgeIndex } );
};

/*******************************************************************************
 * Utility Functions
 ******************************************************************************/
distanceBetweenNodes = function (a, b) {
    var xDiff = a[0] - b[0];
    var yDiff = a[1] - b[1];
    var c = Math.sqrt( xDiff*xDiff + yDiff*yDiff );
    return Math.sqrt( xDiff*xDiff + yDiff*yDiff );
};


findFirstNode = function( data ) {
    findEnemyConnectedNodes(data);
    var currentBestScore = 0;
    var currentBestNode = -1;
    for(var i = 0; i < data.nodeList.length; i++) {
        var thisScore = 0;
        for(var j = 0; j < enemyConnectedNodes.length; j++){
            thisScore += distanceBetweenNodes(data.nodeList[i], data.nodeList[enemyConnectedNodes[j]]);
        }
        thisScore /= enemyConnectedNodes.length;
        if(thisScore > currentBestScore){
            currentBestScore = thisScore;
            currentBestNode = i;
        }
    }

    if(currentBestNode){
        return Math.floor(data.nodeList.length / 2);
    }
    return currentBestNode;
};

findEdgeForConnectingNodes = function(node1, node2, data){

  for(var i = 0; i < data.edgeList.length; i++) {
      if ((data.edgeList[i][0] === node1 && data.edgeList[i][1] === node2) || (data.edgeList[i][1] === node1 && data.edgeList[i][0] === node2 )) {
          return i;
      }
  }return 0;
};

findEnemyNodes = function(data) {
    for(var i = 0; i < data.nodeOwnerList.length; i++){
        if(data.nodeOwnerList[i] != "" && data.nodeOwnerList[i] != name){
            this.enemyNodes.push(data.nodeList[i]);
        }
    }
}

findEnemyConnectedNodes = function(data) {
    for(var i = 0; i < data.edgeOwnerList.length; i++){
        if(data.edgeOwnerList[i] != "" && data.edgeOwnerList[i] != name){
            enemyConnectedNodes.push(data.edgeList[i][0]);
            enemyConnectedNodes.push(data.edgeList[i][1]);
        }
    }
}

findMyConnectedNodes = function(data) {
    for(var i = 0; i < data.edgeOwnerList.length; i++){
        if(data.edgeOwnerList[i] == name){
            if(!myConnectingNodes[data.edgeList[i][0]]) {
                myConnectingNodes.push(data.edgeList[i][0]);
            }
            if(!myConnectingNodes[data.edgeList[i][1]]) {
                myConnectingNodes.push(data.edgeList[i][1]);
            }
        }
    }
}

findNodeScores = function(node, data, level){
    var nodeScore = calcNodeScore(node, data);

    if(level <= maxRecursion){
        var connectedNodes = findConnectingNodes(node, data);

        for (var i = 0; i < connectedNodes.length; i++) {
            nodeScore += findNodeScores(connectedNodes[i], data, level + 1);
        }
    }

    //console.log('level' + level + 'node: ' + node + 'nodeScore: ' + nodeScore);
    return nodeScore;
}

calcNodeScore = function(node, data){
    if(data.nodeOwnerList[node] != ''){
       return -9999;
    }

    return Math.floor(Math.random() * 10);
}

findConnectingNodes = function(node, data) {
    var nodes = [];

    for(var i = 0; i < data.edgeList.length; i++){
        var edge = data.edgeList[i];
        if(edge[0] == node){
            if(data.edgeOwnerList[i] == "" && data.nodeOwnerList[edge[1]] == ""){
                nodes.push(edge[1]);
            }
        }
        else if(edge[1] == node){
            if(data.edgeOwnerList[i] == "" && data.nodeOwnerList[edge[0]] == ""){
                nodes.push(edge[0]);
            }
        }
    }

    return nodes;
}

isEdgeOwned = function(edge, data){
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

    //choosing which node through sort
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
