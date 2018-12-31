<template>
  <div>

    <!-- dialog to confirm the permission to delete a user -->
    <AppMakePayment
      :showDialog="showPaymentDialog"
      :amount="totalPrice"
      :products="checkedComputers"
      :user="authUser.user"
      @close="closeDialogAndRefresh()">
    </AppMakePayment>

    <!-- Showing the latest transaction information -->
    <div class="transaction-box mb-4">

      <!-- The transaction highlights -->
      <div class="flex justify-between items-center">
        <div class="mb-0">

          <!-- Title and expand button -->
          <v-btn small  fab flat @click="lastTransactionExpanded = !lastTransactionExpanded">
            <v-icon>{{ lastTransactionExpanded ? 'keyboard_arrow_up': 'keyboard_arrow_down'}}</v-icon>
          </v-btn>
          <strong>LATEST TRANSACTION</strong>
        </div>

        <!-- The price and status -->
        <div class="mb-0 flex flex-col flex-grow-0" v-if="lastTransaction !== null">
           <div class="flex items-center">
             <code class="mr-2">{{lastTransaction.status}}</code> <span class="computer-box__price">${{ calculatePrice() }}</span>
           </div>
           <div class="text-grey" style="text-align: right">
              {{lastTransaction.created_at | niceDate}}
           </div>
        </div>

        <div v-else><code>You have never made a transaction</code></div>
      </div>

      <!-- The meatier part of the transaction showing  -->
      <div v-if="lastTransaction && lastTransactionExpanded"  class="py-4 border-t" >
        <div class="mb-4">
          Paid with <code>{{lastTransaction.mobileMoneyProvider}}</code> using email <code>{{lastTransaction.authemail}}</code> and phone <code>{{lastTransaction.mobileNumber}}</code>
        </div>
        <h6>Subscribed Computers</h6>
        <ul class="list-reset">
          <li v-for="(item, i) in lastTransaction.products" :key="i" class="flex items-center mb-2">
           <span class="fancy-bullet mr-2"></span> {{ item.itemName }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Show the computers list -->
    <div class="computer-box">
      <div class="border-b flex justify-between items-center flex-1 pb-2">
        <strong class="mb-0"><v-icon class="mr-2">computer</v-icon> SUBSCRIBE COMPUTERS</strong>
       
        <!-- Search -->
        <v-text-field
          style="max-width: 400px"
          label="Seach for computer"
          v-model="searchText"
          type="email"
          append-icon="search">
        </v-text-field>

        <!-- Price and call to action -->
        <div>
          <span class="computer-box__price inline-block">${{ totalPrice }}</span>
          <v-btn primary @click="showPaymentDialog = true" class="mb-3">Proceed to Payment</v-btn>
        </div>
      </div>

      <!-- Select all the unsubscribed computers -->
      <div class="flex justify-end pt-2 px-2 mt-4">
        <input type="checkbox" name="" v-model="isAllComputersChecked" id="select-all" class="mr-2">
        <label for="select-all" style="font-weight: bold">Select all computers</label>
      </div>

      <div>
        <v-data-table
          v-bind:headers="headers"
          :items="computersData"
          :search="searchText"
          hide-actions
          class="elevation-0">
          <template slot="items" scope="props">
            <td>
                <strong>{{ props.item.name }}</strong>
            </td>
            <td class="text-xs-left">{{ props.item.created_at | niceDate }}</td>
            <td class="text-xs-left">
              <span v-if="props.item.is_paid_for" class="text-green">
                <v-icon class="mr-2 currentColor">done_all</v-icon>
                yes
              </span>
              <span v-else class="text-orange">
                <v-icon class="mr-2 currentColor">cancel</v-icon>
                 no
              </span>
            </td>
            <td class="text-xs-left">
              <span v-if="props.item.token_paid_time">{{ props.item.token_paid_time | niceDate }}</span>
              <span v-else> not available </span>
            </td>
            <td class="text-xs-left">
              <v-icon class="mr-2">timer</v-icon>
              <span v-if="props.item.token_expiry_time">{{ props.item.token_expiry_time | niceDate }}</span>
              <span v-else> not available </span>
            </td>
            <td class="text-xs-right">
              <v-btn
                class="btn-outline py-2 px-4"
                :disabled="props.item.is_paid_for"
                :class="{'btn-outline-primary': isChecked(props.item.name)}"
                @click="toggleComputerCheckState(props.item.name)">
                <v-icon class="mr-2">shopping_cart</v-icon>
                <span v-if="isChecked(props.item.name)">
                  Remove from Cart
                </span>
                <span v-else>
                Add to cart
                </span>
              </v-btn>
            </td>
          </template>
        </v-data-table>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import AppMakePayment from '@/components/AppMakePayment'

export default {
  name: 'Payments',

  components: {
    AppMakePayment
  },

  mounted () {
    this.getLastTransaction()
    this.getAllComputers()
  },

  data: function () {
    return {
      computersData: [],
      headers: [
        { text: 'Computer Name', value: 'computer_name', align: 'left' },
        { text: 'Date Added', value: 'created_at', align: 'left' },
        { text: 'Is Computer Paid for', value: 'is_paid_for', align: 'left' },
        { text: 'Last Payment', value: 'token_paid_date', align: 'left' },
        { text: 'Subscription Expiry', value: 'token_expiry_time', align: 'left' }
      ],
      searchText: '',
      checkedComputers: [],
      lastTransaction: null,
      isAllComputersChecked: false,
      lastTransactionExpanded: false,
      showPaymentDialog: false
    }
  },

  methods: {
    getAllComputers () {
      this.$http.get('/computers')
      .then(response => {
        this.computersData = response.data.computers
      })
      .catch(() => {})
    },

    getLastTransaction () {
      this.$http.get('/billing/last-transaction')
        .then(response => {
          this.lastTransaction = response.data
          if (response.data && response.data.status === 'awaiting-payment') {
            this.subscriptionPingInterval = this.pingSubscriptionStatus(response.data.reference)
          }
        })
        .catch(console.log)
    },

    toggleComputerCheckState (name) {
      if (this.isChecked(name)) {
        this.checkedComputers.splice(this.checkedComputers.indexOf(name), 1)
      } else {
        this.checkedComputers.push(name)
      }
    },

    isChecked (name) {
      return this.checkedComputers.indexOf(name) > -1
    },

    calculatePrice () {
      return this.lastTransaction
        ? this.lastTransaction
            .products
            .map(p => parseFloat(p.price))
            .reduce((total, current) => total + current, 0)
        : 0
    },

    closeDialogAndRefresh () {
      this.showPaymentDialog = false
      this.getLastTransaction()
    },

    pingSubscriptionStatus (reference) {
      return setInterval(() => {
        this.$http.get(`/billing/ping-subscription/${reference}`)
          .then(res => {
            if (res.data.status === 'paid') {
              this.getLastTransaction()
              this.getAllComputers()
              clearInterval(this.subscriptionPingInterval)
            }
          })
          .catch(console.log)
      }, 500)
    }
  },

  watch: {
    isAllComputersChecked (oldValue, newValue) {
      if (newValue === false) {
        this.checkedComputers = this.computersData
          //  Remove those that have already been paid for
          .filter(c => !c.is_paid_for)
          .map(c => c.name)
      } else {
        this.checkedComputers = []
      }
    }
  },

  computed: {
    totalPrice () {
      return this.checkedComputers.length * 10
    },

    authUser () {
      return this.$store.getters.authUser || {}
    }
  },

  filters: {
    niceDate (value) {
      return moment().to(value)
    }
  }

}
</script>

<style scoped>
  .fancy-bullet {
    display: inline-block;
    height: 1.5rem;
    width: 1.5rem;
    border-radius: 50%;
    border: 3px solid #7b1fa2;
    position: relative;
    padding: 0;
  }

  .fancy-bullet::before {
    content: '';
    margin: 0;
    position: absolute;
    height: 0.6rem;
    width: 0.6rem;
    background:#7b1fa2;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%)
  }
  .transaction-box, .computer-box {
    background: #fff;
    border-radius: 4px;
    padding: 0.5rem 2rem;
    border: 1px rgb(224, 224, 224) solid
  }

  .border-b {
    border-bottom: 1px rgb(224, 224, 224) solid;
  }

  .border-t {
    border-top: 1px rgb(224, 224, 224) solid;
  }
  .computer-box__price {
    font-size: 22px;
    font-weight: bold
  }

  .btn-outline {
    box-shadow: 0 0 0 white;
    color: currentColor;
    border: 2px rgb(224, 224, 224) solid;
  }
  .btn-outline-primary {
    box-shadow: 0 0 0 white;
    color: #7b1fa2;
    border: 2px #7b1fa2 solid;
  }

  .block { display: block }
  .inline-block { display: inline-block }
  .list-reset { list-style: none }
  .text-grey { color: grey }
  .text-green { color: rgb(14, 114, 14) }
  .text-orange { color: rgb(212, 87, 3);}
  .currentColor { color: currentColor }
  .flex { display: flex }
  .flex-col { flex-direction: column }
  .justify-between { justify-content: space-between }
  .justify-end { justify-content: flex-end }
  .items-center { align-items: center }
  .items-baseline { align-items: baseline }
  .flex-1 { flex: 1 }
  .flex-grow-0 { flex-grow: 0 }
</style>
