import React from 'react'
import { inject, observer } from 'mobx-react'

@inject()
@observer
export default class Home extends React.Component<{}> {
  async componentDidMount() {}

  render() {
    return (
      <>
        Hello World
        </>
    )
  }
}
