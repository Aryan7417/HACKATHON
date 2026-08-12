const {
    createInterview,
    processResponse,
    completeInterview,
    getInterviewResult,
} = require("../services/interview.service");



const startInterview = async (req, res) => {
    try {
        const { role, interviewType, difficulty, duration } = req.body;

        const interview = createInterview({
            role,
            interviewType,
            difficulty,
            duration,
        });

        return res.status(201).json({
            success: true,
            message: "Interview started successfully",
            data: interview,
        });


        // const interview = {
        //     interviewId: `interview-${Date.now()}`,
        //     role: role || "Software Developer",
        //     interviewType: interviewType || "Technical",
        //     difficulty: difficulty || "Intermediate",
        //     duration: duration || 20,
        //     status: "started",
        //     currentQuestion: "Tell me about yourself.",
        // };

        // return res.status(201).json({
        //     success: true,
        //     message: "Interview started successfully",
        //     data: interview,
        // });
    } catch (error) {
        console.error("Start Interview Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to start interview",
        });
    }
};

const submitResponse = async (req, res) => {
    try {


        const result = processResponse(interviewId, answer);

        return res.status(200).json({
            success: true,
            message: "Response processed successfully",
            data: result,
        });


        const { interviewId, answer } = req.body;

        if (!interviewId) {
            return res.status(400).json({
                success: false,
                message: "Interview ID is required",
            });
        }

        if (!answer) {
            return res.status(400).json({
                success: false,
                message: "Answer is required",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Response received successfully",
            data: {
                interviewId,
                answer,
                nextQuestion:
                    "Can you explain one technical project that you have worked on?",
            },
        });
    } catch (error) {
        console.error("Submit Response Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to process response",
        });
    }
};

const endInterview = async (req, res) => {
    try {



        const result = completeInterview(interviewId);

        return res.status(200).json({
            success: true,
            message: "Interview completed successfully",
            data: result,
        });


        const { interviewId } = req.body;

        if (!interviewId) {
            return res.status(400).json({
                success: false,
                message: "Interview ID is required",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Interview completed successfully",
            data: {
                interviewId,
                status: "completed",
            },
        });
    } catch (error) {
        console.error("End Interview Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to end interview",
        });
    }
};

module.exports = {
    startInterview,
    submitResponse,
    endInterview,
};