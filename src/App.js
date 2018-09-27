import React, { Component } from 'react';
import './App.css';
// eslint-disable-next-line
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
// eslint-disable-next-line
import bootstrap from 'bootstrap/dist/js/bootstrap.min.js';
import {getMeta, findAuthor, findTitle, findSiteName, findPubDate, findURL} from './MetaManager.js';
import swal from 'sweetalert2';

class App extends Component {
  constructor() {
    super();
    this.search = this.search.bind(this);
    this.state = {citation: null};
  }
  componentDidMount() {
    swal("Testing CORS...");
    swal.showLoading();
    fetch("https://www.google.com").then((e) => e.text()).catch(e => console.log(e))
    .then(e => {
      if(e !== undefined) {
        swal.close();
        return;
      }
      swal({title: "Attention", html: "<p>This browser has CORS protection enabled. CiteMon will <strong>NOT</strong> work with this enabled.</p><p>If you are using chrome, you can click <a href='https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi?hl=en' target='blank'>here</a> to download an extension which disables this.</p><p>Press OK once you've downloaded the extension or disabled CORS protection in some other way</p>"})
      .then((e) => {
        //window.location.reload();
      });
    });
  }
  search(e) {
    e.preventDefault();
    let url = this.url.value;
    fetch(this.url.value).then((e) => e.text()).catch(e => console.error(e))
    .then((e) => {
      let meta = getMeta(e);
      let author = findAuthor(meta);
      let title = findTitle(meta);
      let container = findSiteName(meta);
      let pubDate = new Date(findPubDate(meta));
      let url = findURL(meta);
      this.tearea.value = (author ? author + ". " : "") + "\"" + title + "\". " + container + ", " + (!findPubDate(meta) ? "[" + new Date().toDateString() + "]": pubDate.toDateString()) + ", " + url;
    });
  }
  render() {
    return (
      <div className="container mt-5">
        <h1>CiteMon - The open source citation manager</h1>
        <hr />
        <div className="row">
          <div className="col-md-9 form-group">
            <input className="form-control" placeholder="Paste URL" ref={(e) => this.url = e} />
          </div>
          <div className="col-md-3 form-group">
            <button className="btn btn-primary w-100" onClick={this.search}>Cite</button>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 form-group">
            <textarea className="form-control w-100" ref={(e) => this.tearea = e}></textarea>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
