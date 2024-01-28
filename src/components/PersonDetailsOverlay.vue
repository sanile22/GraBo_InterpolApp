<template>
  <div class="person-details-overlay">
    
    <div v-if="personDetails">
       <!-- Der Button zum schließen -->
      <button class="close-button" @click="closeOverlay">
        &#10006;
      </button>
  
      <div class="person-thumbnail">
        <img v-if="personDetails.thumbnail" :src="personDetails.thumbnail" alt="Person Thumbnail" />  <!-- v-if directive (von vue)-->
      </div>
 <!-- alles was im Overlay angezeigt werden soll-->
      <div><strong>Name:</strong> {{ personDetails.forename }} {{ personDetails.name }}</div> <!-- Dies ist ein Vue.js-Ausdruck rendert forename-Attributs aus dem Objekt personDetails rendert.-->
      <div><strong>Geburtsdatum:</strong> {{ personDetails.date_of_birth }}</div>
      <div><strong>Nationalitäten:</strong> {{ personDetails.nationalities }}</div>
      <div><strong>ID:</strong> {{ personDetails.entity_id }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    personDetails: Object, 
  },
  methods: {
    closeOverlay() {
      console.log('closeOverlay called');
      this.$emit('close-overlay');
    },
  },
};
</script>


<style scoped>
.person-details-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7); 
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.close-button {
  position: absolute;
  top: 100px;
  right: 100px;
  font-size: 50px;
  cursor: pointer; 
}

.person-thumbnail {
  margin-right: 20px;
}

.person-thumbnail img {
  width: 300px;
  max-height: auto;
}

.person-details {
  flex: 1;
}
</style>
