var name = "Machamp"; //v7

onmessage = function(ev) {
    data = ev.data;
    nodeList = data.nodeList;
    nodeOwnerList = data.nodeOwnerList;
    edgeList = data.edgeList;
    edgeOwnerList = data.edgeOwnerList;
    nn = nodeList.length;
    ne = edgeList.length;

    available = [];
    first_move = true;
    for(var i=0; i<nn; i++) {
        available.push(false);
    }
    for(var i=0; i<ne; i++) {
        if(edgeOwnerList[i] == name) {
            first_move = false;
            var a = edgeList[i][0];
            var b = edgeList[i][1];
            if(nodeOwnerList[a] == "" || nodeOwnerList[a] == name) {
                available[a] = true;
            }
            if(nodeOwnerList[b] == "" || nodeOwnerList[b] == name) {
                available[b] = true;
            }
        }
    }
    if(first_move) {
        for(var i=0; i<nn; i++) {
            available[i] = true;
        }
    }
    var best = -1;
    var best_score = -9999999;
    for(var i=0; i<ne; i++) {
        if(edgeOwnerList[i] == "") {
            var a = edgeList[i][0];
            var b = edgeList[i][1];
            if(available[a] || available[b]) {
                var score = nodeList[a][1];
                if(nodeList[b][1] > score) {
                    score = nodeList[b][1];
                }
                if(first_move) {
                    score = -score;
                }
                if(score > best_score) {
                    best_score = score;
                    best = i;
                }
            }
        }
    }
    return postMessage({"EdgeIndex":best});
};
