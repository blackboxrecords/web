import axios from 'axios'
import { observable } from 'mobx'
import ParallelPromise from '../ParallelPromise'

export interface User {
  _id: string
  name: string
  email: string
  lastSynced: string
}

export default class UserStore {
  @observable users: User[] = []
  @observable usersById: { [key: string] : User } = {}

  userById(id: string) {
    return this.usersById[id] || {} as User
  }

  async loadUsers() {
    try {
      const { data: users } = await axios.get('/users')
      users.forEach((user: User) => {
        this.usersById[user._id] = user
      })
      this.users = users
    } catch (err) {
      console.log('Error loading users', err)
    }
  }

  async loadUser(id: string) {
    try {
      const { data: user } = await axios.get('/users', {
        params: { id },
      })
      this.usersById[user._id] = user
    } catch (err) {
      console.log('Error loading user', err)
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

  async syncAllUsers() {
    await ParallelPromise(this.users.length, async (i) => {
      await this.syncUser(this.users[i]._id)
    })
  }

  exportData() {
    window.open(axios.defaults.baseURL + '/users/artists', '_blank')
  }

  exportRelatedData() {
    window.open(axios.defaults.baseURL + '/users/artists/related', '_blank')
  }
}
