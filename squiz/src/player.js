class Player {
    constructor (scene, name) {
        this.scene = scene;
        this.name = name;
        this.lastMessage = null;
        this.answers = []
    }

    update () {

    }

    answerQuestion(number, time, isCorrect) {
        this.answers.push({number, time, points: isCorrect ? 0 : 1})
    }

    get points () {
        this.answers.reduce((answer, acc) => answer.points + acc, 0);
    }

    get time () {
        this.answers.reduce((answer, acc) =>  answer.time + acc, 0);
    }

    notAnswered(number) {
        return !this.answers.find(answer => answer.number === number)
    }

}

export default Player;
