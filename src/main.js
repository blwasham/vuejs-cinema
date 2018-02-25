import './style.scss';
import Vue from 'vue';
import genres from './util/genres';

new Vue({
  el: '#app',
  data: {
    genre: [],
    time: []
  },
  methods: {
    checkFilter(category, title, checked) {
      if (checked) {
        this[category].push(title);
      } else {
        let index = this[category].indexOf(title);

        if (index > -1) {
          this[category].splice(index, 1);
        }
      }
    }
  },
  components: {
    'movie-list': {
      props: ['genre', 'time'],
      methods: {
        moviePassesGenreFilter(movie) {
          if (!this.genre.length) {
            return true;
          } else {
            return this.genre.find(genre => movie.genre === genre);
          }
        }
      },
      computed: {
        filteredMovies() {
          return this.movies.filter(this.moviePassesGenreFilter);
        }
      },
      template: `
      <div id="movie-list">
        <div v-for="movie in filteredMovies" class="movie">
          {{movie.title}}
        </div>
      </div>`,
      data() {
        return {
          movies: [{
              title: 'Pulp Fiction',
              genre: genres.CRIME
            },
            {
              title: 'Home Alone',
              genre: genres.COMEDY
            },
            {
              title: 'Austin Powers',
              genre: genres.COMEDY
            }
          ]
        };
      }
    },
    'movie-filter': {
      data() {
        return {
          genres
        };
      },
      methods: {
        checkFilter(category, title, checked) {
          this.$emit('check-filter', category, title, checked);
        }
      },
      template: `
      <div id="movie-filter">
        <h2>Filter results</h2>
        <div class="filter-group">
          <check-filter @check-filter="checkFilter" :title="genre" v-for="genre in genres"></check-filter>
        </div>
      </div>`,
      components: {
        'check-filter': {
          props: ['title'],
          data() {
            return {
              checked: false
            };
          },
          methods: {
            checkFilter() {
              this.checked = !this.checked;
              this.$emit('check-filter', 'genre', this.title, this.checked);
            }
          },
          template: `
            <div :class="{'check-filter': true, active: checked}" @click="checkFilter">
              <span class="checkbox" @click="checked = !checked"></span>
              <span class="check-filter-title">{{title}}</span>
            </div>`
        }
      }
    }
  }
});