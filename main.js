const url = 'https://script.google.com/macros/s/AKfycbxalPGjmVJzn33FTkHW5l40HXWR4AvF1yXdXUYshf3DQ1mLl_BGaAHsMJROix-TrJi3bw/exec'

const apiKey = 'AIzaSyCuO016qB5uToWhGOeJhFQ_t-RAnjasAtA'





function getData() {
  fetch(url, {
    mode: 'no-cors',
    header: {
      'Access-Control-Allow-Origin': 'http://127.0.0.1:5000',
      'Content-Type:': 'application/json'
    }
  }).then((res) => {
    return res.json()
  }).then((data) => {
    console.log(data)
  })
}


function initClient() {
  var API_KEY = 'AIzaSyCuO016qB5uToWhGOeJhFQ_t-RAnjasAtA';  // TODO: Update placeholder with desired API key.

  var CLIENT_ID = '101016164355349707085';  // TODO: Update placeholder with desired client ID.

  // TODO: Authorize using one of the following scopes:
  //   'https://www.googleapis.com/auth/drive'
  //   'https://www.googleapis.com/auth/drive.file'
  //   'https://www.googleapis.com/auth/drive.readonly'
  //   'https://www.googleapis.com/auth/spreadsheets'
  //   'https://www.googleapis.com/auth/spreadsheets.readonly'
  var SCOPE = 'https://www.googleapis.com/auth/spreadsheets.readonly';

  gapi.client.init({
    'apiKey': API_KEY,
    'clientId': CLIENT_ID,
    'scope': SCOPE,
    'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
  }).then(function () {
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);
    updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
  });
}

function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

function updateSignInStatus(isSignedIn) {
  if (isSignedIn) {
    read_data();
  }
}

function handleSignInClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

function handleSignOutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}