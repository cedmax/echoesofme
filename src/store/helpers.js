export const updateState = (state, newState) => Object.assign({}, state, newState)
export const performActionCreator = (actions) => (state, actionType) => actions[actionType] ? actions[actionType](state) : state
