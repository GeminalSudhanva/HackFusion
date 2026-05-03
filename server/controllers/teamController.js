const prisma = require('../prismaClient');

// Helper string generator for join codes
const generateTeamCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// @desc    Create a new team
// @route   POST /api/team/create
// @access  Private
const createTeam = async (req, res) => {
  try {
    const { teamName } = req.body;
    const userId = req.user.id; // From authMiddleware

    if (!teamName) {
      return res.status(400).json({ message: 'Please provide a teamName' });
    }

    // Check if user already in a team
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.teamId) {
      return res.status(400).json({ message: 'You are already in a team' });
    }

    let teamCode;
    let codeExists = true;
    while (codeExists) {
      teamCode = generateTeamCode();
      const existingTeam = await prisma.team.findUnique({ where: { teamCode } });
      if (!existingTeam) codeExists = false;
    }

    // Transaction to create team and update user leader role
    const newTeam = await prisma.$transaction(async (tx) => {
      const team = await tx.team.create({
        data: {
          teamName,
          teamCode,
          leaderId: userId,
          members: {
            connect: [{ id: userId }],
          },
        },
      });

      await tx.user.update({
        where: { id: userId },
        data: {
          teamId: team.id,
          role: 'leader',
        },
      });

      return team;
    });

    res.status(201).json(newTeam);
  } catch (error) {
    console.error('Create Team Error:', error);
    res.status(500).json({ message: 'Server Error', detail: error.message });
  }
};

// @desc    Join a team via code
// @route   POST /api/team/join
// @access  Private
const joinTeamViaCode = async (req, res) => {
  try {
    const { teamCode } = req.body;
    const userId = req.user.id;

    if (!teamCode) {
      return res.status(400).json({ message: 'Please provide a teamCode' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user.teamId) {
      return res.status(400).json({ message: 'You are already in a team' });
    }

    const team = await prisma.team.findUnique({
      where: { teamCode },
      include: { members: true, joinRequests: true },
    });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (team.members.length >= team.maxSize) {
      return res.status(400).json({ message: 'Team is full' });
    }

    if (team.members.some((m) => m.id === userId)) {
      return res.status(400).json({ message: 'You are already in this team' });
    }

    // Check if they had a pending join request to disconnect it
    const hasPendingJoinRequest = team.joinRequests.some((req) => req.id === userId);

    await prisma.$transaction([
      prisma.team.update({
        where: { id: team.id },
        data: {
          members: { connect: [{ id: userId }] },
          ...(hasPendingJoinRequest && { joinRequests: { disconnect: [{ id: userId }] } }),
        },
      }),
      prisma.user.update({
        where: { id: userId },
        data: {
          teamId: team.id,
          role: 'member',
        },
      }),
    ]);

    const updatedTeam = await prisma.team.findUnique({ where: { id: team.id } });
    res.status(200).json({ message: 'Joined team successfully', team: updatedTeam });
  } catch (error) {
    console.error('Join Team Error:', error);
    res.status(500).json({ message: 'Server Error', detail: error.message });
  }
};

// @desc    Send request to join team
// @route   POST /api/team/request
// @access  Private
const sendJoinRequest = async (req, res) => {
  try {
    const { teamId } = req.body;
    const userId = req.user.id;

    if (!teamId) {
      return res.status(400).json({ message: 'Please provide a teamId' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user.teamId) {
      return res.status(400).json({ message: 'You are already in a team' });
    }

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: { joinRequests: true, members: true },
    });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (team.joinRequests.some((r) => r.id === userId)) {
      return res.status(400).json({ message: 'You have already requested to join this team' });
    }

    if (team.members.length >= team.maxSize) {
      return res.status(400).json({ message: 'Team is full' });
    }

    await prisma.team.update({
      where: { id: teamId },
      data: {
        joinRequests: { connect: [{ id: userId }] },
      },
    });

    res.status(200).json({ message: 'Join request sent' });
  } catch (error) {
    console.error('Join Request Error:', error);
    res.status(500).json({ message: 'Server Error', detail: error.message });
  }
};

// @desc    Leader responds to request
// @route   POST /api/team/respond
// @access  Private
const respondToRequest = async (req, res) => {
  try {
    const { requesterId, accept } = req.body;
    const leaderId = req.user.id;

    if (!requesterId || accept === undefined) {
      return res.status(400).json({ message: 'Please provide requesterId and accept boolean' });
    }

    const team = await prisma.team.findFirst({
      where: { leaderId },
      include: { members: true, joinRequests: true },
    });

    if (!team) {
      return res.status(403).json({ message: 'You are not the leader of any team' });
    }

    if (!team.joinRequests.some((req) => req.id === requesterId)) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (accept) {
      if (team.members.length >= team.maxSize) {
        return res.status(400).json({ message: 'Team is full' });
      }

      const requester = await prisma.user.findUnique({ where: { id: requesterId } });
      
      if (requester && !requester.teamId) {
        await prisma.$transaction([
          prisma.team.update({
            where: { id: team.id },
            data: {
              members: { connect: [{ id: requesterId }] },
              joinRequests: { disconnect: [{ id: requesterId }] },
            },
          }),
          prisma.user.update({
            where: { id: requesterId },
            data: { teamId: team.id, role: 'member' },
          }),
        ]);
      } else {
        // Disconnect anyway if somehow user got into another team in the meantime
        await prisma.team.update({
          where: { id: team.id },
          data: { joinRequests: { disconnect: [{ id: requesterId }] } },
        });
      }
    } else {
      // Rejecting request
      await prisma.team.update({
        where: { id: team.id },
        data: { joinRequests: { disconnect: [{ id: requesterId }] } },
      });
    }

    const updatedTeam = await prisma.team.findUnique({ where: { id: team.id } });
    res.status(200).json({ message: accept ? 'Request accepted' : 'Request rejected', team: updatedTeam });
  } catch (error) {
    console.error('Respond Request Error:', error);
    res.status(500).json({ message: 'Server Error', detail: error.message });
  }
};

// @desc    Get team details
// @route   GET /api/team/my-team
// @access  Private
const getMyTeam = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!user.teamId) {
      return res.status(404).json({ message: 'You are not currently in a team' });
    }

    const includeOptions = {
      members: {
        select: { id: true, name: true, email: true, phone: true, college: true, role: true },
      },
      leader: {
        select: { id: true, name: true, email: true },
      },
    };

    if (user.role === 'leader') {
      includeOptions.joinRequests = {
        select: { id: true, name: true, email: true, phone: true },
      };
    }

    const team = await prisma.team.findUnique({
      where: { id: user.teamId },
      include: includeOptions,
    });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.status(200).json(team);
  } catch (error) {
    console.error('Get Team Error:', error);
    res.status(500).json({ message: 'Server Error', detail: error.message });
  }
};

// @desc    Roll for problem statement
// @route   POST /api/team/roll-dice
// @access  Private (Leader only)
const rollDice = async (req, res) => {
  try {
    const leaderId = req.user.id;

    // 1. Get team and its registration
    const team = await prisma.team.findFirst({
      where: { leaderId },
      include: { registration: true },
    });

    if (!team) {
      return res.status(403).json({ message: 'Only the team leader can roll the dice' });
    }

    if (!team.registration || team.registration.status !== 'registered') {
      return res.status(400).json({ message: 'Your team must be fully registered to roll the dice' });
    }

    if (team.problemStatement !== null) {
      return res.status(400).json({ message: 'You have already rolled the dice' });
    }

    const domain = team.registration.domain;

    // 2. Find available numbers (1-15) for this domain
    // A number is available if it has been assigned < 4 times in the SAME domain
    const assignedTeams = await prisma.team.findMany({
      where: {
        registration: { domain: domain },
        problemStatement: { not: null },
      },
      select: { problemStatement: true },
    });

    const frequencyMap = {};
    assignedTeams.forEach((t) => {
      frequencyMap[t.problemStatement] = (frequencyMap[t.problemStatement] || 0) + 1;
    });

    const availableNumbers = [];
    for (let i = 1; i <= 15; i++) {
      if ((frequencyMap[i] || 0) < 4) {
        availableNumbers.push(i);
      }
    }

    if (availableNumbers.length === 0) {
      return res.status(400).json({ message: 'No problem statements available for this domain' });
    }

    // 3. Pick random available number
    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    const chosenNumber = availableNumbers[randomIndex];

    await prisma.team.update({
      where: { id: team.id },
      data: { problemStatement: chosenNumber },
    });

    res.status(200).json({ 
      message: 'Problem statement assigned', 
      problemStatement: chosenNumber,
      domain: domain 
    });
  } catch (error) {
    console.error('Roll Dice Error:', error);
    res.status(500).json({ message: 'Server Error', detail: error.message });
  }
};

module.exports = {
  createTeam,
  joinTeamViaCode,
  sendJoinRequest,
  respondToRequest,
  getMyTeam,
  rollDice,
};
