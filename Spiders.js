/* 
 * Game class
 */
var Spiders;

(function() {
	"use strict";
	
	Spiders = {
		webData: {},
		players: [],
		
		observers: [],		
		turnStartTime: 0,
		turnEndTime: 0,
		currentPlayer: {},
		
		InitializeGame: function( nodes, edges ) {
			this.webData = new WebData( nodes, edges );
		},
		
		InitializePlayers: function( playerList ) {
			for( var i = 0; i < playerList.length; i++ ) {
				playerList[i].worker.onmessage = playerResponse( playerList[i], this );
				playerList[i].worker.onerror = playerError( playerList[i], this );			
				this.players.push( playerList[i] );
			}
		},
		
		ResetGame: function() {
			this.webData = {};
			this.players = [];
			this.currentPlayer = null;
		},
		
		StartPlayerTurn: function( player ) {
			if( this.NumberOfActivePlayers() == 0 ) {
				this.NotifyObserversEndOfGame();
				return;
			}
		
			if( this.players.indexOf(player) < 0 || !player.IsActive()) {
				this.NotifyObserversEndOfTurn();
				return;
			}
		
			this.currentPlayer = player;
			this.turnStartTime = performance.now();
			player.worker.postMessage(this.webData.GetData());
		},

		PerformPlayerMove: function( player, selectedEdgeId ) {
			if( player != this.currentPlayer || !player.IsActive() ) {
				player.Deactivate();
				return;
			}
			
			this.currentPlayer = null;
			this.turnEndTime = performance.now();
			player.performanceData.push(this.turnEndTime - this.turnStartTime);
			
			if( this.IsValidPlayerMove( player, selectedEdgeId ) ) {
				this.webData.AssignEdge( player.name, selectedEdgeId );
				this.webData.AssignNodes( player.name, selectedEdgeId );
			} else {
				player.Deactivate();
			}
		},
		
		IsValidPlayerMove: function( player, selectedEdgeId ) {
			var edge = this.webData.edgeList[selectedEdgeId];
			if( !edge ) {
				return false;
			}
					
			var n1 = edge[0];
			var n2 = edge[1];
		
			if( this.webData.EdgeOwnerByIndex(selectedEdgeId) != "" ) {
				return false;
			}

			if( this.webData.NumberOfEdgesOwnedByPlayer( player.name ) == 0 ) {
				return true;
			}

			if( this.webData.NodeOwnerByIndex(n1) == player.name
				|| this.webData.NodeOwnerByIndex(n1) == "" && this.webData.PlayerHasAdjacentEdgeAtNodeIndex(player.name, n1) ) {
				return true;	
			}		
		
			if( this.webData.NodeOwnerByIndex(n2) == player.name
				|| this.webData.NodeOwnerByIndex(n2) == "" && this.webData.PlayerHasAdjacentEdgeAtNodeIndex(player.name, n2) ) {
				return true;	
			}		

			return false;		
		},
		
		NumberOfActivePlayers: function () {
			var ctr = 0;
			for( var i = 0; i < this.players.length; i++ ) {
				if( this.players[i].IsActive() ) {
					ctr++;
				}
			}
			return ctr;
		},
		
		AddObserver: function( obs ) {
			if(!this.observers) {
				this.observers = [];
			}
			this.observers.push( obs );
		},
		
		ClearObservers: function() {
			this.observers = [];
		},

		NotifyObserversEndOfTurn: function() {
			for( var i = 0; i < this.observers.length; i++ ) {
				if( this.observers[i].EndOfTurnNotification ) {
					this.observers[i].EndOfTurnNotification( this.webData, this.players );
				}
			}
		},

		NotifyObserversEndOfGame: function() {
			for( var i = 0; i < this.observers.length; i++ ) {
				if( this.observers[i].EndOfGameNotification ) {
					this.observers[i].EndOfGameNotification(  this.webData, this.players  );
				}
			}
		}
		
	};

	function playerResponse( player, game ) {
		return function ( ev ) {
			game.PerformPlayerMove( player, ev.data.EdgeIndex );
			
			if( game.currentPlayer != null ) {
				return;
			}
			
			if( game.NumberOfActivePlayers() == 0 ) {
				game.NotifyObserversEndOfGame();
				return;
			}
			
			game.NotifyObserversEndOfTurn();
		};
	};
	
	function playerError( player, game ) {
		return function ( ev ) {
			game.PerformPlayerMove( player, -1 );
			
			if( game.currentPlayer != null ) {
				return;
			}
			
			if( game.NumberOfActivePlayers() == 0 ) {
				game.NotifyObserversEndOfGame();
				return;
			}
			
			game.NotifyObserversEndOfTurn();
		};
	
	};

	if(typeof module !== "undefined") {
		module.exports = Spiders;
	}
})();