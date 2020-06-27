import * as utils from "./src/utils.ts";
import { Config, defaultConfig, sizeToString, stringToSize } from "./src/Config.ts";
import { parse } from "https://deno.land/std/flags/mod.ts";
import * as ink from "https://deno.land/x/ink/mod.ts";

export async function Capture(config: Config): Promise<Config> {
    config = defaultConfig(config);
    const chrome = await utils.getChromium();
    const cmd = [
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
        const size = await utils.getScreenResolution();
        cmd.push(`--window-size=${sizeToString(size)}`)
    } else {
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

const opts = {
    default: {
        size: "800,600",
        max: false,
        image: "C:\\temp\\screenshot.png",
        debug: false
    }
};

const argsv = parse(Deno.args, opts)

if (import.meta.main) {
    if (argsv.url === undefined) {
        // print help
        ink.terminal.log("<u>Thank you for using deno_shot.</u>")
        ink.terminal.log("Usage:")
        ink.terminal.log("   <b>deno_shot</b> <red>--url=https://www.example.com</red> <yellow>[--image=path.png] [--size=w,h] [--max=true|false] [--debug=true|false]</yellow>")
        ink.terminal.log("")
        ink.terminal.log("   <blue>The following arguments are available:</blue>")
        ink.terminal.log("")
        ink.terminal.log("        --url           - Sets the web page url (starts with protocol http/https)")
        ink.terminal.log("        --image         - Sets the output image [Default c:\\temp\\screenshot.png]")
        ink.terminal.log("        --size          - Sets the output image size as width,height [Default 800,600]")
        ink.terminal.log("        --max           - Capture in full screen [Default false] (overrides --size)")
        ink.terminal.log("        --debug         - Output extra information in console [Default false]")
        ink.terminal.log("")
        ink.terminal.log("   <magenta>deno_shot version 1.0.3</magenta>")
        ink.terminal.log("")
    } else {
        const config: Config = {
            url: argsv.url,
            maximized: argsv.max,
            image: argsv.image,
            windowSize: stringToSize(argsv.size)
        };
        const result = await Capture(config)
    
        if (argsv.debug) {
            console.log(result)
        }
    }
}
