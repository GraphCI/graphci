const base = {
  meta: { tags: [] },
};

const collapseMeta = (files) => {
  const meta = files.reduce((build, file) => Object.assign(build, file.meta), {});

  return files.concat({ meta });
};

module.exports = { base, collapseMeta };
