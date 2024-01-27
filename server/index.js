import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import request from 'request-promise';
import querystring from 'querystring';
import fetch from 'node-fetch';
import cors from 'cors';



var app = express();
app.use(cors());

let userData = {
}; //javascript objevt that contains data for a : the token and the username and for b also

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;
// a route handler
app.get('/login/:username', function (req, res) {
  console.log("Route handler called");
  const username = req.params.username;
  userData[username] = { token: '' };
  console.log("This is the username : " + username);
  var state = generateRandomString(16)+ '|' + encodeURIComponent(username); // protection against attacks
  var scope = 'user-read-private user-read-email playlist-read-private user-top-read playlist-read-collaborative';
  //user-read-private: Read access to user’s subscription details (type of user account).
  // user-read-email: Read access to user’s email address.
  // playlist-read-playlist: read private playlists.
  //user-top-read : top artists and tracks

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri + '/callback' ,
      state: state
    }));
});
// remember that this function is to generate a strig of 1 chaacters as a CSRF to ensure the response if from the user
function generateRandomString(length) {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

app.get('/callback', async (req, res) => {
  const username = req.query.username
  const code = req.query.code || null;

  if (!userData[username]) {
    userData[username] = { token: '' };
  }
  
  const token = await getToken(code, username);

  if (token) {
    userData[username].token = token; // i got he token for the corresponsing user
    const displayName = await getUserProfile(token); // let me also get the display name for the respective user 
    console.log("this is the displayname: " + displayName);
    const reactAppUrl = 'http://localhost:3000';
    res.redirect(`${reactAppUrl}?token=${token}&displayName=${encodeURIComponent(displayName)}`);
  } else {
    res.status(400).send(`Error getting the token for User ${username}.`);
  }
});


async function getToken(code, username) {
  var authOptions = {
    method: 'POST',
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: redirect_uri + '/callback',
      grant_type: 'authorization_code'
    },
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
    },
    json: true
  };
  try {
    const response = await request(authOptions);
    console.log("This is the token:" + response.access_token);
    return response.access_token;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

async function getUserProfile(accessToken) {
  try {
    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      console.error("Error fetching user profile: ", response.status, response.statusText);
      const responseBody = await response.text();
      console.error("Response body: ", responseBody);
      return null;
    }

    const result = await response.json();
    return result.display_name;
  } catch (error) {
    console.error("Error fetching user profile and display name" + error);
  }
}



app.listen(3001, () => {
  console.log('Listening on 3001');
});

///Remember this is the general workflow: User 1: Clicks on "Login for User 1" → Redirects to Spotify → Logs in → Grants permission → Redirects back with authorization code → Exchange for access token.
//                                        User 2: Clicks on "Login for User 2" → Redirects to Spotify → Logs in → Grants permission → Redirects back with authorization code → Exchange for access token.

