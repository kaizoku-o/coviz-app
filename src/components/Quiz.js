import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransitionGroup } from 'react-transition-group';
import Question from '../components/Question';
import Info from '../components/Info';
import QuestionCount from '../components/QuestionCount';
import AnswerOption from '../components/AnswerOption';
import AnswerStatus from '../components/AnswerStatus';

function Quiz(props) {
  function renderAnswerOptions(key) {
    return (
      <AnswerOption
        key={key.content}
        answerContent={key.content}
        answerType={key.type}
        answer={props.answer}
        questionId={props.questionId}
        onAnswerSelected={props.onAnswerSelected}
      />
    );
  }

  return (
    <CSSTransitionGroup
      className="container"
      component="div"
      transitionName="fade"
      transitionEnterTimeout={800}
      transitionLeaveTimeout={500}
      transitionAppear
      transitionAppearTimeout={500}
    >
      <div key={props.questionId}>
        <QuestionCount counter={props.questionId} total={props.questionTotal} />
        <Question content={props.question} />
        <ul className="answerOptions">
          {props.answerOptions.map(renderAnswerOptions)}
        </ul>
	{props.showAnsStatus && <AnswerStatus content={props.answerStatus} />}
        {props.showInfo && <Info content={props.info} clickfunc={props.clickfunc} />}
      </div>
    </CSSTransitionGroup>
  );
}

Quiz.propTypes = {
  answer: PropTypes.string.isRequired,
  answerOptions: PropTypes.array.isRequired,
  question: PropTypes.string.isRequired,
  info: PropTypes.string.isRequired,
  clickfunc: PropTypes.func.isRequired,
  questionId: PropTypes.number.isRequired,
  questionTotal: PropTypes.number.isRequired,
  onAnswerSelected: PropTypes.func.isRequired,
  showInfo: PropTypes.bool.isRequired,
  showAnsStatus: PropTypes.bool.isRequired,
  answerStatus: PropTypes.string.isRequired
};

export default Quiz;
