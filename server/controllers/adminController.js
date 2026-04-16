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
          select: { id: true, name: true, email: true, role: true, mealsTaken: true, kitReceived: true }
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
// @route   POST /api/admin/scan-food/:userId
// @access  Private/Admin
const scanFoodUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { mealType } = req.body;

    if (!mealType) {
      return res.status(400).json({ message: 'Meal type is required' });
    }

    const userToScan = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        team: { include: { registration: true } }
      }
    });

    if (!userToScan) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!userToScan.teamId || !userToScan.team?.registration) {
      return res.status(400).json({ message: 'User team is not officially registered' });
    }

    if (userToScan.mealsTaken.includes(mealType)) {
      return res.status(400).json({ 
        message: `${mealType} has already been consumed by this participant`,
        teamName: userToScan.name,
        mealsTaken: userToScan.mealsTaken 
      });
    }

    if (userToScan.mealsTaken.length >= 3) {
      return res.status(400).json({ 
        message: 'Maximum meal limit (3/3) reached for this user',
        teamName: userToScan.name,
        mealsTaken: userToScan.mealsTaken 
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { 
        mealsTaken: {
          push: mealType
        }
      },
    });

    res.status(200).json({ 
      message: `${mealType} logged successfully (${updatedUser.mealsTaken.length}/3)`,
      teamName: updatedUser.name,
      totalScans: updatedUser.mealsTaken.length,
      mealsTaken: updatedUser.mealsTaken
    });
  } catch (error) {
    console.error('Scan Food Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
// @desc    Verify team payment
// @route   PUT /api/admin/verify-payment/:registrationId
// @access  Private/Admin
const verifyPayment = async (req, res) => {
  try {
    const { registrationId } = req.params;

    const registration = await prisma.registration.findUnique({
      where: { id: registrationId }
    });

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    const updatedRegistration = await prisma.registration.update({
      where: { id: registrationId },
      data: { paymentStatus: 'verified' }
    });

    res.status(200).json({ message: 'Payment verified successfully', updatedRegistration });
  } catch (error) {
    console.error('Verify Payment Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Toggle kit received for a user
// @route   PATCH /api/admin/kit/:userId
// @access  Private/Admin
const toggleKitReceived = async (req, res) => {
  try {
    const { userId } = req.params;

    const userToUpdate = await prisma.user.findUnique({ where: { id: userId } });

    if (!userToUpdate) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { kitReceived: !userToUpdate.kitReceived },
    });

    res.status(200).json({
      message: `Kit marked as ${updated.kitReceived ? 'received' : 'not received'} for ${updated.name}`,
      kitReceived: updated.kitReceived,
    });
  } catch (error) {
    console.error('Toggle Kit Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get individual user scan details
// @route   GET /api/admin/user-scan/:userId
// @access  Private/Admin
const getUserScanDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const userToScan = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, mealsTaken: true, kitReceived: true }
    });

    if (!userToScan) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(userToScan);
  } catch (error) {
    console.error('Fetch User Scan Details Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get team scan details
// @route   GET /api/admin/team-scan/:teamId
// @access  Private/Admin
const getTeamScanDetails = async (req, res) => {
  try {
    const { teamId } = req.params;

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        leader: {
          select: { id: true, name: true, email: true }
        },
        members: {
          select: { id: true, name: true, email: true, role: true, kitReceived: true, mealsTaken: true }
        },
        registration: true
      }
    });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.status(200).json(team);
  } catch (error) {
    console.error('Fetch Team Scan Details Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getAllTeamsWithRegistrations,
  scanFoodUser,
  verifyPayment,
  toggleKitReceived,
  getTeamScanDetails,
  getUserScanDetails,
};
