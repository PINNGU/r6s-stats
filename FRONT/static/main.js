let isSearching = false;
let lastSearchQuery = "";
let matchesLoaded = false;

const ui = {
  player_name: document.getElementById('playerName'),  
  stats_rank: document.getElementById('stats_rank'),
  stats_kd: document.getElementById('stats_kd'),
  stats_wr: document.getElementById('stats_wr'),
  stats_kills: document.getElementById('stats_kills'),
  stats_match: document.getElementById('stats_match'),
  stats_ops: document.getElementById('stats_ops'),
  stats_mate1: document.getElementById('stats_mate1'),
  stats_mate2: document.getElementById('stats_mate2'),
  stats_mate3: document.getElementById('stats_mate3'),
  stats_mate4: document.getElementById('stats_mate4'),
  mates_title: document.getElementById('mates_title'),
  matches: document.getElementById('matches'),
  matches_title: document.getElementById('matches_title'),
  stats_k: document.getElementById('stats_k'),
  stats_k2: document.getElementById('stats_k2'),
  loading1: document.getElementById('loading1'),
  loading2: document.getElementById('loading2'),
  loading3: document.getElementById('loading3'),
  loading4: document.getElementById('loading4')
};

document.getElementById('getStatsBtn').addEventListener('click', search);

window.addEventListener('beforeunload', function() {
    //history.replaceState(null, '', window.location.pathname);
});

function validateName(name){
  const regex = /^[a-zA-Z0-9_.\-]+$/;
  return regex.test(name) && name.length > 0 && name.length <= 30;
}

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const playerName = params.get('player');

    if (playerName) {
        ui.player_name.value = playerName
        getEverything(playerName);

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


function showAlert(message, type = 'info', duration = 3000) {
    const alertBox = document.getElementById('custom-alert');
    const alertMsg = document.getElementById('alert-message');
    const title = document.getElementById('site-title');
    const title2 = document.getElementById('site-title2');


    title.classList.add('hidden');
    title2.classList.add('hidden');

    alertMsg.textContent = message;
    alertBox.className = `alert ${type} show`;

    setTimeout(() => {
        alertBox.classList.remove('show');
        title.classList.add('shown');

        setTimeout(() => {
            alertBox.classList.add('hidden');
            title.classList.remove('hidden');
            title2.classList.remove('hidden');

        }, 800);
    }, duration);
}

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
                    showAlert('Copied screenshot to clipboard.', "success");
                }).catch(err => {
                    showAlert('Failed to copy screenshot.', "error");
                });
            });
        });
    });
});

function copyCurrentURL() {
    const url = window.location.href;
    navigator.clipboard.writeText(url)
        .then(() => {
            showAlert("URL copied.", "success");
        })
        .catch(err => {
            showAlert("Failed to copy URL.", "error");
        });
}

function getEverything(playerName) {

    resetEverything()

    const newUrl = `?player=${encodeURIComponent(playerName)}`;
    window.history.pushState({}, '', newUrl);

    ui.loading1.innerHTML =
        `
    <img src ="static/pics/loading3.gif" alt = "Loading..." class="loading"/>

    `
    getOperators(playerName)
    getPlayer(playerName)
    getMatches(playerName)
    getMates(playerName)



}



async function getMatches(playerName) {
    const response = await fetch(`/api/matches?name=${playerName}`);
    const data = await response.json();
    if (data.error) {} else if (data.check) {
        ui.loading3.innerHTML = ``;

        ui.matches_title.innerHTML =
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


            html += `<span class="${className}" title="className">${match} <small class="${className}">${mmr}</small></span> `;
        }

        ui.matches.innerHTML = html;
        
        if (ui.mates_title.innerHTML == ``) {
            ui.loading4.innerHTML =
                `
                    <img src ="static/pics/loading3.gif" alt = "Loading..." class="loading"/>
                
                    `
        }


    }


}

/*
async function getVids() {


    const response = await fetch(`/api/vids`);
    const data = await response.json()

    if (data.error) {

    } else {

        document.getElementById('vid1').innerHTML = `
        <a href="https://www.youtube.com/watch?v=${data.vids[0]}" target="_blank">
            <img src="https://img.youtube.com/vi/${data.vids[0]}/hqdefault.jpg" alt="" width="200">
          </a>
        `
        document.getElementById('vid2').innerHTML = `
        <a href="https://www.youtube.com/watch?v=${data.vids[1]}" target="_blank">
            <img src="https://img.youtube.com/vi/${data.vids[1]}/hqdefault.jpg" alt="" width="200">
          </a>
        `
        document.getElementById('vid3').innerHTML = `
        <a href="https://www.youtube.com/watch?v=${data.vids[2]}" target="_blank">
            <img src="https://img.youtube.com/vi/${data.vids[2]}/hqdefault.jpg" alt="" width="200">
          </a>
        `
        document.getElementById('vid4').innerHTML = `
        <a href="https://www.youtube.com/watch?v=${data.vids[3]}" target="_blank">
            <img src="https://img.youtube.com/vi/${data.vids[3]}/hqdefault.jpg" alt="" width="200">
          </a>
        `

    }


}
*/


function search() {
    const playerName = ui.player_name.value;
    if (!playerName) {
        showAlert("Please enter a player name!", "error");
        return;
    }

    if (isSearching && playerName === lastSearchQuery) {
        return;
    }

    if(validateName(playerName)){
        isSearching = true;
        lastSearchQuery = playerName;

        getEverything(playerName)
    }
    else{
        showAlert("Bad input.","error");
    }


}

function goToMate(playerName) {
    getEverything(playerName)
    ui.player_name.value = playerName
}

function resetEverything() {
    for (let key in ui) {
        if (ui[key]) ui[key].innerHTML = '';
    }

}

async function getOperators(playerName) {
    const response = await fetch(`/api/ops?name=${playerName}`);
    const data = await response.json();
    if (data.error) {

    } else if (data.check) {
        ui.loading2.innerHTML = ``;
        const container = ui.stats_ops;
        container.innerHTML = ''; 

        const images = [
        { src: data.atkimg[0], title: data.atk1 },
        { src: data.atkimg[1], title: data.atk2 },
        { src: data.atkimg[2], title: data.atk3 },
        { src: data.defimg[0], title: data.def1 },
        { src: data.defimg[1], title: data.def2 },
        { src: data.defimg[2], title: data.def3 }
        ];

        images.forEach((imgData, index) => {
        setTimeout(() => {
            const img = document.createElement('img');
            img.src = imgData.src;
            img.title = imgData.title;
            img.style.opacity = 0;
            img.style.transition = 'opacity 2s ease';

            container.appendChild(img);

           
            requestAnimationFrame(() => {
            img.style.opacity = 1;
            });
        }, index * 400); 
        });

        if (ui.matches.innerHTML == ``) {
            ui.loading3.innerHTML =
                `
                <img src ="static/pics/loading3.gif" alt = "Loading..." class="loading"/>
            
                `
        }

    }
}


async function getPlayer(playerName) {



    const response = await fetch(`/api/stats?name=${playerName}`);
    const data = await response.json();
    if (data.error) {
        ui.loading1.innerHTML = `
        <p>Player isn't active or doesn't exist...</p>`;
        //alert(data.error);
    } else if (data.check) {
        ui.loading1.innerHTML = `

            `;
        ui.stats_rank.innerHTML = `
            <b class="${data.rankcolor}">${data.rank} </b>
            <img src="${data.rank_img}" >
            
        `;
        ui.stats_kd.innerHTML = `
                <p>KDA: <b> ${data.kd} </b> </p>
        `;
        ui.stats_wr.innerHTML = `
                <p> WR: <b>${data.win}</b> </p>
    
        `;
        ui.stats_k.innerHTML = `
        <p>MMR: <b> ${data.mmr} </b> </p>
        `;
        ui.stats_k2.innerHTML = `
                <p> Playtime: <b>${data.playtime}</b> </p>

        `;
        ui.stats_kills.innerHTML = `
        <div> Kills/Game: <b>${data.kills} </b></div>
        `;
        ui.stats_match.innerHTML = `
        <div> Matches: <b>${data.matches}</b> </div>

        `;
        if (ui.stats_ops.innerHTML == ``) {
            ui.loading2.innerHTML =
                `
            <img src ="static/pics/loading3.gif" alt = "Loading..." class="loading"/>
        
            `
        }


    } else {
        ui.loading1.innerHTML = `
        <p>Player isn't active or doesn't exist....</p>`;
    }

    //getVids()
}

async function getMates(playerName) {

    const response = await fetch(`/api/mates?name=${playerName}`);
    const data = await response.json()

    if (data.error) {
        ui.loading1.innerHTML = `
        <p>Player isn't active or doesn't exist....</p>`;
        alert(data.error);
    } else if (data.mate1["Win"] == null) {

    } else {
        ui.loading4.innerHTML= ``;
        ui.mates_title.innerHTML = `
            <h2>stack</h2>
        `;
        ui.stats_mate1.innerHTML = `
            <a href="#" onclick="goToMate('${data.mate1["Name"]}')" style="color: inherit; text-decoration: none;" >${data.mate1["Name"]}</a>
            <p class="${data.mate1["RankColor"]}"><b> ${data.mate1["Rank"]} </b> </p>
            <p> ${data.mate1["Win"]}</p>
                       <div> <p>${data.mate1["Encounters"]} </p> <img style="width:1.5rem; height:1.35rem; padding-bottom:0.5rem; padding-left:0.5rem;" src="static/pics/enc.svg" title="Games together"> </div>

        `;

        ui.stats_mate2.innerHTML = `
            <a href="#" onclick="goToMate('${data.mate2["Name"]}')" style="color: inherit; text-decoration: none;" >${data.mate2["Name"]}</a>
            <p class="${data.mate2["RankColor"]}"><b> ${data.mate2["Rank"]}</b> </p>
            <p> ${data.mate2["Win"]}</p>
                       <div> <p>${data.mate2["Encounters"]} </p> <img style="width:1.5rem; height:1.35rem; padding-bottom:0.5rem; padding-left:0.5rem;" src="static/pics/enc.svg" title="Games together"> </div>


        `;

        ui.stats_mate3.innerHTML = `
            <a href="#" onclick="goToMate('${data.mate3["Name"]}')" style="color: inherit; text-decoration: none;" >${data.mate3["Name"]}</a>
            <p class="${data.mate3["RankColor"]}"><b> ${data.mate3["Rank"]}</b> </p>
            <p> ${data.mate3["Win"]}</p>
                       <div> <p>${data.mate3["Encounters"]} </p> <img style="width:1.5rem; height:1.35rem; padding-bottom:0.5rem; padding-left:0.5rem;" src="static/pics/enc.svg" title="Games together"> </div>

         `;

        ui.stats_mate4.innerHTML = `
            <a href="#" onclick="goToMate('${data.mate4["Name"]}')" style="color: inherit; text-decoration: none;" >${data.mate4["Name"]}</a>
            <p class="${data.mate4["RankColor"]}"><b> ${data.mate4["Rank"]}</b> </p>
            <p> ${data.mate4["Win"]}</p>
            <div> <p>${data.mate4["Encounters"]} </p> <img style="width:1.5rem; height:1.35rem; padding-bottom:0.5rem; padding-left:0.5rem;" src="static/pics/enc.svg" title="Games together"> </div>
   
        `;


    }
}