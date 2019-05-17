import axios from 'axios'
import { observable } from 'mobx'

export default class UserStore {
  @observable users: {}[] = []

  async loadUsers() {
    try {
      const { data: users } = await axios.get('https://spotify-connect.plug.sh/users')
      this.users = users
    } catch (err) {
      console.log('Error loading users', err)
    }
  }

  async syncUser(userId: string) {
    try {
      await axios.get('https://spotify-connect.plug.sh/sync', {
        params: {
          userId,
        }
      })
    } catch (err) {
      console.log('Error syncing user artist data', err)
    }
  }

  async exportData() {
    window.open('https://spotify-connect.plug.sh/users/artists', '_blank')
  }
}
