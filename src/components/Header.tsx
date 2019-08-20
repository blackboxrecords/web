import React from 'react'
import { inject, observer } from 'mobx-react'
import UserStore from '../stores/user'
import axios from 'axios'

@inject('user')
@observer
export default class Header extends React.Component<{
  user?: UserStore
}> {
  state = {
    syncingAll: false,
    syncProgress: 0,
  }

  syncAll = async () => {
    if (this.state.syncingAll) return
    try {
      this.setState({ syncingAll: true })
      await this.props.user.syncAllUsers((i) => {
        this.setState({
          syncProgress: i,
        })
      })
    } catch (err) {
      console.log('Error syncing all', err)
    }
    this.setState({ syncingAll: false })
  }

  render() {
    const { user } = this.props
    const { syncingAll, syncProgress } = this.state
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: 4,
        }}
      >
        <div
          style={{
            fontSize: 18,
            marginBottom: 8,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div>Black Box Records Spotify Accounts</div>
          <div>
            {syncingAll ? (
              <div style={{ fontSize: 15 }}>
                syncing... {`${syncProgress}/${user.users.length}`}
              </div>
            ) : (
              <button onClick={this.syncAll}>Sync All Users</button>
            )}
          </div>
        </div>
        <div
          style={{
            margin: 4,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <button
            onClick={() => {
              window.open(
                `${axios.defaults.baseURL}/spotify/auth`,
                '_blank'
              )
            }}
          >
            Spotify Auth
          </button>
          <div style={{ height: 4 }} />
          <input
            type="text"
            readOnly
            value={`${axios.defaults.baseURL}/spotify/auth`}
          />
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            margin: 4,
          }}
        >
          <div>
            <button
              onClick={() => {
                user.exportData()
              }}
            >
              Export All
            </button>
          </div>
          <div style={{ height: 4 }} />
          <div>
            <button
              onClick={() => {
                user.exportRelatedData()
              }}
            >
              Export Related
            </button>
          </div>
        </div>
      </div>
    )
  }
}
