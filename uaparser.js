// JavaScript SQL User-Defined Function (UDF) User-Agent Parser Library
// Copyright (C) 2020, Alexander Clouter <alex@digriz.org.uk>
// SPDX-License-Identifier: AGPL-3.0-only

function uaparser(ua) {
    return {
        user_agent: uaparser.user_agent(ua),
        os: uaparser.os(ua),
        device: uaparser.device(ua)
    };
}
uaparser.user_agent = function(ua) {
    function compile(index, array) {
        const el = array[index];
        const re = new RegExp(el.regex);
        const fn = function(ua) {
            const m = ua.match(re);
            return m ? {
                family: el.family_replacement ? el.family_replacement.replace('$1', m[1]) : m[1],
                major: el.v1_replacement || m[2],
                minor: el.v2_replacement || m[3],
                patch: el.v3_replacement || m[4]
            } : false;
        };
        array[index] = fn;
        return fn;
    }
    const user_agent_default = {
        family: 'Other'
    };
    let user_agent;
    for (let index = 0; index < regexes.user_agent_parsers.length; index++) {
        const el = regexes.user_agent_parsers[index];
        const fn = typeof el == 'function' ? el : compile(index, regexes.user_agent_parsers);
        user_agent = fn(ua);
        if (user_agent) break;
    }
    return user_agent ? user_agent : user_agent_default;
};
uaparser.os = function(ua) {
    function compile(index, array) {
        const el = array[index];
        const re = new RegExp(el.regex);
        const fn = function(ua) {
            const m = ua.match(re);
            return m ? {
                family: el.os_replacement ? el.os_replacement.replace('$1', m[1]) : m[1],
                major: el.os_v1_replacement ? el.os_v1_replacement.replace('$2', m[2]) : m[2],
                minor: el.os_v2_replacement ? el.os_v2_replacement.replace('$3', m[3]) : m[3],
                patch: el.os_v3_replacement ? el.os_v3_replacement.replace('$4', m[4]) : m[4],
                patchMinor: el.os_v4_replacement ? el.os_v4_replacement.replace('$5', m[5]) : m[5]
            } : false;
        };
        array[index] = fn;
        return fn;
    }
    const os_default = {
        family: 'Other'
    };
    let os;
    for (let index = 0; index < regexes.os_parsers.length; index++) {
        const el = regexes.os_parsers[index];
        const fn = typeof el == 'function' ? el : compile(index, regexes.os_parsers);
        os = fn(ua);
        if (os) break;
    }
    return os ? os : os_default;
};
uaparser.device = function(ua) {
    function replace(str, m) {
        return str.replace(/\$(\d)/g, function(tmp, i) {
            return m[i] || '';
        }).trim();
    }
    function compile(index, array) {
        const el = array[index];
        const re = new RegExp(el.regex, el.regex_flag || '');
        const fn = function(ua) {
            const m = ua.match(re);
            return m ? {
                family: el.device_replacement ? replace(el.device_replacement, m) : m[1],
                brand: el.brand_replacement ? replace(el.brand_replacement, m) : undefined,
                model: el.model_replacement? replace(el.model_replacement, m) : m[1]
            } : false;
        };
        array[index] = fn;
        return fn;
    }
    const device_default = {
        family: 'Other'
    };
    let device;
    for (let index = 0; index < regexes.device_parsers.length; index++) {
        const el = regexes.device_parsers[index];
        const fn = typeof el == 'function' ? el : compile(index, regexes.device_parsers);
        device = fn(ua);
        if (device) break;
    }
    return device ? device : device_default;
};
