/* 
 * Renderer class
 */
var Renderer;

(function() {
	"use strict";
	
	Renderer = {
		ctx: {},
		
		SetContext: function( context ) {
			this.ctx = context;
		},
		
		DrawEdge: function(vertices, edge, color, width, alpha) {
			var ctx = this.ctx;
				
			ctx.beginPath();								
			ctx.globalAlpha = alpha;	
			ctx.strokeStyle = color;
			ctx.lineWidth = width;			
			ctx.moveTo(vertices[edge[0]][0], vertices[edge[0]][1]);
			ctx.lineTo(vertices[edge[1]][0], vertices[edge[1]][1]);
			ctx.closePath();
			
			ctx.stroke();     				
		},
		
		DrawEdges: function(vertices, edges, color, width, alpha) {
			for( var i = 0; i < edges.length; i++ ) {
				this.DrawEdge(vertices, edges[i], color, width, alpha);
			}
		},
		
		DrawVertex: function(v, color, radius, alpha) {
			var ctx = this.ctx;
				
      	ctx.beginPath();
			ctx.globalAlpha = alpha;	
      	ctx.fillStyle = color;
      	
      	ctx.arc(v[0], v[1], radius, 0, 2 * Math.PI);
      	ctx.fill();
		},
		
		DrawVertices: function( vertices, color, radius, alpha ){
			for( var i = 0; i < vertices.length; i++ ) {
				this.DrawVertex(vertices[i], color, radius, alpha);
			}
		},
		
		Clear: function() {
			var 
				w = this.ctx.canvas.width,
				h = this.ctx.canvas.height
			this.ctx.clearRect(0, 0, w, h);
		}
	};

	if(typeof module !== "undefined")
	module.exports = Renderer;
})();