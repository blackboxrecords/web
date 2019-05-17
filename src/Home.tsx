import React from 'react'
import { inject, observer } from 'mobx-react'
import UserStore from './stores/user'

@inject('user')
@observer
export default class Home extends React.Component<{
  user?: UserStore,
}> {
  async componentDidMount() {
    await this.props.user.loadUsers()
  }

  render() {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}>
        <div style={{
          fontSize: 18,
          marginBottom: 8,
        }}>
          Black Box Records Spotify Accounts
        </div>
        <button onClick={() => {
          this.props.user.exportData()
        }}>Export All</button>
        {this.props.user.users.map((user: any) => {
          return (
            <div key={user._id}>
              <span>{user.name}</span>
              <span> - </span>
              <span>{user.email}</span>
              <span> - </span>
              <button onClick={() => {
                this.props.user.syncUser(user._id)
              }}>Sync</button>
            </div>
          )
        })}
      </div>
    )
  }
}
