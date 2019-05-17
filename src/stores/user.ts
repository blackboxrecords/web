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

  async exportData(userId: string) {
    try {
      await this.syncUser(userId)
      const { data } = await axios.get('https://spotify-connect.plug.sh/users/artists', {
        params: {
          userId,
        },
        responseType: 'blob',
      })
      const url = window.URL.createObjectURL(new Blob([data]))
      const link = document.createElement('a')
      link.href=url
      link.setAttribute('download', 'artist-data.csv')
      link.click()
      link.parentNode.removeChild(link)
    } catch (err) {
      console.log('Error exporting artist data', err)
    }
  }
}
