import axios from 'axios'
import { observable } from 'mobx'
import ParallelPromise from '@jchancehud/parallel-promise'
import moment from 'moment'

export interface User {
  _id: string
  name: string
  email: string
  lastSynced: string
  isSyncing?: boolean
}

export default class UserStore {
  @observable users: User[] = []
  @observable usersById: { [key: string] : User } = {}
  @observable syncInProgress = false

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
      this.usersById[userId] = {
        ...this.userById(userId),
        isSyncing: true,
      }
      const { data: user } = await axios.get('/sync', {
        params: {
          userId,
        },
      })
      this.usersById[userId] = user
    } catch (err) {
      console.log('Error syncing user artist data', err)
      this.usersById[userId] = {
        ...this.userById(userId),
        isSyncing: false,
      }
    }
  }

  async syncAllUsers(cb?: (i: number) => any) {
    await ParallelPromise(this.users.length, async (i) => {
      cb(i)
      try {
        const { lastSynced, _id } = this.users[i]
        if (
          lastSynced &&
          moment().diff(moment(lastSynced), 'minutes') < 30
        ) return // skip users that have been synced in the past 30 minutes
        await this.syncUser(_id)
      } catch (err) {
        console.log('Error syncing user', this.users[i]._id)
      }
    }, 2)
  }

  exportData() {
    window.open(axios.defaults.baseURL + '/users/artists', '_blank')
  }

  exportRelatedData() {
    window.open(axios.defaults.baseURL + '/users/artists/related', '_blank')
  }
}
