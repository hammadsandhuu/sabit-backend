const submissions = [];

function addSubmission(data) {
  const submission = {
    id: Date.now(),
    ...data,
    createdAt: new Date(),
  };
  submissions.push(submission);
  return submission;
}

function getAllSubmissions() {
  return submissions;
}

function getSubmissionById(id) {
  return submissions.find((s) => s.id === Number.parseInt(id));
}

module.exports = {
  addSubmission,
  getAllSubmissions,
  getSubmissionById,
};
