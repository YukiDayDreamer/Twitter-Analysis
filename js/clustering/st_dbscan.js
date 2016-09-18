// test data
//var X = 
//     [
//      [2, 2, 1], [3, 3, 2], [4, 3, 1], [2, 3, 2],[1, 1, 1],
//      [32, 32, 31], [33, 34, 32], [34, 35, 34], [32, 31, 32],[31, 31, 31],
//      [100, 100, 10], [103, 102, 11], [100, 101, 9], [102, 102, 12], [101, 103, 10],
//      [200, 200, 10], [201, 202, 12], [201, 203, 14], [204, 201, 13], [203, 202, 12],
//      [300, 302, 51],
//      [400, 402, 101]
//     ];
//     
//var eps1 = 20;
//var eps2 = 5;
//var MinPts = 4;

// spatial distance
function sp_dist(a, b) {
    return Math.sqrt(Math.pow((a[0] - b[0]), 2) + Math.pow((a[1] - b[1]), 2));
}

// temporal distance
function tp_dist(a, b) {
    return Math.abs(a[2] - b[2]);
}

// retrieve list of neighbors
function retrieve_neighbors(eps1, eps2, point, cluster) {
    var neighbors = [];     // list of neighbor
    for (var iter=0; iter<cluster.length; iter++) {
        var dist1 = sp_dist(point, cluster[iter]);
        var dist2 = tp_dist(point, cluster[iter]);
        if (dist1 <= eps1 && dist2 <= eps2) {
            neighbors.push(iter);
        }
    }
    return neighbors;
}

// main function
function st_dbscan(X, eps1, eps2, MinPts) {
    var cluster_label = 0; // label meaning: 0:unmarked; 1,2,3,...:cluster label; "noise":noise
    var labels = new Array(X.length).fill(0); // new an 0 array to store labels
    var clusters = []; // final output

    // clustering data points
    for (var i=0; i<X.length; i++) {
        var neighbors = retrieve_neighbors(eps1, eps2, X[i], X);
        
        if (neighbors.length < MinPts) {
            // if it is unmarked, mark it "noise"
            if (labels[i] === 0) {
                labels[i] = "noise";
            }
        }else{
            cluster_label +=1;  // construct a new cluster
            var cluster = [];   // construct cluster

            // mark label for all unmarked neighbors
            for (var j1=0; j1<neighbors.length; j1++) {
                // if no other labels
                if (labels[neighbors[j1]] === 0 || labels[neighbors[j1]] === "noise") {  
                    labels[neighbors[j1]] = cluster_label;
                    cluster.push(neighbors[j1]);
                }
            }
            
            // check the sub-circle of all objects
            while (neighbors.length !== 0) {
                var j2;
                j2 = neighbors.pop();
                var sub_neighbors = retrieve_neighbors(eps1, eps2, X[j2], X);
                
                // mark all unmarked neighbors
                if (sub_neighbors.length >= MinPts) {
                    for (var k=0; k<sub_neighbors.length; k++) {
                        // if no other labels 
                        if (labels[sub_neighbors[k]] === 0 || labels[sub_neighbors[k]] === "noise") {
                            // might include |cluster_avg() - X[index]| < delta_eps
                            neighbors.push(sub_neighbors[k]);
                            labels[sub_neighbors[k]] = cluster_label;
                            cluster.push(sub_neighbors[k]);
                        }
                    }
                }
            }

            // remove cluster of small size
            if (cluster.length < MinPts) {
                for (var j3=0; j3<X.length; j3++) {
                    if (labels[j3] === cluster_label) {
                        labels[j3] = "noise";
                    }
                }
            }else{
                clusters.push(cluster);
            }
        }
    }
    
    //console.log(clusters);
    return clusters;
}
