import * as repository from "../repository/community.js"

export const noticeAll = async (req, res, next) => {
    try {
        const { tab } = req.query
        const items = await repository.noticeAll(tab)
        res.json(items)
    } catch (error) {
        console.log(error);
    }
}

export const eventAll = async (req, res, next) => {
    try {
        const items = await repository.eventAll();
        res.json(items)
    } catch (error) {
        console.log(error);
    }
}

export const qnaAll = async (req, res, next) => {
    try {
        const items = await repository.qnaAll()
        res.json(items)
    } catch (error) {
        console.log(error);
    }
}

export const qnaCreate = async (req, res, next) => {
    try {
        const { userId, title, content } = req.body
        await repository.qnaCreate(userId, title, content)
        res.json({ message: "질문이 등록되었습니다." })
    } catch (error) {
        console.log(error);
    }
}

export const qnaAnswer = async (req, res, next) => {
    try {
        const { id } = req.params
        const { answer } = req.body
        await repository.qnaAnswer(id, answer)
        res.json({ message: "답변이 등록되었습니다." })
    } catch (error) {
        console.log(error);
    }
}
