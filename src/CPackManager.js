import {CHelperCore, createWasmFuture} from '@/libCHelperWeb.js';

const VERSION_RELEASE = '1.21.51.02';
const VERSION_BETA = '1.21.60.27';
const VERSION_NETEASE = '1.20.10.25';

export const DEFAULT_BRANCH = 'release-experiment';

export const ALL_BRANCH = [
    "release-vanilla",
    "release-experiment",
    "beta-vanilla",
    "beta-experiment",
    "netease-vanilla",
    "netease-experiment"
];

export const ALL_BRANCH_CHINESE = [
    "正式版-原版-" + VERSION_RELEASE,
    "正式版-实验性玩法-" + VERSION_RELEASE,
    "测试版-原版-" + VERSION_BETA,
    "测试版-实验性玩法-" + VERSION_BETA,
    "中国版-原版-" + VERSION_NETEASE,
    "中国版-实验性玩法-" + VERSION_NETEASE
];

let cpackCache = {};

export async function getCore(branch) {
    let cpack = cpackCache[branch]
    if (cpack === undefined) {
        cpack = await fetch(getRealFileName(branch))
            .then((response) => response.arrayBuffer())
            .then(async (cpack) => {
                return new Uint8Array(cpack);
            });
        cpackCache[branch] = cpack;
    }
    await createWasmFuture;
    return new CHelperCore(cpack);
}

export function getRealFileName(branch) {
    switch (branch) {
        case "release-vanilla" :
            return "release-vanilla-" + VERSION_RELEASE + ".cpack";
        case "release-experiment":
            return "release-experiment-" + VERSION_RELEASE + ".cpack";
        case "beta-vanilla":
            return "beta-vanilla-" + VERSION_BETA + ".cpack";
        case "beta-experiment" :
            return "beta-experiment-" + VERSION_BETA + ".cpack";
        case "netease-vanilla":
            return "netease-vanilla-" + VERSION_NETEASE + ".cpack";
        case "netease-experiment" :
            return "netease-experiment-" + VERSION_NETEASE + ".cpack";
        default :
            return getRealFileName(DEFAULT_BRANCH);
    }
}
