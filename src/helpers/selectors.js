// SELECTOR FUNCTION PATTERN FILE

// RETURNS AN ARRAY OF APPOINTMENTS FOR A SPECIFIED DAY GIVEN THE STATE
export function getAppointmentsForDay(state, day) {
  let currentAppointments = [];
  let currentDay = null;
  if (day) {
    for (let weekDay of state.days) {
      if (weekDay.name === day) {
        currentDay = weekDay;
      }
    }
  }
  if (currentDay) {
    currentAppointments = currentDay.appointments.map(appointment => {
      return state.appointments[appointment];
    });
  }

  return currentAppointments;
}
// RETURNS A SPECIFIED INTERVIEW FILLED IN THE CORRECT INTERVIEW INSTEAD OF A NUMBER
export function getInterview(state, interview) {
  if (interview) {
    return { ...interview, interviewer: state.interviewers[interview.interviewer] };
  } else {
    return null;
  }
}
// RETURNS AN ARRAY OF INTERVIEWS FROM A SPECIFIED DAY GIVEN THE STATE
export function getInterviewersForDay(state, day) {
  let currentInterviewers = [];
  let currentDay = null;
  if (day) {
    for (let weekDay of state.days) {
      if (weekDay.name === day) {
        currentDay = weekDay;
      }
    }
  }
  if (currentDay) {
    currentInterviewers = currentDay.interviewers.map(interviewer => {
      return state.interviewers[interviewer];
    });
  }

  return currentInterviewers;
}