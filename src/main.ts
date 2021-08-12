import cache from '@actions/cache';
import core from '@actions/core';
import exec from '@actions/exec';
import { RushConfiguration } from '@microsoft/rush-lib';
import getCache from './cache';

try {
  const rushConfig = RushConfiguration.loadFromDefaultLocation();

  const packageManager = rushConfig.packageManager;
  const { paths, restoreKeys, key } = getCache(packageManager);
  const cacheKey = await cache.restoreCache(paths, key, restoreKeys);
  core.saveState('cachePaths', paths);
  core.saveState('cacheKey', key);

  // run rush install if no cacheKey returned or repo state has changed
  if (typeof cacheKey === 'undefined' || cacheKey !== key) {
    await exec.exec('node', ['common/scripts/install-run-rush.js', 'install']);
    core.saveState('storeCache', true);
  } else {
    core.saveState('storeCache', false);
  }
} catch (error) {
  core.setFailed(error.message);
}
