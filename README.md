![logo](logo.png?raw=true)

#omg

__omg__ is a command-line utility to manage bookmarks with tag support, using the [Parse](http://parse.com) backend-as-a-service for storage and sync.


__WARNING:__ This is a work in progress, so please don't rely on it yet. If you really like to use it, my suggestion is to use your own Parse keys in the `models.js` file so you're in control of your data.

## Usage

Bellow are the currently implemented commands

```bash
# Store a bookmark. This fetches the page title and starts the interactive tagger
$ omg add http://google.com

# Listing your tags
$ omg tag

# Lookup bookmarks by tag(s), space-separated. If your tags have spaces, use
# quotes or escape them
$ omg tag node angular express

# Search bookmarks by title substring, case insensitive
$ omg search velociraptors

# Using `omg add` for the first time in a computer will walk you through the
# sign-up/log-in process, but you can manage authentication manually:
$ omg signup
$ omg login
$ omg logout
```

Your username and encripted password are stored in the Parse server, and your session key is stored in `~/.omgconfig`