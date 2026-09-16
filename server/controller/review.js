import * as repository from '../repository/review.js';

/** 리뷰 목록 + 요약 조회 */
export const getReviews = async (req, res, next) => {
    try {
        const { pid } = req.params;
        const [reviews, summary] = await Promise.all([
            repository.getReviews(pid),
            repository.getReviewSummary(pid),
        ]);
        res.json({ reviews, summary });
    } catch (err) {
        next(err);
    }
};

/** 리뷰 작성 */
export const createReview = async (req, res, next) => {
    try {
        const { pid, uid, content, rating } = req.body;

        if (!pid || !uid || !content) {
            return res.status(400).json({ message: '필수 항목을 입력해주세요.' });
        }
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: '별점은 1~5점 사이로 입력해주세요.' });
        }

        await repository.createReview({ pid, uid, content, rating });
        res.status(201).json({ message: '리뷰가 등록되었습니다.' });
    } catch (err) {
        next(err);
    }
};
