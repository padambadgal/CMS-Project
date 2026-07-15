const paginate = async (model, query = {}, reqQuery = {}, options = {}) => {
    const { page = 1, limit = 6, sort = '-createAt' } = reqQuery;

    const paginationOptions = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: sort,
        ...options
    };

    try {
        console.log('🔍 Paginate Query:', JSON.stringify(query, null, 2));
        console.log('📊 Paginate Options:', JSON.stringify(paginationOptions, null, 2));
        
        const result = await model.paginate(query, paginationOptions);
        
        console.log('✅ Paginate Result:', {
            totalDocs: result.totalDocs,
            docsLength: result.docs ? result.docs.length : 0,
            page: result.page,
            totalPages: result.totalPages
        });
        
        return {
            data: result.docs || [],
            prevPage: result.prevPage || null,
            nextPage: result.nextPage || null,
            hasNextPage: result.hasNextPage || false,
            hasPrevPage: result.hasPrevPage || false,
            currentPage: result.page || 1,
            counter: result.pagingCounter || 0,
            totalDocs: result.totalDocs || 0,
            limit: result.limit || 6,
            totalPages: result.totalPages || 1
        };
    } catch (error) {
        console.error('❌ Pagination Error:', error.message);
        console.error('Stack:', error.stack);
        
        // Return empty pagination result on error
        return {
            data: [],
            prevPage: null,
            nextPage: null,
            hasNextPage: false,
            hasPrevPage: false,
            currentPage: 1,
            counter: 0,
            totalDocs: 0,
            limit: 6,
            totalPages: 1
        };
    }
};

module.exports = paginate;