const prisma = require('../prismaClient');

// @desc    Register your team under a domain
// @route   POST /api/registration/register
// @access  Private
const registerTeam = async (req, res) => {
  try {
    const { domain, utrNumber } = req.body;
    const userId = req.user.id; // Pulled from JWT Context

    if (!domain) {
      return res.status(400).json({ message: 'Please provide a domain' });
    }

    if (!utrNumber) {
      return res.status(400).json({ message: 'Please provide the UTR number for your payment' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user.teamId) {
      return res.status(400).json({ message: 'You must be in a team to register' });
    }

    const team = await prisma.team.findUnique({ where: { id: user.teamId } });
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Role-base protection: Registration lock-in only accessible by the squad leader
    if (team.leaderId !== userId) {
      return res.status(403).json({ message: 'Only the team leader can officially register the team' });
    }

    const existingRegistration = await prisma.registration.findUnique({ where: { teamId: team.id } });
    if (existingRegistration) {
      return res.status(400).json({ message: 'Your team is already registered for ' + existingRegistration.domain });
    }

    const registration = await prisma.registration.create({
      data: {
        teamId: team.id,
        domain,
        utrNumber,
        amount: 700,
        paymentStatus: 'pending',
      },
    });

    res.status(201).json({
      message: `Team successfully registered for ${domain}!`,
      registration,
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'Duplicate registration detected' });
    }
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get populated team registration
// @route   GET /api/registration/my-registration
// @access  Private
const getMyRegistration = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    if (!user.teamId) {
      return res.status(404).json({ message: 'You are not in a team' });
    }

    const registration = await prisma.registration.findUnique({
      where: { teamId: user.teamId },
      include: {
        team: {
          select: {
            teamName: true,
            teamCode: true,
            leaderId: true,
            maxSize: true,
            members: {
              select: { name: true, email: true, role: true, phone: true },
            },
          },
        },
      },
    });

    if (!registration) {
      return res.status(404).json({ message: 'Your team has not registered for an official domain yet' });
    }

    res.status(200).json(registration);
  } catch (error) {
    console.error('Fetch Registration Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  registerTeam,
  getMyRegistration,
};
