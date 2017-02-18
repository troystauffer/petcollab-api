global.validate = function(req, res, expectedResult, expectedStatus, execute) {
  let validateResult = function(res) { expect(res.response).toEqual(expectedResult); }
  let validateStatus = function(res) { expect(res.code).toEqual(expectedStatus); }
  res.on('json', validateResult);
  res.on('status', validateStatus);
  execute(req, res);
  res.removeListener('json', validateResult);
  res.removeListener('status', validateStatus);
}