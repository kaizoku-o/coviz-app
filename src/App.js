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
      question_stats_dict: {},
      unique_ip: {},
      graph_data: [],
      showAnsStatus:false,
      answerStatus:'',
      currentIP: ''
    };

    this.handleAnswerSelected = this.handleAnswerSelected.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.updateCounts = this.updateCounts.bind(this);
    this.getIP = this.getIP.bind(this);
  }
  async  getIP() {
    await fetch("https://api.ipify.org?format=json").then(response => { return response.json();}, "jsonp")
      .then(res => {console.log(res.ip); this.state.currentIP = res.ip})
      .catch(err => console.log(err))
  }



  componentDidMount() {
    const shuffledAnswerOptions = quizQuestions.map(question =>
      this.shuffleArray(question.answers)
    );


    const request = require('request')

    request.post('http://18.190.121.208:9580/api', {
          json: {
              command: 'get'
          }
    }, (error, res, body) => {
        if (error) {
          console.error(error)
          return
        }
        console.log(`statusCode: ${res.statusCode}`)
	body = body.replace(/'/g, '"') 
	var bodyJSON = JSON.parse(body.slice(1, -1))
	this.setState({
	    question_stats_dict: bodyJSON["stats"],
	    unique_ip: bodyJSON["ip"]
	})
	this.getIP()
    })

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

  updateCounts(questionNo, answer) {

    if (this.state.unique_ip.includes(String(this.state.currentIP))) {
    	console.log("returning")
        return;
    }
    const request = require('request')

    request.post('http://18.190.121.208:9580/api', {
          json: {
              command: 'insert',
	      values: this.state.currentIP
          }
    }, (error, res, body) => {
        if (error) {
          console.error(error)
          return
        }
    })

    console.log("Question no is " + questionNo.toString())
    console.log("Answer is "  + answer.toString())

    // write new count to db
    if (questionNo in this.state.question_stats_dict) {
      console.log("quest exists")
      // update correct count
      this.state.question_stats_dict[questionNo] = 
         [this.state.question_stats_dict[questionNo][0]++,
	  this.state.question_stats_dict[questionNo][1] += answer]
    
      request.post('http://18.190.121.208:9580/api', {
          json: {
              command: 'update',
	      values: String(questionNo) + " " +
	      	String(this.state.question_stats_dict[questionNo][0])
		+ " " +
		String(this.state.question_stats_dict[questionNo][1])
          }
      }, (error, res, body) => {
         if (error) {
            console.error(error)
            return
         }
      })

    }
    else {
        this.state.question_stats_dict[questionNo] = [1, answer];
        request.post('http://18.190.121.208:9580/api', {
           json: {
               command: 'insert',
	       values: String(questionNo) + " " + 
	       	String(1) + " " + String(answer)  
           }
        }, (error, res, body) => {
          if (error) {
            console.error(error)
            return
          }
       })
    }
  }

  handleAnswerSelected(event) {
    this.setUserAnswer(event.currentTarget.value);

    this.state.showAnsStatus = true
    if (event.currentTarget.value === this.state.correctAnswer)
    {
        this.state.result_dict.push(1)
	this.state.answerStatus = "Correct :)"
	this.updateCounts(this.state.questionId, 1)
    }
    else
    {
        this.state.result_dict.push(0)
	this.state.answerStatus = "Wrong :("
	this.updateCounts(this.state.questionId, 0)
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

  random_rgba() { 
    const randomColor = Math.floor(Math.random()*16777215).toString(16);
    return "#" + randomColor;
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

    this.state.graph_data.push(
	["Question", "% Correct", { role: "style" }]
    );
    console.log(this.state.question_stats_dict);
    console.log(this.state.question_stats_dict.length)

    for (var i = 1; i <= quizQuestions.length; i++)
    {
    	var percent_right = (this.state.question_stats_dict[String(i)][0] / 
		this.state.question_stats_dict[String(i)][1]) * 100;
	var color = this.random_rgba();
	console.log([i.toString(), percent_right, color]);
    	this.state.graph_data.push([i.toString(), percent_right, color]);	
    }
    console.log(this.state.graph_data)
    
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
    return (
      <Result 
        quizResult={this.state.result}
        graphData={this.state.graph_data} 
      />
    );
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
