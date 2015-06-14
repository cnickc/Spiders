function Player ( playerName ) {
	this.name = playerName;
	this.worker = new Worker( 'PlayerScripts/' + playerName + '.js' );
	this.Deactivate = function() {
		if(this.worker != null) {
			this.worker.terminate();
			this.worker = null;
		}
	};
	this.IsActive = function() {
		return (this.worker != null);
	};
	this.ResetWorker = function() {
		this.Deactivate();
		this.worker = new Worker( 'PlayerScripts/' + playerName + '.js' );
	};
	this.performanceData = [];
	this.ClearPerformanceData = function() {
		this.performanceData = [];
	};
};