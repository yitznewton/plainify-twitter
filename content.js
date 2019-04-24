const deScreenreadEmoji = (node) => {
  const emoji = node.querySelectorAll('.Emoji');

  if (emoji) {
    emoji.forEach(el => {
      el.removeAttribute('aria-label');
      el.removeAttribute('title');
    });
  }
};

const traverseNodes = (node) => {
  if (node.classList && node.classList.contains('fullname')) {
    deScreenreadEmoji(node);
  } else if (node.childNodes) {
    node.childNodes.forEach(traverseNodes);
  }
}

document.querySelectorAll('.fullname').forEach(deScreenreadEmoji);

const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(traverseNodes);
  });
});

const config = {
  attributes: false,
  childList: true,
  characterData: true,
  subtree: true
};

observer.observe(document, config);
