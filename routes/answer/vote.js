exports.route = {
    async post(choice) {
        console.log(choice)
        console.log(this.user.cardnum);
        const voted = await this.db.execute(`SELECT IS_VOTED FROM VOTED WHERE cardnum=:cardnum`, {cardnum: this.user.cardnum});
        if (voted.rows.length === 0) {
            await this.db.execute(`INSERT INTO VOTED
                (CARDNUM, IS_VOTED) 
                VALUES (:cardnum, 1)
                `,
                {
                  cardnum: this.user.cardnum
                })
        }
        else throw '您已经填过啦'
        for (let ans in choice) {
            console.log(ans, choice[ans])
            const res = await this.db.execute(`SELECT ANSWER_${choice[ans][0]} FROM VOTE_RESULT WHERE ID=${ans}`)
            console.log(res)
            if (res.rows.length === 0) {
                await this.db.execute(`INSERT INTO VOTE_RESULT
                (ANSWER_A, ANSWER_B, ANSWER_C, ANSWER_D, ANSWER_E, ID) 
                VALUES (0, 0, 0, 0, 0, ${ans})
                `)
                const nowRes = await this.db.execute(`SELECT ANSWER_${choice[ans][0]} FROM VOTE_RESULT WHERE ID=${ans}`)
                await this.db.execute(`UPDATE VOTE_RESULT SET ANSWER_${choice[ans][0]}=${nowRes.rows[0][0] + 1} WHERE ID=${ans}`);
            }
            else await this.db.execute(`UPDATE VOTE_RESULT SET ANSWER_${choice[ans][0]}=${res.rows[0][0] + 1} WHERE ID=${ans}`);
        }
        return true
    }
};