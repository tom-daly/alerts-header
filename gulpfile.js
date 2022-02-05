"use strict";

const build = require("@microsoft/sp-build-web");

build.addSuppression(
  `Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`
);
build.addSuppression(/error semicolon: Unnecessary semicolon$/);
build.addSuppression(/error semicolon: Missing semicolon$/);
build.addSuppression(/filename should end with module.sass or module.scss$/);

require("./spfx-versioning")(build);


build.configureWebpack.mergeConfig({
    additionalConfiguration: (generatedConfiguration) => {
      generatedConfiguration.externals.splice(generatedConfiguration.externals.indexOf('@fortawesome'), 1);
      return generatedConfiguration;
    },
});
    
build.configureWebpack.mergeConfig({
  additionalConfiguration: (generatedConfiguration) => {

    generatedConfiguration.module.rules.push({
      test: /\.(j|t)sx?$/,
      use: {
        loader: "ts-loader"
      },
    });

    return generatedConfiguration;
  },
});

build.initialize(require("gulp"));
