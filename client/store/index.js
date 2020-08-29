import axios from "axios";

export const state = () => ({
	token: null,
	user: null
})

export const mutations = {
  setToken(state, token) {
		state.token = token;
		localStorage.setItem('token', token);
	},
	clearToken(state) {
		state.token = null;
		localStorage.clear();
	},
	writeDataUser(state, user) {
		state.user = user;
	},
	clearDataUser(state) {
		state.user = null;
	},
}

export const actions = {
	async request(cnx, { method = "GET", url = "", req = {} }) {
		try {
			const { data } = await axios({method: "POST", url, data: req});
			return data;
		} catch(e) {
			const message = e.response.data?.message || e;
			console.error(message);
			return e.response.data;
		}
	},
	async login({ commit, dispatch }, params) {
		const response = await dispatch("request", { method: "POST", url: "/api/auth/login", req: { ...params } });
		if(response.success) {
			commit('writeDataUser', response.res.user);
			commit('setToken', response.res.token); 
		}
		return response.success;
	},
	async auth({ commit, dispatch }, { token }) {
		const response = await dispatch("request", { method: "POST", url: "/api/auth/", req: { token } });
		if(response.success) {
			commit('writeDataUser', response.res.user);
			commit('setToken', token );  
		}
		return response.success;
	},
	logout({ commit }) {
		commit('clearToken');
		commit('clearDataUser');
	},
};

export const getters = {
	hasToken: s => !!s.token,
	user: s => s.user
};