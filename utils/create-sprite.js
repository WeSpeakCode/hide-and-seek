var fs = require("fs"),
  PNG = require("pngjs").PNG;
 
fs.createReadStream("./utils/player.png")
  .pipe(
    new PNG({
      filterType: 4,
    })
  )
  .on("parsed", function () {
    for (var y = 0; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {
        var idx = (this.width * y + x) << 2;
 
        if (this.data[idx] >= 200 && 
            this.data[idx + 1] === 0 && 
            this.data[idx + 2] >= 200 && 
            this.data[idx + 3] === 255) {
            this.data[idx] = 207;
            this.data[idx + 1] = 217;
            this.data[idx + 2] = 238;
        }
        if (this.data[idx] === 0 && 
            this.data[idx + 1] === 0 && 
            this.data[idx + 2] >= 250 && 
            this.data[idx + 3] === 255) {
                this.data[idx] = 114;
                this.data[idx + 1] = 129;
                this.data[idx + 2] = 179;
        }
      }
    }
 
    this.pack().pipe(fs.createWriteStream("out.png"));
  });