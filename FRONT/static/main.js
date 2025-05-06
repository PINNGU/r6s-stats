document.getElementById('getStatsBtn').addEventListener('click', search);

window.addEventListener('beforeunload', function () {
    history.replaceState(null, '', window.location.pathname);
});

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const playerName = params.get('player');

    if (playerName) {
        document.getElementById('playerName').value = playerName
        getEverything(playerName);
        history.replaceState(null, '', window.location.pathname);
        document.getElementById('playerName').value = ""
    }

    const images = [
        'static/pics/hereford.jpg',
        'static/pics/villa.jpg',
        'static/pics/house.jpg',
        'static/pics/border.jpg'
    ];
    
    const randomImage = images[Math.floor(Math.random() * images.length)];
    const bodyBefore = document.createElement('style');
    bodyBefore.innerHTML = `
        body::before {
            content: "";
            position: fixed;
            background-color: #1c1c1c;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: url('${randomImage}');
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center;
            opacity: 0.2;
            z-index: -1;
            pointer-events: none;
        }
    `;
    document.head.appendChild(bodyBefore);
});

document.getElementById('infoButton').addEventListener('click', () => {
    let isInfoPage = window.location.pathname.includes('info.html');
    
    if (isInfoPage) {
        window.location.href = 'index.html';
    } else {
        window.location.href = 'info.html';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const screenshotButton = document.getElementById('screenshotButton');

   
    const rankImg = document.querySelector('#stats_rank img');
    if (rankImg && !rankImg.complete) {
        screenshotButton.disabled = true;  

        rankImg.addEventListener('load', () => {
            screenshotButton.disabled = false;
        });
    }

    screenshotButton.addEventListener('click', () => {
        html2canvas(document.body, { useCORS: true }).then(canvas => {

            const cropX = 590;    
            const cropY = 20;   
            const cropWidth = 745; 
            const cropHeight = 850; 

            const croppedCanvas = document.createElement('canvas');
            croppedCanvas.width = cropWidth;
            croppedCanvas.height = cropHeight;

            const ctx = croppedCanvas.getContext('2d');
            ctx.drawImage(canvas, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

            croppedCanvas.toBlob(blob => {
                navigator.clipboard.write([
                    new ClipboardItem({ 'image/png': blob })
                ]).then(() => {
                    alert('Copied screenshot to clipboard.');
                }).catch(err => {
                    console.error('Failed to copy image to clipboard:', err);
                });
            });
        });
    });
});


function getEverything(playerName)
{
 
    resetEverything()
    if (!playerName) {
        alert("Please enter a player name!");
        return;
    }

    const newUrl = `?player=${encodeURIComponent(playerName)}`;
    window.history.pushState({}, '', newUrl);

    document.getElementById('loading').innerHTML =
    `
    <img src ="static/pics/loading3.gif" alt = "Loading..."/>

    `
    getPlayer(playerName)
    getMatches(playerName)
    getMates(playerName)
    
    
}

async function getMatches(playerName){
    const response = await fetch(`/api/matches?name=${playerName}`);
    const data = await response.json();
    if (data.error) {
    } else if(data.check) {
        
        document.getElementById('matches_title').innerHTML = 
        `
            <h1>match history</h1>
        `;

        let html = '';

        for (let i = 0; i < data.matches.length; i++) {
            const match = data.matches[i];
            const mmr = data.matches_mmr[i];

            let className = '';
            if (match === 'W') {    
                className = 'win';
            } else if (match === 'L') {
                className = 'loss';
            } else if (match === 'R') {
                className = 'remake';
            }


            html += `<span class="${className}">${match} <small class="${className}">${mmr}</small></span> `;
        }

        document.getElementById('matches').innerHTML = html;    
        
      
    }

    
    

}

async function getVids(){
   
    
    const response = await fetch(`/api/vids`);
    const data = await response.json()

    if (data.error) {

    } else {
  
        document.getElementById('vid1').innerHTML=`
        <a href="https://www.youtube.com/watch?v=${data.vids[0]}" target="_blank">
            <img src="https://img.youtube.com/vi/${data.vids[0]}/hqdefault.jpg" alt="" width="200">
          </a>
        `
        document.getElementById('vid2').innerHTML=`
        <a href="https://www.youtube.com/watch?v=${data.vids[1]}" target="_blank">
            <img src="https://img.youtube.com/vi/${data.vids[1]}/hqdefault.jpg" alt="" width="200">
          </a>
        `
        document.getElementById('vid3').innerHTML=`
        <a href="https://www.youtube.com/watch?v=${data.vids[2]}" target="_blank">
            <img src="https://img.youtube.com/vi/${data.vids[2]}/hqdefault.jpg" alt="" width="200">
          </a>
        `
        document.getElementById('vid4').innerHTML=`
        <a href="https://www.youtube.com/watch?v=${data.vids[3]}" target="_blank">
            <img src="https://img.youtube.com/vi/${data.vids[3]}/hqdefault.jpg" alt="" width="200">
          </a>
        `
    
    }


}

function search(){
    const playerName = document.getElementById('playerName').value;
    getEverything(playerName)
}

function goToMate(playerName){
    getEverything(playerName)
    document.getElementById('playerName').value = playerName
}

function resetEverything()
{
    document.getElementById('stats_rank').innerHTML =``;
    document.getElementById('stats_kd').innerHTML =``;
    document.getElementById('stats_wr').innerHTML = ``;
    document.getElementById('stats_kills').innerHTML = ``;
    document.getElementById('stats_match').innerHTML = ``;
    document.getElementById('stats_ops').innerHTML =``;
    document.getElementById('stats_mate1').innerHTML =``;
    document.getElementById('stats_mate2').innerHTML =``;
    document.getElementById('stats_mate3').innerHTML =``;
    document.getElementById('stats_mate4').innerHTML =``;
    document.getElementById('mates_title').innerHTML=``;
    document.getElementById('matches').innerHTML=``;
    document.getElementById('matches_title').innerHTML=``;
    document.getElementById('stats_k').innerHTML=``;
    document.getElementById('stats_k2').innerHTML=``;


}


async function getPlayer(playerName) {
    
   

    const response = await fetch(`/api/stats?name=${playerName}`);
    const data = await response.json();
    if (data.error) {
        document.getElementById('loading').innerHTML = `
        <p>Player isn't active or doesn't exist...</p>`;
        //alert(data.error);
    } else if(data.check) {
        document.getElementById('loading').innerHTML = `

            `;
        document.getElementById('stats_rank').innerHTML = `
            <b class="${data.rankcolor}">${data.rank} </b>
            <img src="${data.rank_img}" >
            
        `;
        document.getElementById('stats_kd').innerHTML=`
                <p>KDA: <b> ${data.kd} </b> </p>
        `;
        document.getElementById('stats_wr').innerHTML=`
                <p> WR: <b>${data.win}</b> </p>
    
        `;
        document.getElementById('stats_k').innerHTML=`
        <p>MMR: <b> ${data.mmr} </b> </p>
        `;
        document.getElementById('stats_k2').innerHTML=`
                <p> Playtime: <b>${data.playtime}</b> </p>

        `;
        document.getElementById('stats_kills').innerHTML=`
        <div> Kills/Game: <b>${data.kills} </b></div>
        `;
        document.getElementById('stats_match').innerHTML=`
        <div> Matches: <b>${data.matches}</b> </div>

        `;
        if(data.atk1){
            document.getElementById('stats_ops').innerHTML =`
            <img src=${data.atkimg[0]} title=${data.atk1}>
            <img src=${data.atkimg[1]} title=${data.atk2}>
            <img src=${data.atkimg[2]} title=${data.atk3}>
            <img src=${data.defimg[0]} title=${data.def1}>
            <img src=${data.defimg[1]} title=${data.def2}>
            <img src=${data.defimg[2]} title=${data.def3}>
            
    `
        }
  
    }
    else{
        document.getElementById('loading').innerHTML = `
        <p>Player isn't active or doesn't exist....</p>`;
    }

    //getVids()
}

async function getMates(playerName){
    
    const response = await fetch(`/api/mates?name=${playerName}`);
    const data = await response.json()

    if (data.error) {
        document.getElementById('loading').innerHTML = `
        <p>Player isn't active or doesn't exist....</p>`;
        alert(data.error);
    } else if(data.mate1["Win"] == null){

    } else
    {
        document.getElementById('mates_title').innerHTML=`
            <h2>stack</h2>
        `;
        document.getElementById('stats_mate1').innerHTML = `
            <a href="#" onclick="goToMate('${data.mate1["Name"]}')" style="color: inherit; text-decoration: none;" >${data.mate1["Name"]}</a>
            <p class="${data.mate1["RankColor"]}"><b> ${data.mate1["Rank"]} </b> </p>
            <p> ${data.mate1["Win"]}</p>
    
        `;

        document.getElementById('stats_mate2').innerHTML = `
            <a href="#" onclick="goToMate('${data.mate2["Name"]}')" style="color: inherit; text-decoration: none;" >${data.mate2["Name"]}</a>
            <p class="${data.mate2["RankColor"]}"><b> ${data.mate2["Rank"]}</b> </p>
            <p> ${data.mate2["Win"]}</p>

        `;

        document.getElementById('stats_mate3').innerHTML = `
            <a href="#" onclick="goToMate('${data.mate3["Name"]}')" style="color: inherit; text-decoration: none;" >${data.mate3["Name"]}</a>
            <p class="${data.mate3["RankColor"]}"><b> ${data.mate3["Rank"]}</b> </p>
            <p> ${data.mate3["Win"]}</p>

         `;

         document.getElementById('stats_mate4').innerHTML = `
            <a href="#" onclick="goToMate('${data.mate4["Name"]}')" style="color: inherit; text-decoration: none;" >${data.mate4["Name"]}</a>
            <p class="${data.mate4["RankColor"]}"><b> ${data.mate4["Rank"]}</b> </p>
            <p> ${data.mate4["Win"]}</p>
   
        `;

    
    }
}
