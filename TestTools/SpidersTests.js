

QUnit.module( "Spiders Game Logic Tests", {
	beforeEach: function() {
		//create a K3,3 graph
		nodes = [[0,0],[1,0],[2,0],[0,1],[1,1],[2,1]];
		edges = [[0,3],[0,4],[0,5],[1,3],[1,4],[1,5],[2,3],[2,4],[2,5]]	
		webdata = new WebData(nodes, edges);
		
		//create a mock player
		player = new Player( "uno" );
		
		//create a mock game
		Spiders.InitializeGame( nodes, edges );
		Spiders.InitializePlayers( [player] );
		Spiders.currentPlayer = player;
	},
	afterEach: function() {
		;
	}
});

QUnit.test( "First move is allowable at any non-owned edge", function( assert ) {
	selectedEdge = 3;
	assert.equal(
		Spiders.webData.EdgeOwnerByIndex(selectedEdge), 
		"", 
		"edge should be unowned at start"
	);
	Spiders.PerformPlayerMove( player, selectedEdge );
	assert.equal( 
		Spiders.webData.EdgeOwnerByIndex(selectedEdge), 
		"uno", 
		"player should now own this edge"
	);
	assert.ok( 
		player.IsActive(),
		"player should remain active"
	);	
});

QUnit.test( "contiguous moves should succeed", function( assert ) {
	firstEdge = 0;
	contiguousEdge = 3;
	Spiders.PerformPlayerMove( player, firstEdge );

	Spiders.currentPlayer = player;
	Spiders.PerformPlayerMove( player, contiguousEdge );
	assert.equal( 
		Spiders.webData.EdgeOwnerByIndex(contiguousEdge), 
		"uno", 
		"player should own contiguous edge"
	);
	assert.ok( 
		player.IsActive(),
		"player should remain active"
	);	

});

QUnit.test( "contiguous move should give ownership of node", function( assert ) {
	firstEdge = 0;
	contiguousEdge = 3;
	connectingNode = 3;
	Spiders.PerformPlayerMove( player, firstEdge );

	Spiders.currentPlayer = player;
	Spiders.PerformPlayerMove( player, contiguousEdge );
	assert.equal( 
		Spiders.webData.NodeOwnerByIndex(connectingNode), 
		"uno", 
		"player should own node"
	);	
});

QUnit.test( "noncontiguous moves should fail", function( assert ) {
	firstEdge = 0;
	noncontiguousEdge = 7;
	Spiders.PerformPlayerMove( player, firstEdge );

	Spiders.currentPlayer = player;
	Spiders.PerformPlayerMove( player, noncontiguousEdge );
	assert.equal( 
		Spiders.webData.EdgeOwnerByIndex(noncontiguousEdge), 
		"", 
		"player should not be able to select noncontiguous edge"
	);
});

QUnit.test( "noncontiguous moves should deactivate player", function( assert ) {
	firstEdge = 0;
	noncontiguousEdge = 7;
	Spiders.PerformPlayerMove( player, firstEdge );
	Spiders.PerformPlayerMove( player, noncontiguousEdge );
	assert.ok( 
		!player.IsActive(),
		"player should be deactivated"
	);	
});

QUnit.test( "move blocked by other player's node should fail", function( assert ) {
	firstEdge = 0;
	contiguousEdge = 3;
	connectingNode = 3;
	Spiders.PerformPlayerMove( player, firstEdge );
	Spiders.webData.nodeOwnerList[connectingNode] = "dos";
	Spiders.PerformPlayerMove( player, noncontiguousEdge );
	assert.equal( 
		Spiders.webData.EdgeOwnerByIndex(contiguousEdge), 
		"", 
		"player should not be able to select blocked edge"
	);
});

QUnit.test( "attempting move blocked by node should deactivate player", function( assert ) {
	firstEdge = 0;
	contiguousEdge = 3;
	connectingNode = 3;
	Spiders.PerformPlayerMove( player, firstEdge );
	Spiders.webData.nodeOwnerList[connectingNode] = "dos";
	Spiders.PerformPlayerMove( player, noncontiguousEdge );
	assert.ok( 
		!player.IsActive(),
		"player should be deactivated"
	);	
});

QUnit.test( "selecting an already owned edge should fail", function( assert ) {
	selectedEdge = 0;
	Spiders.PerformPlayerMove( player, selectedEdge );
	Spiders.PerformPlayerMove( player, selectedEdge );
	assert.equal( 
		Spiders.webData.EdgeOwnerByIndex(contiguousEdge), 
		"", 
		"player should own edge"
	);
	assert.ok( 
		!player.IsActive(),
		"player should be deactivated"
	);	
});

QUnit.test( "selecting other player's edge should fail", function( assert ) {
	selectedEdge = 0;
	Spiders.webData.edgeOwnerList[0] = "dos";
	Spiders.PerformPlayerMove( player, selectedEdge );
	assert.equal( 
		Spiders.webData.EdgeOwnerByIndex(selectedEdge), 
		"dos", 
		"edge should stay with original owner"
	);
	assert.ok( 
		!player.IsActive(),
		"player should be deactivated"
	);	
});

QUnit.test( "selecting invalid negative edge id should fail", function( assert ) {
	selectedEdge = -1;
	Spiders.PerformPlayerMove( player, selectedEdge );
	assert.deepEqual(
		Spiders.webData,
		webdata,
		"web data should not be altered"
	);
	assert.ok( 
		!player.IsActive(),
		"player should be deactivated"
	);	
});

QUnit.test( "selecting invalid large edge id should fail", function( assert ) {
	selectedEdge = 99999;
	Spiders.PerformPlayerMove( player, selectedEdge );
	assert.deepEqual(
		Spiders.webData,
		webdata,
		"web data should not be altered"
	);
	assert.ok( 
		!player.IsActive(),
		"player should be deactivated"
	);	
});
