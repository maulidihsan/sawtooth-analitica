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

    getAll() {
        return this.repository.getAll();
    }
}

module.exports = AppraisalRepository;