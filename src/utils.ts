import { join }  from "https://deno.land/std/path/mod.ts";
import { ensureDir } from "https://deno.land/std/fs/ensure_dir.ts";
import { exists } from "https://deno.land/std/fs/exists.ts";

export async function getChromium(): Promise<string> {
    let binPath = await getChromiumPath();
    let chrome = join(binPath, "chrome.exe");
    if (await exists(chrome)) {
        return chrome;
    }
    // download chrome
    return chrome;
}

export async function getChromiumPath(): Promise<string> {
    let binFolder = join(getDenoDir(), "bin/webcapture/chrome-win")
    let ex = await exists(binFolder)
    if (ex) {
        return binFolder;
    }
    //Ensure directory
    await ensureDir(binFolder)
    return binFolder;
}

export function getDenoDir(): string {
    let os = getOS();
    let homeKey: string = os == OS.windows ? 'USERPROFILE' : 'HOME'
    let homeDir = Deno.env.get(homeKey)
    let relativeDir = "";

    switch (os) {
        case OS.windows:
            relativeDir = "AppData/Local/deno"
            break;
        case OS.linux:
            relativeDir = ".cache/deno"
            break;
        case OS.darwin:
            relativeDir = "Library/Caches/deno"
            break;
    }

    if (homeDir === undefined) {
        return "";
    }
    else 
    {
        return join(homeDir, relativeDir)
    }
}

export function getOS(): OS {
    return OS[Deno.build.os];
}

export enum OS {
   windows = "windows",
   linux = "linux",
   darwin = "darwin",
}

export async function downloadChromium() {
    let tempFolder = await Deno.makeTempDir();
    console.log(tempFolder);
    let downloadUrl = "https://file-examples.com/wp-content/uploads/2017/02/zip_2MB.zip";
    let result = await fetch(downloadUrl);
    let blob = await result.blob();
    let zipFile = join(tempFolder, "chrome.zip");
    await Deno.writeFile(zipFile, new Uint8Array(await blob.arrayBuffer()));
}