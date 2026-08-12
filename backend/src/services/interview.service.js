const interviews = new Map();

const interviewQuestions = {
  technical: [
    "Tell me about yourself and your technical background.",
    "Can you explain the difference between let, const, and var in JavaScript?",
    "What is the difference between SQL and NoSQL databases?",
    "Can you explain what an API is and how REST APIs work?",
    "Tell me about a technical project you have worked on.",
  ],

  behavioral: [
    "Tell me about yourself.",
    "Tell me about a challenging situation you faced and how you handled it.",
    "Describe a time when you had to learn something quickly.",
    "How do you handle working under pressure?",
    "Tell me about a mistake you made and what you learned from it.",
  ],

  mixed: [
    "Tell me about yourself and your technical background.",
    "Tell me about a project you are most proud of.",
    "What was the biggest technical challenge in that project?",
    "How do you approach debugging a difficult problem?",
    "Where do you see yourself professionally in the next few years?",
  ],
};


// Create a new interview
const createInterview = ({
  role = "Software Developer",
  interviewType = "technical",
  difficulty = "intermediate",
  duration = 20,
}) => {
  const interviewId = `interview-${Date.now()}`;

  const type = interviewType.toLowerCase();

  const questions =
    interviewQuestions[type] || interviewQuestions.technical;

  const interview = {
    interviewId,
    role,
    interviewType: type,
    difficulty,
    duration,

    status: "active",

    currentQuestionIndex: 0,

    questions,

    responses: [],

    startedAt: new Date(),

    completedAt: null,
  };

  interviews.set(interviewId, interview);

  return {
    interviewId,
    role,
    interviewType: type,
    difficulty,
    duration,
    status: interview.status,
    question: questions[0],
    questionNumber: 1,
    totalQuestions: questions.length,
  };
};


// Get interview
const getInterview = (interviewId) => {
  return interviews.get(interviewId);
};


// Submit candidate response
const processResponse = (interviewId, answer) => {
  const interview = interviews.get(interviewId);

  if (!interview) {
    throw new Error("Interview not found");
  }

  if (interview.status !== "active") {
    throw new Error("Interview is no longer active");
  }

  if (!answer || !answer.trim()) {
    throw new Error("Answer cannot be empty");
  }

  const currentQuestion =
    interview.questions[interview.currentQuestionIndex];

  interview.responses.push({
    question: currentQuestion,
    answer: answer.trim(),
    timestamp: new Date(),
  });

  interview.currentQuestionIndex++;

  const hasMoreQuestions =
    interview.currentQuestionIndex < interview.questions.length;

  if (!hasMoreQuestions) {
    return {
      completed: true,
      message: "All interview questions completed",
    };
  }

  const nextQuestion =
    interview.questions[interview.currentQuestionIndex];

  return {
    completed: false,
    question: nextQuestion,
    questionNumber: interview.currentQuestionIndex + 1,
    totalQuestions: interview.questions.length,
  };
};


// Complete interview
const completeInterview = (interviewId) => {
  const interview = interviews.get(interviewId);

  if (!interview) {
    throw new Error("Interview not found");
  }

  interview.status = "completed";
  interview.completedAt = new Date();

  return {
    interviewId: interview.interviewId,
    status: interview.status,
    totalQuestions: interview.questions.length,
    answeredQuestions: interview.responses.length,
    startedAt: interview.startedAt,
    completedAt: interview.completedAt,
  };
};


// Get interview result
const getInterviewResult = (interviewId) => {
  const interview = interviews.get(interviewId);

  if (!interview) {
    throw new Error("Interview not found");
  }

  return {
    interviewId: interview.interviewId,
    role: interview.role,
    interviewType: interview.interviewType,
    difficulty: interview.difficulty,
    status: interview.status,
    responses: interview.responses,
    totalQuestions: interview.questions.length,
    answeredQuestions: interview.responses.length,
  };
};


module.exports = {
  createInterview,
  getInterview,
  processResponse,
  completeInterview,
  getInterviewResult,
};