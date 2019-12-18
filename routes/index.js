const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth');
const userActionController = require('../controllers/userActions');
const adminController = require('../controllers/admin');

//middlewares
const auth = require('../middlewares/is-Auth');


//admin routes
router.post('/admin/signup', adminController.postAdminSignUp);
router.post('/admin/login', adminController.postAdminLogin);
router.get('/admin/services',  adminController.getServices);
router.post('/admin/services', auth.adminAuth, adminController.postServices);
router.put('/admin/services', auth.adminAuth, adminController.editServices);
router.delete('/admin/services', auth.adminAuth, adminController.deleteServices);
router.get('/admin/offers', auth.adminAuth, adminController.getOffers);
router.post('/admin/offers', auth.adminAuth, adminController.postOffers);
router.put('/admin/offers', auth.adminAuth, adminController.editOffers);
router.delete('/admin/offers', auth.adminAuth, adminController.deleteOffers);
router.get('/admin/bookings', auth.adminAuth,adminController.getBookings);


//auth routes
router.post('/:id/signup', authController.postSignUp );
router.post('/login', authController.postLogin );
router.post('/registermobile', authController.postMobileRegister );
router.post('/:id/verifyotp', authController.postOTPVerify );

router.post('/feedback', userActionController.postFeedback );
router.post('/complaints', userActionController.postComplaints );
router.post('/join', userActionController.postJoinUs );

router.get('/services', userActionController.getServices);
router.get('/booking',  userActionController.getBookings );
router.post('/booking',  userActionController.postBooking);
router.put('/booking',  userActionController.editBooking);
router.delete('/booking',  userActionController.deleteBooking);
router.get('/offers', userActionController.getOffers);
router.get('/category', userActionController.getCategory);

router.post('/payment', userActionController.payment);
router.post('/save-type', userActionController.saveType);
router.get('/get-type', userActionController.getType);

module.exports = router;