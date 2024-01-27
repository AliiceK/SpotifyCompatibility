/* require('dotenv').config();
const express = require('express');
const request = require('request-promise');
const querystring = require('querystring');

var app = express();

let userAToken = '';
let userBToken = '';

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri =  process.env.REDIRECT_URI || 'http://localhost:3000/callback';

app.get('/login/:userType', function(req,res)  {
    const userType = req.params.userType; // a to indicte the first and b for the second
    var state = generateRandomString(16); // protection against attacks
    var scope = 'user-read-private user-read-email playlist-read-private user-top-read';
    //user-read-private: Read access to user’s subscription details (type of user account).
    // user-read-email: Read access to user’s email address.
    // playlist-read-playlist: read private playlists.
    //user-top-read : top artists and tracks

    res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri + '/' + userType,
      state: state
    }));
}) ;

function generateRandomString(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

app.get('/callback/a', async (req, res) => {
    const code = req.query.code || null;
    const token = await getToken(code);
    if (token) {
        userAToken = token;
        res.send('User A login successful! You can now use the access token to access Spotify data.');
    } else {
        res.send('Error getting the token for User A.');
    }
});

app.get('/callback/b', async (req, res) => {
    const code = req.query.code || null;
    const token = await getToken(code);
    if (token) {
        userBToken = token;
        res.send('User B login successful! You can now use the access token to access Spotify data.');
    } else {
        res.send('Error getting the token for User B.');
    }
});

async function getToken(code, state) {
      var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
          code: code,
          redirect_uri: redirect_uri,
          grant_type: 'authorization_code'
        },
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
        },
        json: true
      };
    };

///Remember this is the general workflow: User 1: Clicks on "Login for User 1" → Redirects to Spotify → Logs in → Grants permission → Redirects back with authorization code → Exchange for access token.
//                                        User 2: Clicks on "Login for User 2" → Redirects to Spotify → Logs in → Grants permission → Redirects back with authorization code → Exchange for access token.
   */