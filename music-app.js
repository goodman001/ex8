//A JS by KBM 2017
window.MUSIC_DATA = {};
var songsLoaded = false;
var playlistsLoaded = false;

var navbar = document.body.querySelector('nav ul');
var libraryHeader = document.getElementById('libraryHeader');
var playlistsHeader = document.getElementById('playlistsHeader');
var searchHeader = document.getElementById('searchHeader');
var navLibraryButton = document.querySelector('nav > ul > #library');
var navPlaylistsButton = document.querySelector('nav > ul > #playlists');
var navSearchButton = document.querySelector('nav > ul > #search');
var songsContainer = document.createElement("div");
var playlistsContainer = document.createElement("div");
var playlists;
var songsSortByArtist;
var songsSortByTitle;
var sortbyArtistButton = document.querySelector('.librarySortButton#button1');
var sortbyTitleButton = document.querySelector('.librarySortButton#button2');
var songsContainerSortTypeStatus = "artist";
var searchWord = "";
var sortByFlag = "artist";  //default
playlistsContainer.style.display="none";
songsContainer.style.display="none";
document.body.appendChild(playlistsContainer);
document.body.appendChild(songsContainer);

window.onload = document.body.querySelector('#libraryHeader > #sortButtons > #button1')

$.get('/api/playlists',function(data){
  // console.log(data.playlists[0]);
  // var playlistArray = JSON.parse(data);
  // console.log(playlistArray);
  console.log(data);
  window.MUSIC_DATA['playlists'] = data.playlists;
  playlistsLoaded = true;
  attemptRunApplication();
});

$.get('/api/songs',function(data){
  window.MUSIC_DATA['songs'] = data.songs;
  songsLoaded = true;
  attemptRunApplication();
});

function enableNavBar(){
  navbar.addEventListener("click",navbarClicked,false);
}
function disableNavBar(){
  navbar.removeEventListener("click",navbarClicked,false);
}

var attemptRunApplication = function() {
    if (songsLoaded && playlistsLoaded) {
        document.getElementById("sortButtons").addEventListener("click",changeSort,false);
        enableNavBar();
        document.getElementById("searchbar").addEventListener("keydown",search,false);
        songsContainer.addEventListener("click",songButtonsClicked,false);
        playlistsContainer.addEventListener("click",playlistsClicked,false);
        $('#add_playlist').click(function(){
          addNewPlaylistModal();
        });
        playlists = MUSIC_DATA.playlists.slice(0);
        songsSortByArtist = MUSIC_DATA.songs.slice(0);
        songsSortByTitle = MUSIC_DATA.songs.slice(0);
        sortByTitle();
        // loadSongsToSongsContainer("artist");
        // if(window.location.href.pathname){
        //   showSearch();
        // } else if (window.location.href.indexOf('/library')) {
        //   showLibrary();
        // } else {
        //   showPlaylists();
        // }
        switch (window.location.pathname) {
          case "/search":
            showSearch();
            break;
          case "/playlists":
            showPlaylists();
            break;
          case "/library":
            showLibrary();
            break;
          default:
            alert("error which page?");
        }
    }
};

function navbarClicked(e){
  if(e.target !== e.currentTarget){
    var clickedItem = e.target.id;
    var clickedObject = e.toElement || e.relatedTarget;
    if(navLibraryButton.contains(clickedObject)){
      showLibrary();
      window.history.replaceState(null, null, 'library');
    }
    else if(navPlaylistsButton.contains(clickedObject)){
      showPlaylists();
      window.history.replaceState(null, null, 'playlists');
    }
    else if (navSearchButton.contains(clickedObject)) {
      showSearch();
      window.history.replaceState(null, null, 'search');
    }
  }
  e.stopPropagation();
  if((playlistNameInPlaylistPage=document.getElementById('playlistNameInPlaylistPage'))!==null){
    songsContainer.removeChild(playlistNameInPlaylistPage);
  }
}

function showLibrary(){
  libraryHeader.style.display="block";
  songsContainer.style.display="block";
  playlistsHeader.style.display="none";
  searchHeader.style.display="none";
  navLibraryButton.className = "active";
  navPlaylistsButton.className = "";
  navSearchButton.className = "";
  playlistsContainer.style.display="none";
  loadSongsToSongsContainer(sortByFlag);
  setSortButtonActive();
}
function showPlaylists(){
  playlistsHeader.style.display="block";
  libraryHeader.style.display="none";
  searchHeader.style.display="none";
  navPlaylistsButton.className = "active";
  navLibraryButton.className = "";
  navSearchButton.className = "";
  songsContainer.style.display="none";
  loadPlaylistsToPlaylistsContainer();
}
function showSearch(){
  searchHeader.style.display="block";
  libraryHeader.style.display="none";
  playlistsHeader.style.display="none";
  navSearchButton.className = "active";
  navLibraryButton.className = "";
  navPlaylistsButton.className = "";
  songsContainer.style.display="none";
  playlistsContainer.style.display="none";
  // var keyword = document.querySelector('#searchbar>#searchField').value
  // if(keyword){
  //   console.log(keyword.length);
  //   search
  // }
  search(searchWord);
}

function changeSort(e){
  if(e.target !== e.currentTarget){
    var clickedItem = e.target.id;
    var clickedObject = e.toElement || e.relatedTarget;
    if (sortbyArtistButton.contains(clickedObject) && !sortbyArtistButton.style.boxShadow){ // sort by artist
      sortByFlag = "artist";
      // sortbyTitleButton.style.boxShadow = null;
      // sortbyArtistButton.style.boxShadow = "inset 0 0 10px #000000";
      loadSongsToSongsContainer("artist");
    }
    else if (sortbyTitleButton.contains(clickedObject) && !sortbyTitleButton.style.boxShadow){ // sort by title
      sortByFlag = "title";
      // sortbyArtistButton.style.boxShadow = null;
      // sortbyTitleButton.style.boxShadow = "inset 0 0 10px #000000";
      loadSongsToSongsContainer("title");
    }
    else {
      //nothing to do
    }
    setSortButtonActive();
  }
  e.stopPropagation();
}

function loadSongsToSongsContainer(sortBy){
  var arrayToPop;
  songsContainer.innerHTML="";
  if (sortBy == "artist") {
    arrayToPop = songsSortByArtist;
    songsContainerSortTypeStatus = "artist";
  }
  else if (sortBy =="title") {
    arrayToPop = songsSortByTitle;
    songsContainerSortTypeStatus = "title";
  }
  else {
    console.log("error");
  }
  for (var i = 0; i < arrayToPop.length; i++) {
    var individualDiv = document.createElement("div");
    var coverimg=document.createElement("img");
    individualDiv.className = "song";
    var pic = i%10+1;
    var path = "covers/" + pic + ".png";
    coverimg.src=path;
    coverimg.alt = "list_image_placeholder";
    var songInfoDiv = document.createElement("div");
    songInfoDiv.className = "songInfo";
    var songNameh4 = document.createElement("h4");
    var songNameHolder = document.createTextNode(arrayToPop[i].title);
    songNameh4.appendChild(songNameHolder);
    songNameh4.className="overflow-ellipsis songs";
    var artistP = document.createElement("p");
    var artistHolder = document.createTextNode(arrayToPop[i].artist);
    artistP.appendChild(artistHolder);
    artistP.className="overflow-ellipsis";
    var songId = document.createElement("p");
    var songIDtemp = document.createTextNode(arrayToPop[i].id);
    songId.appendChild(songIDtemp);
    songId.style.display="none";
    songId.className="hiddenSongIDinSongs";
    var playButtonSpan = document.createElement("span");
    var addButtonSpan = document.createElement("span");
    playButtonSpan.className=("glyphicon glyphicon-play songPlayButton");
    addButtonSpan.className=("glyphicon glyphicon-plus-sign songAddButton");
    songInfoDiv.appendChild(songNameh4);
    songInfoDiv.appendChild(artistP);
    songInfoDiv.appendChild(songId);
    individualDiv.appendChild(coverimg);
    individualDiv.appendChild(songInfoDiv);
    individualDiv.appendChild(playButtonSpan);
    individualDiv.appendChild(addButtonSpan);
    songsContainer.appendChild(individualDiv);
  }
  songsContainer.style.display="block";
}
function loadPlaylistsToPlaylistsContainer(){
  playlistsContainer.innerHTML = "";
  for (var i = 0; i < playlists.length; i++) {
    var playlistTitle = document.createTextNode(playlists[i].name);
    var playlistIDP = document.createElement("p");
    var playlistID = document.createTextNode(playlists[i].id);
    var playlistImg = document.createElement("img");
    var playlisth4 = document.createElement("h4");
    var playlistSpan = document.createElement("span");
    var individualDiv = document.createElement("div");
    playlistIDP.appendChild(playlistID);
    playlistIDP.style.display="none";
    playlistImg.src = "covers/"+(i%10+1)+".png";
    playlistImg.alt = "playlist img";
    playlistSpan.className = "glyphicon glyphicon-chevron-right";
    individualDiv.className="playlist";
    playlisth4.className="overflow-ellipsis";;
    playlisth4.appendChild(playlistTitle);
    individualDiv.appendChild(playlistImg);
    individualDiv.appendChild(playlisth4);
    individualDiv.appendChild(playlistSpan);
    individualDiv.appendChild(playlistIDP);
    playlistsContainer.appendChild(individualDiv);
  }
  playlistsContainer.style.display="block";
}
function loadAPlaylistToSongsContainer(playlistID){
  // var nametext = document.createTextNode(MUSIC_DATA.playlists[playlistID].name);
  // var playlistName = document.createElement("h4");
  // playlistName.id="playlistNameInPlaylistPage";
  // playlistName.appendChild=(nametext);
  // console.log(nametext);
  // playlistName.innerHTML=MUSIC_DATA.playlists[playlistID].name;
  // document.body.appendChild=(playlistName);
  //console.log(playlistName);
  songsContainer.innerHTML="";
  var playlistName = document.createElement("h4");
  playlistName.id="playlistNameInPlaylistPage";
  playlistName.innerHTML=MUSIC_DATA.playlists[playlistID].name;
  songsContainer.appendChild(playlistName);
  //console.log(playlists[playlistID]);
  for (var i = 0; i < playlists[playlistID].songs.length; i++) {
    var songID = playlists[playlistID].songs[i];
    var songObj = MUSIC_DATA.songs[parseInt(songID)];
    var individualDiv = document.createElement("div");
    var coverimg=document.createElement("img");
    individualDiv.className = "songperson";
    var pic = i%10+1;
    var path = "covers/" + pic + ".png";
    coverimg.src=path;
    coverimg.alt = "list_image_placeholder";
    var songInfoDiv = document.createElement("div");
    songInfoDiv.className = "songInfo";
    var songNameh4 = document.createElement("h4");
    var songNameHolder = document.createTextNode(songObj.title);
    songNameh4.appendChild(songNameHolder);
    var artistP = document.createElement("p");
    var artistHolder = document.createTextNode(songObj.artist);
    artistP.appendChild(artistHolder);
    artistP.className="overflow-ellipsis";
    var songId = document.createElement("p");
    var songIDtemp = document.createTextNode(songObj.id);
    songId.appendChild(songIDtemp);
    songId.style.display="none";
    songId.className="hiddenSongIDinSongs";
    var playerId = document.createElement("p");
    var playerIDtemp = document.createTextNode(MUSIC_DATA.playlists[playlistID].id);
    playerId.appendChild(playerIDtemp);
    playerId.style.display="none";
    playerId.className="hiddenSongIDinSongs";
    
    var playButtonSpan = document.createElement("span");
    var addButtonSpan = document.createElement("span");
    var delButtonSpan = document.createElement("span");
    playButtonSpan.className=("glyphicon glyphicon-play songPlayButton");
    addButtonSpan.className=("glyphicon glyphicon-plus-sign songAddButton");
    delButtonSpan.className=("glyphicon glyphicon-remove-circle songDelButton");
    songInfoDiv.appendChild(songNameh4);
    songInfoDiv.appendChild(artistP);
    songInfoDiv.appendChild(songId);
    songInfoDiv.appendChild(playerId);
    individualDiv.appendChild(coverimg);
    individualDiv.appendChild(songInfoDiv);
    individualDiv.appendChild(playButtonSpan);
    individualDiv.appendChild(addButtonSpan);
    individualDiv.appendChild(delButtonSpan);
    songsContainer.appendChild(individualDiv);
  }
  songsContainer.style.display="block";
}

function sortByArtist(){
  //bubble sort worse n^2:
  var flag = 1;
  while (flag) {
    flag = 0;
    for (var i = 0; i < songsSortByArtist.length-1; i++) {
      var compareA ="";
      var compareB ="";
      if(songsSortByArtist[i].artist.substring(0,4).toUpperCase() == "THE ") {
        compareA = songsSortByArtist[i].artist.substring(4,6);
      }
      else {compareA = songsSortByArtist[i].artist.substring(0,2);}
      if(songsSortByArtist[i+1].artist.substring(0,4).toUpperCase() == "THE "){
        compareB = songsSortByArtist[i+1].artist.substring(4,6);
      }
      else {compareB = songsSortByArtist[i+1].artist.substring(0,2);}
      if(compareA > compareB){
        flag = 1;
        var temp = songsSortByArtist[i+1];
        songsSortByArtist[i+1] = songsSortByArtist[i];
        songsSortByArtist[i] = temp;
      }
    }
  }
}
function sortByTitle(){
  //bubble sort wrose n^2
  var flag = 1;
  var counter = 0;
  while (flag) {
    counter ++;
    // console.log(counter);
    flag = 0;
    for (var i = 0; i < songsSortByTitle.length-1; i++) {
      var compareA ="";
      var compareB ="";
      if(songsSortByTitle[i].title.substring(0,4).toUpperCase() == "THE "){
        compareA = songsSortByTitle[i].title.charAt(4);
      }
      else {
        compareA = songsSortByTitle[i].title.charAt(0);
      }
      if(songsSortByTitle[i+1].title.substring(0,4).toUpperCase() == "THE "){
        compareB = songsSortByTitle[i+1].title.charAt(4);
      }
      else {
        compareB = songsSortByTitle[i+1].title.charAt(0);
      }

      if(compareA > compareB){
        //console.log(songsSortByTitle[i].title + "  A= " +compareA + "  " + songsSortByTitle[i+1].title + "  B= " +compareB);
        flag = 1;
        var temp = songsSortByTitle[i+1];
        songsSortByTitle[i+1] = songsSortByTitle[i];
        songsSortByTitle[i] = temp;
      }
    }
  }
}

function search(e){
  if(typeof(e)!=="string") {
    //get the typed keyword
    if(window.event) { // IE
      keynum = e.keyCode;
    } else if(e.which){ // Netscape/Firefox/Opera
      keynum = e.which;
    }
    //console.log(keynum);
    if (keynum >= 96 && keynum <=105) {
      keynum = keynum - 48;
    }
    if( keynum == 8 || keynum == 46 ){
      searchWord = searchWord.substring(0,searchWord.length-1);
    }
    else {
      searchWord = searchWord.concat(String.fromCharCode(keynum));
    }
  }
  //console.log(searchWord);
  //search and pop matching playlists
  playlistsContainer.innerHTML="";
  songsContainer.innerHTML="";
  for (var i = 0; i < playlists.length; i++) {
    if(playlists[i].name.toUpperCase().indexOf(searchWord)>=0){
      //the following code is duplicated in the pop playlist info function
      var playlistTitle = document.createTextNode(playlists[i].name);
      var playlistIDP = document.createElement("p");
      var playlistID = document.createTextNode(playlists[i].id);
      var playlistImg = document.createElement("img");
      var playlisth4 = document.createElement("h4");
      var playlistSpan = document.createElement("span");
      var individualDiv = document.createElement("div");
      playlistIDP.appendChild(playlistID);
      playlistIDP.style.display="none";
      playlistImg.src = "covers/"+(i%10+1)+".png";
      playlistImg.alt = "playlist img";
      playlistSpan.className = "glyphicon glyphicon-chevron-right";
      individualDiv.className="playlist";
      playlisth4.className="overflow-ellipsis";
      playlisth4.appendChild(playlistTitle);
      individualDiv.appendChild(playlistImg);
      individualDiv.appendChild(playlisth4);
      individualDiv.appendChild(playlistSpan);
      individualDiv.appendChild(playlistIDP);
      playlistsContainer.appendChild(individualDiv);
    }
  }
  playlistsContainer.style.display="block";
  //search and pop matching songs
  for (var i = 0; i < songsSortByArtist.length; i++) {
    if(songsSortByArtist[i].title.toUpperCase().indexOf(searchWord)>=0 || songsSortByArtist[i].artist.toUpperCase().indexOf(searchWord)>=0){
      //the following code is duplicated in pop songs to songs container function
      var songdiv = document.createElement("div");
      var coverimg=document.createElement("img");
      songdiv.className = "song";
      var pic = i%10+1;
      var path = "covers/" + pic + ".png";
      coverimg.src=path;
      coverimg.alt = "list_image_placeholder";
      var songInfoDiv = document.createElement("div");
      songInfoDiv.className = "songInfo";
      var songNameh4 = document.createElement("h4");
      var songNameHolder = document.createTextNode(songsSortByArtist[i].title);
      songNameh4.appendChild(songNameHolder);
      var artistP = document.createElement("p");
      var artistHolder = document.createTextNode(songsSortByArtist[i].artist);
      artistP.appendChild(artistHolder);
      artistP.className="overflow-ellipsis";
      var songId = document.createElement("p");
      var songIDtemp = document.createTextNode(songsSortByArtist[i].id);
      songId.appendChild(songIDtemp);
      songId.style.display="none";
      songId.className="hiddenSongIDinSongs";
      var playButtonSpan = document.createElement("span");
      var addButtonSpan = document.createElement("span");
      playButtonSpan.className=("glyphicon glyphicon-play songPlayButton");
      addButtonSpan.className=("glyphicon glyphicon-plus-sign songAddButton");
      songInfoDiv.appendChild(songNameh4);
      songInfoDiv.appendChild(artistP);
      songInfoDiv.appendChild(songId);
      songdiv.appendChild(coverimg);
      songdiv.appendChild(songInfoDiv);
      songdiv.appendChild(playButtonSpan);
      songdiv.appendChild(addButtonSpan);
      songsContainer.appendChild(songdiv);
    }
  }
  songsContainer.style.display="block";
}

function popGrayOverlay(){
  var overlay = document.createElement("div");
  overlay.id = "overlay";
  if(songsContainer.clientHeight>window.innerHeight){
    var height = songsContainer.clientHeight.toString().concat("px");
  }
  overlay.style.height=height;
  document.body.appendChild(overlay);
  overlay.addEventListener("click",function(){
    removeGrayOverlay();
    removeModal();
    closeNewPlaylistModal();
  });
}
function removeGrayOverlay(){
  var overlay = document.getElementById('overlay');
  if(overlay !== null){
    document.body.removeChild(overlay);
  }
}
function popModal(songID){
  disableNavBar();
  songsContainer.removeEventListener("click",songButtonsClicked,false);
  var modal = document.createElement("div");
  modal.id="addtoPlaylistModal";
  var modalTitle = document.createElement("h4");
  var title = document.createTextNode("Choose playlist");
  var dismissButt = document.createElement("span");
  modalTitle.appendChild(title);
  dismissButt.className="glyphicon glyphicon-remove";
  modal.appendChild(modalTitle);
  modal.appendChild(dismissButt);
  modal.appendChild(fetchPlaylistData());
  modal.addEventListener("click",function(e){
    modalClicked(e,songID)},false);
  document.body.appendChild(modal);
}
function removeModal(){
  enableNavBar();
  songsContainer.addEventListener("click",songButtonsClicked,false);
  if((modal=document.getElementById('addtoPlaylistModal')) !== null){
    document.body.removeChild(modal);
  }
}
function fetchPlaylistData(){
  var playlistdiv = document.createElement("div");
  for (var i = 0; i < playlists.length; i++) {
    var individualDiv = document.createElement("div");
    var playlistTitle = document.createTextNode(playlists[i].name);
    var playlist = document.createElement("h4");
    var playlistID = document.createElement("p");
    var playlisttemp = document.createTextNode(playlists[i].id);
    playlistID.appendChild(playlisttemp);
    playlistID.style.display="none";
    playlistID.className="hiddenPlaylistIDinModal";
    playlist.appendChild(playlistTitle);
    playlist.style.margin = "0 0 5% 6%";
    playlist.style.clear="left"
    playlist.style.color = "#704697";
    playlist.className = "overflow-ellipsis";
    individualDiv.appendChild(playlist);
    individualDiv.appendChild(playlistID);
    playlistdiv.appendChild(individualDiv);
  }
  playlistdiv.id="theplaylistinmodal";
  return playlistdiv;
}
function songButtonsClicked(e){
  if(e.target !== e.currentTarget){
    var clickedItem = e.target.id;
    var clickedObject = e.toElement || e.relatedTarget;
    if (clickedObject.className=="glyphicon glyphicon-plus-sign songAddButton") {
      var songID = clickedObject.parentNode.childNodes[1].childNodes[2].innerHTML;
      popGrayOverlay();
      popModal(songID);
    }else if(clickedObject.className=="glyphicon glyphicon-remove-circle songDelButton")
    {
      var songID = clickedObject.parentNode.childNodes[1].childNodes[2].innerHTML;
      var playerID = clickedObject.parentNode.childNodes[1].childNodes[3].innerHTML;
      console.log(songID);
      $.post("/playlists/"+playerID,{'song': songID},function(status){
          msgModal("Delete Status:",status);
          if(status.indexOf('not')<0)
          {
            for(var j=0;j<playlists[playerID].songs.length;j++)
            {
              if(playlists[playerID].songs[j] == songID)
              {
                playlists[playerID].songs.splice(j,1);
                break;
              }
            }
          }
          loadAPlaylistToSongsContainer(playerID)
          console.log(playlists);
          //removeGrayOverlay();
          //removeModal();
          closeNewPlaylistModal();
        //showPlaylists();
        //attemptRunApplication();
      });
      
    }
  }

}
function modalClicked(e,songID){
  if(e.target !== e.currentTarget){
    var clickedItem = e.target.id;
    var clickedObject = e.toElement || e.relatedTarget;
    if (clickedObject.className=="glyphicon glyphicon-remove") {
      removeGrayOverlay();
      removeModal();
    }
    else if (clickedObject.className=="overflow-ellipsis") {
      var playlistID = clickedObject.parentNode.childNodes[1].innerHTML;
      songID = parseInt(songID);
      if(playlists[playlistID].songs.indexOf(songID)==-1){
        playlists[playlistID].songs.push(songID);
      }
      var playlistName = (playlists[playlistID].name);
      var postStatus = "";
      $.post('/api/playlists/'+playlistID,{'song':songID},function(status){
        postStatus = postStatus + status;
        removeGrayOverlay();
        removeModal();
        msgModal("Add Status:",postStatus);
      });
    }
  }
  else{

  }
  e.stopPropagation();
}
function msgModal(msg,playlistName){
  disableNavBar();
  songsContainer.removeEventListener("click",songButtonsClicked,false);
  var modal = document.createElement("div");
  modal.className="overflow-ellipsis";
  modal.id="msgModal";
  var modalMsg = document.createElement("h4");
  var msg = document.createTextNode(msg)
  modalMsg.appendChild(msg);
  var modalTitle = document.createElement("p");
  modalTitle.className="overflow-ellipsis";
  modalTitle.style.marginLeft = "5%";
  var title = document.createTextNode(playlistName);
  modalTitle.appendChild(title);
  modal.appendChild(modalMsg);
  modal.appendChild(modalTitle);
  // modal.appendChild(dismissButt);
  document.body.addEventListener("click",closeMSGModal,false);
  popGrayOverlay();
  document.body.appendChild(modal);
}
function closeMSGModal(){
  document.body.removeEventListener("click",closeMSGModal,false);
  removeGrayOverlay();
  enableNavBar();
  songsContainer.addEventListener("click",songButtonsClicked,false);
  if((modal=document.getElementById('msgModal')) !== null){
    document.body.removeChild(modal);
  }
}
function addNewPlaylistModal() {
  disableNavBar();
  popGrayOverlay();
  var modal = document.createElement("div");
  modal.id="addNewPlaylistModal";
  var modalTitle = document.createElement("h4");
  var title = document.createTextNode("Add new playlist");
  modalTitle.appendChild(title);
  var form = document.createElement("form");
  var input = document.createElement("input");
  input.style.marginLeft = "3%";
  form.setAttribute('action','');
  input.setAttribute('type','text');
  input.setAttribute('id','newPlaylistTextFiled');
  input.setAttribute('placeholder','Enter Playlist Name');
  input.setAttribute('name','playlistName');
  var submit = document.createElement("button");
  submit.setAttribute('type','button');
  submit.setAttribute('id','submitNewPlaylistName');
  var button = document.createTextNode("Submit");
  submit.appendChild(button);
  form.appendChild(input);
  form.appendChild(submit);
  modal.appendChild(modalTitle);
  modal.appendChild(form);
  document.body.appendChild(modal);
  $('#submitNewPlaylistName').click(function(){
    addNewPlaylist($('#newPlaylistTextFiled').val());
  });
  $("#newPlaylistTextFiled").on('keydown', function (e) {
    if (e.keyCode == 13) {
        addNewPlaylist($('#newPlaylistTextFiled').val());
        e.preventDefault();
    }
  });
}
function closeNewPlaylistModal(){
  removeGrayOverlay();
  enableNavBar();
  if((modal=document.getElementById('addNewPlaylistModal')) !== null){
    document.body.removeChild(modal);
  }
}
function addNewPlaylist(name){
  if(name==""){
    alert("Enter a playlist name.");
  }
  else {
    playlists.push({'id': playlists.length,'name':name,'songs':[]});
    
    window.MUSIC_DATA['playlists'] = playlists;
    //console.log(window.MUSIC_DATA['playlists']);
    $.post("/api/playlists",{'name': name},function(status){
        msgModal("Add Status:",status);
        //removeGrayOverlay();
        //removeModal();
      closeNewPlaylistModal();
      showPlaylists();
      //attemptRunApplication();
    });
  }
}
function setSortButtonActive(){
  if(sortByFlag=="artist"){
    sortbyTitleButton.style.boxShadow = null;
    sortbyArtistButton.style.boxShadow = "inset 0 0 10px #000000";
  }
  else if (sortByFlag=="title") {
    sortbyArtistButton.style.boxShadow = null;
    sortbyTitleButton.style.boxShadow = "inset 0 0 10px #000000";
  }
}
function playlistsClicked(e){
  if(e.target !== e.currentTarget){
    $('#playlistsHeader').css('display','none');
    var clickedItem = e.target.id;
    var clickedObject = e.toElement || e.relatedTarget;
    while(clickedObject.className!="playlist"){
      clickedObject = clickedObject.parentNode;
    }
    var playlistID = parseInt(clickedObject.children[3].textContent);
    playlistsContainer.style.display="none";
    loadAPlaylistToSongsContainer(playlistID);
  }
  e.stopPropagation();
}
