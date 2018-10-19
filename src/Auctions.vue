<template xmlns:value="http://www.w3.org/1999/xhtml">
  <div id="auctions_template" style="margin-left: calc(100vw - 100%)">
    
    <h2 id="auctions_pageTitle">
      Auctions
    </h2>
  
    <form id=auctions_searchBar class=auctions_centered >
      <input v-model="searchString" placeholder="Search"style="border-color:darkseagreen"/>
    </form>
  
    <div style="text-align: center">
      <div style="position:relative; left:-35px">
        <span id="categoryDropdownHeader" style="display:inline-block; width: 115px;">Category</span>
        <span id="statusDropdownHeader">Status</span>
      </div>
    
      <select v-model="selectedCategory" id="selectedCategory" style="border-color:darkseagreen">
        <option value="allCategories" >All</option>
        <option v-for="category in categories">{{ category.categoryTitle }}</option>
      </select>
    
      <select v-model="selectedStatus" id="selectedStatus" class=auctions_centered style="border-color:darkseagreen">
        <option value="anyStatus">All</option>
        <option v-for="status in statuses">{{ status }}</option>
      </select>
    </div>
    <br/>
    <div style="text-align: center">
      <div style="display: inline-block; text-align: left; position:relative; left:38px">
        <form v-model="selectedRadio" id="radioBois">
          <label class="active">
          <input id= "auctions_any"          type="radio" name="radioFilter" value="a" v-on:click="re_render('a')"> Any<br>
          <input id= "auctions_myWins"       type="radio" name="radioFilter" value="0" v-on:click="re_render('0')"> Auctions won by me<br>
          <input id= "auctions_myBids"       type="radio" name="radioFilter" value="1" v-on:click="re_render('1')"> Auctions I have bid on<br>
          <input id= "auctions_ownerActive"  type="radio" name="radioFilter" value="2" v-on:click="re_render('2')"> Active auctions owned by me<br>
          <input id= "auctions_ownerSuccess" type="radio" name="radioFilter" value="3" v-on:click="re_render('3')"> Successful auctions owned by me <br>
          <input id= "auctions_ownerFailure" type="radio" name="radioFilter" value="4" v-on:click="re_render('4')"> Failed auctions owned by me<br>
          </label>
        </form>
      </div>
    </div>
    <br />
    
    <div>
      <table style="margin: auto">
        <tr v-for="auction in auctions">
          <div v-if=checkAuction(auction)>
            <div>
              <img id="auction_photo" :src=getAuctionPhoto(auction.id) :alt='auction.id' height="256" width="256"/>
            </div>
            <td><router-link :to="{ name: 'auction', params: { id: auction.id }}" style="color:green">{{ auction.title }}</router-link></td>
            <td>{{ auction.primaryphotoURI }}</td>
            
            <br /><br />
          </div>
        </tr>
      </table>
    </div>
  
    <div>
      <router-link :to="{ name: 'createAuction'}" tag="button" class="auctions_buttonsOther" style="right: 15px;">Create Auction</router-link>
    </div>
  
    <div>
      <router-link :to="{ path: '/'}" tag="button" class="auctions_buttonsOther" style="left: 15px;">Home</router-link>
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
        searchString: "",
        auctions: [],
        auction_id: "",
        primaryphotoURI: "",
        categories: [],
        selectedCategory: "allCategories",
        statuses: ["active", "expired", "upcoming", "won"],
        selectedStatus: "anyStatus",
        wonAuctions: [],
        ownedAuctions: [],
        biddedAuctions: [],
        radioStatus: "",
        loggedStatus: "",
        responseStatus: "",
        selectedRadio: "",
        auctionPhoto: ""
      }
    },
    mounted: function () {
      //For some reason none of these functions send the headers
      this.getAuctions();
      this.getCategories();
      this.getBidAuctions();
      this.getWonAuctions();
      this.getOwnedAuctions();
    },
    methods: {
      re_render: function (value) {
        this.selectedRadio = value;
      },
      
      getAuctions: function () {
        this.$http.get(address + '/auctions')
          .then(function (response) {
            this.auctions = response.data;
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },
      
      getCategories: function () {
        this.$http.get(address + '/categories')
          .then(function (response) {
            this.categories = response.body;
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },
      
      /**
       * Checks if the auction matches the searchString and the categorySelected
       * @param auction
       * @returns {boolean}
       */
      checkAuction: function (auction) {
        //Connecting to the server is for plebs
        let result = false;
        if ((auction.categoryTitle === (this.selectedCategory) || this.selectedCategory === "allCategories")
          //&& auction.title.search(new RegExp(this.searchString, "i")) !== -1){
          && auction.title.toLowerCase().search(this.searchString.toLowerCase()) !== -1) { //hmm, neither of these like having "["searched
          result = true;
        }
        if (result) {
          result = false;
          let now = new Date().getTime();
          if (this.selectedStatus === "active") {
            if (auction.startDateTime < now && auction.endDateTime > now) {
              result = true;
            }
          } else if (this.selectedStatus === "upcoming") {
            if (auction.startDateTime > now) {
              result = true;
            }
          } else if (this.selectedStatus === "won") {
            if (auction.endDateTime < now && auction.currentBid >= auction.reservePrice) {
              result = true;
            }
          } else if (this.selectedStatus === "expired") {
            if ((auction.endDateTime < now)) {
              result = true;
            }
          } else { // if (this.selectedMessage == "any") {
            result = true;
          }
  
          if (result && !(document.getElementById("auctions_any").checked)) { //check all the checkboxes
            
            if (document.getElementById("auctions_myWins").checked) {
              result = false;
              for (let i = 0; i < this.wonAuctions.length; i++) {
                if (auction.id === wonAuctions[i].id) {
                  result = true;
                }
              }
            }
  
             else if (document.getElementById("auctions_myBids").checked) {
                result = false;
              for (let i = 0; i < this.biddedAuctions.length; i++) {
                if (auction.id === this.biddedAuctions[i].id) {
                  result = true;
                }
              }
              
            }
            
            if (document.getElementById("auctions_ownerActive").checked) {
              result = false;
              for (let i = 0; i < this.ownedAuctions.length; i++) {
                if (auction.id === this.ownedAuctions[i].id && auction.endDateTime > now) {
                  result = true;
                }
              }
            }
            
            if (document.getElementById("auctions_ownerSuccess").checked) {
              result = false;
              for (let i = 0; i < this.ownedAuctions.length; i++) {
                if (auction.id === this.ownedAuctions[i].id && auction.endDateTime < now && auction.reservePrice <= auction.currentBid) {
                  result = true;
                }
              }
            }
            
            if (document.getElementById("auctions_ownerFailure").checked) {
              result = false;
              for (let i = 0; i < this.ownedAuctions.length; i++) {
                if (auction.id === this.ownedAuctions[i].id && auction.endDateTime < now && auction.reservePrice > auction.currentBid) {
                  result = true;
                }
              }
            }
          }
        }
        
        return result;
      },
  
      getBidAuctions: function() {
        this.loggedStatus = sessionStorage.getItem("auth_token");
        if (String(sessionStorage.getItem("auth_token")).length > 5) {
          this.responseStatus = "Hello";
          this.$http.get(address + "/auctions?bidder=" + sessionStorage.getItem("logged_id"), {
            headers: {
              "X-Authorization": sessionStorage.getItem("auth_token"),
              "Content-Type": "application/json"
            }
          })
            .then(function (response) {
              this.responseStatus = response;
              this.biddedAuctions = response.body;
          
            }, function (error) {
              this.error = error;
              this.errorFlag = true;
            });
        }
      },
      
      getWonAuctions: function() {
        
        if (String(sessionStorage.getItem("auth_token")).length > 5) {
          this.$http.get(address + "/my_won_auctions/", {
            headers: {
              "X-Authorization": sessionStorage.getItem("auth_token"),
              "Content-Type": "application/json"
            }
          })
            .then(function (response) {
              this.wonAuctions = response.body;
            }, function (error) {
              this.error = error;
              this.errorFlag = true;
            });
        }
      },
      
      getOwnedAuctions: function() {
        if (String(sessionStorage.getItem("auth_token")).length > 5) {
          this.$http.get(address + "/auctions?seller=" + sessionStorage.getItem("logged_id"), {
            headers: {
              "X-Authorization": sessionStorage.getItem("auth_token"),
              "Content-Type": "application/json"
            }
          })
            .then(function (response) {
              this.ownedAuctions = response.body;
            }, function (error) {
              this.error = error;
              this.errorFlag = true;
            });
        }
      },
  
      getAuctionPhoto: function(id) {
        return (address + "/auctions/" + id + "/photos");
      }
      
      
    }
    
  }
</script>

<style scoped>
  #selectedStatus {
    width: 82px;
  }

  #auctions_searchBar {
    font-size: 24px;
  }
  
  #auctions_pageTitle {
    color: green;
    text-align: center;
    font-weight: bold;
    font-size: 72px;
    padding-top: 48px;
    padding-bottom: 24px;
  }

  .auctions_buttonsOther {
    color: white;
    background-color:darkgreen;
    border-color:green;
    position: absolute;
    width: 120px;
    top: 18px;
  }
  
  .auctions_centered {
    text-align: center
  }
  
  
  /*.navbar a:hover, .dropdown:hover .dropbtn {*/
    /*background-color: red;*/
  /*}*/
  
  /*!* Dropdown content (hidden by default) *!*/
  /*.dropdown-content {*/
    /*display: none;*/
    /*position: absolute;*/
    /*background-color: #f9f9f9;*/
    /*min-width: 160px;*/
    /*box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);*/
    /*z-index: 1;*/
  /*}*/
  
  /*!* Links inside the dropdown *!*/
  /*.dropdown-content a {*/
    /*float: none;*/
    /*color: black;*/
    /*padding: 12px 16px;*/
    /*text-decoration: none;*/
    /*display: block;*/
    /*text-align: center;*/
  /*}*/
  
  /*!* Add a grey background color to dropdown links on hover *!*/
  /*.dropdown-content a:hover {*/
    /*background-color: #ddd;*/
  /*}*/
  
  /*!* Show the dropdown menu on hover *!*/
  /*.dropdown:hover .dropdown-content {*/
    /*display: block;*/
    /*margin: 0 auto;*/
    /*padding: 40px;*/
  /*}*/
</style>
