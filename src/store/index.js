import { observable, action, decorate } from 'mobx';
import { create } from 'axios';
import { map } from 'lodash';
import { ConcurrencyManager } from 'axios-concurrency';
import { fixerAPIKey } from '../../config/app';
import { getDates } from '../helpers';

class AppState {

  items = [];
  historicalError = null;
  isFetching = false;
  historicalData = [];
  historicalDates = [];

  constructor(initialState) {
    this.fetchRatesHistory = this.fetchRatesHistory.bind(this);
    this.items = initialState && initialState.appstate && initialState.appstate.items ? initialState.appstate.items : [];
  }

  addItem(item) {
    this.items.push(item);
  }

  toJson() {
    return {
      items: this.items
    };
  }

  async fetchRatesHistory(APIendpoint, days) {
    this.isFetching = true;
    this.historicalError = null;
    try {
      const today = new Date();
      const priorDateObj = new Date();
      const priorDate = priorDateObj.setDate(priorDateObj.getDate() - (days - 1));
      let dates = [];
      dates = getDates(priorDate, today);
      const MAX_CONCURRENT_REQUESTS = 1;
      let api = create({
        baseURL: APIendpoint
      });
      const manager = ConcurrencyManager(api, MAX_CONCURRENT_REQUESTS);
      await Promise.all(dates.map(date => api.get(`/${date}?access_key=${fixerAPIKey}`)))
      .then(responses => {
        const responseArr = []; const datesArr = [];
        map(responses, response => {
          if (response && response.data && response.data.rates && response.data.date) {
            datesArr.push(response.data.date);
            responseArr.push(response.data.rates);
          }
        });
        this.historicalData = responseArr;
        this.historicalDates = datesArr;
      });
      this.isFetching = false;
    } catch (error) {
      this.historicalError = error;
      this.isFetching = false
    }
  }

}

decorate(AppState, {
  items: observable,
  historicalError: observable,
  historicalDates: observable,
  isFetching: observable,
  historicalData: observable,
  addItem: action,
  fetchRatesHistory: action
});

export default AppState;
