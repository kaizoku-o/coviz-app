import React, { Component } from 'react';
import quizQuestions from './api/quizQuestions';
import Quiz from './components/Quiz';
import Result from './components/Result';
import logo from './png/covid.png';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      counter: 0,
      questionId: 1,
      question: '',
      answerOptions: [],
      answer: '',
      answersCount: {},
      result: '',
      info:'',
      correctAnswer:'',
      showInfo:false,
      result_dict: [],
      showAnsStatus:false,
      answerStatus:''
    };

    this.handleAnswerSelected = this.handleAnswerSelected.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    const shuffledAnswerOptions = quizQuestions.map(question =>
      this.shuffleArray(question.answers)
    );
    this.setState({
      question: quizQuestions[0].question,
      answerOptions: shuffledAnswerOptions[0],
      info: quizQuestions[0].info,
      correctAnswer: quizQuestions[0].correctAnswer,
      showInfo: false,
      showAnsStatus: false,
      answerStatus: ''
    });
  }

  shuffleArray(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  handleAnswerSelected(event) {
    this.setUserAnswer(event.currentTarget.value);

    this.state.showAnsStatus = true
    if (event.currentTarget.value === this.state.correctAnswer)
    {
        this.state.result_dict.push(1)
	this.state.answerStatus = "Correct :)"
    }
    else
    {
        this.state.result_dict.push(0)
	this.state.answerStatus = "Wrong :("
    } 
  }

  handleClick() {
    if (this.state.questionId < quizQuestions.length) 
    {
        setTimeout(() => this.setNextQuestion(), 300);
    } 
    else 
    {
       setTimeout(() => this.setResults(this.getResults()), 300);
    }
  }

  setUserAnswer(answer) {
    this.setState((state, props) => ({
      answersCount: {
        ...state.answersCount,
        [answer]: (state.answersCount[answer] || 0) + 1
      },
      answer: answer,
      showInfo:true
    }));
  }

  setNextQuestion() {
    const counter = this.state.counter + 1;
    const questionId = this.state.questionId + 1;

    this.setState({
      counter: counter,
      questionId: questionId,
      question: quizQuestions[counter].question,
      info: quizQuestions[counter].info,
      answerOptions: quizQuestions[counter].answers,
      answer: '',
      correctAnswer: quizQuestions[counter].correctAnswer,
      showAnsStatus:false,
      answerStatus:'',
      showInfo: false
    });
  }

  getResults() {
    const answersCount = this.state.answersCount;
    const answersCountKeys = Object.keys(answersCount);
    const answersCountValues = answersCountKeys.map(key => answersCount[key]);
    const maxAnswerCount = Math.max.apply(null, answersCountValues);

    return answersCountKeys.filter(key => answersCount[key] === maxAnswerCount);
  }

  setResults(result) {
    var res_counter = 0
    var index = 0;
    for (index = 0; index < this.state.result_dict.length; index++)
    {
        if (this.state.result_dict[index] === 1)
	{
	    res_counter++;
	}
    }

    this.setState({ result: res_counter.toString() });
  }

  renderQuiz() {
    return (
      <Quiz
        answer={this.state.answer}
        answerOptions={this.state.answerOptions}
        questionId={this.state.questionId}
        question={this.state.question}
        questionTotal={quizQuestions.length}
        onAnswerSelected={this.handleAnswerSelected}
	info={this.state.info}
	clickfunc={this.handleClick}
	correctAnswer={this.state.correctAnswer}
	showInfo={this.state.showInfo}
	showAnsStatus={this.state.showAnsStatus}
	answerStatus={this.state.answerStatus}
      />
    );
  }

  renderResult() {
    return <Result quizResult={this.state.result} />;
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>The COVID-19 Woke Quiz</h2>
        </div>
        {this.state.result ? this.renderResult() : this.renderQuiz()}
      </div>
    );
  }
}

export default App;
