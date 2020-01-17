<template>
  <div class="autocomplete">
    <input
      type="text"
      v-model="textInput"
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
      >
        {{ object.name }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    classes: {
      type: String,
      required: true
    },
    autocompleteUrl: {
      type: String,
      default: "/autocomplete/objects/"
    },
    required: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      listOpen: false,
      textInput: null,
      searchResults: [],
      arrowCounter: -1
    };
  },
  methods: {
    searchTexts() {
      this.$emit("ObjectName", this.textInput);
      if (this.textInput.length > 2) {
        axios.get(this.autocompleteUrl + this.textInput).then(response => {
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
    onArrowDown(evt) {
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
  watch: {
    textInput() {
      this.searchTexts();
    }
  }
};
</script>
