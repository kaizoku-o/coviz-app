import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Chart from 'react-google-charts';
import { CSSTransitionGroup } from 'react-transition-group';
import awesome_gif from '../gif/awesomeness.gif';

const data = [
  ["Element", "Density", { role: "style" }],
  ["Copper", 8.94, "#b87333"], // RGB value
  ["Silver", 10.49, "silver"], // English color name
  ["Gold", 19.3, "gold"],
  ["Platinum", 21.45, "color: #e5e4e2"] // CSS-style declaration
];

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
	And to follow the number of cases, Johns Hopkins University has done a briliant job in visualizing the numbers for us. That can be found <a href="https://coronavirus.jhu.edu/map.html" target="_blank">here</a>.
	<Chart
          chartType="ColumnChart"
          width="100%"
          height="400px"
          data={props.graphData}
        />
      </div>
    </CSSTransitionGroup>
  );
}

Result.propTypes = {
  quizResult: PropTypes.string.isRequired,
  graphData: PropTypes.Array.isRequired
};

export default Result;
