var fs = require("fs");
const path = require("path");
var JavaScriptObfuscator = require("javascript-obfuscator");

function obfuscateJS(DIR, OUTDIR) {
  fs.readdir(DIR, (err, files) => {
    files.forEach((file) => {
      // get the details of the file
      let fileDetails = fs.lstatSync(path.resolve(DIR, file));
      // check if the file is dirapp

      if (fileDetails.isFile() && path.extname(file) === ".js") {
        fs.readFile(DIR + "/" + file, "UTF-8", function (err, data) {
          if (err) {
            throw err;
          }
          var obfuscationResult = JavaScriptObfuscator.obfuscate(data);
          if (!fs.existsSync(OUTDIR)) {
            fs.mkdirSync(OUTDIR);
          }
          fs.writeFile(
            OUTDIR + "/" + file,
            obfuscationResult.getObfuscatedCode(),
            function (err) {
              if (err) {
                return console.log(err);
              }
              console.log("OBFUSCATED File--->" + DIR + "/" + file);
            }
          );
        });
      } else if (fileDetails.isDirectory()) {
        obfuscateJS(DIR + "/" + file, OUTDIR + "/" + file);
      } else {
      }
    });
  });
}
obfuscateJS("./app", "./appbuild");
obfuscateJS("./build", "./build");
