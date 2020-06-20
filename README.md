# deno_shot

A Deno module/cli to capture web page screenshots.

[![Build Status](https://github.com/fakoua/deno_shot/workflows/CI/badge.svg?branch=master&event=push)](https://github.com/fakoua/deno_shot/actions)
[![Build Status](https://github.com/fakoua/deno_shot/workflows/CI-Windows/badge.svg?branch=master&event=push)](https://github.com/fakoua/deno_shot/actions)

## Features

- Capture web url in headless mode.
- Supports Window Size.
- Supports fullscreen size.

## CLI Installation

```
deno install -A --unstable -n denoshot https://deno.land/x/deno_shot/mod.ts -f
```
or
```
deno install -A --unstable -n denoshot https://x.nest.land/deno_shot@0.0.4/mod.ts -f
```

## CLI Examples

Capture www.google.com website with window size 700x600 px
```sh
denoshot --url=https://www.google.com --image=c:\temp\img.png --size=700,600
```
denoshot command line supports the following arguments:

```
--url: required - Web Page, format: --url=https://www.github.com
--size: optional (default 800,600) - Window Size, format: --size=w,h
--max: optional (default false) - Full Screen, format: --max=true (Overrides --size)
--image: recommended (default c:\temp\screenshot.png) - Specify the output image, format: --image=C:\MyFolder\Test.png
--debug: optional (default false) - Prints debug data.
```

## Using with Deno

```ts
import { Capture } from 'https://deno.land/x/deno_shot/mod.ts'

let res = await Capture({
    url: 'https://www.github.com',
    image: 'C:\\sam\\image.png',
    maximized: false, 
    windowSize: {
        width: 1000,
        height: 890
    }
});

if (res.success) {
    console.log(res.image)
}
```

To run the script:

```sh
deno run -A --unstable myfile.ts
```

## Capture Argument

```ts
Capture(config: Config)

Config: {
    /**
     * Full Path of the output image (png only).
     * Default: C:\temp\screenshot.png
     */
    image?: string,

    /**
     * Window Size (ignored if Maximize is true).
     * Default: 800, 600
     */
    windowSize?: Size = {
        width: number, 
        height: number
    }

    /**
     * Capture full screen url (overrides windowSize).
     * Default: false
     */
    maximized?: boolean,

    /**
     * URL Page to capture.
     */
    url: string,

    /**
     * Used in the return: true when success.
     */
    success?: boolean
}
```

## Note

DenoShot will download chrome at firt run.
