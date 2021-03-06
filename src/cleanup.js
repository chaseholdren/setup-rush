import cache from '@actions/cache';
import core from '@actions/core';

async function run() {
  const paths = core.getState('cachePaths');
  const key = core.getState('cacheKey');

  try {
    if (core.getState('storeState')) {
      await cache.saveCache(paths, key);
    }
  } catch (error) {
    if (error.message.includes('Cache already exists')) {
      core.info(`Cache entry ${key} has already been created by another worfklow`);
    } else {
      throw error;
    }
  }
}

run();
