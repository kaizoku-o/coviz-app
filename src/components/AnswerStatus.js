import React from 'react';
import PropTypes from 'prop-types';

function Info(props) {
  return (
      <div className="info">{props.content}
      </div>
  );
}

Info.propTypes = {
  content: PropTypes.string.isRequired,
};

export default Info;
