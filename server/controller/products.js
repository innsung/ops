import * as repository from '../repository/products.js';

/** 전체 상품 조회 */
export const getAll = async (req, res, next) => {
    try {
        const products = await repository.getAll();
        res.json(products);
    } catch (err) {
        next(err);
    }
};

/** 상품 상세 조회 */
export const getProduct = async (req, res, next) => {
    try {
        const product = await repository.getProduct(req.params.pid);
        if (!product) return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
        res.json(product);
    } catch (err) {
        next(err);
    }
};

/** 상품 QnA 조회 */
export const getQna = async (req, res, next) => {
    try {
        const qna = await repository.getQna(req.params.pid);
        res.json(qna);
    } catch (err) {
        next(err);
    }
};
