import wasmUrl from '@/assets/libCHelperWeb.wasm?url'

var Module = typeof Module != 'undefined' ? Module : {}
var ENVIRONMENT_IS_WEB = true
var ENVIRONMENT_IS_WORKER = false
var arguments_ = []
var thisProgram = './this.program'
var _scriptName = typeof document != 'undefined' ? document.currentScript?.src : undefined
var scriptDirectory = ''
function locateFile(path) {
  if (Module['locateFile']) {
    return Module['locateFile'](path, scriptDirectory)
  }
  return scriptDirectory + path
}
var readAsync, readBinary
if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  try {
    scriptDirectory = new URL('.', _scriptName).href
  } catch {}
  {
    readAsync = async (url) => {
      var response = await fetch(url, { credentials: 'same-origin' })
      if (response.ok) {
        return response.arrayBuffer()
      }
      throw new Error(response.status + ' : ' + response.url)
    }
  }
} else {
}
var out = console.log.bind(console)
var err = console.error.bind(console)
var wasmBinary
var ABORT = false
var wasmMemory
var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64
var HEAP64, HEAPU64
var runtimeInitialized = false
function updateMemoryViews() {
  var b = wasmMemory.buffer
  HEAP8 = new Int8Array(b)
  HEAP16 = new Int16Array(b)
  HEAPU8 = new Uint8Array(b)
  HEAPU16 = new Uint16Array(b)
  HEAP32 = new Int32Array(b)
  HEAPU32 = new Uint32Array(b)
  HEAPF32 = new Float32Array(b)
  HEAPF64 = new Float64Array(b)
  HEAP64 = new BigInt64Array(b)
  HEAPU64 = new BigUint64Array(b)
}
function preRun() {
  if (Module['preRun']) {
    if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']]
    while (Module['preRun'].length) {
      addOnPreRun(Module['preRun'].shift())
    }
  }
  callRuntimeCallbacks(onPreRuns)
}
function initRuntime() {
  runtimeInitialized = true
  wasmExports['h']()
}
function postRun() {
  if (Module['postRun']) {
    if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']]
    while (Module['postRun'].length) {
      addOnPostRun(Module['postRun'].shift())
    }
  }
  callRuntimeCallbacks(onPostRuns)
}
var runDependencies = 0
var dependenciesFulfilled = null
function addRunDependency(id) {
  runDependencies++
  Module['monitorRunDependencies']?.(runDependencies)
}
function removeRunDependency(id) {
  runDependencies--
  Module['monitorRunDependencies']?.(runDependencies)
  if (runDependencies == 0) {
    if (dependenciesFulfilled) {
      var callback = dependenciesFulfilled
      dependenciesFulfilled = null
      callback()
    }
  }
}
function abort(what) {
  Module['onAbort']?.(what)
  what = 'Aborted(' + what + ')'
  err(what)
  ABORT = true
  what += '. Build with -sASSERTIONS for more info.'
  var e = new WebAssembly.RuntimeError(what)
  throw e
}
var wasmBinaryFile
function findWasmBinary() {
  return wasmUrl
}
function getBinarySync(file) {
  if (file == wasmBinaryFile && wasmBinary) {
    return new Uint8Array(wasmBinary)
  }
  if (readBinary) {
    return readBinary(file)
  }
  throw 'both async and sync fetching of the wasm failed'
}
async function getWasmBinary(binaryFile) {
  if (!wasmBinary) {
    try {
      var response = await readAsync(binaryFile)
      return new Uint8Array(response)
    } catch {}
  }
  return getBinarySync(binaryFile)
}
async function instantiateArrayBuffer(binaryFile, imports) {
  try {
    var binary = await getWasmBinary(binaryFile)
    var instance = await WebAssembly.instantiate(binary, imports)
    return instance
  } catch (reason) {
    err(`failed to asynchronously prepare wasm: ${reason}`)
    abort(reason)
  }
}
async function instantiateAsync(binary, binaryFile, imports) {
  if (!binary && typeof WebAssembly.instantiateStreaming == 'function') {
    try {
      var response = fetch(binaryFile, { credentials: 'same-origin' })
      var instantiationResult = await WebAssembly.instantiateStreaming(response, imports)
      return instantiationResult
    } catch (reason) {
      err(`wasm streaming compile failed: ${reason}`)
      err('falling back to ArrayBuffer instantiation')
    }
  }
  return instantiateArrayBuffer(binaryFile, imports)
}
function getWasmImports() {
  return { a: wasmImports }
}
async function createWasm() {
  function receiveInstance(instance, module) {
    wasmExports = instance.exports
    wasmMemory = wasmExports['g']
    updateMemoryViews()
    assignWasmExports(wasmExports)
    removeRunDependency('wasm-instantiate')
    return wasmExports
  }
  addRunDependency('wasm-instantiate')
  function receiveInstantiationResult(result) {
    return receiveInstance(result['instance'])
  }
  var info = getWasmImports()
  if (Module['instantiateWasm']) {
    return new Promise((resolve, reject) => {
      Module['instantiateWasm'](info, (mod, inst) => {
        resolve(receiveInstance(mod, inst))
      })
    })
  }
  wasmBinaryFile ??= findWasmBinary()
  var result = await instantiateAsync(wasmBinary, wasmBinaryFile, info)
  var exports = receiveInstantiationResult(result)
  return exports
}
class ExitStatus {
  name = 'ExitStatus'
  constructor(status) {
    this.message = `Program terminated with exit(${status})`
    this.status = status
  }
}
var callRuntimeCallbacks = (callbacks) => {
  while (callbacks.length > 0) {
    callbacks.shift()(Module)
  }
}
var onPostRuns = []
var addOnPostRun = (cb) => onPostRuns.push(cb)
var onPreRuns = []
var addOnPreRun = (cb) => onPreRuns.push(cb)
var noExitRuntime = true
class ExceptionInfo {
  constructor(excPtr) {
    this.excPtr = excPtr
    this.ptr = excPtr - 24
  }
  set_type(type) {
    HEAPU32[(this.ptr + 4) >> 2] = type
  }
  get_type() {
    return HEAPU32[(this.ptr + 4) >> 2]
  }
  set_destructor(destructor) {
    HEAPU32[(this.ptr + 8) >> 2] = destructor
  }
  get_destructor() {
    return HEAPU32[(this.ptr + 8) >> 2]
  }
  set_caught(caught) {
    caught = caught ? 1 : 0
    HEAP8[this.ptr + 12] = caught
  }
  get_caught() {
    return HEAP8[this.ptr + 12] != 0
  }
  set_rethrown(rethrown) {
    rethrown = rethrown ? 1 : 0
    HEAP8[this.ptr + 13] = rethrown
  }
  get_rethrown() {
    return HEAP8[this.ptr + 13] != 0
  }
  init(type, destructor) {
    this.set_adjusted_ptr(0)
    this.set_type(type)
    this.set_destructor(destructor)
  }
  set_adjusted_ptr(adjustedPtr) {
    HEAPU32[(this.ptr + 16) >> 2] = adjustedPtr
  }
  get_adjusted_ptr() {
    return HEAPU32[(this.ptr + 16) >> 2]
  }
}
var exceptionLast = 0
var uncaughtExceptionCount = 0
var ___cxa_throw = (ptr, type, destructor) => {
  var info = new ExceptionInfo(ptr)
  info.init(type, destructor)
  exceptionLast = ptr
  uncaughtExceptionCount++
  throw exceptionLast
}
var __abort_js = () => abort('')
var stringToUTF8Array = (str, heap, outIdx, maxBytesToWrite) => {
  if (!(maxBytesToWrite > 0)) return 0
  var startIdx = outIdx
  var endIdx = outIdx + maxBytesToWrite - 1
  for (var i = 0; i < str.length; ++i) {
    var u = str.codePointAt(i)
    if (u <= 127) {
      if (outIdx >= endIdx) break
      heap[outIdx++] = u
    } else if (u <= 2047) {
      if (outIdx + 1 >= endIdx) break
      heap[outIdx++] = 192 | (u >> 6)
      heap[outIdx++] = 128 | (u & 63)
    } else if (u <= 65535) {
      if (outIdx + 2 >= endIdx) break
      heap[outIdx++] = 224 | (u >> 12)
      heap[outIdx++] = 128 | ((u >> 6) & 63)
      heap[outIdx++] = 128 | (u & 63)
    } else {
      if (outIdx + 3 >= endIdx) break
      heap[outIdx++] = 240 | (u >> 18)
      heap[outIdx++] = 128 | ((u >> 12) & 63)
      heap[outIdx++] = 128 | ((u >> 6) & 63)
      heap[outIdx++] = 128 | (u & 63)
      i++
    }
  }
  heap[outIdx] = 0
  return outIdx - startIdx
}
var stringToUTF8 = (str, outPtr, maxBytesToWrite) =>
  stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite)
var __tzset_js = (timezone, daylight, std_name, dst_name) => {
  var currentYear = new Date().getFullYear()
  var winter = new Date(currentYear, 0, 1)
  var summer = new Date(currentYear, 6, 1)
  var winterOffset = winter.getTimezoneOffset()
  var summerOffset = summer.getTimezoneOffset()
  var stdTimezoneOffset = Math.max(winterOffset, summerOffset)
  HEAPU32[timezone >> 2] = stdTimezoneOffset * 60
  HEAP32[daylight >> 2] = Number(winterOffset != summerOffset)
  var extractZone = (timezoneOffset) => {
    var sign = timezoneOffset >= 0 ? '-' : '+'
    var absOffset = Math.abs(timezoneOffset)
    var hours = String(Math.floor(absOffset / 60)).padStart(2, '0')
    var minutes = String(absOffset % 60).padStart(2, '0')
    return `UTC${sign}${hours}${minutes}`
  }
  var winterName = extractZone(winterOffset)
  var summerName = extractZone(summerOffset)
  if (summerOffset < winterOffset) {
    stringToUTF8(winterName, std_name, 17)
    stringToUTF8(summerName, dst_name, 17)
  } else {
    stringToUTF8(winterName, dst_name, 17)
    stringToUTF8(summerName, std_name, 17)
  }
}
var getHeapMax = () => 2147483648
var alignMemory = (size, alignment) => Math.ceil(size / alignment) * alignment
var growMemory = (size) => {
  var b = wasmMemory.buffer
  var pages = ((size - b.byteLength + 65535) / 65536) | 0
  try {
    wasmMemory.grow(pages)
    updateMemoryViews()
    return 1
  } catch (e) {}
}
var _emscripten_resize_heap = (requestedSize) => {
  var oldSize = HEAPU8.length
  requestedSize >>>= 0
  var maxHeapSize = getHeapMax()
  if (requestedSize > maxHeapSize) {
    return false
  }
  for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
    var overGrownHeapSize = oldSize * (1 + 0.2 / cutDown)
    overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296)
    var newSize = Math.min(
      maxHeapSize,
      alignMemory(Math.max(requestedSize, overGrownHeapSize), 65536)
    )
    var replacement = growMemory(newSize)
    if (replacement) {
      return true
    }
  }
  return false
}
var ENV = {}
var getExecutableName = () => thisProgram || './this.program'
var getEnvStrings = () => {
  if (!getEnvStrings.strings) {
    var lang =
      ((typeof navigator == 'object' && navigator.language) || 'C').replace('-', '_') + '.UTF-8'
    var env = {
      USER: 'web_user',
      LOGNAME: 'web_user',
      PATH: '/',
      PWD: '/',
      HOME: '/home/web_user',
      LANG: lang,
      _: getExecutableName(),
    }
    for (var x in ENV) {
      if (ENV[x] === undefined) delete env[x]
      else env[x] = ENV[x]
    }
    var strings = []
    for (var x in env) {
      strings.push(`${x}=${env[x]}`)
    }
    getEnvStrings.strings = strings
  }
  return getEnvStrings.strings
}
var _environ_get = (__environ, environ_buf) => {
  var bufSize = 0
  var envp = 0
  for (var string of getEnvStrings()) {
    var ptr = environ_buf + bufSize
    HEAPU32[(__environ + envp) >> 2] = ptr
    bufSize += stringToUTF8(string, ptr, Infinity) + 1
    envp += 4
  }
  return 0
}
var lengthBytesUTF8 = (str) => {
  var len = 0
  for (var i = 0; i < str.length; ++i) {
    var c = str.charCodeAt(i)
    if (c <= 127) {
      len++
    } else if (c <= 2047) {
      len += 2
    } else if (c >= 55296 && c <= 57343) {
      len += 4
      ++i
    } else {
      len += 3
    }
  }
  return len
}
var _environ_sizes_get = (penviron_count, penviron_buf_size) => {
  var strings = getEnvStrings()
  HEAPU32[penviron_count >> 2] = strings.length
  var bufSize = 0
  for (var string of strings) {
    bufSize += lengthBytesUTF8(string) + 1
  }
  HEAPU32[penviron_buf_size >> 2] = bufSize
  return 0
}
{
  if (Module['noExitRuntime']) noExitRuntime = Module['noExitRuntime']
  if (Module['print']) out = Module['print']
  if (Module['printErr']) err = Module['printErr']
  if (Module['wasmBinary']) wasmBinary = Module['wasmBinary']
  if (Module['arguments']) arguments_ = Module['arguments']
  if (Module['thisProgram']) thisProgram = Module['thisProgram']
}
var _init,
  _release,
  _onTextChanged,
  _onSelectionChanged,
  _getStructure,
  _getDescription,
  _getErrorReasons,
  _getSuggestionSize,
  _getSuggestion,
  _getAllSuggestions,
  _onSuggestionClick,
  _malloc,
  _free
function assignWasmExports(wasmExports) {
  Module['_init'] = _init = wasmExports['i']
  Module['_release'] = _release = wasmExports['j']
  Module['_onTextChanged'] = _onTextChanged = wasmExports['k']
  Module['_onSelectionChanged'] = _onSelectionChanged = wasmExports['l']
  Module['_getStructure'] = _getStructure = wasmExports['m']
  Module['_getDescription'] = _getDescription = wasmExports['n']
  Module['_getErrorReasons'] = _getErrorReasons = wasmExports['o']
  Module['_getSuggestionSize'] = _getSuggestionSize = wasmExports['p']
  Module['_getSuggestion'] = _getSuggestion = wasmExports['q']
  Module['_getAllSuggestions'] = _getAllSuggestions = wasmExports['r']
  Module['_onSuggestionClick'] = _onSuggestionClick = wasmExports['s']
  Module['_malloc'] = _malloc = wasmExports['t']
  Module['_free'] = _free = wasmExports['u']
}
var wasmImports = {
  a: ___cxa_throw,
  e: __abort_js,
  b: __tzset_js,
  f: _emscripten_resize_heap,
  c: _environ_get,
  d: _environ_sizes_get,
}
var wasmExports
export var createWasmFuture = createWasm()
function run() {
  if (runDependencies > 0) {
    dependenciesFulfilled = run
    return
  }
  preRun()
  if (runDependencies > 0) {
    dependenciesFulfilled = run
    return
  }
  function doRun() {
    Module['calledRun'] = true
    if (ABORT) return
    initRuntime()
    Module['onRuntimeInitialized']?.()
    postRun()
  }
  if (Module['setStatus']) {
    Module['setStatus']('Running...')
    setTimeout(() => {
      setTimeout(() => Module['setStatus'](''), 1)
      doRun()
    }, 1)
  } else {
    doRun()
  }
}
function preInit() {
  if (Module['preInit']) {
    if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']]
    while (Module['preInit'].length > 0) {
      Module['preInit'].shift()()
    }
  }
}
preInit()
run()

export class CHelperCore {
  constructor(cpack) {
    const cpackPtr = _malloc(cpack.byteLength)
    HEAP8.set(cpack, cpackPtr)
    this._corePtr = _init(cpackPtr, cpack.byteLength)
    _free(cpackPtr)
    if (this._corePtr === 0) {
      throw 'fail to init CHelper core'
    }
  }

  release() {
    _release(this._corePtr)
    this._corePtr = 0
  }

  onTextChanged(content, index) {
    const ptr = _malloc((content.length + 1) * 2)
    const start = ptr / 2
    const end = start + content.length
    let i = start
    while (i < end) {
      HEAPU16[i] = content.charCodeAt(i - start)
      ++i
    }
    HEAPU16[i] = 0
    _onTextChanged(this._corePtr, ptr, index)
    _free(ptr)
  }

  onSelectionChanged(index) {
    _onSelectionChanged(this._corePtr, index)
  }

  getStructure() {
    let ptr = _getStructure(this._corePtr)
    if (ptr === 0) {
      return ''
    }
    ptr += ptr % 4
    const length = HEAPU32[ptr >> 2]
    ptr += 4
    let structure = ''
    for (let i = 0; i < length; i++) {
      structure += String.fromCharCode(HEAPU16[ptr >> 1])
      ptr += 2
    }
    return structure
  }

  getDescription() {
    let ptr = _getDescription(this._corePtr)
    if (ptr === 0) {
      return ''
    }
    ptr += ptr % 4
    const length = HEAPU32[ptr >> 2]
    ptr += 4
    let description = ''
    for (let i = 0; i < length; i++) {
      description += String.fromCharCode(HEAPU16[ptr >> 1])
      ptr += 2
    }
    return description
  }

  getErrorReasons() {
    let ptr = _getErrorReasons(this._corePtr)
    if (ptr === 0) {
      return []
    }
    ptr += ptr % 4
    const length = HEAPU32[ptr >> 2]
    ptr += 4
    let errorReasons = []
    for (let i = 0; i < length; i++) {
      ptr += ptr % 4
      const start = HEAPU32[ptr >> 2]
      ptr += 4
      const end = HEAPU32[ptr >> 2]
      ptr += 4
      const errorReasonLength = HEAPU32[ptr >> 2]
      ptr += 4
      let errorReason = ''
      for (let i = 0; i < errorReasonLength; i++) {
        errorReason += String.fromCharCode(HEAPU16[ptr >> 1])
        ptr += 2
      }
      errorReasons.push({
        start,
        end,
        errorReason,
      })
    }
    return errorReasons
  }

  getSuggestionSize() {
    return _getSuggestionSize(this._corePtr)
  }

  getSuggestion(which) {
    let ptr = _getSuggestion(this._corePtr, which)
    if (ptr === 0) {
      return null
    }
    ptr += ptr % 4
    const titleLength = HEAPU32[ptr >> 2]
    ptr += 4
    const descriptionLength = HEAPU32[ptr >> 2]
    ptr += 4
    let title = ''
    for (let i = 0; i < titleLength; i++) {
      title += String.fromCharCode(HEAPU16[ptr >> 1])
      ptr += 2
    }
    let description = ''
    for (let i = 0; i < descriptionLength; i++) {
      description += String.fromCharCode(HEAPU16[ptr >> 1])
      ptr += 2
    }
    return {
      title,
      description,
    }
  }

  getAllSuggestions() {
    let ptr = _getAllSuggestions(this._corePtr)
    if (ptr === 0) {
      return []
    }
    ptr += ptr % 4
    const length = HEAPU32[ptr >> 2]
    ptr += 4
    let suggestions = []
    for (let i = 0; i < length; i++) {
      ptr += ptr % 4
      const titleLength = HEAPU32[ptr >> 2]
      ptr += 4
      const descriptionLength = HEAPU32[ptr >> 2]
      ptr += 4
      let title = ''
      for (let i = 0; i < titleLength; i++) {
        title += String.fromCharCode(HEAPU16[ptr >> 1])
        ptr += 2
      }
      let description = ''
      for (let i = 0; i < descriptionLength; i++) {
        description += String.fromCharCode(HEAPU16[ptr >> 1])
        ptr += 2
      }
      suggestions.push({
        id: i,
        title,
        description,
      })
    }
    return suggestions
  }

  onSuggestionClick(which) {
    let ptr = _onSuggestionClick(this._corePtr, which)
    if (ptr === 0) {
      return null
    }
    ptr += ptr % 4
    const cursorPosition = HEAPU32[ptr >> 2]
    ptr += 4
    const length = HEAPU32[ptr >> 2]
    ptr += 4
    let newText = ''
    for (let i = 0; i < length; i++) {
      newText += String.fromCharCode(HEAPU16[ptr >> 1])
      ptr += 2
    }
    return {
      cursorPosition,
      newText,
    }
  }
}
