<template>
  <div style="text-align:center">
    <div v-if="user_isEditable()">
      {{ message }}
      <h2>
        <button v-on:click="editUser(true)" class="user_buttonGeneric">
          Edit
        </button>
        <button v-on:click="editUser(false)" class="user_buttonGeneric">
          Save
        </button>
      </h2>
      <div>
        <div>
          <label>Username:</label>
          {{ username }}
        </div>
        <form>
          <label>First Name:</label>
          <input id="editUser_firstnameField" v-model="firstname" disabled class="user_genericInput"/>
        </form>
        <form>
          <label>Last Name:</label>
          <input id="editUser_lastnameField" v-model="lastname" disabled class="user_genericInput"/>
        </form>
       <div>
         <label>Email:</label>
         {{ email }}
       </div>
        <div>
          <label>Account balance:</label>
          {{ accountBalance }}
        </div>
      </div>
      
    </div>
    <div v-else style="padding-top:40px">
      <div>
        <label>Username:</label>
        {{ username }}
      </div>
      <div>
        <label>First name:</label>
        {{ firstname }}
      </div>
      <div>
        <label>Last name:</label>
        {{ lastname }}
      </div>
    </div>
    
    <div>
      <router-link :to="{ path: '/'}" tag="button" class="user_buttonGeneric" style="position: absolute; width: 120px; top: 18px; left: 15px;">Home</router-link>
    </div>
    
  </div>
</template>


<script>
  let address = 'http://localhost:4941/api/v1';
  
  export default {
    //name: "single-auction" Don't know if needed
    data() {
      return {
        username: "",
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        accountBalance: null,
        message: ""
      }
    },
    
    mounted: function() {
      this.getSingleUser(this.$route.params.id);
    },
    
    methods: {
      getSingleUser: function () {
        this.$http.get(address + "/users/" + this.$route.params.id, {
          headers: {
            "X-Authorization": sessionStorage.getItem("auth_token"),
            "Content-Type": "application/json"
          }})
          .then(function (response) {
            this.editable = true;
            this.username = response.body.username;
            this.firstname = response.body.givenName;
            this.lastname = response.body.familyName;
            this.email = response.body.email;
            this.accountBalance = response.body.accountBalance;
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },
      
      user_isEditable: function () {
        //console.log("Resp id: " + this.seller.id);
        //console.log("Sesh id: " + sessionStorage.getItem("logged_id"));
        return (this.accountBalance != null);
      },
      
      editUser: function (editable) {
        if (editable) {
          // document.getElementById("editUser_usernameField").disabled = false;
          document.getElementById("editUser_firstnameField").disabled = false;
          document.getElementById("editUser_lastnameField").disabled = false;
          // document.getElementById("editUser_emailField").disabled = false;
          // document.getElementById("editUser_passwordField").disabled = false;
        } else {
          // document.getElementById("editUser_usernameField").disabled = true;
          document.getElementById("editUser_firstnameField").disabled = true;
          document.getElementById("editUser_lastnameField").disabled = true;
          // document.getElementById("editUser_emailField").disabled = true;
          // document.getElementById("editUser_passwordField").disabled = true;
          let request = {
           // "username": this.username,
            "givenName": this.firstname,
            "familyName": this.lastname,
          //   "email": this.email,
          // };
          // if (this.password !== "") {
          //   request["password"] = this.password;
          };
          
          this.patchUser(request);
        }
      },
      
      patchUser: function (request) {
        this.$http.patch(address + "/users/" + this.$route.params.id, JSON.stringify(request),
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
        
      }
    }
    
    
  }

</script>


<style scoped>
  
  .user_buttonGeneric {
    color: white;
    background-color: darkgreen;
    border-color: green;
  }

  .user_genericInput {
    border-color: darkseagreen;
    width: 200px;
  }
  
</style>
