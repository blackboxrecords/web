import React from 'react'
import { inject, observer } from 'mobx-react'
import UserStore from './stores/user'

@inject('user')
@observer
export default class RecommendedArtists extends React.Component<{
  user: UserStore
  match: {
    params: {
      userId: string
    }
  }
}> {
  render() {
    const { userId } = this.props.match.params
    return (
      <>hello</>
    )
  }
}
