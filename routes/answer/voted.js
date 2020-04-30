exports.route = {
    async get() {
        //console.log("request arrived")
        const voted = await this.db.execute(`SELECT IS_VOTED FROM VOTED WHERE cardnum=:cardnum`, {cardnum: this.user.cardnum});
        if (voted.rows.length === 0) return {isVoted: false}
        else return {isVoted: true}
    }
};