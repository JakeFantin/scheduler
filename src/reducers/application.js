export const SET_DAY = 'SET_DAY';
export const SET_APPLICATION_DATA = 'SET_APPLICATION_DATA';
export const SET_INTERVIEW = "SET_INTERVIEW";

export default function reducer(state, action) {
  switch (action.type) {
    // SET STATE WITH NEW FOCUS DAY FROM THE NAV BAR
    case SET_DAY:
      return { ...state, day: action.value }
    // SETS THE STATE FROM THE SERVER DATA 
    case SET_APPLICATION_DATA:
      return { ...state, days: action.value[0].data, appointments: action.value[1].data, interviewers: action.value[2].data }
    // MAKE OR DELETE AN INTERVIEW
    case SET_INTERVIEW: {
      // IF STATEMENT DETERMINES THE DAY BY THE APPOINTMENT ID
      let dayId = Math.floor((action.id/5)-.01);

      const numSpots = action.newState.days[dayId].appointments.reduce((count, appointment) => {
        return !action.newState.appointments[appointment].interview ? count + 1 : count;
      }, 0);
  
      action.newState.days[dayId].spots = numSpots;

      return {...action.newState}
    }
    default:
      throw new Error(
        `tried to reduce with unsupported action type: ${action.type}`
      );
  }
}