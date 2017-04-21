import RO from '../../lib/response_object';

describe('ResponseObject', () => {
  it('should error when incorrectly initialized', () => {
    expect(() => {
      new RO();
    }).toThrow();
  });
  it('should return the correct message', () => {
    let message = 'My message';
    expect(new RO({success: true, message: message}).message).toEqual(message);
  });
  it('should return the correct errors', () => {
    let errors = ['error1', 'error2'];
    expect(new RO({success: false, errors: errors}).errors).toEqual(errors);
  });
  it('should return the correct success value', () => {
    let success = true;
    expect(new RO({success: success}).success).toEqual(success);
  });
  it('should return the correct response', () => {
    let response = { myVar1: 'test' };
    expect(new RO({success: true, response: response}).response).toEqual(response);
  });
});