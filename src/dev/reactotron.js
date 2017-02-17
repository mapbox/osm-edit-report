/* eslint-disable */
if (process.env.REACT_APP_LOGGER === 'tron') {
  const Reactotron = require('reactotron-react-js').default
  const { trackGlobalErrors } = require('reactotron-react-js')
  const tronsauce = require('reactotron-apisauce')
  const { reactotronRedux } = require('reactotron-redux')
  const api = require('../store/api').default;
  Reactotron
    .configure({ name: 'Dev time!', secure: false })
    .use(tronsauce())
    .use(reactotronRedux())
    .use(trackGlobalErrors({ offline: false }))
    .connect()

  // Reactotron.clear()
  api.addMonitor(Reactotron.apisauce)
  console.tron = Reactotron
}
