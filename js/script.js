console.log("Let's start our JavScript")
let currentsong = new Audio();
let songs=[];
let curfolder;
let curvol;
//Writing a program to add cards dynamically
async function fetchsong(folder) {
    curfolder=folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs=[];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }

    }

      //show all the songs in the playlists
      let songsol = document.querySelector(".playlist").getElementsByTagName("ol")[0]
      songsol.innerHTML=" ";
      for (const song of songs) {
          songsol.innerHTML = songsol.innerHTML + `  <li>
                      <img src="img/music.svg" alt="" class="c-svg">
                      <div>${song.replaceAll("%20", " ")}</div>
                      <div class="wrap flex">Play Now <img src="splay.svg" alt="" class="c-svg"></div>
                  </li>`;
  
      }
      //play the first song code
      //     var audio = new Audio(songs[0]);
      //     audio.play();
      //     audio.addEventListener("loadeddata", () => {
      //    console.log(audio.duration, audio.src, audio.currentTime)
      //     })
      Array.from(document.querySelector(".playlist").getElementsByTagName("li")).forEach(e => {
          e.addEventListener("click", element => {
              console.log(e.getElementsByTagName("div")[0].innerHTML)
              playmusic(e.getElementsByTagName("div")[0].innerHTML);
          })
      })
      return songs;

}
function formatTime(seconds) {
    seconds = Math.floor(seconds); // Remove milliseconds
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}


const playmusic = (track,pause=false) => {
    // let audio = new Audio("/songs/" + track)
    currentsong.src = `/${curfolder}/` + track;
    if(!pause){
        currentsong.play();
        play.src="img/pause.svg";
    }
    document.querySelector(".songinfo").innerHTML=decodeURI(track);
    document.querySelector(".songtime").innerHTML="00:00/00:00"
}
async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:3000/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    console.log(div);
    let anchors=div.getElementsByTagName("a");
    console.log(anchors)
    let array=Array.from(anchors);
    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        if(element.href.includes("/songs")){
            let folder=element.href.split("/").splice(-2)[0];
            console.log(folder);
            let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`);
            let response=await a.json();
            console.log(response);
            let html = `
                    <div data-folder="${folder}" class="cards font">
                        <div class="play">
                        <img src="img/play.svg" alt="">  
                        </div>
                        <img src="/songs/${folder}/cover.jpg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`
    document.querySelector(".cardcontainer").innerHTML = document.querySelector(".cardcontainer").innerHTML + html;
}


        }
     //adding the cards folder
   Array.from(document.getElementsByClassName("cards")).forEach(e=>{
    console.log(e)
    e.addEventListener("click", async item=>{
        let albmname=item.currentTarget.dataset.folder.replace("-"," ");
        console.log(albmname);
       songs= await fetchsong(`songs/${item.currentTarget.dataset.folder}`)
       playmusic(songs[0]);
       console.log(songs);
       let alb=e.getElementsByTagName("h2")[0].innerHTML;
       document.querySelector(".albmname").innerHTML=`Currently Playing:${alb}`
    })
   })
    }
async function main(params) {
    //get the list of the songs
     await fetchsong("songs/HoneySingh");
    playmusic(songs[0],true);

    //display all the albums on the page
    displayAlbums();

    play.addEventListener("click",()=>{
        if(currentsong.paused){
            currentsong.play();
            play.src="img/pause.svg"
        }
        else{
            currentsong.pause()
            play.src="img/splay.svg"
        }
    })

    //listen for time update event
    currentsong.addEventListener("timeupdate",()=>{
        console.log(currentsong.currentTime,currentsong.duration);
        document.querySelector(".songtime").innerHTML=`${formatTime(currentsong.currentTime)}:${formatTime(currentsong.duration)}`
        document.querySelector(".crcle").style.left=(currentsong.currentTime/currentsong.duration)*100 +"%"

    })
    //add an even listner to seekbar
   document.querySelector(".seekbar").addEventListener("click",e=>{
    let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".crcle").style.left=percent +"%";
        currentsong.currentTime=(currentsong.duration*percent)/100;
   })
   document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".box2-side").style.left=0;
  });
  document.querySelector(".img").addEventListener("click",()=>{
    document.querySelector(".box2-side").style.left=-108 + "%";
  })

  document.getElementById("next").addEventListener("click",()=>{
    let index=(songs.indexOf(currentsong.src.split(`/${curfolder}/`)[1]))
    if(index + 1 < songs.length){
        playmusic(songs[index+1])
    }
  }
   )

   
  document.getElementById("prev").addEventListener("click",()=>{
    let index=(songs.indexOf(currentsong.src.split(`/${curfolder}/`)[1]))
    if(index - 1  >= 0){
        playmusic(songs[index-1 ])
    }
  }
   )
   //adding mute and unmute button and volume range
   document.querySelector(".volume").getElementsByTagName("input")[0].addEventListener("change",e=>{
    console.log(e.target,e.target.value);
    currentsong.volume=e.target.value/100;
    curvol=currentsong.volume=e.target.value/100;
   })
   document.querySelector(".volicon").addEventListener("click",(e)=>{
           if(document.querySelector(".range").value>0){
            document.querySelector(".range").value=0
            currentsong.volume=0;
            vol.src="img/mute.svg"

           }
           else{
            document.querySelector(".range").value=50;
            currentsong.volume=50/100;
              vol.src="img/volume.svg"
           }
   })
   //generating the live name of albums
   

}
main();











































let addCard = (image, h, p) => {
    let html = `
                    <div class="cards font">
                        <div class="play">
                        <img src="play.svg" alt="">  
                        </div>
                        <img src=${image} alt="">
                        <h2>${h}</h2>
                        <p>${p}</p>
                    </div>`
    document.querySelector(".cardcontainer").innerHTML = document.querySelector(".cardcontainer").innerHTML + html;
}
// addCard("https://i.scdn.co/image/ab67706f00000002e2881c83b28f451044b0b8f7", "South Mix", "Devarsh");
