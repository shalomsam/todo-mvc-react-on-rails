class Utils {

  ajax(method, url = '', data = {}) {
    return fetch(url, {
      method: method,
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
  }

  post(url = '', data = {}) {
    return this.ajax('POST', url, data);
  }

  delete(url = '', data = {}) {
    return this.ajax('DELETE', url, data);
  }

  put(url = '', data = {}) {
    return this.ajax('PUT', url, data);
  }
}

export default new Utils;
