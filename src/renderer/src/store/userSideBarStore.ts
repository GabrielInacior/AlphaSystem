import { defineStore } from 'pinia'

export const useUserSideBarStore = defineStore('sidebar', {
  state: () => ({
    rail: false,
  }),
  actions: {
    toggleRail() {
      this.rail = !this.rail;
    },
    setRail(value: boolean) {
      this.rail = value;
    },
  },
})
