import React from 'react';
import PropTypes from 'prop-types';

function Info(props) {
  return (
      <div className="info">
      {props.content}
      <br /><br /> 
      <button 
      onClick={props.clickfunc}> Next </button> 
      </div>
  );
}

Info.propTypes = {
  content: PropTypes.string.isRequired,
  clickfunc: PropTypes.func.isRequired
};

export default Info;
