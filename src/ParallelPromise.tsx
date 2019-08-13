/**
 * Accepts a function that produces a promise given an index.
 *
 * Return false when done generating promises
 *
 * Second argument is max parallel execution (default 10)
 **/
export default (
  count: number,
  iteratorFn: (i: number) => boolean | Promise<any>,
  limit: number = 10
) => {
  const targetPromises = Array.apply(null, Array(limit)).map(() =>
    Promise.resolve()
  )
  const results: any[] = new Array(count)
  for (let i = 0; i < count; i += 1) {
    const promise = iteratorFn(i)
    if (promise === false) break
    const index = i % targetPromises.length
    targetPromises[index] = targetPromises[index]
      .then(() => promise)
      .then((r: any) => (results[i] = r))
  }
  return Promise.all(targetPromises).then(() => results)
}
