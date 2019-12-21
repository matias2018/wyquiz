const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('card-text'));
const questionCounterText = document.getElementById('progressText');
const progressInnerBar = document.getElementById('progressInnerBar');
const loader = document.getElementById('loader');
const quiz = document.getElementById('quiz');
const scoreText = document.getElementById('score');

//console.log(choices);

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];

fetch("https://opentdb.com/api.php?amount=10&category=18&type=multiple")
 .then(res => {
  console.log(res);
  return res.json();
 }).then(loadedQuestions => {
   questions = loadedQuestions.results.map( loadedQuestion =>{
     const formattedQuestion = {
       question: loadedQuestion.question
     };

     const answerChoices = [ ...loadedQuestion.incorrect_answers];
     formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
     answerChoices.splice(formattedQuestion.answer -1, 0, loadedQuestion.correct_answer);

     answerChoices.forEach((choice, index) => {
       formattedQuestion["choice" + (index + 1)] = choice;
     })
     return formattedQuestion;
   })
   /* questions = loadedQuestions; */
   
   startGame();
 })
 .catch(err => {
   console.error('Failed to load questions ' + err);
 })

const CORRECT_BONUS = 10;
var MAX_QUESTIONS = 0;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [ ... questions]; 
    MAX_QUESTIONS = availableQuestions.length;
    getNewQuestion();
    quiz.classList.remove('hidden');
    loader.classList.add('hidden');
};

getNewQuestion = () => {

    if(availableQuestions.length == 0 || questionCounter >= MAX_QUESTIONS){
      localStorage.setItem('mostRecentScore', score);
        // goto end quiz
        return window.location.assign('/gameover.html');
    }

    questionCounter++;
    questionCounterText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    progressInnerBar.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerHTML = currentQuestion.question;

    choices.forEach( choice => {
        const number = choice.dataset['card'];
        choice.innerHTML = currentQuestion['choice' + number];
    } );
    availableQuestions.splice(questionIndex, 1);
    acceptingAnswers = true;
};

choices.forEach(choice => {
    choice.addEventListener('click', e => {
        //console.log(e.target);
        if(!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['card'];
        selectedChoice.classList.remove('choice');
        const remainingChoices = Array.from(document.getElementsByClassName('choice'));
        remainingChoices.forEach( choice =>{
          if(choice.dataset['card'] == currentQuestion.answer){
            choice.parentElement.classList.add('shouldBe');
          }
        })
        

        const classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';
        if(classToApply === 'correct'){
            incrementScore(CORRECT_BONUS);
        } 
        console.log(classToApply);
        
        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout( () => {
            selectedChoice.parentElement.classList.remove(classToApply);
            selectedChoice.classList.add('choice');
            remainingChoices.forEach( choice =>{
              if(choice.parentElement.classList.contains('shouldBe')){
                choice.parentElement.classList.remove('shouldBe');
              }
            })
            
            getNewQuestion();
        }, 2000);
    });
})

incrementScore = num => {
    score += num;
    scoreText.innerText = score;
}
