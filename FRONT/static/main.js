document.getElementById('getStatsBtn').addEventListener('click', getEverything);

function getEverything()
{
 
    resetEverything()
    document.getElementById('stats_title').innerHTML =
    `
    <p>Loading Player..</p>

    `
    getPlayer()
    getMates()
}

function resetEverything()
{
    document.getElementById('stats_rank').innerHTML =``;
    document.getElementById('stats_kd').innerHTML =``;
    document.getElementById('stats_ops').innerHTML =``;
    document.getElementById('stats_mate1').innerHTML =``;
    document.getElementById('stats_mate2').innerHTML =``;
    document.getElementById('stats_mate3').innerHTML =``;
    document.getElementById('stats_mate4').innerHTML =``;


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
        document.getElementById('stats_title').innerHTML = `
        <p>Not Found</p>`;
        alert(data.error);
    } else {
        document.getElementById('stats_title').innerHTML = `

            `;
        document.getElementById('stats_rank').innerHTML = `
            <p>Rank:  ${data.rank} </p>
            <img src = ${data.rank_img} >
            
        `;
        document.getElementById('stats_kd').innerHTML=`
                <p>KDA: ${data.kd} |<t>  </p>
                <p>  WR: ${data.win} </p>
            
        `;
        document.getElementById('stats_ops').innerHTML =`
                <img src=${data.atkimg[0]} title=${data.atk1}>
                <img src=${data.atkimg[1]} title=${data.atk1}>
                <img src=${data.defimg[0]} title=${data.atk1}>
                <img src=${data.defimg[1]} title=${data.atk1}>
                
        `
    }
}

async function getMates(){
    const playerName = document.getElementById('playerName').value;
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
        document.getElementById('stats_mate1').innerHTML = `
            <p> ${data.mate1["Name"]} <br> </p>
            <p> ${data.mate1["Rank"]} <br> </p>
            <p> ${data.mate1["Win"]} WR <br></p><
           
            
        `;

        document.getElementById('stats_mate2').innerHTML = `
            <div><p> ${data.mate2["Name"]} </p></div>
            <div><p> ${data.mate2["Rank"]} </p></div>
            <div><p> ${data.mate2["Win"]} WR </p></div>
        
       
        
        `;

        document.getElementById('stats_mate3').innerHTML = `
            <div><p> ${data.mate3["Name"]} </p></div>
            <div><p> ${data.mate3["Rank"]} </p></div>
            <div><p> ${data.mate3["Win"]} WR </p></div>
        
       
        
         `;

         document.getElementById('stats_mate4').innerHTML = `
            <div><p> ${data.mate4["Name"]} </p></div>
            <div><p> ${data.mate4["Rank"]} </p></div>
            <div><p> ${data.mate4["Win"]} WR </p>
        
         
        `;

    
    }
}
