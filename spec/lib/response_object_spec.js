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
  it('should allow the use of setters', () => {
    let message = 'My message';
    let errors = ['error3', 'error4'];
    let success = true;
    let response = { myVar2: 'test' }
    let ro = new RO({success: false});
    ro.setMessage(message);
    ro.setErrors(errors);
    ro.setSuccess(success);
    ro.setResponse(response);
    let o = ro.obj();
    expect(o.message).toEqual(message);
    expect(o.errors).toEqual(errors);
    expect(o.success).toEqual(success);
    expect(o.response).toEqual(response);
  });
});