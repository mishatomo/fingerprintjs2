/* global jasmine, describe, it, xit , expect, Fingerprint2 */
"use strict"

const getComponent = (components, key) => {
  for (let x = 0; x < components.length; x++) {
    if (components[x].key === key) {
      return components[x].value
    }
  }
  throw new Error("Component not found: " + key)
}

describe("Fingerprint2", () => {
  describe("FP2", () => {
    it(".get should be available", () => {
      expect(Fingerprint2.get).toBeDefined();
    });

    it(".getPromise should be available", () => {
      expect(Fingerprint2.getPromise).toBeDefined();
    });

    it(".get accepts an empty options object", (done) => {
      Fingerprint2.get({}, (result) => {
        expect(result).not.toBeNull();
        done();
      });
    });

    it(".get works when omitting options object", (done) => {
      Fingerprint2.get((result) => {
        expect(result).not.toBeNull();
        done();
      });
    });
  });

  describe("Legacy Usage", () => {
    describe("new", () => {
      it("throws an error", () => {
        // eslint-disable-next-line
        expect(() => { new Fingerprint2() }).toThrow();
      });
    });

    describe("without new keyword", () => {
      it("throws an error", () => {
        expect(function () { Fingerprint2() }).toThrow();
      });
    });
  });

  describe("#get", () => {
    describe("default options", () => {
      // legacy
      it("calculates fingerprint hash", (done)=> {
        Fingerprint2.getV18((result) => {
          expect(result).toMatch(/^[0-9a-f]{32}$/i)
          done();
        });
      });

      it("does not try calling flash font detection", (done) => {
        const flashFontKey = "fontsFlash";
        Fingerprint2.get((components) => {
          expect(components.some(({key, _value}) => key === flashFontKey )).toBeFalsy();
          done();
        });
      });

      describe("excludes work:", () => {
        const excludes = [ "userAgent", "pixelRatio", "deviceMemory", "screenResolution", "availableScreenResolution", "plugins", "timezone" ];
        excludes.forEach((excludeKey) => {
          it("does not use " + excludeKey + " when excluded", (done) => {
            let options = {excludes: {}}
            options.excludes[excludeKey] = true;
            Fingerprint2.get(options, (components) => {
              expect(components.some(({key, _value}) =>  excludeKey === key )).toBeFalsy();
              done();
            });
          });
        });
      });

      describe("returns components", () => {
        it("returns components as a second argument to callback", (done) => {
          Fingerprint2.get((components) => {
            expect(components).not.toBeNull();
            done();
          });
        });

        it("checks if returned components is array", (done) => {
          Fingerprint2.get((components) => {
            expect(components).toBeArrayOfObjects();
            done();
          });
        });

        it("checks if fonts component is array", (done) => {
          Fingerprint2.get((components) => {
            expect(getComponent(components, "fonts")).toBeArray();
            done();
          });
        });

        it("returns userAgent as the first element",  (done) => {
          Fingerprint2.get((components) => {
            expect(components[0].key).toEqual("userAgent");
            done();
          });
        });
      });
      describe("baseFontArray iteration", () => {
        it("only iterates specified items", (done) => {
          let baseFonts = ["monospace", "sans-serif", "serif"];
          // eslint-disable-next-line
          var ctr = 0; for (let _ in baseFonts) { ctr++ }

          expect(baseFonts.length).toEqual(3);
          expect(ctr).toEqual(baseFonts.length);

          // Somewhere deep in your JavaScript library...
          // eslint-disable-next-line
          Array.prototype.foo = 1;
          // eslint-disable-next-line
          Array.prototype.bar = 2;
          // eslint-disable-next-line
          ctr = 0; for (let _ in baseFonts) {
            ctr++;
            // Now foo & bar is a part of EVERY array and
            // will show up here as a value of "x".
          }

          expect(baseFonts.length).toEqual(3);
          // sadface
          expect(ctr).not.toEqual(baseFonts.length);
          expect(ctr).toEqual(5);
          done();
        });
      });
    });
  });
});





  //   })

  //   describe("userDefinedFonts option", function () {
  //     it("concatinates existing fonts with user-defined", function (done) {
  //       var fontList = [
  //         "Andale Mono", "Arial", "Arial Black", "Arial Hebrew", "Arial MT", "Arial Narrow", "Arial Rounded MT Bold",
  //         "Arial Unicode MS",
  //         "Bitstream Vera Sans Mono", "Book Antiqua", "Bookman Old Style",
  //         "Calibri", "Cambria", "Cambria Math", "Century", "Century Gothic", "Century Schoolbook", "Comic Sans",
  //         "Comic Sans MS", "Consolas", "Courier", "Courier New",
  //         "Garamond", "Geneva", "Georgia",
  //         "Helvetica", "Helvetica Neue",
  //         "Impact",
  //         "Lucida Bright", "Lucida Calligraphy", "Lucida Console", "Lucida Fax", "LUCIDA GRANDE", "Lucida Handwriting",
  //         "Lucida Sans", "Lucida Sans Typewriter", "Lucida Sans Unicode",
  //         "Microsoft Sans Serif", "Monaco", "Monotype Corsiva", "MS Gothic", "MS Outlook", "MS PGothic",
  //         "MS Reference Sans Serif", "MS Sans Serif", "MS Serif", "MYRIAD", "MYRIAD PRO",
  //         "Palatino", "Palatino Linotype",
  //         "Segoe Print", "Segoe Script", "Segoe UI", "Segoe UI Light", "Segoe UI Semibold", "Segoe UI Symbol",
  //         "Tahoma", "Times", "Times New Roman", "Times New Roman PS", "Trebuchet MS",
  //         "Verdana", "Wingdings", "Wingdings 2", "Wingdings 3"
  //       ]

  //       expect(fontList.length).toEqual(65)
  //       var userDefinedFonts = []
  //       fontList.concat(userDefinedFonts)
  //       expect(fontList.length).toEqual(65)

  //       userDefinedFonts = ["Adria Grotesk", "Butler", "Nimbus Mono", "Arial", "Nimbus Mono"]
  //       expect(userDefinedFonts.length).toEqual(5)
  //       fontList = fontList.concat(userDefinedFonts)

  //       // remove duplicate fonts: "Arial" from default fonts & duplicate "Nimbus Mono" from `userDefinedFonts` variable.
  //       fontList = fontList.filter(function (font, position) {
  //         return fontList.indexOf(font) === position
  //       })

  //       expect(fontList.length).toEqual(65 + 5 - 2)
  //       done()
  //     })
  //   })

  //   describe("extraComponents option", function () {
  //     it("uses extraComponents", function (done) {
  //       function customFunction (done) {
  //         done("RANDOM_STRING")
  //       }

  //       var spy = jasmine.createSpy("customFunction", customFunction).and.callThrough()
  //       Fingerprint2.get({
  //         extraComponents: [{key: "customFunction", getData: spy}]
  //       }, function (keys) {
  //         expect(spy).toHaveBeenCalled()
  //         done()
  //       })
  //     })

  //     it("its key is used", function (done) {
  //       var options = {
  //         extraComponents: [
  //           {
  //             key: "TEST_STRING",
  //             getData: function customFunction (done) {
  //               done("RANDOM_STRING")
  //             }
  //           }
  //         ]
  //       }
  //       Fingerprint2.get(options, function (components) {
  //         expect(getComponent(components, "TEST_STRING")).toEqual("RANDOM_STRING")
  //         done()
  //       })
  //     })

  //     it("safely introduce a new component even if it throws", function (done) {
  //       var options = {
  //         extraComponents: [
  //           {
  //             key: "my key",
  //             getData: function customFunction (done) {
  //               throw new Error("unstable component")
  //             }
  //           }
  //         ]
  //       }
  //       Fingerprint2.get(options, function (components) {
  //         // if we arrive here, it means the rest of the fingerprint was not disturbed
  //         expect(components).toBeDefined()
  //         done()
  //       })
  //     })
  //   })
  //   describe("error constants", function () {
  //     it("are configurable", function (done) {
  //       var NA = "NA"
  //       var options = {
  //         NOT_AVAILABLE: NA,
  //         extraComponents: [
  //           {
  //             key: "my key",
  //             getData: function customFunction (done, options2) {
  //               done(options2.NOT_AVAILABLE)
  //             }
  //           }
  //         ]
  //       }
  //       Fingerprint2.get(options, function (components) {
  //         expect(components).toBeDefined()
  //         expect(getComponent(components, "my key")).toEqual(NA)
  //         done()
  //       })
  //     })
  //   })

  //   describe("enumerate devices fingerprint", function () {
  //     it("checks enumerate devices fingerprint", function (done) {
  //       var options = {excludes: {}}
  //       Fingerprint2.get(options, function (components) {
  //         if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
  //           expect(getComponent(components, "enumerateDevices")).not.toBeNull()
  //         }
  //         done()
  //       })
  //     })
  //   })

  //   describe("audio fingerprint", function () {
  //     it("checks audio fingerprint", function (done) {
  //       Fingerprint2.get(function (components) {
  //         expect(getComponent(components, "audio")).not.toBeNull()
  //         done()
  //       })
  //     })
  //   })

    // describe("webgl shader precision format", function () {
    //   // fp2.getWebglCanvas() not exposed
    //   it("checks webgl shader precision format loop", function (done) {
    //     Fingerprint2.get(function (components) {
    //       getComponent(components, "webgl");
    //     })
    //     var canvas = document.createElement("canvas");
    //     var gl = null;
    //     try {
    //       gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    //     } catch (e) { /* squelch */ }
    //     if (gl == null) {
    //       done();
    //     }
    //     var item = function (name, descr, attr1, attr2, attr3) {
    //       var fmt = gl.getShaderPrecisionFormat(attr1, attr2)[attr3];
    //       return ["webgl ", name, " shader ", descr, ":", fmt].join("");
    //     }
    //     var webglExpectedArray = [ /* eslint-disable */
    //       item("vertex"  , "high float precision"           , gl.VERTEX_SHADER  , gl.HIGH_FLOAT  , "precision"),
    //       item("vertex"  , "high float precision rangeMin"  , gl.VERTEX_SHADER  , gl.HIGH_FLOAT  , "rangeMin"),
    //       item("vertex"  , "high float precision rangeMax"  , gl.VERTEX_SHADER  , gl.HIGH_FLOAT  , "rangeMax"),
    //       item("vertex"  , "medium float precision"         , gl.VERTEX_SHADER  , gl.MEDIUM_FLOAT, "precision"),
    //       item("vertex"  , "medium float precision rangeMin", gl.VERTEX_SHADER  , gl.MEDIUM_FLOAT, "rangeMin"),
    //       item("vertex"  , "medium float precision rangeMax", gl.VERTEX_SHADER  , gl.MEDIUM_FLOAT, "rangeMax"),
    //       item("vertex"  , "low float precision"            , gl.VERTEX_SHADER  , gl.LOW_FLOAT   , "precision"),
    //       item("vertex"  , "low float precision rangeMin"   , gl.VERTEX_SHADER  , gl.LOW_FLOAT   , "rangeMin"),
    //       item("vertex"  , "low float precision rangeMax"   , gl.VERTEX_SHADER  , gl.LOW_FLOAT   , "rangeMax"),
    //       item("vertex"  , "high int precision"             , gl.VERTEX_SHADER  , gl.HIGH_INT    , "precision"),
    //       item("vertex"  , "high int precision rangeMin"    , gl.VERTEX_SHADER  , gl.HIGH_INT    , "rangeMin"),
    //       item("vertex"  , "high int precision rangeMax"    , gl.VERTEX_SHADER  , gl.HIGH_INT    , "rangeMax"),
    //       item("vertex"  , "medium int precision"           , gl.VERTEX_SHADER  , gl.MEDIUM_INT  , "precision"),
    //       item("vertex"  , "medium int precision rangeMin"  , gl.VERTEX_SHADER  , gl.MEDIUM_INT  , "rangeMin"),
    //       item("vertex"  , "medium int precision rangeMax"  , gl.VERTEX_SHADER  , gl.MEDIUM_INT  , "rangeMax"),
    //       item("vertex"  , "low int precision"              , gl.VERTEX_SHADER  , gl.LOW_INT     , "precision"),
    //       item("vertex"  , "low int precision rangeMin"     , gl.VERTEX_SHADER  , gl.LOW_INT     , "rangeMin"),
    //       item("vertex"  , "low int precision rangeMax"     , gl.VERTEX_SHADER  , gl.LOW_INT     , "rangeMax"),
    //       item("fragment", "high float precision"           , gl.FRAGMENT_SHADER, gl.HIGH_FLOAT  , "precision"),
    //       item("fragment", "high float precision rangeMin"  , gl.FRAGMENT_SHADER, gl.HIGH_FLOAT  , "rangeMin"),
    //       item("fragment", "high float precision rangeMax"  , gl.FRAGMENT_SHADER, gl.HIGH_FLOAT  , "rangeMax"),
    //       item("fragment", "medium float precision"         , gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT, "precision"),
    //       item("fragment", "medium float precision rangeMin", gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT, "rangeMin"),
    //       item("fragment", "medium float precision rangeMax", gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT, "rangeMax"),
    //       item("fragment", "low float precision"            , gl.FRAGMENT_SHADER, gl.LOW_FLOAT   , "precision"),
    //       item("fragment", "low float precision rangeMin"   , gl.FRAGMENT_SHADER, gl.LOW_FLOAT   , "rangeMin"),
    //       item("fragment", "low float precision rangeMax"   , gl.FRAGMENT_SHADER, gl.LOW_FLOAT   , "rangeMax"),
    //       item("fragment", "high int precision"             , gl.FRAGMENT_SHADER, gl.HIGH_INT    , "precision"),
    //       item("fragment", "high int precision rangeMin"    , gl.FRAGMENT_SHADER, gl.HIGH_INT    , "rangeMin"),
    //       item("fragment", "high int precision rangeMax"    , gl.FRAGMENT_SHADER, gl.HIGH_INT    , "rangeMax"),
    //       item("fragment", "medium int precision"           , gl.FRAGMENT_SHADER, gl.MEDIUM_INT  , "precision"),
    //       item("fragment", "medium int precision rangeMin"  , gl.FRAGMENT_SHADER, gl.MEDIUM_INT  , "rangeMin"),
    //       item("fragment", "medium int precision rangeMax"  , gl.FRAGMENT_SHADER, gl.MEDIUM_INT  , "rangeMax"),
    //       item("fragment", "low int precision"              , gl.FRAGMENT_SHADER, gl.LOW_INT     , "precision"),
    //       item("fragment", "low int precision rangeMin"     , gl.FRAGMENT_SHADER, gl.LOW_INT     , "rangeMin"),
    //       item("fragment", "low int precision rangeMax"     , gl.FRAGMENT_SHADER, gl.LOW_INT     , "rangeMax"),
    //     ]

    //     Fingerprint2.get(function (components) {
    //       webglExpectedArray.forEach(function (item) {
    //         expect(getComponent(components, "webgl").indexOf(item)).not.toEqual(-1)
    //       })
    //       done();
    //     });
    //   });
    // });

    // describe("preprocessor", function () {
    //   it("checks that preprocessor not used by default", function (done) {
    //     Fingerprint2.get(function (components) {
    //       expect(getComponent(components, "userAgent")).not.toEqual("MyUserAgent")
    //       done()
    //     });
    //   });

    //   it("checks that preprocessor function applied to component value", function (done) {
    //     var mykey = "userAgent"
    //     var options = {
    //       preprocessor: function (key, value) {
    //         if (key === mykey) {
    //           return "MyUserAgent"
    //         }
    //         return value
    //       }
    //     }
    //     Fingerprint2.get(options, function (components) {
    //       expect(getComponent(components, mykey)).toEqual("MyUserAgent")
    //       done()
    //     });
    //   });
    // });

    // describe("extra", function () {
    //   //https://github.com/jsdom/jsdom/blob/master/lib/jsdom/living/navigator/NavigatorPlugins-impl.js
    //   it("should no throw in jsdom like environment", function (done) {
    //     // direct assignment does not work
    //     Object.defineProperty(navigator, "plugins", {
    //       value: {
    //         javaEnabled: function () {
    //           return false
    //         }
    //       }
    //     });
    //     Fingerprint2.get(function (components) {
    //       expect(getComponent(components, "plugins")).toBeDefined()
    //       done()
    //     });
    //   });
    // });
//   });
// });
