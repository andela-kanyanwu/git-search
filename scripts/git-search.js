var gitSearch = {
  //Loads functions that initialize when document is ready
  initialize: function() {
    $(".results").hide();
    $(".right").hide();
    this.search();
  },

  //creates the url using the username gotten from the textbox
  url: function() {
    var userName = $("#searchBox").val().trim(),
        gitUrl = "https://api.github.com/users/",
        fullUrl = gitUrl + userName;
    return fullUrl;
  },
  
  //creates url for getting number of organisations
  orgUrl: function() {
    var userName = $("#searchBox").val().trim(),
        gitUrl = "https://api.github.com/users/",
        org = "/orgs",
        fullUrl = gitUrl + userName + org;
     return fullUrl;
  },

  //creates url for getting repo names
  repoUrl: function() {
    var userName = $("#searchBox").val().trim(),
        gitUrl = "https://api.github.com/users/",
        repo = "/repos",
        fullUrl = gitUrl + userName + repo;
    return fullUrl;
  },

  //searches the API and returns results
  search: function() {
    $("#submit").click(function(event){
      event.preventDefault(); 
      $("#repos").empty();  
      $(".error").hide();   
        

      var textBox = $("#searchBox").val().trim();
     
      //To check if textbox is empty
      if (textBox === "") {
        $(".error").show(function(){
          $(".error").html("You have not entered a name!");
          $(".results").hide();
          $(".right").hide();
        });          
      }         
              
      var url = gitSearch.url();

      $.getJSON(url, function(reply) {
          $(".results").show();
          $(".right").show();

        var numFollowers = reply.followers,
            numFollowing = reply.following,
            repo = reply.public_repos,
            image = reply.avatar_url;

        $("#numFollowers").val(numFollowers);
        $("#numFollowing").val(numFollowing);        
        $("#repo").val(repo);
        $("#avatar").append("<img src=" + image + ">");
        $("#avatar").show();
      }).fail(function(error){
        $(".error").html( error.status + " " + error.statusText);
        $("#avatar").hide();
        $(".error").show();
        $(".right").hide();
      });

      //Returns the number of organisations to the textbox.
      gitSearch.orgSearch();

      //Returns the repo names
      gitSearch.repoSearch();
     
    });
  },

  //Searches for organisations and returns the total number
  orgSearch: function() {
    var url = gitSearch.orgUrl();

    $.getJSON(url, function(reply) {
      $(".results").show();
      $(".right").show();

      var numOrg = reply.length;
      $("#org").val(numOrg);     
    });
  },

  //Gets the names of repos
  repoSearch: function() {
    var url = gitSearch.repoUrl();

    $.getJSON(url, function(reply) {
      $(".results").show();
      $(".right").show();

      for (var i = 0; i < reply.length; i++) {
        var repo = reply[i].full_name;
        var repoLink = reply[i].html_url
        $("#repos").append("<ul>" +"<li>" + "<a href=" + repoLink + ' target="_blank"' + ">" + repo + "</a>" +  "</li>" + "<ul>");
      }           
    });
  }
}


$(document).ready(gitSearch.initialize())