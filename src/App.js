import React, { Component } from 'react';
import './App.css';
// eslint-disable-next-line
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
// eslint-disable-next-line
import bootstrap from 'bootstrap/dist/js/bootstrap.min.js';
import {getMeta, findAuthor, findTitle, findSiteName, findPubDate, findURL} from './MetaManager.js';
import swal from 'sweetalert2';

function LiList({items}) {
  let x = [];
  items.forEach((e) => {
    x.push(<li>{e}</li>);
  });
  return x;
}

function FlagList({flags, display, fixPressed}) {
  if(!display) return null;
  if(flags.length === 0) return (
      <div className="alert alert-success mt-5">
        <h5><i className="fas fa-check mr-3"></i> Checks passed</h5>
        This citation is valid for MLA8.
      </div>
    );
  return (<div className="alert alert-danger mt-5">
          <h5><i className="fas fa-flag mr-3"></i> Problems were found</h5>
          <ul>
            <LiList items={flags} />
          </ul>
          <div className="d-flex justify-content-end">
            <button className="btn btn-danger btn-sm" onClick={fixPressed}>Resolve Problems</button>
          </div>
        </div>);
}

class App extends Component {
  constructor() {
    super();
    this.search = this.search.bind(this);
    this.resolveProblems = this.resolveProblems.bind(this);
    this.state = {citation: null, flags: [], author: null, title: null, container: null, pubdate: null, url: null, pubd: false, generated: false};
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
      let flags = [];
      let meta = getMeta(e);
      let author = findAuthor(meta);
      let title = findTitle(meta);
      let container = findSiteName(meta);
      let pubDate = new Date(findPubDate(meta));
      let url = findURL(meta);
      if(author === null) flags.push("The author name could not be found");
      else if(!author.includes(",")) flags.push("The author name was not properly formatted");
      if(title === null) flags.push("The title of the article or page could not be found");
      if(container === null) flags.push("The website name could not be found");
      if(!(findPubDate(meta))) flags.push("The published date could not be found");
      if(url === null) flags.push("A shortened link to the article or page could not be found");
      this.setState({generated: true, flags: flags, author: author, title: title, container: container, pubdate: pubDate, url: url, pubd: findPubDate(meta)});
      //this.tearea.value = (author ? author + ". " : "") + "\"" + title + "\". " + container + ", " + (!findPubDate(meta) ? "[" + new Date().toDateString() + "]": pubDate.toDateString()) + ", " + url;
    });
  }
  resolveProblems() {
    if(!this.state.author || !this.state.author.includes(",")) return swal({html: "Enter the <strong>author</strong> in Last, First format.", input: "text"}).then((res) => {
      if(!res.value) return;
      this.setState({author: res.value});
      this.resolveProblems();
    });
    if(!this.state.title) return swal({html: "Enter the <strong>title</strong>.", input: "text"}).then((res) => {
      if(!res.value) return;
      this.setState({title: res.value});
      this.resolveProblems();
    });
    if(!this.state.container) return swal({html: "Enter the <strong>website name</strong>.", input: "text"}).then((res) => {
      if(!res.value) return;
      this.setState({title: res.value});
      this.resolveProblems();
    });
    if(!this.state.pubd) return swal({html: "Enter the <strong>publication date</strong> in YYYY-MM-DD format.", input: "text"}).then((res) => {
      if(!res.value) return;
      this.setState({pubdate: new Date(res.value + " 01:00:00"), pubd: res.value});
      this.resolveProblems();
    });
    if(!this.state.url) return swal({html: "Enter the <strong>page URL</strong>.", input: "text"}).then((res) => {
      if(!res.value) return;
      this.setState({url: res.value});
      this.resolveProblems();
    });
    this.setState({flags: []});
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
          <div className="col-md-12">
            Your citation: <span style={{fontFamily: "monospace"}}>{this.state.author ? this.state.author+"." : ""} {this.state.title ? <span>"{this.state.title}".</span> : ""} {this.state.container ? <em>{this.state.container},</em> : ""} {this.state.pubd ? this.state.pubdate.toDateString() + "," : ""} {this.state.url ? this.state.url + "." : ""}</span>
          </div>
        </div>
        <FlagList flags={this.state.flags} display={this.state.generated} fixPressed={this.resolveProblems} />
      </div>
    );
  }
}

export default App;
