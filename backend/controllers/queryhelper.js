async function runQuery(model, queryObj, populatePaths) {
  let query = model.find();

  for (const queryKey in query) {
    const queryValue = query[queryKey];
    const queryType = model.schema.path(queryKey).instance;
  }
}

export default async function queryHelper(model, queryObj, populatePaths) {
  const queryObj = queryObj ?? {};
  for (const key in queryObj) return await runQuery(model, queryObj, populatePaths);
  const query = model.find();
  return await (populatePaths ? query.populate(populatePaths) : query);
}
