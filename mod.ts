import * as utils from "./src/utils.ts";
import { Config, defaultConfig, sizeToString, stringToSize } from "./src/Config.ts";
import { parse } from "https://deno.land/std/flags/mod.ts";

export async function Capture(config: Config): Promise<Config> {
    config = defaultConfig(config);
    var chrome = await utils.getChromium();
    var cmd = [
        chrome,
        "--headless",
        "--disable-gpu",
        `--screenshot=${config.image}`,
        "--disable-background-networking",
        "--enable-features=NetworkService,NetworkServiceInProcess",
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--disable-breakpad",
        "--disable-client-side-phishing-detection",
        "--disable-component-extensions-with-background-pages",
        "--disable-default-apps",
        "--disable-dev-shm-usage",
        "--disable-extensions",
        "--disable-features=TranslateUI",
        "--disable-hang-monitor",
        "--disable-ipc-flooding-protection",
        "--disable-popup-blocking",
        "--disable-prompt-on-repost",
        "--disable-renderer-backgrounding",
        "--disable-sync",
        "--force-color-profile=srgb",
        "--metrics-recording-only",
        "--no-first-run",
        "--password-store=basic",
        "--use-mock-keychain",
        "--hide-scrollbars",
        "--mute-audio",
        "--disable-infobars",
    ];

    if (config.maximized) {
        let size = await utils.getScreenResolution();
        cmd.push(`--window-size=${sizeToString(size)}`)
    } 
    else {
        cmd.push(`--window-size=${sizeToString(config.windowSize)}`)
    }
    cmd.push(config.url);

    const p = Deno.run({
        cmd: cmd,
        stdout: "null",
        stderr: "null",
    });

    const res = await p.status();
    config.success = res.success;
    p.close();
    return config;
}

let opts = {
    default: {
        size: '800,600',
        max: false,
        image: "C:\\temp\\screenshot.png",
        debug: false
    }
};

let argsv = parse(Deno.args, opts)

if (argsv.url != undefined) {
    let config: Config = {
        url: argsv.url,
        maximized: argsv.max,
        image: argsv.image,
        windowSize: stringToSize(argsv.size)
    };
    let result = await Capture(config)

    if (argsv.debug) {
        console.log(result)
    }
}
