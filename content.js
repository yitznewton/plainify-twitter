const myBrowser = (typeof browser !== 'undefined' && browser) ||
  window.msBrowser ||
  window.browser ||
  window.chrome;

const deFancyString = (charMap, string) => {
  Object.entries(charMap).forEach(([regular, fanciesRegExp]) => {
    string = string.replace(fanciesRegExp, regular);
  });

  return string;
};

const hasFancyChars = (charMap, node) => {
  if (!node.textContent) {
    return false;
  }

  return !!Object.values(charMap).find(regExp => node.textContent.match(regExp));
};

const deScreenReadEmoji = (node) => {
  const emoji = node.querySelectorAll('.Emoji');

  if (emoji) {
    emoji.forEach(el => {
      el.removeAttribute('aria-label');
      el.removeAttribute('title');
    });
  }
};

const deFancyNode = (charMap, node) => {
  if (!hasFancyChars(charMap, node)) {
    return;
  }

  const nodeForScreenReader = node.cloneNode(true);
  node.setAttribute('aria-hidden', true);
  node.removeAttribute('data-aria-label-part');

  nodeForScreenReader.style = 'position:absolute; left:-999em;';

  nodeForScreenReader.childNodes.forEach(child => {
    if (child.nodeName !== '#text') {
      return;
    }

    child.textContent = deFancyString(charMap, child.textContent);
  });

  node.parentNode.appendChild(nodeForScreenReader);
};

const traverseNodes = (charMap, settings, node) => {
  if (!node) {
    return;
  }

  if (node.classList && node.classList.contains('fullname')) {
    if (settings.setting_deemoji) {
      deScreenReadEmoji(node);
    }

    if (settings.setting_defancy) {
      deFancyNode(charMap, node);
    }
  } else if (settings.setting_defancy && node.classList && node.classList.contains('tweet-text')) {
    deFancyNode(charMap, node);
  } else if (node.childNodes) {
    node.childNodes.forEach(partialApply(traverseNodes, settings, charMap));
  }
};

const deFancyTitle = (charMap) => {
  const title = document.getElementsByTagName('TITLE').item(0);

  if (title) {
    title.textContent = deFancyString(charMap, title.textContent);
  }
};

const loadCharMap = () => {
  return fetch(myBrowser.runtime.getURL('./character-map.json'))
    .then(response => response.json())
    .then(json => {
      const charMap = {};
      Object.entries(json).forEach(([k, v]) => {
        charMap[k] = new RegExp('[' + v.join('') + ']', 'gu');
      });

      return charMap;
    });
};

const loadSettings = async () => {
  return new Promise(resolve => {
    myBrowser.storage.sync.get(['setting_deemoji', 'setting_defancy'], resolve);
  });
};

const any = (values) => {
  return values.reduce((cum, cur) => {
    return cum || cur;
  }, false);
};

const partialApply = (f, a) => b => f(a, b);

const settingOn = (settings, key) => {
  return typeof settings[key] === 'undefined' || settings[key];
};

(async () => {
  const [charMap, settings] = await Promise.all([loadCharMap(), loadSettings()]);

  if (settingOn(settings, 'setting_defancy')) {
    deFancyTitle(charMap);
    document.querySelectorAll('.tweet-text').forEach(partialApply(deFancyNode, charMap));
  }

  if (settingOn(settings, 'setting_deemoji')) {
    document.querySelectorAll('.fullname').forEach(deScreenReadEmoji);
  }

  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(partialApply(traverseNodes, charMap, settings));

      if (settings.setting_defancy && mutation.target.nodeName === 'TITLE') {
        mutation.target.textContent = deFancyString(charMap, mutation.target.textContent);
      }
    });
  });

  const config = {
    attributes: false,
    childList: true,
    characterData: true,
    subtree: true
  };

  observer.observe(document, config);
})();
