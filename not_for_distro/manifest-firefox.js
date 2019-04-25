exports.manifest = Object.assign(require('./manifest-base'), {
  browser_specific_settings: {
    gecko: {
      id: '{19835edb-061a-48e1-a41c-4afa0e827cd7}',
      strict_min_version: '42.0'
    }
  }
});
