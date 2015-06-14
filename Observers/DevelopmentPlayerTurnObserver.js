function DevelopmentPlayerTurnObserver ( players ) {
	var ctr = 0;
	this.players = players;
	this.turnDelay = 1;
	this.waitingForKeyPress = false;
	this.messageArea = null;
	this.currentPlayer = "";
	this.webData = null;
	this.currentPlayerOwnedEdges = [];
		
	this.SetMessageArea = function (element) {
		this.messageArea = element;
	};	
	
	this.KeypressNotification = function() {
		if( this.waitingForKeyPress ) {
			this.waitingForKeyPress = false;
			var i = ctr % players.length;
			this.currentPlayer = this.players[i].name;
			this.currentPlayerOwnedEdges = this.webData.GetEdgesOwnedByPlayer(this.currentPlayer);
			setTimeout(function(){
				Spiders.StartPlayerTurn(players[i]);
			}, this.turnDelay);
			ctr++;		
		}
	};
		
	this.EndOfTurnNotification = function( webData, playerData ) {

		var msg = [];
		if( this.currentPlayer != "" ) {
			msg.push("Player: " + this.currentPlayer);		
		
			var e = webData.GetEdgesOwnedByPlayer(this.currentPlayer);
			msg.push( CatalogEdgeDifference( this.currentPlayerOwnedEdges, e, webData) );	
			
			var t = Math.floor((ctr-1) / players.length);
			var p = playerData[(ctr-1) % players.length];
			if( t >= p.performanceData.length ) {
				msg.push("Turn not played");		
			} else {
				msg.push("Turn time: " + p.performanceData[t]);
			}
		}

		msg.push("Waiting for keypress...");	

		this.waitingForKeyPress = true;		
		this.webData = webData;

		ReportTurnMessage( msg, this.messageArea ); 
	};
	
	this.EndOfGameNotification = function( webData, playerData ) {
		this.waitingForKeypress = false;
		this.messageArea.innerHTML = "Game Over";
	};
	
	CatalogEdgeDifference = function( oldEdges, newEdges, data ) {
		
		for( var i = 0; i < Math.max(oldEdges.length, newEdges.length); i++ ) {
			if( oldEdges[i] != newEdges[i] ) {
				var e = newEdges[i];
				return "Assigned edge " + e 
					+ ", which connects nodes " + data.edgeList[e][0] + " and " + data.edgeList[e][1];
			}
		}
		
		return "No new edges assigned";
	}; 
	
	ReportTurnMessage = function( msg, messageArea ) {
		if( messageArea ) {
			messageArea.innerHTML = "";
			for(var i = 0; i < msg.length; i++) {
				messageArea.innerHTML += msg[i] + "<br />";				
			}
		} else {
			for(var i = 0; i < msg.length; i++) {
				console.log(msg[i]);			
			}
		}	
	};
	
};

