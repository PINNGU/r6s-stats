document.getElementById('getStatsBtn').addEventListener('click', getEverything);

function getEverything()
{
    document.getElementById('stats').innerHTML =
    `
    <p>Loading Player..</p>

    `
    getPlayer()
    getMates()
}



async function getPlayer() {
    const playerName = document.getElementById('playerName').value;
    if (!playerName) {
        alert("Please enter a player name!");
        return;
    }

    const response = await fetch(`/api/stats?name=${playerName}`);
    const data = await response.json();
    if (data.error) {
        document.getElementById('stats').innerHTML = `
        <p>Not Found</p>`;
        alert(data.error);
    } else {
        document.getElementById('stats').innerHTML = `
            <h2>Stats for ${playerName}</h2>
            <p>Rank: ${data.rank}</p>
            <p>KDA: ${data.kd} </p>
            <img src = ${data.rank_img} >

        `;
    }
}

async function getMates(){
    const playerName = document.getElementById('playerName').value;
    if(!playerName){
        alert("Please enter a player name!");
        return;
    }
}
