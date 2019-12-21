const highScoresList = document.getElementById('scoreBoard');

const highScores = JSON.parse(localStorage.getItem('highScores')) || [];

highScoresList.innerHTML = highScores.map( score => {
    return `<li class="high-score mb-1"><span>${score.name}</span>  <span>${score.score}</span></li>`;
}).join("");

console.log(highScores);