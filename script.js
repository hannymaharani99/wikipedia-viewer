var app = angular.module('WikiApp', ['ngAnimate']);
app.controller('MainCtrl', function($scope, $http, $timeout) {
  var form = $('form');
  var close = $('.eks');
  var input = $('input');
  var search = $("#search");
  var help = $("#help");
  
  $scope.results = [];

  close.on('click', function() {
    form.toggleClass('open');
    
    if (!form.hasClass('open') && $scope.searchTxt !== '' && typeof $scope.searchTxt !== 'undefined') {
	    search.toggleClass('fullHeight')
      help.toggleClass('hide');
      $scope.searchTxt = '';
    } 
    $scope.results = [];
    $scope.$apply();
  })

  input.on('transitionend webkitTransitionEnd oTransitionEnd', function() {
    if (form.hasClass('open')) {
      input.focus();
    } else {
      return;
    }
  })

  $scope.search = function() {
    $scope.results = [];
    help.addClass('hide');
    search.removeClass('fullHeight');
    var title = input.val();
    var api = 'https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=';
    var cb = '&callback=JSON_CALLBACK';
    var page = 'https://en.wikipedia.org/?curid=';
    
    $http.jsonp(api + title + cb)
    .success(function(data) {
      var results = data.query.pages;
      angular.forEach(results, function(v,k)  {
        $scope.results.push({title: v.title, body: v.extract, page: page + v.pageid})
      })
    });
  }
});

function htmlEncode(api){
  return String(api).replace(/[^\w. ]/gi, function(c){
     return '&#'+c.charCodeAt(0)+';';
  });
}

function sanitizeHTML(text) {
  var element = document.createElement('text');
  element.innerText = text;
  return element.innerHTML;
}

function canvas() {
	var mainCanvas = document.getElementById('bg');
	var mainContext = mainCanvas.getContext('2d');
	var theWidth = window.innerWidth;
	var theHeight = window.innerHeight;
	mainCanvas.width  = theWidth;
	mainCanvas.height = theHeight;
	
	var howManyCircles = 40;
	
	var circles = new Array();
	
	var requestAnimationFrame = window.requestAnimationFrame || 
								window.mozRequestAnimationFrame ||
								window.webkitRequestAnimationFrame ||
								window.msRequestAnimationFrame;
	
	function Circle(radius, speed, size, xPos, yPos, opacity, circleColor) {
	    this.radius = radius;
	    this.speed = speed;
	    this.size = size;
	    this.xPos = xPos;
	    this.yPos = yPos;
	    this.opacity = opacity;
	    this.circleColor = circleColor;
	
	    this.counter = 0;
	
	    var signHelper = Math.floor(Math.random() * 2);
	
	    if (signHelper == 1) {
	        this.sign = -1;
	    } else {
	        this.sign = 1;
	    }
	}
	
	Circle.prototype.update = function () {
	    this.counter += this.sign * this.speed/20;
	
	    mainContext.beginPath();
	    mainContext.arc(this.xPos + Math.cos(this.counter / 100) * this.radius, 
	    				this.yPos + Math.sin(this.counter / 100) * this.radius, 
	    				this.size, 
	    				0, 
	    				Math.PI * 2,
	    				false);
	    				
	    mainContext.closePath();
		mainContext.fillStyle = this.circleColor + this.opacity + ')'; //dark blue
	    
	    mainContext.fill();
	};
							
	// Register an event listener to
	// call the resizeCanvas() function each time 
	// the window is resized.
	window.addEventListener('resize', resizeCanvas, false);
			
	// Draw canvas border for the first time.
	resizeCanvas();
	
	function setupCircles() {
		//console.log("setup");
		
	    for (var i = 0; i < howManyCircles; i++) {
	    	var opacity = .25 + Math.random() * .40;
			var speed = 1 + Math.random() * 8;
			var size = (1.6 - opacity) * (130 + Math.random() * 200);
			var radius = 100 + Math.random() * 100;
	        var randomX = Math.round(Math.random() * (theWidth + size)) - size/2;
	        var randomY = Math.round(Math.random() * (theHeight + size)) - size/2;
	        
	        var colorRadomizer = (i/howManyCircles) * 100;
	        
	        if(colorRadomizer <= 40){
	    		var circleColor = 'rgba(26, 99, 142,'; //blue
			}else if((colorRadomizer > 40) && (colorRadomizer <= 80)) {
	    		var circleColor = 'rgba(0, 125, 105,'; //green
			}else{
				var circleColor = 'rgba(21, 216, 223,'; //aqua
				size /= 2;
				radius /= 2;
				opacity /= 2;
			}
	
			var circle = new Circle(radius, speed, size, randomX, randomY, opacity, circleColor);
			circles.push(circle);
	    }
	    drawAndUpdate();
	}
	
	function drawAndUpdate() {
		//console.log("draw & update " + theWidth + " " + theHeight);
	    requestAnimationFrame(drawAndUpdate);
	    
	    mainContext.clearRect(0, 0, theWidth, theHeight);
	
		for (var i = 0; i < circles.length; i++) {
		
		    var myCircle = circles[i];
		    myCircle.update();
		}
	}
	
	// Runs each time the DOM window resize event fires.
	// Resets the canvas dimensions to match window,
	// then draws the new borders accordingly.
	function resizeCanvas() {
		//console.log("resized");
		
		theWidth = window.innerWidth;
		theHeight = window.innerHeight;
		mainCanvas.width  = theWidth;
		mainCanvas.height = theHeight;
	
		setupCircles();
	}

};