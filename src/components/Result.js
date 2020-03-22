import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransitionGroup } from 'react-transition-group';
import awesome_gif from '../gif/awesomeness.gif';

function Result(props) {
  return (
    <CSSTransitionGroup
      className="container result"
      component="div"
      transitionName="fade"
      transitionEnterTimeout={800}
      transitionLeaveTimeout={500}
      transitionAppear
      transitionAppearTimeout={500}
    >
      <div>
        You answered <strong>{props.quizResult}</strong> questions correctly! :)
        <br /> <br /> 
        <img src={awesome_gif} className="Awesome_gif" alt="awesome_gif" />
        <br /> <br />
	In these trying times, please do not spread misinformation, please don't be racist and please don't be an asshole in general. <br />
	Follow all the guidelines provided by WHO <a href="https://www.who.int/emergencies/diseases/novel-coronavirus-2019" target="_blank">here</a>. <br />
	And to follow the number of cases, Johns Hopkins University has done a briliant job in visualizing the numbers for us. That can be found <a href="https://coronavirus.jhu.edu/map.html" target="_blank">here.</a>
      </div>
    </CSSTransitionGroup>
  );
}

Result.propTypes = {
  quizResult: PropTypes.string.isRequired
};

export default Result;
