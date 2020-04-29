exports.route = {
  async get() {
    return {cardnum: this.user.cardnum}
  }
}