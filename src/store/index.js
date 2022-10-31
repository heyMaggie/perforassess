import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        routes: []
    },
    mutations: {
        setRoutes(state, data) {
            state.routes = data;
        }
    }
});

export default store;
