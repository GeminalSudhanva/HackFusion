const prisma = require('../prismaClient');

// @desc    Get all teams and their registrations
// @route   GET /api/admin/teams
// @access  Private/Admin
const getAllTeamsWithRegistrations = async (req, res) => {
  try {
    const teams = await prisma.team.findMany({
      include: {
        leader: {
          select: { name: true, email: true, phone: true }
        },
        members: {
          select: { name: true, email: true, role: true }
        },
        registration: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json(teams);
  } catch (error) {
    console.error('Admin Fetch Teams Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getAllTeamsWithRegistrations
};
