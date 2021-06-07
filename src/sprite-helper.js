import { PLAYER_SPRITE_WIDTH, PLAYER_SPRITE_HEIGHT } from './constants';
import { rgbFromName } from './utils';

const colorKeys = ['red', 'brown', 'orange', 'yellow', 'pink', 'purple', 'blue', 'cyan', 'green', 'lime', 'white', 'black'];

export const createAllColorPlayers = (game) => {
    for (let i=0;i<colorKeys.length;i++) {
        createPlayerSprite(game, colorKeys[i]);
    }
}

function createPlayerSprite(game, key) {
    var sheet = game.textures.get('player').getSourceImage();
    var canvasTexture = game.textures.createCanvas('player' + '-temp', sheet.width, sheet.height);
    var canvas = canvasTexture.getSourceImage();
    var context = canvas.getContext('2d');
    context.drawImage(sheet, 0, 0);
    var imageData = context.getImageData(0, 0, sheet.width, sheet.height);
    var pixelArray = imageData.data;
    for (var p = 0; p < pixelArray.length / 4; p++) {
      var index = 4 * p;
  
      var r = pixelArray[index];
      var g = pixelArray[++index];
      var b = pixelArray[++index];
      var alpha = pixelArray[++index];
  
      // If this is a transparent pixel, ignore, move on.
      if (alpha === 0) {
        continue;
      }
  
      var oldColor = { r: 200, g: 0, b: 200 };//pink color
      var newColor = rgbFromName(key);
  
      // If the color matches, replace the color.
      if (r >= oldColor.r && g === oldColor.g && b > oldColor.b && alpha === 255) {
        pixelArray[--index] = newColor.b;
        pixelArray[--index] = newColor.g;
        pixelArray[--index] = newColor.r;
      }
  
    }
    // Put our modified pixel data back into the context.
    context.putImageData(imageData, 0, 0);
  
    // Add the canvas as a sprite sheet to the game.
    game.textures.addSpriteSheet('player-' + key, canvasTexture.getSourceImage(), {
      frameWidth: PLAYER_SPRITE_WIDTH,
      frameHeight: PLAYER_SPRITE_HEIGHT,
    });
  
    game.textures.get('player' + '-temp').destroy();
  }
  