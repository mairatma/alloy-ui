var del = require('del');
var es = require('event-stream');
var fs = require('fs');
var gulp = require('gulp');
var gulpif = require('gulp-if');
var gutil = require('gulp-util');
var path = require('path');

gulp.task('clean', function(done) {
    del(['build'], done);
});

gulp.task('build', ['clean'], function() {
    return gulp.src(['src/**/meta/*.json'])
        .pipe(es.through(buildAlloyModule))
        .pipe(gulp.dest('build'));
});

gulp.task('watch', function() {
    gulp.watch(['src/**'], ['build']);
});

function buildAlloyModule(file) {
    var moduleName = file.relative.split(path.sep)[0];
    var config = JSON.parse(file.contents);
    var components = Object.keys(config);

    for (var i = 0; i < components.length; i++) {
        var currentConfig = config[components[i]];

        if (currentConfig.widgetName) {
            var templatePath = path.join(file.base, moduleName, 'template/' + components[i] + '.html');
            var template = fs.readFileSync(templatePath, 'utf8');

            var contents = '<link href="../../../bower_components/polymer/polymer.html" rel="import">\n\n';
            contents += '<script src="../../../bower_components/liferay-core/src/lfr.js"></script>\n' +
                '<script src="../../../bower_components/liferay-core/src/disposable/Disposable.js"></script>\n' +
                '<script src="../../../bower_components/liferay-core/src/structs/Trie.js"></script>\n' +
                '<script src="../../../bower_components/liferay-core/src/structs/WildcardTrie.js"></script>\n' +
                '<script src="../../../bower_components/liferay-core/src/events/EventHandle.js"></script>\n' +
                '<script src="../../../bower_components/liferay-core/src/events/EventEmitter.js"></script>\n\n' +
                '<script src="../../attributes/attributes.js"></script>\n' +
                '<script src="../../widget-element/widget-element.js"></script>\n' +
                '<script src="../../widget/widget.js"></script>\n' +
                '<script src="' + components[i] + '.js"></script>\n\n';

            contents += '<polymer-element name="aui-' + components[i] + '">\n' +
                '<template>\n' +
                '<link rel="stylesheet" href="' + components[i] + '.css">\n\n' +
                template +
                '</template>\n\n' +
                '<script>\n' +
                'AlloyElement(' + currentConfig.widgetName + ');\n' +
                '</script>\n' +
                '</polymer-element>\n';

            this.emit('data', createStreamFile(
                file.base,
                path.join(file.base, 'components', components[i], 'index.html'),
                new Buffer(contents)
            ));
            this.emit('data', createStreamFileFromExisting(
                file.base,
                path.join(file.base, 'components', components[i], components[i] + '.js'),
                path.join(file.base, moduleName, 'js', components[i] + '.js')
            ));
            this.emit('data', createStreamFileFromExisting(
                file.base,
                path.join(file.base, 'components', components[i], components[i] + '.css'),
                path.join(file.base, moduleName, 'css', components[i] + '.css')
            ));
        } else {
            this.emit('data', createStreamFileFromExisting(
                file.base,
                path.join(file.base, components[i], components[i] + '.js'),
                path.join(file.base, moduleName, 'js', components[i] + '.js')
            ));
        }
    }
}

function createStreamFile(basePath, filePath, contents) {
    return new gutil.File({
        base: basePath,
        contents: contents,
        path: filePath
    });
}

function createStreamFileFromExisting(basePath, filePath, originalFilePath) {
    var contents = fs.readFileSync(originalFilePath);
    return createStreamFile(basePath, filePath, contents);
}

