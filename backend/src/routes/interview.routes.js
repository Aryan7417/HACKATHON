// const express = require("express");

// const router = express.Router();

// // Start a new interview

// router.post("/start", (req, res) => {
//   res.json({
//     success: true,

//     message: "Interview started successfully",

//     interviewId: "demo-interview-001",

//     question: "Tell me about yourself.",
//   });
// });




// //------ Submit candidate response


// router.post("/respond", (req, res) => {
//   const { interviewId, answer } = req.body;

//   res.json({

//     success: true,

//     message: "Response received",


//     interviewId,
//     answer,
//     nextQuestion:
//       "Can you explain one technical project that you have worked on?",
//   });
// });

// // End interview



// router.post("/end", (req, res) => {
//   const { interviewId } = req.body;

//   res.json({
//     success: true,
//     message: "Interview completed",
//     interviewId,
//   });
// });

// module.exports = router;\




const express = require("express");

const {
  startInterview,
  submitResponse,
  endInterview,
} = require("../controllers/interview.controller");

const router = express.Router();

router.post("/start", startInterview);
router.post("/respond", submitResponse);
router.post("/end", endInterview);

module.exports = router;