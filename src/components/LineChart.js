import { Line } from 'vue-chartjs'
import moment from 'moment'

function newDate (days) {
  return moment().add(days, 'd').format('MM/DD/YYYY')
}

function normaliseData (rawData, daysBack) {
  let labels = []
  var minutes = 0
  var data = []

  // iterate from back in time to today. e.g 7 for i week, 30 for a month, etc
  for (let i = -daysBack; i < 1; i++) {
    labels.push(newDate(i))
  }

  // find matching days to the days on the label and plot their minutes values on the graph
  labels.forEach(dayLogged => {
    const matchingDays = rawData.filter(x => x.log_date === dayLogged)

    // calculate the minutes used for each day
    if (matchingDays.length === 0) minutes = 0
    if (matchingDays.length > 0) matchingDays.forEach(h => { minutes += Number(h.duration.slice(3, 5)) })

    // push the minutes to be plotted on graph
    data.push(minutes)
    // reset the minutes
    minutes = 0
  })

  return {
    labels: labels.map(label => moment(label).format('MMM DD')),
    datasets: [{
      label: 'Login activities (in minutes)',
      borderColor: 'purple',
      backgroundColor: 'rgba(224, 242, 241, 0.6)',
      data
    }]
  }
}

export default {
  extends: Line,
  props: ['data', 'daysBack', 'userType'],
  watch: {
    daysBack (value) { this.renderChart(normaliseData(this.data, Number(this.daysBack)), this.chartConfig) }
  },
  data () {
    return {
      chartConfig: {
        legend: {
          display: true,
          position: 'bottom'
        },
        elements: {
          line: {
            tension: 0 // disables bezier curves
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              max: 60 // to be replaced by the time limits from api
            }
          }]
        }
      }
    }
  },
  mounted () {
    this.$http.get(`/users/timelimits/${this.userType}`)
      .then(res => {
        const timeLimit = res.data.data.time_limit
        if (timeLimit) this.chartConfig.scales.yAxes[0].ticks.max = this.timeToMinutes(timeLimit)

        // render the chart with the new time limits
        this.renderChart(normaliseData(this.data, Number(this.daysBack)), this.chartConfig)
      })
      .catch(() => {
        // Still render the chart without the time limits
        // it will use the default values
        this.renderChart(normaliseData(this.data, Number(this.daysBack)), this.chartConfig)
      })
  },
  methods: {
    // gets time in the format <hours>:<minutes>
    // and returns the total number of minutes
    timeToMinutes (time) {
      time = time.split(':')
      let hours = time[0]
      let minutes = time[1]

      return Number(minutes) + Number(hours) * 60
    }
  }
}
