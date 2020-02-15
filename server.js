const {stdout} = process;
const {app} = require('./lib/app');

const main = (port = 4000) => {
  app.listen(port, () => stdout.write(`server listening on ${port}\n`));
};

main(process.argv[2]);
