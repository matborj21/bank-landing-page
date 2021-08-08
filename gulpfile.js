// Initialize Modules
const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const babel = require('gulp-babel');
const terser = require('gulp-terser');
const browsersync = require('browser-sync').create();



// Sass Task
function scssTask() {
    return src('app/scss/style.scss', { sourcemaps: true })
        .pipe(sass())
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(dest('dist', { sourcemaps: '.' }));
}

// JavaScript Task
function jsTask() {
    return src('app/js/script.js', { sourcemaps: true })
        .pipe(babel({ presets: ['@babel/preset-env'] }))
        .pipe(terser())
        .pipe(dest('dist', { sourcemaps: '.' }))
}

// Browsersync
function browsersyncServe(cb) {
    browsersync.init({
        server: {
            baseDir: '.',
        },
        notify: {
            styles: {
                top: 'auto',
                bottom: '0',
            },
        },
    });
    cb();
}

function browsersyncReload(cb) {
    browsersync.reload();
    cb();
}

// Watch task
function watchTask() {
    watch('*.html', browsersyncReload);
    watch(
        ['app/scss/**/*.scss', 'app/**/*.js'],
        series(scssTask, jsTask, browsersyncReload)
    );
}

// Commit and push files to Git
function git(done) {
    return exec('git add . && git commit -m "netlify deploy" && git push');
    done();
}

// Watch for netlify deployment
function netlify(done) {
    return new Promise(function(resolve, reject) {
        console.log(execSync('netlify watch').toString());
        resolve();
    });
}

// Preview Deployment
function netlifyOpen(done) {
    return exec('netlify open:site');
    done();
}

// Deploy command
exports.deploy = series(git, netlify, netlifyOpen);

// default Gulp task
exports.default = series(scssTask, jsTask, browsersyncServe, watchTask);