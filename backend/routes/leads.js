const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Lead = require('../models/Lead');

const router = express.Router();

// Helper function to build filter query
const buildFilterQuery = (filters) => {
  let query = {};

  if (!filters) return query;

  Object.keys(filters).forEach(key => {
    if (filters[key] !== undefined && filters[key] !== '') {
      switch (key) {
        case 'email':
        case 'company':
        case 'city':
          if (filters[key + '_operator'] === 'contains') {
            query[key] = { $regex: filters[key], $options: 'i' };
          } else {
            query[key] = filters[key];
          }
          break;
        
        case 'status':
        case 'source':
          if (filters[key + '_operator'] === 'in' && Array.isArray(filters[key])) {
            query[key] = { $in: filters[key] };
          } else {
            query[key] = filters[key];
          }
          break;
        
        case 'score':
        case 'lead_value':
          if (filters[key + '_operator'] === 'gt') {
            query[key] = { $gt: parseFloat(filters[key]) };
          } else if (filters[key + '_operator'] === 'lt') {
            query[key] = { $lt: parseFloat(filters[key]) };
          } else if (filters[key + '_operator'] === 'between' && Array.isArray(filters[key])) {
            query[key] = { $gte: parseFloat(filters[key][0]), $lte: parseFloat(filters[key][1]) };
          } else {
            query[key] = parseFloat(filters[key]);
          }
          break;
        
        case 'created_at':
        case 'last_activity_at':
          if (filters[key + '_operator'] === 'on') {
            const date = new Date(filters[key]);
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);
            query[key] = { $gte: date, $lt: nextDay };
          } else if (filters[key + '_operator'] === 'before') {
            query[key] = { $lt: new Date(filters[key]) };
          } else if (filters[key + '_operator'] === 'after') {
            query[key] = { $gt: new Date(filters[key]) };
          } else if (filters[key + '_operator'] === 'between' && Array.isArray(filters[key])) {
            query[key] = { $gte: new Date(filters[key][0]), $lte: new Date(filters[key][1]) };
          }
          break;
        
        case 'is_qualified':
          query[key] = filters[key] === 'true';
          break;
        
        default:
          if (filters[key]) {
            query[key] = filters[key];
          }
      }
    }
  });

  return query;
};

// Create lead
router.post('/', [
  body('first_name').trim().notEmpty(),
  body('last_name').trim().notEmpty(),
  body('email').isEmail().normalizeEmail(),
  body('phone').optional().trim(),
  body('company').optional().trim(),
  body('city').optional().trim(),
  body('state').optional().trim(),
  body('source').optional().isIn(['website', 'facebook_ads', 'google_ads', 'referral', 'events', 'other']),
  body('status').optional().isIn(['new', 'contacted', 'qualified', 'lost', 'won']),
  body('score').optional().isInt({ min: 0, max: 100 }),
  body('lead_value').optional().isFloat({ min: 0 }),
  body('is_qualified').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const leadData = { ...req.body, user: req.user._id };
    const lead = new Lead(leadData);
    await lead.save();

    res.status(201).json({
      message: 'Lead created successfully',
      lead
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    console.error('Create lead error:', error);
    res.status(500).json({ error: 'Failed to create lead' });
  }
});

// Get leads with pagination and filters
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter query
    const filterQuery = buildFilterQuery(req.query);

    // Get total count
    const total = await Lead.countDocuments(filterQuery);
    const totalPages = Math.ceil(total / limit);

    // Get leads
    const leads = await Lead.find(filterQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      data: leads,
      page,
      limit,
      total,
      totalPages
    });
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

// Get single lead
router.get('/:id', async (req, res) => {
  try {
    const lead = await Lead.findOne({ _id: req.params.id });
    
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    res.status(200).json({ lead });
  } catch (error) {
    console.error('Get lead error:', error);
    res.status(500).json({ error: 'Failed to fetch lead' });
  }
});

// Update lead
router.put('/:id', [
  body('first_name').optional().trim().notEmpty(),
  body('last_name').optional().trim().notEmpty(),
  body('email').optional().isEmail().normalizeEmail(),
  body('phone').optional().trim(),
  body('company').optional().trim(),
  body('city').optional().trim(),
  body('state').optional().trim(),
  body('source').optional().isIn(['website', 'facebook_ads', 'google_ads', 'referral', 'events', 'other']),
  body('status').optional().isIn(['new', 'contacted', 'qualified', 'lost', 'won']),
  body('score').optional().isInt({ min: 0, max: 100 }),
  body('lead_value').optional().isFloat({ min: 0 }),
  body('is_qualified').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    res.status(200).json({
      message: 'Lead updated successfully',
      lead
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    console.error('Update lead error:', error);
    res.status(500).json({ error: 'Failed to update lead' });
  }
});

// Delete lead
router.delete('/:id', async (req, res) => {
  try {
    const lead = await Lead.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    res.status(200).json({
      message: 'Lead deleted successfully',
      lead
    });
  } catch (error) {
    console.error('Delete lead error:', error);
    res.status(500).json({ error: 'Failed to delete lead' });
  }
});

module.exports = router;
