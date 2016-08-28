const ReactCSSTransitionGroup = require('react-addons-css-transition-group')
const React = require('react')
const _ = require('lodash')
const agent = require('superagent')
const API_PATH = 'https://db-zip-api.herokuapp.com/api/zip-code/'

const App = React.createClass({
  getInitialState () {
    return {
      showForm: true,
      zipLookupComplete: false,
      fullName: '',
      addressLine1: '',
      addressLine2: '',
      zipCode: '',
      city: '',
      state: ''
    }
  },

  handleNameEvent (event) { this.setState({ fullName: event.target.value }) },

  handleAddress1Event (event) { this.setState({ addressLine1: event.target.value }) },

  handleAddress2Event (event) { this.setState({ addressLine2: event.target.value }) },

  handleCityEvent (event) { this.setState({ city: event.target.value }) },

  handleStateEvent (event) { this.setState({ state: event.target.value }) },

  handleFormSubmit (event) {
    event.preventDefault()

    const clearedFormState = this.getInitialState()
    clearedFormState.showForm = false
    this.setState(clearedFormState)
  },

  handleResubmit () {
    this.setState({ showForm: true })
  },

  handleZipCodeEvent (event) {
    this.setState({ zipCode: event.target.value })
    this.lookupZipCode(event.target.value)
  },

  lookupZipCode (zipCode) {
    if (!zipCode) {
      this.setState({ city: '' })
      this.setState({ state: '' })
      return
    }

    agent
      .get(`${API_PATH}${zipCode}`)
      .end((err, res) => {
        if (err) return

        if (res.body) {
          const {state, city} = res.body
          this.setState({ city })
          this.setState({ state })
        }

        this.setState({ zipLookupComplete: true })
      })
  },

  componentWillMount () {
    this.lookupZipCode = _.debounce(this.lookupZipCode, 750, {leading: false, trailing: true})
  },

  render () {
    let cityAndState, containerContents

    if (this.state.zipLookupComplete) {
      cityAndState = (
        <div>
          <input className='half-line-item float-left' type='text' placeholder='City' value={this.state.city} onChange={this.handleCityEvent} />
          <input className='half-line-item float-right' type='text' placeholder='State' value={this.state.state} onChange={this.handleStateEvent} />
        </div>
      )
    }

    if (this.state.showForm) {
      containerContents = (
        <form onSubmit={this.handleFormSubmit}>
          <ReactCSSTransitionGroup transitionName="example" transitionEnterTimeout={750} transitionLeaveTimeout={750}>

            <h1 className='title'>Zip Form</h1>

            <input className='line-item' type='text' placeholder='Full name' value={this.state.fullName} onChange={this.handleNameEvent} />
            <input className='line-item' type='text' placeholder='Address line 1' value={this.state.addressLine1} onChange={this.handleAddress1Event} />
            <input className='line-item' type='text' placeholder='Address line 2' value={this.state.addressLine2} onChange={this.handleAddress2Event} />

            {cityAndState}

            <input className='half-line-item float-left' type='text' placeholder='Zip Code' value={this.state.zipCode} onChange={this.handleZipCodeEvent} />

            <br />
            <br />

            <button className='submit'>Submit</button>

          </ReactCSSTransitionGroup>
        </form>
      )
    } else {
      containerContents = (
        <div>
          <h1 className='title'>Thanks!!</h1>
          <button className='submit' onClick={this.handleResubmit}>Resubmit</button>
        </div>
      )
    }

    return (
      <div className='app-container'>
        <div className='home-info'>
          {containerContents}
        </div>
      </div>
    )
  }

})

module.exports = App
