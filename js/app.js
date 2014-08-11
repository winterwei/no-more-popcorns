var ffApp = {};

ffApp.filmKey = '9c9b86feea5ad58203255b8135180674';
ffApp.foodId = '785ab478';
ffApp.foodKey = '8711f5eca962c73014bb9e6209d04652';
ffApp.flavor = '';
ffApp.course = "Main Dishes";

//randomizer
var finalResults = [];


ffApp.init = function(filmName){
	// empty search field and reset value
	$('#searchFilm').on('submit', function(){
		$('#searchBar').val('');
	});

	ffApp.getID(filmName);
};

//1. Use user input to search database
//2. Grab the first movie on the search result list
//2.5 Get ID of this movie (getID)

ffApp.getID = function(filmName){
	$.ajax({
	    url: 'http://api.themoviedb.org/3/search/movie',
	    type: 'GET',
	    data: {
	      api_key: ffApp.filmKey,
	      query: filmName
	    },
	    dataType: 'json',
	    success: function(response){
	    	var filmID = response.results[0].id;
	    	// console.log(filmID);

	    	//call getGenre only if get filmID is successful
	    	ffApp.getGenre(filmID);
	    }
	});
};

//3. Get the 1st Genre based on the filmID

ffApp.getGenre = function(filmID){
	$.ajax({
	    url: 'http://api.themoviedb.org/3/movie/'+filmID,
	    type: 'GET',
	    data: {
	      api_key: ffApp.filmKey,
	    },
	    dataType: 'jsonp',
	    success: function(response){
	    	var filmGenre = response.genres[0].id;
	    	console.log(filmGenre);
	    	
	    	// only match flavour if getting genre is successful
	    	ffApp.flavorByGenre(filmGenre);
	    }
	});
};

//4. Assign flavor combinations to each genre

ffApp.flavorByGenre = function(filmGenre){

	//a bunch of if statements to set flavors to genres

	//if film is action/advanture/science fiction/fantasy
	if (filmGenre === 28 || filmGenre === 12 || filmGenre === 878 || filmGenre === 14) {
		ffApp.flavor = '&flavor.salty.min=0.66&flavor.meaty.min=0.66&flavor.piquant.min=0.5';
	} 
	//if film is western/sports/sports film/sporting/road movie
	else if (filmGenre === 1115 || filmGenre === 37 || filmGenre === 9805 || filmGenre === 10758 || filmGenre === 10757){
		ffApp.flavor = '&flavor.salty.min=0.8&flavor.meaty.min=0.8&flavor.piquant.min=0.66';
	}
	//if film is family/animation/holiday/comedy/musical
	else if (filmGenre === 10751 || filmGenre === 16 || filmGenre === 10595) {
		ffApp.flavor = '&flavor.sweet.min=0.5&flavor.salty.min=0.5&flavor.meaty.min=0.3&flavor.bitter.max=0.34';
	}
	//if film is romance/drama
	else if (filmGenre === 10749 || filmGenre === 18) {
		ffApp.flavor = '&flavor.sweet.min=0.5&flavor.salty.min=0.3&flavor.meaty.min=0.3&flavor.bitter.max=0.5&flavor.sour.min=0.33';
	}
	//if film is horror/thriller/mystery/suspense/disaster/crime/film noir
	else if (filmGenre === 27 || filmGenre === 53 || filmGenre === 9648 || filmGenre === 10748 || filmGenre === 105 || filmGenre === 80 || filmGenre === 10753) {
		ffApp.flavor = '&flavor.salty.min=0.5&flavor.piquant.min=0.5';
	}
	//if film is history/war
	else if (filmGenre === 36 || filmGenre === 10752) {
		ffApp.flavor = '&flavor.sweet.max=0.5&flavor.salty.min=0.5&flavor.bitter.max=0.66';
	} 
	//if film is documentary/short
	else if (filmGenre === 99 || filmGenre === 10755){
		ffApp.flavor = '&flavor.sweet.min=0.5&flavor.bitter.min=0.5';
	}

	// console.log(ffApp.flavor);
	// var flavorString = ffApp.flavor.toString();
	// console.log(flavorString);
	ffApp.searchRecipe();
};


//6. search recipe based on course and flavor

ffApp.searchRecipe = function(){
	$.ajax({
	    url: 'http://api.yummly.com/v1/api/recipes?allowedCourse[]=course^course-' + ffApp.course + ffApp.flavor,
	    type: 'GET',
	    data: {
	    	_app_id: ffApp.foodId,
	      	_app_key: ffApp.foodKey,
	      	maxResult: 300,
	      	rating: 5,
	    },
	    dataType: 'jsonp',
	    success: function(response){

	    	var recipesByCourse = response.matches;
	    	// console.log(recipesByCourse);

	    	var totalResults = recipesByCourse;
	    	function randomNum(n) {
	    		return Math.floor(Math.random() * n);
	    	};

	    	//Select a random object from the array
	    	function selectFromArray() {
	    		return totalResults[randomNum(totalResults.length)];
	    	};


	    	//Run loop to add a random result to finalResults array (things to be displayed)
	    	for(var i = 0; i<3; i = i) {
	    		var selectedResult = selectFromArray();
	    		console.log(selectedResult);
	    		// var finalResults = [];
	    		if (!selectedResult.smallImageUrls) {
	    			console.log('no image');
	    			// return true;
	    		} else {
	    			i++;
	    			// console.log(selectedResult);
	    			finalResults.push(selectedResult);
	    		}
	    	};
	    	// ffApp.displayRecipe(recipesByCourse);
	    	ffApp.displayRecipe(finalResults);
	    }
	});
};



//7. display recipes on page

ffApp.displayRecipe=function(data){
	$.each(data, function(i, piece){
		// console.log(piece);
		var image = $('<img>').attr('src', piece.smallImageUrls[0].replace('=s90',''));
		var title = $('<p>').text(piece.recipeName);

		// var recipePiece = $('<figure>').addClass('recipeContainer').append(image, title);
		var recipeLink = $('<a>').attr('href', 'http://www.yummly.com/recipe/' + piece.id).append(image, title);
		var recipePiece = $('<figure>').addClass('recipeContainer').html(recipeLink);
		$('#recipe').append(recipePiece);
	});
};

$(function(){
	// only call init when user click on the search button
	$('#searchButton').on('click', function(e){
		e.preventDefault();
		// assign user input to filmName
		finalResults = [];
		$('#recipe').empty();
		var filmName = $('#searchBar').val();
		// console.log(filmName);
		ffApp.init(filmName);
		$(this).text('ENJOY! OR TRY SOMETHING ELSE');

	});
	$('#course').on('change', function(){
		ffApp.course = $(this).val();
	});
});