class DocumentRepository {
    constructor(repo) {
        this.repository = repo;
    }

    store(documentEntity) {
        return this.repository.store(documentEntity);
    }

    get(documentId) {
        return this.repository.get(documentId);
    }

    getPembanding(documentId) {
        return this.repository.getPembanding(documentId);
    }

    getAll() {
        return this.repository.getAll();
    }
}

module.exports = DocumentRepository;