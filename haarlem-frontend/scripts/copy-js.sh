#!/bin/sh

cp ./node_modules/@discipl/waardepapieren-component/build/static/js/main.*.js ./public/js/main.js
cp ./node_modules/@discipl/waardepapieren-component/build/static/css/main.*.css ./public/css/main.css
cp -r ./node_modules/@discipl/waardepapieren-component/public/form-assets ./public/form-assets