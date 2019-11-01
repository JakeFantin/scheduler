import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useApplicationData() {

  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {}
  })

  const setDay = day => setState({ ...state, day });

  useEffect(() => {
    Promise.all([
      Promise.resolve(axios.get('/api/days')),
      Promise.resolve(axios.get('/api/appointments')),
      Promise.resolve(axios.get('/api/interviewers')),
    ]).then((all) => {
      console.log(all[2]);
      setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }))
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
    .then(() => setState(newState))
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
      .then(() => setState(newState))
  };
  
  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
}