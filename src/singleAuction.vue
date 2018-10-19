<template>
  <div style="text-align: center; margin-left: calc(100vw - 100%)">
  
    <div v-if="isEditable()">
      
      <h2>
        <button id="editAuction_editButton" v-on:click="editAuction(true, false)" class="singleAuction_buttonGeneric">
          Edit
        </button>
        <button id="editAuction_saveButton" disabled v-on:click="editAuction(false, true)" class="singleAuction_buttonGeneric">
          Save
        </button>
        <button id="editAuction_cancelButton" disabled v-on:click="editAuction(false, false)" class="singleAuction_buttonGeneric">
          Cancel
        </button>
      </h2>
      <h2>
        <form>
          <input id="editAuction_titleField" v-model="title" disabled class="singleAuction_inputGeneric"/>
        </form>
      </h2>
      
  
  
      <div>
        <img id="auction_photo" :src=getAuctionPhoto($route.params.id) alt=$route.params.id height="512" width="512"/>
      </div>
      <div>
        <button v-on:click='deleteAuctionPhoto()' class="singleAuction_buttonGeneric" style="position:relative; right:207px">
          Delete Photo
        </button>
      </div>
      
      <br/>
      
      <div id="singleAuction_photoPicker">
        <div >
          <input type="file" @change="onFileChanged" style="margin: auto"/>
        </div>
        <button @click="onUpload" style="position:relative; left:-100px">Upload!</button>
        <!--<img id="singleAuction_photo" :src="selectedFile" alt="Swamp"/>-->
      </div>
      <br/>
      <div>
        <label>Description:</label>
        <form>
          <textarea id="editAuction_descriptionField" v-model="description" cols="30" rows="3" disabled class="singleAuction_inputGeneric"></textarea>
        </form>
      </div>
      
      <br/>
      
      <div>
        <label>Seller:</label> {{ seller.username }}
      </div>
      <p>
        <label>Auction Id:</label> {{ auction_id }}
      </p>
      <div>
        <form>
          <label>Start date:</label> {{ (new Date(startDate)).toLocaleString() }}
          <input id="editAuction_startDatePicker" v-model="startDateFormatted" type="datetime-local" disabled :min='getMinDate()' class="singleAuction_inputGeneric" />
        </form>
      </div>
      
      <div>
        <form>
          <label>End date:</label> {{ (new Date(endDate)).toLocaleString() }}
          <input id="editAuction_endDatePicker" v-model="endDateFormatted" type="datetime-local" disabled class="singleAuction_inputGeneric" style="position:relative; left:3px; width:200px"/>
        </form>
      </div>
  
      <form style="position:relative; left:41px">
        <label>Reserve price:</label>
        <input id="editAuction_reservePriceField" v-model="reservePrice" disabled type="number" class="singleAuction_inputGeneric"/>
      </form>

      <details>
    
        <summary><u><span style="color:blue">Bid history</span></u></summary>
    
        <div>
          <table>
            <tr v-for="bid in bidHistory">
              <!--<td><router-link :to="{ name: 'auction', params: { id: auction.id }}">{{ auction.title }}</router-link></td>-->
              <td><b>{{ bid.buyerUsername }}</b> bid <b>{{ bid.amount }}</b> at <b>{{ new Date(bid.datetime).toLocaleString() }}</b> </td>
            </tr>
          </table>
        </div>
      </details>
    </div>
    
    <div v-else>
      
      <h2 style="color:green">{{ title }}</h2>
  
      <div>
        <img id="auction_photo2" :src=getAuctionPhoto($route.params.id) alt=$route.params.id height="512" width="512"/>
      </div>
      
      <div>
        <label>Description:</label> {{ description }}
      </div>
      <div>
        <!--{{ seller.username }}-->
        <div class="home_buttonsMainDiv">
          <label>Seller:</label>
          <router-link :to="{ name: 'user', params: { id: seller.id }}" style="color:darkgreen">{{ seller.username }}</router-link>
      </div>
      </div>
      <p>
        <label>Auction Id:</label> {{ auction_id }}
      </p>
      <div>
        <label>Start time:</label> {{ (new Date(startDate)).toLocaleString() }}
      </div>
      <p>
        <label>End time:</label> {{ (new Date(endDate)).toLocaleString() }}
      </p>
      <div>
        <label>Reserve Price:</label> {{ reservePrice }}
      </div>
      <p>
        <label>Starting Price:</label> {{ startingBid }}
      </p>
      
      <div v-if="isBiddable()">
      <p>
        <label>Current bid:</label> {{ currentBid }}
        {{ closed }}
        <button id="bidButton" type="button" class="singleAuction_buttonGeneric" data-toggle="modal" data-target="#placeBidModal" v-on:click="resetPlaceBidModal()">
          Place a bid
        </button>
      </p>
      </div>
      <details>
        
        <summary><u><span style="color:darkgreen">Bid history</span></u></summary>
        
        <div>
          <table style="margin: auto">
            <tr v-for="bid in bidHistory">
              <!--<td><router-link :to="{ name: 'auction', params: { id: auction.id }}">{{ auction.title }}</router-link></td>-->
              <td><b>{{ bid.buyerUsername }}</b> bid <b>{{ bid.amount }}</b> at <b>{{ (new Date(bid.datetime)).toLocaleString() }}</b> </td>
            </tr>
          </table>
        </div>
      </details>
      
      
      <div class="modal fade" id="placeBidModal" tabindex="2" role="dialog" aria-labelledby="placeBidModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
              </button>
              <h5 class="modal-title" id="placeBidModalLabel">Place bid</h5>
    
              <div class="modal-body">
                <div>
                  <form id="credentialsField">
                    Bid amount:
                    <input v-model="bidAmount" type="number" placeholder="0" class="singleAuction_inputGeneric"/>
                  </form>
                </div>
                
                <p>
                  <span style="color:red">{{ bidMessage }}</span>
                </p>
              </div>
              
              <div class="modal-footer">
                <button id="placeBidButton" type="button" class="singleAuction_buttonGeneric" style="float: right" v-on:click="postBid($route.params.id)">
                  Place bid
                </button>
                <button type="button" class="singleAuction_buttonGeneric" data-dismiss="modal" style="float: left; background-color:darkseagreen; border-color:darkseagreen">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div>
      <router-link :to="{ name: 'createAuction'}" tag="button" class="singleAuction_buttonGeneric singleAuction_createAuction">Create Auction</router-link>
    </div>
  
    <div>
      <router-link :to="{ name: 'auctions'}" tag="button" class="singleAuction_buttonGeneric" style="position: absolute; width: 120px; top: 18px; left: 15px;">Auctions</router-link>
    </div>
    
    <br />
    
  </div>
</template>


<script>
  let address = 'http://localhost:4941/api/v1';
  let editable = false;
  
  export default {
    //name: "single-auction" Don't know if needed
    data() {
      return {
        title: "",
        seller: "",
        startDate: 0,
        endDate: 0,
        description: "",
        reservePrice: 0,
        startingBid: 0,
        currentBid: "",
        bidHistory: [],
        primaryphotoURI: "",
        auction_id: "",
        bidAmount: "",
        bidMessage: "",
        updateMessage: "",
        selectedFile: null,
        closed: "",
        startDateFormatted: 0,
        endDateFormatted: 0
      }
    },
    template: '<div>{{ seller }}</div>',
  
    mounted: function () {
      this.getSingleAuction(this.$route.params.id);
    },
  
    methods: {
      getSingleAuction: function (auction_id) {
        this.$http.get(address + "/auctions/" + auction_id)
          .then(function (response) {
            this.editable = true;
            this.auction_id = auction_id;
            this.title = response.body.title;
            this.seller = response.body.seller;
            this.startDate = response.body.startDateTime;
            this.startDateFormatted = (new Date(this.startDate + 12*60*60*1000).toISOString()).slice(0, -1);
            this.endDate = response.body.endDateTime;
            this.endDateFormatted = (new Date(this.endDate + 12*60*60*1000).toISOString()).slice(0, -1);
            this.description = response.body.description;
            this.reservePrice = response.body.reservePrice;
            this.startingBid = response.body.startingBid;
            this.currentBid = response.body.currentBid;
            this.bidHistory = response.body.bids.reverse();
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },
  
      postBid: function (auction_id) {
        if (this.bidAmount <= this.currentBid) {
          this.bidMessage = "You must bid higher than the current bid (" + this.currentBid + ")";
        } else {
          console.log(sessionStorage.getItem("auth_token"));
          this.$http.post(address + "/auctions/" + auction_id + "/bids?amount=" + Number(this.bidAmount), null,
            {
              headers: {
                "X-Authorization": sessionStorage.getItem("auth_token"),
                "Content-Type": "application/json"
              }
            })
            .then(function (response) {
              if (response.ok) {
                this.bidMessage = "Bid successfully placed!";
                document.getElementById("placeBidButton").disabled = true;
                //this.currentBid = this.bidAmount;
                this.getSingleAuction(this.$route.params.id)
              }
            }, function (error) {
              this.error = (error);
              this.errorFlag = true;
              this.bidMessage = "Your must bid higher than the Current Bid (or Starting Price, whichever is greater)";
            });
        }
      },
  
      isEditable: function () {
        //console.log("Resp id: " + this.seller.id);
        //console.log("Sesh id: " + sessionStorage.getItem("logged_id"));
        return (this.seller.id == sessionStorage.getItem("logged_id") && this.startDate > (new Date().getTime() + 12*60*60*1000)); // I need type coercion here
      },
  
      isValidated: function() {
        return String(sessionStorage.getItem("auth_token")).length > 5;
      },
  
      returnEditable: function () {
        return this.editable;
      },
  
      editAuction: function (editable, patch) {
        if (editable) {
          document.getElementById("editAuction_editButton").disabled = true;
          document.getElementById("editAuction_saveButton").disabled = false;
          document.getElementById("editAuction_cancelButton").disabled = false;
          
          document.getElementById("editAuction_titleField").disabled = false;
          document.getElementById("editAuction_descriptionField").disabled = false;
          document.getElementById("editAuction_startDatePicker").disabled = false;
          document.getElementById("editAuction_endDatePicker").disabled = false;
          document.getElementById("editAuction_reservePriceField").disabled = false;
        } else {
          document.getElementById("editAuction_editButton").disabled = false;
          document.getElementById("editAuction_saveButton").disabled = true;
          document.getElementById("editAuction_cancelButton").disabled = true;
          
          document.getElementById("editAuction_titleField").disabled = true;
          document.getElementById("editAuction_descriptionField").disabled = true;
          document.getElementById("editAuction_startDatePicker").disabled = true;
          document.getElementById("editAuction_endDatePicker").disabled = true;
          document.getElementById("editAuction_reservePriceField").disabled = true;
          
        }
        if (patch) {
          this.patchAuction();
        }
        
        
      },
  
      patchAuction: function () {
        this.$http.patch(address + "/auctions/" + this.auction_id, JSON.stringify({
            "title": this.title,
            "description": this.description,
            "startDateTime": new Date(this.startDateFormatted).getTime(),
            "endDateTime": new Date(this.endDate).getTime(),
            "reservePrice": Number(this.reservePrice)
          }),
          {
            headers: {
              "X-Authorization": sessionStorage.getItem("auth_token"),
              "Content-Type": "application/json"
            },
          })
          .then(function (response) {
            if (response.ok) {
              this.updateMessage = "Updates successfully applied";
            }
          }, function (error) {
            this.error = (error);
            this.errorFlag = true;
            this.updateMessage = error;
          });
      },
  
      //#############################################################################################################
      onFileChanged(event) {
        this.selectedFile = event.target.files[0];
      },
      onUpload() {
        //upload file, get it from this.selectedFile
        this.$http.post(address + "/auctions/" + this.$route.params.id + "/photos",
          this.selectedFile,
          {
            headers: {
              "X-Authorization": sessionStorage.getItem("auth_token"),
              "Content-Type": this.selectedFile.type
            }
          }).then(response => {
          location.reload();
            console.log("success");
          this.photoMessage = "success";
        }, response => {
          //error callback
          console.log("error");
          this.photoMessage = "error";
        });
      },
  
      //###############################################################################################################
      getAuctionPhoto: function (id) {
        return (address + "/auctions/" + id + "/photos");
      },
  
      deleteAuctionPhoto: function () {
        this.$http.delete(address + "/auctions/" + this.$route.params.id + "/photos",
          {
            headers: {
              "X-Authorization": sessionStorage.getItem("auth_token"),
              "Content-Type": "image/*"
            }
          }).then(response => {
          location.reload();
          console.log("success");
        }, response => {
          //error callback
          console.log("error");
        });
      },
  
      resetPlaceBidModal: function () {
        this.bidAmount = "";
        this.bidMessage = "";
        document.getElementById("placeBidButton").disabled = false;
      },
    
      isBiddable: function() {
        return (new Date().getTime() < this.endDate) && this.isValidated()
      },
  
      addHours: Date.prototype.addHours = function(h) {
      this.setTime(this.getTime() + (h*60*60*1000));
      return this;
      },
      
      getMinDate: function() {
        let now = new Date().getTime();
        now += 12 * 60 * 60 * 1000;
        let nowShift = new Date(now).toISOString().slice(0, -8);
        return nowShift;
      },
      
    }
  }
  
</script>


<style scoped>
  
  .singleAuction_buttonGeneric {
    color: white;
    background-color: darkgreen;
    border-color: green;
  }

  .singleAuction_createAuction {
    position: absolute;
    right: 15px;
    width: 120px;
    top: 18px;
  }
  
  .singleAuction_inputGeneric {
    border-color: green;
  }

</style>
