import express from 'express';
import {  getColleges, getCollegesWithEmployees, getEmployeesByCollege} from '../controller/college';

const router = express.Router();


// GET - get all colleges
router.post('/', getColleges);
router.get(
  "/with-employees",
  getCollegesWithEmployees
);
router.get("/employees", getEmployeesByCollege);


export default router;