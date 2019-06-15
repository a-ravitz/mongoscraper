
  
  $(".save").on("click", function () {
    console.log("in .save onclick")
    console.log($(this).attr("data-id"))

    var thisId = $(this).attr("data-id")
    
        $.ajax({
          method: "POST",
          url: "/articleSaver/" + thisId,
          data: {
            // Values taken from the article 
            title: $(".title").val(),
            summary: $(".summary").val(),
            link: $(".link").val(),
            image: $(".image").val()
          }
        }).then(function(data) {
            console.log("in promise")
            console.log(data);
            console.log(JSON.stringify(data))
            // Empty the notes section
          });

  })

  $(".delete").on("click", function () {
    console.log("in .delete onclick")
    console.log($(this).attr("data-id"))
    var thisId = $(this).attr("data-id")
    
        $.ajax({
          method: "DELETE",
          url: "/saved/" + thisId,
        }).then(function(data) {
            console.log(data)
            console.log("article has been deleted")
            console.log("here is .delete on click's data" + JSON.stringify(data));
            // Empty the notes section
            
          })
        

  })

  $(document).on('click', '#delete', function () {
    console.log("in the #delete on click")
    var noteid = $(this).data("noteid");
    var articleid = $(this).data("data-id");
    
    console.log("note-delete");
    $.ajax({
            method: "DELETE",
            url: "/notes/" + noteid + "/" + articleid
        })
        .done(function (note) {
            window.location.reload();
        });
  });

  $(".row1").on("click", function() {
    console.log("in the .row1 on click")

    // Empty the notes from the note section
    
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");
    console.log("this is thisId: " + thisId)
    // Now make an ajax call for the Article

    $.ajax({
      method: "GET",
      url: "/saved/" + thisId
    })
      // With that done, add the note information to the page
      .then(function(data) {
        // console.log(data);
        // The title of the article
        $("#notes").append("<h2>" + data.title + "</h2>");
        // An input to enter a new title
        $("#notes").append("<input id='titleinput' name='title' >");
        // A textarea to add a new note body
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
  
        // If there's a note in the article
        if (data.note) {
          console.log(data.note)
          // Place the title of the note in the title input
          $("#titleinput").val(data.note.title);
          // Place the body of the note in the body textarea
          $("#bodyinput").val(data.note.body);

        }
      });
      
  });
  
  $(window).on("click", function(e) {

    if(e.target.closest("#notes")) {
      return;
    } else {
      $("#notes").empty()
    }
  
  })

  $(document).on("click","#savenote", function() {
    console.log("in #save note ")
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/saved/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });

      $("#titleinput").val("");
      $("#bodyinput").val("")
  })
