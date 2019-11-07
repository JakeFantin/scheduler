import React from 'react';
import "components/Appointment/styles.scss";
import Header from 'components/Appointment/Header';
import Show from 'components/Appointment/Show';
import Empty from 'components/Appointment/Empty';
import Form from 'components/Appointment/Form';
import Status from 'components/Appointment/Status';
import Confirm from 'components/Appointment/Confirm';
import Error from 'components/Appointment/Error';
import useVisualMode from 'hooks/useVisualMode';

export default function Appointment(props) {
  const EMPTY = 'EMPTY';
  const SHOW = 'SHOW';
  const CREATE = 'CREATE';
  const SAVING = 'SAVING';
  const CONFIRM = 'CONFIRM';
  const DELETING = 'DELETING';
  const EDIT = 'EDIT';
  const ERROR_SAVE = 'ERROR_SAVE';
  const ERROR_DELETE = 'ERROR_DELETE';

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };

    transition(SAVING);
    Promise.resolve(props.bookInterview(props.id, interview))
      .then(() => transition(SHOW))
      .catch(error => transition(ERROR_SAVE, true));
  };

  function confirmDelete() {
    transition(CONFIRM);
  };

  function deleteAppointement() {
    transition(DELETING, true);
    props.cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch(error => transition(ERROR_DELETE, true))
  };

  return <article className='appointment' data-testid='appointment'>
    <Header time={props.time} />
    {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
    {mode === SHOW && (
      <Show
        student={props.interview.student}
        interviewer={props.interview.interviewer}
        onDelete={confirmDelete}
        onEdit={() => transition(EDIT)}
      />
    )}
    {mode === CREATE && <Form
      interviewers={props.interviewers}
      onCancel={() => back()}
      onSave={(name, interviewer) => { save(name, interviewer) }}
    />}
    {mode === EDIT && <Form
      interviewers={props.interviewers}
      name={props.interview.student}
      interviewer={props.interview.interviewer.id}
      onCancel={() => back()}
      onSave={(name, interviewer) => { save(name, interviewer) }}
    />}
    {mode === SAVING && <Status
      message={'Saving'}
    />}
    {mode === CONFIRM && <Confirm
      onCancel={() => { transition(SHOW) }}
      onConfirm={deleteAppointement}
    />}
    {mode === DELETING && <Status
      message={'Deleting'}
    />}
    {mode === ERROR_DELETE && <Error
      onClose={() => back()}
      message={'Could not cancel appointment.'}
    />}
    {mode === ERROR_SAVE && <Error 
      onClose={()=> back()}
      message={'Could not save appointment.'}
    />}
  </article>;
};