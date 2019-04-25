const myBrowser = (typeof browser !== 'undefined' && browser) ||
  window.msBrowser ||
  window.browser ||
  window.chrome;

const deemoji = document.getElementById('deemoji-input');
const defancy = document.getElementById('defancy-input');

myBrowser.storage.sync.get(['setting_deemoji', 'setting_defancy'], results => {
  if (typeof results.setting_deemoji !== 'undefined') {
    deemoji.checked = results.setting_deemoji;
  }

  if (typeof results.setting_defancy !== 'undefined') {
    defancy.checked = results.setting_defancy;
  }
});

deemoji.addEventListener('change', function() {
  myBrowser.storage.sync.set({setting_deemoji: this.checked});
});

defancy.addEventListener('change', function() {
  myBrowser.storage.sync.set({setting_defancy: this.checked});
});
