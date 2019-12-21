const username = document.getElementById('username');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const finalScore = document.getElementById('finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore');

const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

const MAX_HIGH_SCORES = 11;
console.log(highScores);

finalScore.innerText = mostRecentScore;

username.addEventListener('keyup', () => {
    console.log(username.value);
    saveScoreBtn.disabled = !username.value;
})

saveScore = e => {
    e.preventDefault();
    console.log('Saved');
    
    const score = {
        score: mostRecentScore,
        name: username.value
    }

    highScores.push(score);

    highScores.sort( (a,b) => {
        return b.score - a.score;
    })
    highScores.splice(11);

    localStorage.setItem('highScores', JSON.stringify(highScores));
    window.location.assign('/');
    //console.log(highScores);
}