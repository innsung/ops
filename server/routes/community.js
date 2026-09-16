import express from "express"
import * as controller from "../controller/community.js"

const router = express.Router()

router.get("/event", controller.eventAll)
router.get("/notice", controller.noticeAll)
router.get("/qna", controller.qnaAll)
router.post("/qna", controller.qnaCreate)
router.post("/qna/:id/answer", controller.qnaAnswer)

export default router;
