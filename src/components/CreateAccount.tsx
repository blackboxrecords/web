import React from 'react'
import { observer, inject } from 'mobx-react'
import UserStore from '../stores/user'

@inject('user')
@observer
export default class CreateAccount extends React.Component<{
  user?: UserStore
  onAuth?: () => any
  location: any
}> {
  state = {
    username: '',
    password: '',
    passwordConfirm: '',
    errorMessage: '',
  }

  passwordsMatch = (): boolean => {
    return this.state.password === this.state.passwordConfirm
  }

  createAccount = async () => {
    try {
      if (!this.passwordsMatch()) {
        return alert('Passwords do not match')
      }
      const { username, password } = this.state
      let token = ''
      window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m, key, value) => {
        if (key === 'token') token = value
      })
      await this.props.user.createAccount(username, password, token)
      this.setState({
        errorMessage: '',
      })
      this.props.onAuth && this.props.onAuth()
    } catch (err) {
      this.setState({
        errorMessage: err.toString()
      })
    }

  }

  render() {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div><h3>Create Account</h3></div>
        <div style={{}}>
          <div>
            Username:
          </div>
          <input onChange={(e: any) => {
            this.setState({
              username: e.target.value,
            })
          }} type="text" placeholder="Min. 4 characters" />
          <div>
            Password:
          </div>
          <input onChange={(e: any) => {
            this.setState({
              password: e.target.value,
            })
          }} type="password" placeholder="Min. 7 characters"/>
          <div>
            Verify:
          </div>
          <input onChange={(e: any) => {
            this.setState({
              passwordConfirm: e.target.value,
            })
          }} type="password" />
        </div>
        <div style={{ margin: 4 }}>
          <button onClick={this.createAccount}>Create Account</button>
        </div>
        <div style={{ color: 'red' }}>
          {this.state.errorMessage}
        </div>
      </div>
    )
  }
}
