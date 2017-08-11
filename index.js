$(document).ready(function(){

	//check for geoLocalization
	if ("geolocation" in navigator) {
	  $('.js-geolocation').show();
	} else {
	  $('.js-geolocation').hide();
	}
	//var control complete ajax
	var cont = true;

	// autocomplete function
	var autocomplete = new google.maps.places.Autocomplete($("#city-name")[0], {});
		google.maps.event.addListener(autocomplete, 'place_changed', function() {
		var place = autocomplete.getPlace();
			});

	//view controller functions
	function dynamicview(){
		$("body").css("background-color", "#A970FF");
		$("#main-page").hide();
		$("#result-container").hide();
		$("#loading-image").show();
		$("#navigation").hide();
	}

		//stamp of the forcest days
				var d = new Date();
				var weekday = ["SUN","MON","TUE","WED","THUR","FRI","SAT"];
		//icon association
		var objicon = {
			'01d' : 'B',
			'02d' :'H',
			'03d' : 'N',
			'04d' : 'Y',
			'09d' : 'R',
			'10d' : 'Q',
			'11d' :'P',
			'13d' : 'W',
			'50d' : 'M',
			'01n' : 'B',
			'02n' :'H',
			'03n' : 'N',
			'04n' : 'Y',
			'09n' : 'R',
			'10n' : 'Q',
			'11n' :'P',
			'13n' : 'W',
			'50n' : 'M'
		};

	//Main Function obtain the weather
	function getWeather(cityname){
		var url = "https://api.openweathermap.org/data/2.5/forecast/daily?q="+cityname+"&ctn=6&units=metric&appid=64b49bb71a87aa79917e3068dbf8f84a";
		$.ajax({
    url : url ,
		method : 'get',
    success : function (data) {
			cont = false;
			dynamicview();
			max = new Array();
			min = new Array();
			var first = {
					maxtemp : Math.round(data.list[0].temp.max),
					mintemp : Math.round(data.list[0].temp.min),
					cityname : data.city.name,
					country : data.city.country,
					icon : data.list[0].weather[0].icon
			};
			var c = " °C";
			var html ="<p><br><br>"+first.cityname+", "+first.country+"</p><br>";
			var img2 = "<p id='icon' data-icon="+objicon[first.icon]+"></p>";
			var grade1 = "<p>"+first.maxtemp+c+"<br>"+"</p> <p>"+first.mintemp+c+"<br></p>";
			var forecast;
			var day = d.getDay();
			$("#main-city").append(html);
			$("#main-image").append(img2);
			$("#main-grade").append(grade1);
			for(i = 1; i < 6; i++){
				if(day==6)
					day =-1;
				max[i] = Math.round(data.list[i].temp.max);
				min[i] = Math.round(data.list[i].temp.min);

				forecast = "<p id='icon' data-icon="+objicon[data.list[i].weather[0].icon]+"></p><p id='day'>"+weekday[++day]+"</p><br><p>"+max[i]+c+"<br><br>"+min[i]+c+"</p>";
				$("#div-"+i).append(forecast);
			}
		},
    error : function (data) {
        alert("Insert an existing city");
    },
		complete : setTimeout(function(){
								$('#loading-image').hide();
								if(cont)
									$('#result-container').hide();
								else
									$('#result-container').show();
									$("#navigation").show();

    },1000)

});
	}

		/* Where in the world are you action button*/
	$('.js-geolocation').on('click', function(e) {
		e.preventDefault();
		$('#loading-location').css('visibility','visible');
		 navigator.geolocation.getCurrentPosition(function(position) {
			var pos = {
					 lat: position.coords.latitude,
					 lng: position.coords.longitude
				 };
	     currentUrl ="https://maps.googleapis.com/maps/api/geocode/json?latlng="+pos.lat+","+pos.lng+"&key=AIzaSyDQxt5Ucs6xDGtO1-m8ROw-IyLkhS2tWP4";
			$.get(currentUrl,function(posCurr){
					var currCity = posCurr.results[0].address_components[2].long_name;

					getWeather(currCity);
			});
	  });
	});



//Action in the manual city button submit
	$("#city-form").submit(function(e){
			e.preventDefault();
			var city = $("#city-name").val();
			getWeather(city);
		});

});
