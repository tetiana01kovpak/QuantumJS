// IMPORTS
import {
  header,
  burgerButton,
  closeButton,
  closeButtonTablet,
  headerBackdrop,
} from './refs';

// EVENT LISTENERS

header.addEventListener('click', toggleNavMenu);
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && header.classList.contains('menu-open')) {
    header.classList.remove('menu-open');
    document.body.classList.remove('no-scroll');
  }
});

// RENDER
export function toggleNavMenu(event) {
  if (burgerButton.contains(event.target)) {
    header.classList.add('menu-open');
    document.body.classList.add('no-scroll');
  } else if (
    closeButton.contains(event.target) ||
    closeButtonTablet.contains(event.target) ||
    headerBackdrop.contains(event.target)
  ) {
    header.classList.remove('menu-open');
    document.body.classList.remove('no-scroll');
  } else {
    return;
  }
}

window.addEventListener('resize', () => {
  if (window.innerWidth >= 1440 && header.classList.contains('menu-open')) {
    header.classList.remove('menu-open');
    document.body.classList.remove('no-scroll');
  }
});