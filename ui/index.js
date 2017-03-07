function createIcon(icon) {
  var svgNS = 'http://www.w3.org/2000/svg';
  var xlinkNS = 'http://www.w3.org/1999/xlink';
  var svg = document.createElementNS(svgNS, 'svg');
  svg.setAttributeNS(null, 'class', 'icon');
  var use = document.createElementNS(svgNS, 'use');
  use.setAttributeNS(xlinkNS, 'xlink:href', '#icon-' + icon);
  svg.appendChild(use);
  return svg;
}