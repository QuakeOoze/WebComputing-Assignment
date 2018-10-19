<!--- Top --->

<template>
    <div>
      <h2>
        Server status: {{ status }}
      </h2>

      <br /><br />
    
      <div>
        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#resetDBModal">
          Reset Database
        </button>
      </div>
      <div>
        Last result: {{ resultReset }}
      </div>
  
      <br /><br />
    
      <div>
        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#resampleDBModal">
          Resample Database
        </button>
      </div>
      
      <div>
        Last result: {{ resultResample }}
      </div>
  
      <div class="modal fade" id="resetDBModal" tabindex="2" role="dialog" aria-labelledby="resetDBModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
              <h5 class="modal-title" id="resetDBModalLabel">Reset Database</h5>
            </div>
            <div class="modal-body">
              Are you sure that you want to reset the database?
              <button type="button" class="btn btn-secondary" data-dismiss="modal" style="position: absolute; right: 15px; bottom: 8px" v-on:click="postReset()">
                RESET
              </button>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" data-dismiss="modal">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <div class="modal fade" id="resampleDBModal" tabindex="2" role="dialog" aria-labelledby="resampleDBModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
              <h5 class="modal-title" id="resampleDBModalLabel">Reset Database</h5>
            </div>
            <div class="modal-body">
              Are you sure that you want to reset the database?
              <button type="button" class="btn btn-secondary" data-dismiss="modal" style="position: absolute; right: 15px; bottom: 8px" v-on:click="postResample()">
                RESAMPLE
              </button>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" data-dismiss="modal">
                Cancel
              </button>
            </div>
          </div>
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
        status: "",
        resultReset: "",
        resultResample: ""
        
      }
    },
    mounted: function () {
      this.getStatus();
    },
    methods: {
      getStatus: function () {
        this.$http.get(address + '/status', null, {headers: {"X-Authorization": sessionStorage.getItem("auth_token")}})
          .then(function (response) {
            this.status = response.body.msg;
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },
      
      postReset: function() {
        this.resultReset = "...";
        this.$http.post(address + '/reset')
          .then(function (response) {
            this.resultReset = response.body;
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },
  
      postResample: function() {
        this.resultResample = "...";
        this.$http.post(address + '/resample')
          .then(function (response) {
            this.resultResample = response.body;
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },
    }
  }
</script>
