export const updateState = (state, newState) => Object.assign({}, state, newState)
export const performAction = (state, actions, actionType) => actions[actionType] ? actions[actionType](state) : state
