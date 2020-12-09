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
    inject("data-v-867b2174_0", { source: "\n.ah-ac {\r\n  width: 100%;\r\n  display: block;\r\n  padding: .375rem .75rem;\r\n  font-size: 1rem;\r\n  font-family: \"Roboto\", sans-serif;\r\n  color: #495057;\r\n  border: 1px solid #ced4da;\r\n  border-radius: .15rem;\r\n  line-height: 1.5;\n}\n.autocomplete {\r\n  position: relative;\n}\n.autocomplete-results {\r\n  padding: 0;\r\n  margin: 0;\r\n  border: 1px solid lightgrey;\r\n  border-radius: bottom 2px;\r\n  overflow: auto;\r\n  background-color: white;\r\n  position: absolute;\r\n  z-index: 2000;\r\n  width: 100%;\n}\n.autocomplete-result {\r\n  list-style: none;\r\n  text-align: left;\r\n  padding: 8px 2px;\r\n  cursor: pointer;\r\n  margin-top: 2px;\n}\n.autocomplete-result.is-active,\r\n.autocomplete-result:hover {\r\n  background-color: #f27405;\r\n  color: white;\n}\r\n", map: {"version":3,"sources":["C:\\git\\andyh-autocomplete\\src\\andyh-autocomplete.vue"],"names":[],"mappings":";AAqIA;EACA,WAAA;EACA,cAAA;EACA,uBAAA;EACA,eAAA;EACA,iCAAA;EACA,cAAA;EACA,yBAAA;EACA,qBAAA;EACA,gBAAA;AACA;AAEA;EACA,kBAAA;AACA;AAEA;EACA,UAAA;EACA,SAAA;EACA,2BAAA;EACA,yBAAA;EACA,cAAA;EACA,uBAAA;EACA,kBAAA;EACA,aAAA;EACA,WAAA;AACA;AAEA;EACA,gBAAA;EACA,gBAAA;EACA,gBAAA;EACA,eAAA;EACA,eAAA;AACA;AAEA;;EAEA,yBAAA;EACA,YAAA;AACA","file":"andyh-autocomplete.vue","sourcesContent":["<template>\r\n  <div class=\"autocomplete\">\r\n    <input\r\n      type=\"text\"\r\n      v-model=\"textInput\"\r\n      class=\"ah-ac\"\r\n      :class=\"classes\"\r\n      :id=\"id\"\r\n      :name=\"name\"\r\n      :required=\"required == true\"\r\n      autocomplete=\"off\"\r\n      :placeholder=\"placeholder\"\r\n      @keydown.down=\"onArrowDown\"\r\n      @keydown.up=\"onArrowUp\"\r\n      @keydown.enter=\"onEnter\"\r\n    />\r\n    <ul v-show=\"listOpen\" class=\"autocomplete-results\">\r\n      <li\r\n        v-for=\"(object, i) in searchResults\"\r\n        :key=\"i\"\r\n        @click=\"selectText(object.name)\"\r\n        @input=\"searchTexts\"\r\n        class=\"autocomplete-result\"\r\n        :class=\"{ 'is-active': i === arrowCounter }\"\r\n      >{{ object.name }}</li>\r\n    </ul>\r\n  </div>\r\n</template>\r\n\r\n<script>\r\nimport axios from \"axios\";\r\n\r\nexport default {\r\n  props: {\r\n    value: {\r\n      type: String,\r\n      default: \"\"\r\n    },\r\n    placeholder: {\r\n      type: String\r\n    },\r\n    name: {\r\n      type: String,\r\n      default: \"autocomplete\"\r\n    },\r\n    id: {\r\n      type: String,\r\n      default: \"autocomplete\"\r\n    },\r\n    classes: {\r\n      type: String\r\n    },\r\n    url: {\r\n      type: String,\r\n      default: \"https://andyh.app/autocomplete/fruit/\"\r\n    },\r\n    required: {\r\n      type: Boolean,\r\n      default: false\r\n    }\r\n  },\r\n  data() {\r\n    return {\r\n      listOpen: false,\r\n      textInput: this.value,\r\n      searchResults: [],\r\n      arrowCounter: -1\r\n    };\r\n  },\r\n  methods: {\r\n    searchTexts() {\r\n      if (this.textInput.length > 2) {\r\n        axios.get(this.url + this.textInput).then(response => {\r\n          this.searchResults = response.data;\r\n          if (\r\n            this.searchResults.length == 1 &&\r\n            this.searchResults[0].name == this.textInput\r\n          ) {\r\n            this.listOpen = false;\r\n          } else {\r\n            this.listOpen = true;\r\n          }\r\n        });\r\n      } else {\r\n        this.searchResults = [];\r\n      }\r\n    },\r\n    selectText(e) {\r\n      this.textInput = e;\r\n      this.arrowCounter = -1;\r\n      setTimeout(() => {\r\n        this.listOpen = false;\r\n      }, 500);\r\n    },\r\n    handleClickOutside(evt) {\r\n      if (!this.$el.contains(evt.target)) {\r\n        this.listOpen = false;\r\n      }\r\n    },\r\n    onArrowDown() {\r\n      if (this.arrowCounter < this.searchResults.length) {\r\n        this.arrowCounter = this.arrowCounter + 1;\r\n      }\r\n    },\r\n    onArrowUp() {\r\n      if (this.arrowCounter > 0) {\r\n        this.arrowCounter = this.arrowCounter - 1;\r\n      }\r\n    },\r\n    onEnter() {\r\n      this.textInput = this.searchResults[this.arrowCounter].name;\r\n      this.arrowCounter = -1;\r\n      setTimeout(() => {\r\n        this.listOpen = false;\r\n      }, 500);\r\n    }\r\n  },\r\n  mounted() {\r\n    document.addEventListener(\"click\", this.handleClickOutside);\r\n  },\r\n  destroyed() {\r\n    document.removeEventListener(\"click\", this.handleClickOutside);\r\n  },\r\n  watch: {\r\n    textInput() {\r\n      this.searchTexts();\r\n      this.$emit(\"input\", this.textInput);\r\n    }\r\n  }\r\n};\r\n</script>\r\n\r\n<style>\r\n.ah-ac {\r\n  width: 100%;\r\n  display: block;\r\n  padding: .375rem .75rem;\r\n  font-size: 1rem;\r\n  font-family: \"Roboto\", sans-serif;\r\n  color: #495057;\r\n  border: 1px solid #ced4da;\r\n  border-radius: .15rem;\r\n  line-height: 1.5;\r\n}\r\n\r\n.autocomplete {\r\n  position: relative;\r\n}\r\n\r\n.autocomplete-results {\r\n  padding: 0;\r\n  margin: 0;\r\n  border: 1px solid lightgrey;\r\n  border-radius: bottom 2px;\r\n  overflow: auto;\r\n  background-color: white;\r\n  position: absolute;\r\n  z-index: 2000;\r\n  width: 100%;\r\n}\r\n\r\n.autocomplete-result {\r\n  list-style: none;\r\n  text-align: left;\r\n  padding: 8px 2px;\r\n  cursor: pointer;\r\n  margin-top: 2px;\r\n}\r\n\r\n.autocomplete-result.is-active,\r\n.autocomplete-result:hover {\r\n  background-color: #f27405;\r\n  color: white;\r\n}\r\n</style>\r\n"]}, media: undefined });

  };
  /* scoped */
  var __vue_scope_id__ = undefined;
  /* module identifier */
  var __vue_module_identifier__ = undefined;
  /* functional template */
  var __vue_is_functional_template__ = false;
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  var __vue_component__ = /*#__PURE__*/normalizeComponent(
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
