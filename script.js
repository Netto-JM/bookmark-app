const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = {};

// Show Modal, Focus on Input
function showModal() {
  modal.classList.add('show-modal');
  websiteNameEl.focus();
}

// Modal Event Listeners
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));
window.addEventListener('click', (e) => (e.target === modal ? modal.classList.remove('show-modal') : false));

function validateForm(nameValue, urlValue) {
  const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  const regex = new RegExp(expression);
  if (!nameValue || !urlValue) {
    alert('Please submit values for both fields.');
    return false;
  }
  if (!urlValue.match(regex)) {
    alert('Please provide a valid web address');
    return false;
  }
  // Valid
  return true;
}

function setMyGithubFavicon() {
  const myGithubFavicon = document.querySelector('img[src="https://s2.googleusercontent.com/s2/favicons?domain=https://github.com/Netto-JM"]');
  if (myGithubFavicon) {
    myGithubFavicon.setAttribute('src', 'favicon.ico');
  }
}

function buildBookmarksDOM() {
  // Remove all bookmark elements
  bookmarksContainer.textContent = '';
  // Build items
  Object.values(bookmarks).forEach(bookmark => {
    const {name, url} = bookmark;
    // Item
    const item = document.createElement('div');
    item.classList.add('item');
    // Close Icon
    const closeIcon = document.createElement('i');
    closeIcon.classList.add('fas', 'fa-times');
    closeIcon.setAttribute('title', 'Delete Bookmark');
    closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);
    // Favicon / Link Container
    const linkInfo = document.createElement('div');
    linkInfo.classList.add('name');
    // Favicon
    const favicon = document.createElement('img');
    favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
    favicon.setAttribute('alt', 'Favicon');
    // Link
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('target', '_blank');
    link.textContent = name;
    // Apend to bookmarks container
    linkInfo.append(favicon, link);
    item.append(closeIcon, linkInfo);
    bookmarksContainer.appendChild(item);
  });
  setMyGithubFavicon();
}

function fetchBookmarks() {
  // Get bookmarks from localStorage if available
  if (localStorage.getItem('bookmarks')) {
    bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
  } else {
    // Create a bookmarks array in localStorage
    const id = `https://github.com/Netto-JM`;
    bookmarks[id] =
      {
        name: 'JM Web Development',
        url: 'https://github.com/Netto-JM',
      };
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }
  buildBookmarksDOM();
}

function deleteBookmark(id) {
  if (bookmarks[id]) {
    delete bookmarks[id];
  }
  //Update bookmarks array in localStorage, re-populate DOM
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  fetchBookmarks();
}

// Handle Data from Form
function storeBookmark(e) {
  e.preventDefault();
  const nameValue = websiteNameEl.value;
  let urlValue = websiteUrlEl.value;
  if (!urlValue.includes('https://') && !urlValue.includes('http://')) {
    urlValue = `https://${urlValue}`; 
  }
  if (!validateForm(nameValue, urlValue)) {
    return false;
  }
  bookmarks[urlValue] = {
    name: nameValue,
    url: urlValue
  };
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  fetchBookmarks();
  bookmarkForm.reset();
  websiteNameEl.focus();
}

// Event Listener
bookmarkForm.addEventListener('submit', storeBookmark);

// On Load, Fetch Bookmarks
fetchBookmarks();