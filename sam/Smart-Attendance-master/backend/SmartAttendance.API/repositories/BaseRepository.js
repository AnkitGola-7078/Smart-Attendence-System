class BaseRepository {
    constructor(model) {
        this.model = model;
    }

    async findById(id) {
        return await this.model.findById(id);
    }

    async findAll() {
        return await this.model.find();
    }

    async findMany(filter) {
        return await this.model.find(filter);
    }

    async findFirst(filter) {
        return await this.model.findOne(filter);
    }

    async findProjected(filter, projection) {
        return await this.model.findOne(filter).select(projection);
    }

    async create(entity) {
        return await this.model.create(entity);
    }

    async update(id, entity) {
        return await this.model.findByIdAndUpdate(id, entity, {
            new: true,
            runValidators: true
        });
    }

    async delete(id) {
        const result = await this.model.findByIdAndDelete(id);
        return result != null;
    }

    async count(filter = {}) {
        return await this.model.countDocuments(filter);
    }

    async exists(filter) {
        return await this.model.exists(filter);
    }
}

module.exports = BaseRepository;