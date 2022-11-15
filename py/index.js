const { PythonShell } = require("python-shell");

(async function () {
   let pyshell = new PythonShell("main.py", { args: ["192.168.1.45:8999"] });
   pyshell.on("message", function (message) {
      let pt = /[\('\,\)]/gi
      let ms = message.replace(pt, '')
      console.log("ms:", ms);
   });
})();

