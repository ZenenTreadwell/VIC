const Spotify = require('spotify-web-api-js');

const streamAPI = (platform, access_token) => {
  if (platform === 'spotify') {
    const spotify = new Spotify();
    spotify.setAccessToken(access_token);
    return spotify;
  }
}

export default streamAPI;
