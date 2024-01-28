<template>


  <div id="app"> 
    <SearchForm @resultsUpdated="updateResults" @calculate-total-pages="updateTotalPages"/>
    </div>
</template>

<script>
import SearchForm from './components/SearchForm.vue';

export default {
  components: { 
    SearchForm 
  },
  methods: {
    updateResults(newResults) { 
      this.results = newResults;
    },
    updateTotalPages({ total, resultPerPage }) {
      this.totalPages = Math.ceil(total / resultPerPage);
    },
    async loadNextPage() { 
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      await this.fetchResults();
    }
  },
    async loadPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      await this.fetchResults();
    }
  },
    async fetchResults() { 
  try {
  
    const searchParams = this.$children[0].searchParams;

   
    const response = await this.$axios.get('https://ws-public.interpol.int/notices/v1/yellow', {
      params: {
        page: this.currentPage,
        ...searchParams,
      },
    });

    console.log('API-Antwort:', response.data);
    this.results = response.data._embedded.notices; 

    
    this.$children[0].$emit('resultsUpdated', this.results);

  } catch (error) {
    console.error('Fehler beim Abrufen der Daten:', error);
    console.error('Fehlerdetails:', error.response);
  }
},
  },
};
</script>
<style>


body::before {
  content: "";
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: -1;
}

body {
  font-family: 'Arial', sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background: url('./assets/cyber-4084714-1068x712.jpg') no-repeat center center fixed;
  background-size: cover;
}

#app {
  display: flex;
  align-self: center;
  flex-direction: column;
  min-height: 100vh;
  min-width: 60vw;
}

</style>