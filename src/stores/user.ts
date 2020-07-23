import axios from 'axios'
import { observable, computed } from 'mobx'
import ParallelPromise from '@jchancehud/parallel-promise'
import moment from 'moment'

export interface User {
  _id: string
  name: string
  email: string
  hasToken: boolean
  lastSynced: string
  isSyncing?: boolean
}

export interface UserAuth {
  username: string
  token: string
}

export default class UserStore {
  @observable users: User[] = []
  @observable usersById: { [key: string] : User } = {}
  @observable syncInProgress = false
  @observable activeAuth: UserAuth = {} as UserAuth

  constructor() {
    try {
      const activeUser = localStorage.getItem('activeUser')
      if (activeUser) {
        this.activeAuth = JSON.parse(activeUser)
      }
    } catch (err) {
      console.log('Error loading user data, resetting', err)
      this.activeAuth = {} as UserAuth
    }
  }

  userById(id: string) {
    return this.usersById[id] || {} as User
  }

  async loadUsers() {
    try {
      const { data: users } = await axios.get('/users', {
        params: {
          token: this.activeAuth.token,
        }
      })
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
        params: { id, token: this.activeAuth.token },
      })
      this.usersById[user._id] = user
    } catch (err) {
      console.log('Error loading user', err)
    }
  }

  async deleteUser(id: string) {
    try {
      await axios.delete(`/users/${id}`, {
        params: {
          token: this.activeAuth.token,
        },
      })
      delete this.usersById[id]
      this.users = this.users.filter((user) => {
        return user._id !== id
      })
    } catch (err) {
      console.log('Error deleting user', err)
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
          token: this.activeAuth.token,
        },
      })
      this.usersById[userId] = {
        ...this.userById(userId),
        isSyncing: false,
        ...user,
      }
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
    window.open(`http://3.19.41.53:4000/users/artists?token=${this.activeAuth.token}`, '_blank')
  }

  exportRelatedData() {
    window.open(`http://3.19.41.53:4000/users/artists/related?token=${this.activeAuth.token}`, '_blank')
  }

  exportGenreData() {
    window.open(`http://3.19.41.53:4000/users/genres?token=${this.activeAuth.token}`, '_blank')
  }

  async login(username: string, password: string) {
    try {
      const { data } = await axios.put('/users/login', {
        username,
        password,
      })
      this.setActiveAuth(data)
    } catch (err) {
      alert(err.response.data.message)
    }
  }

  async createAccount(username: string, password: string, token: string) {
    try {
      const { data } = await axios.post('/users', {
        username,
        password,
        ctoken: token,
      })
      this.setActiveAuth(data)
    } catch (err) {
      alert(err.response.data.message)
    }
  }

  setActiveAuth(user: UserAuth) {
    localStorage.setItem('activeUser', JSON.stringify(user))
    this.activeAuth = user
  }

  @computed
  get authenticated() {
    return !!(this.activeAuth && this.activeAuth.token)
  }

  logout() {
    localStorage.clear()
    this.activeAuth = {} as UserAuth
  }
}
