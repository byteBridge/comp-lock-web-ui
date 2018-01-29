import moment from 'moment'

export default {
  filters: {
    niceDate (value) {
      return moment().to(value)
    }
  }
}
