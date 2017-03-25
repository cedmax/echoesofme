export const updateState = (state, newState) => Object.assign({}, state, newState)
export const setActions = (actions) => (state, action) => actions[action.type] ? actions[action.type](state, action.payload) : state
