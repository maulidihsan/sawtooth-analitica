class AppraisalRepository {
    constructor(repo) {
        this.repository = repo;
    }

    store(appraisalEntity) {
        return this.repository.store(appraisalEntity);
    }

    get(documentId) {
        return this.repository.get(documentId);
    }

    getAppraisal() {
        return this.repository.getAppraisal();
    }
}

module.exports = AppraisalRepository;