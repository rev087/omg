![logo](logo.png?raw=true)

#omg

__omg__ is a command-line utility to manage bookmarks with tag support, using the [Parse](http://parse.com) backend-as-a-service for storage and sync.

It's a work in progress, and right now it only stores the bookmarks with no way to retrieve them.

## Usage

Bellow are the currently implemented commands

```bash
# Store a bookmark. This fetches the page title and starts the interactive tagger
$ omg add http://google.com

# Listing your tags
$ omg tag

# Using `omg add` for the first time in a computer will walk you through the
# sign-up/log-in process, but you can manage authentication manually:
$ omg signup
$ omg login
$ omg logout
```

Your username and encripted password are stored in the Parse server, and your session key is stored in `~/.omgconfig`