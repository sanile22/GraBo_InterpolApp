<template>
 
  <div class="person-box">
    <div v-if="result"> 
      <div @click="showPersonDetails(result)"> <!-- Klick auf person-box löst die Methode showPersonDetails(result) -->
      <div class="person-header">
        <img v-if="result.thumbnail" :src="result.thumbnail" alt="Person Thumbnail" /> 
        <div>
          {{ result.forename }} {{ result.name }}
        </div>
      </div>
    </div>
  </div>
    <PersonDetailsOverlay class="person-details-overlay" v-if="selectedPersonDetails" :personDetails="selectedPersonDetails" @close-overlay="closeOverlay"/>
 </div>
</template>

<script>
import PersonDetailsOverlay from './PersonDetailsOverlay.vue'; 

export default {
  props: {
    result: Object, //gibt result mit
  },
  components: {
    PersonDetailsOverlay,
  },
  data() {
    return {
      selectedPersonDetails: null, 
    };
  },
  methods: {
    async showPersonDetails(person) {
      this.selectedPersonDetails = {
        forename: person.forename,
        name: person.name,
        thumbnail: person.thumbnail,
        date_of_birth: person.date_of_birth, 
        nationalities: person.nationalities, 
        entity_id: person.entity_id
      };
    },
    closeOverlay() {
      console.log("Trying to close overlay"); 
    if (this.selectedPersonDetails !== null) {
      this.selectedPersonDetails = null;
      console.log("Overlay closed");
    }
  },
  },
};
</script>

<style scoped>
.person-box {
  background-color: #0d3153;
  color: #ffff; 
  border: 4px solid #13b1cd;
  border-radius: 15px;
  padding: 10px;
  margin: 10px;
  overflow: hidden; 
  cursor: pointer; 
}

.person-header {
  display: flex;
  align-items: center;
}

.person-header img {
  border-radius: 50%;
  margin-right: 10px;
  width: 50px;
  height: 50px;
}

.person-details-overlay{
  background-color:rgba(0,0,0,0.8);
  font-size: xx-large;
  font-family:Bebas Neue;

}

</style>


