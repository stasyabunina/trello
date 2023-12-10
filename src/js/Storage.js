export default class Storage {
  constructor() {
    this.storage = localStorage;
  }

  save(data) {
    this.storage.setItem('data', JSON.stringify(data));
  }

  load() {
    try {
      return JSON.parse(this.storage.getItem('data'));
    } catch (e) {
      throw new Error('Invalid data');
    }
  }

  remove() {
    this.storage.removeItem('data');
  }
}
