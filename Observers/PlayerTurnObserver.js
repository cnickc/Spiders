function PlayerTurnObserver ( players ) {
	var ctr = 0;
	this.players = players;
	this.turnDelay = 1;
		
	this.EndOfTurnNotification = function( webData, playerData ) {
		var i = ctr % this.players.length;
		setTimeout(function(){
			Spiders.StartPlayerTurn(this.players[i]);
		}, this.turnDelay);
		ctr++;
	};
	
	this.EndOfGameNotification = function( webData, playerData ) {
		;
	};
};