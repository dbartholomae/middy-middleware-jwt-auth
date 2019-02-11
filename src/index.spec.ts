import debug from 'debug'
import Module from './index'

jest.mock('debug')
const mockedDebug = (debug as any) as jest.Mock<typeof debug>

test('should send debug message on start', () => {
  const mockLogger = jest.fn()
  mockedDebug.mockReturnValue(mockLogger as any)
  new Module().start()
  expect(mockLogger).toBeCalled()
})
