# deno_shot

A Deno module/cli to capture web page screenshots.

![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/fakoua/denoshot?style=for-the-badge)
![GitHub](https://img.shields.io/github/license/fakoua/denoshot?style=for-the-badge)
![GitHub last commit](https://img.shields.io/github/last-commit/fakoua/denoshot?style=for-the-badge)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/fakoua/denoshot/Deno%20CI?style=for-the-badge)

## Features

- Capture web url in headless mode.
- Supports Window Size.
- Supports fullscreen size.

## CLI Installation

```
deno install -A --unstable -f -n denoshot https://deno.land/x/deno_shot/mod.ts
```
or

```
deno install -A --unstable -f -n denoshot https://x.nest.land/deno_shot@1.0.3/mod.ts
```

or with dpx

```
dpx deno_shot -A --unstable --reload --url=https://www.google.com --image=c:\folder\image.png
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
