const express = require('express');
const router = express.Router();
const ComponentController = require('../controllers/componentController');

router.get('/all', ComponentController.component_list);

router.post('/create', ComponentController.component_create);

router.post('/update/:id', ComponentController.component_update);

router.post('/delete/:id', ComponentController.component_delete);

router.get('/:id', ComponentController.component_detail);

module.exports = router;
