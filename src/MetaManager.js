import $ from 'jquery';

export function getMeta(source) {
  let meta = {};
  let xml = $.parseHTML(source);
  let _xml = $(xml);
  let res = _xml.filter((e) => {e = _xml[e]; return e.localName === "meta";});
  for(let i=0;i<res.length;i++) {
    let e = res[i];
    let _e = $(e);
    //console.log(e.name);
    if(e.name !== "")
      meta[e.name] = e.content;
    else if(_e.attr("itemprop"))
      meta[_e.attr("itemprop")] = e.content;
    else if(_e.attr("property"))
       meta[_e.attr("property")] = e.content;
  }
  console.log(meta);
  return meta;
}

function digMeta(meta, find) {
  let res = null;
  find.forEach((e) => {
    if(meta[e]) res = meta[e];
  });
  return res;
}

export function findAuthor(meta) {
  let a = digMeta(meta, ['author', 'byl']);
  if(meta.byl && a) a = a.substr(3);
  if(a) {
    let s = a.split(' ');
    if(s.length == 2) a = s[1] + ", " + s[0];
    else if(s.length === 3) a = s[1] + ", " + s[0] + " " + s[2];
  }
  return a;
}

export function findTitle(meta) {
  return digMeta(meta, ['title', 'headline', 'og:title']);
}

export function findSiteName(meta) {
  return digMeta(meta, ['twitter:app:name:googleplay', 'twitter:site', 'og:site_name']);
}

export function findPubDate(meta) {
  return digMeta(meta, ['datePublished']);
}

export function findURL(meta) {
  return digMeta(meta, ['og:url', 'twitter:url']);
}