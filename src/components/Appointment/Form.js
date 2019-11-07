// FORM COMPONENT FILE
import React, { useState } from 'react';
import 'components/Appointment/styles.scss';

import InterviewerList from 'components/InterviewerList';
import Button from 'components/Button';


export default function Form(props) {

  // NUMBER OF STATES USED FOR THE FOR INPUTS AND THE ERROR MESSAGE
  // IN EDIT, NAME AND INTERVIEWER ALREADY SET, IN CREATE THEY ARE NOT
  const [name, setName] = useState(props.name || '');
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  const [error, setError] = useState('');

  // RESETS INPUTS IF NOT SELECTED
  const reset = function() {
    setName('');
    setInterviewer(null);
  }
  // ON CANCEL FUNCTION THAT CLOSES THE FORM
  const cancel = function() {
    reset();
    props.onCancel();
  }

  // ERROR CHECKING FOR EMPTY INPUT
  function validate() {
    if (name === '') {
      setError("Student name cannot be blank");
      return;
    }
    setError('');
    props.onSave(name, interviewer);
  }

return <main className="appointment__card appointment__card--create">
  <section className="appointment__card-left">
    <form autoComplete="off" onSubmit={event => event.preventDefault()}>
      <input
        className="appointment__create-input text--semi-bold"
        name="name"
        type="text"
        placeholder={"Enter Student Name"}
        value={name}
        onChange={(event) => setName(event.target.value)}
        data-testid="student-name-input"
      />
    </form>
    <section className="appointment__validation">{error}</section>
    <InterviewerList interviewers={props.interviewers} interviewer={interviewer} setInterviewer={setInterviewer} />
  </section>
  <section className="appointment__card-right">
    <section className="appointment__actions">
      <Button danger onClick={cancel}>Cancel</Button>
      <Button confirm onClick={validate}>Save</Button>
    </section>
  </section>
</main>
};