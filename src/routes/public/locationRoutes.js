import express from 'express';
import LocationController from '#controllers/public/locationController.js';

const router = express.Router();

router.get('/states', LocationController.getStates);
router.get('/cities', LocationController.getCities);

export default router;
