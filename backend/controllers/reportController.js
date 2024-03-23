const Report = require('../model/reportModel');
const House = require('../model/houseModel');
const User = require('../model/userModel');

exports.submitReport = async (req, res) => {
  try {
    const { houseId, type, content } = req.body;
    const report = new Report({
      submittedBy: req.user._id,
      house: houseId,
      type,
      content
    });
    await report.save();
    res.status(201).json({ message: 'Report submitted successfully', report });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting report', error: error.message });
  }
};

exports.getReportsForLandlordOrBroker = async (req, res) => {
  try {
    const landlordOrBrokerId = req.user._id;
    const reports = await Report.find({ 'house.landlord': landlordOrBrokerId }).populate('house submittedBy');
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reports', error: error.message });
  }
};

exports.updateReportStatus = async (req, res) => {
  try {
    const { reportId, status } = req.body;
    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    report.status = status;
    await report.save();
    res.status(200).json({ message: 'Report status updated successfully', report });
  } catch (error) {
    res.status(500).json({ message: 'Error updating report status', error: error.message });
  }
};