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

// @desc    Scan food QR code
// @route   POST /api/admin/scan-food/:teamId
// @access  Private/Admin
const scanFoodTeam = async (req, res) => {
  try {
    const { teamId } = req.params;

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: { registration: true },
    });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (team.foodScans >= 4) {
      return res.status(400).json({ 
        message: 'Maximum meal limit (4/4) reached for this team',
        teamName: team.teamName,
        currentScans: team.foodScans 
      });
    }

    const updatedTeam = await prisma.team.update({
      where: { id: teamId },
      data: { foodScans: { increment: 1 } },
    });

    res.status(200).json({ 
      message: `Food scan successful (${updatedTeam.foodScans}/4)`,
      teamName: updatedTeam.teamName,
      totalScans: updatedTeam.foodScans 
    });
  } catch (error) {
    console.error('Scan Food Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getAllTeamsWithRegistrations,
  scanFoodTeam,
};
