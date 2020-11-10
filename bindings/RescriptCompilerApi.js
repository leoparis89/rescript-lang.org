

import * as Js_exn from "bs-platform/lib/es6/js_exn.js";
import * as Js_dict from "bs-platform/lib/es6/js_dict.js";
import * as Belt_Int from "bs-platform/lib/es6/belt_Int.js";
import * as Belt_List from "bs-platform/lib/es6/belt_List.js";
import * as Belt_Option from "bs-platform/lib/es6/belt_Option.js";
import * as Json_decode from "@glennsl/bs-json/src/Json_decode.js";
import * as Caml_js_exceptions from "bs-platform/lib/es6/caml_js_exceptions.js";

function toString(t) {
  switch (t) {
    case /* Reason */0 :
        return "Reason";
    case /* OCaml */1 :
        return "OCaml";
    case /* Res */2 :
        return "ReScript";
    
  }
}

function toExt(t) {
  switch (t) {
    case /* Reason */0 :
        return "re";
    case /* OCaml */1 :
        return "ml";
    case /* Res */2 :
        return "res";
    
  }
}

function decode(json) {
  var other = Json_decode.string(json);
  switch (other) {
    case "ml" :
        return /* OCaml */1;
    case "re" :
        return /* Reason */0;
    case "res" :
        return /* Res */2;
    default:
      throw {
            RE_EXN_ID: Json_decode.DecodeError,
            _1: "Unknown language \"" + other + "\"",
            Error: new Error()
          };
  }
}

var Lang = {
  toString: toString,
  toExt: toExt,
  decode: decode
};

function fromString(apiVersion) {
  var match = Belt_List.fromArray(apiVersion.split("."));
  if (!match) {
    return {
            _0: apiVersion,
            [Symbol.for("name")]: "UnknownVersion"
          };
  }
  var match$1 = match.tl;
  if (!match$1) {
    return {
            _0: apiVersion,
            [Symbol.for("name")]: "UnknownVersion"
          };
  }
  var maj = Belt_Int.fromString(match.hd);
  Belt_Int.fromString(match$1.hd);
  if (maj !== undefined && maj >= 1) {
    return /* V1 */0;
  } else {
    return {
            _0: apiVersion,
            [Symbol.for("name")]: "UnknownVersion"
          };
  }
}

function defaultTargetLang(t) {
  if (t) {
    return /* Reason */0;
  } else {
    return /* Res */2;
  }
}

function availableLanguages(t) {
  if (t) {
    return [/* Res */2];
  } else {
    return [
            /* Reason */0,
            /* Res */2
          ];
  }
}

var Version = {
  fromString: fromString,
  defaultTargetLang: defaultTargetLang,
  availableLanguages: availableLanguages
};

function decode$1(json) {
  return {
          fullMsg: Json_decode.field("fullMsg", Json_decode.string, json),
          shortMsg: Json_decode.field("shortMsg", Json_decode.string, json),
          row: Json_decode.field("row", Json_decode.$$int, json),
          column: Json_decode.field("column", Json_decode.$$int, json),
          endRow: Json_decode.field("endRow", Json_decode.$$int, json),
          endColumn: Json_decode.field("endColumn", Json_decode.$$int, json)
        };
}

function toCompactErrorLine(prefix, locMsg) {
  var prefix$1 = prefix === "W" ? "W" : "E";
  return "[1;31m[" + prefix$1 + "] Line " + locMsg.row + ", " + locMsg.column + ":[0m " + locMsg.shortMsg;
}

function makeId(t) {
  return String(t.row) + ("-" + (String(t.endRow) + ("-" + (String(t.column) + ("-" + String(t.endColumn))))));
}

function dedupe(arr) {
  var result = {};
  for(var i = 0 ,i_finish = arr.length; i < i_finish; ++i){
    var locMsg = arr[i];
    var id = makeId(locMsg);
    result[id] = locMsg;
  }
  return Js_dict.values(result);
}

var LocMsg = {
  decode: decode$1,
  toCompactErrorLine: toCompactErrorLine,
  makeId: makeId,
  dedupe: dedupe
};

function decode$2(json) {
  var warnNumber = Json_decode.field("warnNumber", Json_decode.$$int, json);
  var details = decode$1(json);
  if (Json_decode.field("isError", Json_decode.bool, json)) {
    return {
            TAG: 1,
            warnNumber: warnNumber,
            details: details,
            [Symbol.for("name")]: "WarnErr"
          };
  } else {
    return {
            TAG: 0,
            warnNumber: warnNumber,
            details: details,
            [Symbol.for("name")]: "Warn"
          };
  }
}

function toCompactErrorLine$1(t) {
  var prefix;
  prefix = t.TAG ? "E" : "W";
  var details = t.details;
  var msg = "(Warning number " + t.warnNumber + ") " + details.shortMsg;
  return "[1;31m[" + prefix + "] Line " + details.row + ", " + details.column + ":[0m " + msg;
}

var Warning = {
  decode: decode$2,
  toCompactErrorLine: toCompactErrorLine$1
};

function decode$3(json) {
  return {
          msg: Json_decode.field("msg", Json_decode.string, json),
          warn_flags: Json_decode.field("warn_flags", Json_decode.string, json),
          warn_error_flags: Json_decode.field("warn_error_flags", Json_decode.string, json)
        };
}

var WarningFlag = {
  decode: decode$3
};

function decode$4(time, json) {
  return {
          js_code: Json_decode.field("js_code", Json_decode.string, json),
          warnings: Json_decode.field("warnings", (function (param) {
                  return Json_decode.array(decode$2, param);
                }), json),
          time: time
        };
}

var CompileSuccess = {
  decode: decode$4
};

function decode$5(json) {
  return {
          code: Json_decode.field("code", Json_decode.string, json),
          fromLang: Json_decode.field("fromLang", decode, json),
          toLang: Json_decode.field("toLang", decode, json)
        };
}

var ConvertSuccess = {
  decode: decode$5
};

function decode$6(json) {
  var other = Json_decode.field("type", Json_decode.string, json);
  switch (other) {
    case "other_error" :
        var locMsgs = Json_decode.field("errors", (function (param) {
                return Json_decode.array(decode$1, param);
              }), json);
        return {
                TAG: 4,
                _0: locMsgs,
                [Symbol.for("name")]: "OtherErr"
              };
    case "syntax_error" :
        var locMsgs$1 = Json_decode.field("errors", (function (param) {
                return Json_decode.array(decode$1, param);
              }), json);
        return {
                TAG: 0,
                _0: dedupe(locMsgs$1),
                [Symbol.for("name")]: "SyntaxErr"
              };
    case "type_error" :
        var locMsgs$2 = Json_decode.field("errors", (function (param) {
                return Json_decode.array(decode$1, param);
              }), json);
        return {
                TAG: 1,
                _0: locMsgs$2,
                [Symbol.for("name")]: "TypecheckErr"
              };
    case "warning_error" :
        var warnings = Json_decode.field("errors", (function (param) {
                return Json_decode.array(decode$2, param);
              }), json);
        return {
                TAG: 2,
                _0: warnings,
                [Symbol.for("name")]: "WarningErr"
              };
    case "warning_flag_error" :
        var warningFlag = decode$3(json);
        return {
                TAG: 3,
                _0: warningFlag,
                [Symbol.for("name")]: "WarningFlagErr"
              };
    default:
      throw {
            RE_EXN_ID: Json_decode.DecodeError,
            _1: "Unknown type \"" + other + "\" in CompileFail result",
            Error: new Error()
          };
  }
}

var CompileFail = {
  decode: decode$6
};

function decode$7(time, json) {
  try {
    var match = Json_decode.field("type", Json_decode.string, json);
    switch (match) {
      case "success" :
          return {
                  TAG: 1,
                  _0: decode$4(time, json),
                  [Symbol.for("name")]: "Success"
                };
      case "unexpected_error" :
          return {
                  TAG: 2,
                  _0: Json_decode.field("msg", Json_decode.string, json),
                  [Symbol.for("name")]: "UnexpectedError"
                };
      default:
        return {
                TAG: 0,
                _0: decode$6(json),
                [Symbol.for("name")]: "Fail"
              };
    }
  }
  catch (raw_errMsg){
    var errMsg = Caml_js_exceptions.internalToOCamlException(raw_errMsg);
    if (errMsg.RE_EXN_ID === Json_decode.DecodeError) {
      return {
              TAG: 3,
              _0: errMsg._1,
              _1: json,
              [Symbol.for("name")]: "Unknown"
            };
    }
    throw errMsg;
  }
}

var CompilationResult = {
  decode: decode$7
};

function decode$8(fromLang, toLang, json) {
  try {
    var other = Json_decode.field("type", Json_decode.string, json);
    switch (other) {
      case "success" :
          return {
                  TAG: 0,
                  _0: decode$5(json),
                  [Symbol.for("name")]: "Success"
                };
      case "syntax_error" :
          var locMsgs = Json_decode.field("errors", (function (param) {
                  return Json_decode.array(decode$1, param);
                }), json);
          return {
                  TAG: 1,
                  fromLang: fromLang,
                  toLang: toLang,
                  details: locMsgs,
                  [Symbol.for("name")]: "Fail"
                };
      case "unexpected_error" :
          return {
                  TAG: 2,
                  _0: Json_decode.field("msg", Json_decode.string, json),
                  [Symbol.for("name")]: "UnexpectedError"
                };
      default:
        return {
                TAG: 3,
                _0: "Unknown conversion result type \"" + other + "\"",
                _1: json,
                [Symbol.for("name")]: "Unknown"
              };
    }
  }
  catch (raw_errMsg){
    var errMsg = Caml_js_exceptions.internalToOCamlException(raw_errMsg);
    if (errMsg.RE_EXN_ID === Json_decode.DecodeError) {
      return {
              TAG: 3,
              _0: errMsg._1,
              _1: json,
              [Symbol.for("name")]: "Unknown"
            };
    }
    throw errMsg;
  }
}

var ConversionResult = {
  decode: decode$8
};

var Config = {};

function resCompile(t, code) {
  var startTime = performance.now();
  var json = t.rescript.compile(code);
  var stopTime = performance.now();
  return decode$7(stopTime - startTime, json);
}

function resFormat(t, code) {
  var json = t.rescript.format(code);
  return decode$8(/* Res */2, /* Res */2, json);
}

function reasonCompile(t, code) {
  var startTime = performance.now();
  var json = t.reason.compile(code);
  var stopTime = performance.now();
  return decode$7(stopTime - startTime, json);
}

function reasonFormat(t, code) {
  var json = t.reason.format(code);
  return decode$8(/* Reason */0, /* Reason */0, json);
}

function ocamlCompile(t, code) {
  var startTime = performance.now();
  var json = t.ocaml.compile(code);
  var stopTime = performance.now();
  return decode$7(stopTime - startTime, json);
}

function setConfig(t, config) {
  var match = config.module_system;
  var moduleSystem;
  switch (match) {
    case "es6" :
        moduleSystem = "es6";
        break;
    case "nodejs" :
        moduleSystem = "nodejs";
        break;
    default:
      moduleSystem = undefined;
  }
  Belt_Option.forEach(moduleSystem, (function (moduleSystem) {
          t.setModuleSystem(moduleSystem);
          
        }));
  t.setWarnFlags(config.warn_flags);
  
}

function convertSyntax(t, fromLang, toLang, code) {
  try {
    return decode$8(fromLang, toLang, t.convertSyntax(toExt(fromLang), toExt(toLang), code));
  }
  catch (raw_obj){
    var obj = Caml_js_exceptions.internalToOCamlException(raw_obj);
    if (obj.RE_EXN_ID === Js_exn.$$Error) {
      var m = obj._1.message;
      if (m !== undefined) {
        return {
                TAG: 2,
                _0: m,
                [Symbol.for("name")]: "UnexpectedError"
              };
      } else {
        return {
                TAG: 2,
                _0: "",
                [Symbol.for("name")]: "UnexpectedError"
              };
      }
    }
    throw obj;
  }
}

var Compiler = {
  resCompile: resCompile,
  resFormat: resFormat,
  reasonCompile: reasonCompile,
  reasonFormat: reasonFormat,
  ocamlCompile: ocamlCompile,
  setConfig: setConfig,
  convertSyntax: convertSyntax
};

export {
  Lang ,
  Version ,
  LocMsg ,
  Warning ,
  WarningFlag ,
  CompileSuccess ,
  ConvertSuccess ,
  CompileFail ,
  CompilationResult ,
  ConversionResult ,
  Config ,
  Compiler ,
  
}
/* No side effect */
