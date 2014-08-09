var ffApp = {};

ffApp.filmKey = '9c9b86feea5ad58203255b8135180674';
ffApp.foodId = '785ab478';
ffApp.foodKey = '8711f5eca962c73014bb9e6209d04652';
ffApp.flavor = '';
ffApp.course = "Main Dishes";

//randomnizer


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
	    	console.log(filmID);

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
		ffApp.flavor = '&flavor.salty.min=0.66&flavor.meaty.min=0.66&flavor.piquant.min=0.66';
	} 
	//if film is western/sports/sports film/sporting/road movie
	else if (filmGenre === 1115 || filmGenre === 37 || filmGenre === 9805 || filmGenre === 10758 || filmGenre === 10757){
		ffApp.flavor = '&flavor.salty.min=0.8&flavor.meaty.min=0.8&flavor.piquant.min=0.66';
	}
	//if film is family/animation/holiday/comedy/musical
	else if (filmGenre === 10751 || filmGenre === 16 || filmGenre === 10595) {
		ffApp.flavor = '&flavor.sweet.min=0.5&flavor.salty.min=0.5&flavor.meaty.min=0.3&flavor.bitter.max=0.33';
	}
	//if film is romance/drama
	else if (filmGenre === 10749 || filmGenre === 18) {
		ffApp.flavor = '&flavor.sweet.min=0.5&flavor.salty.min=0.5&flavor.piquant.min=0.3&flavor.bitter.max=0.5&flavor.sour.min=0.5';
	}
	//if film is horror/thriller/mystery/suspense/disaster/crime/film noir
	else if (filmGenre === 27 || filmGenre === 53 || filmGenre === 9648 || filmGenre === 10748 || filmGenre === 105 || filmGenre === 80 || filmGenre === 10753) {
		ffApp.flavor = '&flavor.sweet.max=0.33&flavor.salty.min=0.5&flavor.piquant.min=0.3&flavor.bitter.max=0.5&flavor.sour.min=0.5';
	}
	//if film is history/war
	else if (filmGenre === 36 || filmGenre === 10752) {
		ffApp.flavor = '&flavor.sweet.max=0.5&flavor.salty.min=0.5&flavor.bitter.max=0.66';
	} 
	//if film is documentary/short
	else if (filmGenre === 99 || filmGenre === 10755){
		ffApp.flavor = '&flavor.sweet.min=0.5&flavor.bitter.min=0.5';
	}

	console.log(ffApp.flavor);
	// var flavorString = ffApp.flavor.toString();
	// console.log(flavorString);
	ffApp.searchRecipe();
};

//I need to pass the flavor mix into ajax data parameter
//e.g. flavor.salty.min and flavor.salty.max
//OR...should I find the matched flavor in the matched results based on course 


//5. Search recipes by flavor mix
// ffApp.searchByFlavor = function(){

// };

//6. Set the "allowedCourse[]" parameter to search for the recipe
// only return recipes with selected course

ffApp.searchRecipe = function(){
	$.ajax({
	    url: 'http://api.yummly.com/v1/api/recipes?allowedCourse[]=course^course-' + ffApp.course + ffApp.flavor,
	    type: 'GET',
	    data: {
	    	_app_id: ffApp.foodId,
	      	_app_key: ffApp.foodKey,
	      	maxResult: 5,
	      	rating: 5,
	    },
	    dataType: 'jsonp',
	    success: function(response){
	    	var recipesByCourse = response.matches;
	    	// //object: results of course match
	    	console.log(recipesByCourse);
	    	ffApp.displayRecipe(response);
	    }
	});
};

ffApp.displayRecipe=function(data){
	// $.each(data, function(i, item){

	// 	//building html - inject h2 with title
	// 	var title = $('<h2>').text(item.title);
	// 	var artist = $('<p>').addClass('artist').text(item.principalOrFirstMaker);
	// 	var image = $('<img>').attr('src', piece.webImage.url);
	// 	var artPiece = $('<div>').addClass('piece').append(image, title, artist);
	// 	$('#artwork').append(artPiece);
	// });

	for(var i=0; i<data.matches.length; i++){
		$('ul').append('<li>' + data.matches[i].recipeName + '</li>');
		// for(var i=0; i<data.matches.length; i++)
		$('#recipe').append('<img src=' + data.matches[i].smallImageUrls[0].replace('=s90','') + '>');
	}
};

$(function(){
	// only call init when user click on the search button
	$('#searchButton').on('click', function(e){
		e.preventDefault();
		// assign user input to filmName
		$('#recipe').empty();
		var filmName = $('#searchBar').val();
		console.log(filmName);
		ffApp.init(filmName);	
	});
	$('#course').on('change', function(){
		ffApp.course = $(this).val();
	});
});