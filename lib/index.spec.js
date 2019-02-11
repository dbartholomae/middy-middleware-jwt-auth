import debug from 'debug';
import Module from './index';
jest.mock('debug');
var mockedDebug = debug;
test('should send debug message on start', function () {
    var mockLogger = jest.fn();
    mockedDebug.mockReturnValue(mockLogger);
    new Module().start();
    expect(mockLogger).toBeCalled();
});
