'use strict';

var test = require('tape');

var createNullStatsd = require('../null.js');

test('null statsd capacity option back compat', function t(assert) {
    var c = createNullStatsd(123);
    assert.strictEqual(c._buffer.capacity(), 123);
    c.close();
    assert.end();
});

test('null statsd has a statsd compatible interface', function t(assert) {
    var c = createNullStatsd({
        capacity: 456,
        prefix: 'a.b'
    });

    c.gauge('some.key', 10);

    assert.strictEqual(c._buffer.capacity(), 456);
    assert.deepEqual(c._buffer.peek(), {
        type: 'g',
        name: 'a.b.some.key',
        value: 10,
        delta: null,
        time: null
    });
    c.close();

    assert.end();
});

test('null.gauge()', function t(assert) {
    var c = createNullStatsd();
    c.gauge('some.key', 10);

    assert.deepEqual(c._buffer.peek(), {
        type: 'g',
        name: 'some.key',
        value: 10,
        delta: null,
        time: null
    });

    c.close();
    assert.end();
});

test('null.counter()', function t(assert) {
    var c = createNullStatsd();
    c.counter('some.key', 5);

    assert.deepEqual(c._buffer.peek(), {
        type: 'c',
        name: 'some.key',
        value: null,
        delta: 5,
        time: null
    });

    c.close();
    assert.end();
});

test('null.increment()', function t(assert) {
    var c = createNullStatsd();

    c.increment('some.key');

    assert.deepEqual(c._buffer.peek(), {
        type: 'c',
        name: 'some.key',
        value: null,
        delta: 1,
        time: null
    });

    c._buffer.deq();
    c.increment('some.key2', 3);

    assert.deepEqual(c._buffer.peek(), {
        type: 'c',
        name: 'some.key2',
        value: null,
        delta: 3,
        time: null
    });

    c.close();
    assert.end();
});

test('null.decrement()', function t(assert) {
    var c = createNullStatsd();

    c.decrement('some.key');

    assert.deepEqual(c._buffer.peek(), {
        type: 'c',
        name: 'some.key',
        value: null,
        delta: -1,
        time: null
    });

    c._buffer.deq();
    c.decrement('some.key2', 3);

    assert.deepEqual(c._buffer.peek(), {
        type: 'c',
        name: 'some.key2',
        value: null,
        delta: -3,
        time: null
    });

    c._buffer.deq();
    c.decrement('some.key3', -3);

    assert.deepEqual(c._buffer.peek(), {
        type: 'c',
        name: 'some.key3',
        value: null,
        delta: -3,
        time: null
    });

    c.close();
    assert.end();
});

test('null.timing()', function t(assert) {
    var c = createNullStatsd();

    c.timing('some.key', 500);

    assert.deepEqual(c._buffer.peek(), {
        type: 'ms',
        name: 'some.key',
        value: null,
        delta: null,
        time: 500
    });

    c.close();
    assert.end();
});
