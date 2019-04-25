const masterCharMap = {};

require('./character-sets').characterSets.forEach(map => {
  Object.entries(map).forEach(([k,v]) => {
    if (k === v) {
      return;
    }

    if (k.toUpperCase() === v.toUpperCase()) {
      return;
    }

    if (typeof masterCharMap[k] === 'undefined') {
      masterCharMap[k] = []
    }

    masterCharMap[k].push(v);
  });
});

process.stdout.write(JSON.stringify(masterCharMap, null, 2));
