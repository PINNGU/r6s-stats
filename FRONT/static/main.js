document.getElementById('getStatsBtn').addEventListener('click', search);


function getEverything(playerName)
{
 
    resetEverything()
    document.getElementById('stats_title').innerHTML =
    `
    <p>Loading Player..</p>

    `
    getPlayer(playerName)
    getMates(playerName)
}

async function getVids(){
    if (!playerName) {
        alert("Please enter a player name!");
        return;
    }
    
    const response = await fetch(`/api/vids`);
    const data = await response.json()

    if (data.error) {
        document.getElementById('stats_title').innerHTML = `
        <p>Not Found</p>`;
        alert(data.error);
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


}


async function getPlayer(playerName) {
    
    if (!playerName) {
        alert("Please enter a player name!");
        return;
    }

    const response = await fetch(`/api/stats?name=${playerName}`);
    const data = await response.json();
    if (data.error) {
        document.getElementById('stats_title').innerHTML = `
        <p>Not Found</p>`;
        alert(data.error);
    } else {
        document.getElementById('stats_title').innerHTML = `

            `;
        document.getElementById('stats_rank').innerHTML = `
            <b class="${data.rankcolor}">${data.rank} </b>
            <img src = ${data.rank_img} >
            
        `;
        document.getElementById('stats_kd').innerHTML=`
                <p>KDA: <b> ${data.kd} </b> </p>
        `;
        document.getElementById('stats_wr').innerHTML=`
                <p> WR: <b>${data.win}</b> </p>
    
        `;
        document.getElementById('stats_kills').innerHTML=`
        <div> Kills/Game: <b>${data.kills} </b></div>
        `;
        document.getElementById('stats_match').innerHTML=`
        <div> Matches: <b>${data.matches}</b> </div>

        `;
        document.getElementById('stats_ops').innerHTML =`
                <img src=${data.atkimg[0]} title=${data.atk1}>
                <img src=${data.atkimg[1]} title=${data.atk2}>
                <img src=${data.atkimg[2]} title=${data.atk3}>
                <img src=${data.defimg[0]} title=${data.def1}>
                <img src=${data.defimg[1]} title=${data.def2}>
                <img src=${data.defimg[2]} title=${data.def3}>
                
        `
    }

    getVids()
}

async function getMates(playerName){
    if(!playerName){
        alert("Please enter a player name!");
        return;
    }

    const response = await fetch(`/api/mates?name=${playerName}`);
    const data = await response.json()

    if (data.error) {
        document.getElementById('stats_title').innerHTML = `
        <p>Not Found</p>`;
        alert(data.error);
    } else {
        document.getElementById('mates_title').innerHTML=`
            <h1>stack</h1>
        `;
        document.getElementById('stats_mate1').innerHTML = `
            <a href="#" onclick="goToMate('${data.mate1["Name"]}')" style="color: inherit; text-decoration: none;" >${data.mate1["Name"]}</a>
            <p class="${data.mate1["RankColor"]}"><b> ${data.mate1["Rank"]} </b> </p>
            <p> ${data.mate1["Win"]} WR </p>
    
        `;

        document.getElementById('stats_mate2').innerHTML = `
            <a href="#" onclick="goToMate('${data.mate2["Name"]}')" style="color: inherit; text-decoration: none;" >${data.mate2["Name"]}</a>
            <p class="${data.mate2["RankColor"]}"><b> ${data.mate2["Rank"]}</b> </p>
            <p> ${data.mate2["Win"]} WR </p>

        `;

        document.getElementById('stats_mate3').innerHTML = `
            <a href="#" onclick="goToMate('${data.mate3["Name"]}')" style="color: inherit; text-decoration: none;" >${data.mate3["Name"]}</a>
            <p class="${data.mate3["RankColor"]}"><b> ${data.mate3["Rank"]}</b> </p>
            <p> ${data.mate3["Win"]} WR </p>

         `;

         document.getElementById('stats_mate4').innerHTML = `
            <a href="#" onclick="goToMate('${data.mate4["Name"]}')" style="color: inherit; text-decoration: none;" >${data.mate4["Name"]}</a>
            <p class="${data.mate4["RankColor"]}"><b> ${data.mate4["Rank"]}</b> </p>
            <p> ${data.mate4["Win"]} WR </p>
   
        `;

    
    }
}
