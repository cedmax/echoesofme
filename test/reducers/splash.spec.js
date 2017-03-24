import splash from 'store/reducers/splash'
import deepFreeze from 'deep-freeze'

it('should set the splash visibility to false when invoked with HIDE_SPLASH', () => {
  const stateBefore = {
    visible: true
  }
  const action = {
    type: 'HIDE_SPLASH'
  }
  const stateAfter = {
    visible: false
  }

  deepFreeze(stateBefore)
  deepFreeze(stateAfter)

  expect(splash(stateBefore, {type: 'UNKNOWN'})).toEqual(stateBefore)
  expect(splash(stateBefore, action)).toEqual(stateAfter)
})
