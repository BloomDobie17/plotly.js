var Plotly = require('@lib/index');
var Lib = require('@src/lib');

var createGraphDiv = require('../assets/create_graph_div');
var destroyGraphDiv = require('../assets/destroy_graph_div');
var failTest = require('../assets/fail_test');
var mouseEvent = require('../assets/mouse_event');
var touchEvent = require('../assets/touch_event');

function drag(path, options) {
    var len = path.length;

    if(!options) options = { type: 'mouse' };

    Lib.clearThrottle();

    if(options.type === 'touch') {
        touchEvent('touchstart', path[0][0], path[0][1], options);

        path.slice(1, len).forEach(function(pt) {
            Lib.clearThrottle();
            touchEvent('touchmove', pt[0], pt[1], options);
        });

        touchEvent('touchend', path[len - 1][0], path[len - 1][1], options);
        return;
    }

    mouseEvent('mousemove', path[0][0], path[0][1], options);
    mouseEvent('mousedown', path[0][0], path[0][1], options);

    path.slice(1, len).forEach(function(pt) {
        Lib.clearThrottle();
        mouseEvent('mousemove', pt[0], pt[1], options);
    });

    mouseEvent('mouseup', path[len - 1][0], path[len - 1][1], options);
}

describe('Draw new shape to layout', function() {
    var gd;

    beforeEach(function() {
        gd = createGraphDiv();
    });

    afterEach(destroyGraphDiv);

    it('@flaky various drawmodes', function(done) {
        var n = 0; // initial number of shapes

        var fig = Lib.extendDeep({}, require('@mocks/13'));
        fig.layout = {
            width: 800,
            height: 600,
            margin: {
                t: 60,
                l: 40,
                r: 20,
                b: 30
            }
        };

        Plotly.newPlot(gd, fig)

            .then(function() {
                var newFig = Lib.extendFlat({}, fig);

                newFig.layout.dragmode = 'drawclosedpath';

                return Plotly.react(gd, newFig);
            })
            .then(function() {
                return drag([[100, 100], [200, 100], [200, 200], [100, 200]]);
            })
            .then(function() {
                var shapes = gd._fullLayout.shapes;
                expect(shapes.length).toEqual(++n);
                var out = shapes[n - 1]._input;
                expect(out).toEqual({
                    'editable': true,
                    'xref': 'x',
                    'yref': 'y',
                    'layer': 'above',
                    'opacity': 1,
                    'line': {
                        'color': '#444',
                        'width': 4,
                        'dash': 'solid'
                    },
                    'fillcolor': 'rgba(0,0,0,0)',
                    'fillrule': 'evenodd',
                    'type': 'path',
                    'path': 'M1.3237082066869301,17.931372549019606L4.363221884498481,17.931372549019606L4.363221884498481,14.009803921568627L1.3237082066869301,14.009803921568627Z'
                });
            })

            .then(function() {
                var newFig = Lib.extendFlat({}, fig);

                newFig.layout.dragmode = 'drawrect';

                return Plotly.react(gd, newFig);
            })
            .then(function() {
                return drag([[175, 175], [275, 275]]);
            })
            .then(function() {
                var shapes = gd._fullLayout.shapes;
                expect(shapes.length).toEqual(++n);
                var out = shapes[n - 1]._input;
                expect(out).toEqual({
                    'editable': true,
                    'xref': 'x',
                    'yref': 'y',
                    'layer': 'above',
                    'opacity': 1,
                    'line': {
                        'color': '#444',
                        'width': 4,
                        'dash': 'solid'
                    },
                    'fillcolor': 'rgba(0,0,0,0)',
                    'fillrule': 'evenodd',
                    'type': 'rect',
                    'x0': 3.603343465045593,
                    'y0': 14.990196078431373,
                    'x1': 6.642857142857143,
                    'y1': 11.068627450980392
                });
            })

            .then(function() {
                var newFig = Lib.extendFlat({}, fig);

                newFig.layout.dragmode = 'drawline';

                return Plotly.react(gd, newFig);
            })
            .then(function() {
                return drag([[125, 125], [75, 75]]);
            })
            .then(function() {
                var shapes = gd._fullLayout.shapes;
                expect(shapes.length).toEqual(++n);
                var out = shapes[n - 1]._input;
                expect(out).toEqual({
                    'editable': true,
                    'xref': 'x',
                    'yref': 'y',
                    'layer': 'above',
                    'opacity': 1,
                    'line': {
                        'color': '#444',
                        'width': 4,
                        'dash': 'solid'
                    },
                    'type': 'line',
                    'x0': 2.0835866261398177,
                    'y0': 16.95098039215686,
                    'x1': 0.5638297872340426,
                    'y1': 18.91176470588235
                });
            })

            .then(function() {
                var newFig = Lib.extendFlat({}, fig);

                newFig.layout.dragmode = 'drawopenpath';

                return Plotly.react(gd, newFig);
            })
            .then(function() {
                return drag([[175, 125], [225, 75], [255, 75], [175, 125]]);
            })
            .then(function() {
                var shapes = gd._fullLayout.shapes;
                expect(shapes.length).toEqual(++n);
                var out = shapes[n - 1]._input;
                expect(out).toEqual({
                    'editable': true,
                    'xref': 'x',
                    'yref': 'y',
                    'layer': 'above',
                    'opacity': 1,
                    'line': {
                        'color': '#444',
                        'width': 4,
                        'dash': 'solid'
                    },
                    'type': 'path',
                    'path': 'M3.603343465045593,16.95098039215686L5.123100303951368,18.91176470588235L6.034954407294833,18.91176470588235L3.603343465045593,16.95098039215686'
                });
            })

            .then(function() {
                var newFig = Lib.extendFlat({}, fig);

                newFig.layout.dragmode = 'drawcircle';

                return Plotly.react(gd, newFig);
            })
            .then(function() {
                return drag([[125, 175], [75, 225]]);
            })
            .then(function() {
                var shapes = gd._fullLayout.shapes;
                expect(shapes.length).toEqual(++n);
                var out = shapes[n - 1]._input;
                expect(out).toEqual({
                    'editable': true,
                    'xref': 'x',
                    'yref': 'y',
                    'layer': 'above',
                    'opacity': 1,
                    'line': {
                        'color': '#444',
                        'width': 4,
                        'dash': 'solid'
                    },
                    'fillcolor': 'rgba(0,0,0,0)',
                    'fillrule': 'evenodd',
                    'type': 'circle',
                    'x0': -0.06567410694999332,
                    'y0': 12.21722830907236,
                    'x1': 4.232847359229629,
                    'y1': 17.763163847790384
                });
            })

            .then(function() {
                var newFig = Lib.extendFlat({}, fig);

                newFig.layout.dragmode = 'drawcircle';

                return Plotly.react(gd, newFig);
            })
            .then(function() {
                return drag([[125, 175], [126, 225]]); // dx close to 0 should draw a circle not an ellipse
            })
            .then(function() {
                var shapes = gd._fullLayout.shapes;
                expect(shapes.length).toEqual(++n);
                var out = shapes[n - 1]._input;
                expect(out).toEqual({
                    'editable': true,
                    'xref': 'x',
                    'yref': 'y',
                    'layer': 'above',
                    'opacity': 1,
                    'line': {
                        'color': '#444',
                        'width': 4,
                        'dash': 'solid'
                    },
                    'fillcolor': 'rgba(0,0,0,0)',
                    'fillrule': 'evenodd',
                    'type': 'circle',
                    'x0': 3.6033434650455933,
                    'y0': 13.029411764705882,
                    'x1': 0.5638297872340421,
                    'y1': 16.950980392156865
                });
            })
            .then(function() {
                return drag([[125, 175], [75, 176]]); // dy close to 0 should draw a circle not an ellipse
            })
            .then(function() {
                var shapes = gd._fullLayout.shapes;
                expect(shapes.length).toEqual(++n);
                var out = shapes[n - 1]._input;
                expect(out).toEqual({
                    'editable': true,
                    'xref': 'x',
                    'yref': 'y',
                    'layer': 'above',
                    'opacity': 1,
                    'line': {
                        'color': '#444',
                        'width': 4,
                        'dash': 'solid'
                    },
                    'fillcolor': 'rgba(0,0,0,0)',
                    'fillrule': 'evenodd',
                    'type': 'circle',
                    'x0': 0.5638297872340419,
                    'y0': 16.950980392156865,
                    'x1': 3.6033434650455938,
                    'y1': 13.029411764705882
                });
            })

            .catch(failTest)
            .then(done);
    });
});

function print(shapes, n) {
    console.log(JSON.stringify(
        shapes[n]._input, null, 4
    ).replace(/"/g, '\''));
}
