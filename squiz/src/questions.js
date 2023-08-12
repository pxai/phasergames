import axios from 'axios';

export default class Quiz {
    constructor () {
        this.currentIndex = 0;
    }

    async init (difficulties, categories) {
        const difficultiesOption = difficulties ? `&difficulties=${difficulties}`: '';
        const categoriesOption = categories ? `&categories=${categories}`: '';
        const options = `${difficultiesOption}${categoriesOption}`;
        console.log("Options: ", options)
        const response = await axios.get(`https://the-trivia-api.com/api/questions/?${options}`)
        const questionsData = response.data;
        console.log("Questions: ", questionsData)
        this.questions = questionsData.map(question => new Question(question))
    }

    nextQuestion () {
        if (this.currentIndex < this.questions.length) {
            this.currentIndex++;
            return this.questions[this.currentIndex];
        }
    }

    get currentQuestion () {
        return this.questions[this.currentIndex]
    }
}

class Question {
    constructor(data) {
        this.id = data['id'];
        this.category = data['category'];
        this.correctAnswer = data['correctAnswer'];
        this.incorrectAnswers = data['incorrectAnswers'];
        this.question = data['question'];
        this.tags = data['tags'];
        this.difficulty = data['difficulty'];
        this.regions = data['regions'];
        this.answers = [];
        this.init();
    }
    
    init() {
        this.answers = [...this.incorrectAnswers, this.correctAnswer].sort(() => (Math.random() > .5) ? 1 : -1);
        console.log("This ansswers_ ", this.answers)
        this.correctIndex = this.answers.indexOf(this.correctAnswer) + 1;
    }
}