module.exports = async (ctx, next) => {
  ctx.getUserInfo = async (cardnum) => {
    return {cardnum}
  }
  await next()
}