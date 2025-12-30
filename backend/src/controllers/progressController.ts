import { Request, Response } from "express";
import { pool } from "../lib/db";

/**
 * Mark a subtopic as complete
 */
export const completeSubtopic = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { lessonSlug, subtopicTitle } = req.body;

    if (!lessonSlug || !subtopicTitle) {
      return res.status(400).json({
        message: "lessonSlug and subtopicTitle are required",
      });
    }

    const userId = req.user.id;

    // Insert or update lesson progress
    await pool.query(
      `
      INSERT INTO lesson_progress (user_id, lesson_slug, subtopic_title)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, lesson_slug, subtopic_title) DO NOTHING
      `,
      [userId, lessonSlug, subtopicTitle]
    );

    // Update user stats (XP, streak, etc.)
    await updateUserStats(userId, "lesson_completed");

    return res.json({
      message: "Subtopic marked as complete",
      success: true,
    });
  } catch (err) {
    console.error("Complete subtopic error:", err);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

/**
 * Get lesson progress for a user
 */
export const getLessonProgress = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;

    // Get all completed subtopics
    const result = await pool.query(
      `
      SELECT lesson_slug, subtopic_title, completed_at
      FROM lesson_progress
      WHERE user_id = $1
      ORDER BY completed_at DESC
      `,
      [userId]
    );

    return res.json({
      progress: result.rows,
    });
  } catch (err) {
    console.error("Get lesson progress error:", err);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

/**
 * Record a quiz attempt
 */
export const recordQuizAttempt = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { quizSubject, score, totalQuestions, correctAnswers } = req.body;

    if (
      quizSubject === undefined ||
      score === undefined ||
      totalQuestions === undefined ||
      correctAnswers === undefined
    ) {
      return res.status(400).json({
        message: "quizSubject, score, totalQuestions, and correctAnswers are required",
      });
    }

    const userId = req.user.id;

    // Insert quiz attempt
    await pool.query(
      `
      INSERT INTO quiz_attempts (user_id, quiz_subject, score, total_questions, correct_answers)
      VALUES ($1, $2, $3, $4, $5)
      `,
      [userId, quizSubject, score, totalQuestions, correctAnswers]
    );

    // Update user stats
    await updateUserStats(userId, "quiz_completed", score);

    return res.json({
      message: "Quiz attempt recorded",
      success: true,
    });
  } catch (err) {
    console.error("Record quiz attempt error:", err);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

/**
 * Get user statistics
 */
export const getUserStats = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;

    // Helper function to retry queries on timeout or connection errors
    const queryWithRetry = async (queryText: string, params: any[], retries = 2): Promise<any> => {
      for (let i = 0; i <= retries; i++) {
        try {
          const result = await pool.query(queryText, params);
          return result;
        } catch (err: any) {
          const isRetryableError = 
            err.code === "ETIMEDOUT" || 
            err.code === "ECONNRESET" ||
            err.code === "ECONNREFUSED" ||
            err.message?.includes("Connection terminated") ||
            err.message?.includes("connection timeout");
          
          if (isRetryableError && i < retries) {
            console.log(`Database connection error, retrying... (${i + 1}/${retries}):`, err.message);
            await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
            continue;
          }
          throw err;
        }
      }
      throw new Error("Query failed after retries");
    };

    // Get user stats
    const statsResult = await queryWithRetry(
      `
      SELECT streak, last_activity_date, total_xp, level, topics_completed, quizzes_taken
      FROM user_stats
      WHERE user_id = $1
      `,
      [userId]
    ) as { rows: any[] };

    // Get recent quiz attempts
    const quizResult = await queryWithRetry(
      `
      SELECT quiz_subject, score, taken_at
      FROM quiz_attempts
      WHERE user_id = $1
      ORDER BY taken_at DESC
      LIMIT 10
      `,
      [userId]
    ) as { rows: any[] };

    // Get lesson progress distribution
    const lessonProgressResult = await queryWithRetry(
      `
      SELECT lesson_slug, COUNT(*)::integer as completed_subtopics
      FROM lesson_progress
      WHERE user_id = $1
      GROUP BY lesson_slug
      `,
      [userId]
    ) as { rows: any[] };

    const stats = statsResult.rows[0] || {
      streak: 0,
      last_activity_date: null,
      total_xp: 0,
      level: 1,
      topics_completed: 0,
      quizzes_taken: 0,
    };

    // Ensure numeric types
    const response = {
      stats: {
        ...stats,
        streak: Number(stats.streak) || 0,
        total_xp: Number(stats.total_xp) || 0,
        level: Number(stats.level) || 1,
        topics_completed: Number(stats.topics_completed) || 0,
        quizzes_taken: Number(stats.quizzes_taken) || 0,
        recentQuizzes: quizResult.rows.map((q: any) => ({
          quiz_subject: q.quiz_subject,
          score: Number(q.score) || 0,
          taken_at: q.taken_at,
        })),
        lessonProgress: lessonProgressResult.rows.map((lp: any) => ({
          lesson_slug: lp.lesson_slug,
          completed_subtopics: Number(lp.completed_subtopics) || 0,
        })),
      },
    };

    return res.json(response);
  } catch (err: any) {
    console.error("Get user stats error:", err);
    
    // Handle specific database errors
    if (err.code === "ETIMEDOUT" || err.message?.includes("connection timeout")) {
      return res.status(503).json({
        message: "Database connection timeout. Please try again.",
      });
    }
    
    if (err.code === "ECONNREFUSED" || err.code === "ECONNRESET") {
      return res.status(503).json({
        message: "Database connection error. Please try again.",
      });
    }
    
    if (err.message?.includes("Connection terminated")) {
      return res.status(503).json({
        message: "Database connection was terminated. Please try again.",
      });
    }
    
    return res.status(500).json({
      message: "Server error",
    });
  }
};

/**
 * Helper function to update user stats
 */
async function updateUserStats(
  userId: string, // UUID
  activityType: "lesson_completed" | "quiz_completed",
  quizScore?: number
) {
  const today = new Date().toISOString().split("T")[0];

  // Get current stats
  const statsResult = await pool.query(
    `
    SELECT streak, last_activity_date, total_xp, level, topics_completed, quizzes_taken
    FROM user_stats
    WHERE user_id = $1
    `,
    [userId]
  );

  let stats = statsResult.rows[0];

  if (!stats) {
    // Initialize stats if they don't exist
    await pool.query(
      `
      INSERT INTO user_stats (user_id, streak, last_activity_date, total_xp, level, topics_completed, quizzes_taken)
      VALUES ($1, 0, NULL, 0, 1, 0, 0)
      `,
      [userId]
    );
    stats = {
      streak: 0,
      last_activity_date: null,
      total_xp: 0,
      level: 1,
      topics_completed: 0,
      quizzes_taken: 0,
    };
  }

  // Calculate streak
  let newStreak = stats.streak;
  const lastActivity = stats.last_activity_date
    ? new Date(stats.last_activity_date)
    : null;
  const todayDate = new Date(today);

  if (!lastActivity) {
    // First activity
    newStreak = 1;
  } else {
    const daysDiff = Math.floor(
      (todayDate.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff === 0) {
      // Same day, keep streak
      newStreak = stats.streak;
    } else if (daysDiff === 1) {
      // Consecutive day, increment streak
      newStreak = stats.streak + 1;
    } else {
      // Streak broken, reset to 1
      newStreak = 1;
    }
  }

  // Calculate XP
  let xpGained = 0;
  if (activityType === "lesson_completed") {
    xpGained = 50; // 50 XP per subtopic completed
  } else if (activityType === "quiz_completed" && quizScore !== undefined) {
    // XP based on quiz score: 10 XP base + (score/10) bonus
    xpGained = 10 + Math.floor(quizScore / 10);
  }

  const newTotalXp = stats.total_xp + xpGained;
  const newLevel = Math.floor(newTotalXp / 200) + 1; // Level up every 200 XP

  // Update stats
  await pool.query(
    `
    UPDATE user_stats
    SET 
      streak = $1,
      last_activity_date = $2,
      total_xp = $3,
      level = $4,
      topics_completed = CASE WHEN $5 = 'lesson_completed' THEN topics_completed + 1 ELSE topics_completed END,
      quizzes_taken = CASE WHEN $5 = 'quiz_completed' THEN quizzes_taken + 1 ELSE quizzes_taken END,
      updated_at = CURRENT_TIMESTAMP
    WHERE user_id = $6
    `,
    [
      newStreak,
      today,
      newTotalXp,
      newLevel,
      activityType,
      userId,
    ]
  );
}



