This SASS folder includes everything needed to make your application meet ORBIS's design guidelines. This is meant to be
used with BootStrap Vue.

1) Install required SASS dependencies by running npm install --save-dev node-sass sass-loader
2) import main.scss file into main.ts file
3) (recommended) import independent sass files into vue.config to use variables inside of vue files

css: { loaderOptions: { sass: { prependData: `@import "@package/stylesheets/modules/_colors.scss";`
} } }

this would allow you to use $primary as a color option inside your scoped vue <style>
