export function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next); //,catch(next) means .catch(err)=>{next(err)}
    };
}
//# sourceMappingURL=asyncHandler.js.map