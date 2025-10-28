const { create } = require("../models/category")

const paginate = async (model, query= {}, reqQuery = {}, options ={}) =>{
    const { page = 1, limit = 2, sort = '-createAt' } = reqQuery

    const  paginationOptions = {
        page : parseInt(page),
        limt : parseInt(limit),
        sort,
        ...options
    }

    try{
    const result = await model.paginate(query, paginationOptions)
    
    return {
        data : result.docs,
        prevPage : result.prevPage,
        nextPage: result.nextPage,
        hasNextPage : result.hasNextPage,
        hasPrevPage : result.hasPrevPage,
        currentPage : result.page,
        counter:result.pagingCounter,
        totalDocs : result.totalDocs,
        limit : result.limit,
        totalPages : result.totalPages
    }

    }catch(error){
        console.log('Pagnation Error', error.message)
    }
}

module.exports = paginate