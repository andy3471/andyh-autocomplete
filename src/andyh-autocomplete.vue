<template>
  <div class="autocomplete" :style="cssVars">
    <input
      type="text"
      v-model="textInput"
      class="ah-ac"
      :class="classes"
      :id="id"
      :name="name"
      :required="required == true"
      autocomplete="off"
      :placeholder="placeholder"
      @keydown.down="onArrowDown"
      @keydown.up="onArrowUp"
      @keydown.enter="onEnter"
    />
    <ul v-show="listOpen" class="autocomplete-results">
      <li
        v-for="(object, i) in searchResults"
        :key="i"
        @click="selectText(object.name)"
        @input="searchTexts"
        class="autocomplete-result"
        :class="{ 'is-active': i === arrowCounter }"
      >{{ object.name }}</li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    value: {
      type: String,
      default: ""
    },
    placeholder: {
      type: String
    },
    name: {
      type: String,
      default: "autocomplete"
    },
    id: {
      type: String,
      default: "autocomplete"
    },
    classes: {
      type: String
    },
    url: {
      type: String,
      default: "https://andyh.app/autocomplete/fruit/"
    },
    required: {
      type: Boolean,
      default: false
    },
    color: {
      default: '#2a438c'
    }
  },
  data() {
    return {
      listOpen: false,
      textInput: this.value,
      searchResults: [],
      arrowCounter: -1
    };
  },
  methods: {
    searchTexts() {
      if (this.textInput.length > 2) {
        axios.get(this.url + this.textInput).then(response => {
          this.searchResults = response.data;
          if (
            this.searchResults.length == 1 &&
            this.searchResults[0].name == this.textInput
          ) {
            this.listOpen = false;
          } else {
            this.listOpen = true;
          }
        });
      } else {
        this.searchResults = [];
      }
    },
    selectText(e) {
      this.textInput = e;
      this.arrowCounter = -1;
      setTimeout(() => {
        this.listOpen = false;
      }, 500);
    },
    handleClickOutside(evt) {
      if (!this.$el.contains(evt.target)) {
        this.listOpen = false;
      }
    },
    onArrowDown() {
      if (this.arrowCounter < this.searchResults.length) {
        this.arrowCounter = this.arrowCounter + 1;
      }
    },
    onArrowUp() {
      if (this.arrowCounter > 0) {
        this.arrowCounter = this.arrowCounter - 1;
      }
    },
    onEnter() {
      this.textInput = this.searchResults[this.arrowCounter].name;
      this.arrowCounter = -1;
      setTimeout(() => {
        this.listOpen = false;
      }, 500);
    }
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside);
  },
  destroyed() {
    document.removeEventListener("click", this.handleClickOutside);
  },
  computed: {
    cssVars() {
      return {
        '--color': this.color
      }
    }
  },
  watch: {
    textInput() {
      this.searchTexts();
      this.$emit("input", this.textInput);
    }
  }
};
</script>

<style scoped>
.ah-ac {
  width: 100%;
  display: block;
  padding: .375rem .75rem;
  font-size: 1rem;
  font-family: "Roboto", sans-serif;
  color: #495057;
  border: 1px solid #ced4da;
  border-radius: .15rem;
  line-height: 1.5;
}

.autocomplete {
  position: relative;
}

.autocomplete-results {
  padding: 0;
  margin: 0;
  border: 1px solid lightgrey;
  border-radius: bottom 2px;
  overflow: auto;
  background-color: white;
  position: absolute;
  z-index: 2000;
  width: 100%;
}

.autocomplete-result {
  list-style: none;
  text-align: left;
  padding: 8px 2px;
  cursor: pointer;
  margin-top: 2px;
}

.autocomplete-result.is-active,
.autocomplete-result:hover {
  background-color: var(--color);
  color: white;
}
</style>
