// APPOINTMENT COMPONENT FILE (NAMED INDEX)
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

// APPOINTMENT COMPONENT
export default function Appointment(props) {
  // DIFFERENT MODES FOR MODE SELECTOR
  const EMPTY = 'EMPTY';
  const SHOW = 'SHOW';
  const CREATE = 'CREATE';
  const SAVING = 'SAVING';
  const CONFIRM = 'CONFIRM';
  const DELETING = 'DELETING';
  const EDIT = 'EDIT';
  const ERROR_SAVE = 'ERROR_SAVE';
  const ERROR_DELETE = 'ERROR_DELETE';

  // SELECTOR HOOK
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  // ON SAVE FUNCTION, WHICH SENDS INFO TO THE HOOK THAT HANDLES THE STATE
  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    // PLACEHOLDER MODE WHILE ASYNC FUNCTION IS IN PROGRESS
    transition(SAVING);
    Promise.resolve(props.bookInterview(props.id, interview))
      .then(() => transition(SHOW))
      .catch(error => transition(ERROR_SAVE, true));
  };

  // SIMPLE FUNCTION THAT CHANGES MODE TO CONFIRM
  function confirmDelete() {
    transition(CONFIRM);
  };

  // ON DELETE FUNCTION, THAT SENDS INFORMATION TO THE HOOK THAT HANDLES STATE
  function deleteAppointement() {
    // PLACEHOLDER MODE WHILE ASYNC FUNCTION IS IN PROGRESS
    transition(DELETING, true);
    props.cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch(error => transition(ERROR_DELETE, true))
  };

  // ON RENDER DIFFERENT APPOINTMENT MODE IS RENDERED BASED ON THE SELECTED MODE
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
      onClose={() => back()}
      message={'Could not save appointment.'}
    />}
  </article>;
};