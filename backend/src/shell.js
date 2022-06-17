const pythonShell = require('python-shell');

let options = {
  scriptPath: '../../transparent-psi-results/',
  args: []
}

this.jobRunner = scriptName => {
  return new Promise((resolve, reject) => {
    pythonShell.run(scriptName, options, (err, results) => {
      if (err) return reject(err);
      return resolve(results);
    });
  });
};

module.exports = this;
