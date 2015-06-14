function ScoreboardObserver ( scoreboard, playerNames, cmap ){
	this.EndOfTurnNotification = function( webData, playerData ) {
		var nodes = AggregateNodeScores(webData, playerNames);
		var avgs = AggregatePerformanceScores(webData, playerData);
		var scoreArr = AggregatePlayerScores(playerNames, nodes, avgs);		

		scoreArr.sort(function(a, b) {
			if(a.nodesOwned == b.nodesOwned)
				return a.averagePerformance - b.averagePerformance;
			return b.nodesOwned - a.nodesOwned;
		});
		
		UpdateScores(scoreArr);
		
	};

	this.EndOfGameNotification = function( webData, playerData ) {
		;
	};
	
	AggregateNodeScores = function(webData, playerNames) {
		var nodes = {};
		for( var i = 0; i < playerNames.length; i++ ) {
			nodes[playerNames[i]] = 0;
		}
		for( var i = 0; i < webData.nodeOwnerList.length; i++ ) {
			var p = webData.nodeOwnerList[i];
			nodes[p]++;
		}
		return nodes;
	};
	
	AggregatePerformanceScores = function(webData, playerData) {
		var avgs = {};
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
			avgs[p] = avg;					
		}	
		return avgs;
	};
	
	AggregatePlayerScores = function(playerNames, nodes, avgs) {
		var scoreArr = [];
		var scores = [];
		for( var i = 0; i < playerNames.length; i++ ) {
			scores[playerNames[i]] = {};
		}
		for (var p in nodes) {
			if(p == "") continue;
			if(nodes.hasOwnProperty(p)){
				scores[p].name = p;
				scores[p].nodesOwned = nodes[p];
				scores[p].averagePerformance = avgs[p];
				scoreArr.push(scores[p]);
			}
		}
		return scoreArr;	
	};
	
	UpdateScores = function(scoreArr) {
		for( var i = 0; i < scoreArr.length; i++ ) {
			var id = scoreArr[i].name + "-score";
			var div = document.getElementById(id);
			if(div == null) {
				div = CreateNewScorePanel(id, cmap[scoreArr[i].name]);
			}			
			div.style.transform = "translate(0,"+(i*60)+"px)"
			div.style.transition = "200ms ease-in";
			var msg = scoreArr[i].name + ": <br />&nbsp;&nbsp;&nbsp;Nodes:" 
				+ scoreArr[i].nodesOwned + "<br />&nbsp;&nbsp;&nbsp;Average Time:" 
				+ scoreArr[i].averagePerformance; 
			if(scoreArr[i].averagePerformance == undefined) {
				div.style.opacity = 0.4;
			}
			div.innerHTML = msg;
		}	
	};
	
	CreateNewScorePanel = function(id, color){
		var div = document.createElement('div');
		div.setAttribute('id', id);
		div.style.position = 'absolute';
		div.style.backgroundColor = color;
		div.style.width = '300px';
		div.style.borderRadius = '5px';
		div.style.marginLeft = '5px';
		div.style.paddingLeft = '5px';
		div.style.fontVariant = 'small-caps';
		scoreboard.appendChild(div);
		return div;
	};
};