<template>
  <!-- TODO Do not display this page if the user is not validated -->
  <div style="text-align:center">
    <div v-if="isOther()">
      <h2 style="color:yellowgreen; font-size:48px; font-weight:bold;">Welcome to the swamp!</h2>
      <img id="auction_photo2" src="https://i.imgur.com/3J4IHF1.png" alt="WHAT ARE YOU DOING IN MY SWAMP!"/>
    </div>
    <div id="singleAuction_pageDiv" v-else>
      <div v-if="isValidated()">
        <label style="font-size:20px; color:green">
          Create an auction
        </label>
        <br/>
        <br/>
        <div>
          <form id="createAuction_titleField">
            <label class=createAuction_genericLabel>Auction Title:</label>
            <input v-model="createAuction_title" class="createAuction_genericInput"/>
          </form>
        </div>
        <div>
          <form id="createAuction_startDatePicker">
            <label class=createAuction_genericLabel>Start date:</label>
            <input v-model="createAuction_startDate" type="datetime-local" class="createAuction_genericInput":min='getMinDate()'/>
          </form>
        </div>
        <div>
          <form id="createAuction_auctionEndDatePicker">
            <label class=createAuction_genericLabel>End date:</label>
            <input v-model="createAuction_endDate" type="datetime-local" class="createAuction_genericInput"/>
          </form>
        </div>
        <div>
          <form id="createAuction_auctionDescriptionField">
            <label class=createAuction_genericLabel style="position:relative; bottom:50px">Description:</label>
            <textarea v-model="createAuction_description" cols="30" rows="3" class="createAuction_genericInput" style="resize: horizontal; border-width:2px"></textarea>
          </form>
        </div>
        <div style="text-align: center; position:relative; right:48px">
          <label class=createAuction_genericLabel>Category:</label>
          <select v-model="createAuction_categoryId" id="selectedCategory" style="border-color:darkseagreen">
            <option v-for="category in createAuction_categories">{{ category.categoryId + ": " + category.categoryTitle }}</option>
          </select>
        </div>
        <div>
          <form id="createAuction_reservePriceField">
            <label class=createAuction_genericLabel>Reserve Price:</label>
            <input v-model="createAuction_reservePrice" type="number" class="createAuction_genericInput"/>
          </form>
        </div>
        <br/>
        
        
        <i style="color:grey">You can add a photo after the auction is created</i>
        
        
        <div style="color:red">
          {{ createAuction_statusMessage }}
        </div>
        <div>
          <router-link :to="{ name: 'auctions'}" tag="button" class="singleAuction_buttonGeneric" style="position:relative; right:76px; background-color:darkseagreen; border-color:darkseagreen">Back</router-link>
          
          <button id="createAuction_createAuctionButton" type="button" v-on:click="postAuction()" class="singleAuction_buttonGeneric" style="position:relative; left:76px">
            Create
          </button>
        </div>
        
        
      </div>
      <div v-else>
        You must be logged in to create auctions
      </div>
    </div>
  </div>
</template>

<script>
  let address = 'http://localhost:4941/api/v1';
  
  export default {
    data() {
      return {
        error: "",
        errorFlag: false,
        createAuction_title: [],
        createAuction_startDate: "",
        createAuction_endDate: "",
        createAuction_description: "",
        createAuction_categories: [],
        createAuction_categoryId: "",
        createAuction_reservePrice: "",
        createAuction_photo: "",
        createAuction_statusMessage: "",
  
      }
    },
    
    mounted: function() {
      this.getCategories()
    },
    
    methods: {
      postAuction: function() {
        if (this.createAuction_categoryId.length > 0) {
          this.$http.post(address + "/auctions", JSON.stringify({
            "categoryId": Number(this.createAuction_categoryId.slice(0, 1)),
            "title": this.createAuction_title,
            "description": this.createAuction_description,
            "startDateTime": new Date(this.createAuction_startDate).getTime(),
            "endDateTime": new Date(this.createAuction_endDate).getTime(),
            "reservePrice": Number(this.createAuction_reservePrice),
            "startingBid": 0
          }), {
            headers: {
              "X-Authorization": sessionStorage.getItem("auth_token"),
              "Content-Type": "application/json"
            },
    
          })
            .then(function (response) {
              if (response.ok) {
                this.createAuction_statusMessage = "Auction successfully created!";
                document.getElementById("createAuction_createAuctionButton").disabled = true;
              }
            }, function (error) {
              this.error = (error);
              this.errorFlag = true;
              this.createAuction_statusMessage = "You have an invalid date. Check whether Start date is before today or if End date is before the Start Date";
            });
        } else {
          this.createAuction_statusMessage = "Please choose a category";
        }
      },
      
      isValidated: function() {
        return String(sessionStorage.getItem("auth_token")).length > 5;
      },
      title: function() { return "Welcome to the swamp!" },
      
      isOther: function() {
        console.log(this.$route.path);
        return (this.$route.path == "/auction/other");
      },
  
      getMinDate: function() {
        let now = new Date().getTime();
        now += 12 * 60 * 60 * 1000;
        let nowShift = new Date(now).toISOString().slice(0, -8);
        return nowShift;
      },
  
      getCategories: function () {
        this.$http.get(address + '/categories')
          .then(function (response) {
            this.createAuction_categories = response.body;
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },
      
    }
  }
  
</script>

<style scoped>

  #singleAuction_pageDiv {
    text-align: center;
    padding-top: 100px;
  }
  
  .createAuction_genericLabel {
    width: 100px;
  }
  
  .createAuction_genericInput {
    border-color: darkseagreen;
    width: 200px;
  }

  .singleAuction_buttonGeneric {
    color: white;
    background-color: darkgreen;
    border-color: green;
  }
  
</style>
