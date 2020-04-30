exports.route = {
    async post(choice) {
        console.log(choice)
        //console.log(this.user.cardnum);
        const cardnum = this.user.cardnum;
        const voted = await this.db.execute(`SELECT IS_VOTED FROM VOTED WHERE cardnum=:cardnum`, { cardnum: cardnum });
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
        if (cardnum.startsWith('21')) {
            // 本科生
            const res = await this.db.execute(`SELECT ANSWER_A FROM VOTE_RESULT WHERE ID=0`)
            if (res.rows.length === 0) {
                await this.db.execute(`INSERT INTO VOTE_RESULT
                (ANSWER_A, ANSWER_B, ANSWER_C, ANSWER_D, ANSWER_E, ID) 
                VALUES (1, 0, 0, 0, 0, 0)
                `)
            }
            else await this.db.execute(`UPDATE VOTE_RESULT SET ANSWER_A=${res.rows[0][0] + 1} WHERE ID=0`);
        } else if (cardnum.startsWith('10') || cardnum.startsWith('22') || cardnum.startsWith('31')) {
            // 教职工
            const res = await this.db.execute(`SELECT ANSWER_C FROM VOTE_RESULT WHERE ID=0`)
            if (res.rows.length === 0) {
                await this.db.execute(`INSERT INTO VOTE_RESULT
                (ANSWER_A, ANSWER_B, ANSWER_C, ANSWER_D, ANSWER_E, ID) 
                VALUES (0, 0, 1, 0, 0, 0)
                `)
            }
            else await this.db.execute(`UPDATE VOTE_RESULT SET ANSWER_C=${res.rows[0][0] + 1} WHERE ID=0`);
        } else {
            //研究生
            const res = await this.db.execute(`SELECT ANSWER_B FROM VOTE_RESULT WHERE ID=0`)
            if (res.rows.length === 0) {
                await this.db.execute(`INSERT INTO VOTE_RESULT
                (ANSWER_A, ANSWER_B, ANSWER_C, ANSWER_D, ANSWER_E, ID) 
                VALUES (0, 1, 0, 0, 0, 0)
                `)
            }
            else await this.db.execute(`UPDATE VOTE_RESULT SET ANSWER_B=${res.rows[0][0] + 1} WHERE ID=0`);
        }
        for (let ans in choice) {
            console.log(ans, choice[ans])
            const res = await this.db.execute(`SELECT ANSWER_${choice[ans][0]} FROM VOTE_RESULT WHERE ID=1`)
            console.log(res)
            if (res.rows.length === 0) {
                await this.db.execute(`INSERT INTO VOTE_RESULT
                (ANSWER_A, ANSWER_B, ANSWER_C, ANSWER_D, ANSWER_E, ID) 
                VALUES (0, 0, 0, 0, 0, 1)
                `)
                const nowRes = await this.db.execute(`SELECT ANSWER_${choice[ans][0]} FROM VOTE_RESULT WHERE ID=1`)
                await this.db.execute(`UPDATE VOTE_RESULT SET ANSWER_${choice[ans][0]}=${nowRes.rows[0][0] + 1} WHERE ID=1`);
            }
            else await this.db.execute(`UPDATE VOTE_RESULT SET ANSWER_${choice[ans][0]}=${res.rows[0][0] + 1} WHERE ID=1`);
        }
        return true
    }
};