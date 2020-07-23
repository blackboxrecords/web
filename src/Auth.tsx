import React from 'react'
import CreateAccount from './components/CreateAccount'
import Login from './components/Login'
import UserStore from './stores/user'
import { observer, inject } from 'mobx-react'
import { Redirect } from 'react-router-dom'

@inject('user')
@observer
export default class Auth extends React.Component<{
  user?: UserStore,
}> {
  render() {
    if (this.props.user.authenticated) {
      return <Redirect to="/" />
    }
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          maxWidth: 800,
          margin: 'auto',
        }}
      >
        <CreateAccount />
        <div style={{ width: 64 }} />
        <Login />
      </div>
    )
  }
}
