
function tplawesome(e,t){
	res=e;
	for(var n=0;n<t.length;n++){
		res = res.replace(/\{\{(.*?)\}\}/g,function(e,r){
							return t[n][r]
						})
	}
	
	return res
}

var request;

$(function() {
    $("form").on("submit", function(e) {
       e.preventDefault();
       // prepare the request
         request = gapi.client.youtube.search.list({
            part: "snippet",
            type: "video",
            q: encodeURIComponent($("#search").val()).replace(/%20/g, "+"),
            maxResults: 6
       }); 
       // execute the request
       request.execute( function(response) {
          var results = response.result;
          $("#results").html("");
          var resultArr = [];

          $.each(results.items, function(index, item)
          {
            resultArr.push({
              title: item.snippet.title,
              videoId: item.id.videoId,
              date: item.snippet.publishedAt.substring(0,10)
            });
          });

        
          $.each(results.items, function(index, item) {
            $.get("tpl/item.html", function(data) {
				$("#results").append( tplawesome(data, [ { 
														   "title":item.snippet.title, 
														   "videoid":item.id.videoId , 
														   "date":item.snippet.publishedAt.substring(0,10) }]
												)
									);
            });
          });

          resetVideoHeight();
       });
    });
    
    $(window).on("resize", resetVideoHeight);
});



$("#sortByTitle").on( 'click', function()
{
  request.execute( async function(response) {
          var results = response.result;
          $("#results").html("");
          var resultArr = [];

          $.each(results.items, function(index, item)
          {
            resultArr.push({
              title: item.snippet.title,
              videoId: item.id.videoId,
              date: item.snippet.publishedAt.substring(0,10)
            });
          });

          resultArr.sort(function(a,b)
          {
            for ( var i = 0 ; i < Math.min(a.title.length , b.title.length) ; i++ ) {
              if ( a.title[i].toUpperCase() < b.title[i].toUpperCase() ) {
                return -1 ; 
              }
              else if ( a.title[i].toUpperCase() == b.title[i].toUpperCase() ) 
                continue ;
              else return 1 ;
            }  
            
            if ( a.title.length > b.title.length ) {
              return 1 ;
            }
            return -1 ; 
          });

          console.log ( resultArr ) ;
          var data;
          await $.get("tpl/item.html",  function(res) {
            data = res;
          });

          $.each(resultArr, function(index, item) {
          $("#results").append( tplawesome(data, [ { 
                               "title":item.title, 
                               "videoid":item.videoId , 
                               "date":item.date }]
                        )
                  );
            console.log(item.title);
          });
          resetVideoHeight();
       });
    $(window).on("resize", resetVideoHeight);
});


$("#sortByDate").on( 'click',  function(){
  request.execute( async function(response) {
          var results = response.result;
          $("#results").html("");
          var resultArr2 = [];

          $.each(results.items, function(index, item)
          {
            resultArr2.push({
              title: item.snippet.title,
              videoId: item.id.videoId,
              date: item.snippet.publishedAt.substring(0,10)
            });
          });

          resultArr2.sort(function(a,b)
          { 
            for ( var i = 0 ; i < Math.min(a.date.length , b.date.length) ; i++ ) {
              if ( a.date[i] < b.date[i] ) {
                return 1 ; 
              }
              else if ( a.date[i] == b.date[i] ) 
                continue ;
              else return -1 ;
            }  
            if ( a.date > b.date ) {
              return -1 ;
            }
            return 1 ; 
          });
          //console.log ( resultArr2 ) ;

          var data;
          await $.get("tpl/item.html",  function(res) {
            data = res;
          });

          $.each(resultArr2, function(index, item) {
            
          $("#results").append( tplawesome(data, [ { 
                               "title":item.title, 
                               "videoid":item.videoId , 
                               "date":item.date }]
                        )
                  );
            });
          resetVideoHeight();
       });
    
    $(window).on("resize", resetVideoHeight);
});

function resetVideoHeight() {
    $(".video").css("height", $("#results").width() * 9/16);
}

function init() {
    gapi.client.setApiKey("AIzaSyAf4Hz2qvVUJdmGVXFkF7AA2No1awou1FU");
    gapi.client.load("youtube", "v3", function() {
        // yt api is ready
    });
}
