exports.route = {
    async get() {
        let tableData = [];
        const themeData = await this.db.execute(`SELECT ANSWER_A, ANSWER_B,
            ANSWER_C, ANSWER_D, ANSWER_E FROM VOTE_RESULT WHERE ID=1`);
        const identityData = await this.db.execute(`SELECT ANSWER_A, ANSWER_B,
            ANSWER_C, ANSWER_D, ANSWER_E FROM VOTE_RESULT WHERE ID=0`);
        tableData.push({
            "在读本科生": identityData.rows[0][0],
            "在读研究生": identityData.rows[0][1],
            "学校教职工": identityData.rows[0][2],
        })
        tableData.push({
            "红蓝学院风": themeData.rows[0][0],
            "暖黄松绿风": themeData.rows[0][1],
            "清爽蓝白配": themeData.rows[0][2],
        })
        console.log(tableData);
        return tableData
    }
};