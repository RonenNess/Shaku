/**
 * Define keyboard and mouse key codes.
 * 
 * |-- copyright and license --|
 * @module     Shaku
 * @file       shaku\src\input\key_codes.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';

/** @typedef {Number} MouseButton */

/**
 * Define mouse button codes.
 * @readonly
 * @enum {MouseButton}
 */
const MouseButtons = {
    left: 0,
    middle: 1,
    right: 2,
};

/** @typedef {Number} KeyboardKey */

/**
 * Define all keyboard key codes.
 * @readonly
 * @enum {KeyboardKey}
 */
const KeyboardKeys = {
    backspace: 8,
    tab: 9,
    enter: 13,
    shift: 16,
    ctrl: 17,
    alt: 18,
    break: 19,
    caps_lock: 20,
    escape: 27,
    page_up: 33,
    page_down: 34,
    end: 35,
    home: 36,
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    insert: 45,
    delete: 46,
    space: 32,
    n0: 48,
    n1: 49,
    n2: 50,
    n3: 51,
    n4: 52,
    n5: 53,
    n6: 54,
    n7: 55,
    n8: 56,
    n9: 57,
    a: 65,
    b: 66,
    c: 67,
    d: 68,
    e: 69,
    f: 70,
    g: 71,
    h: 72,
    i: 73,
    j: 74,
    k: 75,
    l: 76,
    m: 77,
    n: 78,
    o: 79,
    p: 80,
    q: 81,
    r: 82,
    s: 83,
    t: 84,
    u: 85,
    v: 86,
    w: 87,
    x: 88,
    y: 89,
    z: 90,
    left_window_key: 91,
    right_window_key: 92,
    select_key: 93,
    numpad_0: 96,
    numpad_1: 97,
    numpad_2: 98,
    numpad_3: 99,
    numpad_4: 100,
    numpad_5: 101,
    numpad_6: 102,
    numpad_7: 103,
    numpad_8: 104,
    numpad_9: 105,
    multiply: 106,
    add: 107,
    subtract: 109,
    decimal_point: 110,
    divide: 111,
    f1: 112,
    f2: 113,
    f3: 114,
    f4: 115,
    f5: 116,
    f6: 117,
    f7: 118,
    f8: 119,
    f9: 120,
    f10: 121,
    f11: 122,
    f12: 123,
    numlock: 144,
    scroll_lock: 145,
    semicolon: 186,
    equal_sign: 187,
    plus: 187,
    comma: 188,
    dash: 189,
    minus: 189,
    period: 190,
    forward_slash: 191,
    grave_accent: 192,
    open_bracket: 219,
    back_slash: 220,
    close_braket: 221,
    single_quote: 222,
};

// export keyboard keys and mouse buttons
module.exports = { KeyboardKeys: KeyboardKeys, MouseButtons: MouseButtons };