const electron = require('electron');

// Set the token before the page loads
if (window.location.hostname === 'discordapp.com') {
  localStorage.setItem('token', `"${process.env.DISCORD_TOKEN.replace(/"/g, '')}"` || '');
}
