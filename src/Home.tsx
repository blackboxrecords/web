import React from 'react'
import { inject, observer } from 'mobx-react'
import UserStore from './stores/user'
import UserCell from './components/UserCell'
import axios from 'axios'
import { Redirect } from 'react-router-dom'
import refreshIcon from '../static/refresh.png'

@inject('user')
@observer
export default class Home extends React.Component<{
  user?: UserStore
}> {
  state = {
    syncingAll: false,
    syncProgress: 0,
  }
  async componentDidMount() {
    await this.props.user.loadUsers()
  }

  syncAll = async () => {
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
    const { syncProgress, syncingAll } = this.state
    if (!user.authenticated) {
      return <Redirect to="/auth" />
    }
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
            display: 'flex',
            flexDirection: 'column',
          }}
        >
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
              <div style={{ display: 'flex' }}>
                <button
                  onClick={() => {
                    user.exportData(true)
                  }}
                >
                  <img width="13px" height="13px" src={refreshIcon} />
                </button>
                <button
                  onClick={() => {
                    user.exportData()
                  }}
                >
                  Export All
                </button>
              </div>
              <div style={{ height: 4 }} />
              <div style={{ display: 'flex' }}>
                <button
                  onClick={() => {
                    user.exportRelatedData(true)
                  }}
                >
                  <img width="13px" height="13px" src={refreshIcon} />
                </button>
                <button
                  onClick={() => {
                    user.exportRelatedData()
                  }}
                >
                  Export Related
                </button>
              </div>
            </div>
            <div>
              <div style={{ height: 4 }} />
              <div style={{ display: 'flex' }}>
                <button
                  onClick={() => {
                    user.exportGenreData(true)
                  }}
                >
                  <img width="13px" height="13px" src={refreshIcon} />
                </button>
                <button
                  onClick={() => {
                    user.exportGenreData()
                  }}
                >
                  Export Genres
                </button>
              </div>
            </div>
          </div>
          {user.users.map((user, index) => (
            <UserCell
              style={{
                backgroundColor: index % 2 === 0 ? '#ddd' : 'white',
              }}
              userId={user._id}
              key={user._id}
            />
          ))}
        </div>
      </div>
    )
  }
}
