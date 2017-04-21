import ApiError from '../../lib/api_error';

describe('ApiError', () => {
  let type = 'error.test.invalid';
  it('should error when incorrectly initialized', () => {
    expect(() => {
      new ApiError();
    }).toThrow();
  });
  it('should return the correct type', () => {
    expect(new ApiError({type: type}).type).toEqual(type);
  });
  it('should return the correct message', () => {
    let message = 'My message';
    expect(new ApiError({type: type, message: message}).message).toEqual(message);
  });
  it('should return the correct detail', () => {
    let detail = 'My detail';
    expect(new ApiError({type: type, detail: detail}).detail).toEqual(detail);
  });
  it('should return the correct validations', () => {
    let validations = ['error1', 'error2'];
    expect(new ApiError({type: type, validation: validations}).validation).toEqual(validations);
  });
});