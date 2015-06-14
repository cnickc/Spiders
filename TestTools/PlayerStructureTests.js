QUnit.module( "Player DataStructure Tests", {
	beforeEach: function() {
		player = new Player("uno");
	},
	afterEach: function() {
		player.worker.terminate();
		player = null;
	}
});

QUnit.test( "Player is created correctly", function( assert ) {
	assert.ok( player instanceof Player, "Object is of correct type" );
	assert.ok( player.name == "uno", "Object has correct name attribute" );
	assert.ok(player.worker, "Object contains a worker");
});

QUnit.test( "Player Performance Data can be cleared", function( assert ) {
	player.performanceData.push(31);
	assert.ok( player.performanceData.length == 1, "Performance Data contains entry" );
	player.ClearPerformanceData();
	assert.ok( player.performanceData.length == 0, "Performance Data cleared" );
});

QUnit.test( "Player worker can be reset", function( assert ) {
	player.worker.onmessage = function(){ ; };
	assert.ok( player.worker.onmessage != null, "Player worker has onmessage event listener" );
	player.ResetWorker();
	assert.ok( player.worker.onmessage == null, "Player worker has been reset" );
});
