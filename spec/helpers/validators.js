global.validate = function(req, res, expectedResult, expectedStatus, execute) {
  const validateResult = function(res) {
    if (res.hasOwnProperty("response")) {
      if (res.response.hasOwnProperty("response")) {
        if (res.response.response.hasOwnProperty("event")) {
          delete res.response.response.event.update;
          delete res.response.response.event.destroy;
        }
        if (res.response.response.hasOwnProperty("pet")) {
          delete res.response.response.pet.update;
          delete res.response.response.pet.destroy;
        }
        if (res.response.response.hasOwnProperty("rescue")) {
          delete res.response.response.rescue.update;
          delete res.response.response.rescue.destroy;
        }
        if (res.response.response.hasOwnProperty("schedule")) {
          delete res.response.response.schedule.update;
          delete res.response.response.schedule.destroy;
        }
        if (res.response.response.hasOwnProperty("schedule_item")) {
          delete res.response.response.schedule_item.update;
          delete res.response.response.schedule_item.destroy;
        }
        if (res.response.response.hasOwnProperty("pets")) {
          res.response.response.pets.forEach((pet) => {
            delete pet.update;
            delete pet.destroy;
          });
        }
        if (res.response.response.hasOwnProperty("rescues")) {
          res.response.response.rescues.forEach((rescue) => {
            delete rescue.update;
            delete rescue.destroy;
          });
        }
      }
    }
    expect(res.response).toEqual(expectedResult);
  }
  const validateStatus = function(res) { expect(res.code).toEqual(expectedStatus); }
  res.on('json', validateResult);
  res.on('status', validateStatus);
  execute(req, res);
  res.removeListener('json', validateResult);
  res.removeListener('status', validateStatus);
}