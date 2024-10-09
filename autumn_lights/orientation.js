// lights up pixel 0 for each member of the grid. helpful for orienting them properly.

export function render(index) {
  if (index == 0 || index == 36
      || index == 72
      || index == 108
      || index == 144
      || index == 180
      || index == 216
      || index == 252
      || index == 288
      || index == 324
      || index == 360
      || index == 396
      || index == 432
      || index == 468
      || index == 504
      || index == 540) {
  
    hsv(0.5, 0, 1);
  }
}
