const {stdout} = process;
const {app} = require('./lib/app');
const port = process.env.PORT || 4000;

const main = () => {
  app.listen(port, () => stdout.write(`server listening on ${port}\n`));
};

main();
