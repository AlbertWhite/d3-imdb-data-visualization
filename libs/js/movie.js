$(document).ready(function () {
/*
Change the background image and font every 10 seconds
*/
/*
	setInterval(function () {
		var number = Math.floor((Math.random() * 6) + 1);
		if (number == 1) {
			$("#font_title").css("font-size", "20px");
			$("#font_line").css("font-size", "15px");
			$("#font_movie").css("font-size", "15px");
			$("#font_title").css("font-family", "spiderman");
			$("#font_line").css("font-family", "spiderman");
			$("#font_line").text("With great power comes great responsibility.");
			$("#font_movie").css("font-family", "spiderman");
			$("#font_movie").text("- Spider Man");
			$("body").css("background", "url('libs/img/spiderman.jpg') no-repeat center center fixed");
		} else if (number == 2) {
			$("#font_title").css("font-size", "20px");
			$("#font_line").css("font-size", "15px");
			$("#font_movie").css("font-size", "15px");
			$("#font_title").css("font-family", "harryporter");
			$("#font_line").css("font-family", "harryporter");
			$("#font_line").text("For a very sober-minded people, death is just another great adventure.");
			$("#font_movie").css("font-family", "harryporter");
			$("#font_movie").text("- Harry Portter");
			$("body").css("background", "url('libs/img/harrypotter.jpg') no-repeat center center fixed");
		} else if (number == 3) {
			$("#font_title").css("font-size", "20px");
			$("#font_line").css("font-size", "15px");
			$("#font_movie").css("font-size", "15px");
			$("#font_title").css("font-family", "terminator");
			$("#font_line").css("font-family", "terminator");
			$("#font_line").text("I will be back.");
			$("#font_movie").css("font-family", "terminator");
			$("#font_movie").text("- Terminator");
			$("body").css("background", "url('libs/img/terminator.jpg') no-repeat center center fixed");
		} else if (number == 4) {
			$("#font_title").css("font-size", "20px");
			$("#font_line").css("font-size", "15px");
			$("#font_movie").css("font-size", "15px");
			$("#font_title").css("font-family", "titanic");
			$("#font_line").css("font-family", "titanic");
			$("#font_line").text("You jump, I jump.");
			$("#font_movie").css("font-family", "titanic");
			$("#font_movie").text("- Titanic");
			$("body").css("background", "url('libs/img/titanic.jpg') no-repeat center center fixed");
		} else if (number == 5) {
			$("#font_title").css("font-family", "godfather");
			$("#font_title").css("font-size", "20px");
			$("#font_line").css("font-family", "godfather");
			$("#font_line").css("font-size", "15px");
			$("#font_line").text(" I don't apologize — that's my life. ");
			$("#font_movie").css("font-family", "godfather");
			$("#font_movie").css("font-size", "30px");
			$("#font_movie").text("- Godfather");
			$("body").css("background", "url('libs/img/godfather.png') no-repeat center center fixed");
		} else if (number == 6) {
			$("#font_title").css("font-size", "20px");
			$("#font_line").css("font-size", "15px");
			$("#font_movie").css("font-size", "15px");
			$("#font_title").css("font-family", "pig");
			$("#font_line").css("font-family", "pig");
			$("#font_line").text("Th-th-th-that's all folks!");
			$("#font_movie").css("font-family", "pig");
			$("#font_movie").text("- Porky Pig");
			$("body").css("background", "url('libs/img/pig.jpg') no-repeat center center fixed");
		}

	}, 10000);
*/
});

var chart;
var loadDone = false;
var movie_number = 0;
var datas = [];
var movietypes = ["Action", "Adventure", "Biography", "Comedy", "Crime", "Documentary", "Drama", "Horror", "Mystery", "Sci-Fi"];
var id = "a";

/*
object: datas. Movie types are keys. Movie info is values. 
*/
for (i = 0; i < movietypes.length; i++) {
	datas.push({
		key : movietypes[i],
		values : []
	});

}

nv.addGraph(function () {
	chart = nv.models.scatterChart()
		.showDistX(true)
		.showDistY(true)
		.useVoronoi(true)
		.color(d3.scale.category20().range())
		.transitionDuration(300);

	chart.xAxis.tickFormat(d3.format('.02f'));
	chart.yAxis.tickFormat(d3.format('.02f'));


/*
load and wait cvs data to chart until all the data is loaded
*/
	var interval = setInterval(function () {
			d3.selectAll(".nv-series").remove();
			d3.select('#test1 svg')
			.datum(CsvData())
			.call(chart);
			delete datas.group0; // delete the old groups

			if (loadDone) {
				clearInterval(interval);
			}

		}, 2000);
	nv.utils.windowResize(chart.update);
	chart.dispatch.on('stateChange', function (e) {
		('New State:', JSON.stringify(e));
	});

	chart.tooltips(true)
	.tooltipContent(function (key, x, y, e, graph) {

		var data = e.series.values[e.pointIndex];

		var name = data.name;
		result = getJson(name);

		id = result["id"];
		director = result["director"];
		actor = result["actor"];
		country = result["country"];
		rate = data.y;

		return "<b>" + name + "</b>" + "(" + x + ")  " +
		"<span class='label label-info'>" + rate + "</span><br/>" +
		"<font style='color:#6C7A89'>" + key + " - " + country + "</font><br/>" +
		"Director: " + director + "<br/>" +
		"Actor:&nbsp&nbsp&nbsp&nbsp" + actor + "</br>" +
		"<small><ins>Click on the circle to check more info</ins></small>";

	});
/*
add click event to cirles in the chart
*/
	chart.scatter.dispatch.on('elementClick', function (e) {
		var data = e.series.values[e.pointIndex];
		var name = data.name;

		result = getJson(name);

		window.open("http://www.imdb.com/title/" + result["id"]);

	});

	return chart;
});

/*
get detailed data of a movie
*/
function getJson(name) {

	var result = {};
	$.ajax({
		url : "http://www.omdbapi.com/?t=" + name,
		dataType : 'json',
		async : false,
		success : function (data) {
			result["id"] = data.imdbID;
			result["director"] = data.Director;
			result["actor"] = data.Actors;
			result["country"] = data.Country;
		}
	});
	return result;
}

function Data() {
	var data = []

	d3.json("imdb-movies.json", function (json) {

		var count = Object.keys(json).length

			for (var i = 0; i < count; i++) {
				xValues[i] = json[i].year;
			}

			//问题在于，可以console出来，但是找不到。关键是，如何把数据提取成数组，再从数组里找数？
			for (var i = 0; i < count; i++) {
				zValues[i] = json[i].rating;
				yValues[i] = zValues[i].mean;
			}
			//console.log("yy"+yValues);

			var person = {
			firstName : "John",
			lastName : "Doe",
			age : 50,
			eyeColor : "blue"
		};
		console.log("persons" + person);
		console.log("persons" + person.firstName);
		console.log("zz" + zValues[0].mean);
		console.log("yy" + yValues);

	});

	shapes = ['circle', 'cross', 'triangle-up', 'triangle-down', 'diamond', 'square'];
	random = d3.random.normal();

	for (i = 0; i < 4; i++) {
		data.push({
			key : 'Group ' + i,
			values : []
		});

		for (j = 0; j < 50; j++) {
			data[0].values.push({
				x : 22 + j,
				y : 22 + j,
				size : Math.random(),
				shape : shapes[j % 6]
			});
		}
	}

	return data;

}

//parse csv data into datas
function CsvData() {

	var xValues = new Array();
	var yValues = new Array();
	var typeValues = new Array();
	var budgetValues = new Array();
	var nameValues = new Array();
	var typeValues = new Array();

	//var datas = [];

	d3.csv("imdb-movies.csv", function (data) {

		var rate,
		mean,
		types,
		type;
		var index_front,
		index_end;
		var firstIndex,
		lastIndex;
		var j = 0;
		for (var i = 0; i < data.length; i++) {
			rate = data[i].rating;
			index_front = rate.indexOf("|") + 1;
			index_end = rate.lastIndexOf("|");
			mean = rate.substring(index_front, index_end);
			rating_number = parseInt(rate.substring(0, index_front - 1));

			if (rating_number > 50000) {

				types = data[i].genres;
				firstIndex = types.indexOf(",");
				lastIndex = types.lastIndexOf(",");
				type = types.substring(0, firstIndex);

				xValues[movie_number] = parseInt(data[i].year);
				yValues[movie_number] = parseFloat(mean);
				budgetValues[movie_number] = parseInt(data[i].budjet);
				nameValues[movie_number] = data[i].title;
				typeValues[movie_number] = type;
				movie_number++;

				types = types.substring(firstIndex);

				//console.log("types "+types +"  firstIndex "+firstIndex+" lastIndex "+lastIndex);
				while (firstIndex != lastIndex) {
					firstIndexBefore = firstIndex;
					firstIndex = types.indexOf(",");
					lastIndex = types.lastIndexOf(",");
					type = types.substring(firstIndexBefore + 1, firstIndex);

					types = types.substring(firstIndex + 1);

					xValues[movie_number] = parseInt(data[i].year);
					yValues[movie_number] = parseFloat(mean);
					budgetValues[movie_number] = parseInt(data[i].budjet);
					nameValues[movie_number] = data[i].title;
					typeValues[movie_number] = type;
					movie_number++;

				}

				if (firstIndex == lastIndex) {

					xValues[movie_number] = parseInt(data[i].year);
					yValues[movie_number] = parseFloat(mean);
					budgetValues[movie_number] = parseInt(data[i].budjet);
					nameValues[movie_number] = data[i].title;
					typeValues[movie_number] = type;
					movie_number++;

				}
			}

		}

		shapes = ['circle', 'cross', 'triangle-up', 'triangle-down', 'diamond', 'square'],
		random = d3.random.normal();

		for (j = 0; j < xValues.length; j++) {

			if (typeValues[j] == "Action") {
				datas[0].values.push({
					x : xValues[j],
					y : yValues[j],
					name : nameValues[j],
					size : Math.sqrt(budgetValues[j] / 5000000000)
				});
			} else if (typeValues[j] == "Adventure") {
				datas[1].values.push({
					x : xValues[j],
					y : yValues[j],
					name : nameValues[j],
					size : Math.sqrt(budgetValues[j] / 5000000000)
				});
			} else if (typeValues[j] == "Biography") {
				datas[2].values.push({
					x : xValues[j],
					y : yValues[j],
					name : nameValues[j],
					size : Math.sqrt(budgetValues[j] / 5000000000)
				});
			} else if (typeValues[j] == "Comedy") {
				datas[3].values.push({
					x : xValues[j],
					y : yValues[j],
					name : nameValues[j],
					size : Math.sqrt(budgetValues[j] / 5000000000)
				});
			} else if (typeValues[j] == "Crime") {
				datas[4].values.push({
					x : xValues[j],
					y : yValues[j],
					name : nameValues[j],
					size : Math.sqrt(budgetValues[j] / 5000000000)
				});
			} else if (typeValues[j] == "Documentary") {
				datas[5].values.push({
					x : xValues[j],
					y : yValues[j],
					name : nameValues[j],
					size : Math.sqrt(budgetValues[j] / 5000000000)
				});
			} else if (typeValues[j] == "Drama") {
				datas[6].values.push({
					x : xValues[j],
					y : yValues[j],
					name : nameValues[j],
					size : Math.sqrt(budgetValues[j] / 5000000000)
				});
			} else if (typeValues[j] == "Horror") {
				datas[7].values.push({
					x : xValues[j],
					y : yValues[j],
					name : nameValues[j],
					size : Math.sqrt(budgetValues[j] / 5000000000)
				});
			} else if (typeValues[j] == "Mystery") {
				datas[8].values.push({
					x : xValues[j],
					y : yValues[j],
					name : nameValues[j],
					size : Math.sqrt(budgetValues[j] / 5000000000)
				});
			} else if (typeValues[j] == "Sci-Fi") {
				datas[9].values.push({
					x : xValues[j],
					y : yValues[j],
					name : nameValues[j],
					size : Math.sqrt(budgetValues[j] / 5000000000)
				});
			}
		}

		loadDone = true;

	});

	return datas;

}


