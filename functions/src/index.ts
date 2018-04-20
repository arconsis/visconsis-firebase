import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

export const dialogFullfillment = functions.https.onRequest(async (request, response) => {
  const json = request.body.result.parameters;
  let text;
  let answer = '';
  console.log('json received:', json);
  let data;
  if (json.noodleNumber !== undefined) {
    data = {
      'name': json.name,
      'order': 'noodles',
      'number': json.noodleNumber,
      'date': new Date(),
      'payed': false
    };
    text = `\n${json.name};--;${json.noodleNumber}`;
    answer = `Danke ${json.name}, deine Nudeln mit der nummer ${json.noodleNumber} wird bestellt, das macht 5,75€`;
  } else if (json.pizzaNumber !== undefined) {
    data = {
      'name': json.name,
      'order': 'pizza',
      'number': json.pizzaNumber,
      'date': new Date(),
      'payed': false
    };
    text = `\n${json.name};--;${json.pizzaNumber}`;
    answer = `Danke ${json.name}, deine Pizza mit der nummer ${json.pizzaNumber} wird bestellt, das macht 5,75€`;
  } else if (json.dressing !== undefined) {
    data = {
      'name': json.name,
      'order': 'salad',
      'number': json.saladNumber,
      'dressing': json.dressing,
      'date': new Date(),
      'payed': false
    };
    text = `\n${json.name};${json.dressing};${json.saladNumber}`;
    answer = `Danke ${json.name}, dein Salat mit der nummer ${json.saladNumber} mit ${json.dressing} Dressing wird bestellt, das macht 5,75€`;
  }
  const docRef = db.collection('orders');

  await docRef.doc().set(data);

  response.send({
    speech: answer,
    answer: answer
  });
});

export const queryOrders = functions.https.onRequest(async (request, response) => {
  const ref = db.collection('orders');
  const data = [];
  await ref.get().then(snapshot => {
    snapshot.forEach(doc => {
      data.push(doc.data());
    })
  });

  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('access-control-allow-headers', 'Accept, Accept-CH, Accept-Charset, Accept-Datetime, Accept-Encoding, Accept-Ext, Accept-Features, Accept-Language, Accept-Params, Accept-Ranges, Access-Control-Allow-Credentials, Access-Control-Allow-Headers, Access-Control-Allow-Methods, Access-Control-Allow-Origin, Access-Control-Expose-Headers, Access-Control-Max-Age, Access-Control-Request-Headers, Access-Control-Request-Method, Age, Allow, Alternates, Authentication-Info, Authorization, C-Ext, C-Man, C-Opt, C-PEP, C-PEP-Info, CONNECT, Cache-Control, Compliance, Connection, Content-Base, Content-Disposition, Content-Encoding, Content-ID, Content-Language, Content-Length, Content-Location, Content-MD5, Content-Range, Content-Script-Type, Content-Security-Policy, Content-Style-Type, Content-Transfer-Encoding, Content-Type, Content-Version, Cookie, Cost, DAV, DELETE, DNT, DPR, Date, Default-Style, Delta-Base, Depth, Derived-From, Destination, Differential-ID, Digest, ETag, Expect, Expires, Ext, From, GET, GetProfile, HEAD, HTTP-date, Host, IM, If, If-Match, If-Modified-Since, If-None-Match, If-Range, If-Unmodified-Since, Keep-Alive, Label, Last-Event-ID, Last-Modified, Link, Location, Lock-Token, MIME-Version, Man, Max-Forwards, Media-Range, Message-ID, Meter, Negotiate, Non-Compliance, OPTION, OPTIONS, OWS, Opt, Optional, Ordering-Type, Origin, Overwrite, P3P, PEP, PICS-Label, POST, PUT, Pep-Info, Permanent, Position, Pragma, ProfileObject, Protocol, Protocol-Query, Protocol-Request, Proxy-Authenticate, Proxy-Authentication-Info, Proxy-Authorization, Proxy-Features, Proxy-Instruction, Public, RWS, Range, Referer, Refresh, Resolution-Hint, Resolver-Location, Retry-After, Safe, Sec-Websocket-Extensions, Sec-Websocket-Key, Sec-Websocket-Origin, Sec-Websocket-Protocol, Sec-Websocket-Version, Security-Scheme, Server, Set-Cookie, Set-Cookie2, SetProfile, SoapAction, Status, Status-URI, Strict-Transport-Security, SubOK, Subst, Surrogate-Capability, Surrogate-Control, TCN, TE, TRACE, Timeout, Title, Trailer, Transfer-Encoding, UA-Color, UA-Media, UA-Pixels, UA-Resolution, UA-Windowpixels, URI, Upgrade, User-Agent, Variant-Vary, Vary, Version, Via, Viewport-Width, WWW-Authenticate, Want-Digest, Warning, Width, X-Content-Duration, X-Content-Security-Policy, X-Content-Type-Options, X-CustomHeader, X-DNSPrefetch-Control, X-Forwarded-For, X-Forwarded-Port, X-Forwarded-Proto, X-Frame-Options, X-Modified, X-OTHER, X-PING, X-PINGOTHER, X-Powered-By, X-Requested-With');
  response.set('Access-Control-Allow-Origin', '*');
  response.send(data);

});