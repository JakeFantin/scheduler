// INTERVIEWER LIST COMPONENT 
import React from 'react';
import PropTypes from 'prop-types';
import InterviewerListItem from 'components/InterviewerListItem';
import 'components/InterviewerList.scss';

// PROP REQUIREMENTS
InterviewerList.propTypes = {
  interviewer: PropTypes.number,
  setInterviewer: PropTypes.func.isRequired
};

export default function InterviewerList(props) {

  // CREATES THE INTERVIEWER LIST ITEMS BASED ON THE DAYS' AVAILABLE INTERVIEWERS
  const interviewers = props.interviewers.map(interviewer => {
    return (
      <InterviewerListItem
        key={interviewer.id}
        name={interviewer.name} 
        avatar={interviewer.avatar} 
        selected={interviewer.id === props.interviewer}
        setInterviewer={(event) => props.setInterviewer(interviewer.id)}
      />
    );
  });

  return <section className="interviewers">
  <h4 className="interviewers__header text--light">Interviewer</h4>
  <ul className="interviewers__list">{interviewers}</ul>
</section>;
}