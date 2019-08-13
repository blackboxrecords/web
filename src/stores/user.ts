import axios from 'axios'
import { observable } from 'mobx'

export default class UserStore {
  @observable users: {}[] = []

  async loadUsers() {
    try {
      const { data: users } = await axios.get('/users')
      this.users = users
      console.log(users[0])
    } catch (err) {
      console.log('Error loading users', err)
    }
  }

  async syncUser(userId: string) {
    try {
      await axios.get('/sync', {
        params: {
          userId,
        },
      })
    } catch (err) {
      console.log('Error syncing user artist data', err)
    }
  }

  async exportData() {
    window.open(axios.defaults.baseURL + '/users/artists', '_blank')
  }
}
