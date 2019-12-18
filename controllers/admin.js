const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//models
const Admin = require('../models/admin');
const Services = require('../models/services');
const Offers = require('../models/offers');
const Booking = require('../models/bookings');


// admin login
exports.postAdminLogin = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    try{
        const currentAdmin = await Admin.findOne({ email: email });
        if(!currentAdmin){
            res.status(401).json({msg: 'Admin not exist. Please SignUp first then try again'})
        }else{
            const passwordMatch = await bcrypt.compare(password, currentAdmin.password);
            if(!passwordMatch){
                const error = new Error('Wrong Password');
                error.statusCode = 401;
                throw error;
            }else{
                const token = jwt.sign({
                    email: currentAdmin.email,
                    userId: currentAdmin._id.toString(),
                    role: currentAdmin.role
                },
                'supersecretkeyforsalozonewebserver'
                );
                res.status(200).json({ token: token});
            }
        }
    }
    catch(error) {
        console.log(error);
    }
}


//admin register
exports.postAdminSignUp  = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const currentAdmin = await Admin.findOne({ email: email });
        if(currentAdmin){
            return res.status(409).json({ msg: "admin already exists. Please log into your Account"});
        }else{
            const hashedPassword = await bcrypt.hash(password, 12);
            const admin = new Admin({
                email: email,
                password: hashedPassword
            })
            
            const result = await admin.save();
            console.log(result);
            res.status(201).json({ msg : "Admin Registered"});
        }
}


//get all services or filter by giving type 
exports.getServices = async (req, res, next) => {
    let type;
    
    if(req.query.type){
        type = req.query.type;
    }
    let name;
    if(req.query.name){
        name = req.query.name ? req.query.name : undefined ;
    }
    try{

        if(type || name){
            const response = await Services.find(type && name ? { type: type, name: name} : (type ? {type: type} : {name: name}));
            if(!response){
                res.status(409).json({ msg: 'No service found with this type'})
            }
            return res.status(200).json(response);
        }

        const response = await Services.find();
        if(!response){
            res.status(500).json({ msg: 'Server Error, Please try again after some time'})
        }
        return res.status(200).json(response);
    }
    catch(err){
        console.log(err);
    }
}


//add services
//use content type as formData, this will not work on application/json
exports.postServices = async (req, res, next) => {
    const id = req.body.id
    const name = req.body.name;
    const type = req.body.type;
    const basePrice = req.body.basePrice;
    const discountedPrice = req.body.discountedPrice;
    const product = req.body.product;

    const imagePath = req.file.path; //use name='image' for the input field of image
    

    try{
        const currentService = await Services.findOne({ name: name, type: type  });
        if(currentService){
            return res.status(409).json({ msg: 'Service already Exists. Try editing or deleting it'});
        }
        const currentTypeService = await Services.findOne({ name: name  });
        if(currentTypeService){
            return res.status(409).json({ msg: 'Service already Exists with this name. Give a type to it or try editing or deleting it'});
        }
        const service = new Services({
            id: id,
            name: name,
            type: type,
            product: product,
            basePrice: basePrice,
            discountedPrice: discountedPrice, 
            imagePath: imagePath
        });

        const response = await service.save();
        return res.status(201).json(response);
    } catch(err){
        console.log(err);
    }
}


//edit services basePrice and discountedPrice
exports.editServices = async (req, res, next) => {
    const name = req.body.name;
    const type = req.body.type;
    const newProduct = req.body.product;
    const newBasePrice = req.body.basePrice;
    const newDiscountedPrice = req.body.discountedPrice;
    const newImagePath = req.file.path; //use name='image' for the input field of image


    const currentService = await Services.findOne({ name: name });
    if(!currentService){
        return res.status(409).json({ msg: 'No service found with that name'});
    }
    currentService.product = newProduct ? newProduct : currentService.product;
    currentService.basePrice = newBasePrice ? newBasePrice : currentService.basePrice;
    currentService.discountedPrice = newDiscountedPrice ? newDiscountedPrice : currentService.discountedPrice;
    currentService.imagePath = newImagePath ? newImagePath : currentService.imagePath;

    const response = await currentService.save();
    return res.status(201).json(response);
}


//delete services
exports.deleteServices = async (req, res, next) => {
    const name = req.body.name;
    const type = req.body.type;
    const product = req.body.product;

    if(product){
        const currentService = await Services.findOne({ name: name, product: product });
        if(!currentService){
            return res.status(409).json({ msg: 'No service found with that name'});
        }
        const response = await Services.findOneAndDelete({ name: name, product: product });
        return res.status(200).json({
            msg: 'Service Successfully Deleted'
        })
    }

    const currentService = await Services.findOne({ name: name });
    if(!currentService){
        return res.status(409).json({ msg: 'No service found with that name'});
    }
    const response = await Services.findOneAndDelete({ name: name });
    res.status(200).json({
        msg: 'Service Successfully Deleted'
    })
}

//get offers
exports.getOffers = async (req, res) => {
    let name;
    if(req.query.name){
        name= req.query.name
    }

    try{
        if(name){
            const response = await Offers.findOne({ name: name });
            if(!response){
                return res.status(409).json({ msg: 'No Offer found with that name'})
            }
            return res.status(200).json({response: response})
        }
        const response = await Offers.find();

        if(!response){
            return res.status(409).json({ msg: 'No Offer found with that name'})
        }

        return res.status(200).json({response: response})

    }catch(err){
        console.log(err);
    }
}

//post offers
exports.postOffers = async (req, res) => {
    const id = req.body.id;
    const name = req.body.name;
    const services = req.body.services;

    const imagePath = req.file.path;

    try{
        const currentOffer = Offers.findOne({ name: name});
        if( currentOffer){
            return res.status(409).json({ msg: 'Offers with this name already exists'});
        }

        const offer = new Offers({
            id: id,
            name : name,
            services: services,
            imagePath: imagePath
        })

        const response = await offer.save()
        return res.status(201).json({ msg: 'Offers Saved', response: response});
        
    }catch(err){
        console.log(err)
    }

}


//edit offers
exports.editOffers = async (req, res) => {
    const name = req.query.name;

    const newServices = req.body.services;
    const newImagePath = req.file.path;

    try{
        const currentOffer = Offers.findOne({ name: name});
        if(!currentOffer){
            return res.status(409).json({msg : 'No Offer found with that name'})
        }

        currentOffer.services = newServices ? newServices : currentOffer.services;
        currentOffer.imagePath = newImagePath ? newImagePath : currentOffer.imagePath;

        const response = await currentOffer.save();
        return res.status(201).json({ msg: 'Offer Saved Successfully', response: response})

    }catch(err){
        console.log(err)
    }

}


//delete offers
exports.deleteOffers = async (req, res) => {
    const name = req.query.name;

    try{
        const currentOffer = await Offers.findOne({ name: name})
        if( !currentOffer){
            return res.status(409).json({ msg: 'No offer found with that Name'})
        }
        const response = await Offers.findByIdAndDelete({ name: name});
        return res.status(200).json({ msg: 'Offer Successfully deleted !!'});


    }catch(err){
        console.log(err);
    }
}

exports.getBookings = async (req, res, next) => {

    try{
        const response = await Booking.find()
        if(!response){
            return res.status(409).json({ msg: 'You have not booked any service yet'})
        }

        return res.status(200).json(response);
    }
    catch(err){
        console.log(err);
    }
}