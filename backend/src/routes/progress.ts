import { Router } from "express";
import {
  completeSubtopic,
  getLessonProgress,
  recordQuizAttempt,
  getUserStats,
} from "../controllers/progressController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.post("/complete-subtopic", authenticate, completeSubtopic);
router.get("/lesson-progress", authenticate, getLessonProgress);
router.post("/quiz-attempt", authenticate, recordQuizAttempt);
router.get("/stats", authenticate, getUserStats);

export default router;

