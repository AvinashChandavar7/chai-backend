const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise
      .resolve(requestHandler(req, res, next))
      .catch((err) => next(err));
  }
};

export { asyncHandler };


/**********************************************
 * !1) this try/catch approach
 * const asyncHandler = (fn) => async (req, res, next) => {
 *   try {
 *     await fn(req, res, next);
 *   } catch (error) {
 *     res.status(err.code || 500).json({
 *       success: false,
 *       message: err.message
 *     })
 *   }
 * }
 * 
 ***********************************************
 *
 * !2) this Promise approach
 * const asyncHandler = (requestHandler) => {
 *   (req, res, next) => {
 *     Promise
 *       .resolve(requestHandler(req, res, next))
 *       .catch((err) => next(err));
 *   }
 * };
 *  
 *************************************************
 ***/


/***
 * !1)
 *   const asyncHandler = (fn) => {}
 * !2a)
 *   const asyncHandler = (fn) => {() => {}}
 * !2b)
 *   const asyncHandler = (fn) => () => {}
 * !3)
 *   const asyncHandler =  (fn) => async () => {}
 */