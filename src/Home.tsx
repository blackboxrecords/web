import React from 'react'
import { inject, observer } from 'mobx-react'
import UserStore from './stores/user'
import moment from 'moment'

@inject('user')
@observer
export default class Home extends React.Component<{
  user?: UserStore
}> {
  async componentDidMount() {
    await this.props.user.loadUsers()
  }

  render() {
    const { user } = this.props
    const syncDiff = moment().diff(user.lastSynced)
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            fontSize: 18,
            marginBottom: 8,
          }}
        >
          Black Box Records Spotify Accounts
        </div>
        <button
          onClick={() => {
            user.exportData()
          }}
        >
          Export All
        </button>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {this.props.user.users.map((user: any) => (
            <div
              key={user._id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: 4,
              }}
            >
              <div style={{ display: 'flex' }}>
                <div>{user.name}</div>
                <div style={{ minWidth: 8 }} />
                <div>{user.email}</div>
              </div>
              <div style={{ flex: 1, minWidth: 100 }} />
              {user.lastSynced ? (
                <div>Last synced {moment(user.lastSynced).from(moment())}</div>
              ) : null}
              <div style={{ marginLeft: 8 }}>
                <button
                  onClick={() => {
                    this.props.user.syncUser(user._id)
                  }}
                >
                  Sync
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
}
