const startDocker = require('./docker');

const docker = startDocker();
const imagePullCache = {};

const pullImage = (image) => {
  if (!imagePullCache[image]) {
    console.log(`Starting docker pull of: ${image}`);

    imagePullCache[image] = new Promise((resolve, reject) => {
      const onFinished = (error) => {
        if (error) {
          return reject(error);
        }

        console.log(`Finished docker pull: ${image}`);

        return resolve();
      };

      const onProgress = (event) => {
        // console.log(`${image} pulling progress: ${event.status}`);
      };

      docker.pull(image, (error, stream) => {
        if (error) {
          return reject(error);
        }

        return docker.modem.followProgress(stream, onFinished, onProgress);
      });
    });
  }

  return imagePullCache[image];
};

module.exports = pullImage;
