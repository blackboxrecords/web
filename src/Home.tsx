import React from 'react'
import { inject, observer } from 'mobx-react'
import UserStore from './stores/user'
import UserCell from './components/UserCell'
import Header from './components/Header'

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
          <Header />
          {user.users.map((user, index) => (
            <UserCell
              style={{
                backgroundColor: index % 2 === 0 ? '#ddd' : 'white',
              }}
              userId={user._id}
            />
          ))}
        </div>
      </div>
    )
  }
}
