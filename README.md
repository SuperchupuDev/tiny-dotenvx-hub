# tiny-dotenvx-hub

My approach to `dotenvx-ext-hub` but cleaner and with 95% less dependencies, making use of the most recent cutting-edge Node APIs.

Made for personal use as i don't want to install a whole 133 dependencies just for this extension.

You can use it if you want though, it's just not official (and doesn't include binary releases) Just make sure you have Node 22.0.0 or higher.

```sh
npm i -D fast-dotenvx-hub
```

## Usage

```sh
$ env-hub
Usage: env-hub [options] [command]

A tiny and modern alternative to the deprecated dotenvx-ext-hub

Options:
  -l, --log-level <level>     set log level (default: "info")
  -q, --quiet                 sets log level to error
  -v, --verbose               sets log level to verbose
  -d, --debug                 sets log level to debug
  -V, --version               output the version number
  -h, --help                  display help for command

Commands:
  login [options]             authenticate to dotenvx hub
  push [options] [directory]  push .env.keys to dotenvx hub
  pull [options] [directory]  pull .env.keys from dotenvx hub
  open [options]              view repository on dotenvx hub
  token [options]             print the auth token dotenvx hub is configured to use
  status                      display logged in user
  logout [options]            log out this machine from dotenvx hub
  help [command]              display help for command
```
