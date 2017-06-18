$(document).ready(function(){
	
	/**
		VARIABLES
	**/
	var artistlist = [];

	//selector variables
	var artistsearch = '#artistsearch';
	var artisttabletbody = '#artisttable tbody';
	var addartistform = '#addartistform';

	//form variables (for Bootstrap validation)
	var $form = $(addartistform);
	var $successMsg = $(".alert");

	//get data and populate table onload
	getData(function( returnValue ){
    	updateTable();
	});

	/** 
		WEBSOCKET CONFIG AND LISTENERS
	**/
	var socketurl = 'ws://localhost:8080';
	var socket = new WebSocket(socketurl, 'echo-protocol');
	// socket.onopen = function () {
	//  // socket.send('hello from the client');
	// };

	//websocket methods
	socket.onmessage = function (message) {
	 // content.innerHTML = message.data +'<br />';
	 // socket.send('okay');

		artistlist = [];
		getData(function( returnValue ){
			updateTable();
		});
	 
	};

	socket.onerror = function (error) {
		console.log('WebSocket error: ' + error);
	};

	socket.addEventListener("message", function(e) {
	    // var msg = e.data;
	});

	
	/** 
		JAVASCRIPT/JQUERY EVENTS
	**/
	//On addartistform submission
	$form.validator().on("submit", function(e){
	  if(!e.isDefaultPrevented()){
	    e.preventDefault();
	    $successMsg.fadeIn('100').delay('3000').fadeOut('100');;
	    createNewArtist();
	  }
	});

	//delete button click
	$("table").on("click", ".removeartist", function(e){

	    var delartistid = $(e.target).get(0).id;
	    var data = {};
		data.selectedid = delartistid;

		var targetobject = $.grep(artistlist, function(e){ return e.id == delartistid; });

		index = artistlist.findIndex(x => x.id == delartistid);
		artistlist.splice(index, index);

	    ajaxRequests(data, 'DELETE', function(){
	    	console.log('Success: ')
	        console.log(JSON.stringify(data));
	    });

	});

	//Search for artist
	$(artistsearch).keyup(function(){
	    updateTable();
	});

	//Updates artist list on table change
	$(artisttabletbody).change(function(e){
		var chagedartistid = $(e.target).get(0).id;
		var data = {};

		data.selectedid = chagedartistid;
		var idselector = '#' + data.selectedid;
		data.afavorite = $(idselector).is(":checked");
		console.log("data: " + data);

		ajaxRequests(data, 'PUT', function(){
			var targetobject = $.grep(artistlist, function(e){ return e.id == chagedartistid; });

            index = artistlist.findIndex(x => x.id==targetobject[0].id);

            if (artistlist[index].favoritebool == "false") {
            	artistlist[index].favoritebool = "true"
            }else if(artistlist[index].favoritebool == "true") {
            	artistlist[index].favoritebool = "false"
            }
		});

	});

	/** 
		METHODS
	**/
	//Creates new artist
    function createNewArtist(){
	    
		var data = {};
		data.name = $('#addartistform').find('input[name="artistname"]').val();
		data.birthPlace = $('#addartistform').find('input[name="artistbirthplace"]').val();
		data.birthDate = $('#addartistform').find('input[name="artistbirthdate"]').val();
		data.favoritebool = $('#addartistform').find('input[name="artistfavorite"]').is(":checked").toString();


		ajaxRequests(data, 'POST', function(){
			console.log('Success: ')
	        console.log(JSON.stringify(data));
	        artistlist.push(data);
		});

	    clearForm();

	    //return false should also prevent site reload
	    return false;
	};

	//Update artist table
	function updateTable(){
		var artistsearchword = $(artistsearch).val();

			var tabledata = "";

			for (var i = 0; i < artistlist.length; i++) {

				var artistselement = artistlist[i];

				if (artistselement.name.toLowerCase().includes(artistsearchword.toLowerCase())) {

					//radio button
					var ischecked = artistselement.favoritebool == 'true' ? " checked" : "";

					tabledata += "<tr>";
				    tabledata += "<td>"+artistselement.id+"</td>";
				    tabledata += "<td>"+artistselement.name+"</td>";
				    tabledata += "<td>"+artistselement.birthPlace+"</td>";
				    tabledata += "<td>"+artistselement.birthDate+"</td>";
				    tabledata += "<td><input type='checkbox' value='"+artistselement.favoritebool+"' id='"+artistselement.id+"'"+ischecked+"></td>";
				    tabledata += "<td><button type='button' id="+artistselement.id+" class='btn btn-danger removeartist'>Delete</button></td>";
					tabledata += "</tr>";
					
				}

			}

			$(artisttabletbody).html(tabledata);
	}

	//Clear form
	function clearForm(){
		$(addartistform).find('input:text, input[type=date]').val('');
    	$(addartistform).find('input[type=checkbox]').prop('checked', false);
	}

	//AJAX method
	function ajaxRequests(data, type, callback){
		$.ajax({
	        url: '/api/artist',
	        data: JSON.stringify(data),
	        contentType: 'application/json',
	        type: type,
	        success: callback(),
	        error: function (xhr, status, error) {
	            console.log('Error: ' + error);
	        },
	    });
	}

	//get data
	function getData(callback){
		var artistsurl = "/api/artists";

		$.getJSON(artistsurl, function(result){

			$.each(result, function(i, field){
				artistlist.push(field);
			});

		}).then(function() {
			callback();
		});
	}

});