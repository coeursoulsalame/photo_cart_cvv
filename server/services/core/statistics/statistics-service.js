class StatisticsService {
    constructor(statisticsController) {
        this.statisticsController = statisticsController;
    }

    async getTableData(req, res) {
        return this.statisticsController.getTableData(req, res);
    }

    async insertServiceRecord(req, res) {
        return this.statisticsController.insertServiceRecord(req, res);
    }
}

module.exports = StatisticsService;