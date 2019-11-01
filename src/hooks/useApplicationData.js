import { useReducer, useEffect } from 'react';
import axios from 'axios';

const SET_DAY = 'SET_DAY';
const SET_APPLICATION_DATA = 'SET_APPLICATION_DATA';
const SET_INTERVIEW = "SET_INTERVIEW";

function reducer(state, action) {
  switch (action.type) {
    case SET_DAY:
      return {...state, day: action.value}
    case SET_APPLICATION_DATA:
      return { ...state, days: action.value[0].data, appointments: action.value[1].data, interviewers: action.value[2].data }
    case SET_INTERVIEW: 
      return { ...action.value.newState}
    default:
      throw new Error(
        `Treid to reduce with unsupported actui type: ${action.type}`
      );
  }
}
export default function useApplicationData() {

  const [state, dispatch] = useReducer(reducer, {day: 'Monday', days: [], appointments: {}, interviewers: {}})

  const setDay = day => dispatch({ type: SET_DAY, value: day });

  useEffect(() => {
    Promise.all([
      Promise.resolve(axios.get('/api/days')),
      Promise.resolve(axios.get('/api/appointments')),
      Promise.resolve(axios.get('/api/interviewers')),
    ]).then((all) => {
      dispatch({ type: SET_APPLICATION_DATA, value: all })
    });

  }, []);

  function bookInterview(id, interview) {
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
    .then(() => dispatch({ type: SET_INTERVIEW, value: newState}));
  };

  function cancelInterview(id) {
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
      .then(() => dispatch({ type: SET_INTERVIEW, value: newState}));
  };
  
  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
}