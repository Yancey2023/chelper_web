import { CHelperCore, createWasmFuture } from '@/core/libCHelperWeb.js'

import releaseVanillaCPack from '@/assets/release-vanilla-1.21.93.1.cpack?url'
import releaseExperimentCPack from '@/assets/release-experiment-1.21.93.1.cpack?url'
import betaVanillaCPack from '@/assets/beta-vanilla-1.21.100.23.cpack?url'
import betaExperimentCPack from '@/assets/beta-experiment-1.21.100.23.cpack?url'
import neteaseVanillaCPack from '@/assets/netease-vanilla-1.21.0.03.cpack?url'
import neteaseExperimentCPack from '@/assets/netease-experiment-1.21.0.03.cpack?url'

const VERSION_RELEASE = '1.21.93.1'
const VERSION_BETA = '1.21.100.23'
const VERSION_NETEASE = '1.21.0.03'

export const DEFAULT_BRANCH = 'release-experiment'

export const ALL_BRANCH = [
  'release-vanilla',
  'release-experiment',
  'beta-vanilla',
  'beta-experiment',
  'netease-vanilla',
  'netease-experiment',
]

export const ALL_BRANCH_CHINESE = [
  '正式版-原版-' + VERSION_RELEASE,
  '正式版-实验性玩法-' + VERSION_RELEASE,
  '测试版-原版-' + VERSION_BETA,
  '测试版-实验性玩法-' + VERSION_BETA,
  '中国版-原版-' + VERSION_NETEASE,
  '中国版-实验性玩法-' + VERSION_NETEASE,
]

let cpackCache = {}

export async function getCore(branch) {
  let cpack = cpackCache[branch]
  if (cpack === undefined) {
    cpack = await fetch(getRealFileName(branch))
      .then((response) => response.arrayBuffer())
      .then(async (cpack) => {
        return new Uint8Array(cpack)
      })
    cpackCache[branch] = cpack
  }
  await createWasmFuture
  return new CHelperCore(cpack)
}

export function getRealFileName(branch) {
  switch (branch) {
    case 'release-vanilla':
      return releaseVanillaCPack
    case 'release-experiment':
      return releaseExperimentCPack
    case 'beta-vanilla':
      return betaVanillaCPack
    case 'beta-experiment':
      return betaExperimentCPack
    case 'netease-vanilla':
      return neteaseVanillaCPack
    case 'netease-experiment':
      return neteaseExperimentCPack
    default:
      return getRealFileName(DEFAULT_BRANCH)
  }
}
