QUnit.module( "WebData DataStructure Tests", {
	beforeEach: function() {
		//create a K3,3 graph
		nodes = [[0,0],[1,0],[2,0],[0,1],[1,1],[2,1]];
		edges = [[0,3],[0,4],[0,5],[1,3],[1,4],[1,5],[2,3],[2,4],[2,5]]	
		webdata = new WebData(nodes, edges);
	},
	afterEach: function() {
		webdata = null;
	}
});

QUnit.test( "WebData contains node information", function( assert ) {
	assert.ok(webdata.nodeList, "nodeList attribute exists");
	assert.deepEqual(
		webdata.nodeList, 
		nodes, 
		"webdata must contain the same node information it was given"
	);
	assert.notEqual(
		webdata.nodeList, 
		nodes, 
		"webdata must not have the same node object that was supplied"
	);
});

QUnit.test( "WebData contains edge information", function( assert ) {
	assert.ok(webdata.edgeList, "edgeList attribute exists");
	assert.deepEqual(
		webdata.edgeList, 
		edges, 
		"webdata must contain the same edge information it was given"
	);
	assert.notEqual(
		webdata.edgeList, 
		edges, 
		"webdata must not have the same edge object that was supplied"
	);
});

QUnit.test( "WebData contains node-owner information", function( assert ) {
	assert.ok(webdata.nodeOwnerList, "nodeOwnerList attribute exists");
	assert.equal(
		webdata.nodeOwnerList.join(""), 
		"", 
		"node-owner data must be initialized as empty"
	);
});

QUnit.test( "WebData contains edge-owner information", function( assert ) {
	assert.ok(webdata.edgeOwnerList, "edgeOwnerList attribute exists");
	assert.equal(
		webdata.edgeOwnerList.join(""), 
		"", 
		"edge-owner data must be initialized as empty"
	);
});

QUnit.test( "GetData returns web data", function( assert ) {
	var data = webdata.GetData();
	assert.deepEqual(data.nodeList, nodes, "should have same list of nodes");
	assert.deepEqual(data.edgeList, edges, "should have the same list of edges");
	assert.ok( data.edgeOwnerList, "should have an edgeOwnerList property");
	assert.ok( data.nodeOwnerList, "should have an nodeOwnerList property");
});

QUnit.test( "AssignEdge assigns edge to string if unowned", function( assert ) {
	webdata.AssignEdge("Test", 0);
	assert.equal(webdata.edgeOwnerList[0], "Test", "Edge should be owned by 'Test'");
});

QUnit.test( "AssignEdge should not change owners if already owned", function( assert ) {
	webdata.AssignEdge("Test", 0);
	assert.equal(webdata.edgeOwnerList[0], "Test", "Edge should be owned by 'Test'");
	webdata.AssignEdge("Invalid", 0);
	assert.equal(webdata.edgeOwnerList[0], "Test", "Edge should still be owned by 'Test'");
});

QUnit.test( "NumberOfEdgesOwnedByPlayer should return 0 if no edges owned", function( assert ) {
	assert.equal(webdata.NumberOfEdgesOwnedByPlayer("Test"), 0, "Player should not own any edges");
});

QUnit.test( "NumberOfEdgesOwnedByPlayer should return number of edges owned", function( assert ) {
	webdata.AssignEdge("Test", 0);
	webdata.AssignEdge("Test", 1);
	assert.equal(webdata.NumberOfEdgesOwnedByPlayer("Test"), 2, "Player should own 2 edges");
});

QUnit.test( "PlayerHasAdjacentEdgeAtNodeIndex should return false if no adjacent edges owned by player", function( assert ) {
	webdata.AssignEdge("Test", 0);
	assert.equal(webdata.PlayerHasAdjacentEdgeAtNodeIndex("Test",2), false, "No adjacent edges should be owned by player");
});

QUnit.test( "PlayerHasAdjacentEdgeAtNodeIndex should return true if adjacent edges owned by player", function( assert ) {
	webdata.AssignEdge("Test", 0);
	assert.ok(webdata.PlayerHasAdjacentEdgeAtNodeIndex("Test",3), "should have owned adjacent edges");
});

QUnit.test( "AssignNodes does nothing if two adjacent edges are not owned", function( assert ) {
	webdata.AssignNodes("Test", 0);
	assert.equal(webdata.NumberOfNodesOwnedByPlayer("Test"), 0, "nodes should be unowned");
});

QUnit.test( "AssignNode fails if two adjacent edges are not owned", function( assert ) {
	webdata.AssignEdge("Test",0);
	webdata.AssignEdge("Test",1);
	webdata.AssignNodes("Test", 1);
	assert.equal(webdata.NumberOfNodesOwnedByPlayer("Test"), 1, "nodes should be unowned");
	assert.equal(webdata.nodeOwnerList[0], "Test", "nodes should be unowned by Test");
});

QUnit.test( "GetEdgesOwnedByPlayer is empty if player owns no edges", function( assert ) {
	assert.deepEqual(webdata.GetEdgesOwnedByPlayer("Test"), [], "no edges should be owned");
});

QUnit.test( "GetEdgesOwnedByPlayer reports correct edges", function( assert ) {
	webdata.AssignEdge("Test",0);
	webdata.AssignEdge("Test",1);	
	assert.deepEqual(webdata.GetEdgesOwnedByPlayer("Test"), [0,1], "edges should be owned");
});

QUnit.test( "GetNodesOwnedByPlayer is empty if player owns no nodes", function( assert ) {
	assert.deepEqual(webdata.GetNodesOwnedByPlayer("Test"), [], "no nodes should be owned");
});

QUnit.test( "GetNodesOwnedByPlayer reports correct nodes", function( assert ) {
	webdata.AssignEdge("Test",0);
	webdata.AssignEdge("Test",3);	
	webdata.AssignNodes("Test", 3);
	assert.deepEqual(webdata.GetNodesOwnedByPlayer("Test"), [3], "nodes should be owned");
});
