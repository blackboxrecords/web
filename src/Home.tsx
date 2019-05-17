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
      <>
      {this.props.user.users.map((user: any) => {
        return (
          <div key={user._id}>
            <span>{user.name}</span>
            <span> - </span>
            <span>{user.email}</span>
            <span> - </span>
            <button onClick={() => {
              
            }}>Export Data</button>
          </div>
        )
      })}
      </>
    )
  }
}
