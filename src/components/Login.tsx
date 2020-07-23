import React from 'react'
import { observer, inject } from 'mobx-react'
import UserStore from '../stores/user'

@inject('user')
@observer
export default class Login extends React.Component<{
  user?: UserStore
  onAuth?: () => any
}> {
  state = {
    username: '',
    password: '',
    errorMessage: '',
  }

  login = async () => {
    try {
      this.setState({
        errorMessage: '',
      })
      const { username, password } = this.state
      await this.props.user.login(username, password)
      this.props.onAuth && this.props.onAuth()
    } catch (err) {
      this.setState({
        errorMessage: err.toString(),
      })
    }
  }

  render() {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div><h3>Login</h3></div>
        <div style={{}}>
          <div>
            Username:
          </div>
          <input autoFocus onChange={(e: any) => {
            this.setState({
              username: e.target.value,
            })
          }} type="text" />
          <div>
            Password:
          </div>
          <input
            onChange={(e: any) => {
              this.setState({
                password: e.target.value,
              })
            }}
            onKeyPress={(e: any) => {
              const { keyCode, which } = e
              const code = keyCode || which
              if (code === 13) {
                // Enter press
                this.login()
              }
            }}
            type="password"
          />
        </div>
        <div style={{ margin: 4 }}>
          <button onClick={this.login}>Login</button>
        </div>
        <div style={{ color: 'red' }}>
          {this.state.errorMessage}
        </div>
      </div>
    )
  }
}
