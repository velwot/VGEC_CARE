import { Router } from 'express';
import { run, get, all } from './db.ts';

export const apiRouter = Router();

// Helper to format issue row
function formatIssueRow(row: any, comments: any[] = [], isSupported = false) {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    subcategory: row.subcategory,
    status: row.status,
    priority: row.priority,
    block: row.block,
    room: row.room,
    description: row.description,
    image: row.image,
    imageCaption: row.imageCaption,
    reportedBy: {
      name: row.reportedByName,
      role: row.reportedByRole,
      enrollment: row.reportedByEnrollment,
      avatar: row.reportedByAvatar,
    },
    reportedAt: row.reportedAt,
    relativeTime: row.relativeTime,
    supportCount: row.supportCount,
    isSupportedByCurrentUser: isSupported,
    commentCount: row.commentCount,
    techAssigned: row.techAssigned,
    workOrderNumber: row.workOrderNumber,
    auditNote: row.auditNote,
    slaTargetHours: row.slaTargetHours,
    slaElapsedHours: row.slaElapsedHours,
    equipment: row.equipment,
    departmentScope: row.departmentScope,
    officialUpdate: row.officialUpdateJson ? JSON.parse(row.officialUpdateJson) : undefined,
    resolutionTrail: row.resolutionTrailJson ? JSON.parse(row.resolutionTrailJson) : [],
    custodians: row.custodiansJson ? JSON.parse(row.custodiansJson) : undefined,
    comments: comments,
  };
}

// 1. GET /api/issues
apiRouter.get('/issues', async (req, res) => {
  try {
    const { search, category, status, sort } = req.query;

    let query = 'SELECT * FROM issues WHERE 1=1';
    const params: any[] = [];

    if (category && category !== 'All') {
      query += ' AND (category LIKE ? OR subcategory LIKE ?)';
      params.push(`%${category}%`, `%${category}%`);
    }

    if (status && status !== 'All Statuses') {
      query += ' AND status = ?';
      params.push(status);
    }

    if (search && typeof search === 'string' && search.trim()) {
      query += ' AND (title LIKE ? OR id LIKE ? OR block LIKE ? OR room LIKE ? OR description LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term, term, term);
    }

    if (sort === 'most-supported') {
      query += ' ORDER BY supportCount DESC';
    } else if (sort === 'newest') {
      query += ' ORDER BY createdAt DESC, id DESC';
    } else {
      query += ' ORDER BY supportCount DESC';
    }

    const issueRows = await all(query, params);
    const userUpvotes = await all<{ issueId: string }>(
      'SELECT issueId FROM user_upvotes WHERE userId = ?',
      ['user-narayan']
    );
    const supportedSet = new Set(userUpvotes.map((u) => u.issueId));

    // Fetch all comments in a single batch
    const allComments = await all('SELECT * FROM comments ORDER BY createdAt DESC');
    const commentsByIssueId = new Map<string, any[]>();
    for (const c of allComments) {
      if (!commentsByIssueId.has(c.issueId)) {
        commentsByIssueId.set(c.issueId, []);
      }
      commentsByIssueId.get(c.issueId)!.push({
        id: c.id,
        authorName: c.authorName,
        authorRole: c.authorRole,
        authorAvatar: c.authorAvatar,
        timeAgo: c.timeAgo,
        content: c.content,
      });
    }

    const formatted = issueRows.map((row) =>
      formatIssueRow(
        row,
        commentsByIssueId.get(row.id) || [],
        supportedSet.has(row.id)
      )
    );

    res.json(formatted);
  } catch (err: any) {
    console.error('Error fetching issues:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// 2. GET /api/issues/:id
apiRouter.get('/issues/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const issueRow = await get('SELECT * FROM issues WHERE id = ?', [id]);
    if (!issueRow) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    const userUpvote = await get(
      'SELECT 1 FROM user_upvotes WHERE userId = ? AND issueId = ?',
      ['user-narayan', id]
    );

    const comments = await all(
      'SELECT * FROM comments WHERE issueId = ? ORDER BY createdAt DESC',
      [id]
    );

    res.json(formatIssueRow(issueRow, comments, Boolean(userUpvote)));
  } catch (err: any) {
    console.error('Error fetching issue detail:', err);
    res.status(500).json({ error: err.message });
  }
});

// 3. POST /api/issues
apiRouter.post('/issues', async (req, res) => {
  try {
    const {
      title,
      category,
      subcategory,
      priority,
      block,
      room,
      description,
      image,
      imageCaption,
    } = req.body;

    if (!title || !category || !block || !room || !description) {
      return res.status(400).json({ error: 'Missing required issue fields' });
    }

    const cleanBlock = block.replace(/\s+/g, '').substring(0, 3).toUpperCase() || 'GEN';
    const id = `VGEC-${cleanBlock}-${Math.floor(100 + Math.random() * 900)}`;

    const user = await get('SELECT * FROM user_profile WHERE id = ?', ['user-narayan']);
    const reporterName = user?.name || 'Narayan Patel';
    const reporterRole = `${user?.semester || 'Sem 6'} ${user?.department || 'CE'}`;
    const reporterEnrollment = user?.enrollment || '210170116012';
    const reporterAvatar = user?.avatar || '';

    const initialTrail = [
      {
        stepNumber: 1,
        title: 'Issue Raised',
        timestamp: 'Just now',
        desc: `Submitted with diagnostic photo evidence by ${reporterName}.`,
        status: 'completed',
      },
      {
        stepNumber: 2,
        title: 'Community Consensus',
        timestamp: 'In Progress',
        desc: 'Awaiting peer upvotes to determine urgency tier.',
        status: 'active',
      },
      {
        stepNumber: 3,
        title: 'Faculty / Caretaker Inspection',
        desc: 'Site verification by department supervisor.',
        status: 'pending',
      },
      {
        stepNumber: 4,
        title: 'Work Order Dispatch',
        desc: 'Maintenance crew assignment.',
        status: 'pending',
      },
      {
        stepNumber: 5,
        title: 'Resolved & Signed Off',
        desc: 'Inspection sign-off and student audit confirmation.',
        status: 'pending',
      },
    ];

    await run(
      `INSERT INTO issues (
        id, title, category, subcategory, status, priority, block, room,
        description, image, imageCaption, reportedByName, reportedByRole,
        reportedByEnrollment, reportedByAvatar, reportedAt, relativeTime,
        supportCount, commentCount, techAssigned, slaTargetHours, slaElapsedHours,
        departmentScope, resolutionTrailJson
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        title,
        category,
        subcategory || 'General Campus Maintenance',
        'Under Review',
        priority || 'Medium-High',
        block,
        room,
        description,
        image || '/images/classroom_projector_1790359863098.jpg',
        imageCaption || `Photo evidence submitted by ${reporterName} for ${title}`,
        reporterName,
        reporterRole,
        reporterEnrollment,
        reporterAvatar,
        'Just now',
        'Just now',
        1,
        0,
        'Under Initial Review',
        24,
        0,
        `${category} Cell`,
        JSON.stringify(initialTrail),
      ]
    );

    // Initial author upvote
    await run(
      'INSERT OR IGNORE INTO user_upvotes (userId, issueId) VALUES (?, ?)',
      ['user-narayan', id]
    );

    // Award user +25 XP
    await run(
      `UPDATE user_profile
       SET currentXp = currentXp + 25,
           issuesReportedCount = issuesReportedCount + 1
       WHERE id = ?`,
      ['user-narayan']
    );

    const createdRow = await get('SELECT * FROM issues WHERE id = ?', [id]);
    res.status(201).json(formatIssueRow(createdRow, [], true));
  } catch (err: any) {
    console.error('Error creating issue:', err);
    res.status(500).json({ error: err.message });
  }
});

// 4. POST /api/issues/:id/upvote
apiRouter.post('/issues/:id/upvote', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = 'user-narayan';

    const existing = await get(
      'SELECT 1 FROM user_upvotes WHERE userId = ? AND issueId = ?',
      [userId, id]
    );

    let isSupported = false;
    if (existing) {
      // Remove upvote
      await run('DELETE FROM user_upvotes WHERE userId = ? AND issueId = ?', [userId, id]);
      await run('UPDATE issues SET supportCount = MAX(0, supportCount - 1) WHERE id = ?', [id]);
      isSupported = false;
    } else {
      // Add upvote
      await run('INSERT INTO user_upvotes (userId, issueId) VALUES (?, ?)', [userId, id]);
      await run('UPDATE issues SET supportCount = supportCount + 1 WHERE id = ?', [id]);
      await run('UPDATE user_profile SET upvotesCastCount = upvotesCastCount + 1 WHERE id = ?', [
        userId,
      ]);
      isSupported = true;
    }

    const updatedIssue = await get('SELECT supportCount FROM issues WHERE id = ?', [id]);
    res.json({
      issueId: id,
      isSupported,
      supportCount: updatedIssue?.supportCount || 0,
    });
  } catch (err: any) {
    console.error('Error toggling upvote:', err);
    res.status(500).json({ error: err.message });
  }
});

// 5. POST /api/issues/:id/comments
apiRouter.post('/issues/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Comment content cannot be empty' });
    }

    const user = await get('SELECT * FROM user_profile WHERE id = ?', ['user-narayan']);
    const commentId = `c-${Date.now()}`;
    const authorName = user?.name || 'Narayan Patel';
    const authorRole = `${user?.department || 'CE'} • ${user?.semester || 'Sem 6'}`;
    const authorAvatar = user?.avatar || '';

    await run(
      `INSERT INTO comments (id, issueId, authorName, authorRole, authorAvatar, timeAgo, content)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [commentId, id, authorName, authorRole, authorAvatar, 'Just now', content.trim()]
    );

    await run('UPDATE issues SET commentCount = commentCount + 1 WHERE id = ?', [id]);

    const createdComment = await get('SELECT * FROM comments WHERE id = ?', [commentId]);
    res.status(201).json(createdComment);
  } catch (err: any) {
    console.error('Error adding comment:', err);
    res.status(500).json({ error: err.message });
  }
});

// 6. PATCH /api/issues/:id/status (Admin status progression)
apiRouter.patch('/issues/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, techAssigned } = req.body;

    const issue = await get('SELECT * FROM issues WHERE id = ?', [id]);
    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    let trail = issue.resolutionTrailJson ? JSON.parse(issue.resolutionTrailJson) : [];
    if (status === 'Resolved') {
      trail = trail.map((s: any) => ({ ...s, status: 'completed' }));
    } else if (status === 'In Progress') {
      trail = trail.map((s: any, idx: number) => {
        if (idx <= 3) return { ...s, status: 'completed' };
        if (idx === 4) return { ...s, status: 'active' };
        return s;
      });
    }

    await run(
      `UPDATE issues
       SET status = ?,
           techAssigned = COALESCE(?, techAssigned),
           resolutionTrailJson = ?
       WHERE id = ?`,
      [status, techAssigned || null, JSON.stringify(trail), id]
    );

    const updated = await get('SELECT * FROM issues WHERE id = ?', [id]);
    const comments = await all('SELECT * FROM comments WHERE issueId = ?', [id]);
    res.json(formatIssueRow(updated, comments, false));
  } catch (err: any) {
    console.error('Error updating status:', err);
    res.status(500).json({ error: err.message });
  }
});

// 7. GET /api/user
apiRouter.get('/user', async (req, res) => {
  try {
    const user = await get('SELECT * FROM user_profile WHERE id = ?', ['user-narayan']);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err: any) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ error: err.message });
  }
});

// 8. GET /api/stats
apiRouter.get('/stats', async (req, res) => {
  try {
    const totalRaised = await get<{ count: number }>('SELECT count(*) as count FROM issues');
    const totalResolved = await get<{ count: number }>(
      "SELECT count(*) as count FROM issues WHERE status = 'Resolved'"
    );
    const activeQueue = await get<{ count: number }>(
      "SELECT count(*) as count FROM issues WHERE status != 'Resolved'"
    );
    const votesSum = await get<{ total: number }>('SELECT sum(supportCount) as total FROM issues');

    res.json({
      issuesRaised: 120 + (totalRaised?.count || 7),
      resolvedCount: 55 + (totalResolved?.count || 6),
      votesCast: 2800 + (votesSum?.total || 46),
      activeInQueue: activeQueue?.count || 24,
      resolvedRatePercent: 48,
    });
  } catch (err: any) {
    console.error('Error calculating stats:', err);
    res.status(500).json({ error: err.message });
  }
});

// 9. GET /api/lost-and-found
apiRouter.get('/lost-and-found', async (req, res) => {
  try {
    const items = await all('SELECT * FROM lost_items ORDER BY createdAt DESC');
    res.json(items);
  } catch (err: any) {
    console.error('Error fetching lost items:', err);
    res.status(500).json({ error: err.message });
  }
});

// 10. POST /api/lost-and-found/:id/claim
apiRouter.post('/lost-and-found/:id/claim', async (req, res) => {
  try {
    const { id } = req.params;
    await run("UPDATE lost_items SET status = 'Claimed' WHERE id = ?", [id]);
    const updated = await get('SELECT * FROM lost_items WHERE id = ?', [id]);
    res.json(updated);
  } catch (err: any) {
    console.error('Error claiming lost item:', err);
    res.status(500).json({ error: err.message });
  }
});
