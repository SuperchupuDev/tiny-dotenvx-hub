import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

function convertFullUsernameToEnvFormat(fullUsername) {
  // gh/motdotla => GH_MOTDOTLA_DOTENVX_TOKEN
  return fullUsername
    .toUpperCase()
    .replace(/\//g, '_') // Replace all slashes with underscores
    .concat('_DOTENVX_TOKEN'); // Append '_DOTENVX_TOKEN' at the end
}

function findFirstMatchingKey() {
  if (!config.store) {
    return null;
  }

  const dotenvxTokenValue = config.get('DOTENVX_TOKEN');

  for (const [key, value] of Object.entries(config.store)) {
    if (key !== 'DOTENVX_TOKEN' && value === dotenvxTokenValue) {
      return key;
    }
  }

  return null; // Return null if no matching key is found
}

function parseUsernameFromTokenKey(key) {
  // Remove the leading GH_/GL_ and trailing '_DOTENVX_TOKEN'
  const modifiedKey = key.replace(/^(GH_|GL_)/, '').replace(/_DOTENVX_TOKEN$/, '');

  // Convert to lowercase
  return modifiedKey.toLowerCase();
}

function getConfigDirectory() {
  switch (process.platform) {
    case 'win32': {
      return process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming');
    }
    case 'darwin': {
      return path.join(os.homedir(), 'Library', 'Preferences');
    }
    default: {
      return process.env.XDG_CONFIG_HOME || path.join(os.homedir(), '.config');
    }
  }
}

function getConfigPath() {
  return path.join(getConfigDirectory(), 'tiny-dotenvx-hub', 'config.json');
}

class Config {
  constructor() {
    this.path = getConfigPath();
    this.store = fs.existsSync(this.path)
      ? JSON.parse(fs.readFileSync(this.path, 'utf8'))
      : void fs.mkdirSync(path.dirname(this.path), { recursive: true });
  }

  #write() {
    return fs.writeFileSync(this.path, JSON.stringify(this.store, null, 2));
  }

  get(key) {
    return this.store?.[key];
  }

  set(key, value) {
    if (this.store) {
      this.store[key] = value;
    } else {
      this.store = { [key]: value };
    }

    return this.#write();
  }

  delete(key) {
    delete this.store[key];
    return this.#write();
  }
}

export const config = new Config();

export const getHostname = () => config.get('DOTENVX_HOSTNAME') || 'https://hub.dotenvx.com';

export const getUsername = () => {
  const key = findFirstMatchingKey();

  if (key) {
    return parseUsernameFromTokenKey(key);
  }
  return null;
};

export const getToken = () => config.get('DOTENVX_TOKEN');

export const setToken = (fullUsername, accessToken) => {
  // current logged in user
  config.set('DOTENVX_TOKEN', accessToken);

  // for future use to switch between accounts locally
  const memory = convertFullUsernameToEnvFormat(fullUsername);
  config.set(memory, accessToken);

  return accessToken;
};

export const setHostname = hostname => {
  config.set('DOTENVX_HOSTNAME', hostname);

  return hostname;
};

export const deleteToken = () => {
  // memory user
  const key = findFirstMatchingKey(); // GH_MOTDOTLA_DOTENVX_TOKEN
  config.delete(key);

  // current logged in user
  config.delete('DOTENVX_TOKEN');

  return true;
};

export const deleteHostname = () => {
  config.delete('DOTENVX_HOSTNAME');

  return true;
};

export const configPath = () => config.path;
