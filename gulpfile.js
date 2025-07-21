
const gulp = require('gulp');
const header = require('gulp-header');
const fs = require('fs');



const license = fs.readFileSync('license-header.txt', 'utf8');

gulp.task('add-license', () => {
  return gulp.src(['src/**/*.ts'], { base: './' }) 
    .pipe(header(license + '\n'))
    .pipe(gulp.dest('./'));
});


// to remove 

// const replace = require('gulp-replace');

// const licenseHeaderRegex = /\/\*[\s\S]*?Copyright \(c\) 2025[\s\S]*?\*\//;

// // Task to remove the license header from all .ts files
// gulp.task('remove-license', () => {
//   return gulp.src(['src/**/*.ts'], { base: './' }) // adjust as needed
//     .pipe(replace(licenseHeaderRegex, ''))
//     .pipe(gulp.dest('./'));
// });