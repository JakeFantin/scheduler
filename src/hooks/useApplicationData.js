import { useReducer, useEffect } from 'react';
import axios from 'axios';
import reducer, { SET_DAY, SET_APPLICATION_DATA, SET_INTERVIEW } from 'reducers/application';

// EXPORT FUNCTION THAT GIVES THE APPLICATION ACCESS TO THE STATE
export default function useApplicationData() {

  // GET REDUCER FUNCTIONS
  const [state, dispatch] = useReducer(reducer, { day: 'Monday', days: [], appointments: {}, interviewers: {} })

  // SET DAY FUNCTION FOR CHOOSING A DAY IN THE NAV BAR
  const setDay = day => dispatch({ type: SET_DAY, value: day });

  // ONE TIME INITIAL FETCH OF INFORMATION FROM THE SERVER
  useEffect(() => {
    Promise.all([
      Promise.resolve(axios.get('/api/days')),
      Promise.resolve(axios.get('/api/appointments')),
      Promise.resolve(axios.get('/api/interviewers')),
    ]).then((all) => {
      dispatch({ type: SET_APPLICATION_DATA, value: all })
    });

  }, []);

  // BOOK AN INTERVIEW ON SERVER AND UPDATE THE STATE
  function bookInterview(id, interview) {
    // CONSTRUCT A NEW STATE, ADDING THE INPUT INFORMATION TO AN APPOINTMENT'S INTERVIEW
    const newState = {
      ...state,
      appointments: {
        ...state.appointments,
        [id]: {
          ...state.appointments[id],
          interview: { ...interview }
        }
      }
    }
    return Promise.resolve(axios.put(`/api/appointments/${id}`, { interview }))
      .then(() => dispatch({ type: SET_INTERVIEW, newState, id }));
  };

  // CANCEL AN APPOINTMENT ON SERVER AND UPDATE THE STATE
  function cancelInterview(id) {
    // CONSTRUCT A NEW STATE, REMOVING ANY INFORMATION FROM AN APPOINTMENT'S INTERVIEW
    const newState = {
      ...state,
      appointments: {
        ...state.appointments,
        [id]: {
          ...state.appointments[id],
          interview: null
        }
      }
    }
    return Promise.resolve(axios.delete(`api/appointments/${id}`))
      .then(() => dispatch({ type: SET_INTERVIEW, newState, id }));
  };

  // RETURN HOOK FUNCTIONS TO COMPONENTS
  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
}