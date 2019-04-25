module.exports = {
  name: 'Plainify Twitter',
  description: 'Make Twitter more plain for screenreaders',
  version: '0.3.0',
  manifest_version: 2,
  author: 'yitznewton@hotmail.com',
  permissions: ['activeTab', 'storage'],
  content_scripts: [
  {
    matches: ['https://*.twitter.com/*'],
    run_at: 'document_end',
    js: ['content.js']
  }
],
  options_ui: {
  page: 'options.html'
},
  web_accessible_resources: ['character-map.json']
};
