import React from 'react'
import { inject, observer } from 'mobx-react'
import UserStore, { User } from '../stores/user'
import moment from 'moment'

@inject('user')
@observer
export default class UserCell extends React.Component<{
  userId: string
  user?: UserStore
  style?: any
}> {
  render() {
    const { user, userId, style } = this.props
    const _user: User = this.props.user.userById(userId)
    return (
      <div
        key={_user._id}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: 4,
          ...(style || {}),
        }}
      >
        <div style={{ display: 'flex' }}>
          <div>{_user.name}</div>
          <div style={{ minWidth: 8 }} />
          <div>{_user.email}</div>
        </div>
        <div style={{ flex: 1, minWidth: 100 }} />
        {!_user.isSyncing && _user.lastSynced ? (
          <div>Last synced {moment(_user.lastSynced).from(moment())}</div>
        ) : null}
        {!_user.hasToken && (
          <div style={{ marginLeft: 4, color: 'red' }}>No active token</div>
        )}
        {_user.isSyncing && _user.hasToken ? (
          <div style={{ color: 'green' }}>currently syncing...</div>
        ) : null}
        {_user.hasToken ? (
        <div style={{ marginLeft: 8 }}>
          <button
            onClick={async () => {
              await user.syncUser(_user._id)
            }}
          >
            Sync
          </button>
        </div>
        ) : null}
      </div>
    )
  }
}
