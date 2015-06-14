function WebData ( nodes, edges ) {
	this.nodeList = [];
	for( var i = 0; i < nodes.length; i++ ) {
		this.nodeList.push(nodes[i].slice(0));
	}
	
	this.edgeList = [];
	for( var i = 0; i < edges.length; i++ ) {
		this.edgeList.push(edges[i].slice(0));
	}
	
	this.nodeOwnerList = [];
	for( var i = 0; i < nodes.length; i++ ) {
		this.nodeOwnerList.push("");
	}
	
	this.edgeOwnerList = [];
	for( var i = 0; i < edges.length; i++ ) {
		this.edgeOwnerList.push("");
	}
	
	this.EdgeOwnerByIndex = function( i ) {
		return this.edgeOwnerList[i];
	}
	
	this.NodeOwnerByIndex = function( i ) {
		return this.nodeOwnerList[i];
	}
	
	this.NumberOfPlayerOwnedEdgesAtNode = function( player, nodeIdx ) {
		var ctr = 0;
		for( var i = 0; i < this.edgeList.length; i++ ) {
			if( (this.edgeList[i][0] == nodeIdx || this.edgeList[i][1] == nodeIdx)
				&& this.edgeOwnerList[i] == player ) {
				ctr++;	
			}
		}
		return ctr;
	}
	
	this.PlayerHasAdjacentEdgeAtNodeIndex = function( player, nodeIdx ) {
		return (this.NumberOfPlayerOwnedEdgesAtNode(player, nodeIdx) > 0);
	}
	
	this.NumberOfEdgesOwnedByPlayer = function( playerName ) {
		var ctr = 0;
		for( var i = 0; i < this.edgeOwnerList.length; i++ ) {
			if( this.edgeOwnerList[i] == playerName ) {
				ctr++;
			}
		}
		return ctr;
	}

	this.NumberOfNodesOwnedByPlayer = function( playerName ) {
		var ctr = 0;
		for( var i = 0; i < this.nodeOwnerList.length; i++ ) {
			if( this.nodeOwnerList[i] == playerName ) {
				ctr++;
			}
		}
		return ctr;
	}
	
	this.AssignEdge = function( playerName, selectedEdgeId ){
		if( this.edgeOwnerList[selectedEdgeId] == "" ) {
			this.edgeOwnerList[selectedEdgeId] = playerName;	
		}
		return;
	}
	
	this.AssignNodes = function( playerName, selectedEdgeId ){
		var edge = this.edgeList[selectedEdgeId];
		var n1 = edge[0];
		var n2 = edge[1];
		
		if( this.nodeOwnerList[n1] == "" &&
			this.NumberOfPlayerOwnedEdgesAtNode( playerName, n1 ) >= 2 ) {
			this.nodeOwnerList[n1] = playerName;
		}
		if( this.nodeOwnerList[n2] == "" &&
			this.NumberOfPlayerOwnedEdgesAtNode( playerName, n2 ) >= 2 ) {
			this.nodeOwnerList[n2] = playerName;
		}
	}
	
	this.GetData = function() {
		return {	
			'nodeList':this.nodeList,
			'nodeOwnerList':this.nodeOwnerList,
			'edgeList':this.edgeList,
			'edgeOwnerList':this.edgeOwnerList
		};
	}
	
	this.GetEdgesOwnedByPlayer = function( player ) {
		var ownedEdges = [];
		for( var i = 0; i < this.edgeOwnerList.length; i++ ) {
			if( this.edgeOwnerList[i] == player ) {
				ownedEdges.push( i );
			}
		}
		return ownedEdges;		
	};

	this.GetNodesOwnedByPlayer = function( player ) {
		var ownedNodes = [];
		for( var i = 0; i < this.nodeOwnerList.length; i++ ) {
			if( this.nodeOwnerList[i] == player ) {
				ownedNodes.push( i );
			}
		}
		return ownedNodes;		
	};

	
};