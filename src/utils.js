export const getQueryParameter = (name, url = window.location.href) => {
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

export const updateQueryParameter = (
  key,
  value,
  url = window.location.href,
) => {
  var re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i');
  var separator = url.indexOf('?') !== -1 ? '&' : '?';
  if (url.match(re)) {
    return url.replace(re, '$1' + key + '=' + value + '$2');
  } else {
    return url + separator + key + '=' + value;
  }
};

export const getRandomString = (length) => {
  const letters = [];
  const hex = '0123456789abcdef';
  for (let i = 0; i < length; i++) {
    letters[i] = hex[Math.floor(Math.random() * hex.length)];
  }
  return letters.join('');
};

export const comparer = (otherArray) => {
  return function (current) {
    return otherArray.filter(function (other) {
      return other.id == current.id
    }).length == 0;
  }
}

// replacement color for pink color in the sprite
export const rgbForPink = (colorName) => {
  const defaultColor = { r: 255, g: 0, b: 0 };
  const colorMap = {
    'red': { r: 182, g: 0, b: 15 },
    'brown': { r: 93, g: 57, b: 23 },
    'orange': { r: 233, g: 104, b: 15 },
    'yellow': { r: 244, g: 249, b: 71 },
    'pink': { r: 230, g: 54, b: 172 },
    'purple': { r: 87, g: 20, b: 172 },
    'blue': { r: 15, g: 16, b: 190 },
    'cyan': { r: 55, g: 255, b: 210 },
    'green': { r: 21, g: 111, b: 34 },
    'lime': { r: 72, g: 242, b: 44 },
    'white': { r: 206, g: 216, b: 237 },
    'black': { r: 48, g: 55, b: 61 },
  };
  return colorMap[colorName] || defaultColor;
}

export const rgbForBlue = (colorName) => {
  const defaultColor = { r: 255, g: 0, b: 0 };
  const colorMap = {
    'red': { r: 103, g: 0, b: 43 },
    'brown': { r: 75, g: 27, b: 17 },
    'orange': { r: 162, g: 44, b: 18 },
    'yellow': { r: 181, g: 118, b: 28 },	
    'pink': { r: 152, g: 12, b: 156 },
    'purple': { r: 44, g: 6, b: 105 },
    'blue': { r: 9, g: 0, b: 124 },	
    'cyan': { r: 35, g: 152, b: 177 },
    'green': { r: 13, g: 61, b: 35 },
    'lime': { r: 27, g: 155, b: 51 },	
    'white': { r: 113, g: 128, b: 178 },	
    'black': { r: 23, g: 23, b: 29 },
  };
  return colorMap[colorName] || defaultColor;
}

export const printSpriteInfo = (sprite, scene) => {
  console.log('Sprite: ' + ' (' + sprite.width + ' x ' + sprite.height + ')');
  console.log('x: ' + sprite.x.toFixed(1) + ' y: ' + sprite.y.toFixed(1));
  console.log('angle: ' + sprite.angle.toFixed(1) + ' rotation: ' + sprite.rotation.toFixed(1));
  console.log('visible: ' + sprite.visible + ' in camera: ' + sprite.inCamera);
  console.log('bounds x: ' + sprite._bounds);
}

export const colorKeys = () => {
  return ['red', 'brown', 'orange', 'yellow', 'pink', 'purple', 'blue', 'cyan', 'green', 'lime', 'white', 'black'];
}
