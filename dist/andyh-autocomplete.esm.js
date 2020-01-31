import axios from 'axios';

//

var script = {
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
    }
  },
  data: function data() {
    return {
      listOpen: false,
      textInput: this.value,
      searchResults: [],
      arrowCounter: -1
    };
  },
  methods: {
    searchTexts: function searchTexts() {
      var this$1 = this;

      this.$emit("ObjectName", this.textInput);
      if (this.textInput.length > 2) {
        axios.get(this.url + this.textInput).then(function (response) {
          this$1.searchResults = response.data;
          if (
            this$1.searchResults.length == 1 &&
            this$1.searchResults[0].name == this$1.textInput
          ) {
            this$1.listOpen = false;
          } else {
            this$1.listOpen = true;
          }
        });
      } else {
        this.searchResults = [];
      }
    },
    selectText: function selectText(e) {
      var this$1 = this;

      this.textInput = e;
      this.arrowCounter = -1;
      setTimeout(function () {
        this$1.listOpen = false;
      }, 500);
    },
    handleClickOutside: function handleClickOutside(evt) {
      if (!this.$el.contains(evt.target)) {
        this.listOpen = false;
      }
    },
    onArrowDown: function onArrowDown() {
      if (this.arrowCounter < this.searchResults.length) {
        this.arrowCounter = this.arrowCounter + 1;
      }
    },
    onArrowUp: function onArrowUp() {
      if (this.arrowCounter > 0) {
        this.arrowCounter = this.arrowCounter - 1;
      }
    },
    onEnter: function onEnter() {
      var this$1 = this;

      this.textInput = this.searchResults[this.arrowCounter].name;
      this.arrowCounter = -1;
      setTimeout(function () {
        this$1.listOpen = false;
      }, 500);
    }
  },
  mounted: function mounted() {
    document.addEventListener("click", this.handleClickOutside);
  },
  destroyed: function destroyed() {
    document.removeEventListener("click", this.handleClickOutside);
  },
  watch: {
    textInput: function textInput() {
      this.searchTexts();
      this.$emit("input", this.textInput);
    }
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    var options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    var hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            var originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            var existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

var isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return function (id, style) { return addStyle(id, style); };
}
var HEAD;
var styles = {};
function addStyle(id, css) {
    var group = isOldIE ? css.media || 'default' : id;
    var style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        var code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                { style.element.setAttribute('media', css.media); }
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            var index = style.ids.size - 1;
            var textNode = document.createTextNode(code);
            var nodes = style.element.childNodes;
            if (nodes[index])
                { style.element.removeChild(nodes[index]); }
            if (nodes.length)
                { style.element.insertBefore(textNode, nodes[index]); }
            else
                { style.element.appendChild(textNode); }
        }
    }
}

/* script */
var __vue_script__ = script;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "autocomplete" }, [
    _c("input", {
      directives: [
        {
          name: "model",
          rawName: "v-model",
          value: _vm.textInput,
          expression: "textInput"
        }
      ],
      staticClass: "ah-ac",
      class: _vm.classes,
      attrs: {
        type: "text",
        id: _vm.id,
        name: _vm.name,
        required: _vm.required == true,
        autocomplete: "off",
        placeholder: _vm.placeholder
      },
      domProps: { value: _vm.textInput },
      on: {
        keydown: [
          function($event) {
            if (
              !$event.type.indexOf("key") &&
              _vm._k($event.keyCode, "down", 40, $event.key, [
                "Down",
                "ArrowDown"
              ])
            ) {
              return null
            }
            return _vm.onArrowDown($event)
          },
          function($event) {
            if (
              !$event.type.indexOf("key") &&
              _vm._k($event.keyCode, "up", 38, $event.key, ["Up", "ArrowUp"])
            ) {
              return null
            }
            return _vm.onArrowUp($event)
          },
          function($event) {
            if (
              !$event.type.indexOf("key") &&
              _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")
            ) {
              return null
            }
            return _vm.onEnter($event)
          }
        ],
        input: function($event) {
          if ($event.target.composing) {
            return
          }
          _vm.textInput = $event.target.value;
        }
      }
    }),
    _vm._v(" "),
    _c(
      "ul",
      {
        directives: [
          {
            name: "show",
            rawName: "v-show",
            value: _vm.listOpen,
            expression: "listOpen"
          }
        ],
        staticClass: "autocomplete-results"
      },
      _vm._l(_vm.searchResults, function(object, i) {
        return _c(
          "li",
          {
            key: i,
            staticClass: "autocomplete-result",
            class: { "is-active": i === _vm.arrowCounter },
            on: {
              click: function($event) {
                return _vm.selectText(object.name)
              },
              input: _vm.searchTexts
            }
          },
          [_vm._v(_vm._s(object.name))]
        )
      }),
      0
    )
  ])
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  var __vue_inject_styles__ = function (inject) {
    if (!inject) { return }
    inject("data-v-1c798f35_0", { source: "\n.ah-ac {\n  width: 100%;\n  display: block;\n  padding: .375rem .75rem;\n  font-size: 1rem;\n  font-family: \"Roboto\", sans-serif;\n  color: #495057;\n  border: 1px solid #ced4da;\n  border-radius: .15rem;\n  line-height: 1.5;\n}\n.autocomplete {\n  position: relative;\n}\n.autocomplete-results {\n  padding: 0;\n  margin: 0;\n  border: 1px solid lightgrey;\n  border-radius: bottom 2px;\n  overflow: auto;\n  background-color: white;\n  position: absolute;\n  z-index: 2000;\n  width: 100%;\n}\n.autocomplete-result {\n  list-style: none;\n  text-align: left;\n  padding: 8px 2px;\n  cursor: pointer;\n  margin-top: 2px;\n}\n.autocomplete-result.is-active,\n.autocomplete-result:hover {\n  background-color: #f27405;\n  color: white;\n}\n", map: {"version":3,"sources":["C:\\git\\andyh-autocomplete\\src\\andyh-autocomplete.vue"],"names":[],"mappings":";AAsIA;EACA,WAAA;EACA,cAAA;EACA,uBAAA;EACA,eAAA;EACA,iCAAA;EACA,cAAA;EACA,yBAAA;EACA,qBAAA;EACA,gBAAA;AACA;AAEA;EACA,kBAAA;AACA;AAEA;EACA,UAAA;EACA,SAAA;EACA,2BAAA;EACA,yBAAA;EACA,cAAA;EACA,uBAAA;EACA,kBAAA;EACA,aAAA;EACA,WAAA;AACA;AAEA;EACA,gBAAA;EACA,gBAAA;EACA,gBAAA;EACA,eAAA;EACA,eAAA;AACA;AAEA;;EAEA,yBAAA;EACA,YAAA;AACA","file":"andyh-autocomplete.vue","sourcesContent":["<template>\n  <div class=\"autocomplete\">\n    <input\n      type=\"text\"\n      v-model=\"textInput\"\n      class=\"ah-ac\"\n      :class=\"classes\"\n      :id=\"id\"\n      :name=\"name\"\n      :required=\"required == true\"\n      autocomplete=\"off\"\n      :placeholder=\"placeholder\"\n      @keydown.down=\"onArrowDown\"\n      @keydown.up=\"onArrowUp\"\n      @keydown.enter=\"onEnter\"\n    />\n    <ul v-show=\"listOpen\" class=\"autocomplete-results\">\n      <li\n        v-for=\"(object, i) in searchResults\"\n        :key=\"i\"\n        @click=\"selectText(object.name)\"\n        @input=\"searchTexts\"\n        class=\"autocomplete-result\"\n        :class=\"{ 'is-active': i === arrowCounter }\"\n      >{{ object.name }}</li>\n    </ul>\n  </div>\n</template>\n\n<script>\nimport axios from \"axios\";\n\nexport default {\n  props: {\n    value: {\n      type: String,\n      default: \"\"\n    },\n    placeholder: {\n      type: String\n    },\n    name: {\n      type: String,\n      default: \"autocomplete\"\n    },\n    id: {\n      type: String,\n      default: \"autocomplete\"\n    },\n    classes: {\n      type: String\n    },\n    url: {\n      type: String,\n      default: \"https://andyh.app/autocomplete/fruit/\"\n    },\n    required: {\n      type: Boolean,\n      default: false\n    }\n  },\n  data() {\n    return {\n      listOpen: false,\n      textInput: this.value,\n      searchResults: [],\n      arrowCounter: -1\n    };\n  },\n  methods: {\n    searchTexts() {\n      this.$emit(\"ObjectName\", this.textInput);\n      if (this.textInput.length > 2) {\n        axios.get(this.url + this.textInput).then(response => {\n          this.searchResults = response.data;\n          if (\n            this.searchResults.length == 1 &&\n            this.searchResults[0].name == this.textInput\n          ) {\n            this.listOpen = false;\n          } else {\n            this.listOpen = true;\n          }\n        });\n      } else {\n        this.searchResults = [];\n      }\n    },\n    selectText(e) {\n      this.textInput = e;\n      this.arrowCounter = -1;\n      setTimeout(() => {\n        this.listOpen = false;\n      }, 500);\n    },\n    handleClickOutside(evt) {\n      if (!this.$el.contains(evt.target)) {\n        this.listOpen = false;\n      }\n    },\n    onArrowDown() {\n      if (this.arrowCounter < this.searchResults.length) {\n        this.arrowCounter = this.arrowCounter + 1;\n      }\n    },\n    onArrowUp() {\n      if (this.arrowCounter > 0) {\n        this.arrowCounter = this.arrowCounter - 1;\n      }\n    },\n    onEnter() {\n      this.textInput = this.searchResults[this.arrowCounter].name;\n      this.arrowCounter = -1;\n      setTimeout(() => {\n        this.listOpen = false;\n      }, 500);\n    }\n  },\n  mounted() {\n    document.addEventListener(\"click\", this.handleClickOutside);\n  },\n  destroyed() {\n    document.removeEventListener(\"click\", this.handleClickOutside);\n  },\n  watch: {\n    textInput() {\n      this.searchTexts();\n      this.$emit(\"input\", this.textInput);\n    }\n  }\n};\n</script>\n\n<style>\n.ah-ac {\n  width: 100%;\n  display: block;\n  padding: .375rem .75rem;\n  font-size: 1rem;\n  font-family: \"Roboto\", sans-serif;\n  color: #495057;\n  border: 1px solid #ced4da;\n  border-radius: .15rem;\n  line-height: 1.5;\n}\n\n.autocomplete {\n  position: relative;\n}\n\n.autocomplete-results {\n  padding: 0;\n  margin: 0;\n  border: 1px solid lightgrey;\n  border-radius: bottom 2px;\n  overflow: auto;\n  background-color: white;\n  position: absolute;\n  z-index: 2000;\n  width: 100%;\n}\n\n.autocomplete-result {\n  list-style: none;\n  text-align: left;\n  padding: 8px 2px;\n  cursor: pointer;\n  margin-top: 2px;\n}\n\n.autocomplete-result.is-active,\n.autocomplete-result:hover {\n  background-color: #f27405;\n  color: white;\n}\n</style>\n"]}, media: undefined });

  };
  /* scoped */
  var __vue_scope_id__ = undefined;
  /* module identifier */
  var __vue_module_identifier__ = undefined;
  /* functional template */
  var __vue_is_functional_template__ = false;
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  var __vue_component__ = normalizeComponent(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    false,
    createInjector,
    undefined,
    undefined
  );

// Import vue component

// Declare install function executed by Vue.use()
function install(Vue) {
    if (install.installed) { return; }
    install.installed = true;
    Vue.component("AndyHAutoComplete", __vue_component__);
}

// Create module definition for Vue.use()
var plugin = {
    install: install
};

// Auto-install when vue is found (eg. in browser via <script> tag)
var GlobalVue = null;
if (typeof window !== "undefined") {
    GlobalVue = window.Vue;
} else if (typeof global !== "undefined") {
    GlobalVue = global.Vue;
}
if (GlobalVue) {
    GlobalVue.use(plugin);
}

export default __vue_component__;
export { install };
