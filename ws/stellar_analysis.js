
let wasm;

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function getObject(idx) { return heap[idx]; }

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

let WASM_VECTOR_LEN = 0;

let cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}
/**
* @param {string} json_fbas
* @param {string} json_orgs
* @param {number} merge_by
* @returns {any}
*/
export function analyze_minimal_quorums(json_fbas, json_orgs, merge_by) {
    var ptr0 = passStringToWasm0(json_fbas, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    var ptr1 = passStringToWasm0(json_orgs, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    var ret = wasm.analyze_minimal_quorums(ptr0, len0, ptr1, len1, merge_by);
    return takeObject(ret);
}

/**
* @param {string} json_fbas
* @param {string} json_orgs
* @param {string} faulty_nodes
* @param {number} merge_by
* @returns {any}
*/
export function analyze_minimal_blocking_sets(json_fbas, json_orgs, faulty_nodes, merge_by) {
    var ptr0 = passStringToWasm0(json_fbas, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    var ptr1 = passStringToWasm0(json_orgs, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    var ptr2 = passStringToWasm0(faulty_nodes, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len2 = WASM_VECTOR_LEN;
    var ret = wasm.analyze_minimal_blocking_sets(ptr0, len0, ptr1, len1, ptr2, len2, merge_by);
    return takeObject(ret);
}

/**
* @param {string} json_fbas
* @param {string} json_orgs
* @param {number} merge_by
* @returns {any}
*/
export function analyze_minimal_splitting_sets(json_fbas, json_orgs, merge_by) {
    var ptr0 = passStringToWasm0(json_fbas, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    var ptr1 = passStringToWasm0(json_orgs, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    var ret = wasm.analyze_minimal_splitting_sets(ptr0, len0, ptr1, len1, merge_by);
    return takeObject(ret);
}

/**
* @param {string} json_fbas
* @param {string} json_orgs
* @param {number} merge_by
* @returns {any}
*/
export function analyze_top_tier(json_fbas, json_orgs, merge_by) {
    var ptr0 = passStringToWasm0(json_fbas, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    var ptr1 = passStringToWasm0(json_orgs, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    var ret = wasm.analyze_top_tier(ptr0, len0, ptr1, len1, merge_by);
    return takeObject(ret);
}

/**
* @param {string} json_fbas
* @param {string} json_orgs
* @param {number} merge_by
* @returns {any}
*/
export function analyze_symmetric_top_tier(json_fbas, json_orgs, merge_by) {
    var ptr0 = passStringToWasm0(json_fbas, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    var ptr1 = passStringToWasm0(json_orgs, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    var ret = wasm.analyze_symmetric_top_tier(ptr0, len0, ptr1, len1, merge_by);
    return takeObject(ret);
}

/**
*/
export function init_panic_hook() {
    wasm.init_panic_hook();
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
}
/**
*/
export const MergeBy = Object.freeze({ DoNotMerge:0,"0":"DoNotMerge",Orgs:1,"1":"Orgs",ISPs:2,"2":"ISPs",Countries:3,"3":"Countries", });

async function load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

async function init(input) {
    if (typeof input === 'undefined') {
        input = new URL('stellar_analysis_bg.wasm', import.meta.url);
    }
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        var ret = getStringFromWasm0(arg0, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbindgen_json_parse = function(arg0, arg1) {
        var ret = JSON.parse(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_693216e109162396 = function() {
        var ret = new Error();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_stack_0ddaca5d1abfb52f = function(arg0, arg1) {
        var ret = getObject(arg1).stack;
        var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_error_09919627ac0992f5 = function(arg0, arg1) {
        try {
            console.error(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_free(arg0, arg1);
        }
    };
    imports.wbg.__wbg_log_fbd13631356d44e4 = function(arg0) {
        console.log(getObject(arg0));
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }



    const { instance, module } = await load(await input, imports);

    wasm = instance.exports;
    init.__wbindgen_wasm_module = module;

    return wasm;
}

export default init;

