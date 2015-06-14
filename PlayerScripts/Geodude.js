/*******************************************************************************
 *
 ******************************************************************************/
var curNode = -1;
var name = "Geodude";
var myEdges = []; 
var degrees = [];

onmessage = function ( ev ) {
	
	var i = -1;
	if(curNode == -1) {
		i = findFirstEdge( ev.data );
		curNode = ev.data.edgeList[i][0];
	} else {
		i = findNextEdge( ev.data );
		curNode = ev.data.edgeList[i][0];
	}

	postMessage( { "EdgeIndex" : i } );	
};

/*******************************************************************************
 * Utility Functions
 ******************************************************************************/

findFirstEdge = function (data) {

	for(var i = 0; i < data.nodeList.length; i++)
	{
		degrees.push(0);
	}

	for(var i = 0; i < data.edgeList.length; i++)
	{
		degrees[data.edgeList[i][0]]++;
		degrees[data.edgeList[i][1]]++;
	}

	var usableEdges = [];
	var backup = -1;

	for(var i = 0; i < data.edgeList.length; i++)
	{

		if(data.edgeOwnerList[i] == "")
		{
			var unusableEdge = false;
			var x = data.edgeList[i][0];
			var y = data.edgeList[i][1];
			for(var j = 0; j < data.edgeList.length; j++)
			{
				backup = j;
				if( i != j && (data.edgeList[j][0] === x || data.edgeList[j][1] === x || data.edgeList[j][0] === y || data.edgeList[j][1] === y))
				{
					if(data.edgeOwnerList[j] != "")
					{
						unusableEdge = true;
						break;			
					}
				}
			}

			if(!unusableEdge)
				usableEdges.push(i);
		}
	}

	if (usableEdges.length == 0)
	{
		if(backup == -1){
			return 0;
		}
		return backup;
	}

    var firstEdge = usableEdges[0];
    var edgeToReturn = firstEdge;
    var maxSumOfDegrees = degrees[data.edgeList[firstEdge][0]] + degrees[data.edgeList[firstEdge][1]];
	for(var i = 1; i < usableEdges.length; i++)
	{
    	var edge = usableEdges[i];
    	var SumOfDegrees = degrees[data.edgeList[edge][0]] + degrees[data.edgeList[edge][1]];
    	if(SumOfDegrees > maxSumOfDegrees)
    	{
    		edgeToReturn = usableEdges[i];
    		maxSumOfDegrees = SumOfDegrees;
    	}

	}

	return edgeToReturn;
}

findNextEdge = function (data)
{

	for(var i = 0; i < data.nodeOwnerList.length; i++)
	{
		if(data.nodeOwnerList[i] != "")
		{
			degrees[i] = 0;
		}
	}

	var availableNodes = getAvailableNodes(data);
	var backup = -1;
	var usableEdges = [];

    
    for(var i = 0; i < availableNodes.length; i++)
    {
		for(var j = 0; j < data.edgeList.length; j++)
		{
			if (data.edgeList[j][0] == availableNodes[i] || data.edgeList[j][1] == availableNodes[i])
			{
				if (data.edgeOwnerList[j] == "")
				{
					var unusableEdge = false;

					var y = data.edgeList[j][1];
					backup = j;
					for(var k = 0; k < data.edgeList.length; k++)
					{
						if( j != k && (data.edgeList[k][0] === y || data.edgeList[k][1] === y))
						{
							if(data.edgeOwnerList[k] != "")
							{
								unusableEdge = true;
								break;			
							}
						}
					}

					if(!unusableEdge)
						usableEdges.push(j);
				}
			}
		}
	}

	if (usableEdges.length == 0)
	{
		if(backup == -1){
			return 0;
		}
		return backup;
	}


	var firstEdge = usableEdges[0];
    var edgeToReturn = firstEdge;
    var maxSumOfDegrees = degrees[data.edgeList[firstEdge][0]] + degrees[data.edgeList[firstEdge][1]];
	for(var i = 1; i < usableEdges.length; i++)
	{
    	var edge = usableEdges[i];
    	var SumOfDegrees = degrees[data.edgeList[edge][0]] + degrees[data.edgeList[edge][1]];
    	if(SumOfDegrees > maxSumOfDegrees)
    	{
    		edgeToReturn = usableEdges[i];
    		maxSumOfDegrees = SumOfDegrees;
    	}

	}

	return edgeToReturn;

}


findFirstNode = function( data ) {
	var N = -1;
	do {
		N = Math.floor(Math.random() * data.nodeList.length);
	} while( data.nodeOwnerList[N] != "" );
	return N;
}; 

getAvailableNodes = function( data ) {
	//find all available nodes that I can reach
	var nodes = [];
	for( var i = 0; i < data.edgeOwnerList.length; i++ ) {
		if( data.edgeOwnerList[i] == name ) {
			//check left node
			var l = data.edgeList[i][0];
			if( data.nodeOwnerList[l] == "" || data.nodeOwnerList[l] == name ) {
				nodes.push( l );
			}
			//check right node
			var r = data.edgeList[i][1];
			if( data.nodeOwnerList[r] == "" || data.nodeOwnerList[r] == name ) {
				nodes.push( r );
			}
		}
	}
	nodes.sort(function(a,b){return a - b});
	return nodes.getUnique();
};

hasAvailableEdge = function( n, data ) {
	var chk = findFirstEdgeOnNode( data, n );
	if( chk >= data.edgeList.length ) {
		return false;
	}
	return true;
};

findFirstEdgeOnNode = function( data, N ) {
	var i = -1;
	do {
		i++;
		if( data.edgeList[i][0] > N ) {
			i = data.edgeList.length;
			break;
		}
		if((data.edgeList[i][0] == N || data.edgeList[i][1] == N) && data.edgeOwnerList[i] == "") {
			break;
		}
	} while( i < data.edgeList.length - 1);

	return i;
};

Array.prototype.getUnique = function(){
   var u = {}, a = [];
   for(var i = 0, l = this.length; i < l; ++i){
      if(u.hasOwnProperty(this[i])) {
         continue;
      }
      a.push(this[i]);
      u[this[i]] = 1;
   }
   return a;
}
