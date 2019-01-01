<template>
  <div>
    <!-- Ask for user to confirm delete action -->
    <v-layout row justify-center style="position: relative;">
      <v-dialog v-model="show" persistent max-width="500px">
          <v-alert :color="alert.type" icon="error" value="true" dismissible v-model="alert.value">
            {{ alert.message }}
          </v-alert>
        <v-card large>
          <v-card-title>
            <div class="title primary--text">Make Payment</div>
          </v-card-title>
          <v-card-text>
            
            <div>
              <v-text-field
                label="Amount you are paying"
                v-model="amount"
                readonly
                disabled
                prepend-icon="credit_card">
              </v-text-field>

              <v-text-field
                label="Enter your ecocash/one money phone number"
                v-model="mobileNumber"
                type="text"
                prepend-icon="phone">
              </v-text-field>

              <v-text-field
                label="Enter your email address"
                v-model="user.email"
                type="email"
                prepend-icon="mail">
              </v-text-field>

              <div class="pl-4">
                <v-btn @click="mobileMoneyProvider = 'ecocash'" :outline="mobileMoneyProvider !== 'ecocash'" class="mr-0" :class="{primary: mobileMoneyProvider === 'ecocash', 'elevation-0': mobileMoneyProvider === 'ecocash'}">Ecocash</v-btn>
                <v-btn @click="mobileMoneyProvider = 'onemoney'" :outline="mobileMoneyProvider !== 'onemoney'" class="ml-0" :class="{primary: mobileMoneyProvider === 'onemoney', 'elevation-0': mobileMoneyProvider === 'onemoney'}">One Money</v-btn>
                <label for="" class="ml-2">Choose Payment Platform</label>
              </div>
            </div>
          </v-card-text>
          <v-card-actions class="py-4 primary px-4">
            <v-spacer></v-spacer>
            <v-btn flat class="primary" @click.native="$emit('close')">Close</v-btn>
            <v-btn class="white primary--text darken-1" :loading="paying" @click.native="makePayment">Make Payment</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </div>
</template>

<script>
  export default {
    name: 'AppConfirmDeleteTask',
    data () {
      return {
        email: '',
        mobileNumber: '',
        mobileMoneyProvider: 'ecocash',
        show: false,
        paying: false,
        alert: {
          value: false,
          message: '',
          type: 'info'
        }
      }
    },
    props: {
      amount: Number,
      products: Array,
      user: Object,
      showDialog: Boolean
    },
    watch: {
      showDialog (value) {
        this.show = value
        this.email = ''
        this.mobileNumber = ''
      }
    },

    methods: {
      getUserEmail () {
        console.log('getting the user email', this.user.email)
        return this.user.email
      },
      makePayment () {
        this.paying = true
        const products = this.products.map(p => ({ itemName: p, price: 10 }))
        this.$http.post('/billing/subscribe', {
          products,
          authemail: this.user.email,
          mobileNumber: this.mobileNumber,
          mobileMoneyProvider: this.mobileMoneyProvider
        })
          .then(response => {
            this.alert = {
              message: 'Successfully initiated transaction. Enter you pin on your phone to proceed with the payment',
              value: true,
              type: 'info'
            }
            console.log(response)
          })
          .catch((err) => {
            this.alert = {
              message: err.response.data.error.error.error || 'Failed to make the transaction. No money has been transfered and you can try again.',
              value: true,
              type: 'error'
            }
          })
          .finally(() => {
            this.paying = false
          })
      }
    }
  }
</script>
