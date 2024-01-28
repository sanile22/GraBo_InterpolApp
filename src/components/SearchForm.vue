<template>
 
    <h1 class="page-title">Interpol Search</h1>
   
    <div class="description">
    <h3>Yellow notices sind Interpol-Meldungen, die vermisste Personen zeigen.</h3>
  <div>
     <!-- Ein Formular zur Eingabe von Suchparametern mit einem 
      Event-Listener (@submit.prevent) für das Absenden des Formulars, der die Methode fetchData aufruft.-->
    <form @submit.prevent="fetchData" class="search-form"> 
      <div class="form-group">
        <label for="forename">Vorname:</label>
        <input type="text" id="forename"  v-model="searchParams.forename" :style="{ padding: '8px', borderRadius: '8px', backgroundColor: 'hsl(0, 0%, 90%)'}" />
      </div>

      <div class="form-group">
        <label for="name">Nachname:</label>
        <input type="text" id="name" v-model="searchParams.name" :style="{ padding: '8px', borderRadius: '8px', backgroundColor: 'hsl(0, 0%, 90%)'}" />
      </div>

      <div class="form-group">
        <label for="nationality">Nationalität:</label>
        <input type="text" id="nationality" v-model="searchParams.nationality" :style="{ padding: '8px', borderRadius: '8px', backgroundColor: 'hsl(0, 0%, 90%)'}" />
      </div>

      <div class="form-group">  <!-- Slider -->
        <label for="ageRange" >Altersspanne:</label>
        <div>

          <v-layout row>

            <v-flex shrink style="width: 75px">
              <v-text-field
                v-model="ageSpan[0]"
                hide-details
                single-line
                type="number"
                :readonly="1"
              ></v-text-field>
            </v-flex>

              <v-flex shrink style="width: 300px; ">
                <v-range-slider 
                  id="ageRange"
                  v-model="ageSpan"
                  :max="ageMaxLimit"
                  :min="ageMinLimit"
                  :step="1"
                  strict
                  thumbColor="#13b1cd"
                  trackColor="darkgrey">
                  
                </v-range-slider>

              </v-flex >

              <v-flex shrink style="width: 75px">
              <v-text-field
                v-model="ageSpan[1]"
                hide-details
                single-line
                type="number"
                :readonly="1"
              ></v-text-field>
            </v-flex>
          </v-layout>
      </div>
      </div>
      
      <button type="submit" class="api-button">Daten abrufen</button>  <!-- schick Formular ab -->
    </form>
    <div v-if="results.length > 0">
      <div class="wrapper">
        <div class="box" v-for="(result, index) in results" :key="index">
          <ResultsList :result="result"/>
        </div>
      </div>
    </div>
     <!-- Ein Button, um zur vorherigen Seite zu wechseln. 
        Der Button ist deaktiviert (:disabled="currentPage === 1") wenn die aktuelle Seite bereits die erste Seite ist -->
    <div class ="seiten-wechsel">
      <button class="button-seite" @click="changePage(currentPage - 1)" :disabled="currentPage === 1">Vorherige Seite</button>
      <button class="button-seite" @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">Nächste Seite</button>
      <span style="padding-left: 5px;">
        Aktuelle Seite: {{ currentPage }} von {{ totalPages }}
      </span>
    </div>
  </div>
    </div>

</template>


<script>
import ResultsList from './ResultsList.vue';



export default {
  components: {
    ResultsList,
},
  data() {
    return {
      results: [],
      searchParams: {
        forename: '',
        name: '',
        nationality: '',
        ageMin: 0,
        ageMax: 100,
      },
      ageSpan: [0, 100],
      ageMinLimit: 0,
      ageMaxLimit: 100,
      currentPage: 1,
      resultsPerPage: 10,
      totalPages: 0,
    };
  },
  watch: {
    searchParams: {
      handler() {
        // Setze currentPage auf 1, wenn sich die Suchparameter ändern
        this.currentPage = 1;
      },
      deep: true,
    },
    ageSpan(range){
      this.searchParams.ageMin = range[0];
      this.searchParams.ageMax = range[1];
    }
  },
  methods: {
    async fetchData() {
      try {
        const response = await this.$axios.get('https://ws-public.interpol.int/notices/v1/yellow', {
          params: {
            ...this.searchParams,
            page: this.currentPage,
            resultPerPage: this.resultsPerPage,
          },
        });

        console.log('API-Antwort:', response.data);
        this.results = response.data._embedded.notices;
        this.totalPages = Math.ceil(response.data.total / this.resultsPerPage);

        // Rufe die Bilder für jedes Ergebnis separat ab und füge sie zu den Ergebnissen hinzu
        for (const result of this.results) {
          const imageResponse = await this.$axios.get(`https://ws-public.interpol.int${result._links.images.href.replace('https://ws-public.interpol.int', '')}`);
          const images = imageResponse.data._embedded.images;
          console.log('Bilder für', result.name, 'abgerufen:', images);

          // Wenn Thumbnails vorhanden sind, füge sie zu den Ergebnissen hinzu
          if (images.length > 0) {
            result.thumbnail = images[0]._links.self.href;
          }
        }
      } catch (error) {
        console.error('Fehler beim Abrufen der Daten:', error);
        console.error('Fehlerdetails:', error.response);
      }
    },
    changePage(newPage) {
      if (newPage > 0 && newPage <= this.totalPages) {
        this.currentPage = newPage;
        this.fetchData();
      }
    },
  },
};
</script>


<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Special+Elite&display=swap');


.api-button{
  border: 4px solid;
  border-color: #13b1cd;
  background-color: white;
  padding: 5px;
  border-radius: 8px;
  font-family: Bebas Neue;
  color: #13b1cd;
  font-weight:lighter;
  font-size: larger;
  
 
}
.search-form {
 display: grid;
 grid-template-columns: 1fr;
 grid-gap: 20px;
 margin-top: 20px;
 font-family:Verdana, Geneva, Tahoma, sans-serif; 
}

.form-group {
 display: flex;
 font-family: Bebas Neue;
 color: white ;
 flex-direction: column;
}


.age-range {
 display: flex;
 flex-direction: column;
 align-items: center;
 color: antiquewhite;
}

.slider-container {
 display: flex;
 align-items: center;
}

.age-range span {
 margin: 5px;
}



.page-title {
font-family: Bebas Neue;
 color: aliceblue;
 font-style: bold;
 font-size:xxx-large;
 margin: 20px;
 margin-bottom: 5px;
 position: relative;
}

.description {
 font-family: Bebas Neue;
 margin: 20px;
 width: 700px;
 color: white ;
}

.seiten-wechsel{
padding: 10px;
color: white;
font-family: Bebas Neue;
}

.button-seite{
  border: 2px solid;
  border-color: #13b1cd;
  background-color: white;
  padding-top: 5px;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 8px;
  font-family: Bebas Neue;
  color: #13b1cd;
  font-weight:lighter;
 
}

</style>
