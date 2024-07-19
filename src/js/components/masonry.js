let msnry;

if (window.matchMedia("(max-width: 968px)").matches) {
  msnry = new Masonry('.manager__columns', {
    itemSelector: '.column',
    gutter: 10,
    cols: 2
  });
} else if (window.matchMedia("(max-width: 668px)").matches) {
  msnry = new Masonry('.manager__columns', {
    itemSelector: '.column',
    gutter: 10,
    cols: 1
  });
} else {
  msnry = new Masonry('.manager__columns', {
    itemSelector: '.column',
    gutter: 20,
    cols: 3
  });
}

export { msnry };
