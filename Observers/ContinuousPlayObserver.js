function ContinuousPlayObserver ( graphCreator ) {
	this.turnDelay = 10000;
		
	this.EndOfTurnNotification = function( webData, playerData ) {
		;
	};
	
	this.EndOfGameNotification = function( webData, playerData ) {
		for( var i = 0; i < playerData.length; i++ ) {
			playerData[i].ResetWorker();
			playerData[i].ClearPerformanceData();
		}
		playerData = shuffle(playerData);
		Spiders.ResetGame();
		
		var v = graphCreator.CreateVertices(449, 600, 600);
      var e = graphCreator.Edgify(v);
		
		Spiders.InitializeGame( v, e );
		Spiders.InitializePlayers( players );
				
		setTimeout(function(){
			Spiders.NotifyObserversEndOfTurn();
		}, this.turnDelay);
	};
	
	function shuffle(o){
		for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
		return o;
	};
};