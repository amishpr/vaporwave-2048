import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import firebase from "firebase";

Vue.config.productionTip = false;

let firebase_config = {
  apiKey: "AIzaSyCKo4Rxkz80cdHaOSPs6QG3H-kzoNbcZwU",
  authDomain: "project-4135635041756121949.firebaseapp.com",
  databaseURL: "https://project-4135635041756121949.firebaseio.com",
  projectId: "project-4135635041756121949",
  storageBucket: "",
  messagingSenderId: "696614554516"
};
firebase.initializeApp(firebase_config);

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
