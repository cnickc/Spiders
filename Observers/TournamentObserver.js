function TournamentObserver ( graphCreator, players, standingsboard, cmap ) {
	this.gameDelay = 4000;
	this.moveDelay = 1;
	this.tournamentScore = {};
	this.vertices = 149;
	this.lossLimit = 3;
	this.players = players;
	this.ctr = 0;
	this.tournamentBoard = null;
	
	this.SetTournamentScoreBoard = function( el ) {
		this.tournamentBoard = el;
	}	
	
	
	this.InitializeTournamentStandings = function( playerArr ) {
		for( var i = 0; i < playerArr.length; i++ ) {
			name = playerArr[i];
			this.tournamentScore[name] = { 
				losses : 0,
				totalTime : 0,
				totalTurns : 0
			};
		}
	};
		
	this.EndOfTurnNotification = function( webData, playerData ) {
		var i = this.ctr % this.players.length;
		var p = this.players[i];
		setTimeout(function(){
			Spiders.StartPlayerTurn(p);
		}, this.moveDelay);
		this.ctr++;
	};
	
	this.EndOfGameNotification = function( webData, playerData ) {
		var standings = this.UpdateStandings(this.tournamentScore, playerData, webData, this.lossLimit);	
		
		for( var i = 0; i < playerData.length; i++ ) {
			playerData[i].ResetWorker();
			playerData[i].ClearPerformanceData();
			var P = playerData[i].name;
			if( this.tournamentScore[P].losses >= this.lossLimit ) {
				playerData.splice(i,1);
				i--;	
			}
		}
		
		if(playerData.length <= 4) {
			var el = document.getElementById("overlay");
			el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
			var modal = document.getElementById("overlayContent");
			modal.innerHTML = "Game Over<br /><br />Final Standings<br/>";
			for( var i = 0; i < standings.length; i++ ) {
				modal.innerHTML += (i+1) + ". "
					+ standings[i].name + "<br />";
			}
			
			
		} else {
		
			playerData = shuffle(playerData);
			this.players = playerData;		
			Spiders.ResetGame();
		
			var v = graphCreator.CreateVertices(this.vertices, 600, 600);
			var e = graphCreator.Edgify(v);
		
			Spiders.InitializeGame( v, e );
			Spiders.InitializePlayers( this.players );
				
			setTimeout(function(){
				Spiders.NotifyObserversEndOfTurn();
			}, this.gameDelay);
		}
	};
	
	this.UpdateStandings = function( tourneyData, playerData, webData, lossLimit ) {
	
		var gameScores = AggregatePlayerPerformance( playerData, webData );
		
		gameScores.sort(function(a, b) {
			if( a.nodes == b.nodes )
				return a.averageTime - b.averageTime;
			return b.nodes - a.nodes;
		});
		
		for( var i = 0; i < gameScores.length; i++ ) {
			var p = gameScores[i].name;
			tourneyData[p].totalTime += gameScores[i].totalTime;
			tourneyData[p].totalTurns += gameScores[i].turns;
		}
		var L = gameScores.length - 1;
		var P = gameScores[L].name;
		tourneyData[P].losses++;
		
		var boardData = SortTourneyScores( tourneyData );
		boardData.sort(function(a, b) {
			if( a.losses >= lossLimit && b.losses >= lossLimit)
				return a.averageTime - b.averageTime;
			if( a.losses >= lossLimit )
				return 1;
			if( b.losses >= lossLimit )
				return -1;	
			return a.averageTime - b.averageTime;
		});
		if(this.tournamentBoard !== null) {
			UpdateTournamentStandings(boardData);
		}
		
		return boardData;
		
	}
	
	SortTourneyScores = function( tourneyData ) {
		arr = [];
		for (var key in tourneyData) {
			if(tourneyData.hasOwnProperty(key)){
				var avg = 0;
				if( tourneyData[key].totalTurns > 0 ) {
					avg = tourneyData[key].totalTime / tourneyData[key].totalTurns;
				}			
				arr.push({
					name: key,
					averageTime: avg,
					losses: tourneyData[key].losses
				});
			}
		}
		return arr;
	};
	
	AggregatePlayerPerformance = function(playerData, webData) {	
		var scoreArr = [];
		
		for( var i = 0; i < playerData.length; i++ ) {
			var p = playerData[i].name;
			var perf = playerData[i].performanceData;
			var tot = 0;
			var avg = 0;
			if( perf.length > 0 ) {
				for( var j = 0; j < perf.length; j++ ) {
					tot += perf[j];
				} 
				var avg = tot/perf.length;
			}
			scoreArr.push( {
				name : p,
				totalTime : tot,
				turns : perf.length,
				averageTime : avg,
				nodes : webData.GetNodesOwnedByPlayer(p).length
			});
		}	

		return scoreArr;	
	};
	
	
	UpdateTournamentStandings = function(scoreArr) {
		for( var i = 0; i < scoreArr.length; i++ ) {
			var id = scoreArr[i].name + "-standing";
			var div = document.getElementById(id);
			if(div == null) {
				div = CreateNewStandingsPanel(id, cmap[scoreArr[i].name]);
			}			
			div.style.transform = "translate(0,"+(i*40)+"px)"
			div.style.transition = "200ms ease-in";
			var msg = scoreArr[i].name + "<br />&nbsp;&nbsp;&nbsp;Average Time:" 
				+ scoreArr[i].averageTime.toFixed(3); 
			div.className = "loss" + scoreArr[i].losses;
			div.innerHTML = msg;
		}	
	};
	
	CreateNewStandingsPanel = function(id, color){
		var div = document.createElement('div');
		div.setAttribute('id', id);
		div.style.position = 'absolute';
		div.style.backgroundColor = color;
		div.style.width = '225px';
		div.style.borderRadius = '5px';
		div.style.marginLeft = '5px';
		div.style.paddingLeft = '5px';
		div.style.fontVariant = 'small-caps';
		standingsboard.appendChild(div);
		return div;
	};
	
	
	
	
		
	function shuffle(o){
		for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
		return o;
	};
};