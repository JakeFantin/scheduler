import { useReducer, useEffect } from 'react';
import axios from 'axios';

// CONSTANTS FOR THE REDUCER CASES
const SET_DAY = 'SET_DAY';
const SET_APPLICATION_DATA = 'SET_APPLICATION_DATA';
const SET_INTERVIEW = "SET_INTERVIEW";

// REDUCER FUNCTION THAT HANDLES THE APPLICATION STATE CHANGES
function reducer(state, action) {
  switch (action.type) {
    // SET STATE WITH NEW FOCUS DAY FROM THE NAV BAR
    case SET_DAY:
      return { ...state, day: action.value }
    // SETS THE STATE FROM THE SERVER DATA 
    case SET_APPLICATION_DATA:
      return { ...state, days: action.value[0].data, appointments: action.value[1].data, interviewers: action.value[2].data }
    // MAKE OR DELETE AN INTERVIEW
    case SET_INTERVIEW:
      return { ...action.value }
    default:
      throw new Error(
        `Treid to reduce with unsupported actui type: ${action.type}`
      );
  }
}

// EXPORT FUNCTION THAT GIVES THE APPLICATION ACCESS TO THE STATE
export default function useApplicationData() {

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
    // IF STATEMENT DETERMINES THE DAY BY THE APPOINTMENT ID
    let dayId = 0;
    if (id < 6) {
      dayId = 0;
    } else if (id < 11) {
      dayId = 1;
    } else if (id < 16) {
      dayId = 2;
    } else if (id < 21) {
      dayId = 3;
    } else if (id < 26) {
      dayId = 4;
    }

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

    // ADJUSTS NUMBER OF SPOTS IN NEW STATE USING THE DAY'S ID
    newState.days[dayId].spots--;
    return Promise.resolve(axios.put(`/api/appointments/${id}`, { interview }))
      .then(() => dispatch({ type: SET_INTERVIEW, value: newState}));
  };

  // CANCEL AN APPOINTMENT ON SERVER AND UPDATE THE STATE
  function cancelInterview(id) {
    // IF STATEMENT DETERMINES THE DAY BY THE APPOINTMENT ID
    let dayId = 0;
    if (id < 6) {
      dayId = 0;
    } else if (id < 11) {
      dayId = 1;
    } else if (id < 16) {
      dayId = 2;
    } else if (id < 21) {
      dayId = 3;
    } else if (id < 26) {
      dayId = 4;
    }

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

    // ADJUSTS NUMBER OF SPOTS IN NEW STATE USING THE DAY'S ID
    newState.days[dayId].spots++;
    return Promise.resolve(axios.delete(`api/appointments/${id}`))
      .then(() => dispatch({ type: SET_INTERVIEW, value: newState }));
  };

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
}