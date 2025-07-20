const Category = require("../models/Category");

//add a category
exports.addACategory = async (req,res) => {
    try{
        const {name,description} = req.body;
        if(!name || !description){
            return res.status(403).json({
                success:false,
                message:'All fields are mandatory'
            });
        }
        const category = await Category.create({name,description});
        // console.log(category);
        return res.status(200).json({
            success:true,
            message:'Category added successfully'
        });

    }catch(err){
            // console.log(err);
            return res.status(500).json({
                success:false,
                message:'Error while creating a category'
            })
    }
}

//getallcategories
exports.getAllCategories = async (req,res) =>{
    try{
        const allcats = await Category.find({});
        return res.status(200).json({
            success:true,
            data:allcats,
            messgae:'fetch success'
        });
    }catch(err){
        // console.log(err);
        return res.status(500).json({
            success:false,
            message:'Error in fetching the categories'
        })
    }
}


//categoryPageDetails
exports.categoryPageDetails = async (req,res)=>{
    try{
        const {categoryId} = req.body;
        
        // Get the selected category and populate its courses, and for each course, populate the instructor
        const selectedCategory = await Category.findById(categoryId)
                                        .populate({
                                            path: 'courses',
                                            populate: {
                                                path: 'instructor'
                                            }
                                        })
                                        .exec();

        if(!selectedCategory){
            return res.status(404).json({
                success:false,
                message:'Category not found'
            });
        }
        
        // Get other categories, also populating their courses and instructors
        const differentCategories = await Category.find({_id:{$ne:categoryId}})
                                                    .populate({
                                                        path: 'courses',
                                                        populate: {
                                                            path: 'instructor'
                                                        }
                                                    })
                                                    .exec();
        
        // You can also add a third query for top-selling courses if needed for your page

        return res.status(200).json({
            success:true,
            data:{
                selectedCategory,
                differentCategories
            },
        })

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:'error while fetching category page details',
            
        })
    }
}