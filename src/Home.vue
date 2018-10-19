<template>
  <div> <!--style="background-color:lightseagreen; max-height:2000px; overflow:hidden; position:absolute; top:0;">-->
    
  
    <div style="position: absolute; right: 120px; top: 20px; color:darkgreen">
      {{ loginStatus }}
    </div>
    
    <button id="loginButtonHome" type="button" class="home_buttonsOther"  style="top: 15px;" data-toggle="modal" data-target="#loginModal" v-on:click="clearFields()">
     Log in
    </button>
    
    <button id="logoutButtonHome" type="button" class="home_buttonsOther" style="top: 50px;" disabled v-on:click="logoutUser()">
      Log out
    </button>
  
  
    <h1 id="home_pageTitle">Deals from The Swamp</h1>
    
    <div class ="home_buttonsMainDiv">
      <button id="signupButtonHome" type="button" data-toggle="modal" class="home_buttonsMain" data-target="#signUpModal" v-on:click="resetSignUpModal()">
        Sign up
      </button>
    </div>
  
    <div class="home_buttonsMainDiv">
      <router-link :to="{ path: 'auctions'}" tag="button" class="home_buttonsMain">Auctions</router-link>
    </div>
  
    <div style="position:absolute; right:0; bottom:0;"><label style="color:whitesmoke">/auction/other</label></div>
  
    <div class="modal fade" id="signUpModal" tabindex="1" role="dialog" aria-labelledby="signUpModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <h5 class="modal-title" id="signUpModalLabel">Sign up</h5>
          </div>
          
          <div class="modal-body">
            <div>
              <form id="firstnameField">
                <label class="home_inputLabel">First Name:</label>
                <input v-model="firstname" class="home_inputGeneric" />
              </form>
            </div>
            <div>
              <form id="lastnameField">
                <label class="home_inputLabel">Last Name:</label>
                <input v-model="lastname" class="home_inputGeneric"/>
              </form>
            </div>
            <div>
              <form id="usernameField">
                <label class="home_inputLabel">Username:</label>
                <input v-model="username" class="home_inputGeneric"/>
              </form>
            </div>
            <div>
              <form id="emailField">
                <label class="home_inputLabel">Email:</label>
                <input v-model="email" type="email" class="home_inputGeneric"/>
              </form>
            </div>
            <div>
              <form id="passwordField">
                  <label class="home_inputLabel">Password:</label>
                <input v-model="password" type="password" class="home_inputGeneric"/>
              </form>
            </div>
            <br/>
            <p>
              <span style="color:red">{{ creationMessage }}</span>
            </p>
            <button id="createButton" type="button" class="home_buttonGeneric" style="position: absolute; right: 15px; bottom: 15px" v-on:click="createUser()">
              Create account
            </button>
          </div>
          <div class="modal-footer">
            <button id="doneButton" type="button" class="home_buttonGeneric" data-dismiss="modal" style="float: right" disabled v-on:click="clearFields()">
              Done
            </button>
            <button type="button" class="home_buttonGeneric" data-dismiss="modal" style="float: left; background-color:darkseagreen; border-color:darkseagreen" v-on:click="clearFields()">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!--########################################################################################################################################################-->
    <div class="modal fade" id="loginModal" tabindex="1" role="dialog" aria-labelledby="loginModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
        
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <h5 class="modal-title" id="loginModalLabel">Sign up</h5>
          </div>
        
          <div class="modal-body">
            <div>
              <form id="credentialsField">
                <label style="width: 140px;">Username or email:</label>
                <input v-model="credentials" class="home_inputGeneric"/>
              </form>
            </div>
            
            <div>
              <form id="passwordFieldLogin">
                  <label style="width: 140px;">Password: </label>
                  <input v-model="password" type="password" class="home_inputGeneric"/>
              </form>
            </div>
            <br/>
              <span style="color:red">{{ loginMessage }}</span>
            <br/>
          </div>
          <div class="modal-footer">
            <button id="LoginButtonModal" type="button" class="home_buttonGeneric" data-dismiss="modal" style="float: right" v-on:click="loginUser()">
              Login
            </button>
            <button type="button" class="home_buttonGeneric" data-dismiss="modal" style="float: left" v-on:click="clearFields()">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
    
    
    <!--<div style="position:absolute; left:0; bottom:0; padding:2px">-->
      <!--<router-link :to="{ name: 'status'}" tag="button" style="background-color:black; border-color:darkslategray; color:limegreen;">Admin</router-link>-->
    <!--</div>-->
  
    <div class="home_buttonsMainDiv">
      <router-link :to="{ path: getUserPath()}" tag="button" class="home_buttonsOther" style="top: 85px;">Profile</router-link>
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
        user_id: "",
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        password: "",
        creationMessage: "",
        loginStatus: "Not logged in",
        credentials: "",
        loginMessage: "",
        token: sessionStorage.getItem("auth_token")
      }
    },
    
    mounted: function() {
      this.checkLogin();
    },
    
    methods: {
      createUser: function () {
        //document.getElementBiId("createButton").disabled = disabled;
        let responseData = null;
        let valid1 = true;
        if (this.username === ("") || this.firstname === ("") || this.lastname === ("") || this.email === ("") || this.password === ("")) {
          valid1 = false;
        }
        if (valid1) {
  
          this.$http.post(address + "/users", JSON.stringify({
            "username": this.username,
            "familyName": this.lastname,
            "givenName": this.firstname,
            "email": this.email,
            "password": this.password
          }))
            .then(function (response) {
              responseData = response;
              this.creationMessage = "Hello?";
              console.log(responseData);
              if (responseData != null) {
                if (responseData.ok) {
                  this.creationMessage = "Account created!";
                  document.getElementById("createButton").disabled = true;
                  document.getElementById("doneButton").disabled = false;
                  this.credentials = this.username;
                  this.loginUser();
                  this.loginStatus = "Logged in as ";
                }
              }
            }, function (error) {
              this.creationMessage = error;
              if (error.body == 'Malformed request'){
                  this.creationMessage = "Email is invalid";
              } else if (error.status == 400) {
                this.creationMessage = "That username or email is already taken";
              } else {
                this.creationMessage = "Something went wrong with the server";
              }
              this.error = error;
              this.errorFlag = true;
            });
        } else {
          this.creationMessage = "Please fill in all the fields";
        }
      },
      
      loginUser: function () {
        if (this.credentials === "" || this.password === "") {
          this.loginMessage = "Please fill in both fields"
        } else {
          this.$http.post(address + "/users/login", JSON.stringify({
            "username": this.credentials,
            "email": this.credentials,
            "password": this.password
          }))
            .then(function (response) {
              this.user_id = response.body.id;
              sessionStorage.logged_id = response.body.id;
              sessionStorage.auth_token = response.body.token;
              this.token = response.body.token;
              this.checkLogin();
            }, function (error) {
              this.loginStatus = "That username/email and password combination was incorrect";
              this.error = error;
              this.errorFlag = true;
          });
        }
      },
      
      logoutUser: function () {
        this.$http.post(address + "/users/logout", null, {
          headers: {
            "X-Authorization": sessionStorage.getItem("auth_token"),
            "Content-Type": "application/json"
          }
        })
          .then(function (response) {
              this.loginStatus = response;
              this.checkLogin();
          });
        sessionStorage.clear();
        this.checkLogin();
      },
      
      checkLogin: function () {
        //this.loginStatus = "token goes here (_" + sessionStorage.getItem("auth_token") + "_)";
        //this.loginStatus = String(sessionStorage.getItem("auth_token")).length;
        if (String(sessionStorage.getItem("auth_token")).length < 5) {
          this.user_id = "";
          this.loginStatus = "Not logged in";
          document.getElementById("loginButtonHome").disabled = false;
          document.getElementById("logoutButtonHome").disabled = true;
          document.getElementById("signupButtonHome").disabled = false;
        } else {
          this.loginStatus = "Currently logged in as user " + sessionStorage.getItem("logged_id");
          document.getElementById("loginButtonHome").disabled = true;
          document.getElementById("logoutButtonHome").disabled = false;
          document.getElementById("signupButtonHome").disabled = true;
        }
      },
  
      /**
       * Clears the password variable. Otherwise it carries over if login or create user is canceled
       */
      clearFields: function() {
        this.username = "";
        this.firstname = "";
        this.lastname = "";
        this.email = "";
        this.password = "";
        this.credentials = "";
      },
      
      resetSignUpModal: function() {
        this.creationMessage = "";
        document.getElementById("createButton").disabled = false;
        document.getElementById("doneButton").disabled = true;
        this.clearFields();
      },
      
      getUserPath: function() {
        return "user/" + sessionStorage.getItem("logged_id");
      }
      
    }
  }
</script>

<style scoped>

  #home_pageTitle {
    color: green;
    text-align: center;
    font-weight: bold;
    font-size: 72px;
    padding: 48px;
    padding-top: 96px
  }
  
  .home_buttonsMain {
    font-size: 36px;
    width: 250px;
    color: white;
    background-color:darkgreen;
    border-color:green;
    /*position: absolute; right: 15px; top: 85px"*/
  }

  .home_buttonsMainDiv {
    text-align: center;
    padding: 10px;
    /*position: absolute; right: 15px; top: 85px"*/
  }
  
  .home_buttonsOther {
    color: white;
    background-color:darkgreen;
    border-color:green;
    position: absolute;
    right: 15px;
    width: 72px
  }
  
  .home_buttonGeneric {
    color: white;
    background-color: darkgreen;
    border-color: green;
  }
  
  .disabled { /*Use this if get round to it*/
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .home_inputGeneric {
    border-color: darkseagreen;
    border-width: thin;
  }
  
  .home_inputLabel {
    width: 90px;
  }
  
  
</style>
